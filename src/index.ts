import {ApplePaySessionPolyfillFactory} from './ApplePaySessionPolyfillFactory';
import {ApplePaySession} from './ApplePaySession';

export interface InitApplePaySession {
    isApplePaySetUp?: boolean;
    paymentsEnabled?: boolean;
    merchantIdentifier?: string;
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
}: InitApplePaySession) => {
    const innerSession = new ApplePaySessionPolyfillFactory();
    // setup static properties
    // that should be availabe per browser session
    innerSession.setUserSetupStatus(isApplePaySetUp);
    if (!paymentsEnabled) {
        innerSession.disablePayments();
    }
    innerSession.setMerchantIdentifier(merchantIdentifier);
    ApplePaySession.setApplePaySessionPolyfill(innerSession);
    return ApplePaySession;
}
