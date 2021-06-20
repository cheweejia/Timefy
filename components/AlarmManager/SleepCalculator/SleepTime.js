import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { getTime, } from '../../TimeTools'

function SleepTime(props) {
    const { sleepTimeVisible, setSleepTimeVisible, quickSetAlarmTime, setQuickSetAlarmTime, sleepCalculatorPressed, setSleepCalculatorPressed } = props;
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const hideModal = () => {
        setSleepTimeVisible(false);
    }

    const handleNewSleepCalculatorAlarm = (time) => {
        setQuickSetAlarmTime(time);
        handlePressedButton();
        hideModal();
        // console.log('handledt');
    }

    const handlePressedButton = () => {
        setSleepCalculatorPressed(true);
    }

    const findSleepTime = (numOfHours) => {
        const old_total_min = parseInt(quickSetAlarmTime.slice(0, 2)) * 60 + parseInt(quickSetAlarmTime.slice(3, 5));
        const new_total_min = old_total_min - numOfHours * 60;
        const new_min = new_total_min < 0 ? (new_total_min + 24 * 60) % 60 : new_total_min % 60;
        const new_hr = new_total_min < 0 ? (new_total_min + 24 * 60 - new_min) / 60 : (new_total_min - new_min) / 60;


        return new_hr + ":" + new_min + ":00";
    }

    return (
        <View>
            {
                sleepTimeVisible &&
                <Modal
                    isVisible={sleepTimeVisible}
                    onRequestClose={() => hideModal()}
                    animationIn='rubberBand'
                    animationOut='fadeOut'
                    swipeDirection='down'
                    style={{ margin: 30 }}
                    onSwipeComplete={() => hideModal()}
                    hideModalContentWhileAnimating={true}
                //coverScreen = {false}

                >
                    <View style={styles.modalcontainer}>

                        <Text style={styles.descriptionfont2}>
                            If you want to wake up at
                            {"\n"}
                            <Text style = {styles.descriptionfont3}>
                                {quickSetAlarmTime}
                            </Text>
                            {"\n"}
                            you should sleep up at ...

                        </Text>
                        {/* <Text style={styles.descriptionfont2}>
                            If you sleep now, you should wake up at ...
                        </Text> */}

                        <View style={styles.buttons}>
                            <Button
                                mode='contained'
                                onPress={() => handleNewSleepCalculatorAlarm(quickSetAlarmTime)}
                            >
                                {findSleepTime(7.75)}
                            </Button>
                            <Text style={styles.cyclefont}>
                                7 hour 45 min
                            </Text>
                        </View>

                        <View style={styles.buttons}>
                            <Button
                                mode='contained'
                                onPress={() => handleNewSleepCalculatorAlarm(quickSetAlarmTime)}
                            >
                                {findSleepTime(9.25)}
                            </Button>
                            <Text style={styles.cyclefont}>
                                9 hour 15 min
                            </Text>
                        </View>

                        <Text style={styles.descriptionfont1}>
                            A good sleep consists of five or six 90-min sleep cycles.
                        </Text>

                    </View>
                </Modal>


            }
        </View>
    );
}

const styles = StyleSheet.create({
    alarmtext3: {
        fontSize: 80,
        color: 'black',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    },
    modalcontainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    buttons: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',

    },
    cyclefont: {
        fontSize: 18,
        marginLeft: 10

    },
    descriptionfont1: {
        textAlign: 'center',
        fontSize: 20,
        paddingTop: 20,
        fontWeight: 'bold'
    },
    descriptionfont2: {
        textAlign: 'center',
        fontSize: 18,
        paddingBottom: 20,
    },
    descriptionfont3: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight : 'bold'
    }
});

export default SleepTime;