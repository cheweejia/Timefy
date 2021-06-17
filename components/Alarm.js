import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import TimeTools, { getTime, getDate, timeEqual, timeEqual2 } from "./TimeTools";
import AlarmManager from './AlarmManager/AlarmManager';
import Clock from "./Clock";
import TimeWheel from './AlarmManager/TimeWheel';
//import { Picker, DatePicker } from 'react-native-wheel-pick';

function Alarm() {

    const [currTime, setCurrTime] = useState(getTime(new Date()));
    const [currDate, setCurrDate] = useState(getDate(new Date()));

    const [listOfAlarm, setListOfAlarm] = useState([]);


    useEffect(() => {
        let secTimer = setInterval(() => {
            setCurrTime(getTime(new Date()));
        }, 1000);
        return () => clearInterval(secTimer);
    }, []);

    const checkAlarm = () => {
        //console.log(currTime + "," + currDate + "//" + listOfAlarm)
        // THIS MIGHT BE DAMN SLOW
        for (var i = 0; i < listOfAlarm.length; i++) {
            (listOfAlarm[i].isOn && timeEqual(currTime, listOfAlarm[i].time, currDate, listOfAlarm[i].date))
                ? ringAlarm(listOfAlarm[i].time + " " + listOfAlarm[i].date)
                : {}
        }
    }

    const ringAlarm = (timeDate) => {
        alert("ALARM AT" + timeDate + "RING RING RING");
        //playSound(www.bensound.com/bensound-music/bensound-sunny.mp3);

    }

    // function playSound(path) {
    //     var audio = new Audio(path);
    //     audio.play();
    // }

    const onChange = duration => {
        const { hours, minutes, seconds } = duration;
        setState({ hours, minutes, seconds });
    };

    const [timeWheelVisible, setTimeWheelVisible] = useState(false);
    const [quickSetAlarmTime, setQuickSetAlarmTime] = useState("00:00:00");


    const toggleTimeWheel = () => {
        setTimeWheelVisible(!timeWheelVisible);
    }

    const resetQuickSetAlarm = () => {
        setQuickSetAlarmTime("00:00:00");
    }

    // const InitTimeWheel = () => {
    //     //resetQuickSetAlarm();

    //     return (
    //         <TimeWheel
    //             quickSetAlarmTime={quickSetAlarmTime}
    //             setQuickSetAlarmTime={setQuickSetAlarmTime}
    //         />
    //     );
    // }

    return (
        <>
            {/* <View style={styles.clock}>
                <Clock />
            </View> */}
            <View style={styles.timedate}>
                <Clock />

                <TouchableOpacity onLongPress={() => toggleTimeWheel()}>
                    <Text style={styles.timeFont}>
                        {checkAlarm()}
                        {(!timeWheelVisible)
                            ? currTime
                            : <TimeWheel
                                quickSetAlarmTime={quickSetAlarmTime}
                                setQuickSetAlarmTime={setQuickSetAlarmTime}
                            />
                        }
                    </Text>
                </TouchableOpacity>
                <Text style={styles.dateFont}>
                    {currDate}
                </Text>

            </View>

            <View style={styles.manager}>
                <AlarmManager
                    listOfAlarm={listOfAlarm}
                    setListOfAlarm={setListOfAlarm}
                    timeWheelVisible={timeWheelVisible}
                    quickSetAlarmTime={quickSetAlarmTime}
                    setQuickSetAlarmTime={setQuickSetAlarmTime}
                />

            </View>
        </>
    );
}


const styles = StyleSheet.create({
    timedate: {
        paddingTop: 130,
        flex: 1.3,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -20
    },
    clock: {
        paddingTop: 80,
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    manager: {
        flex: 2,
        flexDirection: "column",
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeFont: {
        fontSize: 60,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    dateFont: {
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30
    }
});

export default Alarm;