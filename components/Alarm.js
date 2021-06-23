import React, { useEffect, useState, } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import TimeTools, { getTime, getDate, timeEqual, timeEqual2 } from "./TimeTools";
import AlarmManager from './AlarmManager/AlarmManager';
import Clock from "./Clock";
import TimeWheel from './AlarmManager/TimeWheel';
import { Audio } from 'expo-av';
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
                ? ringAlarm(listOfAlarm[i].time + " " + listOfAlarm[i].date, i)
                : {}
        }
    }

    const ringAlarm = (timeDate, index) => {
        console.log('ring');
        Alert.alert('testtest',
            "ALARM " + index + "SCHEDULED ON " + timeDate + "RING RING RING",
            [
                { text: 'DISMISS', onPress: () => { handleDismissedAlarm(index) } },
                { text: 'SNOOZE', onPress: () => { handleSnoozedAlarm(index) } },

            ],
            { cancelable: false });
        playAlarm();

    }

    //////////////////////////////////////////////////

    const handleDismissedAlarm = (index) => {
        toggleAlarm();
    }

    const handleSnoozedAlarm = (index) => {

    }






    ///////////////////////////////////////ALARM RING MANGEMENT 

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: false
        });

        loadAudio();
    }, [])


    const [currentItem, setCurrentItem] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [isBuffering, setIsBuffering] = useState(false)
    const [playbackInstance, setPlayBackInstance] = useState(null);

    const loadAudio = async () => {
        try {
            const playbackInstance = new Audio.Sound();
            //const source = {
            const status = {
                shouldPlay: isPlaying,
                volume
            }

            playbackInstance.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(status))
            await playbackInstance.loadAsync(require('./Sound/song.mp3'), status, false)
            setPlayBackInstance(playbackInstance);

        } catch (e) {
            console.log(e);
        }
    }

    const onPlaybackStatusUpdate = (status) => {
        const newStatus = status.isBuffering;
        setIsBuffering(newStatus);
    }

    const toggleAlarm = async () => {
        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

        setIsPlaying(!isPlaying);
    }

    const playAlarm = async () => {
        await playbackInstance.playAsync()
        setIsPlaying(true);
    }




    const onChange = duration => {
        const { hours, minutes, seconds } = duration;
        setState({ hours, minutes, seconds });
    };

    const [timeWheelVisible, setTimeWheelVisible] = useState(false);
    const [quickSetAlarmTime, setQuickSetAlarmTime] = useState("00:00:00");


    const toggleTimeWheel = () => {
        console.log('toggled')
        setTimeWheelVisible(!timeWheelVisible);
    }

    const resetQuickSetAlarm = () => {
        setQuickSetAlarmTime("00:00:00");
    }

    return (
        <>
            <View style={styles.timedate}>
                <Clock />

                <View>
                    <Text style={styles.timeFont}>
                        {checkAlarm()}
                        {(!timeWheelVisible)
                            ? <TouchableOpacity
                                onPress = {() => toggleTimeWheel()}
                                onLongPressed={() => toggleTimeWheel()}
                                disabled = {false}>
                                <Text style = {styles.timeFont}>{currTime}</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity
                                disabled = {true}>
                                <TimeWheel
                                    quickSetAlarmTime={quickSetAlarmTime}
                                    setQuickSetAlarmTime={setQuickSetAlarmTime}
                                />
                            </TouchableOpacity>

                        }
                    </Text>
                </View>




                {/* <TouchableOpacity
                    disable={true}
                    onLongPress={() => toggleTimeWheel()}>
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
                </TouchableOpacity> */}
                <Text style={styles.dateFont}>
                    {currDate}
                </Text>

            </View>

            <View style={styles.manager}>
                <AlarmManager
                    listOfAlarm={listOfAlarm}
                    setListOfAlarm={setListOfAlarm}
                    timeWheelVisible={timeWheelVisible}
                    setTimeWheelVisible={setTimeWheelVisible}
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