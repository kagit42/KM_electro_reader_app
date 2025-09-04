import {
  FlatList,
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import { useLazyGetOcrReadingsQuery } from '../../redux/slices/ocrSlice';
import { useEffect, useState } from 'react';
import { ShowToast } from '../../utils/UtilityFunctions';
import LottieView from 'lottie-react-native';
import { NoInternet } from '../../global/modal/NoInternet';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { useIsFocused } from '@react-navigation/native';

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
    } catch (error) {
      console.log('page  ', page);
      ShowToast({
        title: 'Something Went Wrong',
        description:
          'It may cause due to unstable internet try again later or different service',
        type: 'error',
      });

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
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />

      {isFocused && showNoNetworkModal && (
        <NoInternet showNoNetworkModal={true} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={30}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: SizeConfig.width * 5,
          }}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={SizeConfig.width * 6}
            color={colors.color_4C5F66}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>View your History</Text>
      </View>
      <View style={styles.cardWrapper}>
        <FlatList
          data={[]}
          ListEmptyComponent={() => (
            <View
              style={{
                height: SizeConfig.deviceHeight - SizeConfig.height * 30,
                alignItems: 'center',
                justifyContent: 'center',
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
          // keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: SizeConfig.height * 2,
            paddingBottom: SizeConfig.height * 10,
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!isLoading) {
              setPage(prev => prev + 1);
            }
          }}
          renderItem={({ index, item }) => {
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
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: colors.white,
    paddingVertical: SizeConfig.height * 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: SizeConfig.height * 2,
    flexDirection: 'row',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.3,
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
});
