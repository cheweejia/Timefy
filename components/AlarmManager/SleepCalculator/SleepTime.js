import React from 'react';
import { View, Text, Button } from 'react-native';
import { Modal, Provider, Portal } from 'react-native-paper';

function SleepTime(props) {
    const { sleepTimeVisible, setSleepTimeVisible, quickSetAlarmTime, setQuickSetAlarmTime, sleepCalculatorPressed, setSleepCalculatorPressed } = props;
    const containerStyle = {backgroundColor: 'white', padding: 20};

    const hideModal = () => {
        setSleepTimeVisible(false);
    }
    return (
        <View>
            {
                sleepTimeVisible &&
                <Provider>
                    <Portal>
                        <Modal visible={sleepTimeVisible} onDismiss={() => hideModal()} contentContainerStyle={containerStyle}>
                            <Text>Example Modal.  Click outside this area to dismiss.</Text>
                        </Modal>
                    </Portal>
                </Provider>

            }
        </View>
    );

}

export default SleepTime;