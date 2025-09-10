import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {
  Camera,
  useCameraDevice,
  CameraProps,
} from 'react-native-vision-camera';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../utils/Theme';
import { useGetMeterReadingMutation } from '../../redux/slices/ocrSlice';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import { ShowToast } from '../../utils/UtilityFunctions';
import { useNetwork } from '../../ContextApi/NetworkProvider';

const AnimatedCamera = Animated.createAnimatedComponent(Camera);
Animated.addWhitelistedNativeProps({ zoom: true, exposure: true });

type OcrScreenProps = DrawerScreenProps<NavigationType, 'OcrScreen'>;

const OcrScreen = ({ navigation }: OcrScreenProps) => {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera | null>(null);

  const [showZoom, setShowZoom] = useState<number>(0.5);
  const [flash, setFlash] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [showControler, setShowControler] = useState(true);
  // const [isLoading , setLo]

  const zoom = useSharedValue<number>(1);
  const zoomOffset = useSharedValue<number>(0);
  const exposureSlider = useSharedValue(0);

  const [getMeterReading] = useGetMeterReadingMutation();
  const { isConnected } = useNetwork();

  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate(event => {
      if (!device) return;

      const min = device.minZoom ?? 1;
      const max = device.maxZoom ?? 1;

      let newZoom = zoomOffset.value * event.scale;
      newZoom = Math.max(min, Math.min(newZoom, max));

      zoom.value = withTiming(newZoom, { duration: 16 });

      const normalized = interpolate(newZoom, [min, max], [0, 1]);
      runOnJS(setShowZoom)(Number(normalized.toFixed(2)));
    });

  const exposureValue = useDerivedValue(() => {
    if (device == null) return 0;

    return interpolate(
      exposureSlider.value,
      [-1, 0, 1],
      [device.minExposure, 0, device.maxExposure],
    );
  }, [exposureSlider, device]);

  const animatedProps = useAnimatedProps<CameraProps>(() => {
    return { zoom: zoom.value, exposure: exposureValue.value };
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photoData = await cameraRef.current.takePhoto({
        flash: flash ? 'on' : 'off',
      });

      const path = photoData.path?.startsWith('file://')
        ? photoData.path
        : `file://${photoData.path}`;

      if (path) {
        // const response = await getMeterReading({
        //   imageUrl: path,
        //   name: 'meter.jpg',
        //   type: 'image/jpeg',
        // }).unwrap();
        // console.log(response);

        navigation.navigate('SubmitionPreview', {
          url: path,
          serial_number: '83886899868',
          meter_reading: '323333.544 kWh',
          outlet: 'Hyderabad',
          verify_time: null,
          status: false,
          timestamp: '2025-09-03T15:12:03.775396+05:30',
        });
      }
    } catch (err) {
      console.error('takePhoto error', err);
      ShowToast({
        title: 'Something Went Wrong',
        description: 'Failed to capture photo. Try again later.',
        type: 'error',
      });
    }
  };

  const onSliderChange = (val: number) => {
    if (!device) {
      setShowZoom(val);
      return;
    }

    setShowZoom(val);
    const mapped = interpolate(val, [0, 1], [device.minZoom, device.maxZoom]);
    zoom.value = withTiming(mapped, { duration: 10 });
  };

  useEffect(() => {
    if (!device) return;
    const { neutralZoom, minZoom, maxZoom } = device;

    zoom.value = neutralZoom ?? 1;
    const normalized = interpolate(
      neutralZoom ?? 1,
      [minZoom, maxZoom],
      [0, 1],
      Extrapolation.CLAMP,
    );
    setShowZoom(Number(normalized.toFixed(2)));
  }, [device, zoom]);

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
      <StatusBar
        backgroundColor={'#00000038'}
        barStyle={'light-content'}
        translucent
      />
      <GestureDetector gesture={gesture}>
        <AnimatedCamera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          animatedProps={animatedProps}
          photo
        />
      </GestureDetector>

      <View style={styles.bottomBar}>
        {showControler && (
          <View style={styles.sliderContainer}>
            <View
              style={{
                gap: SizeConfig.height,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontFamily: fonts.medium,
                  fontSize: SizeConfig.fontSize * 3,
                }}
              >
                Zoom in
              </Text>
              <Slider
                value={showZoom}
                onValueChange={onSliderChange}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                minimumTrackTintColor="rgba(0, 170, 255, 1)"
                maximumTrackTintColor={colors.white}
                thumbTintColor={colors.white}
                style={{
                  width: '100%',
                  height: SizeConfig.height * 3,
                }}
              />
            </View>

            <View
              style={{
                gap: SizeConfig.height,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontFamily: fonts.medium,
                  fontSize: SizeConfig.fontSize * 3,
                }}
              >
                Brightness
              </Text>
              <Slider
                style={{ width: '100%', height: SizeConfig.height * 3 }}
                value={brightness}
                onValueChange={val => {
                  exposureSlider.value = val;
                }}
                minimumValue={-1}
                maximumValue={1}
                step={0.01}
                minimumTrackTintColor="#ff0"
                maximumTrackTintColor={colors.white}
                thumbTintColor="#fff"
              />
            </View>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setFlash(prev => !prev)}
          >
            <Image
              source={
                flash
                  ? require('../../assets/images/ocr/flashOff.png')
                  : require('../../assets/images/ocr/flashOn.png')
              }
              style={{
                width: SizeConfig.width * 7,
                height: SizeConfig.width * 7,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.captureContainer}
            onPress={() => {
              if (isConnected) {
                takePhoto();
              } else {
                ShowToast({
                  title: 'No Service Provider',
                  description: 'No Internet connection found !',
                  type: 'error',
                });
              }
            }}
          >
            <Image
              source={require('../../assets/images/ocr/shutter.png')}
              style={{
                width: SizeConfig.width * 15,
                height: SizeConfig.width * 15,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setShowControler(!showControler);
            }}
          >
            <MaterialIcons
              name="tune"
              size={SizeConfig.fontSize * 5.5}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  sliderContainer: {
    width: '100%',
    alignSelf: 'center',
    gap: SizeConfig.height * 1.5,
  },
  corner: {
    position: 'absolute',
    width: SizeConfig.width * 4.5,
    height: SizeConfig.width * 4.5,
    borderColor: colors.white,
  },
  topLeft: {
    top: SizeConfig.height * 25,
    left: SizeConfig.width * 15,
    borderLeftWidth: SizeConfig.width,
    borderTopWidth: SizeConfig.width,
  },
  topRight: {
    top: SizeConfig.height * 25,
    right: SizeConfig.width * 15,
    borderRightWidth: SizeConfig.width,
    borderTopWidth: SizeConfig.width,
  },
  bottomLeft: {
    bottom: SizeConfig.height * 40,
    left: SizeConfig.width * 15,
    borderLeftWidth: SizeConfig.width,
    borderBottomWidth: SizeConfig.width,
  },
  bottomRight: {
    bottom: SizeConfig.height * 40,
    right: SizeConfig.width * 15,
    borderRightWidth: SizeConfig.width,
    borderBottomWidth: SizeConfig.width,
  },
  instructionContainer: {
    top: SizeConfig.height * 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: colors.white,
    fontSize: SizeConfig.fontSize * 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SizeConfig.width * 4,
    paddingVertical: SizeConfig.height,
    borderRadius: SizeConfig.width * 10,
    fontFamily: fonts.medium,
    // marginLeft : SizeConfig.width * 5
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
    paddingHorizontal: SizeConfig.width * 5,
    gap: SizeConfig.height * 2,
    paddingBottom: SizeConfig.height * 5,
    paddingTop: SizeConfig.height * 3,
  },
  iconButton: {
    width: SizeConfig.width * 13,
    height: SizeConfig.width * 13,
    borderRadius: (SizeConfig.width * 13) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c3c381',
    borderWidth: 3,
    borderColor: '#C4C3C3',
  },
  captureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: SizeConfig.width * 11,
    height: SizeConfig.width * 11,
    borderRadius: (SizeConfig.width * 11) / 2,
    backgroundColor: colors.pureBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: SizeConfig.width * 10,
    height: SizeConfig.width * 10,
    borderRadius: (SizeConfig.width * 10) / 2,
    backgroundColor: 'green',
  },
  noCamerDetectedText: {
    paddingHorizontal: SizeConfig.width * 4,
    width: SizeConfig.width * 70,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.black,
  },
});

export default OcrScreen;
