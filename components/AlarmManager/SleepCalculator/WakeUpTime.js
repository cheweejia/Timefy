import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Provider, Portal,  } from 'react-native-paper';
import Modal from 'react-native-modal'

function WakeUpTime(props) {
    const { wakeUpTimeVisible, setWakeUpTimeVisible } = props;
    const containerStyle = { backgroundColor: 'white', padding: 20, height: Dimensions.get('window').height, width: Dimensions.get('window').width };

    const hideModal = () => {
        setWakeUpTimeVisible(false);
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
                    swipeDirection = 'down'
                    style = {{margin : 30}}
                    onSwipeComplete= {() => hideModal()}
                    hideModalContentWhileAnimating={true}
                    //coverScreen = {false}

                >
                    <View style = {styles.modalcontainer}>
                        <Text style={styles.alarmtext3}>
                            test


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
        alignItems : 'center',
        borderRadius : 5
    }, 
    modalcontainer: {
        alignItems:'center',
        backgroundColor:'white', 
        borderRadius : 5
    }
});


export default WakeUpTime;