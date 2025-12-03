# Email Verification Setup Guide

This guide explains how to set up email verification for user registration.

## Recommended Email Services

### 1. **Resend** (Recommended - Easiest to use)
- **Website**: https://resend.com
- **Free Tier**: 3,000 emails/month
- **Pros**: Simple API, great developer experience, fast setup
- **Best for**: Startups and small to medium projects

**Setup Steps:**
1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Install package:
   ```bash
   npm install resend
   ```
5. Update `app/api/auth/send-verification/route.ts` to use Resend (code is already commented in the file)

### 2. **SendGrid** (Enterprise-grade)
- **Website**: https://sendgrid.com
- **Free Tier**: 100 emails/day
- **Pros**: More features, better analytics, enterprise support
- **Best for**: Large scale applications

**Setup Steps:**
1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
4. Install package:
   ```bash
   npm install @sendgrid/mail
   ```
5. Update `app/api/auth/send-verification/route.ts` to use SendGrid (code is already commented in the file)

### 3. **Nodemailer** (Self-hosted)
- **Website**: https://nodemailer.com
- **Pros**: Full control, works with any SMTP server
- **Best for**: When you have your own email server

**Setup Steps:**
1. Install package:
   ```bash
   npm install nodemailer
   ```
2. Add SMTP credentials to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
3. Update `app/api/auth/send-verification/route.ts` to use Nodemailer (code is already commented in the file)

## Google Maps API Setup

For address autocomplete, you need a Google Maps API key:

1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable "Places API" and "Maps JavaScript API"
4. Create an API key
5. Add to `.env.local`:
   ```
   GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxx
   ```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Email Service (choose one)
RESEND_API_KEY=your_resend_api_key
# OR
SENDGRID_API_KEY=your_sendgrid_api_key
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-change-in-production
```

## Testing

For development, the verification code is currently logged to the console. Check your server logs to see the code.

In production, make sure to:
1. Configure one of the email services above
2. Remove the console.log statement
3. Test the email delivery

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive keys
- Rotate API keys regularly
- Monitor email sending quotas

