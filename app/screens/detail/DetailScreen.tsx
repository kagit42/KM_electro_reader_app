import React, { useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import PreviewImageModal from '../../global/modal/PreviewImageModal';
import { formatDate } from '../../utils/UtilityFunctions';
import LinearGradient from 'react-native-linear-gradient';

type DetailScreenProps = DrawerScreenProps<NavigationType, 'DetailScreen'>;

const DetailScreen = ({ navigation, route }: DetailScreenProps) => {
  // const data = route?.params?.data;
  const data = {
    serial_number: 'SN-2025-0002',
    timestamp: '2025-09-01T10:30:00Z',
    meter_reading: '876 kWh',
    verify_time: '2025-09-01 11:05 AM',
    status: false,
    region: 'South Zone',
    outlet: 'Green Energy Pvt Ltd',
    image_url: '',
    channel: '',
  };

  console.log(data);

  const viewShotRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = () => {
    setTimeout(async () => {
      try {
        const uri = await captureRef(viewShotRef, {
          format: 'png',
          quality: 0.8,
        });
        await Share.open({
          url: uri,
          type: 'image/png',
          title: 'Share Payment Details',
        });
      } catch (error) {
        console.error('Error capturing or sharing screenshot:', error);
      }
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={'#1B2F50'} barStyle="light-content" />

      <ViewShot
        ref={viewShotRef}
        style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      >
        <LinearGradient
          colors={[colors.primary, '#1B2F50']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.headerBackBtnComp}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={require('../../assets/images/profile/backArrow.png')}
                style={{
                  width: SizeConfig.width * 5,
                  height: SizeConfig.width * 5,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reading Information</Text>
          </View>
        </LinearGradient>

        <PreviewImageModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />

        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary,
          }}
        >
          <View style={styles.scrollViewMainComp}>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <MaterialIcons
                name="share"
                size={SizeConfig.width * 6}
                color={colors.pureBlack}
              />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.row}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/images/details/meter.png')}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.overlay}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.clickToView}>Click to view</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.sectionTitle}>Details :</Text>

                  <View style={styles.infoRow}>
                    <View style={styles.iconLabelRow}>
                      <MaterialIcons
                        name="confirmation-number"
                        size={SizeConfig.width * 4.5}
                        color={colors.primary}
                      />
                      <Text style={styles.label}>Serial Number</Text>
                    </View>
                    <Text style={styles.value}>
                      {data.serial_number ?? '--'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconLabelRow}>
                      <MaterialIcons
                        name="schedule"
                        size={SizeConfig.width * 4.5}
                        color={colors.primary}
                      />
                      <Text style={styles.label}>Captured Time</Text>
                    </View>
                    <Text style={styles.value}>
                      {formatDate(data?.timestamp)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconLabelRow}>
                      <MaterialIcons
                        name="bolt"
                        size={SizeConfig.width * 4.9}
                        color={colors.primary}
                      />
                      <Text style={styles.label}>Power Consumed</Text>
                    </View>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text
                        style={[
                          styles.value,
                          { color: colors.error, fontFamily: fonts.semiBold },
                        ]}
                      >
                        {data?.meter_reading ?? '--'}
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-up"
                        size={SizeConfig.width * 5}
                        color={colors.error}
                      />
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconLabelRow}>
                      <MaterialIcons
                        name="verified"
                        size={SizeConfig.width * 4.8}
                        color={colors.primary}
                      />
                      <Text style={styles.label}>Verified Time</Text>
                    </View>
                    <Text style={styles.value}>
                      {data?.verify_time ?? '--'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconLabelRow}>
                      <MaterialIcons
                        name="check-circle"
                        size={SizeConfig.width * 4.5}
                        color={colors.primary}
                      />
                      <Text style={styles.label}>Status</Text>
                    </View>
                    <Text
                      style={[
                        styles.value,
                        {
                          color: data?.status ? colors.success : colors.warning,
                          fontFamily: fonts.semiBold,
                        },
                      ]}
                    >
                      {data?.status ? 'Verified' : 'Pending'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconLabelRow}>
                      <MaterialIcons
                        name="location-on"
                        size={SizeConfig.width * 4.8}
                        color={colors.primary}
                      />
                      <Text style={styles.label}>Region</Text>
                    </View>
                    <Text style={styles.value}>{data?.region}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconLabelRow}>
                      <MaterialIcons
                        name="apartment"
                        size={SizeConfig.width * 4.5}
                        color={colors.primary}
                      />
                      <Text style={styles.label}>Outlet</Text>
                    </View>
                    <Text style={styles.value}>{data?.outlet}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ViewShot>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B2F50' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SizeConfig.height * 3,
    paddingHorizontal: SizeConfig.width * 6,
    gap: SizeConfig.width * 4,
  },
  headerTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 5,
    color: colors.white,
    width: '100%',
  },

  scrollContainer: { paddingHorizontal: SizeConfig.width * 4 },
  row: { gap: SizeConfig.width * 3 },
  imageContainer: {
    width: '70%',
    height: SizeConfig.height * 25,
    overflow: 'hidden',
    borderRadius: SizeConfig.width * 3,
    alignSelf: 'center',
    marginTop: SizeConfig.height * 10,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.44)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickToView: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.8,
    color: colors.white,
    textAlign: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: SizeConfig.height * 2,
    paddingHorizontal: SizeConfig.width * 4,
    paddingVertical: SizeConfig.height * 3,
    borderRadius: SizeConfig.width * 3,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.pureBlack,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  iconLabelRow: {
    flexDirection: 'row',
    gap: SizeConfig.width * 2,
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.primary,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.pureBlack,
  },
  footer: {
    backgroundColor: colors.white,
    paddingVertical: SizeConfig.height * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SizeConfig.width * 5,
    borderTopRightRadius: SizeConfig.width * 7,
    borderTopLeftRadius: SizeConfig.width * 7,
    borderColor: colors.border,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: SizeConfig.height * 3,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: SizeConfig.width * 8,
    top: SizeConfig.height * 3,
    zIndex: 2,
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.white,
  },
  headerBackBtnComp: {
    backgroundColor: colors.white,
    width: SizeConfig.width * 8,
    height: SizeConfig.width * 8,
    borderRadius: (SizeConfig.width * 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewMainComp: {
    overflow: 'hidden',
    borderTopLeftRadius: SizeConfig.width * 7,
    borderTopRightRadius: SizeConfig.width * 7,
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default DetailScreen;
