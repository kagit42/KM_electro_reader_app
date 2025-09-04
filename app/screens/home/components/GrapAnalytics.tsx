import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SizeConfig } from '../../../assets/size/size';
import { useState } from 'react';
import { colors, fonts } from '../../../utils/Theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import { NavigationType } from '../../../navigations/NavigationType';

type HomeCompProps = DrawerNavigationProp<NavigationType, 'Home'>;

const GrapAnalytics = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const navigation = useNavigation<HomeCompProps>();

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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subTitle}>Electricity usage</Text>
          <Text style={styles.mainValue}>140.65KWh</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ExploreMoreAnalytics');
          }}
          activeOpacity={0.5}
          style={styles.iconWrapper}
        >
          <MaterialIcons
            name="fullscreen"
            size={SizeConfig.width * 5.7}
            color={colors.black}
          />
        </TouchableOpacity>
      </View>

      {/* Line Chart */}
      <LineChart
        areaChart
        data={data1}
        thickness={3}
        height={SizeConfig.height * 30}
        spacing={SizeConfig.width * 13}
        width={SizeConfig.width * 74}
        startOpacity={0.8}
        endOpacity={0.1}
        yAxisThickness={0}
        xAxisType="dashed"
        xAxisColor="#979797"
        yAxisColor="#979797"
        rulesColor="#979797"
        dashGap={5}
        stepValue={1000}
        maxValue={6000}
        noOfSections={6}
        yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisTextCenter}
        color1="#49B02D"
        startFillColor="#49B02D"
        endFillColor="#49B02D"
        // startFillColor="rgba(60,179,113,0.35)"
        // endFillColor="rgba(60,179,113,0.05)"
        onPress={(item: { value: number; label: string }, index: number) =>
          setSelectedIndex(index === selectedIndex ? null : index)
        }
        // pointerConfig={{
        //   pointerStripHeight: 160,
        //   pointerStripColor: 'gray',
        //   pointerStripWidth: 2,
        //   pointerColor: 'blue',
        //   radius: 6,
        //   pointerLabelComponent: items => {
        //     return (
        //       <View
        //         style={{
        //           paddingHorizontal: 6,
        //           paddingVertical: 4,
        //           backgroundColor: 'white',
        //           borderRadius: 4,
        //         }}
        //       >
        //         <Text>{items[0].value}</Text>
        //       </View>
        //     );
        //   },
        // }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: SizeConfig.width * 4,
    overflow: 'hidden',
    borderRadius: SizeConfig.width * 3,
    borderWidth: 0.7,
    borderColor: colors.border,
    gap: SizeConfig.height * 2,
    marginHorizontal: SizeConfig.width * 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  iconWrapper: {
    paddingHorizontal: SizeConfig.width * 3,
  },
  axisText: {
    color: '#979797',
  },
  axisTextCenter: {
    color: '#979797',
    textAlign: 'center',
  },
});

export default GrapAnalytics;
