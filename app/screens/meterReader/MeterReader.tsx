import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
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
      <View style={styles.centeredView}>
        <Text>No camera device found 📷</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centeredView}>
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
    setIsLoading(true);

    setTimeout(() => {
      setShowConfirmModal(true);
      setIsLoading(false);
    }, 9000);
  };

  const handleSubmit = () => {
    console.log('✅ Photo accepted:', photo);
    setShowConfirmModal(false);
    
    // TODO: Upload / Save logic
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
    setPhoto(null); 
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        // Camera View
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          {/* Capture Button */}
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
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
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} resizeMode="cover" />

          {/* Action Buttons */}
          <View
            style={[
              styles.actionButtonsContainer,
              { display: showConfirmModal ? 'none' : 'flex' },
            ]}
          >
            {/* Cancel Button ❌ */}
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <FontAwesome
                name="times"
                color={colors.error || 'red'}
                size={SizeConfig.width * 7}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAccept} style={styles.acceptButton}>
              <FontAwesome
                name="check"
                color={colors.success || 'green'}
                size={SizeConfig.width * 7}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.loadingOverlay, { display: isLoading ? 'flex' : 'none' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>

          {showConfirmModal ? (
            <View style={styles.confirmModal}>
              <Text style={styles.confirmTitle}>Confirm your Captured Details</Text>

              {/* Details */}
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

              {/* Buttons */}
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity onPress={handleModalCancel} style={styles.modalCancelButton}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmit} style={styles.modalSubmitButton}>
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
});

export default MeterReader;
