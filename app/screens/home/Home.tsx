import React, { useEffect, useRef, useState } from 'react';
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
  PermissionsAndroid,
  Vibration,
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
import {
  useLazyGetAnalyticsQuery,
  useLazyGetOcrReadingsQuery,
} from '../../redux/slices/ocrSlice';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { ShowToast } from '../../utils/UtilityFunctions';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { NoInternet } from '../../global/modal/NoInternet';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';
import Clipboard from '@react-native-clipboard/clipboard';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FILTERS = ['15 days', 'Monthly', 'Biannual', 'Year'] as const;
type FilterKey = 'monthly' | 'biannual' | 'year' | '15 days';

type HomeProps = DrawerScreenProps<NavigationType, 'Home'>;

const Home = ({ navigation }: HomeProps) => {
  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    '15 days': true,
    monthly: false,
    biannual: false,
    year: false,
  });
  const [showNoNetworkModal, setShowNoNetworkModal] = useState(false);
  const [data, setData] = useState<any>([]);
  const [analyticData, setAnalyticData] = useState<any>([]);
  const [consumed, setConsumed] = useState<number>(0);
  const [totalConsumed, setTotalConsumed] = useState<number>(0);
  const [isAnalytics, setAnalyticsLoading] = useState(true);
  const [fcmKey, setFcmKey] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);

  const { isConnected } = useNetwork();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const { start } = useCopilot();

  const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
  const CopilotView = walkthroughable(View);

  const [getProfileDataTrigger] = useGetProfileDataMutation();
  const [getOcrReadingsHistoryTrigger] = useLazyGetOcrReadingsQuery();
  const [getAnalyticsTrigger] = useLazyGetAnalyticsQuery();

  const handleFilterPress = (filter: any) => {
    if (filter != 'Custom') {
      getAnalytics({ filter: filter });
    }

    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      '15 days': key === '15 days',
      monthly: key === 'monthly',
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
    } catch (error: any) {
      console.log(error);

      if (error?.code == 'token_not_valid') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SendOtp' }],
        });
      } else {
        ShowToast({
          title: 'Something Went Wrong',
          description: 'Something wen wrong. Try again later !',
          type: 'error',
        });
      }
    }
  };

  const OcrReadingsHistory = async () => {
    try {
      // setData([]);
      let response = await getOcrReadingsHistoryTrigger({
        page: 1,
      }).unwrap();
      setData(response.results);
      console.log(response.results.slice(5));
    } catch (error) {
      console.log(error);
      ShowToast({
        title: 'No Data Found',
        description: 'No user history or data found',
        type: 'error',
      });
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
        title: 'Error',
        description: 'Something went wrong while checking camera permission.',
        type: 'error',
      });
    }
  };

  // Analytics Api Calls

  const checkToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('fcmToken ', fcmToken);
        setFcmKey(fcmToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAnalytics = async ({ filter }: { filter: string }) => {
    try {
      console.log(filter);
      setAnalyticsLoading(true);

      let response = await getAnalyticsTrigger({
        filter:
          filter.toLocaleLowerCase() == '15 days'
            ? '15days'
            : filter.toLocaleLowerCase(),
      }).unwrap();
      console.log(response);

      setConsumed(response?.data?.cards?.consumed_kwh);
      setTotalConsumed(response?.data?.cards?.peak_consumption);
      setAnalyticData(response?.data?.usage_breakdown);
    } catch (error) {
      console.log(error);
      ShowToast({
        title: 'No Data Found',
        description: 'No user history or data found',
        type: 'error',
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const checkPermission = async () => {
    let notificationsGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    let result = undefined;
    if (!notificationsGranted) {
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    console.log(result);
    console.log(notificationsGranted);
  };

  const checkNewUser = async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem('is_new_user');

      if (value === null) {
        await AsyncStorage.setItem('is_new_user', 'false');
        return true;
      }

      return false;
    } catch (error) {
      console.log('Error checking new user:', error);
      return false;
    }
  };

  useEffect(() => {
    if (isConnected) {
      checkToken();
      setShowNoNetworkModal(false);
      checkUser();
      getAnalytics({ filter: '15 days' });
      setSelectedFilter({
        monthly: false,
        biannual: false,
        year: false,
        '15 days': true,
      });
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

  useFocusEffect(() => {
    setTimeout(() => {
      checkPermission();
    }, 4000);
  });

  return (
    isFocused && (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'#1B2F50'} barStyle={'light-content'} />

        {isFocused && showNoNetworkModal && (
          <NoInternet showNoNetworkModal={true} />
        )}

        <LinearGradient
          colors={[colors.primary, '#1B2F50']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <View
            onLayout={async () => {
              const isNewUser = await checkNewUser();
              console.log('Is new user?', isNewUser);
              if (isNewUser && scrollViewRef.current) {
                start(undefined, scrollViewRef.current);
              }
            }}
            style={styles.header}
          >
            <Image
              source={require('../../assets/images/global/kalyani_dark.png')}
              style={styles.logo}
            />
            <CopilotStep
              text="By clicking on this profile icon, you can view your profile information."
              order={1}
              name="profile"
            >
              <CopilotTouchableOpacity
                onPress={() => {
                  navigation.navigate('ProfileScreen');
                }}
              >
                <Image
                  source={require('../../assets/images/home/avatar.png')}
                  style={styles.avatar}
                />
              </CopilotTouchableOpacity>
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
              ref={scrollViewRef}
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
                <CopilotStep
                  text="Tap here to capture a new meter reading using your device's camera."
                  order={2}
                  name="camera"
                >
                  <CopilotTouchableOpacity
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
                    <Text style={styles.cameraTabText}>
                      Capture Meter Reading
                    </Text>
                  </CopilotTouchableOpacity>
                </CopilotStep>
              </LinearGradient>

              <View style={styles.cardsRow}>
                <Pressable style={styles.card}>
                  <Image
                    source={require('../../assets/images/home/lightbulb.png')}
                    style={styles.cardIcon}
                  />
                  <View>
                    <Text style={styles.cardTitle}>Peak Consumption</Text>
                    <View style={styles.cardValueRow}>
                      <Text style={[styles.cardValue, { color: '#2ECC71' }]}>
                        {totalConsumed || 0} Kwh
                      </Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Clipboard.setString(fcmKey);
                  }}
                  style={styles.card}
                >
                  <Image
                    source={require('../../assets/images/home/electricity.png')}
                    style={styles.cardIcon}
                  />
                  <View>
                    <Text
                      numberOfLines={3}
                      ellipsizeMode="tail"
                      style={styles.cardTitle}
                    >
                      Consumed
                    </Text>
                    <View style={styles.cardValueRow}>
                      <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={[styles.cardValue, { color: colors.warning }]}
                      >
                        {consumed || 0} Kwh
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>

              <View style={styles.grapUiMainComp}>
                <CopilotStep
                  text="Use this option to filter and analyze your data."
                  order={3}
                  name="filter"
                >
                  <CopilotView style={styles.filterContainer}>
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
                            <Pressable
                              onPress={() => {
                                Vibration.vibrate(100);
                                handleFilterPress(item);
                              }}
                            >
                              <Text
                                style={[
                                  styles.filterBtnText,
                                  {
                                    color: isActive
                                      ? colors.pureBlack
                                      : '#7F7F7F',
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
                  </CopilotView>
                </CopilotStep>

                {isAnalytics ? (
                  <GrapAnalytics isLoading={isAnalytics} data={analyticData} />
                ) : analyticData?.length > 0 ? (
                  <GrapAnalytics isLoading={isAnalytics} data={analyticData} />
                ) : (
                  <View
                    style={{
                      gap: SizeConfig.height * 2,
                      paddingTop: SizeConfig.height * 2,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/home/noAnalytics.png')}
                      style={{
                        width: '100%',
                        height: SizeConfig.height * 20,
                        // backgroundColor : 'red',
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        fontSize: SizeConfig.fontSize * 3.5,
                        color: colors.black,
                        textAlign: 'center',
                        width: '80%',
                        alignSelf: 'center',
                      }}
                    >
                      No analytics yet. {'\n'} Create your first reading to view
                      analytics.
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  gap: SizeConfig.height * 2,
                }}
              >
                <View style={styles.referralHeader}>
                  <Text style={styles.referralTitle}>Recent Records</Text>
                  {data.length > 0 && (
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
                  {data.length === 0 ? (
                    <View
                      style={{
                        paddingBottom: SizeConfig.height * 3,
                        paddingTop: SizeConfig.height * 5,
                        gap: SizeConfig.height,
                      }}
                    >
                      <Image
                        source={require('../../assets/images/details/noData.png')}
                        style={styles.noDataImg}
                      />
                      <Text style={styles.noDataText}>
                        Start with your first reading to see your history here.
                      </Text>
                    </View>
                  ) : (
                    data
                      .slice(0, 5)
                      .map((item: any, index: number) => (
                        <ViewDetailCard data={item} key={index} />
                      ))
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2F50',
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
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    borderRadius: SizeConfig.width * 10,
    width: '100%',
    overflow: 'hidden',
  },
  filterList: {
    gap: SizeConfig.width,
    paddingVertical: SizeConfig.height * 0.5,
    paddingHorizontal: SizeConfig.width * 2,
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
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
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
    color: colors.pureBlack,
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
  noDataImg: {
    height: SizeConfig.width * 30,
    width: SizeConfig.width * 30,
    alignSelf: 'center',
    resizeMode: 'contain',
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
