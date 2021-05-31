import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Modal from 'react-native-modal';


function AlarmSetting(props) {
    const { alarmSettingVisible, setAlarmSettingVisible, alarmIndex, setAlarmIndex, } = props;

    const toggleAlarmSetting = () => {
        setAlarmSettingVisible(!alarmSettingVisible);
    };

    return (

        <Modal
            isVisible={alarmSettingVisible}
            onBackdropPress={() => toggleAlarmSetting()}
            animationIn = 'rubberBand'
            animationOut = 'fadeOut'
            hideModalContentWhileAnimating = {true}
        >
            <View>
                <Text style = {styles.alarmtext3}>
                 Alarm {alarmIndex} settings. coming soon 

                    
                </Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    alarmtext3: {
        fontSize: 20,
        color: 'white',
        padding: 10,
        alignItems : 'center'
    }
});

export default AlarmSetting;