import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import SleepTime from './SleepTime';
import WakeUpTime from './WakeUpTime';

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
                    title='When to wake up ?'
                    type='outline'
                    onPress={() => {
                        toggleWakeUpTime();
                    }}
                />
                : <Button
                    title='When to sleep ?'
                    type='outline'
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

export default SleepCalculator;