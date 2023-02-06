# @adembacaj/react-native-google-pay

Google Pay native modules for React-Native

## Installation

```sh
npm install @adembacaj/react-native-google-pay
or
yarn add @adembacaj/react-native-google-pay
```

## Android Extra Actions
In AndroidManifest.xml, inside <application> you need to put:
```sh
      <!-- This is required to make Google Pay works -->
      <meta-data
      android:name="com.google.android.gms.wallet.api.enabled"
      android:value="true" />
  <!--  -->
```
Also inside your ./android/build.gradle file, you need to put:

```sh
buildscript {
    // ...
    // Necessary to make GooglePay work.
    allprojects {
        repositories {
            google()
            mavenCentral()
             }
    }
}

```

## Usage
### Set Environment
It is important to set environment when you entry Google Pay Screen, or in useEffect, before using isReadyToPay function

```js
import { GooglePay } from '@adembacaj/react-native-google-pay';

// ...

GooglePay.setEnvironment(GooglePay.environments.TEST);
```

### Check isReadyToPay
Before using Google Pay, if you want to enable/disable or show/hide Google Pay button, you need to call this function to check if device is ready to pay or not.

```js
import { GooglePay } from '@adembacaj/react-native-google-pay';

const _allowedCardNetworksExample: AllowedCardNetworkTypes[] = [
  'AMEX',
  'DISCOVER',
  'INTERAC',
  'JCB',
  'VISA',
  'MASTERCARD',
];
/** Before you set allowedCardAuthMethods, confirm with your payment processor and acquirer on whether device tokens (CRYPTOGRAM_3DS) are supported in your region. */
const _allowedAuthMethodsExample: AllowedCardAuthMethodsTypes[] = [
  'PAN_ONLY',
  'CRYPTOGRAM_3DS',
];

// ...
const isReady: boolean = await GooglePay.isReadyToPay(_allowedCardNetworksExample,_allowedAuthMethodsExample);
```

### Direct Google Payment
You can use different payment gateways, but you can also use direct payment.

```js
import { GooglePay } from '@adembacaj/react-native-google-pay';
import type { IRequestData } from '@adembacaj/react-native-google-pay';

const _allowedCardNetworksExample: AllowedCardNetworkTypes[] = [
  'AMEX',
  'DISCOVER',
  'INTERAC',
  'JCB',
  'VISA',
  'MASTERCARD',
];
/** Before you set allowedCardAuthMethods, confirm with your payment processor and acquirer on whether device tokens (CRYPTOGRAM_3DS) are supported in your region. */
const _allowedAuthMethodsExample: AllowedCardAuthMethodsTypes[] = [
  'PAN_ONLY',
  'CRYPTOGRAM_3DS',
];
const _directRequestDataExample: IRequestData = {
  allowedPaymentMethods: {
    tokenizationSpecification: {
      type: 'DIRECT',
      publicKey:
        'BOdoXP+9Aq473SnGwg3JU1aiNpsd9vH2ognq4PtDtlLGa3Kj8TPf+jaQNPyDSkh3JUhiS0KyrrlWhAgNZKHYF2Y=',
    },
    allowedCardNetworks: _allowedCardNetworksExample,
    allowedAuthMethods: _allowedAuthMethodsExample,
    billingAddressRequired: false,
    billingAddressParameters: {
      format: 'FULL',
      phoneNumberRequired: true,
    },
  },
  transactionInfo: {
    totalPrice: '10',
    totalPriceStatus: 'FINAL',
    currencyCode: 'USD',
  },
  shippingAddressRequired: false,
  shippingAddressParameters: {
    phoneNumberRequired: true,
  },
  merchantName: 'Example Merchant',
};

// ...
//Check if device/creditcard is ready to pay
if (isReadyToPay) {
    const token = await GooglePay.requestPayment(_directRequestDataExample);
    Alert.alert('Token: ', token);
    }
```


### Payment Gateway Google Payment
You can use different payment gateways, in this example we will use Adyen.

```js
import { GooglePay } from '@adembacaj/react-native-google-pay';
import type { IRequestData } from '@adembacaj/react-native-google-pay';

const _allowedCardNetworksExample: AllowedCardNetworkTypes[] = [
  'AMEX',
  'DISCOVER',
  'INTERAC',
  'JCB',
  'VISA',
  'MASTERCARD',
];
/** Before you set allowedCardAuthMethods, confirm with your payment processor and acquirer on whether device tokens (CRYPTOGRAM_3DS) are supported in your region. */
const _allowedAuthMethodsExample: AllowedCardAuthMethodsTypes[] = [
  'PAN_ONLY',
  'CRYPTOGRAM_3DS',
];
const _adyenRequestDataExample: IRequestData = {
  allowedPaymentMethods: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      gateway: 'adyen',
      gatewayMerchantId: 'PAYRAILS',
    },
    allowedCardNetworks: _allowedCardNetworksExample,
    allowedAuthMethods: _allowedAuthMethodsExample,
    billingAddressRequired: true,
    billingAddressParameters: {
      format: 'FULL',
      phoneNumberRequired: true,
    },
  },
  transactionInfo: {
    totalPrice: '10',
    totalPriceStatus: 'FINAL',
    currencyCode: 'USD',
    checkoutOption: 'COMPLETE_IMMEDIATE_PURCHASE',
  },
  merchantName: 'Example Merchant',
};

// ...
//Check if device/creditcard is ready to pay
if (isReadyToPay) {
    const token = await GooglePay.requestPayment(_adyenRequestDataExample);
    Alert.alert('Token: ', token);
    }
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
