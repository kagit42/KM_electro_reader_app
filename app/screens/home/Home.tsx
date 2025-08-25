import React, { useState } from 'react';
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
import CardCarousel from './components/CardCarousel';
import GrapAnalytics from './components/GrapAnalytics';
import { colors, fonts } from '../../utils/Theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ViewDetailCard from './components/ViewDetailCard';

const FILTERS = ['Month', 'Biannual', 'Year', '15 days'] as const;
type FilterKey = 'month' | 'biannual' | 'year' | '15 days';

const Home = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    month: true,
    biannual: false,
    year: false,
    '15 days': false,
  });

  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      month: key === 'month',
      biannual: key === 'biannual',
      year: key === 'year',
      '15 days': key === '15 days',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#FDFDFD'} barStyle={'dark-content'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/global/kalyani_light.png')}
            style={styles.logo}
          />
          <Image
            source={require('../../assets/images/home/avatar.png')}
            style={styles.avatar}
          />
        </View>

        <CardCarousel />

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
                <Pressable
                  onPress={() => handleFilterPress(item)}
                  style={[
                    styles.filterBtnComp,
                    isActive && styles.filterBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBtnText,
                      {
                        color: isActive ? colors.primary : colors.secondary,
                        fontFamily: isActive ? fonts.semiBold : fonts.medium,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <GrapAnalytics />

        <View style={styles.cardsRow}>
          <Pressable style={styles.card}>
            <Image
              source={require('../../assets/images/home/lightbulb.png')}
              style={styles.cardIcon}
            />
            <View>
              <Text style={styles.cardTitle}>Total energy</Text>
              <View style={styles.cardValueRow}>
                <Text style={[styles.cardValue, { color: colors.success }]}>
                  36.2
                </Text>
                <Text style={[styles.cardUnit, { color: colors.success }]}>
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

        <View
          style={{
            gap: SizeConfig.height * 2,
          }}
        >
          <View style={styles.referralHeader}>
            <Text style={styles.referralTitle}>Referral History</Text>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewText}>View all</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={SizeConfig.width * 5}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              gap: SizeConfig.height * 2,
              paddingBottom: SizeConfig.height * 3,
            }}
          >
            <ViewDetailCard />
            <ViewDetailCard />
            <ViewDetailCard />
            <ViewDetailCard />
            <ViewDetailCard />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  scrollContainer: {
    paddingHorizontal: SizeConfig.width * 4,
    gap: SizeConfig.height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SizeConfig.height * 2,
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
    gap: SizeConfig.width * 3,
    paddingVertical: SizeConfig.height,
    paddingHorizontal: SizeConfig.width * 2,
  },
  filterBtnComp: {
    padding: SizeConfig.width * 2,
    width: SizeConfig.width * 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 5,
    margin: SizeConfig.width * 0.5,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  filterBtnActive: {
    backgroundColor: colors.white,
    elevation: 5,
  },
  filterBtnText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.secondary,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: SizeConfig.width * 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: SizeConfig.width * 5,
    paddingVertical: SizeConfig.height * 2,
    borderRadius: SizeConfig.width * 5,
    borderWidth: 0.7,
    borderColor: colors.border,
    gap: SizeConfig.height * 2,
  },
  cardIcon: {
    width: SizeConfig.width * 8,
    height: SizeConfig.width * 8,
    resizeMode: 'contain',
    tintColor : colors.black
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
});

export default Home;
