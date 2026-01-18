# Email Invitation Setup Guide

## Overview
The TurHR system now supports email invitations with beautiful HTML templates. When you invite a user, they receive an email with a link to set their password and join the system.

## Email Configuration

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification** on your Google Account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "TurHR" as the name
   - Copy the generated 16-character password

3. **Update `.env` file** in `backend/` folder:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
CLIENT_URL=http://localhost:3000
```

### Option 2: SendGrid (Production Recommended)

1. Create account at https://sendgrid.com
2. Get API Key from Settings > API Keys
3. Update `.env`:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
CLIENT_URL=https://yourdomain.com
```

### Option 3: Mailgun

1. Create account at https://mailgun.com
2. Get SMTP credentials from domain settings
3. Update `.env`:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASS=your-mailgun-password
```

### Option 4: Development (No Email)

If email is not configured, the system will:
- Still create the invitation
- Log the invitation link to console
- Show the link in the API response

The invitation link will be: `http://localhost:3000/accept-invitation/[TOKEN]`

## How It Works

1. **Admin clicks "Invite"** button in header
2. **Fills form** with name, email, and role
3. **System sends email** with invitation link
4. **User clicks link** in email
5. **User sets password** on invitation acceptance page
6. **User is automatically logged in** and redirected to dashboard

## Invitation Email Template

The email includes:
- Professional HTML design
- Company branding (TurHR)
- Invitation link button
- Plain text link as backup
- Expiration notice (7 days)
- Inviter's name

## Testing Email

### Without Email Configuration:
```bash
# Check backend console for invitation link
# It will appear when you invite a user
```

### With Email Configuration:
1. Send invitation from UI
2. Check recipient's inbox
3. Email should arrive within seconds

## Troubleshooting

**Email not sending?**
- Check `.env` file has correct credentials
- Verify App Password (Gmail) is correct
- Check spam folder
- Look for errors in backend console

**Invitation link not working?**
- Links expire after 7 days
- Check backend console for token errors
- Ensure CLIENT_URL is set correctly

**"Email service not configured" message?**
- This is normal if EMAIL_USER/EMAIL_PASS not set
- System still creates invitation
- Link is shown in response/console

## Security Notes

- Invitation tokens are cryptographically secure (32 bytes)
- Tokens expire after 7 days
- Used invitations cannot be reused
- Users must set password before account is active
