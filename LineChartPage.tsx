import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Button } from 'react-native';
import {
  Area,
  CartesianChart,
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
const DATA = (numberPoints = 13) =>
  Array.from({ length: numberPoints }, (_, i) => ({
    day: i + 1,
    sales: randomNumber(),
  }));

export default function LineChartPage() {
  const font = useFont(inter, 13);
  const [data, setData] = React.useState(DATA());
  const { state } = useChartPressState({ x: 0, y: { sales: 0 } });
  const [activeItemIndex, setActiveItemIndex] = React.useState(0);

  useAnimatedReaction(
    () => state.matchedIndex.value,
    matchedIndex => {
      if (matchedIndex !== -1) {
        runOnJS(setActiveItemIndex)(matchedIndex);
      }
    },
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        contentContainerStyle={{
          width: 400,
          height: SizeConfig.height * 70,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <CartesianChart
          xKey="day"
          yKeys={['sales']}
          padding={5}
          data={data}
          chartPressState={state}
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
        >
          {({ points, chartBounds }) => {
            const activePoint = points.sales[activeItemIndex];

            return (
              <>
                <Area
                  points={points.sales}
                  color="pink"
                  y0={chartBounds.bottom}
                  curveType="catmullRom"
                  animate={{ type: 'timing' }}
                />
                <Line
                  points={points.sales}
                  curveType={'catmullRom'}
                  color={'red'}
                  strokeWidth={5}
                  animate={{ type: 'spring' }}
                />
                <Scatter
                  points={points.sales}
                  radius={10}
                  color={'green'}
                  animate={{ type: 'timing' }}
                />

                {activePoint && (
                  <SkiaText
                    x={activePoint.x}
                    y={activePoint.y - 10}
                    text={`${activePoint.y}`}
                    font={font}
                    color="black"
                  />
                )}
              </>
            );
          }}
        </CartesianChart>
      </ScrollView>

      {/* <ScrollView style={styles.controls}> */}
      <Button title="Shuffle Data" onPress={() => setData(DATA())} />
      <Button
        title="Add Point"
        onPress={() =>
          setData(d => [...d, { day: d.length + 1, sales: randomNumber() }])
        }
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: { flex: 1, backgroundColor: 'white' },
  controls: { padding: 16 },
});
