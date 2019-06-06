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
