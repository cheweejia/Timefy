import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import TimeTools, { getTime, getDate, timeEqual, timeEqual2 } from "./TimeTools";
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
//import * as Notifications from 'expo-notifications';
import Permission from 'expo-permissions';
import Constants from 'expo-constants';
import { Touchable } from 'react-native';
import PushNotification from "react-native-push-notification";

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//     }),
// });

// Notifications.setNotificationChannelAsync('sound', {
//   name: 'sound',
//   importance: Notifications.AndroidImportance.HIGH,
//   sound: '1.mp3', // <- Android 8.0+
// });

// async function schedulePushNotification() {
//     console.log('notif')
//     await Notifications.scheduleNotificationAsync({
//         content: {
//             title: "You've got mail! 📬",
//             body: 'Here is the notification body',
//             data: { data: 'goes here' },
//             sound: '1.mp3'
//         },
//         trigger: { seconds: 2   , channelId: 'sound'},
//     });
// }

// async function registerForPushNotificationsAsync() {
//     let token;
//     if (Constants.isDevice) {
//         const { status: existingStatus } = await Notifications.getPermissionsAsync();
//         let finalStatus = existingStatus;
//         if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//         }
//         if (finalStatus !== 'granted') {
//             alert('Failed to get push token for push notification!');
//             return;
//         }
//         token = (await Notifications.getExpoPushTokenAsync()).data;
//         console.log(token);
//     } else {
//         alert('Must use physical device for Push Notifications');
//     }

//     if (Platform.OS === 'android') {
//         Notifications.setNotificationChannelAsync('default', {
//             name: 'default',
//             importance: Notifications.AndroidImportance.MAX,
//             vibrationPattern: [0, 250, 250, 250],
//             lightColor: '#FF231F7C',
//         });
//     }

//     return token;
// }

// PushNotification.configure({
//     // (optional) Called when Token is generated (iOS and Android)
//     onRegister: function (token) {
//         console.log("TOKEN:", token);
//     },

//     // (required) Called when a remote is received or opened, or local notification is opened
//     onNotification: function (notification) {
//         console.log("NOTIFICATION:", notification);

//         // process the notification

//         // (required) Called when a remote is received or opened, or local notification is opened
//         notification.finish(PushNotificationIOS.FetchResult.NoData);
//     },

//     // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//     onAction: function (notification) {
//         console.log("ACTION:", notification.action);
//         console.log("NOTIFICATION:", notification);

//         // process the action
//     },

//     // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//     onRegistrationError: function (err) {
//         console.error(err.message, err);
//     },

//     // IOS ONLY (optional): default: all - Permissions to register.
//     permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//     },

//     // Should the initial notification be popped automatically
//     // default: true
//     popInitialNotification: true,

//     /**
//      * (optional) default: true
//      * - Specified if permissions (ios) and token (android and ios) will requested or not,
//      * - if not, you must call PushNotificationsHandler.requestPermissions() later
//      * - if you are not using remote notification or do not have Firebase installed, use this:
//      *     requestPermissions: Platform.OS === 'ios'
//      */
//     requestPermissions: true,
// });

// PushNotification.localNotification({
//     /* Android Only Properties */
//     channelId: "your-channel-id", // (required) channelId, if the channel doesn't exist, notification will not trigger.
//     ticker: "My Notification Ticker", // (optional)
//     showWhen: true, // (optional) default: true
//     autoCancel: true, // (optional) default: true
//     largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
//     largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
//     smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
//     bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
//     subText: "This is a subText", // (optional) default: none
//     bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
//     bigLargeIcon: "ic_launcher", // (optional) default: undefined
//     bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
//     color: "red", // (optional) default: system default
//     vibrate: true, // (optional) default: true
//     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
//     tag: "some_tag", // (optional) add tag to message
//     group: "group", // (optional) add group to message
//     groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
//     ongoing: false, // (optional) set whether this is an "ongoing" notification
//     priority: "high", // (optional) set notification priority, default: high
//     visibility: "private", // (optional) set notification visibility, default: private
//     ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
//     shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
//     onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

//     when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
//     usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
//     timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

//     messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 

//     actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
//     invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

//     /* iOS only properties */
//     category: "", // (optional) default: empty string
//     subtitle: "My Notification Subtitle", // (optional) smaller title below notification title

//     /* iOS and Android properties */
//     id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
//     title: "My Notification Title", // (optional)
//     message: "My Notification Message", // (required)
//     userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
//     playSound: false, // (optional) default: true
//     soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
//     number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
//     repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
// });

export default function Alarm() {

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    // useEffect(() => {
    //     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    //     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //         setNotification(notification);
    //     });

    //     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //         console.log(response);
    //     });

    //     return () => {
    //         Notifications.removeNotificationSubscription(notificationListener.current);
    //         Notifications.removeNotificationSubscription(responseListener.current);
    //     };
    // }, []);
    ////////////////////////////////////////////////////////////

    const [currTime, setCurrTime] = useState(getTime(new Date()));
    const [currDate, setCurrDate] = useState(getDate(new Date()));

    useEffect(() => {
        let secTimer = setInterval(() => {
            setCurrTime(getTime(new Date()));
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
        //console.log('new lOA: ' + JSON.stringify(listOfAlarm))
        console.log('changed loa')
        console.log(listOfAlarm)
        save('listOfAlarm', JSON.stringify(listOfAlarm));
    }, [listOfAlarm])

    /////////////////////////////////////////////////////

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
            //console.log(playbackInstance);
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(status))
            await sound.loadAsync(require('./Sound/1.mp3'), status, true)

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
        <View style={styles.container}>
            <Clock />
            <View style={styles.time}>
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

            <View style={styles.manager}>


                {/* <TouchableOpacity
                    onPress={() => {


                    }}>
                    <Text style={styles.timeFont}>tetestest</Text>
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

            {mathGameVisible &&
                <MathGame
                    mathGameVisible={mathGameVisible}
                    setMathGameVisible={setMathGameVisible}
                    mathGameSolved={mathGameSolved}
                    setMathGameSolved={setMathGameSolved}
                />
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: (Dimensions.get('window').height * 0.11),
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
        paddingTop: 0,
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
    time: {
        marginTop: (Dimensions.get('window').height * 0.05),
        backgroundColor: '#FFFFFF',
        height: Dimensions.get('window').height * 0.11,
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
    }
});