import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Audio } from 'expo-av'
import Modal from 'react-native-modal'

function StartButton({ title, color, background, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.startButton, { backgroundColor: background }]}
        >
            <Text style={[styles.startTitle, { color }]}>{title}</Text>
        </TouchableOpacity>
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

function ButtonsRow({ children }) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}

export default function Pomodoro() {
    const [start, setStart] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isBreak, setIsBreak] = useState(false)
    const [timesUp, setTimesUp] = useState(false)
    const [minutes, setMinutes] = useState(25)
    const [interval, setInterval] = useState(1)
    const [key, setKey] = useState(0)
    const [help, setHelp] = useState(false)

    /** Alarm Management **/
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

    const proceed = () => {
        setStart(true)
        setIsPlaying(true)
    }

    const pause = () => {
        setIsPlaying(false)
    }

    const resume = () => {
        setIsPlaying(true)
    }

    const stop = () => {
        setStart(false)
        setIsPlaying(false)
        setIsBreak(false)
        setMinutes(25)
        setInterval(1)
        setKey(prevKey => prevKey + 1)
        setTimesUp(false)
    }

    const handleTimesUp = () => {
        setTimesUp(true)
        playAlarmSound()
      }

      const dismiss = () => {
        stopAlarmSound()
        setTimesUp(false)
      }

    return (
        <View style={styles.container}>
            <Modal
                isVisible={help}
                onRequestClose={() => setHelp(false)}
                animationIn='fadeIn'
                animationOut='fadeOut'
                swipeDirection={['right','left','down']}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
                onSwipeComplete={() => setHelp(false)}
                hideModalContentWhileAnimating={true}
                backdropColor='#cfcfcf'
            >
                <View
                    style={{padding: 10, backgroundColor: '#ffffff', borderRadius: 5, }}
                >
                    <Text
                        style={{fontSize: 15, backgroundColor: "#ffffff", textAlign: 'center'}}
                    >
                        The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
                        The technique uses a timer to break down work into intervals, traditionally 25 minutes in length,
                        separated by short breaks, usually 5 minutes in length. The Pomodoro Technique helps you resist
                        distractions and re-train your brains to focus. Each pomodoro is dedicated to one
                        task and each break is a chance to reset and bring your attention back to what you should be
                        working on.
                    </Text>
                </View>
            </Modal>
            <View style={styles.countdownTimer}>
                <CountdownCircleTimer
                    key={key}
                    isPlaying={isPlaying}
                    duration={minutes * 60}
                    colors={ isBreak
                        ? [['#87CEFA', 1]]
                        : [['#FF6347', 1]]
                    }
                    size={Dimensions.get('window').width * 0.9}
                    onComplete={() => {
                        if (!isBreak) {
                            setIsBreak(!isBreak)
                            interval % 4 == 0 ? setMinutes(15) : setMinutes(5)
                            setInterval(interval + 1)
                        } else {
                            setIsBreak(!isBreak)
                            setMinutes(25)
                        }
                        setKey(prevKey => prevKey + 1)
                        handleTimesUp()
                    }}
                >
                    {({ remainingTime, animatedColor }) => {
                        const pad = (n) => n < 10 ? '0' + n : n
                        const minutes = Math.floor((remainingTime % 3600) / 60)
                        const seconds = remainingTime % 60
                        return (
                            <>
                                { isBreak && (
                                    <Text style={styles.text}>Rest time!</Text>
                                )}
                                { !isBreak && (
                                    <Text style={styles.text}>Time to focus!</Text>
                                )}
                                <Animated.Text style={{ color: animatedColor, fontSize: 40 }}>
                                    {pad(minutes)}:{pad(seconds)}
                                </Animated.Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        setHelp(true)
                                    }
                                    style={styles.help}
                                >
                                    <Text style={{color: '#ffffff'}}>
                                        ?
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )
                    }}
                </CountdownCircleTimer>
            </View>

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

            { !start && !isPlaying && (
                <View>
                    <StartButton
                        title='Start'
                        color='white'
                        background='tomato'
                        onPress={proceed} />
                </View>
            )}

            { start && isPlaying && (
                <View>
                    <StartButton
                        title='Pause'
                        color='white' /*'#E33935'*/
                        background='#3D3D3D' /*'#3C1715'*/
                        onPress={pause} />
                </View>
            )}

            { start && !isPlaying && (
                <ButtonsRow>
                    <RoundButton
                        title='Resume'
                        color='white'
                        background='tomato'
                        onPress={resume} />
                    <RoundButton
                        title='Stop'
                        color='#FFFFFF'
                        background='#3D3D3D'
                        onPress={stop} />
                </ButtonsRow>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Dimensions.get('window').height * 0.10),
        paddingHorizontal: 20,
    },
    button: {
        width: 100,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        fontSize: 18,
        textAlign: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginTop: (Dimensions.get('window').height * 0.1),
        marginBottom: 30,
    },
    startButton: {
        width: 100,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: (Dimensions.get('window').height * 0.1),
        marginBottom: 30,
    },
    startTitle: {
        fontSize: 20,
    },
    countdownTimer : {
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 18,
    },
    help: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: 'rgba(207,207,207,0.7)',
        borderRadius: 15,
    },
})