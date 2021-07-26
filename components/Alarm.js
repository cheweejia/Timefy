import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import TimeTools, { getTime, getDate, timeEqual, timeEqual2, checkSecondDifference } from "./TimeTools";
import { snoozeAlarm, dismissAlarm } from './AlarmManagementTools';
import AlarmManager from './AlarmManager/AlarmManager';
import Clock from "./Clock";
import TimeWheel from './AlarmManager/TimeWheel';
import { Audio } from 'expo-av';
import SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MathGame from './MathGame';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import * as Notifications from 'expo-notifications';
import Permission from 'expo-permissions';
import Constants from 'expo-constants';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Touchable } from 'react-native';
import PushNotification from "react-native-push-notification";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    }),
});

Notifications.setNotificationChannelAsync('sound', {
    name: 'sound channel',
    vibrationPattern: [10, 30, 30, 30],
    importance: Notifications.AndroidImportance.MAX,
    sound: '1.wav', // <- Android 8.0+
});

async function schedulePushNotification(time) {
    console.log('notif' + time)
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've an Alarm ringing now",
            body: 'Click to dismiss this notification',
            data: { data: 'goes here' },
            sound: '1.wav',
            priority: 'high',
            vibrationPattern: [0, 250, 250, 250]
        },
        trigger: { seconds: time, channelId: 'default', repeats: false },

    });
}

async function cancelPushNotification() {
    console.log('cancel')
    await Notifications.cancelAllScheduledNotificationsAsync();
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'default',
        });
    }

    return token;
}


export default function Alarm() {


    /////////////////////////////////////////////////////////////////////

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const scheduleAlarmNotification = () => {
        const size = listOfAlarm.length;
        for (var i = 0; i < size; i++) {
            console.log(checkSecondDifference(listOfAlarm[i]))
            schedulePushNotification(checkSecondDifference(listOfAlarm[i]));
        }
    }
    ////////////////////////////////////////////////////////////

    const [currTime, setCurrTime] = useState(getTime(new Date()));
    const [currDate, setCurrDate] = useState(getDate(new Date()));

    useEffect(() => {
        let secTimer = setInterval(() => {
            setCurrTime(getTime(new Date()));
            // checkAlarm();
        }, 1000);
        return () => clearInterval(secTimer);
    }, []);

    ///////////////////////////////////////////////////// LOCAL STORAGE
    const [listOfAlarm, setListOfAlarm] = useState([]);

    async function save(key, value) {
        console.log('save === ' + value)
        await AsyncStorage.setItem(key, value);
    }

    async function getValueFor(key) {

        try {
            const value = await AsyncStorage.getItem('listOfAlarm')
            console.log('value ==== ' + value)
            if (value !== null) {
                setListOfAlarm(JSON.parse(value));
            } else {
                setListOfAlarm([]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getValueFor('listOfAlarm')
    }, [])

    useEffect(() => {
        cancelPushNotification();
        //console.log('new lOA: ' + JSON.stringify(listOfAlarm))
        console.log('changed loa')
        console.log(listOfAlarm)
        save('listOfAlarm', JSON.stringify(listOfAlarm));
        scheduleAlarmNotification();
    }, [listOfAlarm])

    /////////////////////////////////////////////////////

    const handleRingAlarmAndCancelNotif = (index) => {
        cancelPushNotification();
        // try {
        //     Audio.setAudioModeAsync({
        //         allowRecordingIOS: false,
        //         interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        //         playsInSilentModeIOS: true,
        //         interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        //         shouldDuckAndroid: true,
        //         staysActiveInBackground: true,
        //         playThroughEarpieceAndroid: false
        //     });

        //     loadAudio();
        //     console.log("audio loaded")
        // } catch (e) {
        //     console.log(e);
        // }
        handleRingAlarm(index);
    }

    const checkPastAlarm = () => {
        if (listOfAlarm !== undefined) {
            for (var i = 0; i < listOfAlarm.length; i++) {
                checkSecondDifference(listOfAlarm[i]) < 0
                    ? handleRingAlarmAndCancelNotif(i)
                    : {}
            }
        }
    }

    const checkAlarm = () => {
        //console.log(currTime + "," + currDate + "//" + listOfAlarm)
        // THIS MIGHT BE DAMN SLOW
        if (listOfAlarm !== undefined) {
            for (var i = 0; i < listOfAlarm.length; i++) {
                (listOfAlarm[i].isOn && timeEqual(currTime, listOfAlarm[i].time, currDate, listOfAlarm[i].date))
                    ? handleRingAlarm(i)
                    //? ringAlarm(listOfAlarm[i].time + " " + listOfAlarm[i].date, i)
                    : timeEqual(currTime, listOfAlarm[i].time, currDate, listOfAlarm[i].date)
                        ? handleDisabledAlarm(i)
                        : {}
            }
        }
    }

    /////////////////////////////////////////////
    const [currRingAlarmIndex, setCurrRingAlarmIndex] = useState();

    const handleRingAlarm = (index) => {
        if (currRingAlarmIndex !== index) {

            try {
                playAlarmSound()
            } catch (e) {
                console.log("error for play sound " + e);
            }
            setAlarmScreenVisible(true);
            setCurrRingAlarmIndex(index);
        }

    }

    const ringAlarm = (timeDate, index) => {

        //setCurrRingAlarmIndex(index);
        //setAlarmScreenVisible(alarmScreenVisible);
        console.log('ring');
        playAlarmSound();
        Alert.alert('testtest',
            "ALARM " + index + "SCHEDULED ON " + timeDate + "RING RING RING"
            ,
            [
                { text: 'DISMISS', onPress: () => { handleDismissedAlarm(index) } },
                { text: 'SNOOZE', onPress: () => { handleSnoozedAlarm(index) } },

            ],
            { cancelable: false, }

        );
    }
    //////////////////////////////////////////////////

    const [alarmScreenVisible, setAlarmScreenVisible] = useState(false)

    const handleQuitAlarmScreen = () => {
    }

    const handleDisabledAlarm = (index) => {
        setListOfAlarm(dismissAlarm(index, listOfAlarm));
    }

    const handleDismissedAlarm = (index) => {
        if (mathGameSolved) {
            stopAlarmSound();
            dismissAlarmSound();
            setListOfAlarm(dismissAlarm(index, listOfAlarm));
            setCurrRingAlarmIndex(-1);
            setAlarmScreenVisible(false);
        } else {
            Alert.alert("Please solve the math puzzle and click 'OK' ")
        }

    }

    const handleSnoozedAlarm = (index) => {
        stopAlarmSound();
        setAlarmScreenVisible(false);
        console.log(listOfAlarm);

        setListOfAlarm(snoozeAlarm(index, listOfAlarm));
        setCurrRingAlarmIndex(-1);
        console.log(listOfAlarm);
    }

    ///////////////////////////////////////

    const [mathGameVisible, setMathGameVisible] = useState(false);
    const [mathGameSolved, setMathGameSolved] = useState(false);

    useEffect(() => {
        if (mathGameSolved) {
            handleDismissedAlarm(currRingAlarmIndex);
        } else {

        }
    }, [mathGameSolved])



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
            console.log("audio loaded")
        } catch (e) {
            console.log(e);
        }
    }, [])




    const [currentItem, setCurrentItem] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [isBuffering, setIsBuffering] = useState(false)
    const [playbackInstance, setPlayBackInstance] = useState()

    const loadAudio = async () => {
        try {
            const sound = new Audio.Sound();

            //playbackInstance.createAsync(require('./Sound/1.mp3'), status);

            //const source = {
            const status = {
                shouldPlay: isPlaying,
                volume
            }
            //console.log(playbackInstance);
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(status))
            await sound.loadAsync(require('./Sound/11.mp3'), status, true)

            setPlayBackInstance(sound);

            //console.log("loaded");
            //console.log(playbackInstance)
            //console.log(status);



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
        if (playbackInstance === undefined) {
            console.log("UNDEFINEEDDDDD AUDIO ")
            loadAudio()
        }
        setTimeout( () => {playbackInstance.playAsync()}, 2000);
        setIsPlaying(true);



    }

    const dismissAlarmSound = async () => {

        try {
            await playbackInstance.unloadAsync();
        } catch (e) {
            console.log(e)
        }
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
        <View style={styles.container}>
            <View style={styles.clock}>
                <Clock />
            </View>
            <View style={styles.time}>
                <Text style={styles.timeFont}>
                    {checkPastAlarm()}
                    {checkAlarm()}
                    {alarmScreenVisible &&
                        <Modal
                            isVisible={alarmScreenVisible}
                            onRequestClose={() => handleQuitAlarmScreen}
                            animationIn='rubberBand'
                            animationOut='fadeOut'
                            swipeDirection='down'
                            style={{ margin: 30 }}
                            onSwipeComplete={() => handleQuitAlarmScreen}
                            hideModalContentWhileAnimating={true}
                        //coverScreen = {false}

                        >

                            <View style={styles.container}>
                                <MathGame
                                    mathGameVisible={alarmScreenVisible}
                                    setMathGameVisible={setMathGameVisible}
                                    mathGameSolved={mathGameSolved}
                                    setMathGameSolved={setMathGameSolved}
                                />
                                <View style={styles.button}>

                                    <Button
                                        color="blue"
                                        title="Dismiss"
                                        type="clear"
                                        fontSize="15"
                                        onPress={() => {
                                            handleDismissedAlarm(currRingAlarmIndex)
                                        }}
                                    />
                                    <Button
                                        color="blue"
                                        title="Snooze"
                                        type="clear"
                                        fontSize="15"
                                        onPress={() => {
                                            handleSnoozedAlarm(currRingAlarmIndex)
                                        }}
                                    />

                                </View>


                            </View>
                        </Modal>

                    }




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

            <View style={styles.manager}>

                {/* <TouchableOpacity
                    onPress={() => {

                        playAlarmSound()
                    }}>
                    <Text style={styles.timeFont}>ply</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {

                        stopAlarmSound()
                    }}>
                    <Text style={styles.timeFont}>stop</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {

                        dismissAlarmSound()
                    }}>
                    <Text style={styles.timeFont}>stop</Text>
                </TouchableOpacity> */}


                <AlarmManager
                    listOfAlarm={listOfAlarm}
                    setListOfAlarm={setListOfAlarm}
                    timeWheelVisible={timeWheelVisible}
                    setTimeWheelVisible={setTimeWheelVisible}
                    quickSetAlarmTime={quickSetAlarmTime}
                    setQuickSetAlarmTime={setQuickSetAlarmTime}
                />

            </View>


        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        marginTop: (Dimensions.get('window').height * 0.075),
        paddingHorizontal: 20,
    },
    timedate: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
    },
    clock: {
        marginTop: 0,
        flex: 1,
        backgroundColor: '#fff',
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
    time: {
        marginTop: Dimensions.get('window').height * 0.025,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        height: Dimensions.get('window').height * 0.1,
    },
    timeFont: {
        fontSize: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateFont: {
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30
    },
    modalcontainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    button: {
        width: 0.7 * Dimensions.get('window').width,

        flexDirection: "row",
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-end',
        alignContent: 'center',
    },
});