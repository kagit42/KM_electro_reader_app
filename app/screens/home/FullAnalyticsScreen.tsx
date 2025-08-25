import React, { useState } from 'react';
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
import { LineChart } from 'react-native-gifted-charts';
import CustomFromToDatePickerModal from './components/CustomFromToDatePickerModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FILTERS = ['Month', 'Custom', 'Biannual', 'Year', '15 days'] as const;
type FilterKey = 'month' | 'biannual' | 'year' | '15 days' | 'custom';

const FullAnalyticsScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
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

  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      custom: key === 'custom',
      month: key === 'month',
      biannual: key === 'biannual',
      year: key === 'year',
      '15 days': key === '15 days',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />

      <CustomFromToDatePickerModal
        isVisible={isVisible}
        setVisible={setVisible}
      />

      <View style={styles.analyticsContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={styles.subTitle}>Peak Electricity usage</Text>
            <Text style={styles.mainValue}>140.65 KWh</Text>
          </View>

          <TouchableOpacity activeOpacity={0.5} style={styles.exitFullScreen}>
            <MaterialIcons
              name="fullscreen-exit"
              size={SizeConfig.width * 5}
              color={colors.black}
            />
            <Text style={styles.exitFullScrrenBtnText}>Home</Text>
          </TouchableOpacity>
        </View>

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
                  setVisible(true);
                }}
                style={[
                  styles.filterBtnComp,
                  isActive && styles.filterBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    {
                      color: isActive ? colors.primary : colors.secondary,
                      fontFamily: isActive ? fonts.semiBold : fonts.medium,
                    },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />

        <LineChart
          areaChart
          data={data1}
          thickness={3}
          height={SizeConfig.height * 68}
          spacing={SizeConfig.width * 13}
          width={SizeConfig.width * 90}
          startOpacity={0.8}
          endOpacity={0.1}
          yAxisThickness={0}
          xAxisType="dashed"
          xAxisColor="#979797"
          yAxisColor="#979797"
          rulesColor="#979797"
          dashGap={5}
          stepValue={1000}
          maxValue={9000}
          noOfSections={8}
          yAxisLabelTexts={[
            '0',
            '1k',
            '2k',
            '3k',
            '4k',
            '5k',
            '6k',
            '7k',
            '8k',
            '9k',
          ]}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisTextCenter}
          color1="#49B02D"
          startFillColor="#49B02D"
          endFillColor="#49B02D"
          onPress={(item: { value: number; label: string }, index: number) =>
            setSelectedIndex(index === selectedIndex ? null : index)
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  analyticsContainer: {
    backgroundColor: colors.white,
    padding: SizeConfig.width * 4,
    gap: SizeConfig.height * 2,
  },
  subTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.secondary,
  },
  mainValue: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.black,
  },
  axisText: {
    color: '#979797',
  },
  axisTextCenter: {
    color: '#979797',
    textAlign: 'center',
  },
  filterList: {
    gap: SizeConfig.width * 3,
    paddingVertical: SizeConfig.height,
  },
  filterBtnComp: {
    padding: SizeConfig.width * 2,
    width: SizeConfig.width * 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 5,
    margin: SizeConfig.width * 0.5,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  filterBtnActive: {
    backgroundColor: colors.white,
    elevation: 5,
  },
  filterBtnText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.secondary,
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
});

export default FullAnalyticsScreen;
