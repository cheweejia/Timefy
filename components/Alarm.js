import React, { useEffect, useState, } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import TimeTools, { getTime, getDate, timeEqual, timeEqual2 } from "./TimeTools";
import { snoozeAlarm, dismissAlarm } from './AlarmManagementTools';
import AlarmManager from './AlarmManager/AlarmManager';
import Clock from "./Clock";
import TimeWheel from './AlarmManager/TimeWheel';
import { Audio } from 'expo-av';
import MathGame from './MathGame';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';


//import { Picker, DatePicker } from 'react-native-wheel-pick';

function AlarmScreen() {
    return (
                    
        {/* <Modal
                        isVisible={alarmScreenVisible}
                        onRequestClose={() => closeMathGame()}
                        animationIn='rubberBand'
                        animationOut='fadeOut'
                        swipeDirection='right'
                        style={{ margin: 30 }}
                        onSwipeComplete={() => closeMathGame()}
                        hideModalContentWhileAnimating={true}
                    //coverScreen = {false}
                    >
                        <View style={styles.container}>
                            <Text>
                                "ALARM " + {currRingAlarmIndex} + "SCHEDULED ON " +  "RING RING RING"
                            </Text>

                            <View style={styles.button}>
                                <Button
                                    color="blue"
                                    title="Dismiss"
                                    type="outline"
                                    fontSize="15"
                                    onPress={() => {
                                        dismissAlarm(index);
                                    }}
                                />

                                <Button
                                    color="blue"
                                    title="Snooze"
                                    type="outline"
                                    fontSize="15"
                                    onPress={() => {
                                        snoozeAlarm(index);
                                    }}
                                />
                            </View>

                        </View>
                    </Modal> */}
    );
}


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
        if (listOfAlarm !== undefined) {
            for (var i = 0; i < listOfAlarm.length; i++) {
                (listOfAlarm[i].isOn && timeEqual(currTime, listOfAlarm[i].time, currDate, listOfAlarm[i].date))
                    ? ringAlarm(listOfAlarm[i].time + " " + listOfAlarm[i].date, i)
                    : timeEqual(currTime, listOfAlarm[i].time, currDate, listOfAlarm[i].date)
                        ? handleDisabledAlarm(i)
                        : {}
            }
        }
    }

    /////////////////////////////////////////////
    const [currRingAlarmIndex, setCurrRingAlarmIndex] = useState();



    const ringAlarm = (timeDate, index) => {

        //setCurrRingAlarmIndex(index);
        //setAlarmScreenVisible(alarmScreenVisible);
        console.log('ring');
        Alert.alert('testtest',
            "ALARM " + index + "SCHEDULED ON " + timeDate + "RING RING RING"
            ,
            [
                { text: 'DISMISS', onPress: () => { handleDismissedAlarm(index) } },
                { text: 'SNOOZE', onPress: () => { handleSnoozedAlarm(index) } },

            ],
            { cancelable: false, }

        );
        playAlarmSound();


    }
    //////////////////////////////////////////////////

    const [alarmScreenVisible, setAlarmScreenVisible] = useState(false)

    const handleDisabledAlarm = (index) => {
        setListOfAlarm(dismissAlarm(index, listOfAlarm));
    }

    const handleDismissedAlarm = (index) => {
        // if (mathGameSolved) {
        //     stopAlarmSound();
        //     dismissAlarmSound();
        //     setListOfAlarm(dismissAlarm(index, listOfAlarm));
        // } else {
        //     setMathGameVisible(true);
        // }

        stopAlarmSound();
        setListOfAlarm(dismissAlarm(index, listOfAlarm));
    }

    const handleSnoozedAlarm = (index) => {
        stopAlarmSound();
        console.log(listOfAlarm);

        setListOfAlarm(snoozeAlarm(index, listOfAlarm));

        console.log(listOfAlarm);
    }

    ///////////////////////////////////////

    const [mathGameVisible, setMathGameVisible] = useState(false);
    const [mathGameSolved, setMathGameSolved] = useState(false);

    // useEffect(() => {
    //     { mathGameSolved && handleDismissedAlarm }
    // }, [mathGameSolved])



    ///////////////////////////////////////ALARM RING MANGEMENT 

    useEffect(() => {
        try {
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
        } catch (e) {
            console.log(e);
        }
    }, [])


    const [currentItem, setCurrentItem] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [isBuffering, setIsBuffering] = useState(false)
    const [playbackInstance, setPlayBackInstance] = useState(null);

    const loadAudio = async () => {
        try {
            const sound = new Audio.Sound();

            //playbackInstance.createAsync(require('./Sound/1.mp3'), status);

            //const source = {
            const status = {
                shouldPlay: isPlaying,
                volume
            }
            console.log(playbackInstance);
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(status))
            await sound.loadAsync(require('./Sound/1.mp3'), status, true)

            setPlayBackInstance(sound);

            console.log("loaded");
            console.log(playbackInstance)
            console.log(status);



        } catch (e) {
            console.log(e);
        }
    }

    const onPlaybackStatusUpdate = (status) => {
        const newStatus = status.isBuffering;
        setIsBuffering(newStatus);
    }

    const toggleAlarmSound = async () => {
        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

        setIsPlaying(!isPlaying);
    }

    const stopAlarmSound = async () => {
        console.log('stop alarm sound')
        await playbackInstance.stopAsync()
        setIsPlaying(false);
    }

    const playAlarmSound = async () => {
        console.log('plauying alarm sound')
        await playbackInstance.playAsync()
        setIsPlaying(true);
    }

    const dismissAlarmSound = async () => {
        playbackInstance.unloadAsync();
    }

    /////////////////////////////////////////TIMEWHEEL MANAGEMENT
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
                                onPress={() => toggleTimeWheel()}
                                onLongPressed={() => toggleTimeWheel()}
                                disabled={false}>
                                <Text style={styles.timeFont}>{currTime}</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity
                                disabled={true}>
                                <TimeWheel
                                    quickSetAlarmTime={quickSetAlarmTime}
                                    setQuickSetAlarmTime={setQuickSetAlarmTime}
                                />
                            </TouchableOpacity>

                        }
                    </Text>
                </View>

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

            {mathGameVisible &&
                <MathGame
                    mathGameVisible={mathGameVisible}
                    setMathGameVisible={setMathGameVisible}
                    mathGameSolved={mathGameSolved}
                    setMathGameSolved={setMathGameSolved}
                />
            }


                    {/* <Modal
                        isVisible={alarmScreenVisible}
                        onRequestClose={() => closeMathGame()}
                        animationIn='rubberBand'
                        animationOut='fadeOut'
                        swipeDirection='right'
                        style={{ margin: 30 }}
                        onSwipeComplete={() => closeMathGame()}
                        hideModalContentWhileAnimating={true}
                    //coverScreen = {false}
                    >
                        <View style={styles.container}>
                            <Text>
                                "ALARM " + {currRingAlarmIndex} + "SCHEDULED ON " +  "RING RING RING"
                            </Text>

                            <View style={styles.button}>
                                <Button
                                    color="blue"
                                    title="Dismiss"
                                    type="outline"
                                    fontSize="15"
                                    onPress={() => {
                                        dismissAlarm(index);
                                    }}
                                />

                                <Button
                                    color="blue"
                                    title="Snooze"
                                    type="outline"
                                    fontSize="15"
                                    onPress={() => {
                                        snoozeAlarm(index);
                                    }}
                                />
                            </View>

                        </View>
                    </Modal> */}


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