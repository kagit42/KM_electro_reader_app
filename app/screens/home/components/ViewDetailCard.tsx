import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors, fonts } from '../../../utils/Theme';
import { SizeConfig } from '../../../assets/size/size';
import CustomButton from '../../../global/CustomButton';
import { NavigationType } from '../../../navigations/NavigationType';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

type HomeCompProps = DrawerNavigationProp<NavigationType, 'Home'>;

interface dataType {
  channel: string;
  image_url: string;
  meter_reading: string;
  outlet: string;
  region: string;
  serial_number: string;
  status: boolean;
  verify_time: string;
  timestamp: string;
}

const ViewDetailCard = ({ data }: { data: dataType }) => {
  const navigation = useNavigation<HomeCompProps>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DetailScreen', { data: data });
      }}
      activeOpacity={0.8}
      style={styles.referralItem}
    >
      <View
        style={[
          styles.statusComp,
          {
            backgroundColor: data?.status
              ? 'rgba(188, 248, 162, 0.56)'
              : '#ffc8c8',
          },
        ]}
      >
        {/* <View style={styles.statusPoint} /> */}

        <Image
          source={
            data?.status
              ? require('../../../assets/images/home/verified.png')
              : require('../../../assets/images/home/unVerified.png')
          }
          style={{
            width: SizeConfig.width * 3.5,
            height: SizeConfig.width * 3.5,
            resizeMode: 'contain',
          }}
        />

        <Text style={[styles.statusText, { color: colors.pureBlack }]}>
          {' '}
          {data?.status ? 'Approved' : 'Pending'}
        </Text>
      </View>

      <View
        style={{
          gap: SizeConfig.height * 0.8,
        }}
      >
        <View style={styles.referralRow}>
          <View style={styles.referralIconRow}>
            <MaterialIcons
              name="solar-power"
              size={SizeConfig.width * 4}
              color={colors.secondary}
            />
            <Text style={styles.referralLabel}>Power used</Text>
          </View>
          <View
            style={[
              styles.referralIconRow,
              {
                alignItems: 'center',
                gap: SizeConfig.width,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.referralValue, { color: colors.error }]}
            >
              {data?.meter_reading ?? '--'}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-up"
              size={SizeConfig.width * 4}
              color={colors.error}
            />
          </View>
        </View>

        <View style={styles.referralRow}>
          <View style={styles.referralIconRow}>
            <Entypo
              name="shop"
              size={SizeConfig.width * 4}
              color={colors.secondary}
            />
            <Text style={styles.referralLabel}>Outlet</Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.referralValue}
          >
            {data?.outlet ?? '--'}
          </Text>
        </View>

        <View style={styles.referralRow}>
          <View style={styles.referralIconRow}>
            <MaterialIcons
              name="electric-meter"
              size={SizeConfig.width * 4.5}
              color={colors.secondary}
            />
            <Text style={styles.referralLabel}>Meter Number</Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.referralValue}
          >
            {data?.serial_number ?? '--'}
          </Text>
        </View>

        <View style={styles.referralRow}>
          <View style={styles.referralIconRow}>
            <MaterialIcons
              name="date-range"
              size={SizeConfig.width * 4}
              color={colors.secondary}
            />
            <Text style={styles.referralLabel}>Date</Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.referralValue}
          >
            {data?.verify_time ?? '--'}
          </Text>
        </View>
      </View>

      <CustomButton
        text="View Detail"
        linearGradientColor={[colors.primary, colors.secPrimary]}
        linearGradientStyle={styles.buttonComp}
        TextStyle={{
          fontFamily: fonts.medium,
          fontSize: SizeConfig.fontSize * 3,
        }}
        onPress={() => {
          navigation.navigate('DetailScreen', { data: data });
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  statusComp: {
    alignSelf: 'flex-start',
    // width: SizeConfig.width * 25,
    borderRadius: SizeConfig.width * 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SizeConfig.width,
    paddingVertical: SizeConfig.width,
    paddingHorizontal: SizeConfig.width * 3,
  },
  statusPoint: {
    width: SizeConfig.width * 2,
    height: SizeConfig.width * 2,
    borderRadius: (SizeConfig.width * 2) / 2,
    backgroundColor: '#83A63BFF',
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: '#83A63BFF',
  },
  referralRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  referralIconRow: {
    flexDirection: 'row',
    gap: SizeConfig.width * 2,
    alignItems: 'center',
  },
  referralLabel: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.4,
    color: colors.secondary,
  },
  referralValue: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.pureBlack,
    width: SizeConfig.width * 45,
    textAlign: 'right',
  },
  viewDetailComp: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.success,
    borderRadius: SizeConfig.width * 2,
    borderWidth: 0.5,
    paddingVertical: SizeConfig.width * 1.5,
    width: '100%',
    // flexDirection: 'row',
  },
  viewDetailText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.white,
  },
  referralItem: {
    gap: SizeConfig.height * 2,
    backgroundColor: colors.white,
    padding: SizeConfig.width * 3,
    borderRadius: SizeConfig.width * 3,
    borderWidth: 0.7,
    borderColor: colors.border,
  },
  buttonComp: {
    paddingVertical: SizeConfig.width * 1,
    width: '28%',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
});

export default ViewDetailCard;
