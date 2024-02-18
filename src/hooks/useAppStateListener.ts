import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useAppStateListener = (
  onForeground?: () => void,
  onBackground?: () => void,
) => {
  const appStateRef = useRef(AppState.currentState);
  const onForegroundRef = useRef(onForeground);
  const onBackgroundRef = useRef(onBackground);

  // setting refs to avoid passing the functions as dependencies to useEffect
  onForegroundRef.current = onForeground;
  onBackgroundRef.current = onBackground;

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        onForegroundRef.current?.();
      } else if (nextAppState.match(/inactive|background/)) {
        onBackgroundRef.current?.();
      }
      appStateRef.current = nextAppState;
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);
  return {
    appState: appStateRef.current,
  };
};
