class PaymentRequestBuilder {
  data: ApplePayJS.ApplePayPaymentRequest = {
    countryCode : 'US',
    currencyCode : 'USD',
    supportedNetworks : ['visa', 'masterCard', 'amex', 'discover'],
    merchantCapabilities : ['supports3DS'],
    total : { label: 'Your Merchant Name', amount: '10.00' },
    requiredBillingContactFields : [
      'email',
      'name',
      'phone',
    ],
    requiredShippingContactFields : [
      'name',
      'phone',
      'email',
    ],
    lineItems : [{ label: 'test label line item', amount: '10' }]
  };
  withPostalAddress() {
    this.data.requiredShippingContactFields.push('postalAddress');
    return this;
  }
  setProps(p) {
    Object.keys(p).forEach((k) => {
      this.data[k] = p[k];
    });
    return this;
  }
  build() {
    return this.data
  }
}

export const aPaymentRequestBuilder = () => new PaymentRequestBuilder();
