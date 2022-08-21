export const EMAIL_CONFIG_OPTIONS = 'EMAIL_CONFIG_OPTIONS';
export interface EmailConfigOptions {
  user: string;
  pass: string;
  from: string;
  clientDomain: string;
}
export interface SendOptions {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}
