import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ImageProps,
  ImageStyle,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts } from '../../util/Theme';
import { SizeConfig } from '../../assets/size/size';
import GrapAnalytics from './components/GrapAnalytics';
import CardCarousel from './components/CardCarousel';
import { useNavigation } from '@react-navigation/native';

const FILTERS = ['Month', 'Biannual', 'Year'];

const Home = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    Record<FilterKey, boolean>
  >({
    month: true,
    biannual: false,
    year: false,
  });
  const FILTERS = ['Month', 'Biannual', 'Year'] as const;
  type FilterKey = 'month' | 'biannual' | 'year';

  const handleFilterPress = (filter: (typeof FILTERS)[number]) => {
    const key = filter.toLowerCase() as FilterKey;
    setSelectedFilter({
      month: key === 'month',
      biannual: key === 'biannual',
      year: key === 'year',
    });
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

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <View style={styles.mainComp}>
        <ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor: colors.background }}>
            <Pressable
              onPress={() => {
                navigation.openDrawer();
              }}
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
                        { color: isActive ? colors.primary : colors.textGray },
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={{ gap: SizeConfig.height * 3 }}>
            <GrapAnalytics selectedFilter={selectedFilter} />

            <View style={styles.sectionGap}>
              <Text style={styles.sectionTitle}>Your References</Text>
              <View style={styles.referenceSection}>
                <ReferenceItem
                  title="Compare"
                  imgUrl={require('../../assets/images/home/compareCard.jpg')}
                  icon={
                    <Ionicons
                      name="arrow-up-circle"
                      color={colors.success}
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
                      color={colors.primary}
                      size={SizeConfig.width * 5.5}
                    />
                  }
                  value="220 KW"
                  imageStyle={{ right: -SizeConfig.width * 6 }}
                  subtitle="Total Power Consumption"
                />
              </View>
            </View>

            <CardCarousel />

            <View style={styles.sectionGap}>
              <Text style={styles.sectionTitle}>Your History</Text>
              <FlatList
                data={historyData}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ gap: SizeConfig.height * 2 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.historyCard}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: SizeConfig.fontSize * 3.8,
                          color: colors.color_1A1A1A,
                        }}
                      >
                        12 : 00 PM
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: SizeConfig.fontSize * 3.7,
                          color: colors.color_1A1A1A,
                        }}
                      >
                        April , 08
                      </Text>
                    </View>
                    <View
                      style={{
                        width: SizeConfig.width * 0.5,
                        height: '100%',
                        backgroundColor: colors.border,
                        borderRadius: SizeConfig.width * 3,
                      }}
                    />
                    <View style={styles.historyContent}>
                      <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>{item.location}</Text>
                        <Text style={styles.historySubTitle}>
                          Service No : {item.serviceNo}
                        </Text>
                        {/* <Text style={styles.historyVolt}>{item.volt} Volt</Text> */}
                      </View>

                      <View style={styles.historyFooter}>
                        <Pressable style={styles.viewMoreBtn}>
                          <Text style={styles.viewMoreText}>View More</Text>
                        </Pressable>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </ScrollView>
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
    <Image
      source={imgUrl}
      style={[
        {
          width: SizeConfig.width * 30,
          height: SizeConfig.width * 30,
          position: 'absolute',
          zIndex: -1,
          opacity: 0.8,
          bottom: -SizeConfig.width * 7,
          right: -SizeConfig.width * 2,
          resizeMode: 'contain',
        },
        imageStyle,
      ]}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainComp: {
    paddingHorizontal: SizeConfig.width * 6,
    paddingTop: SizeConfig.height * 2,
    gap: SizeConfig.height * 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: colors.border,
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
    backgroundColor: colors.white,
    elevation: 5,
  },
  filterBtnText: {
    fontFamily: fonts.bold,
    fontSize: SizeConfig.fontSize * 3.5,
  },
  sectionGap: {
    gap: SizeConfig.height * 2,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.color_1A1A1A,
  },
  referenceSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: SizeConfig.height * 2,
  },
  referenceItem: {
    backgroundColor: colors.white,
    padding: SizeConfig.width * 4,
    borderRadius: SizeConfig.width * 2,
    width: SizeConfig.width * 40,
    borderColor: colors.border,
    borderWidth: 1,
    gap: SizeConfig.height,
    position: 'relative',
    overflow: 'hidden',
  },
  referenceTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.color_1A1A1A,
  },
  referenceValueRow: {
    flexDirection: 'row',
    gap: SizeConfig.width,
  },
  referenceValue: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.color_1A1A1A,
  },
  referenceSubtitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.2,
    color: colors.color_1A1A1A,
  },
  historyCard: {
    flexDirection: 'row',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: SizeConfig.width * 3,
    padding: SizeConfig.width * 3,
    backgroundColor: colors.white,
    paddingVertical: SizeConfig.height * 2,
    gap: SizeConfig.width * 3,
    alignItems: 'center',
  },
  historyContent: {
    gap: SizeConfig.height * 1.5,
    flex: 1,
  },
  historyHeader: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.color_1A1A1A,
  },
  historySubTitle: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.color_1A1A1A,
  },
  historyVolt: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.color_1A1A1A,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  capturedDate: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.success,
    backgroundColor: colors.light_green,
    padding: SizeConfig.width,
    borderRadius: SizeConfig.width,
    paddingHorizontal: SizeConfig.width * 2,
  },
  viewMoreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: SizeConfig.width * 2,
    paddingVertical: SizeConfig.width,
    borderRadius: SizeConfig.width,
  },
  viewMoreText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.2,
    color: colors.white,
  },
});

export default Home;
