import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getTimeForAlarmSettings, getDate, checkSecondDifference2, getTime } from "../TimeTools";

import Modal from 'react-native-modal';
import { changeSnoozeDuration, changeRepeatDay, changeDate, changeTime  } from '../AlarmManagementTools'
import { Alert } from 'react-native';


function AlarmSetting(props) {
    const { alarmSettingVisible, setAlarmSettingVisible, alarmObj, alarmIndex, setAlarmIndex, listOfAlarm, setListOfAlarm } = props;

    const toggleAlarmSetting = () => {
        setAlarmSettingVisible(!alarmSettingVisible);
    };

    ///////////////////////////////////////////////////////// Retrieve data from storage

    useEffect(() => {
        //console.log('Current alarm index is' + alarmIndex);
        retrieveSnoozeDuration(alarmIndex);
        retrieveRepeatDay(alarmIndex);
        retrieveCurrDate(alarmIndex);
        retrieveCurrTime(alarmIndex)
    }, [alarmIndex])

    const retrieveCurrDate = (index) => {
        if (index !== undefined) {
            setCurrDate(listOfAlarm[index].date);
        }
    }

    const retrieveCurrTime = (index) => {
        if (index !== undefined) {
            setCurrTime(listOfAlarm[index].time);
        }
    }

    const retrieveSnoozeDuration = (index) => {
        if (index !== undefined) {
            setSnoozeDuration(listOfAlarm[index].snoozeDuration);
        }
    }

    const retrieveRepeatDay = (index) => {
        if (index !== undefined) {
            setRepeatDay(listOfAlarm[index].repeat);
            setSun(listOfAlarm[index].repeat[0]);
            setMon(listOfAlarm[index].repeat[1]);
            setTues(listOfAlarm[index].repeat[2]);
            setWed(listOfAlarm[index].repeat[3]);
            setThur(listOfAlarm[index].repeat[4]);
            setFri(listOfAlarm[index].repeat[5]);
            setSat(listOfAlarm[index].repeat[6]);
        }
    }

    ///////////////////////////////////////////////////////////// Save/Discard

    const saveAllChanges = () => {
        //console.log('SAVE ALL CHANGE LOG 1')
        //console.log(changeSnoozeDuration(alarmIndex, listOfAlarm, snoozeDuration));

        if (checkSecondDifference2(currDate, currTime) < 0) {
            const now = new Date();
            Alert.alert("Please select an alarm that rings after " + getTime(now) + " " + getDate(now));
        } else {
            const newRepeat = [sun, mon, tues, wed, thur, fri, sat];
            setAlarmSettingVisible(!alarmSettingVisible);

            const newTimeList = changeTime(alarmIndex, listOfAlarm, currTime)
            const newDateList = changeDate(alarmIndex, newTimeList, currDate)
            const newSnoozeList = changeSnoozeDuration(alarmIndex, newDateList, snoozeDuration)
            const newRepeatList = changeRepeatDay(alarmIndex, newSnoozeList, newRepeat)

            setListOfAlarm(newRepeatList);
        }
    }

    const discardAllChanges = () => {
        setAlarmSettingVisible(!alarmSettingVisible);
    }

    //////////////////////////////////////////////Date Time
    const [currDate, setCurrDate] = useState()
    const [currTime, setCurrTime] = useState()

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (date) => {
        //console.warn("Alarmed set at", getTime(date));
        setCurrTime(getTime(date));
        hideTimePicker();
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        //console.warn("Alarmed set at", getTime(date));
        setCurrDate(getDate(date));
        hideDatePicker();
    };


    //////////////////////////////////////// Snooze
    const [snoozeDuration, setSnoozeDuration] = useState();

    //////////////////////////////////////////////Repeat
    const [needRepeat, setNeedRepeat] = useState(true);
    const [repeatDay, setRepeatDay] = useState();

    const [sun, setSun] = useState();
    const [mon, setMon] = useState();
    const [tues, setTues] = useState();
    const [wed, setWed] = useState();
    const [thur, setThur] = useState();
    const [fri, setFri] = useState();
    const [sat, setSat] = useState();

    // const buttonColorStyle = {
    //     backgroundColor: (isDay(new Date())) ? 'rgba(252, 150, 1, 0.6)' : 'rgba(18, 47, 80, 0.7)'
    //   }



    return (
        <View>
            <Modal
                isVisible={alarmSettingVisible}
                onRequestClose={() => toggleAlarmSetting()}
                animationIn='rubberBand'
                animationOut='fadeOut'
                swipeDirection='right'
                style={{ margin: 30 }}
                onSwipeComplete={() => toggleAlarmSetting()}
                hideModalContentWhileAnimating={true}
            //coverScreen = {false}

            >
                <ScrollView>
                    <View style={styles.modalcontainer}>
                        <View style={styles.button}>
                            <Button
                                color="blue"
                                title="Discard"
                                type="clear"
                                fontSize="15"
                                onPress={() => {
                                    discardAllChanges();
                                }}
                            />
                            <Button
                                color="blue"
                                title="Save"
                                type="clear"
                                fontSize="15"
                                onPress={() => {
                                    saveAllChanges();
                                }}
                            />
                        </View>


                        <Text style={styles.alarmtext3}>
                            Alarm {alarmIndex + 1}
                        </Text>

                        <DateTimePickerModal
                            isVisible={isTimePickerVisible}
                            mode="time"
                            display="spinner"
                            value={currTime}
                            onConfirm={handleTimeConfirm}
                            onCancel={hideTimePicker}
                            style={styles.clock}
                        />

                        <View>
                            <TouchableOpacity
                                onPress={() => showTimePicker()}>
                                <Text style={styles.currTime}> {currTime} </Text>
                            </TouchableOpacity>
                        </View>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            display="spinner"
                            value={currDate}
                            onConfirm={handleDateConfirm}
                            onCancel={hideDatePicker}
                            style={styles.clock}
                        />

                        <View>
                            <TouchableOpacity
                                onPress={() => showDatePicker()}>
                                <Text style={styles.currDate}> {currDate} </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.settings}>
                            <Text style={styles.titletext}>
                                Snooze:
                            </Text>
                            <Picker
                                mode='dropdown'
                                enabled={true}
                                style={{ height: 50, width: 0.6 * Dimensions.get('window').width }}
                                promopt='snooze'
                                selectedValue={snoozeDuration}
                                onValueChange={(itemValue, itemIndex) => {
                                    //console.log('itemvalue ===' + itemValue);
                                    setSnoozeDuration(itemValue);
                                    //console.log(snoozeDuration);
                                }
                                }
                            >
                                <Picker.Item label="0.5 min" value={30} />
                                <Picker.Item label="1 min" value={60} />
                                <Picker.Item label="2 min" value={120} />
                                <Picker.Item label="5 min" value={300} />
                                <Picker.Item label="10 min" value={600} />
                                <Picker.Item label="None" value={0} />


                            </Picker>

                            <Text style={styles.titletext}>
                                Repeat:
                            </Text>

                            <View style={styles.repeatbuttoncontainer}>

                                <TouchableOpacity
                                    key={0}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 35,
                                        height: 35,
                                        backgroundColor: '#fff',
                                        borderRadius: 50,
                                        flexDirection: 'column',
                                        padding: 5,
                                        backgroundColor: sun ? 'rgba(120, 240, 140,1.0)' : 'transparent'
                                    }}
                                    onPress={() => setSun(!sun)}

                                >
                                    <Text> S </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    key={1}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 35,
                                        height: 35,
                                        backgroundColor: '#fff',
                                        borderRadius: 50,
                                        flexDirection: 'column',
                                        padding: 5,
                                        backgroundColor: mon ? 'rgba(120, 240, 140,1.0)' : 'transparent'
                                    }}
                                    onPress={() => setMon(!mon)}

                                >
                                    <Text> M </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    key={2}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 35,
                                        height: 35,
                                        backgroundColor: '#fff',
                                        borderRadius: 50,
                                        flexDirection: 'column',
                                        padding: 5,
                                        backgroundColor: tues ? 'rgba(120, 240, 140,1.0)' : 'transparent'
                                    }}
                                    onPress={() => setTues(!tues)}

                                >
                                    <Text> T </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    key={3}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 35,
                                        height: 35,
                                        backgroundColor: '#fff',
                                        borderRadius: 50,
                                        flexDirection: 'column',
                                        padding: 5,
                                        backgroundColor: wed ? 'rgba(120, 240, 140,1.0)' : 'transparent'
                                    }}
                                    onPress={() => setWed(!wed)}

                                >
                                    <Text> W </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    key={4}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 35,
                                        height: 35,
                                        backgroundColor: '#fff',
                                        borderRadius: 50,
                                        flexDirection: 'column',
                                        padding: 5,
                                        backgroundColor: thur ? 'rgba(120, 240, 140,1.0)' : 'transparent'
                                    }}
                                    onPress={() => setThur(!thur)}

                                >
                                    <Text> T </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    key={5}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 35,
                                        height: 35,
                                        backgroundColor: '#fff',
                                        borderRadius: 50,
                                        flexDirection: 'column',
                                        padding: 5,
                                        backgroundColor: fri ? 'rgba(120, 240, 140,1.0)' : 'transparent'
                                    }}
                                    onPress={() => setFri(!fri)}

                                >
                                    <Text> F </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    key={6}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 35,
                                        height: 35,
                                        backgroundColor: '#fff',
                                        borderRadius: 50,
                                        flexDirection: 'column',
                                        padding: 5,
                                        backgroundColor: sat ? 'rgba(120, 240, 140,1.0)' : 'transparent'
                                    }}
                                    onPress={() => setSat(!sat)}

                                >
                                    <Text> S </Text>
                                </TouchableOpacity>

                            </View>





                        </View>


                        {/* //</ScrollView> */}





                    </View>
                </ScrollView>



            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    alarmtext3: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        padding: 10,
        alignItems: 'center'
    },
    modalcontainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    settings: {
        flexDirection: 'column',
    },
    titletext: {
        fontSize: 18,
        padding: 5,
        alignItems: 'flex-start'
    },
    button: {
        width: 0.7 * Dimensions.get('window').width,
        flex: 0.2,
        flexDirection: "row",
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-end',
        alignContent: 'center',
    },
    repeatbutton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 50,
        flexDirection: 'column',
        padding: 5,

    },
    repeatbuttoncontainer: {
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    currDate: {
        fontSize: 20,
        color: 'black',
        padding: 0,
        alignItems: 'center'
    },
    currTime: {
        fontSize: 50,
        color: 'black',
        padding: 0,
        alignItems: 'center'
    }
});

export default AlarmSetting;