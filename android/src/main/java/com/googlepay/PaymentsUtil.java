package com.googlepay;

import android.app.Activity;

import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.Wallet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import com.facebook.react.bridge.ReadableMap;

public class PaymentsUtil {

  private PaymentsUtil() {
  }

  private static JSONObject getBaseRequest() throws JSONException {
    return new JSONObject().put("apiVersion", 2).put("apiVersionMinor", 0);
  }

  private static JSONObject getBaseCardPaymentMethod(ArrayList allowedCardNetworks, ArrayList allowedCardAuthMethods, Boolean billingAddressRequired, JSONObject billingAddressParameters) throws JSONException {
    JSONObject cardPaymentMethod = new JSONObject();
    cardPaymentMethod.put("type", "CARD"); //CARD is currently the only supported payment method.

    JSONObject parameters = new JSONObject();
    parameters.put("allowedAuthMethods", new JSONArray(allowedCardAuthMethods));
    parameters.put("allowedCardNetworks", new JSONArray(allowedCardNetworks));

    /** Handling Billing Address */
    if(billingAddressRequired){
      parameters.put("billingAddressRequired", true);
    }
    if(billingAddressParameters != null){
      parameters.put("billingAddressParameters", billingAddressParameters);
    }

    cardPaymentMethod.put("parameters", parameters);

    return cardPaymentMethod;
  }

  private static JSONObject checkAllowedPaymentMethods(ArrayList allowedCardNetworks, ArrayList allowedCardAuthMethods) throws JSONException {
    JSONObject cardPaymentMethod = new JSONObject();
    cardPaymentMethod.put("type", "CARD"); //CARD is currently the only supported payment method.

    JSONObject parameters = new JSONObject();
    parameters.put("allowedAuthMethods", new JSONArray(allowedCardAuthMethods));
    parameters.put("allowedCardNetworks", new JSONArray(allowedCardNetworks));
    cardPaymentMethod.put("parameters", parameters);

    return cardPaymentMethod;
  }

  public static PaymentsClient createPaymentsClient(int environment, Activity activity) {
    Wallet.WalletOptions walletOptions = new Wallet.WalletOptions.Builder().setEnvironment(environment).build();
    return Wallet.getPaymentsClient(activity, walletOptions);
  }

  public static JSONObject getIsReadyToPayRequest(ArrayList allowedCardNetworks, ArrayList allowedCardAuthMethods) {
    try {
      JSONObject isReadyToPayRequest = getBaseRequest();
      JSONArray allowedPaymentMethods = new JSONArray().put(checkAllowedPaymentMethods(allowedCardNetworks, allowedCardAuthMethods));
      isReadyToPayRequest.put("allowedPaymentMethods", allowedPaymentMethods);
      return isReadyToPayRequest;
    } catch (JSONException e) {
      return null;
    }
  }

  private static JSONObject getTransactionInfo(ReadableMap transaction) throws JSONException {
    JSONObject transactionInfo = new JSONObject();
    transactionInfo.put("totalPrice", transaction.getString("totalPrice"));
    transactionInfo.put("totalPriceStatus", transaction.getString("totalPriceStatus"));
    transactionInfo.put("currencyCode", transaction.getString("currencyCode"));
    if (transaction.hasKey("checkoutOption")){
      transactionInfo.put("checkoutOption", transaction.getString("checkoutOption"));
    }

    return transactionInfo;
  }

  private static JSONObject getMerchantInfo(String merchantName) throws JSONException {
    return new JSONObject().put("merchantName", merchantName);
  }

  private static JSONObject getGatewayTokenizationSpecification(final ReadableMap tokenizationSpecification) throws JSONException {
    return new JSONObject() {{
      put("type", tokenizationSpecification.getString("type"));
      put("parameters", new JSONObject() {
        {
          if (tokenizationSpecification.hasKey("gateway")) {
            put("gateway", tokenizationSpecification.getString("gateway"));
          }
          if (tokenizationSpecification.hasKey("gatewayMerchantId")) {
            put("gatewayMerchantId", tokenizationSpecification.getString("gatewayMerchantId"));
          }
          if (tokenizationSpecification.hasKey("publicKey")) {
            put("protocolVersion", "ECv2");
            put("publicKey", tokenizationSpecification.getString("publicKey"));
          }
        }
      });
    }};
  }

  private static JSONObject getCardPaymentMethod(ReadableMap cardPaymentMethodData) throws JSONException {
    ArrayList allowedCardNetworks = cardPaymentMethodData.getArray("allowedCardNetworks").toArrayList();
    ArrayList allowedCardAuthMethods = cardPaymentMethodData.getArray("allowedAuthMethods").toArrayList();
    if(cardPaymentMethodData.hasKey("billingAddressRequired")){
      Boolean billingAddressRequired = cardPaymentMethodData.getBoolean("billingAddressRequired");
      JSONObject billingAddressParameters = new JSONObject(){{
        if(cardPaymentMethodData.hasKey("billingAddressParameters")){
          if(cardPaymentMethodData.getMap("billingAddressParameters").hasKey("format")){
            put("format", cardPaymentMethodData.getMap("billingAddressParameters").getString("format"));
          }
          if(cardPaymentMethodData.getMap("billingAddressParameters").hasKey("phoneNumberRequired")){
            put("phoneNumberRequired", cardPaymentMethodData.getMap("billingAddressParameters").getBoolean("phoneNumberRequired"));
          }
        }
      }};
      JSONObject cardPaymentMethod = getBaseCardPaymentMethod(allowedCardNetworks, allowedCardAuthMethods, billingAddressRequired, billingAddressParameters);
      cardPaymentMethod.put("tokenizationSpecification", getGatewayTokenizationSpecification(cardPaymentMethodData.getMap("tokenizationSpecification")));
      return cardPaymentMethod;
    }else {
      JSONObject cardPaymentMethod = getBaseCardPaymentMethod(allowedCardNetworks, allowedCardAuthMethods, false, new JSONObject());
      cardPaymentMethod.put("tokenizationSpecification", getGatewayTokenizationSpecification(cardPaymentMethodData.getMap("tokenizationSpecification")));
      return cardPaymentMethod;
    }
  }

  public static JSONObject getPaymentDataRequest(ReadableMap requestData) {
    try {
      JSONObject paymentDataRequest = PaymentsUtil.getBaseRequest();
      paymentDataRequest.put(
          "allowedPaymentMethods", new JSONArray().put(PaymentsUtil.getCardPaymentMethod(requestData.getMap("allowedPaymentMethods"))));
      paymentDataRequest.put("transactionInfo", PaymentsUtil.getTransactionInfo(requestData.getMap("transactionInfo")));
      paymentDataRequest.put("merchantInfo", PaymentsUtil.getMerchantInfo(requestData.getString("merchantName")));

      /** Handling Shipping Address */
      if(requestData.hasKey("shippingAddressRequired")){
        paymentDataRequest.put("shippingAddressRequired", requestData.getBoolean("shippingAddressRequired"));
      }
      if(requestData.hasKey("shippingAddressParameters")){
        JSONObject shippingAddressParameters = new JSONObject() {{
          if(requestData.getMap("shippingAddressParameters").hasKey("allowedCountryCodes")){
            put("allowedCountryCodes", requestData.getMap("shippingAddressParameters").getArray("allowedCountryCodes").toArrayList());
          }
          if(requestData.getMap("shippingAddressParameters").hasKey("phoneNumberRequired")){
            put("phoneNumberRequired", requestData.getMap("shippingAddressParameters").getBoolean("phoneNumberRequired"));
          }
        }};
        paymentDataRequest.put("shippingAddressParameters", shippingAddressParameters);
      }

      return paymentDataRequest;
    } catch (JSONException e) {
      return null;
    }
  }
}