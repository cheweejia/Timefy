import React, { useEffect, useState, } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export function getTime(currDate) {
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
    //return currDate.getSeconds() % 2 === 0;

}

// -1 if time1 <time2, 0 if time1 = time 2), 1 if (time1 > time2)
export function compareTime(time1, time2) {
    return time1.localeCompare(time2);
}

export function convertSecToTime(sec) {
    const newHr = convertTime(Math.floor(sec/ 3600));
    const newMin = convertTime(Math.floor((sec - newHr * 3600)/ 60));
    const newSec = convertTime((sec - newHr * 3600 - newMin * 60))
    console.log(newHr + ":" + newMin + ":" + newSec);
    return newHr + ":" + newMin + ":" + newSec;
}

export function convertTimeToSec(time) {
    const currHr = parseInt(time.slice(0,2));
    const currMin = parseInt(time.slice(3,5));
    const currSec = parseInt(time.slice(6,8));
    console.log(currHr * 3600 + currMin * 60 +  currSec);
    return currHr * 3600 + currMin * 60 +  currSec;
}