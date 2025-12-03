import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;
    
    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    const vercelEnv = process.env.VERCEL_ENV || 'development';
    
    return NextResponse.json({
      status: 'ok',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: vercelEnv,
        isProduction: isProduction,
      },
      config: {
        resendApiKey: resendApiKey 
          ? `${resendApiKey.substring(0, 10)}...${resendApiKey.substring(resendApiKey.length - 4)} (${resendApiKey.length} chars)`
          : '❌ NOT SET',
        resendFromEmail: resendFromEmail || '❌ NOT SET (will use default: CircuRent <noreply@circurent.it>)',
      },
      checks: {
        hasApiKey: !!resendApiKey,
        hasFromEmail: !!resendFromEmail,
        isConfigured: !!(resendApiKey && resendFromEmail),
      },
      recommendations: {
        ...(resendApiKey ? {} : { apiKey: 'Add RESEND_API_KEY to Vercel environment variables' }),
        ...(resendFromEmail ? {} : { fromEmail: 'Add RESEND_FROM_EMAIL to Vercel environment variables (recommended: CircuRent <noreply@circurent.it>)' }),
        ...(resendApiKey && resendFromEmail ? { allGood: '✅ All email configuration looks good!' } : {}),
      },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

