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

export function getTimeForAlarmSettings(currDate) {
    const currHour = convertTime(currDate.getHours());
    const currMin = convertTime(currDate.getMinutes());
    const currSec = convertTime(currDate.getSeconds());

    const time = currHour + ":" + currMin + ":" + "00";

    return time;
}

export function getDayOfWeek(currDate) {
    const dateArray = currDate.split(" ")
    //console.log("ARRAY ===="  + JSON.stringify(dateArray) + monthToIndex(dateArray[1]));
    const dayOfWeekName = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

    const currDayOfWeek = new Date(dateArray[2], monthToIndex(dateArray[1]), dateArray[0]).getDay();
    //console.log("currDate =" + currDate + "currDay = " + currDayOfWeek )

    return dayOfWeekName[currDayOfWeek];
}

function monthToIndex(month) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for(var i = 0; i < 12; i++) {
        if(monthNames[i] === month) {
            return i;
        } 
    }
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

export function isDay2(time) {
    return time < "19:00:00" && time > "07:00:00";
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

// change string like 24:59:59 to 0:59:59
export function resetOverflowTime(time){
    const currHr = parseInt(time.slice(0,2));
    const currMin = parseInt(time.slice(3,5));
    const currSec = parseInt(time.slice(6,8));

    const newHr = currHr -24;

    return newHr + ":" + currMin + ":" + currSec;
}