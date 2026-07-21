# Fact Check Master

A modern fact-checking platform built with React, Vite, and Node.js that helps combat misinformation through real-time verification and community engagement.

## Features

- 🔍 **Real-time Fact Checking** - Instant verification of claims and statements
- 📧 **Contact System** - Full contact form with email notifications
- 👨‍💼 **Admin Dashboard** - Manage feedback and respond to users
- 📱 **Responsive Design** - Beautiful, mobile-first interface
- 🌙 **Dark Mode** - Modern dark theme with gradient accents
- ⚡ **Fast Performance** - Built with Vite for optimal speed

## Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express, SQLite
- **Deployment**: Vercel (Serverless Functions)
- **Email**: Nodemailer with SMTP support

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

**Email Configuration (Gmail example):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=factchk0556@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=factchk0556@gmail.com
```

**For Gmail setup:**
1. Enable 2-Step Verification in your Google Account
2. Go to Security → 2-Step Verification → App passwords
3. Generate an App Password for "Mail"
4. Use this App Password (not your regular password) for `SMTP_PASS`

### 3. Development

```bash
# Start development server
npm run dev

# Start backend server (for local development)
npm run start:server

# Start both frontend and backend
npm start
```

### 4. Production Build

```bash
npm run build
```

### 5. Deployment

This project is configured for Vercel deployment with serverless functions:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main page components
├── hooks/              # Custom React hooks
└── assets/             # Static assets

api/                    # Vercel serverless functions
├── feedback.js         # Contact form & feedback API
└── replies.js          # Admin reply system

server/                 # Local development server
└── index.js           # Express server setup
```

## Email System

The platform includes a complete email notification system:

- **Contact Form**: Users receive confirmation emails when submitting feedback
- **Admin Replies**: Users get notified when admins respond to their messages
- **Graceful Fallback**: System works without email configuration (notifications disabled)

## API Endpoints

- `POST /api/feedback` - Submit contact form
- `GET /api/feedback` - Get all feedback (admin)
- `GET /api/replies?feedback_id=:id` - Get replies for feedback
- `POST /api/replies` - Add reply to feedback

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

---

Built with ❤️ to fight misinformation and promote truth in our digital world.
