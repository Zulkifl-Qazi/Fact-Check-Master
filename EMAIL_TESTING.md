# Email Testing Guide

## Testing Email Functionality

### 1. Setup Your Email Credentials

Edit the `.env` file with your actual email credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=factchk0556@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=factchk0556@gmail.com
```

### 2. Test Contact Form Email

1. Start the development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out and submit the contact form
4. Check the success message - it should indicate if email was sent
5. Check the recipient's email inbox for confirmation

### 3. Test Admin Reply Email

1. Go to `/admin-login` (use credentials from AdminLogin.jsx)
2. Access `/admin-feedback` 
3. View a feedback message and send a reply
4. Check the alert message for email delivery status
5. Verify the user receives the reply notification email

### 4. Email Templates

The system sends two types of emails:

**Confirmation Email (Contact Form):**
- Subject: "Thank you for contacting us - [Subject]"
- Beautiful HTML template with company branding
- Includes the user's original message
- Professional design with gradient header

**Reply Notification Email (Admin Response):**
- Subject: "Reply to your message: [Subject]"
- Shows admin's response prominently
- Includes original message for context
- Clear call-to-action for follow-up

### 5. Fallback Behavior

If email credentials are not configured:
- Contact form still saves feedback to database
- Admin can still reply to messages
- Users see notification that email couldn't be sent
- All functionality works except email notifications

### 6. Production Deployment

For Vercel deployment:
1. Add environment variables in Vercel dashboard
2. Configure your email provider's SMTP settings
3. Test thoroughly in production environment
4. Monitor email delivery rates and errors

### 7. Troubleshooting

**Common Issues:**
- Gmail: Use App Passwords, not regular passwords
- Port blocking: Try port 465 with `SMTP_SECURE=true`
- Authentication: Verify 2FA is enabled for Gmail
- Rate limits: Check your email provider's sending limits

**Debug Steps:**
1. Check Vercel function logs for email errors
2. Verify environment variables are set correctly
3. Test SMTP connection independently
4. Check spam/junk folders for test emails

### 8. Email Provider Setup Examples

**Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

Remember to use App Passwords for all providers when 2FA is enabled!