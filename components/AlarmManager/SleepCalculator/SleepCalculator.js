import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import SleepTime from './SleepTime';
import WakeUpTime from './WakeUpTime';
import Icon from 'react-native-vector-icons/FontAwesome';

function SleepCalculator(props) {
    const { timeWheelVisible, quickSetAlarmTime, setQuickSetAlarmTime, sleepCalculatorPressed, setSleepCalculatorPressed} = props;

    const [wakeUpTimeVisible, setWakeUpTimeVisible] = useState(false);
    const [sleepTimeVisible, setSleepTimeVisible] = useState(false);

    const toggleWakeUpTime = () => {
        setWakeUpTimeVisible(!wakeUpTimeVisible);
    };
    const toggleSleepTime = () => {
        setSleepTimeVisible(!sleepTimeVisible);
    };

    return (
        <View>
            {!timeWheelVisible
                ? <Button
                    title='When To Sleep?'
                    titleStyle={styles.wakeUp}
                    icon={
                        <Icon name="bed" size={35} color="black" />
                    }
                    iconPosition="top"
                    type="clear"
                    onPress={() => {
                        toggleWakeUpTime();
                    }}
                />
                : <Button
                    title='When To Wake Up?'
                    titleStyle={styles.wakeUp}
                    icon={
                        <Icon name="bed" size={35} color="black" />
                    }
                    iconPosition="top"
                    type="clear"
                    onPress={() => {
                        toggleSleepTime();
                    }}
                />
            }
            <WakeUpTime
                wakeUpTimeVisible={wakeUpTimeVisible}
                setWakeUpTimeVisible={setWakeUpTimeVisible}
                quickSetAlarmTime={quickSetAlarmTime}
                setQuickSetAlarmTime={setQuickSetAlarmTime}
                sleepCalculatorPressed = {sleepCalculatorPressed}
                setSleepCalculatorPressed = {setSleepCalculatorPressed}
            />
            <SleepTime
                sleepTimeVisible={sleepTimeVisible}
                setSleepTimeVisible={setSleepTimeVisible}
                quickSetAlarmTime={quickSetAlarmTime}
                setQuickSetAlarmTime={setQuickSetAlarmTime}
                sleepCalculatorPressed = {sleepCalculatorPressed}
                setSleepCalculatorPressed = {setSleepCalculatorPressed}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    wakeUp: {
        fontSize: 13,
        color: 'black',
    },
})

export default SleepCalculator;