import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import ViewDetailCard from './components/ViewDetailCard';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import { useLazyGetOcrReadingsQuery } from '../../redux/slices/ocrSlice';
import { useEffect, useState } from 'react';
import { ShowToast } from '../../utils/UtilityFunctions';
import { NoInternet } from '../../global/modal/NoInternet';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { useIsFocused } from '@react-navigation/native';
import { DummyMeterReadingData } from './DummyMeterReadingData';
import LinearGradient from 'react-native-linear-gradient';

type ViewAllHistoryProps = DrawerScreenProps<NavigationType, 'ViewAllHistory'>;

const ViewAllHistory = ({ navigation }: ViewAllHistoryProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);
  const [showNoNetworkModal, setShowNoNetworkModal] = useState(false);

  const [getOcrReadingsHistoryTrigger] = useLazyGetOcrReadingsQuery();

  const { isConnected } = useNetwork();
  const isFocused = useIsFocused();

  const OcrReadingsHistory = async () => {
    try {
      setLoading(true);
      let response = await getOcrReadingsHistoryTrigger({
        page: page,
      }).unwrap();
      if (data.length > 0) {
        setData((prev: any) => [...prev, ...response.results]);
      } else {
        setData(response.results);
      }
      console.log(response);
    } catch (error: any) {
      if (error?.data?.detail == 'Invalid page.') {
        ShowToast({
          title: 'No More Pages',
          description: 'You’ve reached the end of your reading history.',
          type: 'error',
        });
      } else {
        console.log('page  ', page);
        ShowToast({
          title: 'Something Went Wrong',
          description:
            'It may cause due to unstable internet try again later or different service',
          type: 'error',
        });
      }

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    OcrReadingsHistory();
  }, [page]);

  useEffect(() => {
    if (isConnected) {
      setShowNoNetworkModal(false);
    } else {
      setShowNoNetworkModal(true);
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
          <Text style={styles.headerTitle}>History</Text>
        </View>
      </LinearGradient>

      <View style={styles.cardWrapper}>
        <FlatList
          data={data}
          style={{
            paddingTop: SizeConfig.height * 3,
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyDataComp}>
              <Image
                source={require('../../assets/images/details/noData.png')}
                style={styles.noDataImg}
              />
              <Text style={styles.noDataText}>
                Start with your first reading to see your history here.
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatlistContentComp}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!isLoading) {
              setPage(prev => prev + 1);
            }
          }}
          renderItem={({ index, item }: any) => {
            return <ViewDetailCard data={item} key={index} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewAllHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2F50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SizeConfig.height * 3,
    paddingHorizontal: SizeConfig.width * 6,
    gap: SizeConfig.width * 4,
  },
  headerBackBtnComp: {
    backgroundColor: colors.white,
    width: SizeConfig.width * 8,
    height: SizeConfig.width * 8,
    borderRadius: (SizeConfig.width * 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 5,
    color: colors.white,
    width: '100%',
  },
  headerText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.9,
    color: colors.black,
    flex: 1,
    textAlign: 'center',
    paddingRight: SizeConfig.width * 10,
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SizeConfig.width * 5,
    marginBottom: SizeConfig.height * 2,
  },
  banner: {
    width: '100%',
  },
  bannerImage: {
    borderRadius: SizeConfig.width * 4,
  },
  bannerContent: {
    flexDirection: 'row',
    paddingHorizontal: SizeConfig.width * 4,
    paddingVertical: SizeConfig.height,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTextWrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
  bannerTitle: {
    color: colors.white,
    fontSize: SizeConfig.width * 4,
    fontFamily: fonts.medium,
    marginBottom: SizeConfig.height * 0.5,
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: SizeConfig.width * 3.3,
    fontFamily: fonts.regular,
  },
  bannerImageRight: {
    width: SizeConfig.width * 35,
    height: SizeConfig.width * 25,
    resizeMode: 'contain',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SizeConfig.width * 6,
    backgroundColor: colors.white,
    paddingBottom: SizeConfig.height * 2,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.8,
    color: colors.black,
  },
  sectionCount: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.8,
    color: colors.black,
  },
  cardWrapper: {
    gap: SizeConfig.height * 2,
    paddingBottom: SizeConfig.height * 3,
    paddingHorizontal: SizeConfig.width * 5,
    backgroundColor: colors.white,
    borderTopRightRadius: SizeConfig.width * 7,
    borderTopLeftRadius: SizeConfig.width * 7,
    overflow: 'hidden',
    height: '100%',
    // flex: 1,
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
    height: SizeConfig.width * 25,
    width: SizeConfig.width * 25,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  emptyDataComp: {
    height: SizeConfig.deviceHeight - SizeConfig.height * 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SizeConfig.height * 1.5,
  },
  flatlistContentComp: {
    gap: SizeConfig.height * 1.5,
    paddingBottom: SizeConfig.height * 10,
  },
});
