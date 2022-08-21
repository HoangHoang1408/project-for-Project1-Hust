import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import {
  EmailConfigOptions,
  EMAIL_CONFIG_OPTIONS,
  SendOptions,
} from './constants/constants';
import { EmailConfirmTemplate } from './template/confirmEmail';
import { ForgotPasswordTemplate } from './template/forgotPassword';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly from: string;
  private readonly clientDomain: string;
  constructor(
    @Inject(EMAIL_CONFIG_OPTIONS)
    { pass, user, from, clientDomain }: EmailConfigOptions,
  ) {
    this.from = from;
    this.clientDomain = clientDomain;
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  private sendmail({ from = this.from, to, html, text, subject }: SendOptions) {
    return this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  }

  private transformTemplate(template: string, values: object) {
    Object.entries(values).forEach(([key, value]) => {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return template;
  }

  sendConfirmEmail(to: string, confirmEmailCode: string) {
    const confirmLink = `${this.clientDomain}/confirm-email/${confirmEmailCode}`;
    const html = this.transformTemplate(EmailConfirmTemplate, {
      CLIENT_LINK: this.clientDomain,
      CONFIRM_LINK: confirmLink,
    });
    const text = `Please confirm your email to access our further service.\nIf you didn't create an account from us, you can safely delete this email.\nConfirm link: ${confirmLink}`;
    const subject = 'Confirm Email';
    return this.sendmail({ to, html, text, subject });
  }

  sendForgotPassword(to: string, forgotPasswordCode: string) {
    const forgotPasswordLink = `${this.clientDomain}/forgot-password/${forgotPasswordCode}`;
    const html = this.transformTemplate(ForgotPasswordTemplate, {
      CLIENT_LINK: this.clientDomain,
      FORGOT_PASSWORD_LINK: forgotPasswordLink,
    });
    const text = `Follow the link and instruction to reset your password.\nIf you didn't perform this action, you can safely delete this email.\nConfirm link: ${forgotPasswordLink}`;
    const subject = 'Reset Password';
    return this.sendmail({ to, html, text, subject });
  }
}
