// ISSUE : how to i make sure that it rerenders when its pass 7pm ??

import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Animated, Text } from 'react-native';
import { isDay } from '../components/TimeTools';

const { height } = Dimensions.get('screen');
const SIZE = height * 0.35;
const TICK_INTERVAL = 1000;

function Clock() {
  const [index, setIndex] = useState(new Animated.Value(0));
  const [tick, setTick] = useState(new Animated.Value(0));
  const [scales, setScales] = useState([...Array(6).keys()].map(() => new Animated.Value(0)))
  const [smallQuadranScale, mediumQuadranScale, bigQuadranScale, secondsScale, minutesScale, hoursScale] = scales;

  const secondDegrees = Animated.multiply(index, 6);

  const interpolated = {
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  };

  const transformSeconds = {
    transform: [{ rotate: secondDegrees.interpolate(interpolated) }, { scale: secondsScale }],
  };

  const rotateMinutes = Animated.divide(secondDegrees, new Animated.Value(60));
  const transformMnutes = {
    transform: [{ rotate: rotateMinutes.interpolate(interpolated) }, { scale: minutesScale }],
  };

  const rotateHours = Animated.divide(secondDegrees, new Animated.Value(3600));
  const transformHours = {
    transform: [{ rotate: rotateHours.interpolate(interpolated) }, { scale: hoursScale }],
  };

  let _timer = 0;
  let _ticker = null;

  const initiateClock = () => {
    const currentDate = new Date();
    // hours * 3600(1hr) * 5(1 unit) && + 1 for initial error 
    _timer = currentDate.getHours() * 3600 * 5 + currentDate.getMinutes() * 60 + currentDate.getSeconds() + 1;

    //initial position
    tick.setValue(_timer);
    // initial animation
    index.setValue(_timer - 30);

    animateClock();

    // 1 hr = 3600*12 
    _ticker = setInterval(() => {
      _timer += 1;
      tick.setValue(_timer);
    }, TICK_INTERVAL);
  };

  const animateClock = () => {
    const scaleStaggerAnimations = scales.map(animated => {
      return Animated.spring(animated, {
        toValue: 1,
        tension: 18,
        friction: 3,
        useNativeDriver: true
      })
    })

    Animated.parallel([
      Animated.stagger(TICK_INTERVAL / scales.length, scaleStaggerAnimations),
      Animated.timing(index, {
        toValue: tick,
        duration: TICK_INTERVAL / 2,
        useNativeDriver: true,
      })
    ]).start();

  };

  useEffect(() => {
    initiateClock();
    return () => {
      // componentWillUnmount events
      clearInterval(_ticker);
      _ticker = null;
    };
  }, []);

  // Customise Changable Clock Quadrant Color -> 7am -7pm day
  const MediumQuadDynamicColorStyle = {
    backgroundColor: (isDay(new Date())) ? 'rgba(252, 150, 1, 0.6)' : 'rgba(18, 47, 80, 0.7)'
  }
  const BigQuadDynamicColorStyle = {
    backgroundColor: (isDay(new Date())) ? 'rgba(252, 150, 1, 0.6)' : 'rgba(18, 47, 80, 0.7)',
  }

  return (
      <Animated.View style={styles.container}>
        <Animated.View style={[styles.bigQuadran, { transform: [{ scale: bigQuadranScale }]}, BigQuadDynamicColorStyle]} />
        <Animated.View style={[styles.mediumQuadran, { transform: [{ scale: mediumQuadranScale}]}, MediumQuadDynamicColorStyle]} />
        <Animated.View style={[styles.smallQuadran]} />
        <Animated.View style={[styles.mover, transformHours]}>
          <Animated.View style={[styles.hours]} />
        </Animated.View>
        <Animated.View style={[styles.mover, transformMnutes]}>
          <Animated.View style={[styles.minutes]} />
        </Animated.View>
        <Animated.View style={[styles.mover, transformSeconds]}>
          <Animated.View style={[styles.seconds]} />
        </Animated.View>
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  mover: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  hours: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '30%',
    marginTop: '20%',
    width: 4,
    borderRadius: 4,
  },
  minutes: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '42%',
    marginTop: '8%',
    width: 3,
    borderRadius: 3,
  },
  seconds: {
    backgroundColor: 'rgba(227,71,134,1)',
    height: '42%',
    marginTop: '15%',
    width: 2,
    borderRadius: 2,
  },
  bigQuadran: {
    width: SIZE * 0.8,
    height: SIZE * 0.8,
    borderRadius: SIZE * 0.4,
    position: 'absolute',
  },
  mediumQuadran: {
    width: SIZE * 0.5,
    height: SIZE * 0.5,
    borderRadius: SIZE * 0.25,
    position: 'absolute',
  },
  smallQuadran: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(227, 71, 134, 1)',
    position: 'absolute',
  },
});

export default Clock;