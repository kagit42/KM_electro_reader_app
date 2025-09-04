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
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import PreviewImageModal from '../../global/modal/PreviewImageModal';
import { formatDate } from '../../utils/UtilityFunctions';

type DetailScreenProps = DrawerScreenProps<NavigationType, 'DetailScreen'>;

const DetailScreen = ({ navigation, route }: DetailScreenProps) => {
  const data = route.params.data;

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
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: data?.status ? colors.success : colors.warning },
      ]}
      edges={['top']}
    >
      <StatusBar
        backgroundColor={data?.status ? colors.success : colors.warning}
        barStyle="light-content"
      />

      <ViewShot
        ref={viewShotRef}
        style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: data?.status ? colors.success : colors.warning },
          ]}
        >
          <Text style={styles.headerTitle}>Reading Information</Text>
        </View>

        <PreviewImageModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />

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
                    color={colors.secondary}
                  />
                  <Text style={styles.label}>Serial Number</Text>
                </View>
                <Text style={styles.value}>{data.serial_number ?? '--'}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconLabelRow}>
                  <MaterialIcons
                    name="schedule"
                    size={SizeConfig.width * 4.5}
                    color={colors.secondary}
                  />
                  <Text style={styles.label}>Captured Time</Text>
                </View>
                <Text style={styles.value}>{formatDate(data?.timestamp)}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconLabelRow}>
                  <MaterialIcons
                    name="bolt"
                    size={SizeConfig.width * 4.9}
                    color={colors.secondary}
                  />
                  <Text style={styles.label}>Power Consumed</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    color={colors.secondary}
                  />
                  <Text style={styles.label}>Verified Time</Text>
                </View>
                <Text style={styles.value}>{data?.verify_time ?? '--'}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconLabelRow}>
                  <MaterialIcons
                    name="check-circle"
                    size={SizeConfig.width * 4.5}
                    color={colors.secondary}
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
                    color={colors.secondary}
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
                    color={colors.secondary}
                  />
                  <Text style={styles.label}>Outlet</Text>
                </View>
                <Text style={styles.value}>{data?.outlet}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={[styles.button, { backgroundColor: '#FD5454FF' }]}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { flexDirection: 'row', gap: SizeConfig.width * 1.5 },
            ]}
            onPress={handleShare}
          >
            <MaterialIcons
              name="share"
              size={SizeConfig.width * 5}
              color={colors.white}
            />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ViewShot>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SizeConfig.height * 1.5,
    paddingHorizontal: SizeConfig.width * 4,
  },
  headerTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 4.5,
    color: colors.white,
    textAlign: 'center',
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
    marginTop: SizeConfig.height * 5,
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
    color: colors.black,
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
    color: colors.black,
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
    backgroundColor: '#32b40ed0',
    width: SizeConfig.width * 35,
    height: SizeConfig.height * 6.5,
    borderRadius: SizeConfig.width * 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.white,
  },
});

export default DetailScreen;
