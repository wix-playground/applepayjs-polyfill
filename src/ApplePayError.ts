export class ApplePayError {
  constructor(public code: ApplePayJS.ApplePayErrorCode, public contactField?: ApplePayJS.ApplePayContactField, public message?: string){}
}
