import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Provider, Portal } from 'react-native-paper';

function SleepTime(props) {
    const { sleepTimeVisible, setSleepTimeVisible } = props;
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

const styles = StyleSheet.create({
    alarmtext3: {
        fontSize: 20,
        color: 'white',
        padding: 10,
        alignItems : 'center'
    }
});

export default SleepTime;