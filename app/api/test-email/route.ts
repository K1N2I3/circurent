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
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'CircuRent <noreply@circurent.it>';

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
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #84cc16 0%, #a3e635 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { color: #0a0a0f; margin: 0; font-size: 28px; font-weight: 900; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>CircuRent</h1>
              </div>
              <div class="content">
                <h2>Test Email</h2>
                <p>This is a test email to verify that email sending is working correctly.</p>
                <p>If you received this email, the configuration is working! ✅</p>
                <p><strong>From:</strong> ${fromEmail}</p>
                <p><strong>To:</strong> ${email}</p>
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

