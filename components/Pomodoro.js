import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

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
    const [minutes, setMinutes] = useState(25)
    const [interval, setInterval] = useState(1)
    const [key, setKey] = useState(0)

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
    }

    return (
        <View style={styles.container}>
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
                            </>
                        )
                    }}
                </CountdownCircleTimer>
            </View>

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
                <View style={{
                    marginTop: (Dimensions.get('window').width * 0.15),
                    marginBottom: 30,
                }}>
                    <RoundButton
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
        paddingTop: (Dimensions.get('window').width * 0.10),
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
        marginTop: (Dimensions.get('window').width * 0.15),
        marginBottom: 30,
    },
    startButton: {
        width: 100,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: (Dimensions.get('window').width * 0.15),
        marginBottom: 30,
    },
    startTitle: {
        fontSize: 20,
    },
    countdownTimer : {
        marginTop : -(Dimensions.get('window').height * 0.1),
    },
    text: {
        fontSize: 18,
    },
})