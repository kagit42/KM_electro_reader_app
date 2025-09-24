import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
  type Color,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Bar,
  CartesianChart,
  getTransformComponents,
  setScale,
  setTranslate,
  useChartTransformState,
} from "victory-native";
// import { useDarkMode } from "react-native-dark";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { descriptionForRoute } from "./routes";
import inter from './app/assets/fonts/InterTight-SemiBold.ttf';
import { InfoCard } from "./InfoCard";
import { Button } from "./Button";
import { SizeConfig } from "./app/assets/size/size";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));

export default function BarChartPage() {
  const font = useFont(inter, 12);
  const [data, setData] = useState(DATA(5));
  const [innerPadding, setInnerPadding] = useState(0.33);
  const [roundedCorner, setRoundedCorner] = useState(5);
  const [showLabels, setShowLabels] = useState(false);
  const [labelColor, setLabelColor] = useState<Color>("#262626");
  const [labelPosition, setLabelPosition] = useState<
    "top" | "bottom" | "left" | "right"
  >("top");
  const { state } = useChartTransformState();

  const k = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return state.panActive.value || state.zoomActive.value;
    },
    (cv, pv) => {
      if (!cv && pv) {
        const vals = getTransformComponents(state.matrix.value);
        k.value = vals.scaleX;
        tx.value = vals.translateX;
        ty.value = vals.translateY;

        k.value = withTiming(1);
        tx.value = withTiming(0);
        ty.value = withTiming(0);
      }
    },
  );

  useAnimatedReaction(
    () => {
      return { k: k.value, tx: tx.value, ty: ty.value };
    },
    ({ k, tx, ty }) => {
      const m = setTranslate(state.matrix.value, tx, ty);
      state.matrix.value = setScale(m, k);
    },
  );

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.chart}>
          <CartesianChart
            transformState={state}
            xKey="month"
            padding={5}
            yKeys={["listenCount"]}
            domainPadding={{ left: 50, right: 50, top: 30 }}
            domain={{ y: [0, 100] }}
            xAxis={{
              font,
              tickCount: 5,
              labelColor: 'balck',
              lineWidth: 0,
              formatXLabel: (value) => {
                const date = new Date(2023, value - 1);
                return date.toLocaleString("default", { month: "short" });
              },
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            }}
            frame={{
              lineWidth: 0,
            }}
            yAxis={[
              {
                yKeys: ["listenCount"],
                font,
                linePathEffect: <DashPathEffect intervals={[4, 4]} />,
              },
            ]}
            data={data}
          >
            {({ points, chartBounds }) => {
              return (
                <Bar
                  points={points.listenCount}
                  chartBounds={chartBounds}
                  animate={{ type: "spring" }}
                  innerPadding={innerPadding}
                  roundedCorners={{
                    topLeft: roundedCorner,
                    topRight: roundedCorner,
                  }}
                  labels={{ font, color: labelColor, position: labelPosition }}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 400)}
                    colors={["#a78bfa", "#a78bfa50"]}
                  />
                </Bar>
              );
            }}
          </CartesianChart>
        </View>
        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
         
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => setData((data) => DATA(data.length))}
              title="Shuffle Data"
            />
          </View>
        
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: 'green',
   
  },
  chart: {
    flex: 1.5,
    width : SizeConfig.width * 90
  },
  optionsScrollView: {
    flex: 1,
    backgroundColor: 'balck',
 
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});