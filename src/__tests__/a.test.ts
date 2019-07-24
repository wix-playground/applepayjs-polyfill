import {setupApplePaySession} from '../index';
import {ApplePaySession} from '../ApplePaySession';
import PaymentRequestBuilder from '../mocks/PaymentRequestMock';

test('typeof setupApplePaySession() === ApplePaySession', () => {
  const constructor = setupApplePaySession({});
  const actual = new constructor(3, new PaymentRequestBuilder());
  expect(actual instanceof ApplePaySession).toBe(true);
});

test('canMakePayments === false if paymentsEnabled === false', () => {
  const constructor = setupApplePaySession({paymentsEnabled: false});
  expect(constructor.canMakePayments()).toBe(false);
})

test('onshippingcontactselected invoked on .begin() if passed', () => {
  const Constructor = setupApplePaySession({paymentsEnabled: false, createShippingContact: () => {}});
  const session = new Constructor(3, new PaymentRequestBuilder());
  const spy = jest.fn();
  session.onvalidatemerchant = () => {session.completeMerchantValidation({})};
  session.onshippingcontactselected = spy;
  session.begin();
  expect(spy).toHaveBeenCalled();
})

test('onshippingmethodselected and onpaymentauthorized invoked on .begin() if passed', () => {
  const Constructor = setupApplePaySession({paymentsEnabled: false, createShippingContact: () => {}, createPaymentToken: () => {}, createBillingContact: () => {}, createShippingMethod: () => {}});
  const session = new Constructor(3, new PaymentRequestBuilder());
  const shippingMethodSelectedSpy = jest.fn().mockImplementation(() => session.completeShippingMethodSelection({}));
  const authorizedSpy = jest.fn();
  session.onvalidatemerchant = () => {session.completeMerchantValidation({})};
  session.onshippingcontactselected = () => {session.completeShippingContactSelection({})};
  session.onpaymentauthorized = authorizedSpy

  session.onshippingmethodselected = shippingMethodSelectedSpy;
  session.begin();
  expect(shippingMethodSelectedSpy).toHaveBeenCalled();
  expect(authorizedSpy).toHaveBeenCalled()
})
