import React, { Component, useState, useEffect } from 'react'
import { Animated, StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

const DATA = {
    hours: 12,
    minutes: 34,
    seconds: 56,
}

const numOfHours = [...Array(24).keys()]
const minSec = [...Array(60).keys()]

export default function TimeWheel(props) {

    const { quickSetAlarmTime, setQuickSetAlarmTime } = props;

    useEffect ( () => {
        setQuickSetAlarmTime("00:00:00")
    }, [])
    
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.unitRow}>
                    <View style={styles.unit}>
                        <FlatList
                            //disableVirtualiz15
                            marginTopion={false}
                            //onEndReachedThreshold={1200}
                            style={{ flexGrow: 0 }}
                            keyExtractor={(item) => item.toString()}
                            data={numOfHours}
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={50}
                            decelerationRate="fast"
                            contentContainerStyle={{
                                paddingTop: 25,
                                paddingBottom: 25,
                            }}
                            onMomentumScrollEnd={ev => {
                                const pad = (n) => n < 10 ? '0' + n : n
                                const index = Math.round(ev.nativeEvent.contentOffset.y / 50)

                                const min = quickSetAlarmTime.slice(3, 5);
                                setQuickSetAlarmTime(pad(index) + ":" + min + ":00");
                            }}
                            renderItem={({ item }) => {
                                const pad = (n) => n < 10 ? '0' + n : n
                                return (
                                    <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.text]}>{pad(item)}</Text>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <Text style={styles.colon}>:</Text>
                    <View style={styles.unit}>
                        <FlatList
                            style={{ flexGrow: 0 }}
                            keyExtractor={(item) => item.toString()}
                            data={minSec}
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={50}
                            decelerationRate="fast"
                            contentContainerStyle={{
                                paddingTop: 25,
                                paddingBottom: 25,
                            }}
                            onMomentumScrollEnd={ev => {
                                const pad = (n) => n < 10 ? '0' + n : n
                                const index = Math.round(ev.nativeEvent.contentOffset.y / 50)

                                const hour = quickSetAlarmTime.slice(0, 2);
                                setQuickSetAlarmTime(hour + ":" + pad(index) + ":00");

                            }}
                            renderItem={({ item }) => {
                                const pad = (n) => n < 10 ? '0' + n : n
                                return (
                                    <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.text]}>{pad(item)}</Text>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    {/* <Text style = {styles.colon}>:</Text>
                    <View style={styles.unit}>
                        <FlatList
                            style={{ flexGrow: 0 }}
                            keyExtractor={(item) => item.toString()}
                            data={minSec}
                            bounces={true}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={50}
                            decelerationRate="fast"
                            contentContainerStyle={{
                                paddingTop: 25,
                                paddingBottom: 25,
                            }}
                            onMomentumScrollEnd={ev => {
                                const index = Math.round(ev.nativeEvent.contentOffset.y / 50)
                                // this.setState({
                                //     seconds: minSec[index]
                                // })
                                console.log(index)
                            }}
                            renderItem={({ item }) => {
                                const pad = (n) => n < 10 ? '0' + n : n
                                return (
                                    <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.text]}>{pad(item)}</Text>
                                    </View>
                                )
                            }}
                        />
                    </View> */}
                </View >
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
    },
    unit: {
        width: (Dimensions.get('window').width * 0.20),
        color: '#000000',
        fontSize: 15,
        textAlign: 'center',
        marginLeft: 5,
        marginRight: 5,
    },
    unitRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        // marginTop: -(Dimensions.get('window').height * 0.009),
        marginBottom: 0,
        height: (Dimensions.get('window').height * 0.21),
    },
    text: {
        color: '#000000',
        fontSize: (Dimensions.get('window').width * 0.14),
        textAlign: 'center',
    },
    colon: {
        color: '#000000',
        marginTop: (Dimensions.get('window').height * 0.02),
        fontSize: (Dimensions.get('window').width * 0.13),
        textAlign: 'center',
    },
})
