import {setupApplePaySession} from '../index';
import PaymentRequestBuilder from '../mocks/PaymentRequestMock';


test('canMakePayments === false if paymentsEnabled === false', () => {
  const { ApplePaySession } = setupApplePaySession({paymentsEnabled: false});
  // const ApplePaySessionConstructor = setupApplePaySession({paymentsEnabled: false});
  expect(ApplePaySession.canMakePayments()).toBe(false);
})

test('onshippingcontactselected invoked on .begin() if passed', () => {
  const { ApplePaySession} = setupApplePaySession({paymentsEnabled: false, createShippingContact: () => {}});
  const session = new ApplePaySession(3, new PaymentRequestBuilder());
  const spy = jest.fn();
  session.onvalidatemerchant = () => {session.completeMerchantValidation({})};
  session.onshippingcontactselected = spy;
  session.begin();
  expect(spy).toHaveBeenCalled();
})

test('onshippingmethodselected and onpaymentauthorized invoked on .begin() if passed', () => {
  const { ApplePaySession } = setupApplePaySession({paymentsEnabled: false, createShippingContact: () => {}, createPaymentToken: () => {}, createBillingContact: () => {}, createShippingMethod: () => {}});
  const session = new ApplePaySession(3, new PaymentRequestBuilder());
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
