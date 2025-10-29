import nodemailer from 'nodemailer'

// Email configuration types
interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'resend' | 'console'
  smtp?: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  sendgrid?: {
    apiKey: string
  }
  resend?: {
    apiKey: string
  }
}

// Email template types
export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType?: string
  method?: 'REQUEST' | 'CANCEL'
}

export interface BookingConfirmationData {
  user: {
    name: string
    email: string
  }
  booking: {
    confirmationCode: string
    totalAmount: number
    amountPaid: number
    paymentMethod: string
    bookingDate: string
  }
  item: {
    title: string
    type: 'class' | 'event'
    startDate: string
    endDate?: string
    startTime?: string
    venue?: {
      name: string
      address: string
      city: string
      state?: string
      timezone?: string
    }
    instructor?: string
    organizer?: string
  }
}

export interface NewUserWelcomeData {
  user: {
    name: string
    email: string
    id: string
  }
}

export interface NewUserAdminNotificationData {
  user: {
    name: string
    email: string
    id: string
    registrationDate: string
  }
  totalUsers: number
}

// Branding and timezone helpers
const BRAND_NAME = process.env.EMAIL_BRAND_NAME || 'DanceLink'
const BRAND_PRIMARY = process.env.EMAIL_BRAND_PRIMARY_COLOR || '#f72585'
const BRAND_ACCENT = process.env.EMAIL_BRAND_ACCENT_COLOR || '#ff6b35'
const BRAND_LOGO_URL = process.env.EMAIL_BRAND_LOGO_URL || ''
const DEFAULT_TZ = process.env.EMAIL_DEFAULT_TIMEZONE || 'UTC'

function getEmailTimezone(data?: BookingConfirmationData): string {
  const tz = data?.item?.venue?.timezone || DEFAULT_TZ
  return typeof tz === 'string' && tz.trim() ? tz : DEFAULT_TZ
}

function formatInTz(dateIso: string, opts?: Intl.DateTimeFormatOptions, tz?: string) {
  const d = new Date(dateIso)
  const timeZone = tz || DEFAULT_TZ
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    ...(opts || { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }).format(d)
}

function tzAbbr(dateIso: string, tz?: string) {
  const timeZone = tz || DEFAULT_TZ
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(new Date(dateIso))
    const name = parts.find(p => p.type === 'timeZoneName')?.value
    return name || timeZone
  } catch {
    return timeZone
  }
}

class EmailService {
  private config: EmailConfig
  private transporter?: nodemailer.Transporter

  constructor() {
    this.config = this.getEmailConfig()
    this.initializeTransporter()
  }

  private getEmailConfig(): EmailConfig {
    const provider = (process.env.EMAIL_PROVIDER || 'console') as EmailConfig['provider']

    const config: EmailConfig = { provider }

    switch (provider) {
      case 'smtp':
        config.smtp = {
          host: process.env.SMTP_HOST || 'localhost',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
          }
        }
        break
      
      case 'sendgrid':
        config.sendgrid = {
          apiKey: process.env.SENDGRID_API_KEY || ''
        }
        break
      
      case 'resend':
        config.resend = {
          apiKey: process.env.RESEND_API_KEY || ''
        }
        break
      
      case 'console':
      default:
        // Console logging for development
        break
    }

    return config
  }

  private async initializeTransporter() {
    switch (this.config.provider) {
      case 'smtp':
        if (this.config.smtp) {
          this.transporter = nodemailer.createTransport(this.config.smtp)
        }
        break
      
      case 'console':
      default:
        // Create console transporter for development
        this.transporter = nodemailer.createTransport({
          streamTransport: true,
          newline: 'unix',
          buffer: true
        })
        break
    }
  }

  async sendEmail(to: string, template: EmailTemplate, from?: string, attachments?: EmailAttachment[]): Promise<boolean> {
    try {
      const fromAddress = from || process.env.EMAIL_FROM || `${BRAND_NAME} <noreply@dancelink.com>`

      switch (this.config.provider) {
        case 'console':
          console.log('📧 Email would be sent:')
          console.log(`From: ${fromAddress}`)
          console.log(`To: ${to}`)
          console.log(`Subject: ${template.subject}`)
          console.log('HTML Content:', template.html)
          console.log('Text Content:', template.text || 'No text version')
          if (attachments?.length) {
            console.log(`Attachments: ${attachments.map(a => a.filename).join(', ')}`)
          }
          console.log('---')
          return true

        case 'smtp':
          if (!this.transporter) {
            throw new Error('SMTP transporter not initialized')
          }

          const result = await this.transporter.sendMail({
            from: fromAddress,
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
            attachments: attachments?.map(a => ({ filename: a.filename, content: a.content, contentType: a.contentType || 'text/calendar; charset=utf-8' }))
          })

          console.log('Email sent via SMTP:', result.messageId)
          return true

        case 'sendgrid':
          // TODO: Implement SendGrid integration
          console.log('SendGrid email sending not yet implemented')
          return false

        case 'resend':
          // TODO: Implement Resend integration
          console.log('Resend email sending not yet implemented')
          return false

        default:
          console.error('Unknown email provider:', this.config.provider)
          return false
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  // Email templates
  generateBookingConfirmationEmail(data: BookingConfirmationData): EmailTemplate {
    const { user, booking, item } = data

    const subject = `Booking Confirmed: ${item.title} - ${booking.confirmationCode}`

    const tz = getEmailTimezone(data)
    const dateLine = `${formatInTz(item.startDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }, tz)}${item.startTime ? ` at ${item.startTime}` : ''} (${tzAbbr(item.startDate, tz)})`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .brand { display: flex; align-items: center; gap: 12px; justify-content: center; }
          .brand img { max-height: 36px; background: rgba(255,255,255,0.92); border-radius: 8px; padding: 6px 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.06); }
          .brand-name { font-weight: 800; letter-spacing: 0.3px; text-shadow: -1px 0 0 rgba(0,0,0,0.6), 0 1px 0 rgba(0,0,0,0.6), 1px 0 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(0,0,0,0.6), 0 0 6px rgba(0,0,0,0.5), 0 0 2px rgba(255,255,255,0.7); }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .highlight { color: ${BRAND_PRIMARY}; font-weight: bold; }
          .button { background: ${BRAND_PRIMARY}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          .muted { color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">
              ${BRAND_LOGO_URL ? `<img src="${BRAND_LOGO_URL}" alt="${BRAND_NAME} logo" />` : ''}
              <h1 class="brand-name" style="margin:0;">${BRAND_NAME}</h1>
            </div>
            <p style="margin-top:6px;">🎉 Booking Confirmed</p>
          </div>
          
          <div class="content">
            <h2>Hello ${user.name}!</h2>
            <p>Your booking for <strong>${item.title}</strong> is confirmed.</p>
            
            <div class="booking-details">
              <h3>📅 ${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Details</h3>
              <p><strong>Title:</strong> ${item.title}</p>
              <p><strong>When:</strong> ${dateLine}</p>
              ${item.venue ? `
                <p><strong>Location:</strong> ${item.venue.name}<br>
                ${item.venue.address}<br>
                ${item.venue.city}${item.venue.state ? `, ${item.venue.state}` : ''}</p>
              ` : ''}
              ${item.instructor ? `<p><strong>Instructor:</strong> ${item.instructor}</p>` : ''}
              ${item.organizer ? `<p><strong>Organizer:</strong> ${item.organizer}</p>` : ''}
              <p class="muted">Timezone: ${DEFAULT_TZ}</p>
            </div>

            <div class="booking-details">
              <h3>💳 Payment</h3>
              <p><strong>Confirmation Code:</strong> <span class="highlight">${booking.confirmationCode}</span></p>
              <p><strong>Total Amount:</strong> $${booking.totalAmount.toFixed(2)}</p>
              <p><strong>Amount Paid:</strong> $${booking.amountPaid.toFixed(2)}</p>
              <p><strong>Method:</strong> ${booking.paymentMethod}</p>
              <p><strong>Payment Date:</strong> ${formatInTz(booking.bookingDate, undefined, tz)}</p>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard" class="button">
                View My Dashboard
              </a>
            </p>
          </div>

          <div class="footer">
            <p>Questions? Contact us at <a href="mailto:${process.env.EMAIL_SUPPORT || 'support@dancelink.com'}">${process.env.EMAIL_SUPPORT || 'support@dancelink.com'}</a></p>
            <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Booking Confirmation - ${item.title}

      Hello ${user.name}!

      Your booking for "${item.title}" has been confirmed!

      ${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Details:
      - When: ${dateLine}
      ${item.venue ? `- Location: ${item.venue.name}, ${item.venue.address}, ${item.venue.city}` : ''}

      Payment:
      - Confirmation Code: ${booking.confirmationCode}
      - Amount Paid: $${booking.amountPaid.toFixed(2)}
      - Method: ${booking.paymentMethod}

      Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard

      Questions? Contact: ${process.env.EMAIL_SUPPORT || 'support@dancelink.com'}

      © ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
    `

    return { subject, html, text }
  }

  generatePaymentReceiptEmail(data: BookingConfirmationData): EmailTemplate {
    const { user, booking, item } = data

    const subject = `Payment Receipt - ${booking.confirmationCode}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a2e; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .receipt-table th, .receipt-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .receipt-table th { background: #f8f9fa; }
          .total-row { font-weight: bold; background: #f0f9ff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧾 Payment Receipt</h1>
            <p>Receipt #${booking.confirmationCode}</p>
          </div>
          
          <div class="content">
            <p><strong>Date:</strong> ${formatInTz(booking.bookingDate, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
            
            <table class="receipt-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${item.title} (${item.type})</td>
                  <td>$${booking.totalAmount.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Paid</td>
                  <td>$${booking.amountPaid.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${booking.confirmationCode}</p>
          </div>

          <div class="footer">
            <p>Keep this receipt for your records</p>
            <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Payment Receipt
      
      Receipt #${booking.confirmationCode}
      Date: ${formatInTz(booking.bookingDate, { year: 'numeric', month: 'long', day: 'numeric' }, getEmailTimezone(data))}
      Customer: ${user.name} (${user.email})
      
      Description: ${item.title} (${item.type})
      Amount: $${booking.totalAmount.toFixed(2)}
      Total Paid: $${booking.amountPaid.toFixed(2)}
      
      Payment Method: ${booking.paymentMethod}
      Transaction ID: ${booking.confirmationCode}
      
      Keep this receipt for your records.
      
      © ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
    `

    return { subject, html, text }
  }

  // Main booking confirmation method
  async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    const template = this.generateBookingConfirmationEmail(data)
    // Create ICS attachment
    const { createBookingICS } = await import('./ics')
    const ics = createBookingICS({
      uid: data.booking.confirmationCode || `${Date.now()}@dancelink` ,
      title: data.item.title,
      description: `${data.item.type} booking (${data.booking.confirmationCode})` ,
      location: data.item.venue ? `${data.item.venue.name}, ${data.item.venue.address}, ${data.item.venue.city}${data.item.venue.state ? ', ' + data.item.venue.state : ''}` : undefined,
      start: new Date(data.item.startDate),
      end: data.item.endDate ? new Date(data.item.endDate) : undefined,
      timezone: getEmailTimezone(data),
      url: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001') + '/dashboard',
      organizerName: BRAND_NAME,
      organizerEmail: (process.env.EMAIL_FROM || 'noreply@dancelink.com').replace(/.*<|>.*/g, '') || 'noreply@dancelink.com',
      method: 'REQUEST',
      sequence: 1
    })
    return await this.sendEmail(data.user.email, template, undefined, [{ filename: 'booking.ics', content: ics, contentType: 'text/calendar; charset=utf-8; method=REQUEST', method: 'REQUEST' }])
  }

  // Payment receipt method
  async sendPaymentReceipt(data: BookingConfirmationData): Promise<boolean> {
    const template = this.generatePaymentReceiptEmail(data)
    return await this.sendEmail(data.user.email, template)
  }

  // Generate welcome email for new users
  generateWelcomeEmail(data: NewUserWelcomeData): EmailTemplate {
    const { user } = data

    const subject = `Welcome to ${BRAND_NAME}, ${user.name.split(' ')[0]}! 🎉`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to ${BRAND_NAME}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY}); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .brand-name { font-weight: 800; letter-spacing: 0.3px; text-shadow: -1px 0 0 rgba(0,0,0,0.6), 0 1px 0 rgba(0,0,0,0.6), 1px 0 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(0,0,0,0.6), 0 0 6px rgba(0,0,0,0.5), 0 0 2px rgba(255,255,255,0.7); }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .feature-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${BRAND_PRIMARY}; }
          .button { background: ${BRAND_PRIMARY}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 0; font-weight: bold; }
          .emoji { font-size: 1.2em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-name">🎉 Welcome to ${BRAND_NAME}!</h1>
            <p>Your journey into the world of dance begins now</p>
          </div>
          
          <div class="content">
            <h2>Hello ${user.name}!</h2>
            <p>Thank you for joining ${BRAND_NAME} - the premier platform for dancers, instructors, and dance enthusiasts. We're thrilled to have you as part of our vibrant community!</p>
            
            <div class="feature-box">
              <h3><span class="emoji">💃</span> What you can do on ${BRAND_NAME}:</h3>
              <ul>
                <li><strong>Discover Classes:</strong> Browse and book dance classes from talented instructors</li>
                <li><strong>Join Events:</strong> Attend workshops, performances, and special dance events</li>
                <li><strong>Connect with Partners:</strong> Find dance partners who match your style and skill level</li>
                <li><strong>Track Progress:</strong> Monitor your dance journey and achievements</li>
                <li><strong>Community Forum:</strong> Share tips, ask questions, and connect with fellow dancers</li>
              </ul>
            </div>

            <div class="feature-box">
              <h3><span class="emoji">🚀</span> Getting Started:</h3>
              <ol>
                <li>Complete your profile to help others find you</li>
                <li>Browse available classes and events in your area</li>
                <li>Book your first dance class or event</li>
                <li>Connect with the dance community</li>
              </ol>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard" class="button">
                Complete Your Profile
              </a>
            </p>

            <p>Ready to start dancing? Explore our classes and events, or connect with other dancers in your area. If you have any questions, our community is here to help!</p>
          </div>

          <div class="footer">
            <p>Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/help">Help Center</a> or contact us at <a href="mailto:${process.env.EMAIL_SUPPORT || 'support@dancelink.com'}">${process.env.EMAIL_SUPPORT || 'support@dancelink.com'}</a></p>
            <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
            <p style="font-size: 12px; color: #666;">You received this email because you created an account on ${BRAND_NAME}.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Welcome to ${BRAND_NAME}, ${user.name}!

      Thank you for joining ${BRAND_NAME} - the premier platform for dancers, instructors, and dance enthusiasts. We're thrilled to have you as part of our vibrant community!

      What you can do on ${BRAND_NAME}:
      • Discover Classes: Browse and book dance classes from talented instructors
      • Join Events: Attend workshops, performances, and special dance events
      • Connect with Partners: Find dance partners who match your style and skill level
      • Track Progress: Monitor your dance journey and achievements
      • Community Forum: Share tips, ask questions, and connect with fellow dancers

      Getting Started:
      1. Complete your profile to help others find you
      2. Browse available classes and events in your area
      3. Book your first dance class or event
      4. Connect with the dance community

      Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard

      Ready to start dancing? Explore our classes and events, or connect with other dancers in your area. If you have any questions, our community is here to help!

      Need help getting started? Check out our Help Center or contact us at support@dancelink.com

      © 2025 DanceLink. All rights reserved.
      You received this email because you created an account on DanceLink.
    `

    return { subject, html, text }
  }

  // Generate admin notification for new user registration
  generateNewUserAdminNotificationEmail(data: NewUserAdminNotificationData): EmailTemplate {
    const { user, totalUsers } = data

    const subject = `New User Registration: ${user.name}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New User Registration</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a2e; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .user-info { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .stat-box { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0; }
          .button { background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👤 New User Registration</h1>
            <p>DanceLink Admin Notification</p>
          </div>
          
          <div class="content">
            <p>A new user has registered on the DanceLink platform:</p>
            
            <div class="user-info">
              <h3>User Details</h3>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>User ID:</strong> ${user.id}</p>
              <p><strong>Registration Date:</strong> ${new Date(user.registrationDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>

            <div class="stat-box">
              <h3 style="margin: 0; color: #7c3aed;">🎯 Platform Stats</h3>
              <p style="margin: 10px 0 0 0; font-size: 1.2em;"><strong>Total Users: ${totalUsers}</strong></p>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/admin/users" class="button">
                View User in Admin Panel
              </a>
            </p>
          </div>

          <div class="footer">
            <p>This is an automated notification from the DanceLink platform.</p>
            <p>&copy; 2025 DanceLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      New User Registration - DanceLink Admin Notification
      
      A new user has registered on the DanceLink platform:
      
      User Details:
      - Name: ${user.name}
      - Email: ${user.email}
      - User ID: ${user.id}
      - Registration Date: ${new Date(user.registrationDate).toLocaleDateString()}
      
      Platform Stats:
      Total Users: ${totalUsers}
      
      View user in admin panel: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/admin/users
      
      This is an automated notification from the DanceLink platform.
      © 2025 DanceLink. All rights reserved.
    `

    return { subject, html, text }
  }

  // Send welcome email to new user
  async sendWelcomeEmail(data: NewUserWelcomeData): Promise<boolean> {
    const template = this.generateWelcomeEmail(data)
    return await this.sendEmail(data.user.email, template)
  }

  // Send admin notification for new user registration
  async sendNewUserAdminNotification(data: NewUserAdminNotificationData, adminEmail: string): Promise<boolean> {
    const template = this.generateNewUserAdminNotificationEmail(data)
    return await this.sendEmail(adminEmail, template)
  }

  // Generate cancellation email
  generateCancellationEmail(data: BookingConfirmationData & { refundAmount?: number }): EmailTemplate {
    const { user, booking, item } = data
    const subject = `Booking Cancelled: ${item.title} - ${booking.confirmationCode}`
    const tz = getEmailTimezone(data)
    const dateLine = `${formatInTz(item.startDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }, tz)}${item.startTime ? ` at ${item.startTime}` : ''} (${tzAbbr(item.startDate, tz)})`
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7f1d1d; color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
          .brand-name { font-weight: 800; letter-spacing: 0.3px; text-shadow: -1px 0 0 rgba(0,0,0,0.6), 0 1px 0 rgba(0,0,0,0.6), 1px 0 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(0,0,0,0.6), 0 0 6px rgba(0,0,0,0.5), 0 0 2px rgba(255,255,255,0.7); }
          .content { background: white; padding: 24px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 16px; text-align: center; border-radius: 0 0 10px 10px; }
          .details { background: #fff7ed; padding: 16px; border-radius: 8px; margin: 16px 0; }
          .highlight { color: ${BRAND_PRIMARY}; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 class="brand-name">${BRAND_NAME} — Booking Cancelled</h2>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Your booking for <strong>${item.title}</strong> has been cancelled.</p>
            <div class="details">
              <p><strong>Originally scheduled:</strong> ${dateLine}</p>
              ${item.venue ? `<p><strong>Location:</strong> ${item.venue.name}, ${item.venue.address}, ${item.venue.city}${item.venue.state ? ', ' + item.venue.state : ''}</p>` : ''}
              <p>Timezone: ${tz}</p>
              <p><strong>Confirmation Code:</strong> <span class="highlight">${booking.confirmationCode}</span></p>
              ${data.refundAmount ? `<p><strong>Refund:</strong> $${data.refundAmount.toFixed(2)} (if applicable)</p>` : ''}
            </div>
            <p>If this was a mistake or you need assistance, reply to this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Booking Cancelled - ${item.title}

      Hello ${user.name}, your booking has been cancelled.
      Originally scheduled: ${dateLine}
      Confirmation Code: ${booking.confirmationCode}
      ${data.refundAmount ? `Refund: $${data.refundAmount.toFixed(2)}` : ''}

      © ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
    `

    return { subject, html, text }
  }

  async sendBookingCancellation(data: BookingConfirmationData & { refundAmount?: number }): Promise<boolean> {
    const template = this.generateCancellationEmail(data)
    const { createBookingICS } = await import('./ics')
    const ics = createBookingICS({
      uid: data.booking.confirmationCode || `${Date.now()}@dancelink` ,
      title: data.item.title,
      description: `Cancelled: ${data.item.type} booking (${data.booking.confirmationCode})` ,
      location: data.item.venue ? `${data.item.venue.name}, ${data.item.venue.address}, ${data.item.venue.city}${data.item.venue.state ? ', ' + data.item.venue.state : ''}` : undefined,
      start: new Date(data.item.startDate),
      end: data.item.endDate ? new Date(data.item.endDate) : undefined,
      timezone: getEmailTimezone(data),
      url: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001') + '/dashboard',
      organizerName: BRAND_NAME,
      organizerEmail: (process.env.EMAIL_FROM || 'noreply@dancelink.com').replace(/.*<|>.*/g, '') || 'noreply@dancelink.com',
      method: 'CANCEL',
      sequence: 2,
      status: 'CANCELLED'
    })
    return await this.sendEmail(data.user.email, template, undefined, [{ filename: 'booking-cancellation.ics', content: ics, contentType: 'text/calendar; charset=utf-8; method=CANCEL', method: 'CANCEL' }])
  }
}

// Export singleton instance
export const emailService = new EmailService()
export default EmailService

// Convenience function exports
export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  attachments?: EmailAttachment[]
}): Promise<boolean> {
  const template: EmailTemplate = {
    subject: options.subject,
    html: options.html,
    text: options.text
  }
  return await emailService.sendEmail(options.to, template, options.from, options.attachments)
}

// Contact form notification
export async function sendContactNotification(options: {
  adminEmail: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
}): Promise<boolean> {
  const template: EmailTemplate = {
    subject: `New Contact Form Submission: ${options.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${BRAND_PRIMARY};">New Contact Form Submission</h2>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${options.customerName}</p>
          <p><strong>Email:</strong> ${options.customerEmail}</p>
          <p><strong>Subject:</strong> ${options.subject}</p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid ${BRAND_PRIMARY};">
          <h3 style="margin: 0 0 10px 0;">Message</h3>
          <p style="white-space: pre-line;">${options.message}</p>
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
          Respond to this inquiry by visiting the admin panel or replying directly to ${options.customerEmail}.
        </p>
      </div>
    `,
    text: `
      New Contact Form Submission
      
      From: ${options.customerName} (${options.customerEmail})
      Subject: ${options.subject}
      
      Message:
      ${options.message}
      
      Respond by visiting the admin panel or replying directly to ${options.customerEmail}.
    `
  }
  
  return await emailService.sendEmail(options.adminEmail, template)
}
