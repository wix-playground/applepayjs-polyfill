import { InitApplePaySession } from './../index';
import {setupApplePaySession} from '../index';
import { aPaymentRequestBuilder } from '../mocks/PaymentRequestBuilder';

const setupSessionParams = (): InitApplePaySession => {
  return { paymentsEnabled: true, createShippingContact: () => {}, createBillingContact: () => {}, createShippingMethod: () => {}, createPaymentToken: () => ({paymentData: {}, paymentMethod: {displayName: '', network: '', paymentPass: {activationState: 'activated', primaryAccountIdentifier: '', primaryAccountNumberSuffix: '', deviceAccountIdentifier: ''} , type: 'credit'}, transactionIdentifier: 'guid'})}
}

test('canMakePayments === false if paymentsEnabled === false', () => {
  const { ApplePaySession } = setupApplePaySession({paymentsEnabled: false});
  expect(ApplePaySession.canMakePayments()).toBe(false);
})

test('all callbacks are invoked with required postalAddress', () => {
  const { ApplePaySession } = setupApplePaySession(setupSessionParams());
  const payRequest = aPaymentRequestBuilder().withPostalAddress().build();
  const session = new ApplePaySession(3, payRequest);
  const spyMethodChange = jest.fn().mockImplementation(() => session.completeShippingMethodSelection({}))
  const spyContactChange = jest.fn().mockImplementation(() => session.completeShippingContactSelection({}));
  const spyAuthorize = jest.fn();

  session.onvalidatemerchant = () => session.completeMerchantValidation({}) ;
  session.onshippingcontactselected = spyContactChange;
  session.onshippingmethodselected = spyMethodChange;
  session.onpaymentauthorized = spyAuthorize
  session.begin();

  expect(spyContactChange).toBeCalled();
  expect(spyMethodChange).toBeCalled();
  expect(spyAuthorize).toBeCalled();
})

test('onshippingcontactselected is not invoked without required postalAddress', () => {
  const { ApplePaySession } = setupApplePaySession(setupSessionParams());
  const payRequest = aPaymentRequestBuilder().build();
  const session = new ApplePaySession(3, payRequest);
  const spyMethodChange = jest.fn();
  const spyContactChange = jest.fn();
  const spyAuthorize = jest.fn();

  session.onvalidatemerchant = () => session.completeMerchantValidation({}) ;
  session.onshippingcontactselected = spyContactChange;
  session.onshippingmethodselected = spyMethodChange;
  session.onpaymentauthorized = spyAuthorize
  session.begin();
  expect(spyContactChange).not.toBeCalled();
  expect(spyMethodChange).not.toBeCalled();
  expect(spyAuthorize).toBeCalled();
})
