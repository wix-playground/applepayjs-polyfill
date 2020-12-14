import { ApplePayError } from './ApplePayError';
import {ApplePaySessionPolyfillFactory} from './ApplePaySessionPolyfillFactory';
import {ApplePaySession} from './ApplePaySession';

export interface InitApplePaySession {
    isApplePaySetUp?: boolean;
    paymentsEnabled?: boolean;
    merchantIdentifier?: string;
    createShippingContact?();
    createShippingMethod?();
    createBillingContact?();
    createPaymentToken?(): ApplePayJS.ApplePayPaymentToken;
    selectShippingMethodId?: string;
}

/**
 * @returns ApplePaySession contstructor
 * Example how to use:
 * const ApplePaySession = setupApplePaySession();
 * const session = new ApplePaySession(3, paymentRequest);
 */
export const setupApplePaySession = ({
  isApplePaySetUp = true,
  paymentsEnabled = true,
  merchantIdentifier = "test_merchant_id",
  createShippingContact,
  createShippingMethod,
  createBillingContact,
  createPaymentToken,
  selectShippingMethodId,
}: InitApplePaySession) => {
    const innerSession = new ApplePaySessionPolyfillFactory();
    // setup static properties
    // that should be availabe per browser session
    innerSession.setUserSetupStatus(isApplePaySetUp);
    if (!paymentsEnabled) {
        innerSession.disablePayments();
    }
    innerSession.setMerchantIdentifier(merchantIdentifier);
    innerSession.createPaymentToken = createPaymentToken;
    innerSession.createBillingContact = createBillingContact;
    innerSession.createShippingContact = createShippingContact;
    innerSession.createShippingMethod = createShippingMethod;
    innerSession.selectShippingMethodId = selectShippingMethodId;

    ApplePaySession.setApplePaySessionPolyfill(innerSession);
    return { ApplePaySession, ApplePayError, hasActiveSession: function() {
        return innerSession.hasActiveSession
    }, getShippingMethods() {
        return innerSession.shippingMethods;
    }, getLineItems() {
        return innerSession.lineItems;
    }};
}
