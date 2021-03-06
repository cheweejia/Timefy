import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React, { useEffect, useState, } from 'react';
import { getTime, getDate, convertSecToTime, convertTimeToSec, resetOverflowTime } from './TimeTools';

export function addAlarm(newAlarmTime, newAlarmDate, currListOfAlarm) {
    const newAlarmList = [
        {
            time: newAlarmTime,
            date: newAlarmDate,
            isOn: true,
            isSnooze: false,
            snoozeDuration: 30,
            repeat: [true, true, true, true, true, true, true],
            oriTime: newAlarmTime,
            oriDate: newAlarmDate,
            isDelete: false
        }
        , ...currListOfAlarm
    ];

    return newAlarmList;
}

export function deleteAlarm(index, currListOfAlarm) {
    const newAlarmList = [
        ...currListOfAlarm.slice(0, index),
        ...currListOfAlarm.slice(index + 1)
    ];

    return newAlarmList;
}

export function resetAllAlarm() {
    const newAlarmList = [];
    return newAlarmList;
}

export function toggleAlarm(alarm, index, currListOfAlarm) {
    const newAlarmList = [
        ...currListOfAlarm.slice(0, index),
        {
            time: alarm.time,
            date: alarm.date,
            isOn: !alarm.isOn,
            isSnooze: alarm.isSnooze,
            snoozeDuration: alarm.snoozeDuration,
            repeat: alarm.repeat,
            oriTime: alarm.time,
            oriDate: alarm.date,
            isDelete: alarm.isDelete
        },
        ...currListOfAlarm.slice(index + 1)
    ];
    console.log(newAlarmList);

    return newAlarmList;
}

//////////////////////////////////////////////////////////////
export function toggleDelete(alarm, index, currListOfAlarm) {
    const newAlarmList = [
        ...currListOfAlarm.slice(0, index),
        {
            time: alarm.time,
            date: alarm.date,
            isOn: alarm.isOn,
            isSnooze: alarm.isSnooze,
            snoozeDuration: alarm.snoozeDuration,
            repeat: alarm.repeat,
            oriTime: alarm.time,
            oriDate: alarm.date,
            isDelete: !alarm.isDelete
        },
        ...currListOfAlarm.slice(index + 1)
    ];
    console.log(newAlarmList);

    return newAlarmList;
}

// function setDelete(index, currListOfAlarm) {
//     const alarm = currListOfAlarm[index];
//     const newAlarmList = [
//         ...currListOfAlarm.slice(0, index),
//         {
//             time: alarm.time,
//             date: alarm.date,
//             isOn: alarm.isOn,
//             isSnooze: alarm.isSnooze,
//             snoozeDuration: alarm.snoozeDuration,
//             repeat: alarm.repeat,
//             oriTime: alarm.time,
//             oriDate: alarm.date,
//             isDelete: false
//         },
//         ...currListOfAlarm.slice(index + 1)
//     ];
//     console.log(newAlarmList);

//     return newAlarmList;
// }

// export function resetAllDelete(currListOfAlarm) {
//     var newAlarmList = currListOfAlarm ;

//     for (var i = 0; i < currListOfAlarm.length ; i++) {
//         newAlarmList = setDelete(i, newAlarmList);
//     }

//     return newAlarmList;
// }

export function deleteToggledAlarm(currListOfAlarm) {
    const newAlarmList = [];

    for(var i = 0; i < currListOfAlarm.length; i++) {
        if(!currListOfAlarm[i].isDelete) {
            newAlarmList.push(currListOfAlarm[i]);
        }
    }

    return newAlarmList;
}

////////////////////////////////////////////////////////////////////////

export function snoozeAlarm(index, currListOfAlarm) {
    const newSnoozeTime = convertSecToTime(convertTimeToSec(getTime(new Date())) + currListOfAlarm[index].snoozeDuration);
    const alarm = currListOfAlarm[index];

    var newAlarmList = [];

    if (alarm.snoozeDuration > 0) {
         newAlarmList = [
            ...currListOfAlarm.slice(0, index),
            {
                time: newSnoozeTime > "23:59:59" ? resetOverflowTime(newSnoozeTime) : newSnoozeTime,
                date: newSnoozeTime > "23:59:59" ? getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) : getDate(new Date()),
                isOn: alarm.isOn,
                isSnooze: true,
                snoozeDuration: alarm.snoozeDuration,
                repeat: alarm.repeat,
                oriTime: alarm.oriTime,
                oriDate: alarm.oriDate, 
                isDelete: alarm.isDelete
            },
            ...currListOfAlarm.slice(index + 1)
        ];
    } else {
        newAlarmList = dismissAlarm(index, currListOfAlarm);
    }

    return newAlarmList;
}

export function dismissAlarm(index, currListOfAlarm) {
    const alarm = currListOfAlarm[index];

    const today = new Date();
    const dayOfTheWeek = today.getUTCDay();

    var next = -1;
    for (var i = dayOfTheWeek + 1; i <= dayOfTheWeek + 6; i++) {
        if (alarm.repeat[i % 7]) {
            next = i;
            break;
        }
    }

    next = next === 0 ? 7 - today.getUTCDat() : next - today.getUTCDay();

    const newAlarmList = next < 0
        ? deleteAlarm(index, currListOfAlarm)
        : [
            ...currListOfAlarm.slice(0, index),
            {
                time: alarm.oriTime,
                date: getDate(new Date(new Date().getTime() + next * 24 * 60 * 60 * 1000)),
                isOn: alarm.isOn,
                isSnooze: false,
                snoozeDuration: alarm.snoozeDuration,
                repeat: alarm.repeat,
                oriTime: alarm.oriTime,
                oriDate: alarm.oriDate,
                isDelete: alarm.isDelete

            }
            ,
            ...currListOfAlarm.slice(index + 1)
        ]
    console.log(currListOfAlarm)
    console.log(next);
    console.log(newAlarmList)
    return newAlarmList;
}

export function changeSnoozeDuration(index, currListOfAlarm, newSnoozeDuration) {
    const alarm = currListOfAlarm[index];

    console.log("INPUT NEW SNOOZE DURATION" + newSnoozeDuration)

    const newAlarmList = [
        ...currListOfAlarm.slice(0, index),
        {
            time: alarm.time,
            date: alarm.date,
            isOn: alarm.isOn,
            isSnooze: alarm.isSnooze,
            snoozeDuration: newSnoozeDuration,
            repeat: alarm.repeat,
            oriTime: alarm.time,
            oriDate: alarm.date,
            isDelete: alarm.isDelete

        },
        ...currListOfAlarm.slice(index + 1)
    ]
    console.log(newAlarmList);
    return newAlarmList;
}

export function changeRepeatDay(index, currListOfAlarm, newRepeatDay){
    const alarm = currListOfAlarm[index]
    const newAlarmList = [
        ...currListOfAlarm.slice(0, index),
        {
            time: alarm.time,
            date: alarm.date,
            isOn: alarm.isOn,
            isSnooze: alarm.isSnooze,
            snoozeDuration: alarm.snoozeDuration,
            repeat: newRepeatDay,
            oriTime: alarm.time,
            oriDate: alarm.date,
            isDelete: alarm.isDelete

        },
        ...currListOfAlarm.slice(index + 1)
    ]

    return newAlarmList;

};

export function changeDate(index, currListOfAlarm, newDate){
    const alarm = currListOfAlarm[index]
    const newAlarmList = [
        ...currListOfAlarm.slice(0, index),
        {
            time: alarm.time,
            date: newDate,
            isOn: alarm.isOn,
            isSnooze: alarm.isSnooze,
            snoozeDuration: alarm.snoozeDuration,
            repeat: alarm.repeat,
            oriTime: alarm.time,
            oriDate: alarm.date,
            isDelete: alarm.isDelete

        },
        ...currListOfAlarm.slice(index + 1)
    ]

    return newAlarmList;

};

export function changeTime(index, currListOfAlarm, newTime){
    const alarm = currListOfAlarm[index]
    const newAlarmList = [
        ...currListOfAlarm.slice(0, index),
        {
            time: newTime,
            date: alarm.date,
            isOn: alarm.isOn,
            isSnooze: alarm.isSnooze,
            snoozeDuration: alarm.snoozeDuration,
            repeat: alarm.repeat,
            oriTime: alarm.time,
            oriDate: alarm.date,
            isDelete: alarm.isDelete

        },
        ...currListOfAlarm.slice(index + 1)
    ]

    return newAlarmList;

};