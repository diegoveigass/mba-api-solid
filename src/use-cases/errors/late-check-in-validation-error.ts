export class LateCheckInValidationError extends Error {
  constructor() {
    super('The checkin can only be validate until 20 minutes of its creation.')
  }
}
