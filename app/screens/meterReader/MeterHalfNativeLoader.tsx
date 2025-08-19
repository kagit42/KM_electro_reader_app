import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../util/Theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function MeterReader() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const camera = useRef<Camera>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (device == null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No camera device found 📷</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Camera permission is required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

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
    setPhoto(null); // go back to camera
  };

  const handleAccept = () => {
    setShowConfirmModal(true); // open modal immediately
    setIsLoading(true); // show loader

    setTimeout(() => {
      setIsLoading(false); // after 9s, show confirm details
    }, 9000);
  };

  const handleSubmit = () => {
    console.log('✅ Photo accepted:', photo);
    setShowConfirmModal(false);
    // TODO: Upload / Save logic
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {!photo ? (
        // Camera View
        <View style={{ flex: 1 }}>
          <Camera
            ref={camera}
            style={{ flex: 1, width: '100%' }}
            device={device}
            isActive={true}
            photo={true}
          />
          {/* Capture Button */}
          <View
            style={{
              padding: SizeConfig.width * 5,
              position: 'absolute',
              bottom: SizeConfig.height * 3,
              right: 0,
              left: 0,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={takePicture}
              style={{
                width: SizeConfig.width * 20,
                height: SizeConfig.width * 20,
                backgroundColor: colors.white,
                borderRadius: SizeConfig.width * 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
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
        // Preview with Accept & Cancel
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: photo }}
            style={{ flex: 1 }}
            resizeMode="cover"
          />

          {/* Action Buttons */}
          <View
            style={{
              position: 'absolute',
              bottom: SizeConfig.height * 5,
              right: 0,
              left: 0,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              display: showConfirmModal ? 'none' : 'flex',
            }}
          >
            {/* Cancel Button ❌ */}
            <TouchableOpacity
              onPress={handleCancel}
              style={{
                width: SizeConfig.width * 18,
                height: SizeConfig.width * 18,
                backgroundColor: colors.white,
                borderRadius: SizeConfig.width * 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome
                name="times"
                color={colors.error || 'red'}
                size={SizeConfig.width * 7}
              />
            </TouchableOpacity>

            {/* Accept Button ✅ */}
            <TouchableOpacity
              onPress={() => {
                handleAccept();
              }}
              style={{
                width: SizeConfig.width * 18,
                height: SizeConfig.width * 18,
                backgroundColor: colors.white,
                borderRadius: SizeConfig.width * 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome
                name="check"
                color={colors.success || 'green'}
                size={SizeConfig.width * 7}
              />
            </TouchableOpacity>
          </View>

          {showConfirmModal ? (
            !isLoading ? (
              <View
                style={{
                  //   width: SizeConfig.width * 80,
                  backgroundColor: colors.white,
                  borderRadius: SizeConfig.width * 3,
                  padding: SizeConfig.width * 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: SizeConfig.fontSize * 3.8,
                    color: '#000080',
                    marginBottom: SizeConfig.height * 2,
                    textAlign: 'center',
                  }}
                >
                  Confirm your Captured Details
                </Text>

                {/* Details */}
                {[
                  { label: 'kWh', value: '1234' },
                  { label: 'Meter No', value: '1234567890' },
                  { label: 'Location', value: 'MSRD' },
                  { label: 'Employee No', value: '12345' },
                ].map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      //   marginVertical: SizeConfig.height,
                      borderBottomColor: colors.borderColor,
                      borderBottomWidth: 0.5,
                      paddingVertical: SizeConfig.height,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: SizeConfig.fontSize * 3.1,
                        fontFamily: fonts.medium,
                        color: '#000080',
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: SizeConfig.fontSize * 3,
                        fontFamily: fonts.medium,
                        color: colors.color_1A1A1A,
                      }}
                    >
                      {item.value}
                    </Text>
                  </View>
                ))}

                {/* Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginTop: SizeConfig.height * 3,
                  }}
                >
                  <TouchableOpacity
                    onPress={handleModalCancel}
                    style={{
                      backgroundColor: colors.error,
                      paddingVertical: SizeConfig.height * 1.5,
                      paddingHorizontal: SizeConfig.width * 6,
                      borderRadius: SizeConfig.width * 2,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: SizeConfig.fontSize * 3.4,
                        fontFamily: fonts.medium,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                      backgroundColor: colors.primary,
                      paddingVertical: SizeConfig.height * 1.5,
                      paddingHorizontal: SizeConfig.width * 6,
                      borderRadius: SizeConfig.width * 2,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: SizeConfig.fontSize * 3.4,
                        fontFamily: fonts.medium,
                      }}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  height: SizeConfig.height * 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* <Image
                  source={require('../../assets/images/meterReader/loader.gif')}
                  style={{
                    width: SizeConfig.width * 20,
                    height: SizeConfig.width * 20,
                    alignSelf: 'center',
                  }}
                /> */}

                <ActivityIndicator size={'large'} color={colors.primary} />
              </View>
            )
          ) : (
            ''
          )}
        </View>
      )}
    </View>
  );
}

export default MeterReader;
