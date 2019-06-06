export default class PaymentRequestBuilder {
  countryCode = 'US';
  currencyCode = 'USD';
  supportedNetworks = ['visa', 'masterCard', 'amex', 'discover'];
  merchantCapabilities = ['supports3DS'];
  total = { label: 'Your Merchant Name', amount: '10.00' };
  requiredBillingContactFields = [
    'email',
    // 'postalAddress',
    // 'name',
    // 'phoneticName',
    'phone',
  ];
  requiredShippingContactFields = [
    // 'postalAddress',
    // 'name',
    'phone',
    'email',
  ];
  lineItems = [{ label: 'test label line item', amount: '10' }];
}
