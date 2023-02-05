import { NativeModules, Platform } from 'react-native';
import type {
  AllowedCardAuthMethodsTypes,
  AllowedCardNetworkTypes,
  EnvironmentType,
  IRequestData,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-google-pay' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

/** Google Pay Native Module */
const throwError = () => {
  throw new Error(`Google Pay is for Android only`);
};
const MockedObject = {
  setEnvironment: throwError,
  isReadyToPay: throwError,
  requestPayment: throwError,
  environments: {
    TEST: 0,
    PRODUCTION: 0,
  },
};

const GPayModule = NativeModules.GooglePay
  ? NativeModules.GooglePay
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const GPay = Platform.OS === 'android' ? GPayModule : MockedObject;

/**Functions */

/**
 * It initialize Google Pay in the environment you send as a paramater.
 * @param {Number} GooglePay.environments.TEST or @param {Number} GooglePay.environments.PRODUCTION
 */
function setEnvironment(environment: EnvironmentType) {
  return GPay.setEnvironment(environment);
}

/**
 * Before you display the Google Pay button, call the isReadyToPay API to determine if the user can make payments with the Google Pay API.
 * @param {Object} allowedCardNetworks
 * @param {Object} allowedCardAuthMethods
 * @returns A boolean that determines if the user can make payments with the Google Pay API
 */
function isReadyToPay(
  allowedCardNetworks: AllowedCardNetworkTypes[],
  allowedCardAuthMethods: AllowedCardAuthMethodsTypes[]
): Promise<boolean> {
  return GPay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods);
}

/**
 * The final step o request display of a Google Pay payment sheet after user activation of a Google Pay payment button.
 * @param {Object} requestData
 * @returns A token that you can use to process final payment.
 */
function requestPayment(requestData: IRequestData): Promise<string> {
  return GPay.requestPayment(requestData);
}

/** Environment Constants */
const environments = {
  TEST: GPay.ENVIRONMENT_TEST,
  PRODUCTION: GPay.ENVIRONMENT_PRODUCTION,
};

/**
 * Main component exported which includes all coonstants and functions that you need to finish a Google Pay process.
 * @returns Google Pay constants and functions.
 * @description Don't forget to add this line inside your AndroidManifest.xml file: 
 * ``<meta-data
      android:name="com.google.android.gms.wallet.api.enabled"
      android:value="true" />``
 */
export const GooglePay = {
  environments,
  setEnvironment,
  isReadyToPay,
  requestPayment,
};

/**
 * A hook that contains main component exported which includes all coonstants and functions that you need to finish a Google Pay process.
 * @returns Google Pay constants and functions.
 */
export const useGooglePay = () => {
  return { ...GooglePay };
};

/** Important NOTES:
 * If you want to use this module in your project you need to:
 * Go to ./android/build.gradle and add:
 allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
* Also go to AndroidManifest.xml and add these lines inside <application>:
<meta-data android:name="com.google.android.gms.wallet.api.enabled" android:value="true" />
 */
