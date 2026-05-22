import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let transporter;

export const getMailTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });

    if (!env.isTest) {
      transporter.verify((err) => {
        if (err) {
          logger.warn(`Mail transporter verify failed: ${err.message}`);
        } else {
          logger.info('Mail transporter ready');
        }
      });
    }
  }

  return transporter;
};
