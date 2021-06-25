import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'

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

function NumberPad({ zero, one, two, three, four, five, six, seven, eight, nine, negative, check }) {
    return (
        <View style={styles.numberPad}>
            <ButtonsRow>
                <Button onPress={one} title='1' />
                <Button onPress={two} title='2'/>
                <Button onPress={three} title='3'/>
            </ButtonsRow>

            <ButtonsRow>
                <Button onPress={four} title='4'/>
                <Button onPress={five} title='5'/>
                <Button onPress={six} title='6'/>
            </ButtonsRow>

            <ButtonsRow>
                <Button onPress={seven} title='7'/>
                <Button onPress={eight} title='8'/>
                <Button onPress={nine} title='9'/>
            </ButtonsRow>

            <ButtonsRow>
                <Button onPress={negative} title='-'/>
                <Button onPress={zero} title='0'/>
                <TouchableOpacity
                    style={styles.button}
                    onPress={check}
                >
                    <Text style={styles.ok}>OK</Text>
                </TouchableOpacity>
            </ButtonsRow>
        </View>
    )
}

export default function MathGame() {
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
        } else {
            setInput(0)
            setNegative(false)
            setDisplay("")
            setCorrect(false)
            setTimeout(() => setCorrect(null), 1000)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{first} {firstOperator} {sec} {secOperator} {third}</Text>
            <View style={styles.display}>
                { correct == null ?
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
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        paddingTop: 130,
        paddingHorizontal: 20,
        marginTop: 40,
        width: Dimensions.get('window').width,
    },
    text : {
        color: '#FFFFFF',
        fontSize: 60,
        textAlign: 'center',
    },
    ok : {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center',
    },
    button : {
        width: 50,
        height: 60,
        borderRadius: 0,
        justifyContent: 'center',
    },
    buttonsRow : {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        paddingTop: 15,
    },
    numberPad : {
        backgroundColor: '#000000',
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').height * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    display : {
        height: Dimensions.get('window').height * 0.1,
    }
})