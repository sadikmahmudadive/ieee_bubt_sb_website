import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendBulkEmail(recipients: string[], subject: string, html: string, text?: string): Promise<void> {
    const promises = recipients.map(recipient =>
      this.sendEmail(recipient, subject, html, text)
    );

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error sending bulk emails:', error);
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

export const emailService = new EmailService();