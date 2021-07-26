import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome'

function Button({ onPress, title }) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

function ButtonsRow({ children }) {
    return (
        <View style={styles.buttonsRow}>{children}</View>
    )
}

function NumberPad({ zero, one, two, three, four, five, six, seven, eight, nine, negative, check, clear }) {
    return (
        <View style={styles.numberPad}>
            <ButtonsRow>
                <Button onPress={one} title='1' />
                <Button onPress={two} title='2' />
                <Button onPress={three} title='3' />
            </ButtonsRow>

            <ButtonsRow>
                <Button onPress={four} title='4' />
                <Button onPress={five} title='5' />
                <Button onPress={six} title='6' />
            </ButtonsRow>

            <ButtonsRow>
                <Button onPress={seven} title='7' />
                <Button onPress={eight} title='8' />
                <Button onPress={nine} title='9' />
            </ButtonsRow>

            <ButtonsRow>
                <Button onPress={negative} title='-' />
                <Button onPress={zero} title='0' />
                <TouchableOpacity
                    style={styles.button}
                    onPress={clear}
                >
                    <Text style={styles.del}>DEL</Text>
                </TouchableOpacity>
            </ButtonsRow>

            <View style={{alignItems: 'center', paddingTop: 15, }}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={check}
                >
                    <Text style={styles.ok}>OK</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default function MathGame(props) {
    const {mathGameVisible, setMathGameVisible, mathGameSolved, setMathGameSolved} = props;

    const closeMathGame = () => {
        setMathGameVisible(false);
    }

    const solved = () => {
        setMathGameVisible(false);
        setMathGameSolved(true);
    }

    const OPERATORS = ["+", "-"]
    const randomNumGen = (max) => Math.floor(Math.random() * max) + 1

    const [first, setFirst] = useState(randomNumGen(100))
    const [sec, setSec] = useState(randomNumGen(100))
    const [third, setThird] = useState(randomNumGen(100))
    const [firstOperator, setFirstOperator] = useState(OPERATORS[randomNumGen(2) - 1])
    const [secOperator, setSecOperator] = useState(OPERATORS[randomNumGen(2) - 1])
    const answer = firstOperator == "+" && secOperator == "+"
        ? first + sec + third
        : firstOperator == "+" && secOperator == "-"
            ? first + sec - third
            : firstOperator == "-" && secOperator == "+"
                ? first - sec + third
                : first - sec - third
    const [input, setInput] = useState(0)
    const [negative, setNegative] = useState(false)
    const [display, setDisplay] = useState("")
    const [correct, setCorrect] = useState()

    const setValue = (val) => {
        if (input >= -300 && input <= 300) { // Limit the input to 3 digits
            if (!negative) {
                setInput(prevState => prevState == 0 && val == 0 ? prevState : prevState * 10 + val)
            } else {
                setInput(prevState => prevState == 0 && val == 0 ? prevState : prevState * 10 - val)
            }
            setDisplay(prevState => (prevState == 0 || prevState == "-") && val == 0 ? prevState : prevState + val)
        }
    }

    const negate = () => {
        if (display == "") {
            setNegative(true)
            setDisplay("-")
        }
    }

    const check = () => {
        if (input == answer) {
            setInput(0)
            setNegative(false)
            setCorrect(true)
            solved()
        } else {
            setInput(0)
            setNegative(false)
            setDisplay("")
            setCorrect(false)
            setTimeout(() => setCorrect(null), 1000)
        }
    }

    const clear = () => {
        if (display != "") {
            if (display == "-") {
                setNegative(false)
                setDisplay("")
            } else {
                setInput(prevState => Math.trunc(prevState/10))
                setDisplay(prevState => prevState.slice(0, prevState.length - 1))
            }
        }
    }

    return (
        <View>
            {/* <Modal
                isVisible={mathGameVisible}
                onRequestClose={() =>closeMathGame()}
                animationIn='rubberBand'
                animationOut='fadeOut'
                swipeDirection='right'
                style={{ margin: 30 }}
                onSwipeComplete={() => closeMathGame()}
                hideModalContentWhileAnimating={true}
            //coverScreen = {false}

            > */}

                <View style={styles.container}>
                    <Text style={styles.question}>{first} {firstOperator} {sec} {secOperator} {third}</Text>
                    <View style={styles.display}>
                        {correct == null ?
                            <Text style={styles.text}>{display}</Text>
                            : correct
                                ? <Icon name="check" size={60} color="green" />
                                : <Icon name="times" size={60} color="red" />
                        }
                    </View>
                    <NumberPad
                        zero={() => setValue(0)}
                        one={() => setValue(1)}
                        two={() => setValue(2)}
                        three={() => setValue(3)}
                        four={() => setValue(4)}
                        five={() => setValue(5)}
                        six={() => setValue(6)}
                        seven={() => setValue(7)}
                        eight={() => setValue(8)}
                        nine={() => setValue(9)}
                        negative={() => negate()}
                        check={() => check()}
                        clear={() => clear()}
                    />
                </View>
                {/* <Button 
                onPress = {() => {}}
                title = "Snooze Alarm" /> */}

{/* 
            </Modal> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 0.7,
        backgroundColor: 'transparent',
        alignItems: 'center',
        padding: 40,
        width: 0.6* Dimensions.get('window').width,
    },
    text: {
        color: 'black',
        fontSize: 30,
        textAlign: 'center',
    },
    ok: {
        color: 'black',
        fontSize: 30,
        textAlign: 'center',
        width: 50,
        height: 40,
        justifyContent: 'center',
    },
    del: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
        width: 50,
        height: 40,
        justifyContent: 'center',
    },
    button: {
        width: 50,
        height: 40,
        borderRadius: 0,
        justifyContent: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        paddingTop: 15,
    },
    numberPad: {
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width * 0.6,
        height: Dimensions.get('window').height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    display: {
        height: Dimensions.get('window').height * 0.1,
    },
    question: {
        color: 'black',
        fontSize: 40,
        textAlign: 'center',
        width: Dimensions.get('window').width * 0.7,
    }
})