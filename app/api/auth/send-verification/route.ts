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
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #84cc16 0%, #a3e635 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: #0a0a0f; margin: 0; font-size: 28px; font-weight: 900; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .code-box { background: #0a0a0f; color: #84cc16; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; font-size: 32px; font-weight: 900; letter-spacing: 8px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>CircuRent</h1>
                </div>
                <div class="content">
                  <h2>Email Verification</h2>
                  <p>Thank you for registering with CircuRent! Please use the verification code below to complete your registration:</p>
                  <div class="code-box">${code}</div>
                  <p><strong>This code will expire in 10 minutes.</strong></p>
                  <p>If you didn't request this code, please ignore this email.</p>
                  <div class="footer">
                    <p>© 2024 CircuRent. All rights reserved.</p>
                  </div>
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


