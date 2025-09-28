import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import CustomFromToDatePickerModal from './components/CustomFromToDatePickerModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyGetAnalyticsQuery } from '../../redux/slices/ocrSlice';
import { NoInternet } from '../../global/modal/NoInternet';
import { ShowToast } from '../../utils/UtilityFunctions';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import LinearGradient from 'react-native-linear-gradient';
import {
  Area,
  Bar,
  CartesianChart,
  Line,
  Scatter,
  useChartPressState,
} from 'victory-native';
import {
  vec,
  Text as SkiaText,
  useFont,
  Path,
  DashPathEffect,
  LinearGradient as SkiaLinearGradient,
} from '@shopify/react-native-skia';
import inter from '../../assets/fonts/InterTight-SemiBold.ttf';
import { useAnimatedReaction } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const FILTERS = ['Monthly', 'Custom', 'Biannual', 'Year', '15 days'] as const;
type FilterKey = 'monthly' | 'biannual' | 'year' | '15 days' | 'custom';

type HomeCompProps = DrawerNavigationProp<NavigationType, 'Home'>;

type DataPoint = { label: string; value: number };

const ExploreMoreAnalytics = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    custom: false,
    monthly: true,
    biannual: false,
    year: false,
    '15 days': false,
  });
  const [isVisible, setVisible] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [peakConsumed, setPeakConsumed] = useState<number>(0);
  const [showNoNetworkModal, setShowNoNetworkModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [selectGrapUi, setGrapUi] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [chartError, setChartError] = useState(false);
  const [isChartReady, setIsChartReady] = useState(false);

  const navigation = useNavigation<HomeCompProps>();
  const [getAnalyticsTrigger] = useLazyGetAnalyticsQuery();

  const isFocused = useIsFocused();
  const { isConnected } = useNetwork();

  const font = useFont(inter, 12);

  const { state } = useChartPressState({
    x: '',
    y: { value: 0 },
  });

  // Local sample data (not used by API flow, but kept for reference/testing)
  const data1: DataPoint[] = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 0 },
    { label: 'Mar', value: 0 },
    { label: 'Apr', value: 0 },
    { label: 'May', value: 0 },
    { label: 'Jun', value: 0 },
    { label: 'Jul', value: 0 },
    { label: 'Aug', value: 0 },
    { label: 'Sep', value: 300 },
    { label: 'Oct', value: 0 },
    { label: 'Nov', value: 0 },
    { label: 'Dec', value: 0 },
  ];

  const data2: DataPoint[] = [
    { label: '01 Sep', value: 100 },
    { label: '02 Sep', value: 200 },
    { label: '03 Sep', value: 0 },
    { label: '04 Sep', value: 0 },
    { label: '05 Sep', value: 0 },
    { label: '06 Sep', value: 0 },
    { label: '07 Sep', value: 0 },
    { label: '08 Sep', value: 0 },
    { label: '09 Sep', value: 0 },
    { label: '10 Sep', value: 0 },
    { label: '11 Sep', value: 0 },
    { label: '12 Sep', value: 0 },
    { label: '13 Sep', value: 0 },
    { label: '14 Sep', value: 0 },
    { label: '15 Sep', value: 0 },
    { label: '16 Sep', value: 0 },
    { label: '17 Sep', value: 0 },
    { label: '18 Sep', value: 0 },
    { label: '19 Sep', value: 0 },
    { label: '20 Sep', value: 0 },
    { label: '21 Sep', value: 0 },
    { label: '22 Sep', value: 0 },
    { label: '23 Sep', value: 0 },
    { label: '24 Sep', value: 0 },
    { label: '25 Sep', value: 0 },
    { label: '26 Sep', value: 0 },
    { label: '27 Sep', value: 0 },
    { label: '28 Sep', value: 0 },
    { label: '29 Sep', value: 0 },
    { label: '30 Sep', value: 0 },
  ];

  const [toggle, setToggle] = useState(false);

  // Refs for cleanup and request staleness
  const mountedRef = useRef(true);
  const lastReqRef = useRef<symbol | null>(null);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
      if (selectionTimerRef.current) clearTimeout(selectionTimerRef.current);
    };
  }, []);

  // Compute a safe chart domain defensively
  const computeDomain = (arr: DataPoint[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return { y: [0, 100] };
    const nums = arr.map(x => (Number.isFinite(x?.value) ? Number(x.value) : 0));
    const maxValue = Math.max(...nums, 0);
    const minValue = Math.min(...nums, 0);
    if (maxValue <= 0 && minValue >= 0) return { y: [0, 100] };
    const padding = Math.max(maxValue * 0.1, 10);
    return { y: [Math.max(0, minValue - padding), maxValue + padding] };
  };

  const chartDomain = computeDomain(data);

  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    if (filter !== 'Custom') {
      getAnalytics({ filter: filter });
    }

    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      custom: key === 'custom',
      monthly: key === 'monthly',
      biannual: key === 'biannual',
      year: key === 'year',
      '15 days': key === '15 days',
    });
  };

  const sanitize = (arr: any[]): DataPoint[] =>
    (Array.isArray(arr) ? arr : [])
      .map((it: any) => ({
        label: typeof it?.label === 'string' ? it.label : String(it?.label ?? ''),
        value: Number.isFinite(Number(it?.value)) ? Number(it.value) : 0,
      }))
      .filter((it: DataPoint) => it.label.length > 0);

  const getAnalytics = async ({ filter }: { filter: string }) => {
    const token = Symbol('request');
    lastReqRef.current = token;
    try {
      setChartError(false);
      setIsChartReady(false);

      const response = await getAnalyticsTrigger({
        filter: filter.toLowerCase() === '15 days' ? '15days' : filter.toLowerCase(),
      });

      if (lastReqRef.current !== token || !mountedRef.current) return;

      const payload = (response as any)?.data?.data;
      if (payload?.usage_breakdown) {
        const cleaned = sanitize(payload.usage_breakdown);
        setPeakConsumed(payload?.cards?.peak_usage?.kwh || 0);
        setData(cleaned);
        setSelectedIndex(0);
        setSelectedValue(cleaned[0]?.value ?? 0);
        setActiveItemIndex(0);
      } else {
        setPeakConsumed(0);
        setData([]);
        setSelectedValue(0);
        setActiveItemIndex(0);
      }

      if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
      readyTimerRef.current = setTimeout(() => {
        if (mountedRef.current) setIsChartReady(true);
      }, 300);
    } catch (error) {
      if (lastReqRef.current !== token) return;
      setChartError(true);
      setData([]);
      setPeakConsumed(0);
      setIsChartReady(true);
      ShowToast({
        title: 'Something Went Wrong',
        description:
          'It may be due to unstable internet. Try again later or a different service.',
        type: 'error',
      });
    }
  };

  // Clamp active index when data changes
  useEffect(() => {
    if (data.length === 0) return;
    setActiveItemIndex(i => {
      const next = typeof i === 'number' ? i : 0;
      return Math.min(Math.max(0, next), data.length - 1);
    });
  }, [data]);

  // Controlled initial selection after data loads
  useEffect(() => {
    if (selectionTimerRef.current) clearTimeout(selectionTimerRef.current);
    selectionTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setActiveItemIndex(0);
      if (data.length > 0) setSelectedValue(data[0]?.value ?? 0);
    }, 1500);
    return () => {
      if (selectionTimerRef.current) clearTimeout(selectionTimerRef.current);
    };
  }, [data]);

  useEffect(() => {
    if (isConnected) {
      setShowNoNetworkModal(false);
      getAnalytics({ filter: 'monthly' });
      setSelectedFilter({
        custom: false,
        monthly: true,
        biannual: false,
        year: false,
        '15 days': false,
      });
    } else {
      setShowNoNetworkModal(true);
      ShowToast({
        title: 'No Service Provider',
        description: 'No Internet connection found !',
        type: 'error',
      });
    }
  }, [isConnected]);

  // Animated reaction with clamping and readiness checks
  useAnimatedReaction(
    () => state.matchedIndex.value,
    matchedIndex => {
      try {
        if (!isChartReady || data.length === 0 || !Number.isFinite(matchedIndex)) return;
        const clamped = Math.min(Math.max(0, Number(matchedIndex)), data.length - 1);
        runOnJS(setActiveItemIndex)(clamped);
        runOnJS(setSelectedValue)(data[clamped]?.value ?? 0);
      } catch (error) {
        // keep quiet in production, log in dev
        if (__DEV__) console.log('Animated reaction error:', error);
      }
    },
  );

  const renderLineChart = () => {
    if (data.length === 0) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No data available</Text>
        </View>
      );
    }

    if (chartError || !font || !isChartReady) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>
            {!font ? 'Loading font…' : !isChartReady ? 'Preparing chart…' : 'Chart loading…'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{
          width: data.length * SizeConfig.width * 18,
          height: SizeConfig.height * 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <CartesianChart
          chartPressState={state}
          xKey="label"
          yKeys={['value']}
          domainPadding={{ left: 30, right: 40, top: 0 }}
          domain={chartDomain}
          animate={{ duration: 500, easing: 'cubicInOut' }}
          xAxis={{
            font,
            tickCount: Math.min(10, data.length),
            labelColor: 'black',
            lineWidth: 0,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          }}
          frame={{
            lineWidth: 0,
          }}
          yAxis={[
            {
              yKeys: ['value'],
              font,
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            },
          ]}
          data={data}
        >
          {({ points, chartBounds }) => {
            const pts = points.value || [];
            const safeIndex = Math.min(Math.max(0, activeItemIndex), Math.max(pts.length - 1, 0));
            const activePoint = pts[safeIndex];

            if (__DEV__) {
              // dev-only log
              // console.log('Active point data:', data[safeIndex]);
            }

            return (
              <>
                <Area
                  points={pts}
                  color="#33479153"
                  y0={chartBounds.bottom}
                  curveType="catmullRom"
                  animate={{ type: 'spring' }}
                />
                <Line
                  points={pts}
                  curveType={'catmullRom'}
                  color={'#334791'}
                  strokeWidth={2}
                  animate={{ type: 'spring' }}
                />
                <Scatter
                  points={pts}
                  radius={5}
                  color={'#334791'}
                  animate={{ type: 'spring' }}
                />

                {activePoint && font && data[safeIndex] && (
                  <SkiaText
                    x={activePoint.x}
                    y={(activePoint.y ?? 0) - 10}
                    text={`${Math.round(Number(data[safeIndex].value ?? 0))}`}
                    font={font}
                    color="black"
                  />
                )}
              </>
            );
          }}
        </CartesianChart>
      </ScrollView>
    );
  };

  const renderBarChart = () => {
    if (data.length === 0) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No data available</Text>
        </View>
      );
    }

    if (chartError || !font || !isChartReady) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>
            {!font
              ? 'Loading font…'
              : !isChartReady
              ? 'Preparing chart…'
              : 'Chart loading…'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{
          width: data.length * SizeConfig.width * 18,
          height: SizeConfig.height * 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <CartesianChart
          chartPressState={state}
          xKey="label"
          yKeys={['value']}
          domainPadding={{ left: 60, right: 80, top: 0 }}
          domain={chartDomain}
          animate={{ duration: 500, easing: 'cubicInOut' }}
          xAxis={{
            font,
            tickCount: Math.min(10, data.length),
            labelColor: 'black',
            lineWidth: 0,
            linePathEffect: <DashPathEffect intervals={[4, 4]} />,
          }}
          frame={{
            lineWidth: 0,
          }}
          yAxis={[
            {
              yKeys: ['value'],
              font,
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            },
          ]}
          data={data}
        >
          {({ points, chartBounds }) => {
            try {
              const pts = points.value || [];
              const safeIndex = Math.min(Math.max(0, activeItemIndex), Math.max(pts.length - 1, 0));
              const activePoint = pts[safeIndex];

              return (
                <>
                  {pts.map((p, i) => (
                    <Bar
                      key={`bar-${i}`}
                      barCount={pts.length}
                      points={[p]}
                      barWidth={30}
                      chartBounds={chartBounds}
                      animate={{ type: 'spring' }}
                      innerPadding={0.33}
                      roundedCorners={{
                        topLeft: 7,
                        topRight: 7,
                        bottomLeft: 7,
                        bottomRight: 7,
                      }}
                    >
                      <SkiaLinearGradient
                        start={vec(0, 0)}
                        end={vec(0, chartBounds.bottom)}
                        colors={
                          i === safeIndex
                            ? ['#334791', '#334791']
                            : ['#33479151', '#3347914F']
                        }
                      />

                      {i === safeIndex && font && data[i] && (
                        <SkiaText
                          x={p.x - 8}
                          y={(p.y ?? 0) - 10}
                          text={`${Math.round(Number(data[i].value ?? 0))}`}
                          font={font}
                          color="black"
                        />
                      )}
                    </Bar>
                  ))}

                  {activePoint && (
                    <Path
                      path={`M ${chartBounds.left} ${activePoint.y} L ${chartBounds.right} ${activePoint.y}`}
                      color={'#334791'}
                      style="stroke"
                      strokeWidth={1}
                    >
                      <DashPathEffect intervals={[6, 6]} />
                    </Path>
                  )}
                </>
              );
            } catch (error) {
              if (__DEV__) console.log('Chart rendering error:', error);
              return null;
            }
          }}
        </CartesianChart>
      </ScrollView>
    );
  };

  const toggleChartType = () => {
    setGrapUi(!selectGrapUi);
  };

  if (__DEV__) {
    // Dev-only logs
    // console.log('Data:', data);
    // console.log('Peak Consumed:', peakConsumed);
    // console.log('Selected Value:', selectedValue);
    // console.log('Chart Ready:', isChartReady);
    // console.log('Font Loaded:', !!font);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#1B2F50'} barStyle={'light-content'} />

      <CustomFromToDatePickerModal
        isVisible={isVisible}
        setVisible={setVisible}
      />

      {isFocused && showNoNetworkModal && (
        <NoInternet showNoNetworkModal={true} />
      )}

      <View style={styles.analyticsContainer}>
        <LinearGradient
          colors={[colors.primary, '#1B2F50']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.linearGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.headerBackBtnComp}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Octicons
                name="arrow-left"
                size={SizeConfig.width * 5}
                color={colors.pureBlack}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Explore More</Text>
          </View>

          <View style={styles.flatListMainComp}>
            <FlatList
              horizontal
              data={FILTERS}
              keyExtractor={item => item}
              contentContainerStyle={styles.filterList}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const key = item.toLowerCase() as FilterKey;
                const isActive = selectedFilter[key];

                return (
                  <Pressable
                    onPress={() => {
                      handleFilterPress(item);
                      if (item === 'Custom') {
                        setVisible(true);
                      }
                    }}
                    style={[
                      styles.filterBtnComp,
                      isActive && styles.filterBtnActive,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${item}`}
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text style={styles.filterBtnText}>{item}</Text>
                  </Pressable>
                );
              }}
            />
          </View>

          <View>
            <Text style={styles.subTitle}>Electricity usage</Text>
            <Text style={styles.mainValue}>{selectedValue || 0} kWh</Text>
          </View>
        </LinearGradient>

        <TouchableOpacity
          onPress={toggleChartType}
          style={styles.changeGrapUiComp}
          hitSlop={20}
        >
          {selectGrapUi ? (
            <MaterialIcons
              name="analytics"
              size={SizeConfig.width * 7}
              color={colors.primary}
            />
          ) : (
            <Ionicons
              name="analytics-sharp"
              size={SizeConfig.width * 7}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>

        <View style={styles.renderMultiGrapMainComp}>
          {selectGrapUi ? renderLineChart() : renderBarChart()}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2F50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SizeConfig.width * 4,
  },
  headerBackBtnComp: {
    backgroundColor: colors.white,
    width: SizeConfig.width * 8,
    height: SizeConfig.width * 8,
    borderRadius: (SizeConfig.width * 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 5,
    color: colors.white,
    width: '100%',
  },
  headerText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.9,
    color: colors.black,
    flex: 1,
    textAlign: 'center',
    paddingRight: SizeConfig.width * 10,
  },
  analyticsContainer: {
    backgroundColor: colors.white,
    gap: SizeConfig.height,
  },
  subTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.white,
  },
  mainValue: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 5.2,
    color: colors.white,
  },
  axisText: {
    color: '#979797',
  },
  axisTextCenter: {
    color: '#979797',
    textAlign: 'center',
  },
  filterList: {
    gap: SizeConfig.width,
    justifyContent: 'space-between',
    paddingHorizontal: SizeConfig.width * 2,
  },
  filterBtnComp: {
    padding: SizeConfig.width * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 5,
    paddingHorizontal: SizeConfig.width * 5,
  },
  filterBtnActive: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  filterBtnText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.pureBlack,
  },
  exitFullScreen: {
    flexDirection: 'row',
    gap: SizeConfig.width,
    backgroundColor: colors.success,
    padding: SizeConfig.width,
    paddingHorizontal: SizeConfig.width * 3,
    paddingVertical: SizeConfig.height,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 3,
  },
  exitFullScrrenBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.black,
  },
  linearGradient: {
    paddingHorizontal: SizeConfig.width * 6,
    paddingTop: SizeConfig.height * 2,
    gap: SizeConfig.height * 2,
    paddingBottom: SizeConfig.height * 4,
    borderBottomRightRadius: SizeConfig.width * 7,
    borderBottomLeftRadius: SizeConfig.width * 7,
  },
  flatListMainComp: {
    paddingVertical: SizeConfig.height * 0.5,
    backgroundColor: '#c8ccd4',
    borderRadius: SizeConfig.width * 10,
    overflow: 'hidden',
  },
  changeGrapUiComp: {
    position: 'absolute',
    top: SizeConfig.height * 29,
    right: SizeConfig.width * 5,
    zIndex: 3,
  },
  renderMultiGrapMainComp: {
    paddingHorizontal: SizeConfig.width * 4,
    paddingTop: SizeConfig.height * 3,
    height: '100%',
  },
  emptyChartContainer: {
    height: SizeConfig.height * 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 2,
  },
  emptyChartText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 4,
    color: '#666',
    textAlign: 'center',
  },
});

export default ExploreMoreAnalytics;