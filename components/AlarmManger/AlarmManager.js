import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { getTime, getDate, timeEqual } from "../TimeTools";
import AlarmSetting from './AlarmSetting';
import DateTimePickerModal from "react-native-modal-datetime-picker";



function AlarmManager(props) {

    const { listOfAlarm, setListOfAlarm } = props;

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
        const newAlarmList = [
            ...listOfAlarm,
            {
                time: newAlarmTime,
                date: newAlarmDate,
                isOn: true
            }
        ];
        setListOfAlarm(newAlarmList);
    }

    const showAllAlarm = (listOfAlarm) => {
        return (
            listOfAlarm.map((alarm, index) => (
                <>
                    <View key={index} style={styles.checkbox} >
                        <TouchableOpacity style={styles.alarmtext2}
                            onPress={() => openAlarmSettings(index)
                            }>
                            <Text style={styles.alarmtext3}>
                                {alarm.time + ", " + alarm.date}

                            </Text>
                        </TouchableOpacity>
                        <CheckBox
                            key={index}
                            center='true'
                            onIconPress={() => toggleAlarm(alarm, index)}
                            checked={alarm.isOn}
                            checkedColor='white'
                        />
                    </View>
                </>

            ))
        );
    }

    const toggleAlarm = (alarm, index) => {
        const newToggledAlarmList = [
            ...listOfAlarm.slice(0, index),
            {
                time: alarm.time,
                date: alarm.date,
                isOn: !alarm.isOn
            },
            ...listOfAlarm.slice(index + 1)
        ];
        console.log(newToggledAlarmList);
        setListOfAlarm(newToggledAlarmList);
    }

    const clearAllAlarm = () => {
        setListOfAlarm([]);
    }


    /////////////////////////////////////////////////////////////////
    //Alarm Setting 

    const [alarmSettingVisible, setAlarmSettingVisible] = useState(false);
    const [alarmIndex, setAlarmIndex] = useState();
    const openAlarmSettings = (index) => {
        setAlarmSettingVisible(true);
        setAlarmIndex(index)
    }


    //////////////////////////////////////////////////////////////
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
                    title="Set Alarm"
                    type="solid"
                    fontSize="20"
                    onPress={() => {
                        showDatePicker()
                    }}
                />
                <Button
                    color="blue"
                    title="Clear All Alarm "
                    type="solid"
                    fontSize="20"
                    onPress={() => {
                        clearAllAlarm()
                    }}
                />

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
                alarmIndex = {alarmIndex}
                setAlarmIndex = {setAlarmIndex}
                alarmSettingVisible={alarmSettingVisible}
                setAlarmSettingVisible={setAlarmSettingVisible}
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
        width: 300,
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