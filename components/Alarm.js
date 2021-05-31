import React, { useEffect, useState, } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TimeTools, { getTime, getDate, timeEqual, timeEqual2 } from "./TimeTools";
import AlarmManager from './AlarmManger/AlarmManager';

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


    return (
        <>
            <View style={styles.clock}>

                <Text style={styles.timeFont}>
                    {checkAlarm()}
                    {currTime}
                </Text>
                <Text style={styles.dateFont}>
                    {currDate}
                </Text>
            </View>

            <View style={styles.manager}>
                <AlarmManager
                    listOfAlarm={listOfAlarm}
                    setListOfAlarm={setListOfAlarm}
                />

            </View>


        </>
    );
}


const styles = StyleSheet.create({
    clock: {
        paddingTop: 80,
        flex: 1.3,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -40
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
        justifyContent: 'space-around'
    },
    dateFont: {
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30
    }
});

export default Alarm;