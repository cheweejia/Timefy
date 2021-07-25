import React, { Component, useState, useEffect } from 'react'
import { Animated, StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, Button } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
//import ToggleSwitch from 'toggle-switch-react-native'
import Pomodoro from "./Pomodoro"
import { Audio } from 'expo-av'
import Modal from 'react-native-modal'

const numOfHours = [...Array(24).keys()]
const minSec = [...Array(60).keys()]

function InputDuration({ values }) {
  return (
    <FlatList
      style={{ flexGrow: 0 }}
      keyExtractor={(item) => item.toString()}
      data={values}
      bounces={false}
      showsVerticalScrollIndicator={false}
      snapToInterval={50}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingTop: 25,
        paddingBottom: 25,
      }}
      renderItem={({ item, index }) => {
        return (
          <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.text]}>{item}</Text>
          </View>
        )
      }}
    />
  )
}

function Unit({ title, children }) {
  return (
    <View>
      <Text style={styles.unit}>{title}</Text>
      {children}
    </View>
  )
}

function UnitRow({ children }) {
  return (
    <View style={styles.unitRow}>{children}</View>
  )
}

function RoundButton({ title, color, background, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: background }]}
    >
      <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
    </TouchableOpacity>
  )
}

function PomodoroMode({ title, color, background, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pomodoro, { backgroundColor: background }]}
    >
      <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
    </TouchableOpacity>
  )
}

function ButtonsRow({ children }) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}

export default function Timer() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [start, setStart] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pomodoro, setPomodoro] = useState(false)
  const [timesUp, setTimesUp] = useState(false)

//  constructor(props) {
//    super(props)
//    this.state = {
//      hours: 0,
//      minutes: 0,
//      seconds: 0,
//      start: false,
//      isPlaying: false,
//      pomodoro: false,
//      timesUp: false,
//    }
//  }

  const startTimer = () => {
    if (hours != 0 || minutes != 0 || seconds != 0) {
      setStart(true)
      setIsPlaying(true)
    }
  }

  const pause = () => {
    setIsPlaying(false)
  }

  const resume = () => {
    setIsPlaying(true)
  }

  const reset = () => {
    setHours(0)
    setMinutes(0)
    setSeconds(0)
    setStart(false)
    setIsPlaying(false)
    setTimesUp(false)
  }

  /** Sound Management **/
  useEffect(() => {
      try {
          Audio.setAudioModeAsync({
              allowRecordingIOS: false,
              interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
              playsInSilentModeIOS: true,
              interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
              shouldDuckAndroid: true,
              staysActiveInBackground: true,
              playThroughEarpieceAndroid: false
          });

          loadAudio();
      } catch (e) {
          console.log(e);
      }
  }, [])

  const [currentItem, setCurrentItem] = useState(0);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackInstance, setPlayBackInstance] = useState(null);

  const loadAudio = async () => {
      try {
          const sound = new Audio.Sound();

          //playbackInstance.createAsync(require('./Sound/1.mp3'), status);

          const status = {
              shouldPlay: isAlarmPlaying,
              volume
          }

          sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(status))
          await sound.loadAsync(require('./Sound/11.mp3'), status, true)

          setPlayBackInstance(sound);

          console.log("loaded")
      } catch (e) {
          console.log(e);
      }
  }

  const onPlaybackStatusUpdate = (status) => {
      const newStatus = status.isBuffering;
      setIsBuffering(newStatus);
  }

  const toggleAlarmSound = async () => {
      isAlarmPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

      setIsAlarmPlaying(!isAlarmPlaying);
  }

  const stopAlarmSound = async () => {
    try {
        console.log('stop alarm sound')
        await playbackInstance.stopAsync()
        setIsAlarmPlaying(false);
    } catch(e) {
        console.log(e)
    }
  }

  const playAlarmSound = async () => {
      console.log('playing alarm sound')
      await playbackInstance.playAsync()
      setIsAlarmPlaying(true);
  }

  const dismissAlarmSound = async () => {
      playbackInstance.unloadAsync();
  }

  const handleTimesUp = () => {
    setTimesUp(true)
    playAlarmSound()
  }

  const dismiss = () => {
    stopAlarmSound()
    reset()
  }

    return (
      <View style={styles.container}>
        { !start && (
            <PomodoroMode
              title='Pomodoro'
              color='white'
              background={pomodoro ? 'tomato' : '#CFCFCF'}
              onPress={() => setPomodoro(!pomodoro)}
            />
        )}

        { timesUp && (
            <Modal
                isVisible={timesUp}
                onRequestClose={() => dismiss()}
                animationIn='fadeIn'
                animationOut='fadeOut'
                swipeDirection='right'
                style={{ flex: 1, }}
                onSwipeComplete={() => dismiss()}
                hideModalContentWhileAnimating={true}
            >
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                        style={{borderRadius: 10, height: 50, width: 150, backgroundColor: '#cfcfcf', alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => dismiss()}
                    >
                        <Text style={{fontSize: 20, }}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )}

        { !start && !isPlaying && !pomodoro && (
          <View style={{ alignItems: 'center' }}>
            <UnitRow>
              <Unit title='Hours'>
                <FlatList
                  style={{ flexGrow: 0 }}
                  keyExtractor={(item) => item.toString()}
                  data={numOfHours}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  contentContainerStyle={{
                    paddingTop: 25,
                    paddingBottom: 25,
                  }}
                  onMomentumScrollEnd={ev => {
                    const index = Math.round(ev.nativeEvent.contentOffset.y / 50)
                    setHours(numOfHours[index])
                  }}
                  renderItem={({ item, index }) => {
                    const pad = (n) => n < 10 ? '0' + n : n
                    return (
                      <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.text]}>{pad(item)}</Text>
                      </View>
                    )
                  }}
                />
              </Unit>
              <Unit title='Minutes'>
                <FlatList
                  style={{ flexGrow: 0 }}
                  keyExtractor={(item) => item.toString()}
                  data={minSec}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  contentContainerStyle={{
                    paddingTop: 25,
                    paddingBottom: 25,
                  }}
                  onMomentumScrollEnd={ev => {
                    const index = Math.round(ev.nativeEvent.contentOffset.y / 50)
                      setMinutes(minSec[index])
                  }}
                  renderItem={({ item, index }) => {
                    const pad = (n) => n < 10 ? '0' + n : n
                    return (
                      <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.text]}>{pad(item)}</Text>
                      </View>
                    )
                  }}
                />
              </Unit>
              <Unit title='Seconds'>
                <FlatList
                  style={{ flexGrow: 0 }}
                  keyExtractor={(item) => item.toString()}
                  data={minSec}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  contentContainerStyle={{
                    paddingTop: 25,
                    paddingBottom: 25,
                  }}
                  onMomentumScrollEnd={ev => {
                    const index = Math.round(ev.nativeEvent.contentOffset.y / 50)
                    setSeconds(minSec[index])
                  }}
                  renderItem={({ item, index }) => {
                    const pad = (n) => n < 10 ? '0' + n : n
                    return (
                      <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.text]}>{pad(item)}</Text>
                      </View>
                    )
                  }}
                />
              </Unit>
            </UnitRow>
            <RoundButton
              title='Start'
              color='#50D167'
              background='#1B361F'
              onPress={() => startTimer()} />
          </View>
        )}

        { start && (
          <View style = {styles.countdownTimer}>
            <CountdownCircleTimer
              isPlaying={isPlaying}
              duration={hours * 3600 + minutes * 60 + seconds}
              colors={[
                ['#004777', 0.4],
                ['#F7B801', 0.4],
                ['#A30000', 0.2],
              ]}
              size={Dimensions.get('window').width * 0.9}
              onComplete={() => handleTimesUp()}
            >
              {({ remainingTime, animatedColor }) => {
                const pad = (n) => n < 10 ? '0' + n : n
                const hours = Math.floor(remainingTime / 3600)
                const minutes = Math.floor((remainingTime % 3600) / 60)
                const seconds = remainingTime % 60
                return (
                  <Animated.Text style={{ color: animatedColor, fontSize: 40 }}>
                    {pad(hours)}:{pad(minutes)}:{pad(seconds)}
                  </Animated.Text>
                )
              }}
            </CountdownCircleTimer>
          </View>
        )}

          { start && isPlaying && (
            <ButtonsRow>
              <RoundButton
                title='Pause'
                color='#E33935'
                background='#3C1715'
                onPress={() => pause()} />
              <RoundButton
                title='Reset'
                color='#FFFFFF'
                background='#3D3D3D'
                onPress={() => reset()} />
            </ButtonsRow>
          )}

          { start && !isPlaying && (
            <ButtonsRow>
              <RoundButton
                title='Resume'
                color='#50D167'
                background='#1B361F'
                onPress={() => resume()} />
              <RoundButton
                title='Reset'
                color='#FFFFFF'
                background='#3D3D3D'
                onPress={() => reset()} />
            </ButtonsRow>
          )}

          { pomodoro && (
            <Pomodoro/>
          )}
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: (Dimensions.get('window').height * 0.10),
    paddingHorizontal: 20,
  },
  duration: {
    color: '#000000',
    fontSize: 60,
    paddingTop: 50,
    textAlign: 'center',
  },
  unit: {
    width: 70,
    color: '#000000',
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  unitRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 80,
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    height: 140,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: (Dimensions.get('window').height * 0.15),
    marginBottom: 30,
  },
  text: {
    color: '#000000',
    fontSize: 50,
    textAlign: 'center',
  },
  countdownTimer : {
    marginTop : Dimensions.get('window').height * 0.1
  },
  pomodoro: {
    width: 180,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button2: {
      width: 0.7 * Dimensions.get('window').width,
      flexDirection: "row",
      backgroundColor: '#FFFFFF',
      justifyContent: 'flex-end',
      alignContent: 'center',
  },
})