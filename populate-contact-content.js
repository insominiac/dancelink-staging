const { PrismaClient } = require('@prisma/client');

async function populateContactContent() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Populating Contact Page Content ===');
    
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // Check if record already exists
    const existing = await prisma.contactPageContent.findUnique({ where: { id: 'contact' } });
    if (existing) {
      console.log('Contact page content already exists:');
      console.log(JSON.stringify(existing, null, 2));
      await prisma.$disconnect();
      return;
    }
    
    // Create default contact page content
    const contactContent = {
      id: 'contact',
      heroTitle: 'Get in Touch With Us',
      heroSubtitle: 'Have questions or ready to start your dance journey? We\'d love to hear from you!',
      sections: {
        heroButtons: [
          { text: "📱 Call Now: (123) 456-7890", href: "tel:+1234567890", isPrimary: true },
          { text: "✉️ Email Us", href: "mailto:info@dancelink.com", isPrimary: false }
        ],
        quickOptions: [
          { 
            icon: "🎁", 
            title: "Book Free Trial", 
            description: "Try any class for free and see if it's right for you", 
            buttonText: "Book Now", 
            buttonHref: "tel:+1234567890" 
          },
          { 
            icon: "💬", 
            title: "Live Chat", 
            description: "Get instant answers to your questions", 
            buttonText: "Chat Now", 
            buttonHref: "#chat" 
          },
          { 
            icon: "📅", 
            title: "Schedule Visit", 
            description: "Visit our studio and meet our instructors", 
            buttonText: "Schedule", 
            buttonHref: "mailto:info@dancelink.com" 
          }
        ],
        form: {
          title: "Send Us a Message",
          subtitle: "Fill out the form below and we'll get back to you as soon as possible",
          options: [
            { value: "trial", label: "🎁 Free Trial Class" },
            { value: "classes", label: "💃 Regular Classes" },
            { value: "events", label: "🎉 Events & Workshops" },
            { value: "private", label: "👨‍🏫 Private Lessons" },
            { value: "other", label: "❓ Other" }
          ],
          fields: {
            nameLabel: "Full Name",
            phoneLabel: "Phone Number",
            emailLabel: "Email Address",
            interestLabel: "I'm Interested In",
            messageLabel: "Your Message",
            namePlaceholder: "Enter your full name",
            phonePlaceholder: "Enter your phone number",
            emailPlaceholder: "Enter your email address",
            messagePlaceholder: "Tell us how we can help you..."
          },
          submitButtonText: "Send Message",
          responseTimeText: "We typically respond within 24 hours"
        },
        faq: {
          title: "Frequently Asked Questions",
          subtitle: "Find answers to common questions about our classes and services",
          items: [
            { 
              question: "Do I need experience to start?", 
              answer: "Not at all! We have beginner-friendly classes for all dance styles. Our instructors are experienced in teaching complete beginners." 
            },
            { 
              question: "What should I wear?", 
              answer: "Comfortable clothing that allows you to move freely. Most students wear athletic wear or casual clothes with supportive shoes." 
            },
            { 
              question: "Can I try before I commit?", 
              answer: "Yes! We offer a free trial class for all new students. This lets you experience our teaching style and see if the class is right for you." 
            },
            { 
              question: "How do I book a class?", 
              answer: "Call us at (123) 456-7890, send us an email, or fill out the contact form above. We'll help you find the perfect class!" 
            }
          ]
        }
      }
    };
    
    console.log('Creating contact page content...');
    const result = await prisma.contactPageContent.create({
      data: contactContent
    });
    
    console.log('✓ Successfully created contact page content:');
    console.log(JSON.stringify(result, null, 2));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Error details:', error);
    await prisma.$disconnect();
  }
}

populateContactContent();