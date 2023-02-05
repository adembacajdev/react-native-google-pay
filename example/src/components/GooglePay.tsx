import * as React from 'react';

import { StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { GooglePay } from 'react-native-google-pay';
import type {
  AllowedCardAuthMethodsTypes,
  AllowedCardNetworkTypes,
  IRequestData,
} from 'react-native-google-pay';

GooglePay.setEnvironment(GooglePay.environments.TEST);

export function GooglePayExample() {
  const [isReadyToPay, setIsReadyToPay] = React.useState<boolean>(false);

  const checkIsReadyToPay = async () => {
    const isReady: boolean = await GooglePay.isReadyToPay(
      _allowedCardNetworksExample,
      _allowedAuthMethodsExample
    );
    setIsReadyToPay(isReady);
  };

  React.useEffect(() => {
    //In this case, I am checking if user is ready to pay immediately after mounting this component, but you can decide to use it whenever you want.
    //Ensure the Google Pay payment button only appears after your app has confirmed the user's ability to pay through the isReadyToPay() function.
    checkIsReadyToPay();
  }, []);

  const directGPay = async () => {
    /** Direct example payment */
    try {
      //Check if device/creditcard is ready to pay
      if (isReadyToPay) {
        const token = await GooglePay.requestPayment(_directRequestDataExample);
        Alert.alert('Congratulations', token);
      }
    } catch (error: any) {
      console.log(error.code, error.message);
    }
  };

  const adyenGPay = async () => {
    /** Adyen Gateway example payment */
    try {
      //Check if device/creditcard is ready to pay
      if (isReadyToPay) {
        const token = await GooglePay.requestPayment(_adyenRequestDataExample);
        Alert.alert('Congratulations', token);
      }
    } catch (error: any) {
      console.log(error.code, error.message);
    }
  };

  return (
    <>
      <TouchableOpacity
        disabled={!isReadyToPay}
        onPress={directGPay}
        style={styles.payButton}
      >
        <Text>Direct Google Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!isReadyToPay}
        onPress={adyenGPay}
        style={styles.payButton}
      >
        <Text>Google Pay with Adyen Gateway</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  payButton: {
    marginTop: 10,
  },
});

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
