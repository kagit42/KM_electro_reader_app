import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SizeConfig } from '../../assets/size/size';
import GrapAnalytics from './components/GrapAnalytics';
import { colors, fonts } from '../../utils/Theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ViewDetailCard from './components/ViewDetailCard';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import * as Keychain from 'react-native-keychain';
import { useGetProfileDataMutation } from '../../redux/slices/profileSlice';
import { useLazyGetOcrReadingsQuery } from '../../redux/slices/ocrSlice';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { ShowToast } from '../../utils/UtilityFunctions';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { NoInternet } from '../../global/modal/NoInternet';
import { useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { DummyMeterReadingData } from './DummyMeterReadingData';
import { copilot, CopilotStep, walkthroughable } from 'react-native-copilot';

const FILTERS = ['15 days', 'Month', 'Biannual', 'Year'] as const;
type FilterKey = 'month' | 'biannual' | 'year' | '15 days';

interface meterReadingDataType {
  channel: string;
  image_url: string;
  meter_reading: string;
  outlet: string;
  region: string;
  serial_number: string;
  status: boolean;
  verify_time: string;
}

type HomeProps = DrawerScreenProps<NavigationType, 'Home'>;

const Home = ({ navigation }: HomeProps) => {
  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    '15 days': true,
    month: false,
    biannual: false,
    year: false,
  });
  const [data, setData] = useState<any>([]);
  const [showNoNetworkModal, setShowNoNetworkModal] = useState(false);

  const { isConnected } = useNetwork();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const WalkthroughableTouchable = walkthroughable(TouchableOpacity);

  const [getProfileDataTrigger] = useGetProfileDataMutation();
  const [getOcrReadingsHistoryTrigger] = useLazyGetOcrReadingsQuery();

  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      '15 days': key === '15 days',
      month: key === 'month',
      biannual: key === 'biannual',
      year: key === 'year',
    });
  };

  const checkUser = async () => {
    try {
      const sendOtpObject = await Keychain.getGenericPassword({
        service: 'otp_section',
      });

      if (!sendOtpObject) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SendOtp' }],
        });
        return;
      }

      let convertToString: any = {};
      try {
        convertToString = JSON.parse(sendOtpObject.password || '{}');
      } catch {
        convertToString = {};
      }

      if (convertToString?.mobile_number) {
        const response = await getProfileDataTrigger({
          mobileNumber: convertToString.mobile_number,
        }).unwrap();

        if (response?.user_data) {
          let steingfyProfile = JSON.stringify(response?.user_data);

          try {
            await Keychain.setGenericPassword('profileData', steingfyProfile, {
              service: 'profileData_service',
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SendOtp' }],
          });
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SendOtp' }],
        });
      }
    } catch (error) {
      console.log(error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'SendOtp' }],
      });
    }
  };

  const OcrReadingsHistory = async () => {
    try {
      setData([]);
      let response = await getOcrReadingsHistoryTrigger({
        page: 1,
      }).unwrap();
      setData(response.results);
      console.log(response.results.slice(5));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCameraPermission = async () => {
    try {
      if (hasPermission === null) {
        return;
      }

      if (!hasPermission) {
        const granted = await requestPermission();

        if (granted) {
          if (device != null) {
            navigation.navigate('OcrScreen');
          } else {
            ShowToast({
              description: 'No camera device found on this device.',
              title: 'Camera Not Available',
              type: 'error',
            });
          }
        } else {
          const status = await Camera.getCameraPermissionStatus();

          if (status === 'denied') {
            ShowToast({
              description:
                'Camera permission is blocked. Enable it from Settings.',
              title: 'Permission Required',
              type: 'error',
            });
          } else {
            ShowToast({
              description: 'Camera access is needed to continue.',
              title: 'Permission Required',
              type: 'error',
            });
          }
        }
      } else {
        if (device != null) {
          navigation.navigate('OcrScreen');
        } else {
          ShowToast({
            description: 'No camera device found on this device.',
            title: 'Camera Not Available',
            type: 'error',
          });
        }
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      ShowToast({
        description: 'Something went wrong while checking camera permission.',
        title: 'Error',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (isConnected) {
      setShowNoNetworkModal(false);
      OcrReadingsHistory();
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
      <StatusBar backgroundColor={'#0a1f44ed'} barStyle={'light-content'} />

      {isFocused && showNoNetworkModal && (
        <NoInternet showNoNetworkModal={true} />
      )}

      <LinearGradient
        colors={[colors.primary, '#1B2F50']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/global/kalyani_dark.png')}
            style={styles.logo}
          />
          <CopilotStep
            text="Tap here to open your Profile"
            order={1}
            name="profileBtn"
          >
            <WalkthroughableTouchable
              onPress={() => {
                navigation.navigate('ProfileScreen');
              }}
            >
              <Image
                source={require('../../assets/images/home/avatar.png')}
                style={styles.avatar}
              />
            </WalkthroughableTouchable>
          </CopilotStep>
        </View>
      </LinearGradient>

      <View
        style={{
          backgroundColor: colors.primary,
        }}
      >
        <View style={styles.scrollViewWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: SizeConfig.height * 2 }}
          >
            <View style={styles.lastReadingComp}>
              <Text style={styles.lastReadingCompTitle}>
                Last Reading Updated
              </Text>
              <Text style={styles.lastReadingCompDate}>05/09/2025</Text>
            </View>

            <LinearGradient
              colors={['#2ECC71', '#4CAF50']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: SizeConfig.width * 3,
              }}
            >
              <TouchableOpacity
                style={styles.cameraTabComp}
                activeOpacity={0.5}
                onPress={() => {
                  if (isConnected) {
                    handleCameraPermission();
                  } else {
                    ShowToast({
                      title: 'No Service Provider',
                      description: 'No Internet connection found !',
                      type: 'error',
                    });
                  }
                }}
              >
                <MaterialIcons
                  name="camera-alt"
                  size={SizeConfig.width * 6}
                  color={colors.white}
                />
                <Text style={styles.cameraTabText}>Capture Meter Reading</Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.cardsRow}>
              <Pressable style={styles.card}>
                <Image
                  source={require('../../assets/images/home/lightbulb.png')}
                  style={styles.cardIcon}
                />
                <View>
                  <Text style={styles.cardTitle}>Total energy</Text>
                  <View style={styles.cardValueRow}>
                    <Text style={[styles.cardValue, { color: '#2ECC71' }]}>
                      36.2
                    </Text>
                    <Text style={[styles.cardUnit, { color: '#2ECC71' }]}>
                      Kwh
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable style={styles.card}>
                <Image
                  source={require('../../assets/images/home/electricity.png')}
                  style={styles.cardIcon}
                />
                <View>
                  <Text style={styles.cardTitle}>Consumed</Text>
                  <View style={styles.cardValueRow}>
                    <Text style={[styles.cardValue, { color: colors.warning }]}>
                      28.2
                    </Text>
                    <Text style={[styles.cardUnit, { color: colors.warning }]}>
                      Kwh
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>

            <View style={styles.grapUiMainComp}>
              <View style={styles.filterContainer}>
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
                      <LinearGradient
                        colors={
                          isActive
                            ? ['#80808021', 'white', 'white']
                            : ['white', 'white']
                        }
                        style={[
                          styles.filterBtnComp,
                          isActive && styles.filterBtnActive,
                        ]}
                      >
                        <Pressable onPress={() => handleFilterPress(item)}>
                          <Text
                            style={[
                              styles.filterBtnText,
                              {
                                color: isActive ? colors.pureBlack : '#7F7F7F',
                                fontFamily: isActive
                                  ? fonts.semiBold
                                  : fonts.medium,
                              },
                            ]}
                          >
                            {item}
                          </Text>
                        </Pressable>
                      </LinearGradient>
                    );
                  }}
                />
              </View>

              <GrapAnalytics />
            </View>

            <View
              style={{
                gap: SizeConfig.height * 2,
              }}
            >
              <View style={styles.referralHeader}>
                <Text style={styles.referralTitle}>Recent Records</Text>
                {DummyMeterReadingData.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ViewAllHistory');
                    }}
                    style={styles.viewBtn}
                  >
                    <Text style={styles.viewText}>View all</Text>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={SizeConfig.width * 5}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.historyMainComp}>
                {DummyMeterReadingData.length === 0 ? (
                  <View
                    style={{
                      paddingBottom: SizeConfig.width * 9,
                    }}
                  >
                    <LottieView
                      source={require('../../assets/lotties/home/noData.json')}
                      style={styles.noDataLottie}
                      autoPlay
                      loop
                    />
                    <Text style={styles.noDataText}>
                      Start with your first reading to see your history here.
                    </Text>
                  </View>
                ) : (
                  DummyMeterReadingData.slice(0, 5).map(
                    (item: any, index: number) => (
                      <ViewDetailCard data={item} key={index} />
                    ),
                  )
                )}
              </View>
            </View>
          </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SizeConfig.height * 3,
    paddingHorizontal: SizeConfig.width * 4,
  },
  logo: {
    width: SizeConfig.width * 30,
    height: SizeConfig.width * 10,
    resizeMode: 'contain',
  },
  avatar: {
    width: SizeConfig.width * 10,
    height: SizeConfig.width * 10,
    resizeMode: 'contain',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterList: {
    gap: SizeConfig.width,
    paddingVertical: SizeConfig.height * 0.5,
    // backgroundColor: 'red',
    paddingHorizontal: SizeConfig.width * 2,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    borderRadius: SizeConfig.width * 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  filterBtnComp: {
    padding: SizeConfig.width * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 5,
    margin: SizeConfig.width * 0.5,
    paddingHorizontal: SizeConfig.width * 4,
  },
  filterBtnActive: {
    borderWidth: 0.7,
    borderColor: colors.borderColor,
    borderRadius: SizeConfig.width * 5,
  },
  filterBtnText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: colors.secondary,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: SizeConfig.width * 4,
    // paddingHorizontal: SizeConfig.width * 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingHorizontal: SizeConfig.width * 5,
    paddingVertical: SizeConfig.height * 2,
    borderRadius: SizeConfig.width * 5,
    borderWidth: 0.7,
    borderColor: colors.border,
    gap: SizeConfig.height * 1.5,
    paddingHorizontal: SizeConfig.width * 4,
  },
  cardIcon: {
    width: SizeConfig.width * 7,
    height: SizeConfig.width * 7,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  cardTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.secondary,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SizeConfig.width,
  },
  cardValue: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 5,
  },
  cardUnit: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.4,
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  referralTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.black,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  viewText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.primary,
  },
  noDataText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.black,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: SizeConfig.height,
    width: SizeConfig.width * 55,
  },
  noDataLottie: {
    height: SizeConfig.height * 20,
    width: SizeConfig.width * 40,
    alignSelf: 'center',
  },
  lastReadingComp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SizeConfig.width * 3,
    backgroundColor: '#faf3e5',
    borderRadius: SizeConfig.width * 3,
    marginTop: SizeConfig.height * 3,
    borderWidth: 0.5,
    borderColor: colors.warning,
    paddingHorizontal: SizeConfig.width * 5,
  },
  lastReadingCompTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3,
    color: colors.pureBlack,
  },
  lastReadingCompDate: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.2,
    color: colors.warning,
  },
  scrollViewWrapper: {
    backgroundColor: '#F9FAFB',
    borderTopRightRadius: SizeConfig.width * 7,
    borderTopLeftRadius: SizeConfig.width * 7,
    paddingHorizontal: SizeConfig.width * 5,
    overflow: 'hidden',
  },
  cameraTabComp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SizeConfig.width * 3,
    paddingHorizontal: SizeConfig.width * 5,
    gap: SizeConfig.width,
  },
  cameraTabText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.white,
  },
  grapUiMainComp: {
    backgroundColor: colors.white,
    paddingHorizontal: SizeConfig.width * 4,
    paddingVertical: SizeConfig.height * 2,
    gap: SizeConfig.height * 2,
    borderRadius: SizeConfig.width * 4,
    borderWidth: 0.7,
    borderColor: colors.border,
  },
  historyMainComp: {
    gap: SizeConfig.height,
    paddingBottom: SizeConfig.height * 15,
  },
});

export default Home;
