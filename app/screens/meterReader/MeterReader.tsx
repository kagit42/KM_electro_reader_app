import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../util/Theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RootStackParam } from '../../navigations/RootType';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ShowToast } from '../../util/UtilityFunctions';
import { useNetwork } from '../../util/NetworkProvider';
import { useGetMeterReadingMutation } from '../../redux/slice/OcrSlice';

type meterReaderNavProps = {
  navigation: DrawerNavigationProp<RootStackParam, 'MeterReader'>;
};
function MeterReader({ navigation }: meterReaderNavProps) {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const { isConnected } = useNetwork();
  const [getMeterReading] = useGetMeterReadingMutation();

  const camera = useRef<Camera>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (!device || !hasPermission) {
      navigation.navigate('Home');
    }
  }, [device, hasPermission, navigation]);

  const takePicture = async () => {
    const file = await camera?.current?.takePhoto();
    let imagFileUrl = '';
    if (file) {
      const result = await fetch(`file://${file.path}`);
      if (result) {
        imagFileUrl = result.url;
      }
    }
    setPhoto(imagFileUrl);
  };

  const handleCancel = () => {
    setPhoto(null);
  };

  const handleAccept = async () => {
    setIsLoading(true);

    try {
      if (photo) {
        console.log(photo);

        const response = await getMeterReading({
          imageUrl: photo,
          name: 'meter.jpg',
          type: 'image/jpeg',
        }).unwrap();
        console.log(response);

        // Alert.alert('API Response:', response.meter_reading);

        ShowToast({
          title: 'Text Recived !',
          description: 'Text Extracted Successfully',
          type: 'error',
        });
      }

      setShowConfirmModal(true);
      setIsLoading(false);
    } catch (err) {
      ShowToast({
        title: 'Something went wronge.',
        description: 'Network Error. Try again later !',
        type: 'error',
      });
      setIsLoading(false);
      console.error('API Error:', err);
    }
  };

  const handleSubmit = () => {
    setShowConfirmModal(false);
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
    setPhoto(null);
  };

  if (device == null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: SizeConfig.height * 1.5,
        }}
      >
        <Text style={styles.noCamerDetectedText}>
          This feature is not supported on your device because no camera was
          detected.
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Text
            style={[
              styles.noCamerDetectedText,
              {
                fontSize: SizeConfig.fontSize * 3.5,
                color: colors.primary,
                textDecorationStyle: 'dashed',
                textDecorationColor: colors.primary,
              },
            ]}
          >
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <FontAwesome
                name="camera"
                color={colors.color_1A1A1A}
                size={SizeConfig.width * 6}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: photo }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          <View
            style={[
              styles.actionButtonsContainer,
              { display: showConfirmModal ? 'none' : 'flex' },
            ]}
          >
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <FontAwesome
                name="times"
                color={colors.error || 'red'}
                size={SizeConfig.width * 7}
              />
            </TouchableOpacity>

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
                  handleAccept();
                }
              }}
              style={styles.acceptButton}
            >
              <FontAwesome
                name="check"
                color={colors.success || 'green'}
                size={SizeConfig.width * 7}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.loadingOverlay,
              { display: isLoading ? 'flex' : 'none' },
            ]}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>

          {showConfirmModal ? (
            <View style={styles.confirmModal}>
              <Text style={styles.confirmTitle}>
                Confirm your Captured Details
              </Text>

              {[
                { label: 'kWh', value: '1234' },
                { label: 'Meter No', value: '1234567890' },
                { label: 'Location', value: 'MSRD' },
                { label: 'Employee No', value: '12345' },
              ].map((item, idx) => (
                <View key={idx} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              ))}

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  onPress={handleModalCancel}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

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
                      handleSubmit();
                    }
                  }}
                  style={styles.modalSubmitButton}
                >
                  <Text style={styles.modalSubmitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  cameraContainer: { flex: 1 },
  camera: { flex: 1, width: '100%' },

  captureButtonContainer: {
    padding: SizeConfig.width * 5,
    position: 'absolute',
    bottom: SizeConfig.height * 3,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: SizeConfig.width * 20,
    height: SizeConfig.width * 20,
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewContainer: { flex: 1 },
  previewImage: { flex: 1 },

  actionButtonsContainer: {
    position: 'absolute',
    bottom: SizeConfig.height * 5,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cancelButton: {
    width: SizeConfig.width * 18,
    height: SizeConfig.width * 18,
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    width: SizeConfig.width * 18,
    height: SizeConfig.width * 18,
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#030303a5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  confirmModal: {
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 3,
    padding: SizeConfig.width * 5,
  },
  confirmTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.8,
    color: '#000080',
    marginBottom: SizeConfig.height * 2,
    textAlign: 'center',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.borderColor,
    borderBottomWidth: 0.5,
    paddingVertical: SizeConfig.height,
  },
  detailLabel: {
    fontSize: SizeConfig.fontSize * 3.1,
    fontFamily: fonts.medium,
    color: '#000080',
  },
  detailValue: {
    fontSize: SizeConfig.fontSize * 3,
    fontFamily: fonts.medium,
    color: colors.color_1A1A1A,
  },

  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: SizeConfig.height * 3,
  },
  modalCancelButton: {
    backgroundColor: colors.error,
    paddingVertical: SizeConfig.height * 1.5,
    paddingHorizontal: SizeConfig.width * 6,
    borderRadius: SizeConfig.width * 2,
  },
  modalCancelText: {
    color: colors.white,
    fontSize: SizeConfig.fontSize * 3.4,
    fontFamily: fonts.medium,
  },
  modalSubmitButton: {
    backgroundColor: colors.primary,
    paddingVertical: SizeConfig.height * 1.5,
    paddingHorizontal: SizeConfig.width * 6,
    borderRadius: SizeConfig.width * 2,
  },
  modalSubmitText: {
    color: colors.white,
    fontSize: SizeConfig.fontSize * 3.4,
    fontFamily: fonts.medium,
  },
  noCamerDetectedText: {
    paddingHorizontal: SizeConfig.width * 4,
    width: SizeConfig.width * 70,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.color_1A1A1A,
  },
});

export default MeterReader;
