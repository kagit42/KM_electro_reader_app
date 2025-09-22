import {
  LinearGradient,
  useFont,
  vec,
  Text as SkiaText,
} from '@shopify/react-native-skia';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Bar, CartesianChart, useChartPressState } from 'victory-native';
import inter from './app/assets/fonts/InterTight-Medium.ttf';
import { SizeConfig } from './app/assets/size/size';

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));

const DATA1 = [
  { month: 11, listenCount: 725 },
  { month: 12, listenCount: 832 },
  { month: 13, listenCount: 658 },
  { month: 14, listenCount: 960 },
  { month: 15, listenCount: 875 },
  { month: 16, listenCount: 782 },
  { month: 17, listenCount: 959 },
  { month: 18, listenCount: 804 },
  { month: 19, listenCount: 882 },
  { month: 20, listenCount: 718 },
];

const DATA2 = [
  { month: 1, listenCount: 75 },
  { month: 2, listenCount: 82 },
  { month: 3, listenCount: 68 },
  { month: 4, listenCount: 90 },
  { month: 5, listenCount: 85 },
];

export default function BarChartCustomBarsPage() {
  const font = useFont(inter, 12);
  const [data] = useState(DATA());
  const [innerPadding] = useState(0.33);
  const [roundedCorner] = useState(5);
  const { state } = useChartPressState({
    x: 0,
    y: { listenCount: 0 },
  });
  const [toggle, setToggle] = useState(false);

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  useAnimatedReaction(
    () => state.matchedIndex.value,
    matchedIndex => {
      runOnJS(setActiveItemIndex)(matchedIndex);
    },
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <Text style={styles.title}>
          Bar Chart with children + gesture customization (press a bar)
        </Text>
        <ScrollView
            contentContainerStyle={{
              width: SizeConfig.width * 200,
              // height: SizeConfig.height * 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            horizontal
          >
        <CartesianChart
          chartPressState={state}
          xKey="month"
          padding={5}
          yKeys={['listenCount']}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          domain={{ y: [0, 100] }}
          axisOptions={{
            font,
            tickCount: 5,
            formatXLabel: value => {
              const date = new Date(2023, value - 1);
              return date.toLocaleString('default', { month: 'short' });
            },
            lineColor: '#2626c5ff',
            labelColor: 'white',
          }}
          data={toggle ? DATA1 : DATA2}
        >
          {({ points, chartBounds }) => {
            return points.listenCount.map((p, i) => {
              return (
                <Bar
                  barCount={points.listenCount.length}
                  key={i}
                  points={[p]}
                  chartBounds={chartBounds}
                  animate={{ type: 'spring' }}
                  innerPadding={innerPadding}
                  
                  roundedCorners={{
                    topLeft: roundedCorner,
                    topRight: roundedCorner,
                  }}
                >
                  {i == activeItemIndex ? (
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 400)}
                      colors={['green', 'blue']}
                    />
                  ) : (
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 400)}
                      colors={['#a78bfa', '#a78bfa50']}
                    />
                  )}
                  {i == activeItemIndex ? (
                    <SkiaText
                      x={p.x} // x coordinate of the bar
                      y={p.y - 10} // a little above the bar
                      text={`${p.y}`} // display the value
                      font={font}
                      color="black"
                      // textAlign="center"
                    />
                  ) : null}
                </Bar>
              );
            });
          }}
        </CartesianChart>
        <Pressable onPress={() => setToggle(!toggle)}>
          <Text style={{ marginTop: 20, fontSize: 16 }}>Press</Text>
        </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    // $dark: {
    //   backgroundColor: appColors.viewBackground.dark,
    // },
    marginHorizontal: 15,
  },
  chart: {
    minHeight: 400,
    marginBottom: 30,
  },
  optionsScrollView: {
    flex: 1,
    backgroundColor: 'white',
    // $dark: {
    //   backgroundColor: appColors.viewBackground.dark,
    // },
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: { marginBottom: 10, fontSize: 16, fontWeight: 'bold' },
});
