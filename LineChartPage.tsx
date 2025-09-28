import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Button,
  View,
} from 'react-native';
import {
  CartesianChart,
  Area,
  Line,
  Scatter,
  useChartPressState,
} from 'victory-native';
import { Text as SkiaText, useFont } from '@shopify/react-native-skia';
import inter from './app/assets/fonts/InterTight-Medium.ttf';
import { useAnimatedReaction } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { SizeConfig } from './app/assets/size/size';

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;

export default function LineChartPage() {
  const font = useFont(inter, 13);
  // Note: the state.x / state.y types must match your data shape
  const { state } = useChartPressState({ x: 0, y: { value: 0 } });
  const [activeItemIndex, setActiveItemIndex] = React.useState(-1);
  const [toggle, setToggle] = React.useState(false);

  useAnimatedReaction(
    () => state.matchedIndex.value,
    matchedIndex => {
      if (matchedIndex !== -1) {
        runOnJS(setActiveItemIndex)(matchedIndex);
      }
    },
  );

  // dataset: monthly (only one non-zero for demo)
  const data1 = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 180 },
    { label: 'Apr', value: 200 },
    { label: 'May', value: 250 },
    { label: 'Jun', value: 300 },
    { label: 'Jul', value: 270 },
    { label: 'Aug', value: 310 },
    { label: 'Sep', value: 400 },
    { label: 'Oct', value: 280 },
    { label: 'Nov', value: 260 },
    { label: 'Dec', value: 350 },
  ];

  const data2 = [
    { label: '01 Sep', value: 100 },
    { label: '02 Sep', value: 200 },
    { label: '03 Sep', value: 150 },
    { label: '04 Sep', value: 250 },
    { label: '05 Sep', value: 180 },
    { label: '06 Sep', value: 220 },
    { label: '07 Sep', value: 300 },
    { label: '08 Sep', value: 270 },
    { label: '09 Sep', value: 260 },
    { label: '10 Sep', value: 280 },
    { label: '11 Sep', value: 240 },
    { label: '12 Sep', value: 210 },
    { label: '13 Sep', value: 230 },
    // { label: '14 Sep', value: 290 },
    // { label: '15 Sep', value: 310 },
    // { label: '16 Sep', value: 270 },
    // { label: '17 Sep', value: 260 },
    // { label: '18 Sep', value: 300 },
    // { label: '19 Sep', value: 320 },
    // { label: '20 Sep', value: 280 },
    // { label: '21 Sep', value: 250 },
    // { label: '22 Sep', value: 270 },
    // { label: '23 Sep', value: 260 },
    // { label: '24 Sep', value: 310 },
    // { label: '25 Sep', value: 330 },
    // { label: '26 Sep', value: 290 },
    // { label: '27 Sep', value: 300 },
    // { label: '28 Sep', value: 340 },
    // { label: '29 Sep', value: 360 },
    // { label: '30 Sep', value: 400 },
  ];

  // const data2 = [
  //   { label: 'Jan', value: 90 },
  //   { label: 'Feb', value: 140 },
  //   { label: 'Mar', value: 170 },
  //   { label: 'Apr', value: 220 },
  //   { label: 'May', value: 280 },
  //   { label: 'Jun', value: 260 },
  //   { label: 'Jul', value: 310 },
  //   { label: 'Aug', value: 330 },
  //   { label: 'Sep', value: 370 },
  //   { label: 'Oct', value: 320 },
  //   { label: 'Nov', value: 290 },
  //   { label: 'Dec', value: 410 },
  // ];

  const data = toggle ? data1 : data2;

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          width: Math.max(500, data.length * 50), // dynamic width
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <CartesianChart
            data={data}
            xKey="label"
            yKeys={['value']}
            chartPressState={state}
            domainPadding={{ left: 20, right: 20, top: 30 }}
            padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
            // Enable animations at the chart level
            animate={{ type: 'timing', duration: 1000 }}
            axisOptions={{
              font,
              tickCount: Math.min(5, data.length),
              formatXLabel: (value: any) => {
                // value is your label or index, so just return it
                return String(value);
              },
              lineColor: '#333',
              labelColor: 'black',
            }}
          >
            {({ points, chartBounds }) => {
              const pts = points.value; // points array
              const activePoint = pts[activeItemIndex];
              return (
                <>
                  <Area
                    points={pts}
                    y0={chartBounds.bottom}
                    curveType="catmullRom"
                    color="pink"
                    animate={{ type: 'spring' }}
                    // Remove individual animation props - let chart handle it
                  />
                  <Line
                    points={pts}
                    curveType="catmullRom"
                    color="red"
                    strokeWidth={2}
                    animate={{ type: 'spring' }}
                    // Remove individual animation props - let chart handle it
                  />
                  <Scatter
                    points={pts}
                    radius={5}
                    color="green"
                    animate={{ type: 'spring' }}
                    // Remove individual animation props - let chart handle it
                  />
                  {activePoint && font && (
                    <SkiaText
                      x={activePoint.x}
                      y={activePoint.y - 15}
                      text={`${activePoint.y.toFixed(0)}`}
                      font={font}
                      color="black"
                    />
                  )}
                </>
              );
            }}
          </CartesianChart>
        </View>
      </ScrollView>

      <Button title="Toggle Data" onPress={() => setToggle(!toggle)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: 'white',
  },
});
