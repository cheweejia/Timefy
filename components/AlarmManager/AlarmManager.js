// issue with handlenewalarm line 50 (sleep calculator)>> cannot update component 
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { getTime, getDate, compareTime } from "../TimeTools";
import { addAlarm, deleteAlarm, toggleAlarm, resetAllAlarm } from "../AlarmManagementTools";
import TimeWheel from './TimeWheel';
import AlarmSetting from '../AlarmSetting/AlarmSetting';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SleepCalculator from './SleepCalculator/SleepCalculator';
import { Switch } from 'react-native-paper';




function AlarmManager(props) {

    const { listOfAlarm, setListOfAlarm, timeWheelVisible, setTimeWheelVisible,
        quickSetAlarmTime, setQuickSetAlarmTime } = props;

    ////////////////////////////////////////////////////////////////////
    // TIMEPICKER MANGMENENT 
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.warn("Alarmed set at", getTime(date));
        handleNewAlarm(getTime(date), getDate(date));
        hideDatePicker();
    };

    /////////////////////////////////////////////////////////////
    // ALARM MANAGEMENT 
    const handleNewAlarm = (newAlarmTime, newAlarmDate) => {
        setListOfAlarm(addAlarm(newAlarmTime, newAlarmDate, listOfAlarm))
        return true;
    }

    const handleToggleAlarm = (alarm, index) => {
        setListOfAlarm(toggleAlarm(alarm, index, listOfAlarm));
    }


    const clearAllAlarm = () => {
        setListOfAlarm(resetAllAlarm());
    }

    const showAllAlarm = (listOfAlarm) => {
        return (
            listOfAlarm.map((alarm, index) => (

                <View key={index} style={styles.checkbox} >
                    <TouchableOpacity style={styles.alarmtext2}
                        onPress={() => openAlarmSettings(index, alarm)
                        }>
                        <Text style={styles.alarmtext3}>
                            {alarm.time + ", " + alarm.date}

                        </Text>
                    </TouchableOpacity>
                    <Switch
                        key={index}
                        color='pink'
                        value={alarm.isOn}
                        onValueChange={
                            () => handleToggleAlarm(alarm, index)
                        }
                    />


                </View>


            ))
        );
    }

    /////////////////////////////////////////////////////////////////
    //Alarm Setting 

    const [alarmSettingVisible, setAlarmSettingVisible] = useState(false);
    const [alarmObj, setAlarmObj] = useState();
    const [alarmIndex, setAlarmIndex] = useState();
    const openAlarmSettings = (index, alarm) => {
        setAlarmSettingVisible(true);
        setAlarmIndex(index)
        setAlarmObj(alarm)
    }

    //////////////////////////////////////////////////////////////
    // SleepCalculator props

    const [sleepCalculatorPressed, setSleepCalculatorPressed] = useState();

    const resetSleepCalculatorPress = () => {
        setSleepCalculatorPressed(false);
        return true;
    }

    useEffect(() => {
        sleepCalculatorPressed
            && ((handleNewAlarm(quickSetAlarmTime,
                (compareTime(getTime(new Date()), quickSetAlarmTime) > 0)
                    ? getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
                    : getDate(new Date()))) &&
                resetSleepCalculatorPress())
    }, [sleepCalculatorPressed]);


    ///////////////////////////////////////////////////////////////

    return (
        <>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                value={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                style={styles.clock}
            />

            <View style={styles.button}>
                <Button
                    color="blue"
                    title="Set"
                    type="outline"
                    fontSize="20"
                    onPress={() => {
                        timeWheelVisible
                            ? handleNewAlarm(quickSetAlarmTime,
                                (compareTime(getTime(new Date()), quickSetAlarmTime) > 0)
                                    ? getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
                                    : getDate(new Date()))
                            : showDatePicker()
                    }}
                />

                <SleepCalculator
                    timeWheelVisible={timeWheelVisible}
                    quickSetAlarmTime={quickSetAlarmTime}
                    setQuickSetAlarmTime={setQuickSetAlarmTime}
                    sleepCalculatorPressed={sleepCalculatorPressed}
                    setSleepCalculatorPressed={setSleepCalculatorPressed}
                />

                {
                    !timeWheelVisible
                        ? <Button
                            color="blue"
                            title="Clear All "
                            type="outline"
                            fontSize="20"
                            onPress={() => {
                                clearAllAlarm();
                            }}
                        />
                        : <Button
                            color="blue"
                            title="Go Back"
                            type="outline"
                            fontSize="20"
                            onPress={() => {
                                setTimeWheelVisible(false);
                            }}
                        />
                }



            </View>

            <ScrollView style={styles.top}>
                <Text style={styles.alarmtext1}>
                    {
                        (listOfAlarm.length > 0)
                            ? showAllAlarm(listOfAlarm)
                            : <Text style={styles.alarmtext1}>No alarm</Text>
                    }
                </Text>
            </ScrollView>

            <AlarmSetting
                        alarmIndex={alarmIndex}
                        alarmObj={alarmObj}
                        setAlarmIndex={setAlarmIndex}
                        alarmSettingVisible={alarmSettingVisible}
                        setAlarmSettingVisible={setAlarmSettingVisible}
                        listOfAlarm={listOfAlarm}
                        setListOfAlarm={setListOfAlarm}
                    />




        </>
    );
}

const styles = StyleSheet.create({
    alarmtext1: {
        padding: 20,
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'black',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,


    },
    alarmtext3: {
        fontSize: 20,
        padding: 10
    },
    alarmtext2: {
        padding: 10,
        fontSize: 30,
        backgroundColor: 'lightpink',
        borderWidth: 3,
        borderColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    button: {
        width: Dimensions.get('window').width,
        flex: 0.2,
        flexDirection: "row",
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-around',
        alignContent: 'center',
    },
    alarm: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    clock: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    top: {
        flex: 0.3,
        padding: 10,
        alignSelf: 'stretch'

    },
    checkbox: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        padding: 10,
        paddingLeft: 20.
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
});

export default AlarmManager;