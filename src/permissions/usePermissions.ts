import {useCallback} from 'react';

export const usePermissions = () => {
  const askPermissions = useCallback(async (): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      //ask permission from user to access camera
      //if error present, return error
      await request(getPermission()).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            ToastMessageService.showError({
              text: t(
                'commissioningSteps.photographUnits.errorMessages.featureNotAvailable',
              ) as string,
            });
            return reject();
          case RESULTS.DENIED:
            setShowPermissionsModal({
              type: PermissionTypes.denied,
              value: true,
            });
            return reject();
          case RESULTS.GRANTED:
            return resolve();
          case RESULTS.BLOCKED:
            setShowPermissionsModal({
              type: PermissionTypes.blocked,
              value: true,
            });
            return reject();
          case RESULTS.LIMITED:
            return resolve();
        }
      });
    });
  }, []);
};
