import { useRef, useState, useEffect } from 'react';
import { topLeft, useFont } from '@shopify/react-native-skia';
import React from 'react';
import { Easing, Pressable, ScrollView, Text, View } from 'react-native';
import {
  Bar,
  CartesianChart,
  ChartBounds,
  PointsArray,
  useAnimatedPath,
  useBarPath,
} from 'victory-native';
import interBold from './app/assets/fonts/InterTight-Bold.ttf';
import { Path } from '@shopify/react-native-skia';
import BarChartPage from './BarChartPage';

const DATA = [
  { day: 11, highTmp: 725 },
  { day: 12, highTmp: 832 },
  { day: 13, highTmp: 658 },
  { day: 14, highTmp: 960 },
  { day: 15, highTmp: 875 },
  { day: 16, highTmp: 782 },
  { day: 17, highTmp: 959 },
  { day: 18, highTmp: 804 },
  { day: 19, highTmp: 882 },
  { day: 20, highTmp: 718 },
];

const DATA2 = [
  { day: 1, highTmp: 75 },
  { day: 2, highTmp: 82 },
  { day: 3, highTmp: 68 },
  { day: 4, highTmp: 90 },
  { day: 5, highTmp: 85 },
];

// 🔧 utility to normalize datasets
function normalizeData(data: any[], targetLength: number) {
  const copy = [...data];
  while (copy.length < targetLength) {
    copy.push({ ...copy[copy.length - 1] }); // duplicate last point
  }
  return copy.slice(0, targetLength);
}

function MyCustomBars({
  points,
  chartBounds,
  innerPadding,
}: {
  points: PointsArray;
  chartBounds: ChartBounds;
  innerPadding?: number;
}) {
  const { path } = useBarPath(points, chartBounds, innerPadding);
  const animPath = useAnimatedPath(path);

  return <Path path={animPath} style="fill" color="red" />;
}

export default function App() {
 

  return (
    <View style={{ flex: 1, width : '100%', justifyContent: 'center', alignItems: 'center' }}>
      <BarChartPage key={1} />

    </View>
  );
}
