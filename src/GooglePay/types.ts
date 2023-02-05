export enum EnvironmentEnums {
  ENVIRONMENT_PRODUCTION = 1,
  ENVIRONMENT_TEST = 3,
}

export type EnvironmentType = 1 | 3;

export type AllowedCardNetworkTypes =
  | 'AMEX'
  | 'DISCOVER'
  | 'INTERAC'
  | 'JCB'
  | 'VISA'
  | 'MASTERCARD';

export type AllowedCardAuthMethodsTypes = 'PAN_ONLY' | 'CRYPTOGRAM_3DS';

export interface IRequestData {
  merchantName?: string;
  allowedPaymentMethods: ICardPaymentMethod;
  transactionInfo: ITransaction;
  shippingAddressRequired?: boolean;
  shippingAddressParameters?: {
    allowedCountryCodes?: string[];
    phoneNumberRequired?: boolean;
  };
}

export interface ICardPaymentMethod {
  allowedCardNetworks: AllowedCardNetworkTypes[];
  allowedAuthMethods: AllowedCardAuthMethodsTypes[];
  tokenizationSpecification: ITokenizationSpecification;
  billingAddressRequired?: boolean;
  billingAddressParameters?: {
    format?: 'MIN' | 'FULL';
    phoneNumberRequired?: boolean;
  };
}

export interface ITokenizationSpecification {
  type: 'PAYMENT_GATEWAY' | 'DIRECT'; //A payment method tokenization type is supported for the given PaymentMethod. For CARD payment method, use PAYMENT_GATEWAY or DIRECT.
  gateway?: string;
  gatewayMerchantId?: string;
  publicKey?: string;
}

export interface ITransaction {
  currencyCode: string;
  countryCode?: string; //(required for EEA countries)
  transactionId?: string;
  totalPriceStatus: 'NOT_CURRENTLY_KNOWN' | 'ESTIMATED' | 'FINAL';
  totalPrice: string; //The format of the string should follow the regex format: ^[0-9]+(\.[0-9][0-9])?$
  totalPriceLabel?: string;
  checkoutOption?: 'DEFAULT' | 'COMPLETE_IMMEDIATE_PURCHASE';
}
