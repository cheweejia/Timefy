// issue with handlenewalarm line 50 (sleep calculator)>> cannot update component 
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { getTime, getDate, compareTime, isDay2 } from "../TimeTools";
import { addAlarm, deleteAlarm, toggleAlarm, resetAllAlarm, toggleDelete, deleteToggledAlarm } from "../AlarmManagementTools";
import TimeWheel from './TimeWheel';
import AlarmSetting from '../AlarmSetting/AlarmSetting';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SleepCalculator from './SleepCalculator/SleepCalculator';
import { Switch, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

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


                deleteModeVisible ?

                    <View key={index} style={{
                        //backgroundColor: alarm.isDelete ? 'rgba(96, 108, 218, 0.5)' : 'transparent',
                        backgroundColor:'transparent',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: "center",
                        marginBottom: 2,
                        paddingLeft: 20,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                    }}>

                        <Checkbox
                            key={index}
                            color='black'
                            status={alarm.isDelete ? "checked" : "unchecked"}
                            onPress={
                                () => handleToggleDelete(alarm, index)
                            }
                        />

                        <View
                            style={styles.alarmtext2}
                        >
                            <Text style={styles.alarmtext3}>
                                {alarm.time.slice(0, 5)}
                            </Text>
                            <Text style={styles.dateText}>
                                {"Mon" + ", " + alarm.date.slice(0, 6)}
                            </Text>
                        </View>

                    </View>


                    : <View key={index} style={{
                        backgroundColor: isDay2(alarm.time) ? 'rgba(255, 209, 91, 0.3)' : 'rgba(96, 108, 218, 0.3)',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: "center",
                        marginBottom: 2,
                        paddingLeft: 20,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                    }}>
                        <TouchableOpacity
                            style={styles.alarmtext2}
                            onPress={() => openAlarmSettings(index, alarm)}
                            onLongPress={() => setDeleteModeVisible(true)}
                        >
                            <Text style={styles.alarmtext3}>
                                {alarm.time.slice(0, 5)}
                            </Text>
                            <Text style={styles.dateText}>
                                {"Mon" + ", " + alarm.date.slice(0, 6)}
                            </Text>
                        </TouchableOpacity>
                        <Switch
                            key={index}
                            color={isDay2(alarm.time) ? 'rgba(255, 215, 154, 1.0)' : 'rgba(132, 151, 243, 1.0)'}
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
    //Delete management 

    const [deleteModeVisible, setDeleteModeVisible] = useState(false);

    const handleToggleDelete = (alarm, index) => {
        setListOfAlarm(toggleDelete(alarm, index, listOfAlarm));
    }

    const handleDelete = () => {
        setListOfAlarm(deleteToggledAlarm(listOfAlarm));
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
                display="spinner"
                value={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                style={styles.clock}
            />

            <View style={styles.button}>


                {deleteModeVisible
                    ? <Button
                        title="Delete"
                        titleStyle={styles.set}
                        icon={
                            <Icon name="trash" size={35} color="black" />
                        }
                        iconPosition="top"
                        type="clear"
                        onPress={() => {
                            handleDelete();
                            setDeleteModeVisible(false);
                        }}
                    />
                    : <Button
                        title="Set"
                        titleStyle={styles.set}
                        icon={
                            <Icon name="plus" size={35} color="black" />
                        }
                        iconPosition="top"
                        type="clear"
                        onPress={() => {
                            timeWheelVisible
                                ? handleNewAlarm(quickSetAlarmTime,
                                    (compareTime(getTime(new Date()), quickSetAlarmTime) > 0)
                                        ? getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
                                        : getDate(new Date()))
                                : showDatePicker()
                        }}
                    />
                }

                {deleteModeVisible

                    ? <Button
                        title="Delete All"
                        titleStyle={styles.set}
                        icon={
                            <Icon name="trash" size={35} color="black" />
                        }
                        iconPosition="top"
                        type="clear"
                        onPress={() => {
                            clearAllAlarm();
                            setDeleteModeVisible(false);

                        }}
                    />

                    : <SleepCalculator
                        timeWheelVisible={timeWheelVisible}
                        quickSetAlarmTime={quickSetAlarmTime}
                        setQuickSetAlarmTime={setQuickSetAlarmTime}
                        sleepCalculatorPressed={sleepCalculatorPressed}
                        setSleepCalculatorPressed={setSleepCalculatorPressed}
                    />
                }


                {
                    !timeWheelVisible && !deleteModeVisible
                        ? <Button
                            title="Delete"
                            titleStyle={styles.set}
                            icon={
                                <Icon name="trash" size={35} color="black" />
                            }
                            type="clear"
                            iconPosition="top"
                            onPress={() => {
                                //clearAllAlarm();
                                setDeleteModeVisible(true);
                            }}
                        />
                        : deleteModeVisible

                            ? <Button
                                title="Back"
                                titleStyle={styles.back}
                                icon={
                                    <Icon name="arrow-left" size={35} color="black" />
                                }
                                type="clear"
                                iconPosition="top"
                                onPress={() => {
                                    // resetAllDelete(listOfAlarm);
                                    setDeleteModeVisible(false);
                                }}
                            />
                            : <Button
                                title="Back"
                                titleStyle={styles.back}
                                icon={
                                    <Icon name="arrow-left" size={35} color="black" />
                                }
                                type="clear"
                                iconPosition="top"
                                onPress={() => {
                                    setTimeWheelVisible(false);
                                }}
                            />
                }
            </View>

            <ScrollView style={styles.top}>
                <View>
                    {
                        (listOfAlarm.length > 0)
                            ? showAllAlarm(listOfAlarm)
                            : <Text style={styles.noAlarm}>No Alarm</Text>
                    }
                </View>
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
        backgroundColor: '#e0e0e0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    noAlarm: {
        padding: 20,
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#e0e0e0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    alarmtext2: {
        padding: 10,
        fontSize: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        //backgroundColor: 'lightpink',
    },
    alarmtext3: {
        fontSize: 35,
        paddingRight: 20,
    },
    dateText: {
        fontSize: 15,
        padding: 5,
    },
    button: {
        width: Dimensions.get('window').width * 0.9,
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
        alignSelf: 'stretch',
    },
    checkbox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        padding: 10,
        paddingLeft: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
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
    set: {
        color: "black",
        fontSize: 13,
    },
    back: {
        color: "black",
        fontSize: 13,
    }
});

export default AlarmManager;