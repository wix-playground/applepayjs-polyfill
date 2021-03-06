# Apple Pay JS Polyfill

[![Bower](https://img.shields.io/bower/v/applepayjs-polyfill.svg?maxAge=2592000)](https://github.com/justeat/applepayjs-polyfill/releases/latest)

This repository contains a polyfill for [Apple Pay JS](https://developer.apple.com/reference/applepayjs) for use for testing on devices that do not natively support Apple Pay JS.

## Overview

Apple Pay JS is a way of accepting Apple Pay in websites using Safari in either iOS 10 (and later) and macOS for users who have a TouchID compatible device.

This polyfill provides a way to make [```ApplePaySession```](https://developer.apple.com/reference/applepayjs/applepaysession) available for testing your implementation in browsers that would otherwise not provide support for Apple Pay JS, such as in Chrome on Windows.

The polyfill supports Apple Pay JS versions 1, 2 and 3.

## Examples

To create a minimal working integration using the polyfill, first install the JavaScript using [bower](https://bower.io/):

```sh
$ bower install applepayjs-polyfill
```

Then reference it in your HTML (don't forget to remove it in production environments):

```html
<script src="/lib/applepayjs-polyfill/ApplePaySession.js"></script>
```

Next, configure the callbacks on the ```ApplePaySessionPolyfill``` object to return the values you want:

```js
// Set the merchant identifier to drive ApplePaySession.canMakePaymentsWithActiveCard()
ApplePaySessionPolyfill.setMerchantIdentifier("My_Merchant_Identifier");

// Optionally change the validation URL for merchant validation (the default is the URL for the Apple Pay Sandbox)
//ApplePaySessionPolyfill.setValidationURL("https://someurl.somedomain.com")

// Re-declare the function to create a PaymentContact for billing
ApplePaySessionPolyfill.createBillingContact = function (session) {
  return {
    /* ... */
  };
};

// Re-declare the function to create a PaymentContact for shipping
ApplePaySessionPolyfill.createShippingContact = function (session) {
  return {
    /* ... */
  };
};

// Re-declare the function to create a ApplePayShippingMethod for shipping
ApplePaySessionPolyfill.createShippingMethod = function (session) {
  return {
    /* ... */
  };
};

// Re-declare the function to create a PaymentToken for an authorized payment
ApplePaySessionPolyfill.createPaymentToken = function (session) {
  return {
    /* ... */
  };
};
```

Now you should be able to test your implementation of [```ApplePaySession```](https://developer.apple.com/reference/applepayjs/applepaysession) in an HTML page in a browser that does not already provide the object in ```window```.  For example:

```js
if ("ApplePaySession" in window && ApplePaySession.canMakePayments() === true) {

  var button = document.getElementsByClassName("apple-pay-button")[0];

  button.addEventListener("click", function (e) {

    e.preventDefault();

    var paymentRequest = {
      countryCode: "GB",
      currencyCode: "GBP",
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["amex", "masterCard", "visa"],
      total: {
        label: "Just Eat",
        amount: "1.00"
      }
    };

    var session = new ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = function (event) {
      /* Merchant validation implementation */
    };

    session.onpaymentauthorized = function (event) {
      /* Payment authorization implementation */
    };

    session.begin();

  });
}
```

### Apple Pay Set Up

If you need to test displaying the "Set Up Apple Pay" button, use the ```setUserSetupStatus(bool)``` function, as shown below, to specify that the user has not yet set up Apple Pay on the device.

```js
ApplePaySessionPolyfill.setUserSetupStatus(false);
```

By default this value is set to ```true``` so that Apple Pay is available in the polyfill.

If you need to test compatibility with devices that do not support Apple Pay set up, then delete the function from ```ApplePaySession``` before your implementation code is loaded:

```js
delete ApplePaySession.openPaymentSetup;
```

## Feedback

Any feedback or issues can be added to the [issues](https://github.com/justeat/applepayjs-polyfill/issues) for this project in GitHub.

## License

This project is licensed under the [Apache 2.0](https://github.com/justeat/applepayjs-polyfill/blob/master/LICENSE) license.

## External Links

  * [Apple Pay JS](https://developer.apple.com/reference/applepayjs)
