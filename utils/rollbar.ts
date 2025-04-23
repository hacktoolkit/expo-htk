import { ROLLBAR_ACCESS_TOKEN, ROLLBAR_ENV } from '@htk/constants';
import { Client } from 'rollbar-react-native';

export const rollbarNative = new Client({
    accessToken: ROLLBAR_ACCESS_TOKEN || '',
    environment: ROLLBAR_ENV || 'development',
    captureUncaught: true,
    captureUnhandledRejections: true,
    captureDeviceInfo: true,
});

export const rollbar = rollbarNative.rollbar;
