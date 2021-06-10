import React, { useEffect, useState, } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export function getTime(currDate) {
    const currHour = convertTime(currDate.getHours());
    const currMin = convertTime(currDate.getMinutes());
    const currSec = convertTime(currDate.getSeconds());

    const time = currHour + ":" + currMin + ":" + currSec;

    return time;
}

function getAlarmTime(currDate) {
    const currHour = convertTime(currDate.getHours());
    const currMin = convertTime(currDate.getMinutes());
    const currSec = convertTime(currDate.getSeconds());

    const time = currHour + ":" + currMin + ":" + currSec;

    return time;
}

export function getDate(currDate) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const currDay = convertTime(currDate.getDate());
    const currMonth = currDate.getMonth();
    const currYear = convertTime(currDate.getFullYear());

    const day = currDay + " " + monthNames[currMonth] + " " + currYear;

    return day;
}

function convertTime(time) {
    return time < 10 ? '0' + time : time;
}

export function timeEqual(currTime, alarmTime, currDate, alarmDate){
    return (currTime == alarmTime) && (currDate == alarmDate);
}

export function isDay(currDate) {
    return currDate.getHours() > 7 && currDate.getHours() < 19;
}

// -1 if time1 <time2, 0 if time1 = time 2), 1 if (time1 > time2)
export function compareTime(time1, time2) {
    return time1.localeCompare(time2);
}