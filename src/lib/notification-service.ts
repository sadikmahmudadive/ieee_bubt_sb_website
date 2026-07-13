import { adminDb } from '@/lib/firebase-admin';
import { emailService } from '@/lib/email';
import { generateNewsNotificationEmail, generateEventNotificationEmail } from '@/lib/notification-templates';
import { formatEventDateRange } from "@/utils/eventDates";

interface NewsData {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  category: string;
  date: Date;
}

interface EventData {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  eventDate: Date;
  eventEndDate?: Date;
  location?: string;
  category: string;
}

class NotificationService {
  async getAllSubscriberEmails(): Promise<string[]> {
    try {
      const snapshot = await adminDb.collection("subscriptions").get();
      return snapshot.docs.map(doc => doc.data().email as string).filter(Boolean);
    } catch (error) {
      console.error('Error fetching subscriber emails:', error);
      return [];
    }
  }

  async sendNewsNotification(newsData: NewsData): Promise<void> {
    try {
      const subscribers = await this.getAllSubscriberEmails();

      if (subscribers.length === 0) {
        console.log('No subscribers found for news notification');
        return;
      }

      const { subject, html } = generateNewsNotificationEmail({
        ...newsData,
        date: newsData.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });

      console.log(`Sending news notification to ${subscribers.length} subscribers: ${subject}`);

      await emailService.sendBulkEmail(subscribers, subject, html);

      console.log('News notification sent successfully');
    } catch (error) {
      console.error('Error sending news notification:', error);
    }
  }

  async sendEventNotification(eventData: EventData): Promise<void> {
    try {
      const subscribers = await this.getAllSubscriberEmails();

      if (subscribers.length === 0) {
        console.log('No subscribers found for event notification');
        return;
      }

      const formattedEventDate = formatEventDateRange(eventData.eventDate, eventData.eventEndDate);

      const { subject, html } = generateEventNotificationEmail({
        title: eventData.title,
        description: eventData.description,
        slug: eventData.slug,
        imageUrl: eventData.imageUrl,
        eventDate: formattedEventDate,
        location: eventData.location,
        category: eventData.category
      });

      console.log(`Sending event notification to ${subscribers.length} subscribers: ${subject}`);

      await emailService.sendBulkEmail(subscribers, subject, html);

      console.log('Event notification sent successfully');
    } catch (error) {
      console.error('Error sending event notification:', error);
    }
  }
}

export const notificationService = new NotificationService();
