import { siteMetadata } from '@/utils/siteMetadata';

interface NewsNotificationData {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  category: string;
  date: string;
}

interface EventNotificationData {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  eventDate: string;
  eventEndDate?: string;
  location?: string;
  category: string;
}

export function generateNewsNotificationEmail(data: NewsNotificationData): { subject: string; html: string } {
  const subject = `New ${data.category} News: ${data.title}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .news-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin: 20px 0; }
        .news-image { width: 100%; height: 200px; object-fit: cover; }
        .news-content { padding: 20px; }
        .news-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #1f2937; }
        .news-meta { color: #6b7280; font-size: 14px; margin-bottom: 15px; }
        .news-excerpt { color: #4b5563; margin-bottom: 20px; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .unsubscribe { color: #9ca3af; font-size: 12px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${siteMetadata.shortTitle}</h1>
        <p>New ${data.category} News</p>
      </div>

      <div class="content">
        <div class="news-card">
          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title}" class="news-image">` : ''}
          <div class="news-content">
            <h2 class="news-title">${data.title}</h2>
            <div class="news-meta">
              <span>${data.category}</span> • <span>${data.date}</span>
            </div>
            <p class="news-excerpt">${data.excerpt}</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/news/${data.slug}" class="cta-button">Read Full Article →</a>
          </div>
        </div>

        <div class="footer">
          <p>You're receiving this because you're subscribed to ${siteMetadata.title} updates.</p>
          <p class="unsubscribe">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/unsubscribe">Unsubscribe</a> from future notifications
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

export function generateEventNotificationEmail(data: EventNotificationData): { subject: string; html: string } {
  const subject = `New ${data.category} Event: ${data.title}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .event-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin: 20px 0; }
        .event-image { width: 100%; height: 200px; object-fit: cover; }
        .event-content { padding: 20px; }
        .event-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #1f2937; }
        .event-meta { color: #6b7280; font-size: 14px; margin-bottom: 15px; }
        .event-description { color: #4b5563; margin-bottom: 20px; }
        .event-details { background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .event-details strong { color: #1f2937; }
        .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .unsubscribe { color: #9ca3af; font-size: 12px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${siteMetadata.shortTitle}</h1>
        <p>New ${data.category} Event</p>
      </div>

      <div class="content">
        <div class="event-card">
          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title}" class="event-image">` : ''}
          <div class="event-content">
            <h2 class="event-title">${data.title}</h2>
            <div class="event-meta">
              <span>${data.category}</span>
            </div>

            <div class="event-details">
              <p><strong>📅 Date:</strong> ${data.eventDate}${data.eventEndDate ? ` - ${data.eventEndDate}` : ""}</p>
              ${data.location ? `<p><strong>📍 Location:</strong> ${data.location}</p>` : ''}
            </div>

            <p class="event-description">${data.description}</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/events/${data.slug}" class="cta-button">View Event Details →</a>
          </div>
        </div>

        <div class="footer">
          <p>You're receiving this because you're subscribed to ${siteMetadata.title} updates.</p>
          <p class="unsubscribe">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/unsubscribe">Unsubscribe</a> from future notifications
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
