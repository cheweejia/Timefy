import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'
import moment from 'moment'


function Timer({ interval, style }) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval)
  const ms = Math.floor(duration.milliseconds() / 10)
  return(
    <SafeAreaView style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())}:</Text>
      <Text style={style}>{pad(ms)}</Text>
    </SafeAreaView>
  )
}

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[ styles.button, { backgroundColor: background }]}
      activeOpacity={disabled ? 1.0 : 0.7}
    >
      <Text style={[ styles.buttonTitle, { color }]}>{title}</Text>
    </TouchableOpacity>
  )
}

function ButtonsRow({ children }) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}

function Lap({ number, interval }) {
  return (
    <View style={styles.lap}>
      <Text style={styles.lapText}>Lap {number}</Text>
      <Timer style={styles.lapTimer} interval={interval} />
    </View>
  )
}

function LapsTable({ laps, timer }) {
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={index == 0 ? timer + lap : lap}
        />
      ))}
    </ScrollView>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      now: 0,
      laps: [],
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  start = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
      laps: [0],
    })
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime()})
    }, 100)
  }

  lap = () => {
    const timestamp = new Date().getTime()
    const { laps, now, start } = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start : timestamp,
      now: timestamp,
    })
  }

  stop = () => {
    clearInterval(this.timer)
    const { laps, now, start } = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [firstLap + now - start, ...other],
      start : 0,
      now: 0,
    })
  }

  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0,
    })
  }

  resume = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
    })
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime()})
    }, 100)
  }

  render () {
    const { now, start, laps } = this.state
    const timer = now - start
    return (
      <View style={styles.container}>
        <Timer interval={laps.reduce((total , curr) => total + curr, 0) + timer} style={styles.timer} />
        {laps.length == 0 && (
        <ButtonsRow>
          <RoundButton
            title='Lap'
            color='#FFFFFF'
            background='#3D3D3D'
            disabled
          />
          <RoundButton
            title='Start'
            color='#50D167'
            background='#1B361F'
            onPress={this.start}
          />
        </ButtonsRow>
        )}
        {start > 0 && (
        <ButtonsRow>
          <RoundButton
            title='Lap'
            color='#FFFFFF'
            background='#3D3D3D'
            onPress={this.lap}
          />
          <RoundButton
            title='Stop'
            color='#E33935'
            background='#3C1715'
            onPress={this.stop}
          />
        </ButtonsRow>
        )}
        {laps.length > 0 && start == 0 && (
          <ButtonsRow>
            <RoundButton
              title='Reset'
              color='#FFFFFF'
              background='#3D3D3D'
              onPress={this.reset}
            />
            <RoundButton
              title='Resume'
              color='#50D167'
              background='#1B361F'
              onPress={this.resume}
            />
          </ButtonsRow>
        )}
        <LapsTable laps={laps} timer={timer} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  timer: {
    color: '#000000',
    fontSize: 76,
    fontWeight: '200',
    width: 115,
    textAlign: 'center',
    backgroundColor:'#FFFFFF'
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
    marginTop: 80,
    marginBottom: 30,
  },
  lapText: {
    color: '#000000',
    fontSize: 18,
  },
  lapTimer: {
    width: 25,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#c1c1c1',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  scrollView: {
    alignSelf: 'stretch',
  },
  timerContainer: {
    flexDirection: 'row',
    backgroundColor: '#c1c1c1',
  }
})