import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Alarm from "./components/Alarm"
import Stopwatch from "./components/Stopwatch"
import Timer from "./components/Timer"

function AlarmScreen() {
  return (
    <View style={styles.container}>
      <Alarm/>
    </View>
  );
}

function StopwatchScreen() {
  return (
    <View style={styles.container}>
      <Stopwatch/>
    </View>
  );
}

function TimerScreen() {
  return (
    <View style={styles.container}>
      <Timer/>
    </View>
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBarOptions={{
        labelStyle: {
          fontSize: 20,
          paddingBottom: 10,
        }
      }}>
        <Tab.Screen name="Alarm" component={AlarmScreen} />
        <Tab.Screen name="Stopwatch" component={StopwatchScreen} />
        <Tab.Screen name="Timer" component={TimerScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
