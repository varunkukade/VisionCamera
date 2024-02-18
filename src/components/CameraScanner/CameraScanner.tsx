import React, {useEffect, useRef, useState} from 'react';
import {Alert, Modal, SafeAreaView, View} from 'react-native';

import {styles} from './CameraScanner.styles';
import {RNHoleView} from 'react-native-hole-view';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {getWindowHeight, getWindowWidth, isIos} from '../../helpers';
import {useAppStateListener} from '../../hooks/useAppStateListener';
import {ICameraScannerProps} from '../../types';

export const CameraScanner = ({
  setIsCameraShown,
  onReadCode,
}: ICameraScannerProps) => {
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const isFocused = useIsFocused();
  const [isCameraInitialized, setIsCameraInitialized] = useState(isIos);
  const [isActive, setIsActive] = useState(isIos);
  const [flash, setFlash] = useState<'on' | 'off'>(isIos ? 'off' : 'on');
  const {appState} = useAppStateListener();
  const [codeScanned, setCodeScanned] = useState('');

  useEffect(() => {
    if (codeScanned) {
      onReadCode(codeScanned);
    }
  }, [codeScanned, onReadCode]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isCameraInitialized) {
      timeout = setTimeout(() => {
        setIsActive(true);
        setFlash('off');
      }, 1000);
    }
    setIsActive(false);
    return () => {
      clearTimeout(timeout);
    };
  }, [isCameraInitialized]);

  const onInitialized = () => {
    setIsCameraInitialized(true);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        if (codes[0].value) {
          setIsActive(false);
          setTimeout(() => setCodeScanned(codes[0]?.value), 500);
        }
      }
      return;
    },
  });

  const onCrossClick = () => {
    setIsCameraShown(false);
  };

  const onError = (error: CameraRuntimeError) => {
    Alert.alert('Error!', error.message);
  };

  if (device == null) {
    Alert.alert('Error!', 'Camera could not be started');
  }

  if (isFocused && device) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Modal presentationStyle="fullScreen" animationType="slide">
          <View style={[styles.cameraControls, {backgroundColor: undefined}]} />
          <Camera
            torch={flash}
            onInitialized={onInitialized}
            ref={camera}
            onError={onError}
            photo={false}
            style={styles.fullScreenCamera}
            device={device}
            codeScanner={codeScanner}
            isActive={
              isActive &&
              isFocused &&
              appState === 'active' &&
              isCameraInitialized
            }
          />
          <RNHoleView
            holes={[
              {
                x: getWindowWidth() * 0.1,
                y: getWindowHeight() * 0.28,
                width: getWindowWidth() * 0.8,
                height: getWindowHeight() * 0.4,
                borderRadius: 10,
              },
            ]}
            style={[styles.rnholeView, styles.fullScreenCamera]}
          />
        </Modal>
      </SafeAreaView>
    );
  }
};
