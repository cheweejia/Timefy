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
                        <Button
                            styles={styles.buttons}
                            mode='contained'
                            onPress={() => handleNewSleepCalculatorAlarm(findWakeUpTime(7.5))}
                        >
                            {findWakeUpTime(7.5)}
                        </Button>

                        <Button
                            mode='contained'
                            onPress={() => handleNewSleepCalculatorAlarm(findWakeUpTime(9))}
                        >
                            {findWakeUpTime(9)}
                        </Button>

                        <Button
                            mode='contained'
                            onPress={() => handleNewSleepCalculatorAlarm(findWakeUpTime(5.5))}
                        >
                            {findWakeUpTime(5.5)}
                        </Button>

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
        padding: 20
    }, 
    buttons: {
       padding: 100, 
    }
});


export default WakeUpTime;