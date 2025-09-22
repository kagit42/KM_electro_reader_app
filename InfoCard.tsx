import * as React from "react";
import { View, StyleSheet, type ViewStyle, type StyleProp } from "react-native";
import type { PropsWithChildren } from "react";

export const InfoCard = ({
  style,
  children,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) => {
  const isDark = true;
  return (
    <View style={[styles.card, style]}>
      <View style={styles.content}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
   
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 15,
  },
  text: {
    flex: 1,
  },
});