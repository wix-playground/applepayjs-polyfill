import { ApplePaySessionPolyfillFactory } from './ApplePaySessionPolyfillFactory';

export class ApplePaySession {
  oncancel = null;
  onpaymentauthorized = null;
  onpaymentmethodselected = null;
  onshippingcontactselected = null;
  onshippingmethodselected = null;
  onvalidatemerchant = null;
  version = null;
  session = null;

  private static __applePaySessionPolyfill: ApplePaySessionPolyfillFactory = null;

  constructor(version: number, paymentRequest) {
      this.version = version;
      ApplePaySession.__applePaySessionPolyfill.onInit(this, version, paymentRequest);
  }

  static STATUS_SUCCESS = 0;
  static STATUS_FAILURE = 1;
  static STATUS_INVALID_BILLING_POSTAL_ADDRESS = 2;
  static STATUS_INVALID_SHIPPING_POSTAL_ADDRESS = 3;
  static STATUS_INVALID_SHIPPING_CONTACT = 4;
  static STATUS_PIN_REQUIRED = 5;
  static STATUS_PIN_INCORRECT = 6;
  static STATUS_PIN_LOCKOUT = 7;

  /**
   * Sets polyfill
   * @param polyfill ApplePaySessionPolyfillFactory
   */
  static setApplePaySessionPolyfill(polyfill: ApplePaySessionPolyfillFactory): void {
    ApplePaySession.__applePaySessionPolyfill = polyfill;
  }


  static canMakePayments = function (): boolean {
      return ApplePaySession.__applePaySessionPolyfill.onCanMakePayments(this);
  };

  static canMakePaymentsWithActiveCard = function (merchantIdentifier): boolean {
      return ApplePaySession.__applePaySessionPolyfill.onCanMakePaymentsWithActiveCard(this, merchantIdentifier);
  };

  static openPaymentSetup = function (merchantIdentifier) {
      return ApplePaySession.__applePaySessionPolyfill.onOpenPaymentSetup(this, merchantIdentifier);
  };

  static supportsVersion = function (version) {
      return ApplePaySession.__applePaySessionPolyfill.onSupportsVersion(this, version);
  };

  abort = function () {
      ApplePaySession.__applePaySessionPolyfill.onAbort(this);
  };

  begin = function () {
      ApplePaySession.__applePaySessionPolyfill.onBegin(this);
  };

  completeMerchantValidation = function (merchantSession) {
      ApplePaySession.__applePaySessionPolyfill.onCompleteMerchantValidation(this, merchantSession);
  };

  completePayment = function (...args) {
      if (this.version >= 3) {
          var result = args[0];
          ApplePaySession.__applePaySessionPolyfill.onCompletePaymentV3(this, result);
      } else {
          var status = args[0];
          ApplePaySession.__applePaySessionPolyfill.onCompletePayment(this, status);
      }
  };

  completePaymentMethodSelection = function (...args) {
      if (this.version >= 3) {
          var update = args[0];
          ApplePaySession.__applePaySessionPolyfill.onCompletePaymentMethodSelectionV3(this, update);
      } else {
          var newTotal = args[0];
          var newLineItems = args[1];
          ApplePaySession.__applePaySessionPolyfill.onCompletePaymentMethodSelection(this, newTotal, newLineItems);
      }
  };

  completeShippingContactSelection = function (...args) {
      if (this.version >= 3) {
          var update = args[0];
          ApplePaySession.__applePaySessionPolyfill.onCompleteShippingContactSelectionV3(this, update);
      } else {
          var status = args[0];
          var newShippingMethods = args[1];
          var newTotal = args[2];
          var newLineItems = args[3];
          ApplePaySession.__applePaySessionPolyfill.onCompleteShippingContactSelection(this, status, newShippingMethods, newTotal, newLineItems);
      }
  };

  completeShippingMethodSelection = function (...args) {
      if (this.version >= 3) {
          var update = args[0];
          ApplePaySession.__applePaySessionPolyfill.onCompleteShippingMethodSelectionV3(this, update);
      } else {
          var status = args[0];
          var newTotal = args[1];
          var newLineItems = args[2];
          ApplePaySession.__applePaySessionPolyfill.onCompleteShippingMethodSelection(this, status, newTotal, newLineItems);
      }
  };
}
