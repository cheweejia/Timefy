import React, { Component, useState } from 'react'
import { Animated, StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

const DATA = {
  hours: 12,
  minutes: 34,
  seconds: 56,
}

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

function ButtonsRow({ children }) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      start: false,
      isPlaying: false,
    }
  }
  //
  //  componentWillUnmount() {
  //    clearInterval(this.myInterval)
  //  }

  start = () => {
    this.setState({
      start: true,
      isPlaying: true,
    })
  }

  pause = () => {
    this.setState({
      isPlaying: false,
    })
  }

  resume = () => {
    this.setState({
      isPlaying: true,
    })
  }

  reset = () => {
    this.setState({
      hours: 0,
      minutes: 0,
      seconds: 0,
      start: false,
      isPlaying: false,
    })
  }

  render() {
    const { start, isPlaying, hours, minutes, seconds } = this.state
    return (
      <View style={styles.container}>
        { !start && !isPlaying && (
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
                    this.setState({
                      hours: numOfHours[index]
                    })
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
                    this.setState({
                      minutes: minSec[index]
                    })
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
                    this.setState({
                      seconds: minSec[index]
                    })
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
              onPress={this.start} />
          </View>
        )}


        { start && (
          <View style = {styles.countdowntimer}>
            <CountdownCircleTimer
              isPlaying={isPlaying}
              duration={hours * 3600 + minutes * 60 + seconds}
              colors={[
                ['#004777', 0.4],
                ['#F7B801', 0.4],
                ['#A30000', 0.2],
              ]}
              size={Dimensions.get('window').width * 0.9}
              onComplete={this.reset}
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

          {start && isPlaying && (
            <ButtonsRow>
              <RoundButton
                title='Pause'
                color='#E33935'
                background='#3C1715'
                onPress={this.pause} />
              <RoundButton
                title='Reset'
                color='#FFFFFF'
                background='#3D3D3D'
                onPress={this.reset} />
            </ButtonsRow>
          )}

          {start && !isPlaying && (
            <ButtonsRow>
              <RoundButton
                title='Resume'
                color='#50D167'
                background='#1B361F'
                onPress={this.resume} />
              <RoundButton
                title='Reset'
                color='#FFFFFF'
                background='#3D3D3D'
                onPress={this.reset} />
            </ButtonsRow>
          )}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 130,
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
    marginTop: (Dimensions.get('window').width * 0.15),
    marginBottom: 30,
  },
  text: {
    color: '#000000',
    fontSize: 50,
    textAlign: 'center',
  },
  countdowntimer : {
    marginTop : -(Dimensions.get('window').height * 0.1)
  }
})