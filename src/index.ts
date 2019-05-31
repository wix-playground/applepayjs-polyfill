class ApplePaySessionPolyfillFactory {
    hasActiveSession = false;
    isApplePaySetUp = true;
    paymentsEnabled = true;
    paymentRequest = null;
    merchantIdentifier = "";
    supportedVersions = [1, 2, 3];
    validationURL = "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession";
    version = 3;

    /**
     * Disables payments with ApplePaySession.
     */
    disablePayments = function () {
      this.paymentsEnabled = false;
    };

    /**
     * Enables payments with ApplePaySession.
     */
    enablePayments = function () {
      this.paymentsEnabled = true;
    };

    /**
     * Sets the merchant identifier to use for payment.
     * @param {String} merchantIdentifier - The merchant identifier to use.
     */
    setMerchantIdentifier = function (merchantIdentifier) {
        this.merchantIdentifier = merchantIdentifier;
    };

    /**
     * Sets whether the user has set up Apple Pay.
     * @param {Boolean} isSetUp - Whether Apple Pay has been set up by the user on the device.
     */
    setUserSetupStatus = function (isSetUp) {
        this.isApplePaySetUp = isSetUp;
    };

    /**
     * Sets the validation URL to use for merchant validation.
     * @param {String} validationURL - The URL to use for merchant validation.
     */
    setValidationURL = function (validationURL) {
        this.validationURL = validationURL;
    };

    /**
     * Creates a PaymentContact to use for billing.
     * @param {Object} session - The current ApplePaySession.
     * @returns {PaymentContact} The PaymentContact created for billing.
     */
    createBillingContact = function (session) {
        throw "You must implement ApplePaySessionPolyfill.createBillingContact()";
    };

    /**
     * Creates a PaymentContact to use for shipping.
     * @param {Object} session - The current ApplePaySession.
     * @returns {PaymentContact} The PaymentContact created for shipping.
     */
    createShippingContact = function (session) {
        throw "You must implement ApplePaySessionPolyfill.createShippingContact()";
    };

    /**
     * Creates a PaymentToken for an authorized payment.
     * @param {Object} session - The current ApplePaySession.
     * @returns {PaymentToken} The PaymentToken created for an authorized payment.
     */
    createPaymentToken = function (session) {
        throw "You must implement ApplePaySessionPolyfill.createPaymentToken()";
    };

    /**
     * Callback for when a new ApplePaySession is initialized.
     * @param {Object} session - The current ApplePaySession.
     * @param {Number} version - The version passed to the ApplePaySession.
     * @param {PaymentRequest} paymentRequest - The payment request passed to the ApplePaySession.
     */
    onInit = function (session, version, paymentRequest) {

        if (this.hasActiveSession === true) {
            throw "Page already has an active payment session.";
        }

        if (this.supportedVersions.indexOf(version) === -1) {
            throw "\"" + version + "\" is not a supported version.";
        }

        if (!paymentRequest || !("countryCode" in paymentRequest)) {
            throw "Missing country code.";
        }

        var countryCodes = ["AE", "AU", "CA", "CH", "CN", "DK", "ES", "FR", "FI", "GB", "GG", "HK", "IE", "IM", "IT", "JE", "JP", "NZ", "RU", "SG", "SM", "SW", "TW", "US", "VA"];
        var currencyCodes = ["AED", "AUD", "CAD", "CHF", "CNY", "DKK", "EUR", "GBP", "HKD", "JPY", "NZD", "RUB", "SEK", "SGD", "TWD", "USD"];
        var merchantCapabilities = ["supports3DS", "supportsEMV", "supportsCredit", "supportsDebit"];
        var paymentNetworks = ["amex", "discover", "interac", "masterCard", "privateLabel", "visa"];

        if (version > 1) {
            paymentNetworks.push("jcb");
        }

        if (countryCodes.indexOf(paymentRequest.countryCode) === -1) {
            throw "\"" + paymentRequest.countryCode + "\" is not valid country code.";
        }

        if (!("currencyCode" in paymentRequest)) {
            throw "Missing currency code.";
        }

        if (currencyCodes.indexOf(paymentRequest.currencyCode) === -1) {
            throw "\"" + paymentRequest.currencyCode + "\" is not valid currency code.";
        }

        if (!("supportedNetworks" in paymentRequest) || paymentRequest.supportedNetworks.length === 0) {
            throw "Missing supported networks";
        }

        var i;

        for (i = 0; i < paymentRequest.supportedNetworks.length; i++) {
            var network = paymentRequest.supportedNetworks[i];
            if (paymentNetworks.indexOf(network) === -1) {
                throw "\"" + network + "\" is not valid payment network.";
            }
        }

        if (!("merchantCapabilities" in paymentRequest) || paymentRequest.merchantCapabilities.length === 0) {
            throw "Missing merchant capabilities";
        }

        for (i = 0; i < paymentRequest.merchantCapabilities.length; i++) {
            var capability = paymentRequest.merchantCapabilities[i];
            if (merchantCapabilities.indexOf(capability) === -1) {
                throw "\"" + capability + "\" is not valid merchant capability.";
            }
        }

        if (!("total" in paymentRequest) || !("label" in paymentRequest.total)) {
            throw "Missing total label.";
        }

        if (!("amount" in paymentRequest.total)) {
            throw "Missing total amount.";
        }

        if (/^[0-9]+(\.[0-9][0-9])?$/.test(paymentRequest.total.amount) !== true) {
            throw "\"" + paymentRequest.total.amount + "\" is not a valid amount.";
        }

        this.hasActiveSession = true;
        this.paymentRequest = paymentRequest;
    };

    /**
     * Callback for ApplePaySession.abort().
     * @param {Object} session - The current ApplePaySession.
     */
    onAbort = function (session) {
    };

    /**
     * Callback for ApplePaySession.begin().
     * @param {Object} session - The current ApplePaySession.
     */
    onBegin = function (session) {

        var applePayValidateMerchantEvent = {
            validationURL: this.validationURL
        };

        session.onvalidatemerchant(applePayValidateMerchantEvent);
    };

    /**
     * Callback for ApplePaySession.canMakePayments().
     * @param {Object} session - The current ApplePaySession.
     * @return {Boolean} The value to return from ApplePaySession.canMakePayments().
     */
    onCanMakePayments = function (session) {
        return this.paymentsEnabled === true;
    };

    /**
     * Callback for ApplePaySession.canMakePaymentsWithActiveCard().
     * @param {Object} session - The current ApplePaySession.
     * @param {String} merchantIdentifier - The merchant identifier passed to the function.
     * @return {Boolean} The value to return from ApplePaySession.canMakePaymentsWithActiveCard().
     */
    onCanMakePaymentsWithActiveCard = function (session, merchantIdentifier) {

        var result =
            this.paymentsEnabled === true &&
            merchantIdentifier &&
            merchantIdentifier === this.merchantIdentifier;

        return Promise.resolve(result);
    };

  /**
   * Callback for ApplePaySession.completeMerchantValidation().
   * @param {Object} session - The current ApplePaySession.
   * @param {MerchantSession} merchantSession - The merchant session passed to the function.
   */
  onCompleteMerchantValidation = function (session, merchantSession) {

      if (typeof session.onshippingcontactselected === "function") {

          var applePayShippingContactSelectedEvent = {
              shippingContact: this.createShippingContact(session)
          };

          session.onshippingcontactselected(applePayShippingContactSelectedEvent);
      } else {
          var applePayPaymentAuthorizedEvent = {
              payment: {
                  token: this.createPaymentToken(session),
                  billingContact: this.createBillingContact(session),
                  shippingContact: this.createShippingContact(session)
              }
          };
          session.onpaymentauthorized(applePayPaymentAuthorizedEvent);
      }
  };

  /**
   * Callback for ApplePaySession.completePayment() for Apple Pay JS versions 1 and 2.
   * @param {Object} session - The current ApplePaySession.
   * @param {Number} status - The status code passed to the function.
   */
  onCompletePayment = function (session, status) {
      this.hasActiveSession = false;
      this.paymentRequest = null;
  };

  /**
   * Callback for ApplePaySession.completePayment() for Apple Pay JS version 3.
   * @param {Object} session - The current ApplePaySession.
   * @param {Object} result - The result of the payment authorization, including its status and list of errors.
   */
  onCompletePaymentV3 = function (session, result) {
      this.hasActiveSession = false;
      this.paymentRequest = null;
  };

  /**
   * Callback for ApplePaySession.completePaymentMethodSelection() for Apple Pay JS versions 1 and 2.
   * @param {Object} session - The current ApplePaySession.
   * @param {Object} newTotal - The new total passed to the function.
   * @param {Object} newLineItems - The new line items passed to the function.
   */
  onCompletePaymentMethodSelection = function (session, newTotal, newLineItems) {

  };

  /**
   * Callback for ApplePaySession.completePaymentMethodSelection() for Apple Pay JS version 3.
   * @param {Object} session - The current ApplePaySession.
   * @param {Object} update - The updated payment method.
   */
  onCompletePaymentMethodSelectionV3 = function (session, update) {

  };

  /**
   * Callback for ApplePaySession.completeShippingContactSelection() for Apple Pay JS versions 1 and 2.
   * @param {Object} session - The current ApplePaySession.
   * @param {Number} status - The status code passed to the function.
   * @param {Object} newShippingMethods - The new shipping methods passed to the function.
   * @param {Object} newTotal - The new total passed to the function.
   * @param {Object} newLineItems - The new line items passed to the function.
   */
  onCompleteShippingContactSelection = function (session, status, newShippingMethods, newTotal, newLineItems) {

      if (status === ApplePaySession.STATUS_SUCCESS) {
          var applePayPaymentAuthorizedEvent = {
              payment: {
                  token: this.createPaymentToken(session),
                  billingContact: this.createBillingContact(session),
                  shippingContact: this.createShippingContact(session)
              }
          };
          session.onpaymentauthorized(applePayPaymentAuthorizedEvent);
      }
  };

  /**
   * Callback for ApplePaySession.completeShippingContactSelection() for Apple Pay JS version 3.
   * @param {Object} session - The current ApplePaySession.
   * @param {Object} update - The updated shipping contact.
   */
  onCompleteShippingContactSelectionV3 = function (session, update) {

      if (!update.errors || update.errors.length === 0) {
          var applePayPaymentAuthorizedEvent = {
              payment: {
                  token: this.createPaymentToken(session),
                  billingContact: this.createBillingContact(session),
                  shippingContact: this.createShippingContact(session)
              }
          };
          session.onpaymentauthorized(applePayPaymentAuthorizedEvent);
      }
  };

  /**
   * Callback for ApplePaySession.completeShippingMethodSelection() for Apple Pay JS versions 1 and 2.
   * @param {Object} session - The current ApplePaySession.
   * @param {Number} status - The status code passed to the function.
   * @param {Object} newTotal - The new total passed to the function.
   * @param {Object} newLineItems - The new line items passed to the function.
   */
  onCompleteShippingMethodSelection = function (session, status, newTotal, newLineItems) {

  };

  /**
   * Callback for ApplePaySession.completeShippingMethodSelection() for Apple Pay JS version 3.
   * @param {Object} session - The current ApplePaySession.
   * @param {Object} update - The updated shipping method.
   */
  onCompleteShippingMethodSelectionV3 = function (session, update) {

  };

  /**
   * Callback for ApplePaySession.openPaymentSetup().
   * @param {Object} session - The current ApplePaySession.
   * @param {String} merchantIdentifier - The merchant identifier passed to the function.
   */
  onOpenPaymentSetup = function (session, merchantIdentifier) {

      var result =
          this.paymentsEnabled === true &&
          merchantIdentifier &&
          merchantIdentifier === this.merchantIdentifier;

      if (result === true) {
          result = this.isApplePaySetUp;
      }

      return Promise.resolve(result);
  };

  /**
   * Callback for ApplePaySession.supportsVersion().
   * @param {Object} session - The current ApplePaySession.
   * @param {Number} version - The version passed to the function.
   * @return {Boolean} The value to return from ApplePaySession.supportsVersion().
   */
  onSupportsVersion = function (session, version) {
      return this.supportedVersions.indexOf(version) !== -1;
  };
}

const ApplePaySessionPolyfill = new ApplePaySessionPolyfillFactory();

// TODO: convert to class
const ApplePaySession = function (version, request) {
    this.oncancel = null;
    this.onpaymentauthorized = null;
    this.onpaymentmethodselected = null;
    this.onshippingcontactselected = null;
    this.onshippingmethodselected = null;
    this.onvalidatemerchant = null;
    this.version = version;

    ApplePaySessionPolyfill.onInit(this, version, request);
};

ApplePaySession.STATUS_SUCCESS = 0;
ApplePaySession.STATUS_FAILURE = 1;
ApplePaySession.STATUS_INVALID_BILLING_POSTAL_ADDRESS = 2;
ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS = 3;
ApplePaySession.STATUS_INVALID_SHIPPING_CONTACT = 4;
ApplePaySession.STATUS_PIN_REQUIRED = 5;
ApplePaySession.STATUS_PIN_INCORRECT = 6;
ApplePaySession.STATUS_PIN_LOCKOUT = 7;

ApplePaySession.canMakePayments = function () {
    return ApplePaySessionPolyfill.onCanMakePayments(this);
};

ApplePaySession.canMakePaymentsWithActiveCard = function (merchantIdentifier) {
    return ApplePaySessionPolyfill.onCanMakePaymentsWithActiveCard(this, merchantIdentifier);
};

ApplePaySession.openPaymentSetup = function (merchantIdentifier) {
    return ApplePaySessionPolyfill.onOpenPaymentSetup(this, merchantIdentifier);
};

ApplePaySession.supportsVersion = function (version) {
    return ApplePaySessionPolyfill.onSupportsVersion(this, version);
};

ApplePaySession.prototype.abort = function () {
    ApplePaySessionPolyfill.onAbort(this);
};

ApplePaySession.prototype.begin = function () {
    ApplePaySessionPolyfill.onBegin(this);
};

ApplePaySession.prototype.completeMerchantValidation = function (merchantSession) {
    ApplePaySessionPolyfill.onCompleteMerchantValidation(this, merchantSession);
};

ApplePaySession.prototype.completePayment = function (...args) {
    if (this.version >= 3) {
        var result = args[0];
        ApplePaySessionPolyfill.onCompletePaymentV3(this, result);
    } else {
        var status = args[0];
        ApplePaySessionPolyfill.onCompletePayment(this, status);
    }
};

ApplePaySession.prototype.completePaymentMethodSelection = function (...args) {
    if (this.version >= 3) {
        var update = args[0];
        ApplePaySessionPolyfill.onCompletePaymentMethodSelectionV3(this, update);
    } else {
        var newTotal = args[0];
        var newLineItems = args[1];
        ApplePaySessionPolyfill.onCompletePaymentMethodSelection(this, newTotal, newLineItems);
    }
};

ApplePaySession.prototype.completeShippingContactSelection = function (...args) {
    if (this.version >= 3) {
        var update = args[0];
        ApplePaySessionPolyfill.onCompleteShippingContactSelectionV3(this, update);
    } else {
        var status = args[0];
        var newShippingMethods = args[1];
        var newTotal = args[2];
        var newLineItems = args[3];
        ApplePaySessionPolyfill.onCompleteShippingContactSelection(this, status, newShippingMethods, newTotal, newLineItems);
    }
};

ApplePaySession.prototype.completeShippingMethodSelection = function (...args) {
    if (this.version >= 3) {
        var update = args[0];
        ApplePaySessionPolyfill.onCompleteShippingMethodSelectionV3(this, update);
    } else {
        var status = args[0];
        var newTotal = args[1];
        var newLineItems = args[2];
        ApplePaySessionPolyfill.onCompleteShippingMethodSelection(this, status, newTotal, newLineItems);
    }
};

export {ApplePaySession}
export {ApplePaySessionPolyfill}
// }
// }());
