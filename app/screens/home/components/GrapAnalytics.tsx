import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors, fonts } from '../../../util/Theme';
import { SizeConfig } from '../../../assets/size/size';

const GrapAnalytics = ({ selectedFilter }: any) => {
  const data1 = [
    {
      value: 2100,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jan',
    },
    {
      value: 3200,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Feb',
    },
    {
      value: 4100,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Mar',
    },
    {
      value: 5000,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Apr',
    },
    {
      value: 2700,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'May',
    },
    {
      value: 4400,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jun',
    },
    {
      value: 3000,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jul',
    },
    {
      value: 5200,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Aug',
    },
    {
      value: 3900,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Sep',
    },
    {
      value: 4600,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Oct',
    },
  ];

  const data2 = [
    {
      value: 1800,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jan',
    },
    {
      value: 2900,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Feb',
    },
    {
      value: 3600,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Mar',
    },
    {
      value: 4700,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Apr',
    },
    {
      value: 2600,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'May',
    },
    {
      value: 4200,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jun',
    },
    {
      value: 2800,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jul',
    },
    {
      value: 5100,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Aug',
    },
    {
      value: 3500,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Sep',
    },
    {
      value: 4900,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Oct',
    },
  ];

  const data3 = [
    {
      value: 2000,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jan',
    },
    {
      value: 3100,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Feb',
    },
    {
      value: 4300,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Mar',
    },
    {
      value: 4800,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Apr',
    },
    {
      value: 2500,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'May',
    },
    {
      value: 4700,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jun',
    },
    {
      value: 3200,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Jul',
    },
    {
      value: 5300,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Aug',
    },
    {
      value: 3800,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
      label: 'Sep',
    },
    {
      value: 4700,
      frontColor: '#4D96FF',
      gradientColor: '#A9C9FF',
      spacing: SizeConfig.width * 5,
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
        spacing={SizeConfig.width * 7}
        barBorderRadius={SizeConfig.width * 2}
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
        lineConfig={{
          color: '#F29C6E',
          thickness: 3,
          curved: true,
          hideDataPoints: true,
          shiftY: 20,
          initialSpacing: -30,
        }}
        height={SizeConfig.height * 33}
      />
    </View>
  );
};
export default GrapAnalytics;
