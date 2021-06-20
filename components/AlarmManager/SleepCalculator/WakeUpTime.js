import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { getTime, } from '../../TimeTools';

function WakeUpTime(props) {
    const { wakeUpTimeVisible, setWakeUpTimeVisible, quickSetAlarmTime, setQuickSetAlarmTime, sleepCalculatorPressed, setSleepCalculatorPressed } = props;
    const containerStyle = { backgroundColor: 'white', padding: 20, height: Dimensions.get('window').height, width: Dimensions.get('window').width };

    const hideModal = () => {
        setWakeUpTimeVisible(false);
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

    const findWakeUpTime = (numOfHours) => {
        return getTime(new Date(new Date().getTime() + numOfHours * 60 * 60 * 1000));
    }

    return (
        <View>
            {
                wakeUpTimeVisible &&
                <Modal
                    isVisible={wakeUpTimeVisible}
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
                            If you sleep now, {"\n"}you should wake up at ...

                        </Text>
                        {/* <Text style={styles.descriptionfont2}>
                            If you sleep now, you should wake up at ...
                        </Text> */}

                        <View style={styles.buttons}>
                            <Button
                                mode='contained'
                                onPress={() => handleNewSleepCalculatorAlarm(findWakeUpTime(7.75))}
                            >
                                {findWakeUpTime(7.75)}
                            </Button>
                            <Text style={styles.cyclefont}>
                                7 hour 45 min
                            </Text>
                        </View>

                        <View style={styles.buttons}>
                            <Button
                                mode='contained'
                                onPress={() => handleNewSleepCalculatorAlarm(findWakeUpTime(9.25))}
                            >
                                {findWakeUpTime(9.25)}
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
    }
});


export default WakeUpTime;