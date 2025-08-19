import React, { memo, useState } from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, COLORS, fonts } from '../../util/Theme';
import { LineChart } from 'react-native-gifted-charts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MetrialIcons from 'react-native-vector-icons/MaterialIcons';
import { SizeConfig } from '../../assets/size/size';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const chartData = [
  { value: 0, label: 'Jan' },
  { value: 150, label: 'Feb' },
  { value: 80, label: 'Mar' },
  { value: 100, label: 'Apr' },
  { value: 120, label: 'May' },
  { value: 100, label: 'Jun' },
  { value: 300, label: 'Jul' },
  { value: 100, label: 'Aug' },
  { value: 120, label: 'Sep' },
  { value: 200, label: 'Oct' },
  { value: 180, label: 'Nov' },
  { value: 150, label: 'Dec' },
];

type FilterKey = 'month' | 'biannual' | 'year';
const FILTERS = ['Month', 'Biannual', 'Year'] as const;

const ExploreMore = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    month: true,
    biannual: false,
    year: false,
  });

  const [expanded, setExpanded] = useState(true);

  const filterMainAnimationStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(
        expanded ? SizeConfig.width * 10 : SizeConfig.width * 55,
      ),

      borderRadius: withSpring(
        expanded ? SizeConfig.width * 5 : SizeConfig.width * 2,
      ),
    };
  });

  const filterBtnAnimationStyle = useAnimatedStyle(() => {
    return {
      display: expanded ? 'none' : 'flex',
    };
  });

  const handlePress = () => {
    setExpanded(prev => !prev);
  };
  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      month: key === 'month',
      biannual: key === 'biannual',
      year: key === 'year',
    });
  };

  const renderStatCard = (
    title: string,
    value: string,
    iconColor: string,
    bgColor: string,
    iconName: string = 'electric-bolt',
    fluctuations: string = '+2.3%',
  ) => (
    <Pressable style={styles.statCard}>
      <View style={styles.statContent}>
        <View style={[styles.statIconContainer, { backgroundColor: bgColor }]}>
          <MetrialIcons
            name={iconName}
            size={
              iconName === 'electric-bolt'
                ? SizeConfig.width * 5
                : SizeConfig.width * 7
            }
            color={iconColor}
          />
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{title}</Text>
        </View>
      </View>
      <Text style={styles.statGrowth}>{fluctuations}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons
            name="arrow-back"
            size={SizeConfig.width * 5}
            color={COLORS.color_1A1A1A}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView>
        <View style={styles.pageBg}>
          {/* Filter + Logo + Stats */}
          <View style={styles.sectionContainer}>
            {/* <View style={styles.filterContainer}>
              {FILTERS.map(type => {
                const key = type.toLowerCase() as FilterKey;
                const isActive = selectedFilter[key];
                return (
                  <Pressable
                    key={type}
                    onPress={() => handleFilterPress(type)}
                    style={[
                      styles.filterBtnComp,
                      isActive && styles.filterBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBtnText,
                        { color: isActive ? colors.white : colors.textGray },
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: SizeConfig.height * 2,
              }}
            >
              <View>
                <Image
                  source={require('../../assets/images/global/logo.png')}
                  style={styles.logo}
                />

                <View style={styles.textContainer}>
                  <Text style={styles.locationText}>RR Nagara</Text>
                  <Text style={styles.priceText}>₹2,500</Text>
                  <View style={styles.growthContainer}>
                    <Text style={styles.growthText}>+10.2 %</Text>
                    <Ionicons
                      name="arrow-up"
                      size={SizeConfig.width * 4}
                      color={COLORS.success}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: SizeConfig.width * 3,
                }}
              >
                <Animated.View
                  style={[
                    {
                      backgroundColor: colors.lightBorder,
                      // borderRadius: SizeConfig.width * 2,
                      height: SizeConfig.width * 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      // gap: SizeConfig.width,
                      paddingVertical: SizeConfig.width,
                    },
                    filterMainAnimationStyle,
                  ]}
                >
                  {FILTERS.map(type => {
                    const key = type.toLowerCase() as FilterKey;
                    const isActive = selectedFilter[key];
                    return (
                      <Animated.View
                        key={type}
                        style={[styles.filterBtnComp, filterBtnAnimationStyle]}
                      >
                        <Pressable onPress={() => handleFilterPress(type)}>
                          <Text
                            style={[
                              styles.filterBtnText,
                              {
                                color: isActive
                                  ? colors.primary
                                  : colors.textGray,
                              },
                            ]}
                          >
                            {type}
                          </Text>
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                  <Ionicons
                    name="filter"
                    size={SizeConfig.width * 4}
                    color={COLORS.color_1A1A1A}
                    style={{
                      marginRight: expanded ? 0 : SizeConfig.width * 2,
                    }}
                    onPress={handlePress}
                  />
                </Animated.View>
                <TouchableOpacity
                  style={{
                    width: SizeConfig.width * 10,
                    height: SizeConfig.width * 10,
                    backgroundColor: colors.lightBorder,
                    borderRadius: SizeConfig.width * 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: SizeConfig.width * 2,
                  }}
                >
                  <Ionicons
                    name="share-social"
                    size={SizeConfig.width * 4}
                    color={COLORS.color_1A1A1A}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              curved
              color={'#1E90FF'}
              startFillColor={'#1E90FF'}
              endFillColor={'#1E90FF'}
              startOpacity={0.15}
              endOpacity={0.01}
              hideDataPoints
              hideRules
              yAxisThickness={0}
              xAxisThickness={0}
              hideYAxisText
              areaChart
              height={SizeConfig.height * 30}
              xAxisLabelTextStyle={styles.xAxisLabel}
            />
          </View>

          {/* Usage Stats */}
          <View style={styles.usageContainer}>
            {/* Last Reading */}
            <View style={styles.lastReadingBox}>
              <FontAwesome
                name="lightbulb-o"
                size={SizeConfig.width * 4}
                color={COLORS.color_1A1A1A}
              />
              <Text style={styles.lastReadingText}>
                Last Reading did at 19/02/2024 10:00 AM.
              </Text>
            </View>
            <View style={styles.statsRow}>
              {renderStatCard(
                'Total Usage ( kWh )',
                '1,247',
                colors.success,
                '#d1ffbd64',
                'electric-meter',
              )}
              {renderStatCard(
                'Avg Usage ( kWh/day )',
                '147',
                colors.primary,
                '#4d97ff4e',
                'electric-bolt',
                '+1.5%',
              )}
            </View>

            {/* Peak Usage */}
            <Text style={styles.usageTitle}>Peak Electricity Usage</Text>
            <View style={styles.usageList}>
              {[
                { month: 'July', color: colors.error, value: '18.2 kWh' },
                { month: 'March', color: colors.warning, value: '32.2 kWh' },
                { month: 'January', color: colors.success, value: '02.2 kWh' },
              ].map(item => (
                <View key={item.month} style={styles.usageItem}>
                  <View style={styles.usageLeft}>
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.usageMonth}>{item.month}</Text>
                  </View>
                  <Text style={styles.usageValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Energy Tip */}
            <View style={styles.tipBox}>
              <FontAwesome
                name="leaf"
                size={SizeConfig.width * 4.5}
                color={COLORS.color_1A1A1A}
              />
              <View>
                <Text style={styles.tipTitle}>Energy Saving Tip</Text>
                <Text style={styles.tipText}>
                  Consider using energy-efficient appliances during off-peak
                  hours (01 PM - 02 PM) to save up to 30% on your electricity
                  bill.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(ExploreMore);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  pageBg: { backgroundColor: colors.color_FAFAFA },
  header: {
    paddingVertical: SizeConfig.height * 2,
    paddingHorizontal: SizeConfig.width * 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColor,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SizeConfig.width * 2,
  },
  headerTitle: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 4.5,
    color: COLORS.color_1A1A1A,
    textAlign: 'center',
    width: '100%',
    paddingRight: SizeConfig.width * 9,
  },
  sectionContainer: {
    backgroundColor: colors.color_FAFAFA,
    paddingHorizontal: SizeConfig.width * 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SizeConfig.height * 2,
    gap: SizeConfig.width * 3,
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 2,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  filterBtnComp: {
    padding: SizeConfig.width,
    paddingHorizontal: SizeConfig.width * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 2,
    margin: SizeConfig.width * 0.5,
  },
  filterBtnActive: { backgroundColor: colors.primary },
  filterBtnText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
  },
  logo: { width: SizeConfig.width * 14, height: SizeConfig.width * 14 },
  textContainer: { gap: SizeConfig.height * 0.2 },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.width * 4.5,
    color: COLORS.color_1A1A1A,
  },
  priceText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.width * 5,
    color: COLORS.color_1A1A1A,
  },
  growthContainer: { flexDirection: 'row', alignItems: 'center' },
  growthText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 3.5,
    color: COLORS.success,
  },
  chartContainer: { paddingHorizontal: SizeConfig.width * 3 },
  xAxisLabel: {
    color: '#555',
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 3.2,
  },
  lastReadingBox: {
    padding: SizeConfig.width * 2.5,
    backgroundColor: '#ff9966',
    borderRadius: SizeConfig.width * 2,
    marginTop: SizeConfig.height * 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SizeConfig.width * 3,
  },
  lastReadingText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 3,
    color: COLORS.color_1A1A1A,
  },
  usageContainer: {
    gap: SizeConfig.height * 2,
    paddingHorizontal: SizeConfig.width * 4,
    paddingVertical: SizeConfig.height * 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SizeConfig.width * 3,
  },
  statCard: {
    backgroundColor: colors.white,
    padding: SizeConfig.width * 3,
    borderRadius: SizeConfig.width * 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  statContent: { gap: SizeConfig.width * 2 },
  statIconContainer: {
    padding: SizeConfig.width * 1.5,
    borderRadius: SizeConfig.width * 2,
    width: SizeConfig.width * 10,
    height: SizeConfig.width * 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: { gap: SizeConfig.width },
  statValue: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4.5,
    color: COLORS.color_1A1A1A,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3,
    color: COLORS.color_1A1A1A,
  },
  statGrowth: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.success,
  },
  usageTitle: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 4.3,
    color: COLORS.color_1A1A1A,
  },
  usageList: { width: SizeConfig.width * 70, gap: SizeConfig.height * 0.3 },
  usageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SizeConfig.width * 2,
  },
  dot: {
    width: SizeConfig.width * 2,
    height: SizeConfig.width * 2,
    borderRadius: SizeConfig.width,
  },
  usageMonth: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.width * 4,
    color: COLORS.color_1A1A1A,
  },
  usageValue: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 4,
    color: COLORS.color_1A1A1A,
  },
  tipBox: {
    padding: SizeConfig.width * 4,
    backgroundColor: colors.light_green,
    borderRadius: SizeConfig.width * 2,
    marginTop: SizeConfig.height * 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SizeConfig.width * 3,
  },
  tipTitle: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 3.8,
    color: COLORS.color_1A1A1A,
  },
  tipText: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.width * 3.3,
    color: COLORS.color_1A1A1A,
    width: SizeConfig.width * 80,
  },
});
