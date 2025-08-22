import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../util/Theme';
import { SizeConfig } from '../../assets/size/size';
import { RootStackParam } from '../../navigations/RootType';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type ViewDetailsScreenNavProps = {
  navigation: DrawerNavigationProp<RootStackParam, 'MeterReaderNavProps'>;
};

const ViewDetailsScreen = ({ navigation }: ViewDetailsScreenNavProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={SizeConfig.width * 5}
            color={colors.color_1A1A1A}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meter Reading Details</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Outlet Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outlet Information</Text>

          <View style={styles.field}>
            <View style={styles.rowWithIcon}>
              <Entypo
                name="shop"
                size={SizeConfig.width * 4}
                color={colors.light_gray}
              />
              <Text style={styles.label}>Outlet Code</Text>
            </View>
            <Text style={styles.value}>KA78213456</Text>
          </View>

          <View style={styles.field}>
            <View style={styles.rowWithIcon}>
              <Ionicons
                name="speedometer"
                size={SizeConfig.width * 4}
                color={colors.light_gray}
              />
              <Text style={styles.label}>Meter Number</Text>
            </View>
            <Text style={styles.value}>DLN5623987</Text>
          </View>
        </View>

        {/* Reading Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Information</Text>

          <View style={styles.dateTimeRow}>
            <View style={styles.rowBetween}>
              <View style={styles.rowWithIcon}>
                <MaterialIcons
                  name="electric-bolt"
                  size={SizeConfig.width * 4}
                  color={colors.light_gray}
                />
                <Text style={styles.subLabel}>Usage</Text>
              </View>
              <Text style={styles.subValue}>32,478 kWh</Text>
            </View>

            <View style={styles.rowBetween}>
              <View style={styles.rowWithIcon}>
                <MaterialIcons
                  name="date-range"
                  size={SizeConfig.width * 4}
                  color={colors.light_gray}
                />
                <Text style={styles.subLabel}>Reading Date</Text>
              </View>
              <Text style={styles.subValue}>20 Aug 2025</Text>
            </View>

            <View style={styles.rowBetween}>
              <View style={styles.rowWithIcon}>
                <MaterialIcons
                  name="access-time-filled"
                  size={SizeConfig.width * 4}
                  color={colors.light_gray}
                />
                <Text style={styles.subLabel}>Reading Time</Text>
              </View>
              <Text style={styles.subValue}>10:33 AM</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Verified</Text>
          </View>
        </View>

        {/* Meter Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meter Image</Text>
          <Image
            source={require('../../assets/images/details/meter.png')}
            style={styles.meterImage}
          />
        </View>

        {/* Reader Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reader Information</Text>

          <View style={{ gap: SizeConfig.width * 3 }}>
            <View style={styles.rowBetween}>
              <View style={styles.rowWithIcon}>
                <MaterialIcons
                  name="date-range"
                  size={SizeConfig.width * 4}
                  color={colors.light_gray}
                />
                <Text style={styles.subLabel}>Reading Type</Text>
              </View>
              <Text style={styles.subValue}>Regular Monthly</Text>
            </View>

            <View style={styles.rowBetween}>
              <View style={styles.rowWithIcon}>
                <MaterialIcons
                  name="electric-meter"
                  size={SizeConfig.width * 5}
                  color={colors.light_gray}
                />
                <Text style={styles.subLabel}>Previous Reading</Text>
              </View>
              <Text style={styles.subValue}>31,245 kWh</Text>
            </View>

            <View style={styles.rowBetween}>
              <View style={styles.rowWithIcon}>
                <FontAwesome
                  name="calendar-check-o"
                  size={SizeConfig.width * 4}
                  color={colors.light_gray}
                />
                <Text style={styles.subLabel}>Status</Text>
              </View>
              <Text style={[styles.subValue, { color: colors.success }]}>
                Processed
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ViewDetailsScreen;

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SizeConfig.height * 2,
    paddingHorizontal: SizeConfig.width * 4,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColor,
    backgroundColor: colors.white,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: SizeConfig.width * 9,
    fontFamily: fonts.medium,
    fontSize: SizeConfig.width * 4,
    color: colors.color_1A1A1A,
  },

  /* Content */
  scrollContent: {
    padding: SizeConfig.width * 4,
    gap: SizeConfig.height * 2,
  },
  section: {
    gap: SizeConfig.height * 1.5,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.9,
    color: colors.primary,
  },

  /* Info Fields */
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SizeConfig.width,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.6,
    color: colors.color_1A1A1A,
  },
  value: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.light_gray,
  },

  /* Rows */
  rowWithIcon: {
    flexDirection: 'row',
    gap: SizeConfig.width * 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  /* Sub Info */
  dateTimeRow: {
    gap: SizeConfig.height,
  },
  subLabel: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.6,
    color: colors.color_1A1A1A,
  },
  subValue: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.light_gray,
  },

  /* Status */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SizeConfig.width * 2,
    width: SizeConfig.width * 20,
    padding: SizeConfig.width,
    borderRadius: SizeConfig.width * 3,
    backgroundColor: colors.light_green,
  },
  statusDot: {
    width: SizeConfig.width * 2,
    height: SizeConfig.width * 2,
    borderRadius: SizeConfig.width,
    backgroundColor: colors.success,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: colors.success,
  },

  /* Meter Image */
  meterImage: {
    width: SizeConfig.width * 90,
    height: SizeConfig.height * 40,
    borderRadius: SizeConfig.width * 3,
    resizeMode: 'stretch',
  },

  /* Footer */
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SizeConfig.height * 2,
    backgroundColor: colors.white,
    borderTopLeftRadius: SizeConfig.width * 7,
    borderTopRightRadius: SizeConfig.width * 7,
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: SizeConfig.width * 3,
    paddingHorizontal: SizeConfig.width * 8,
    borderRadius: SizeConfig.width * 3,
  },
  backButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.white,
  },
});
