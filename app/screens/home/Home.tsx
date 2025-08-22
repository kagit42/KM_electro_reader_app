import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageProps,
  ImageStyle,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, COLORS, fonts } from '../../util/Theme';
import { SizeConfig } from '../../assets/size/size';
import GrapAnalytics from './components/GrapAnalytics';
import CardCarousel from './components/CardCarousel';
import { useNavigation } from '@react-navigation/native';
import { useNetwork } from '../../util/NetworkProvider';
import LottieView from 'lottie-react-native';
import { NoInternet } from '../global/modal/NoInternet';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Toast from 'react-native-toast-message';
import { ShowToast } from '../../util/UtilityFunctions';

const FILTERS = ['Month', 'Biannual', 'Year'] as const;
type FilterKey = 'month' | 'biannual' | 'year';

const Home = () => {
  const navigation = useNavigation<any>();
  const device = useCameraDevice('back');

  const { isConnected } = useNetwork();
  const { hasPermission, requestPermission } = useCameraPermission();

  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    month: true,
    biannual: false,
    year: false,
  });
  const [showNoNetworkModal, setShowNoNetworkModal] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setShowNoNetworkModal(false);
    } else {
      setShowNoNetworkModal(true);
    }
  }, [isConnected]);

  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      month: key === 'month',
      biannual: key === 'biannual',
      year: key === 'year',
    });
  };

  const checkPermission = async () => {
    try {
      if (hasPermission === null) {
        return;
      }

      if (!hasPermission) {
        const granted = await requestPermission();

        if (granted) {
          if (device != null) {
            navigation.navigate('MeterReader');
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
          navigation.navigate('MeterReader');
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

  const historyData = [
    {
      id: 1,
      location: 'RR Nagar (Kalyani Motors Nexa)',
      serviceNo: '1234567890',
      volt: 110,
      date: '2024-06-30',
    },
    {
      id: 2,
      location: 'Mysore (Kalyani Motors Nexa)',
      serviceNo: '1234567890',
      volt: 220,
      date: '2024-10-27',
    },
    {
      id: 3,
      location: 'Laalbag (Kalyani Motors Nexa)',
      serviceNo: '1234567890',
      volt: 420,
      date: '2024-04-17',
    },
    {
      id: 4,
      location: 'Chennai (Kalyani Motors Nexa)',
      serviceNo: '1234567890',
      volt: 920,
      date: '2024-01-11',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <View style={styles.mainComp}>
        <TouchableOpacity
          onPress={() => {
            if (!isConnected) {
              ShowToast({
                description:
                  'Please check your internet connection and try again.',
                title: 'Network Issue',
                type: 'error',
              });
            } else {
              checkPermission();
            }
          }}
          activeOpacity={0.8}
          style={styles.floatAnalytics}
        >
          <Ionicons
            name="camera"
            color={COLORS.white}
            size={SizeConfig.width * 8}
          />
        </TouchableOpacity>

        <FlatList
          data={historyData}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.headerBackground}>
                <Pressable
                  onPress={() => navigation.openDrawer()}
                  style={styles.header}
                >
                  <Image
                    source={require('../../assets/images/global/kalyani_light.png')}
                    style={styles.logo}
                  />
                  <Image
                    source={require('../../assets/images/home/avatar.png')}
                    style={styles.avatar}
                  />
                </Pressable>

                {/* Filters */}
                <View style={styles.filterComp}>
                  {FILTERS.map(type => {
                    const key = type.toLowerCase() as FilterKey;
                    const isActive = selectedFilter[key];
                    return (
                      <Pressable
                        key={type}
                        onPress={() => handleFilterPress(type)}
                        style={[
                          styles.filterBtnComp,
                          isActive && styles.filterBtnActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterBtnText,
                            {
                              color: isActive
                                ? COLORS.primary
                                : COLORS.textGray,
                            },
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Graph */}
              <View>
                <GrapAnalytics selectedFilter={selectedFilter} />
                <TouchableOpacity
                  onPress={() => {
                    if (!isConnected) {
                      ShowToast({
                        description:
                          'Please check your internet connection and try again.',
                        title: 'Network Issue',
                        type: 'error',
                      });
                    } else {
                      navigation.navigate('ExploreMore');
                    }
                  }}
                  style={styles.grapFullScreenBtn}
                >
                  <MaterialIcons
                    name="fullscreen"
                    color={COLORS.color_1A1A1A}
                    size={SizeConfig.width * 5.5}
                  />
                </TouchableOpacity>
              </View>

              {/* References */}
              <View style={styles.sectionGap}>
                <Text style={styles.sectionTitle}>Your References</Text>
                <View style={styles.referenceSection}>
                  <ReferenceItem
                    title="Compare"
                    imgUrl={require('../../assets/images/home/compareCard.jpg')}
                    icon={
                      <Ionicons
                        name="arrow-up-circle"
                        color={COLORS.success}
                        size={SizeConfig.width * 6}
                      />
                    }
                    imageStyle={{
                      right: -SizeConfig.width * 10,
                      width: SizeConfig.width * 40,
                    }}
                    value="15%"
                    subtitle="Compare to previous Reading"
                  />
                  <ReferenceItem
                    title="Usage"
                    imgUrl={require('../../assets/images/home/usageCard.jpg')}
                    icon={
                      <MaterialIcons
                        name="electric-bolt"
                        color={COLORS.primary}
                        size={SizeConfig.width * 5.5}
                      />
                    }
                    value="220 KW"
                    imageStyle={{ right: -SizeConfig.width * 6 }}
                    subtitle="Total Power Consumption"
                  />
                </View>
              </View>
              <View style={styles.itemSpace} />
              {/* Carousel */}
              <CardCarousel />

              {/* History Title */}
              <Text style={styles.sectionTitle}>Your History</Text>
            </>
          }
          ListEmptyComponent={() => (
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
          )}
          contentContainerStyle={{
            gap: SizeConfig.height * 2,
            paddingBottom: SizeConfig.height * 3,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewDetailsScreen');
              }}
              activeOpacity={0.85}
              style={styles.historyCard}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.historyCardTimeText}>12 : 00 PM</Text>
                <Text style={styles.historyCardDateText}>April , 08</Text>
              </View>
              <View style={styles.historyCardDivider} />
              <View style={styles.historyContent}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>{item?.location}</Text>
                  <Text style={styles.historySubTitle}>
                    Service No : {item?.serviceNo}
                  </Text>
                </View>
                <View style={styles.historyFooter}>
                  <Pressable
                    onPress={() => {
                      navigation.navigate('ViewDetailsScreen');
                    }}
                    style={styles.viewMoreBtn}
                  >
                    <Text style={styles.viewMoreText}>View More</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <NoInternet showNoNetworkModal={showNoNetworkModal} />
      </View>
    </SafeAreaView>
  );
};

const ReferenceItem = ({
  title,
  icon,
  value,
  subtitle,
  imgUrl,
  imageStyle,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtitle: string;
  imgUrl: ImageProps;
  imageStyle?: ImageStyle;
}) => (
  <Pressable style={styles.referenceItem}>
    <Text style={styles.referenceTitle}>{title}</Text>
    <View style={styles.referenceValueRow}>
      {icon}
      <Text style={styles.referenceValue}>{value}</Text>
    </View>
    <Text style={styles.referenceSubtitle}>{subtitle}</Text>
    <Image source={imgUrl} style={[styles.renderItemImg, imageStyle]} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainComp: {
    paddingHorizontal: SizeConfig.width * 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SizeConfig.height * 2,
  },
  headerBackground: {
    backgroundColor: colors.white,
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
  filterComp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.border,
    borderRadius: SizeConfig.width * 2,
    marginVertical: SizeConfig.height * 2,
  },
  filterBtnComp: {
    padding: SizeConfig.width * 2,
    width: SizeConfig.width * 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 2,
    margin: SizeConfig.width * 0.5,
  },
  filterBtnActive: {
    backgroundColor: COLORS.white,
    elevation: 5,
  },
  filterBtnText: {
    fontFamily: fonts.bold,
    fontSize: SizeConfig.fontSize * 3.5,
  },
  sectionGap: {
    gap: SizeConfig.height * 1,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: COLORS.color_1A1A1A,
    marginTop: SizeConfig.width * 3.3,
  },
  referenceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap: SizeConfig.height * 2,
  },
  referenceItem: {
    backgroundColor: COLORS.white,
    padding: SizeConfig.width * 4,
    borderRadius: SizeConfig.width * 2,
    width: SizeConfig.width * 42,
    borderColor: COLORS.border,
    borderWidth: 1,
    gap: SizeConfig.height,
    position: 'relative',
    overflow: 'hidden',
  },
  referenceTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: COLORS.color_1A1A1A,
  },
  referenceValueRow: {
    flexDirection: 'row',
    gap: SizeConfig.width,
  },
  referenceValue: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: COLORS.color_1A1A1A,
  },
  referenceSubtitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.2,
    color: COLORS.color_1A1A1A,
  },
  historyCard: {
    flexDirection: 'row',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SizeConfig.width * 3,
    padding: SizeConfig.width * 3,
    backgroundColor: COLORS.white,
    paddingVertical: SizeConfig.height * 2,
    gap: SizeConfig.width * 3,
    alignItems: 'center',
  },
  historyContent: {
    gap: SizeConfig.height * 1.5,
    flex: 1,
  },
  historyHeader: {
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.5,
    color: COLORS.color_1A1A1A,
  },
  historySubTitle: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.3,
    color: COLORS.color_1A1A1A,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  viewMoreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: SizeConfig.width * 2,
    paddingVertical: SizeConfig.width,
    borderRadius: SizeConfig.width,
  },
  viewMoreText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: COLORS.white,
  },
  itemSpace: {
    height: SizeConfig.width * 4,
  },
  renderItemImg: {
    width: SizeConfig.width * 30,
    height: SizeConfig.width * 30,
    position: 'absolute',
    zIndex: -1,
    opacity: 0.8,
    bottom: -SizeConfig.width * 7,
    right: -SizeConfig.width * 2,
    resizeMode: 'contain',
  },
  grapFullScreenBtn: {
    backgroundColor: COLORS.border,
    position: 'absolute',
    bottom: SizeConfig.height * 2,
    right: SizeConfig.width,
    paddingHorizontal: SizeConfig.width * 2,
    paddingVertical: SizeConfig.height * 0.5,
    borderRadius: SizeConfig.width * 2,
  },
  noDataText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: COLORS.color_1A1A1A,
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
  floatAnalytics: {
    position: 'absolute',
    width: SizeConfig.width * 15,
    height: SizeConfig.width * 15,
    borderRadius: (SizeConfig.width * 15) / 2,
    bottom: SizeConfig.height * 5,
    right: SizeConfig.width * 5,
    backgroundColor: colors.primary,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCardTimeText: {
    fontFamily: fonts.bold,
    fontSize: SizeConfig.fontSize * 3.8,
    color: COLORS.color_1A1A1A,
  },
  historyCardDateText: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.7,
    color: COLORS.color_1A1A1A,
  },
  historyCardDivider: {
    width: SizeConfig.width * 0.2,
    height: '100%',
    backgroundColor: COLORS.border,
    borderRadius: SizeConfig.width * 3,
  },
});

export default Home;
