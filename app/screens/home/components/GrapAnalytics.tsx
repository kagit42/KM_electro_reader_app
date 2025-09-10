import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { SizeConfig } from '../../../assets/size/size';
import { useState } from 'react';
import { colors, fonts } from '../../../utils/Theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigationType } from '../../../navigations/NavigationType';

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

const GrapAnalytics = ({ data }: any) => {
  const safeData = Array.isArray(data) ? data : [];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [selectedValue, setSelectedValue] = useState<number | null>(
    safeData.length > 0 ? safeData[0].value : 0,
  );

  console.log('data analytics ', data);

  const navigation = useNavigation<HomeCompProps>();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subTitle}>Electricity usage</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.mainValue}>
            {selectedValue} KWh
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ExploreMoreAnalytics');
          }}
          activeOpacity={0.5}
          style={styles.iconWrapper}
        >
          <MaterialIcons
            name="open-in-full"
            size={SizeConfig.width * 4}
            color={colors.black}
          />
        </TouchableOpacity>
      </View>

      <BarChart
        key="bar"
        data={safeData?.map((item: any, index: number) => ({
          ...item,
          frontColor: index === selectedIndex ? '#334791' : '#3347914F',
          gradientColor: index === selectedIndex ? '#334791' : '#3347914F',
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
        showGradient
        barBorderRadius={SizeConfig.width * 2}
        onPress={(item: { value: number; label: string }, index: number) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    overflow: 'hidden',
    gap: SizeConfig.height * 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.pureBlack,
  },
  mainValue: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.pureBlack,
    width: SizeConfig.width * 45,
  },
  iconWrapper: {
    width: SizeConfig.width * 8,
    height: SizeConfig.width * 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: (SizeConfig.width * 8) / 2,
    elevation: 3,
    marginRight: SizeConfig.width,
    marginTop: SizeConfig.width,
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
