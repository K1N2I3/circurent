import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    // Note: Verified domain is noreply.circurent.it (subdomain)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'CircuRent <noreply@noreply.circurent.it>';

    if (!resendApiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    try {
      const result = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Test Email - CircuRent',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                padding: 40px 20px;
                -webkit-font-smoothing: antialiased;
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
              }
              .logo {
                font-size: 42px;
                font-weight: 900;
                color: #0a0a0f;
                margin: 0;
                letter-spacing: -1px;
              }
              .content {
                padding: 50px 40px;
                background: #ffffff;
              }
              .greeting {
                font-size: 24px;
                font-weight: 700;
                color: #0a0a0f;
                margin-bottom: 20px;
              }
              .message {
                font-size: 16px;
                color: #4a4a4a;
                margin-bottom: 30px;
                line-height: 1.7;
              }
              .success-badge {
                background: linear-gradient(135deg, #84cc16 0%, #a3e635 100%);
                color: #0a0a0f;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                font-weight: 700;
                font-size: 18px;
                margin: 30px 0;
              }
              .info-box {
                background: #f5f5f5;
                border-left: 4px solid #84cc16;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
                font-size: 14px;
                color: #4a4a4a;
              }
              .info-box strong {
                color: #0a0a0f;
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
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="header">
                <h1 class="logo">CircuRent</h1>
              </div>
              <div class="content">
                <h2 class="greeting">Test Email ✅</h2>
                <p class="message">
                  This is a test email to verify that email sending is working correctly.
                </p>
                <div class="success-badge">
                  🎉 Configuration Working!
                </div>
                <div class="info-box">
                  <strong>From:</strong> ${fromEmail}<br>
                  <strong>To:</strong> ${email}<br>
                  <strong>Status:</strong> Email service is properly configured
                </div>
                <p class="message">
                  If you received this email, your Resend configuration is working perfectly! You can now send verification emails to any recipient.
                </p>
              </div>
              <div class="footer">
                <p class="footer-text">© 2024 CircuRent. Test Email</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      // Check for errors
      if ((result as any)?.error) {
        const error = (result as any).error;
        return NextResponse.json({
          success: false,
          error: {
            message: error.message,
            statusCode: error.statusCode,
            name: error.name,
          },
          config: {
            fromEmail,
            toEmail: email,
            hasApiKey: !!resendApiKey,
          },
        }, { status: 400 });
      }

      const emailId = (result as any)?.data?.id || null;

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        emailId,
        config: {
          fromEmail,
          toEmail: email,
        },
        resendDashboard: emailId ? `https://resend.com/emails/${emailId}` : null,
      }, { status: 200 });

    } catch (resendError: any) {
      return NextResponse.json({
        success: false,
        error: {
          message: resendError?.message || 'Unknown error',
          type: resendError?.constructor?.name || typeof resendError,
        },
        config: {
          fromEmail,
          toEmail: email,
          hasApiKey: !!resendApiKey,
        },
        fullError: JSON.stringify(resendError, Object.getOwnPropertyNames(resendError), 2),
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

