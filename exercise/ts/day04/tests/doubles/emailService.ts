import type { EmailService } from '../../src/routine/emailService';

export class EmailServiceDouble implements EmailService {
  private _readNewEmailsCalled = false;

  get readNewEmailsCalled(): boolean {
    return this._readNewEmailsCalled;
  }
  readNewEmails() {
    this._readNewEmailsCalled = true;
  }
}
