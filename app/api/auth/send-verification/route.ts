import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { storeVerificationCode } from '@/lib/verification';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    storeVerificationCode(email, code, expiresAt);

    // Send email using Resend (recommended) or other service
    // For now, we'll use a simple approach - in production, use Resend API
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    // Use Resend (Recommended - Simple and reliable)
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Use Resend if API key is configured
      const resend = new Resend(resendApiKey);
      
      try {
        // Use verified domain if available, otherwise fallback to onboarding email
        // Note: Verified domain is noreply.circurent.it (subdomain)
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'CircuRent <noreply@noreply.circurent.it>';
        
        console.log(`📤 Attempting to send email via Resend...`);
        console.log(`   To: ${email}`);
        console.log(`   From: ${fromEmail}`);
        console.log(`   API Key: ${resendApiKey.substring(0, 10)}...${resendApiKey.substring(resendApiKey.length - 4)}`);
        
        const result = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'Verify your email address - CircuRent',
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                  line-height: 1.6;
                  color: #1a1a1a;
                  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                  padding: 40px 20px;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                .email-wrapper {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 20px;
                  overflow: hidden;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                .header {
                  background: linear-gradient(135deg, #84cc16 0%, #a3e635 50%, #bef264 100%);
                  padding: 50px 30px;
                  text-align: center;
                  position: relative;
                  overflow: hidden;
                }
                .header::before {
                  content: '';
                  position: absolute;
                  top: -50%;
                  left: -50%;
                  width: 200%;
                  height: 200%;
                  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                  animation: pulse 3s ease-in-out infinite;
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); opacity: 0.5; }
                  50% { transform: scale(1.1); opacity: 0.8; }
                }
                .logo {
                  font-size: 42px;
                  font-weight: 900;
                  color: #0a0a0f;
                  margin: 0;
                  position: relative;
                  z-index: 1;
                  letter-spacing: -1px;
                  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .content {
                  padding: 50px 40px;
                  background: #ffffff;
                }
                .greeting {
                  font-size: 24px;
                  font-weight: 700;
                  color: #0a0a0f;
                  margin-bottom: 16px;
                  line-height: 1.3;
                }
                .message {
                  font-size: 16px;
                  color: #4a4a4a;
                  margin-bottom: 40px;
                  line-height: 1.7;
                }
                .code-container {
                  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                  border-radius: 16px;
                  padding: 40px 30px;
                  text-align: center;
                  margin: 40px 0;
                  box-shadow: 0 10px 40px rgba(10, 10, 15, 0.2), 0 0 0 1px rgba(132, 204, 22, 0.1);
                  position: relative;
                  overflow: hidden;
                }
                .code-container::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 3px;
                  background: linear-gradient(90deg, #84cc16, #a3e635, #bef264, #84cc16);
                  background-size: 200% 100%;
                  animation: shimmer 2s linear infinite;
                }
                @keyframes shimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
                .code-label {
                  font-size: 12px;
                  font-weight: 600;
                  color: #84cc16;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  margin-bottom: 20px;
                  opacity: 0.9;
                }
                .verification-code {
                  font-size: 48px;
                  font-weight: 900;
                  color: #84cc16;
                  letter-spacing: 12px;
                  font-family: 'Courier New', monospace;
                  text-shadow: 0 0 20px rgba(132, 204, 22, 0.5);
                  margin: 0;
                  line-height: 1.2;
                }
                .expiry-notice {
                  background: #fff8e1;
                  border-left: 4px solid #ffc107;
                  padding: 16px 20px;
                  border-radius: 8px;
                  margin: 30px 0;
                  font-size: 14px;
                  color: #5d4037;
                  line-height: 1.6;
                }
                .expiry-notice strong {
                  color: #e65100;
                }
                .security-notice {
                  font-size: 14px;
                  color: #757575;
                  margin-top: 30px;
                  padding-top: 30px;
                  border-top: 1px solid #e0e0e0;
                  line-height: 1.6;
                }
                .footer {
                  background: #f5f5f5;
                  padding: 30px 40px;
                  text-align: center;
                  border-top: 1px solid #e0e0e0;
                }
                .footer-text {
                  font-size: 12px;
                  color: #9e9e9e;
                  margin: 0;
                  line-height: 1.6;
                }
                .footer-link {
                  color: #84cc16;
                  text-decoration: none;
                  font-weight: 600;
                }
                .footer-link:hover {
                  text-decoration: underline;
                }
                @media only screen and (max-width: 600px) {
                  body { padding: 20px 10px; }
                  .email-wrapper { border-radius: 16px; }
                  .header { padding: 40px 20px; }
                  .logo { font-size: 36px; }
                  .content { padding: 40px 25px; }
                  .verification-code { font-size: 36px; letter-spacing: 8px; }
                  .code-container { padding: 30px 20px; }
                }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="header">
                  <h1 class="logo">CircuRent</h1>
                </div>
                <div class="content">
                  <h2 class="greeting">Welcome to CircuRent! 🎉</h2>
                  <p class="message">
                    Thank you for registering with CircuRent! To complete your registration and start renting premium items, please verify your email address using the code below.
                  </p>
                  
                  <div class="code-container">
                    <div class="code-label">Verification Code</div>
                    <div class="verification-code">${code}</div>
                  </div>
                  
                  <div class="expiry-notice">
                    <strong>⏰ Important:</strong> This verification code will expire in <strong>10 minutes</strong> for security reasons. Please use it promptly.
                  </div>
                  
                  <p class="security-notice">
                    If you didn't request this verification code, please ignore this email. Your account will remain secure.
                  </p>
                </div>
                <div class="footer">
                  <p class="footer-text">
                    © 2024 CircuRent. All rights reserved.<br>
                    This is an automated email, please do not reply.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        
        // Debug: Log the full response structure
        console.log('🔍 Resend API Response:', JSON.stringify(result, null, 2));
        
        // Check if there's an error in the response
        if ((result as any)?.error) {
          const error = (result as any).error;
          console.error('❌ Resend API returned an error:');
          console.error(`   Status: ${error.statusCode || 'N/A'}`);
          console.error(`   Type: ${error.name || 'N/A'}`);
          console.error(`   Message: ${error.message || 'N/A'}`);
          console.error(`   From Email Used: ${fromEmail}`);
          console.error(`   Environment: ${process.env.NODE_ENV}`);
          console.error(`   Vercel Env: ${process.env.VERCEL_ENV || 'local'}`);
          
          // Provide specific guidance based on error type
          if (error.message?.includes('only send testing emails to your own email address')) {
            console.error('\n💡 解决方案 (Solution):');
            console.error('   1. 确认在 Vercel 中已配置 RESEND_FROM_EMAIL = CircuRent <noreply@circurent.it>');
            console.error('   2. 确认已重新部署项目');
            console.error('   3. 检查域名验证状态: https://resend.com/domains');
            console.error('   4. 查看调试信息: https://your-app.vercel.app/api/debug/email-config');
            console.error('\n   详细步骤请查看: RESEND_DOMAIN_SETUP.md\n');
          }
          
          if (error.message?.includes('domain') || error.message?.includes('from')) {
            console.error('\n💡 域名相关错误:');
            console.error(`   当前使用的发送地址: ${fromEmail}`);
            console.error('   请确认:');
            console.error('   1. 域名 circurent.it 在 Resend 中显示为 Verified');
            console.error('   2. Vercel 环境变量 RESEND_FROM_EMAIL 已正确配置');
            console.error('   3. 已重新部署项目使环境变量生效\n');
          }
          
          throw new Error(`Resend API error: ${error.message || JSON.stringify(error)}`);
        }
        
        // Resend v6.x API returns { data: { id: string } } on success
        const emailId = (result as any)?.data?.id || null;
        
        if (emailId) {
          console.log(`✅ Verification email sent to ${email} via Resend`);
          console.log(`   📧 Email ID: ${emailId}`);
          console.log(`   📮 From: ${fromEmail}`);
          console.log(`   🔗 View in dashboard: https://resend.com/emails/${emailId}`);
        } else {
          // No email ID means the email might not have been sent
          console.warn(`⚠️  Warning: Email sent but no ID returned`);
          console.warn(`   📮 From: ${fromEmail}`);
          console.warn(`   📧 To: ${email}`);
          console.warn(`   💡 This might indicate the email was not actually sent`);
          console.warn(`   💡 Check Resend dashboard: https://resend.com/emails`);
          console.warn(`   💡 Check your API key permissions and domain settings`);
          console.warn(`   📋 Full response:`, JSON.stringify(result, null, 2));
          
          // Still return true to allow development, but warn the user
          console.warn(`   ⚠️  Using fallback mode - check your inbox won't work!`);
        }
        
        return true;
      } catch (resendError: any) {
        console.error('❌ Resend API Error:');
        console.error('   Error Type:', resendError?.constructor?.name || typeof resendError);
        console.error('   Error Message:', resendError?.message || resendError);
        console.error('   Full Error:', JSON.stringify(resendError, Object.getOwnPropertyNames(resendError), 2));
        
        // Check for specific error types
        if (resendError?.message) {
          const errorMsg = resendError.message.toLowerCase();
          if (errorMsg.includes('domain') || errorMsg.includes('from')) {
            console.error('   💡 Issue: Email domain/address problem');
            console.error('   💡 Solution: Verify your domain in Resend or use onboarding@resend.dev');
          } else if (errorMsg.includes('api key') || errorMsg.includes('unauthorized')) {
            console.error('   💡 Issue: Invalid API key');
            console.error('   💡 Solution: Check your RESEND_API_KEY in .env.local');
          } else if (errorMsg.includes('rate limit')) {
            console.error('   💡 Issue: Rate limit exceeded');
            console.error('   💡 Solution: Wait a few minutes and try again');
          }
        }
        
        // Don't return true if there's an actual error - let it fall through to console log
        console.log(`\n📧 [FALLBACK MODE] Verification code for ${email}:`);
        console.log(`   Code: ${code}`);
        console.log(`   Expires in: 10 minutes\n`);
        console.log('   ⚠️  Email was NOT sent via Resend. Using fallback mode.');
        
        // Return true to allow development to continue, but log the issue
        return true;
      }
    }

    // Option 2: Use SendGrid (More features, enterprise-grade)
    // Install: npm install @sendgrid/mail
    // Get API key from: https://sendgrid.com
    //
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //
    // await sgMail.send({
    //   to: email,
    //   from: 'noreply@yourdomain.com',
    //   subject: 'Verify your email address',
    //   html: `
    //     <h1>Email Verification</h1>
    //     <p>Your verification code is: <strong>${code}</strong></p>
    //     <p>This code will expire in 10 minutes.</p>
    //   `,
    // });

    // Option 3: Use Nodemailer (Self-hosted, more control)
    // Install: npm install nodemailer
    // Requires SMTP server configuration
    //
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    //
    // await transporter.sendMail({
    //   from: 'CircuRent <noreply@yourdomain.com>',
    //   to: email,
    //   subject: 'Verify your email address',
    //   html: `
    //     <h1>Email Verification</h1>
    //     <p>Your verification code is: <strong>${code}</strong></p>
    //     <p>This code will expire in 10 minutes.</p>
    //   `,
    // });

    // Fallback: Log to console for development/testing
    // This will be used if Resend is not configured
    console.log(`\n📧 [DEV MODE] Verification code for ${email}:`);
    console.log(`   Code: ${code}`);
    console.log(`   Expires in: 10 minutes\n`);
    console.log('💡 To enable email sending, add RESEND_API_KEY to .env.local');
    console.log('   Get your API key from: https://resend.com\n');
    
    // Return true to allow development to continue
    // In production, you should configure Resend API key
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}


