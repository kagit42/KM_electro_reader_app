import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors, fonts } from '../../../util/Theme';
import { SizeConfig } from '../../../assets/size/size';
import { useState } from 'react';

const GrapAnalytics = ({ selectedFilter }: any) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const data1 = [
    {
      value: 2100,
      label: 'Jan',
    },
    {
      value: 3200,
      label: 'Feb',
    },
    {
      value: 4100,
      label: 'Mar',
    },
    {
      value: 5000,
      label: 'Apr',
    },
    {
      value: 2700,
      label: 'May',
    },
    {
      value: 4400,
      label: 'Jun',
    },
    {
      value: 3000,
      label: 'Jul',
    },
    {
      value: 5200,
      label: 'Aug',
    },
    {
      value: 3900,
      label: 'Sep',
    },
    {
      value: 4600,
      label: 'Oct',
    },
  ];

  const data2 = [
    {
      value: 1800,
      label: 'Jan',
    },
    {
      value: 2900,
      label: 'Feb',
    },
    {
      value: 3600,
      label: 'Mar',
    },
    {
      value: 4700,
      label: 'Apr',
    },
    {
      value: 2600,
      label: 'May',
    },
    {
      value: 4200,
      label: 'Jun',
    },
    {
      value: 2800,
      label: 'Jul',
    },
    {
      value: 5100,
      label: 'Aug',
    },
    {
      value: 3500,
      label: 'Sep',
    },
    {
      value: 4900,
      label: 'Oct',
    },
  ];

  const data3 = [
    {
      value: 2000,
      label: 'Jan',
    },
    {
      value: 3100,
      label: 'Feb',
    },
    {
      value: 4300,
      label: 'Mar',
    },
    {
      value: 4800,
      label: 'Apr',
    },
    {
      value: 2500,
      label: 'May',
    },
    {
      value: 4700,
      label: 'Jun',
    },
    {
      value: 3200,
      label: 'Jul',
    },
    {
      value: 5300,
      label: 'Aug',
    },
    {
      value: 3800,
      label: 'Sep',
    },
    {
      value: 4700,
      label: 'Oct',
    },
  ];

  return (
    <View>
      <BarChart
        data={
          selectedFilter.month ? data1 : selectedFilter.biannual ? data2 : data3
        }
        barWidth={SizeConfig.width * 7}
        initialSpacing={SizeConfig.width * 3}
        spacing={SizeConfig.width * 6}
        barBorderRadius={SizeConfig.width * 2}
        frontColor={'#4D96FF'}
        gradientColor={'#A9C9FF'}
        showGradient
        yAxisThickness={0}
        xAxisType={'dashed'}
        xAxisColor={'lightgray'}
        yAxisTextStyle={{ color: 'lightgray' }}
        stepValue={1000}
        maxValue={6000}
        noOfSections={6}
        yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
        xAxisLabelTextStyle={{ color: 'lightgray', textAlign: 'center' }}
        showLine
        labelWidth={40}
        lineConfig={{
          color: '#F29C6E',
          thickness: 3,
          curved: true,
          hideDataPoints: true,
          shiftY: 20,
          initialSpacing: -30,
        }}
        height={SizeConfig.height * 33}
        onPress={(item: { value: string }, index: number) => {
          setSelectedIndex(index === selectedIndex ? null : index);
        }}
        // 👇 Tooltip that shows only for the selected bar
        renderTooltip={(item: { value: string }, index: number) => {
          if (selectedIndex === index) {
            return (
              <Text
                style={{
                  color: colors.white,
                  backgroundColor: colors.color_1A1A1A,
                  fontFamily: fonts.medium,
                  fontSize: SizeConfig.fontSize * 3,
                  padding: SizeConfig.width,
                  borderRadius: SizeConfig.width * 2,
                  paddingHorizontal: SizeConfig.width * 1.7,
                }}
              >
                {` ${item.value}`}
              </Text>
            );
          }
          return <></>;
        }}
      />
      );
    </View>
  );
};
export default GrapAnalytics;
