import nodemailer from 'nodemailer';
import { addLog } from './logs.js';

export const sendContactEmail = async (msgData) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const notifyEmail = process.env.NOTIFY_EMAIL || 'vaishakhvinodnlr@gmail.com';

  // Check if SMTP is configured
  if (!smtpUser || !smtpPass || smtpUser.trim() === '' || smtpPass.trim() === '') {
    console.log(`[EMAIL] SMTP credentials are not configured in server/.env. Skipping email notification.`);
    addLog({
      method: "EMAIL",
      path: "/api/messages",
      status: 200,
      latency: 0,
      size: "0 B",
      message: "SMTP coordinates not configured in .env file. Real-time email notification skipped (Fallback active)."
    });
    return null;
  }

  console.log(`[EMAIL] Initiating email notification dispatch to ${notifyEmail}...`);
  const startTime = Date.now();

  try {
    // Create Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: parseInt(smtpPort) || 587,
      secure: parseInt(smtpPort) === 465, // True for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      timeout: 5000 // 5-second timeout for mail attempts
    });

    // Compile beautiful, responsive HTML Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Submission</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9fafb;
            color: #374151;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
            padding: 30px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .header p {
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .field {
            margin-bottom: 20px;
          }
          .field-label {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 800;
            color: #9ca3af;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .field-value {
            font-size: 14px;
            color: #111827;
            font-weight: 600;
          }
          .message-box {
            background: #f3f4f6;
            border-radius: 12px;
            padding: 20px;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
            border: 1px solid #e5e7eb;
            white-space: pre-wrap;
          }
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Message Dispatched</h1>
            <p>Vaishakh Vinod MERN Stack Portfolio Simulator</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Sender Name</div>
              <div class="field-value">${msgData.name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Sender Email</div>
              <div class="field-value">
                <a href="mailto:${msgData.email}" style="color: #4f46e5; text-decoration: none;">${msgData.email}</a>
              </div>
            </div>

            <div className="field">
              <div class="field-label">Topic / Subject</div>
              <div class="field-value">${msgData.subject || 'General Inquiry'}</div>
            </div>

            <div class="field">
              <div class="field-label">Timestamp</div>
              <div class="field-value font-mono" style="font-size: 12px; color: #4b5563;">${new Date().toLocaleString()}</div>
            </div>

            <div class="field" style="margin-bottom: 0;">
              <div class="field-label">Message Details</div>
              <div class="message-box">"${msgData.message}"</div>
            </div>
          </div>
          <div class="footer">
            Verified MERN API Pipeline. Logged in fallback system messages adapter.
          </div>
        </div>
      </body>
      </html>
    `;

    // Mail configurations
    const mailOptions = {
      from: `"MERN Portfolio" <${smtpUser}>`,
      to: notifyEmail,
      subject: `📧 New Contact: ${msgData.subject || 'General Inquiry'} from ${msgData.name}`,
      text: `New contact submission from ${msgData.name} (${msgData.email}):\n\nSubject: ${msgData.subject}\n\nMessage:\n"${msgData.message}"`,
      html: htmlContent
    };

    // Send Mail async
    await transporter.sendMail(mailOptions);
    
    const latency = Date.now() - startTime;
    console.log(`[EMAIL] Real-time SMTP notification dispatched to ${notifyEmail} successfully in ${latency}ms.`);
    
    // Add transaction success to our simulator logs ring buffer
    addLog({
      method: "EMAIL",
      path: "/api/messages",
      status: 250, // Custom status for visual email dispatches
      latency: latency,
      size: `${Math.round(htmlContent.length / 102.4) / 10} KB`,
      message: `Mail dispatched! Real-time SMTP notification sent to ${notifyEmail} in ${latency}ms.`
    });

    return true;
  } catch (err) {
    const latency = Date.now() - startTime;
    console.error(`[EMAIL ERROR] Nodemailer failed to send email: ${err.message}`);
    
    // Add transaction error to our simulator logs
    addLog({
      method: "EMAIL",
      path: "/api/messages",
      status: 502, // Bad Gateway (SMTP Server error)
      latency: latency,
      size: "0 B",
      message: `Mail failed: ${err.message}. Please check SMTP coordinates in server/.env file.`
    });
    
    return false;
  }
};
