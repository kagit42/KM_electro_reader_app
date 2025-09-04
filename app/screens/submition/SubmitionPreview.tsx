import React, { useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
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
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import PreviewImageModal from '../../global/modal/PreviewImageModal';
import SuccessSubmission from '../../global/modal/SuccessSubmission';
import { formatDate, ShowToast } from '../../utils/UtilityFunctions';
import { useSubmitOcrReadingMutation } from '../../redux/slices/ocrSlice';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import CustomButton from '../../global/CustomButton';

type SubmitionPreviewProps = DrawerScreenProps<
  NavigationType,
  'SubmitionPreview'
>;

const SubmitionPreview = ({ navigation, route }: SubmitionPreviewProps) => {
  let data = route.params;
  const { isConnected } = useNetwork();

  const [previewImgModalVisible, setPreviewImgModalVisible] = useState(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

  const [submitTrigger] = useSubmitOcrReadingMutation();

  const supportNumber = '9845106513';

  const handleSubmit = async (payload: {}) => {
    try {
      setLoading(true);
      let response = await submitTrigger({
        data: payload,
      }).unwrap();
      console.log(response);
      setSuccessModal(true);
      setLoading(false);
    } catch (error) {
      setSuccessModal(false);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={colors.warning} barStyle="light-content" />

      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meter Reading Preview</Text>
        </View>

        <PreviewImageModal
          modalVisible={previewImgModalVisible}
          setModalVisible={setPreviewImgModalVisible}
          url={data.url}
        />

        <SuccessSubmission
          modalVisible={successModal}
          setModalVisible={setSuccessModal}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.row}>
            <View
              style={{
                gap: SizeConfig.height * 2,
                marginTop: SizeConfig.height * 3,
              }}
            >
              <Text style={styles.sectionTitle}>Captured Image :</Text>
              <View style={styles.imageContainer}>
                <Image
                  // source={require('../../assets/images/details/meter.png')}
                  source={{ uri: data.url }}
                  style={styles.image}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.overlay}
                  onPress={() => setPreviewImgModalVisible(true)}
                >
                  <Text style={styles.clickToView}>Click to view</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={styles.sectionTitle}>Extracted Details :</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <View style={styles.iconLabelRow}>
                    <MaterialIcons
                      name="confirmation-number"
                      size={SizeConfig.width * 4.5}
                      color={colors.secondary}
                    />
                    <Text style={styles.label}>Serial Number</Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.value}
                  >
                    {data.serial_number}
                  </Text>
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
                  <Text style={styles.value}>{formatDate(data.timestamp)}</Text>
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
                    <Text style={styles.value}>{data.meter_reading}</Text>
                    <MaterialIcons
                      name="keyboard-arrow-up"
                      size={SizeConfig.width * 5}
                      color={colors.black}
                    />
                  </View>
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
                        color: data.status ? colors.primary : colors.warning,
                        fontFamily: fonts.semiBold,
                      },
                    ]}
                  >
                    {data.status ? 'Verifyied' : 'Pending'}
                  </Text>
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
                  <Text style={styles.value}>{data.outlet}</Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => Linking.openURL(`tel:${supportNumber}`)}
            style={styles.importentNoteComp}
          >
            <Text style={styles.importentNoteTitle}>Important Notice</Text>
            <Text style={styles.importentNoteSubText}>
              Please review the extracted details carefully before submission.
              If you facing any issue,{' '}
              <Text
                onPress={() => Linking.openURL(`tel:${supportNumber}`)}
                style={{
                  color: colors.success,
                  fontFamily: fonts.semiBold,
                  textDecorationLine: 'underline',
                }}
              >
                contact support
              </Text>
              .
            </Text>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            linearGradientColor={['#FD5454FF', '#FD5454FF']}
            text="Cancel"
            linearGradientStyle={{
              width: SizeConfig.width * 35,
              height: SizeConfig.height * 6.5,
              borderRadius: SizeConfig.width * 4,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <CustomButton
            linearGradientColor={[colors.primary, colors.primary]}
            text="Submit"
            linearGradientStyle={{
              width: SizeConfig.width * 35,
              height: SizeConfig.height * 6.5,
              borderRadius: SizeConfig.width * 4,
            }}
            isLoading={isLoading}
            onPress={() => {
              if (isConnected) {
                handleSubmit({
                  serial_number: data.serial_number,
                  meter_reading: data.meter_reading,
                });
              } else {
                ShowToast({
                  title: 'No Service Provider',
                  description: 'No Internet connection found !',
                  type: 'error',
                });

                setTimeout(() => {
                  navigation.navigate('NetworkIssueScreen');
                }, 5000);
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warning },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.warning,
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
  row: { gap: SizeConfig.width * 5 },
  imageContainer: {
    width: '93%',
    height: SizeConfig.height * 25,
    overflow: 'hidden',
    borderRadius: SizeConfig.width * 3,
    alignSelf: 'center',
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
    paddingTop: SizeConfig.height * 2,
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
    width: SizeConfig.width * 35,
    textAlign: 'right',
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
  cancleButton: {
    backgroundColor: '#FD5454FF',
    width: SizeConfig.width * 35,
    height: SizeConfig.height * 6.5,
    borderRadius: SizeConfig.width * 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary,
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
  importentNoteComp: {
    paddingHorizontal: SizeConfig.width * 5,
    backgroundColor: colors.border,
    padding: SizeConfig.width * 2.5,
    borderRadius: SizeConfig.width * 3,
    marginHorizontal: SizeConfig.width * 5,
    marginTop: SizeConfig.height * 3.5,
    gap: SizeConfig.height * 0.5,
  },
  importentNoteTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.1,
    color: colors.black,
  },
  importentNoteSubText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 2.7,
    color: colors.black,
  },
});

export default SubmitionPreview;
