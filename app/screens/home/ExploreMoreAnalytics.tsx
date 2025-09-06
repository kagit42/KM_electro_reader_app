import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import {
  BarChart,
  DataPointProps,
  LineChart,
} from 'react-native-gifted-charts';
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

const FILTERS = ['Month', 'Custom', 'Biannual', 'Year', '15 days'] as const;
type FilterKey = 'month' | 'biannual' | 'year' | '15 days' | 'custom';

type HomeCompProps = DrawerNavigationProp<NavigationType, 'Home'>;

const data1 = [
  { value: 2100, label: 'Jan' },
  { value: 1200, label: 'Feb' },
  { value: 2090, label: 'Mar' },
  { value: 5000, label: 'Apr' },
  { value: 2700, label: 'May' },
  { value: 4400, label: 'Jun' },
  { value: 3000, label: 'Jul' },
  { value: 5200, label: 'Aug' },
  { value: 3900, label: 'Sep' },
  { value: 4600, label: 'Oct' },
];

const ExploreMoreAnalytics = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    custom: false,
    month: true,
    biannual: false,
    year: false,
    '15 days': false,
  });
  const [isVisible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [peakConsumed, setPeakConsumed] = useState<number>(0);
  const [showNoNetworkModal, setShowNoNetworkModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(
    data1[0].value,
  );
  const [selectGrapUi, setGrapUi] = useState(false);

  const navigation = useNavigation<HomeCompProps>();
  const [getAnalyticsTrigger] = useLazyGetAnalyticsQuery();

  const isFocused = useIsFocused();
  const { isConnected } = useNetwork();

  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    if (filter != 'Custom') {
      getAnalytics({ filter: filter });
    }

    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      custom: key === 'custom',
      month: key === 'month',
      biannual: key === 'biannual',
      year: key === 'year',
      '15 days': key === '15 days',
    });
  };

  const getAnalytics = async ({ filter }: { filter: string }) => {
    try {
      console.log(filter);

      let response = await getAnalyticsTrigger({
        filter:
          filter.toLocaleLowerCase() == '15 days'
            ? '15days'
            : filter.toLocaleLowerCase(),
      });
      console.log(response);

      setPeakConsumed(response?.data?.data?.cards?.peak_usage?.kwh);
      setData(response?.data?.data?.usage_breakdown);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      setShowNoNetworkModal(false);
      getAnalytics({ filter: '15 days' });
    } else {
      setShowNoNetworkModal(true);
      ShowToast({
        title: 'No Service Provider',
        description: 'No Internet connection found !',
        type: 'error',
      });
    }
  }, [isConnected]);

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
              onPress={() => {
                navigation.goBack();
              }}
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
                    onPress={data => {
                      handleFilterPress(item);

                      if (item == 'Custom') {
                        setVisible(true);
                      }
                    }}
                    style={[
                      styles.filterBtnComp,
                      isActive && styles.filterBtnActive,
                    ]}
                  >
                    <Text style={styles.filterBtnText}>{item}</Text>
                  </Pressable>
                );
              }}
            />
          </View>

          <View>
            <Text style={styles.subTitle}>Electricity usage</Text>
            <Text style={styles.mainValue}>{selectedValue} kWh</Text>
          </View>
        </LinearGradient>

        <TouchableOpacity
          onPress={() => {
            setGrapUi(!selectGrapUi);
          }}
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
          {selectGrapUi ? (
            <LineChart
              key="line"
              data={data1.map((item, index) => ({
                ...item,
                dataPointText: index === selectedIndex ? item.value + '' : '',
                labelTextStyle: {
                  color: index === selectedIndex ? '#334791' : '#3347914F',
                },
              }))}
              focusEnabled
              showStripOnFocus
              textColor1={colors.pureBlack}
              textFontSize1={SizeConfig.fontSize * 4}
              textShiftY={-5}
              textShiftX={10}
              areaChart
              thickness={3}
              height={SizeConfig.height * 55}
              spacing={SizeConfig.width * 10}
              width={SizeConfig.width * 90}
              startOpacity={0.4}
              endOpacity={0}
              yAxisThickness={0}
              xAxisThickness={0}
              rulesThickness={0}
              dashGap={5}
              // maxValue={peakConsumed + 10000}
              maxValue={5200 + 1000}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisTextCenter}
              color1={colors.primary}
              thickness1={SizeConfig.width * 0.4}
              startFillColor={colors.secPrimary}
              endFillColor={colors.secPrimary}
              onFocus={(
                item: { value: number; lable: string; dataPointText: string },
                index: number,
              ) => {
                if (index !== selectedIndex) {
                  setSelectedIndex(index);
                  setSelectedValue(item.value);
                }
              }}
              showReferenceLine1={selectedValue !== null}
              referenceLine1Position={selectedValue || 0}
              referenceLine1Config={{
                color: colors.secPrimary,
                dashWidth: 4,
                dashGap: 4,
                thickness: 2,
              }}
            />
          ) : (
            <BarChart
              key="bar"
              data={data1.map((item, index) => ({
                ...item,
                frontColor: index === selectedIndex ? '#334791' : '#3347914F',
                gradientColor:
                  index === selectedIndex ? '#334791' : '#3347914F',
                labelTextStyle: {
                  color: index === selectedIndex ? '#334791' : '#3347914F',
                },
              }))}
              yAxisThickness={0}
              xAxisType="dashed"
              dashWidth={0}
              noOfSections={6}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisTextCenter}
              height={SizeConfig.height * 55}
              showGradient
              maxValue={5200 + 1000}
              barBorderRadius={SizeConfig.width * 2}
              onPress={(
                item: { value: number; label: string },
                index: number,
              ) => {
                setSelectedIndex(index);
                setSelectedValue(item.value);
              }}
              showReferenceLine1={selectedValue !== null}
              referenceLine1Position={selectedValue || 0}
              referenceLine1Config={{
                color: colors.secPrimary,
                dashWidth: 4,
                dashGap: 4,
                thickness: 2,
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1f44ff',
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
    // padding: SizeConfig.width * 4,
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
});

export default ExploreMoreAnalytics;
