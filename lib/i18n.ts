import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
const resources = {
  en: {
    common: {
      nav: {
        siteName: 'DanceLink',
        home: 'Home',
        classes: 'Classes',
        events: 'Events',
        instructors: 'Instructors',
        forum: 'Forum',
        partnerMatch: 'Partner Match',
        about: 'About',
        contact: 'Contact',
        becomeHost: 'Become a Host',
        loggedInAs: 'Logged in as'
      },
      hero: {
        subtitle: 'Connect Through Movement',
        title: 'Master the Art of Dance',
        description: 'Where dancers unite, stories unfold, and connections are made through the universal language of movement. Join our vibrant community today.',
        exploreClasses: 'Explore Classes',
        bookFreeTrial: 'Book Free Trial'
      },
      about: {
        title: 'Why Choose DanceLink?',
        description: 'Experience the difference of professional instruction and passionate community',
        expertInstructors: 'Expert Instructors',
        expertInstructorsDesc: 'Learn from certified professionals with years of experience in their craft',
        allLevelsWelcome: 'All Levels Welcome',
        allLevelsWelcomeDesc: 'From complete beginners to advanced dancers, we have the perfect class for you',
        modernFacilities: 'Modern Facilities',
        modernFacilitiesDesc: 'Dance in beautiful studios equipped with the latest sound systems and amenities',
        smallClassSizes: 'Small class sizes'
      },
      homepage: {
        popularClasses: 'Popular Classes',
        discoverStyles: 'Discover Dance Styles',
        joinPopular: 'Join our most popular classes with real students',
        exploreDiverse: 'Explore our diverse range of dance styles',
        viewAll: 'View All Classes'
      },
      testLogin: {
        title: 'Test User Login Feature',
        demoCredentials: 'Demo credentials:'
      },
      stats: {
        happyStudents: 'Happy Students',
        danceStyles: 'Dance Styles',
        expertInstructors: 'Expert Instructors',
        studioLocations: 'Studio Locations'
      },
      cta: {
        title: 'Ready to Start Your Dance Journey?',
        description: 'Join hundreds of happy dancers and transform your life through movement',
        startFreeTrial: 'Start Free Trial',
        browseClasses: 'Browse Classes',
        benefits: '✅ No commitment required • ✅ All skill levels welcome • ✅ Professional instructors'
      },
      danceStyles: {
        title: 'Discover Our Dance Styles',
        subtitle: 'Choose Your Perfect Dance Journey',
        loading: 'Loading our amazing dance styles...',
        noStyles: 'No dance styles available at the moment.',
        scrollLeft: 'Scroll tabs left',
        scrollRight: 'Scroll tabs right',
        swipeHint: '💡 Swipe left or right to see more dance styles',
        styleInfo: '📊 Style Information',
        characteristics: '✨ Characteristics',
        availability: '📈 Availability',
        origin: 'Origin',
        difficulty: 'Difficulty',
        musicStyle: 'Music Style',
        category: 'Category',
        classes: 'Classes',
        events: 'Events',
        students: 'Students',
        available: 'available',
        upcoming: 'upcoming',
        learning: 'learning',
        readyToStart: 'Ready to Start Your {{style}} Journey?',
        joinCommunity: 'Join our community of passionate dancers and discover the joy of {{style}}',
        viewClasses: 'View {{style}} Classes',
        bookFreeTrial: 'Book Free Trial'
      },
      footer: {
        allRightsReserved: 'All rights reserved.',
        quickLinks: 'Quick Links',
        followUs: 'Follow Us',
        getInTouch: 'Get in Touch',
        emailPlaceholder: 'Enter your email',
        newsletter: {
          title: 'Stay Updated',
          description: 'Get the latest updates on classes, events, and dance tips!',
          subscribe: 'Subscribe',
          placeholder: 'Enter your email'
        }
      },
      // Urgency Banner
      urgencyBanner: {
        limitedTimeOffer: 'LIMITED TIME OFFER:',
        fiftyPercentOff: '50% OFF Your First Month!',
        endsIn: 'Ends in:',
        expired: 'Expired',
        claimOffer: 'Claim Offer'
      },
      // Floating CTA
      floatingCta: {
        readyToDance: 'Ready to Dance?',
        bookFreeTrialToday: 'Book your FREE trial class today!',
        bookFreeTrial: 'Book Free Trial',
        call: 'Call',
        browse: 'Browse',
        noCommitment: 'No commitment',
        allLevels: 'All levels'
      },
      // Common UI Elements
      ui: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        submit: 'Submit',
        close: 'Close',
        open: 'Open',
        yes: 'Yes',
        no: 'No',
        confirm: 'Confirm',
        book: 'Book',
        bookNow: 'Book Now',
        learnMore: 'Learn More',
        viewDetails: 'View Details',
        getStarted: 'Get Started',
        tryFree: 'Try Free',
        signUp: 'Sign Up',
        logIn: 'Log In',
        logOut: 'Log Out',
        of: 'of'
      },
      // Classes Page
      classes: {
        title: 'Dance Classes',
        subtitle: 'Find the perfect class for your level and style',
        description: 'Explore our wide range of dance classes for all levels, from beginners to advanced.',
        findPerfectClass: 'Find Your Perfect Class',
        filterDescription: 'Filter classes by your preferences and skill level',
        searchPlaceholder: '🔍 Search classes by name or description...',
        searchClasses: 'Search Classes',
        clearFilters: 'Clear Filters',
        allLevels: 'All Levels',
        anyPrice: 'Any Price',
        under25: 'Under $25',
        from25to50: '$25 - $50',
        from50to75: '$50 - $75',
        over75: 'Over $75',
        minutesShort: '{{count}} min',
        tbd: 'TBD',
        proInstructor: 'Pro Instructor',
        perClass: '/class',
        left: 'left',
        classesFound: 'classes found',
        classAvailability: 'Class Availability',
        spotsLeft: 'spots left',
        classFull: 'Class Full',
        viewDetails: 'View Details',
        bookNow: 'Book Now',
        booking: 'Booking...',
        almostFull: 'Almost Full!',
        noClassesFound: 'No Classes Found',
        noClassesMessage: 'No classes match your current search criteria. Try adjusting your filters or search terms.',
        clearAllFilters: 'Clear All Filters',
        cantDecide: "Can't decide which class to choose?",
        freeTrialDescription: 'Book a free trial class and discover your perfect dance style with our expert instructors',
        freeTrial: 'Free Trial',
        getAdvice: 'Get Advice',
        professionalGuidance: 'Professional guidance',
        allStylesAvailable: 'All styles available',
        smallGroupSizes: 'Small group sizes',
        filters: {
          all: 'All',
          level: 'Level',
          style: 'Style',
          time: 'Time',
          price: 'Price'
        },
        levels: {
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
          all: 'All Levels'
        },
        schedule: {
          duration: 'Duration',
          minutes: 'minutes',
          spotsLeft: 'spots left',
          soldOut: 'Sold Out',
          fullClass: 'Class Full'
        },
        details: {
          instructor: 'Instructor',
          venue: 'Venue',
          price: 'Price',
          capacity: 'Capacity',
          requirements: 'Requirements',
          whatYouWillLearn: 'What You Will Learn'
        }
      },
      // Events Page
      events: {
        title: 'Dance Events',
        subtitle: 'Join our exciting events and workshops',
        description: 'Participate in our special events, competitions, and workshops with guest instructors.',
        upcoming: 'Upcoming Events',
        past: 'Past Events',
        featured: 'Featured Events',
        viewAll: 'View All Events',
        free: 'Free',
        noUpcoming: 'No Upcoming Events',
        stayTuned: "Stay tuned! We're planning some amazing dance events for you.",
        getNotified: 'Get Notified',
        perPerson: '/person',
        spotsLeftCount: '{{count}} spots left',
        soldOut: 'Sold out',
        eventsFound: 'events found',
        searchPlaceholder: '🔍 Search events by name or description...',
        searchEvents: 'Search Events',
        availabilityLabel: 'Event Availability',
        filters: {
          all: 'All Types',
          type: 'Event Type',
          date: 'Date',
          location: 'Location'
        },
        priceRanges: {
          anyPrice: 'Any Price',
          under25: 'Under $25',
          from25to50: '$25 - $50',
          from50to100: '$50 - $100',
          over100: 'Over $100'
        },
        types: {
          workshop: 'Workshop',
          competition: 'Competition',
          performance: 'Performance',
          social: 'Social',
          masterclass: 'Masterclass',
          socialDance: 'Social Dance',
          gala: 'Gala',
          kidsEvent: 'Kids Event'
        },
        details: {
          date: 'Date',
          time: 'Time',
          location: 'Location',
          price: 'Price',
          organizer: 'Organizer',
          attendees: 'Attendees'
        },
        // CTA Section
        ctaBadgeText: 'Join the Experience',
        ctaTitle: 'Ready to Dance?',
        ctaDescription: 'Don\'t miss out on these exclusive dance events! Book early to secure your spot and join our vibrant community of dancers.',
        ctaButtons: {
          primary: '🎫 Reserve Your Spot',
          secondary: '📞 Get Event Updates'
        },
        ctaFeatures: {
          earlyBird: 'Early Bird Discounts',
          earlyBirdDesc: 'Book in advance and save up to 25% on event tickets',
          vip: 'VIP Experience',
          vipDesc: 'Front row seats and exclusive meet & greets available',
          group: 'Group Packages',
          groupDesc: 'Bring friends and save more with special group rates'
        }
      },
      // About Page
      aboutPage: {
        title: 'About Us',
        subtitle: 'Our passion for dance',
        heroTitle: 'About DanceLink',
        heroSubtitle: 'Connecting dancers through the universal language of movement. Discover our passion for dance and commitment to excellence.',
        heroBadgeText: 'Our Story & Mission',
        heroFeatures: {
          awardWinning: 'Award-winning platform',
          expertInstructors: 'Expert instructors',
          passionateCommunity: 'Passionate community'
        },
        statsTitle: 'Our Impact in Numbers',
        statsDescription: 'See how we\'re making a difference in the dance community with our platform and dedicated instructors',
        stats: {
          happyStudents: 'Happy Students',
          happyStudentsDesc: 'And growing daily',
          danceStyles: 'Dance Styles',
          danceStylesDesc: 'From ballet to hip-hop',
          expertInstructorsCount: 'Expert Instructors',
          expertInstructorsDesc: 'Professional & certified',
          studioLocations: 'Studio Locations',
          studioLocationsDesc: 'Across the city'
        },
        ourStory: 'Our Story',
        storyDescription1: 'DanceLink was founded with a simple belief: everyone deserves to experience the joy and connection that comes from dance. We started as a small community of passionate dancers and have grown into a thriving platform that connects thousands of students with world-class instructors.',
        storyDescription2: 'Our mission is to make dance accessible, welcoming, and transformative for people of all backgrounds and skill levels. Whether you\'re taking your first steps or perfecting advanced techniques, we\'re here to support your dance journey.',
        whyChooseUsTitle: 'Why Choose DanceLink?',
        features: {
          awardWinningInstructors: {
            title: 'Award-winning instructors',
            description: 'Learn from certified professionals with years of experience'
          },
          stateOfTheArtStudios: {
            title: 'State-of-the-art studios',
            description: 'Modern facilities equipped with the latest technology'
          },
          welcomingCommunity: {
            title: 'Welcoming community',
            description: 'Join a supportive network of fellow dance enthusiasts'
          },
          provenResults: {
            title: 'Proven results',
            description: 'Track your progress and celebrate your achievements'
          }
        },
        newsletterTitle: 'Stay in the Loop!',
        newsletterDescription: 'Get exclusive access to new classes, special events, and dance tips delivered to your inbox weekly.',
        newsletterBenefits: {
          weeklyTips: 'Weekly Tips',
          exclusiveEvents: 'Exclusive Events',
          specialDiscounts: 'Special Discounts'
        },
        newsletterPlaceholder: 'Enter your email address',
        subscribeButton: '🚀 Subscribe',
        subscriptionSuccess: 'Thanks for subscribing!',
        checkEmail: 'Check your email for confirmation',
        ctaTitle: 'Ready to Begin Your Dance Journey?',
        ctaDescription: 'Join hundreds of dancers who have transformed their lives through movement at DanceLink. Start your adventure today!',
        ctaBadgeText: 'Start Your Journey',
        ctaButtons: {
          startFreeTrial: '🎁 Start Free Trial',
          browseAllClasses: '👀 Browse All Classes'
        },
        ctaFeatures: {
          noExperienceNeeded: {
            title: 'No Experience Needed',
            description: 'Perfect for beginners and seasoned dancers alike'
          },
          flexibleScheduling: {
            title: 'Flexible Scheduling',
            description: 'Choose classes that fit your busy lifestyle'
          },
          moneyBackGuarantee: {
            title: 'Money-back Guarantee',
            description: '100% satisfaction or your money back'
          }
        },
        exploreClasses: '💃 Explore Classes',
        contactUs: '📞 Contact Us'
      },
      // Forum Page
      forum: {
        title: 'Community Forum',
        subtitle: 'Connect, share, and learn with fellow dancers',
        newPost: 'New Post',
        signInToPost: 'Sign in to Post',
        categories: {
          all: 'All Topics',
          general: 'General Discussion',
          technique: 'Dance Techniques',
          events: 'Events & Socials',
          partners: 'Partner Search',
          music: 'Music & Playlists',
          beginners: 'Beginners Corner'
        },
        noPosts: 'No posts yet',
        beFirst: 'Be the first to start a discussion!',
        createFirst: 'Create First Post',
        loading: 'Loading...',
        loadingPosts: 'Loading posts...',
        pinned: 'Pinned',
        locked: 'Locked',
        views: 'views',
        replies: 'replies',
        page: 'Page',
        of: 'of'
      },
      // Contact Page  
      contactPage: {
        getInTouchWithUs: 'Get in touch with us',
        getInTouch: 'Get in Touch',
        readyToStartDancing: "Ready to start dancing? We're here to help you find the perfect class!",
        weAreHereToHelp: 'We are here to help you. Send us a message and we will respond soon.',
        contactUs: 'Contact Us',
        callNow: '📱 Call Now: (123) 456-7890',
        emailUs: '✉️ Email Us',
        bookFreeTrial: 'Book Free Trial',
        tryAnyClassFree: 'Try any class for free and see if it\'s right for you',
        bookNow: 'Book Now',
        liveChat: 'Live Chat',
        getInstantAnswers: 'Get instant answers to your questions',
        chatNow: 'Chat Now',
        scheduleVisit: 'Schedule Visit',
        visitOurStudio: 'Visit our studio and meet our instructors',
        schedule: 'Schedule',
        sendUsAMessage: '📝 Send Us a Message',
        fillOutForm: 'Fill out the form below and we\'ll get back to you within 24 hours',
        nameRequired: 'Name *',
        yourName: 'Your name',
        phone: 'Phone',
        emailRequired: 'Email *',
        youAtExample: 'you@example.com',
        interestedIn: 'I\'m interested in:',
        selectAnOption: 'Select an option',
        freeTrialClass: '🎁 Free Trial Class',
        regularClasses: '💃 Regular Classes',
        eventsWorkshops: '🎉 Events & Workshops',
        privateLessons: '👨‍🏫 Private Lessons',
        other: '❓ Other',
        message: 'Message',
        tellUsAboutGoals: 'Tell us about your dance goals, experience level, or any questions you have...',
        sendMessage: '🚀 Send Message',
        responseTime: 'We typically respond within 2-4 hours during business hours',
        frequentlyAskedQuestions: '❓ Frequently Asked Questions',
        quickAnswers: 'Quick answers to common questions',
        doINeedExperience: 'Do I need experience to start?',
        noExperienceNeeded: 'Not at all! We have beginner-friendly classes for all dance styles. Our instructors are experienced in teaching complete beginners.',
        whatShouldIWear: 'What should I wear?',
        comfortableClothing: 'Comfortable clothing that allows you to move freely. Most students wear athletic wear or casual clothes with supportive shoes.',
        canITryBeforeCommit: 'Can I try before I commit?',
        freeTrialAvailable: 'Yes! We offer a free trial class for all new students. This lets you experience our teaching style and see if the class is right for you.',
        howDoIBookClass: 'How do I book a class?',
        bookingInstructions: 'Call us at (123) 456-7890, send us an email, or fill out the contact form above. We\'ll help you find the perfect class!'
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with us',
        description: 'We are here to help you. Send us a message and we will respond soon.',
        form: {
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          subject: 'Subject',
          message: 'Message',
          send: 'Send Message',
          success: 'Message sent successfully',
          error: 'Error sending message'
        },
        info: {
          address: 'Address',
          phone: 'Phone',
          email: 'Email',
          hours: 'Hours',
          followUs: 'Follow Us'
        }
      },
      // Instructors Page
      instructors: {
        title: 'Our Instructors',
        subtitle: 'Meet our expert professionals',
        description: 'Our team of certified instructors is here to guide you on your dance journey.',
        specialties: 'Specialties',
        experience: 'Experience',
        years: 'years',
        rating: 'Rating',
        bookWith: 'Book with',
        viewProfile: 'View Profile'
      },
      // Booking
      booking: {
        title: 'Book',
        selectDate: 'Select Date',
        selectTime: 'Select Time',
        personalInfo: 'Personal Information',
        paymentInfo: 'Payment Information',
        confirmation: 'Confirmation',
        summary: 'Booking Summary',
        total: 'Total',
        deposit: 'Deposit',
        balance: 'Balance',
        terms: 'Terms and Conditions',
        agree: 'I agree to the terms and conditions',
        success: 'Booking Successful!',
        confirmationNumber: 'Confirmation Number',
        checkEmail: 'Check your email for more details'
      },
      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome',
        myBookings: 'My Bookings',
        myClasses: 'My Classes',
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
        payments: 'Payments',
        history: 'History'
      },
      // Pricing
      pricing: {
        title: 'Pricing',
        subtitle: 'Choose the perfect plan for you',
        monthly: 'Monthly',
        yearly: 'Yearly',
        perMonth: '/month',
        perYear: '/year',
        save: 'Save',
        mostPopular: 'Most Popular',
        features: 'Features',
        unlimited: 'Unlimited',
        support: 'Support',
        choosePlan: 'Choose Plan'
      },
      // Become Host Page
      becomeHost: {
        becomeA: 'Become a',
        host: 'Host',
        heroDescription: 'Transform your passion into a thriving dance business. Create your academy, manage venues, and inspire dancers worldwide.',
        startYourApplication: 'Start Your Application',
        learnMore: 'Learn More',
        benefits: 'Benefits',
        features: 'Features',
        howItWorks: 'How It Works',
        faq: 'FAQ',
        whyBecomeHost: 'Why Become a Host?',
        joinCommunity: 'Join our community of dance professionals and take your business to the next level',
        buildDanceCommunity: 'Build Your Dance Community',
        buildDanceCommunityDesc: 'Create and manage your own dance academy with multiple venues, classes, and events all in one platform.',
        professionalTools: 'Professional Management Tools',
        professionalToolsDesc: 'Get access to professional-grade tools for managing bookings, student communications, and business analytics.',
        growBusiness: 'Grow Your Business',
        growBusinessDesc: 'Reach more students, increase bookings, and track your performance with detailed analytics and insights.',
        globalReach: 'Global Reach',
        globalReachDesc: 'Connect with dancers worldwide and expand your audience beyond your local area.',
        qualityAssurance: 'Quality Assurance',
        qualityAssuranceDesc: 'All host applications are carefully reviewed to maintain high standards and build trust with students.',
        marketingSupport: 'Marketing Support',
        marketingSupportDesc: 'Get featured in our directory and benefit from our marketing efforts to attract more students.',
        powerfulTools: 'Powerful Tools for Success',
        everythingYouNeed: 'Everything you need to manage and grow your dance business',
        venueManagement: 'Venue Management',
        createMultipleVenues: 'Create and manage multiple venues',
        addVenueDetails: 'Add detailed venue information with photos',
        setLocation: 'Set location with country and city details',
        trackVenueUtilization: 'Track venue utilization and bookings',
        classManagement: 'Class Management',
        designCurriculums: 'Design comprehensive class curriculums',
        flexibleScheduling: 'Set flexible scheduling and pricing',
        manageEnrollments: 'Manage student enrollments',
        trackClassPerformance: 'Track class performance and attendance',
        eventPlanning: 'Event Planning',
        organizeWorkshops: 'Organize workshops and performances',
        createSpecialEvents: 'Create special events and masterclasses',
        manageEventRegistrations: 'Manage event registrations',
        buildCommunity: 'Build community through events',
        businessAnalytics: 'Business Analytics',
        trackRevenue: 'Track revenue and booking trends',
        monitorEngagement: 'Monitor student engagement',
        analyzePopularity: 'Analyze class popularity',
        generateReports: 'Generate performance reports',
        howToGetStarted: 'How to Get Started',
        simpleSteps: 'Simple steps to become a verified host on our platform',
        submitApplication: 'Submit Application',
        submitApplicationDesc: 'Fill out the host registration form with your business information.',
        adminReview: 'Admin Review',
        adminReviewDesc: 'Our team carefully reviews your application to ensure quality standards.',
        getApproved: 'Get Approved',
        getApprovedDesc: 'Receive approval notification and gain access to your host dashboard.',
        startCreating: 'Start Creating',
        startCreatingDesc: 'Begin creating venues, classes, and events for your dance community.',
        frequentlyAskedQuestions: 'Frequently Asked Questions',
        everythingToKnow: 'Everything you need to know about becoming a host',
        requirementsQuestion: 'What are the requirements to become a host?',
        requirementsAnswer: 'You need to have experience in dance instruction or academy management, provide business information, and pass our quality review process.',
        approvalTimeQuestion: 'How long does the approval process take?',
        approvalTimeAnswer: 'Our admin team typically reviews applications within 3-5 business days. You\'ll receive an email notification once your application is processed.',
        createBeforeApprovalQuestion: 'Can I create content before approval?',
        createBeforeApprovalAnswer: 'Yes, you can create venues, classes, and events, but they won\'t be visible to students until admin approval. This allows you to prepare your content in advance.',
        feesQuestion: 'What fees are associated with hosting?',
        feesAnswer: 'We take a small commission from successful bookings. There are no upfront fees or monthly charges to become a host.',
        multipleVenuesQuestion: 'Can I manage multiple venues?',
        multipleVenuesAnswer: 'Absolutely! You can create and manage multiple venues across different locations, making it perfect for dance academies with multiple branches.',
        rejectionQuestion: 'What happens if my application is rejected?',
        rejectionAnswer: 'If your application doesn\'t meet our current requirements, you\'ll receive feedback on areas for improvement and can reapply after addressing the concerns.',
        readyToShare: 'Ready to Share Your Passion?',
        joinHundreds: 'Join hundreds of dance professionals who trust our platform to grow their business',
        startHostApplication: 'Start Your Host Application',
        noSetupFees: 'No setup fees • Quick approval process • Professional support'
      },
      // Error Messages
      errors: {
        pageNotFound: 'Page not found',
        somethingWrong: 'Something went wrong',
        tryAgain: 'Try again',
        contactSupport: 'Contact support',
        networkError: 'Network error',
        unauthorized: 'Unauthorized',
        sessionExpired: 'Session expired'
      },
      // Time and Date
      time: {
        today: 'Today',
        tomorrow: 'Tomorrow',
        yesterday: 'Yesterday',
        thisWeek: 'This week',
        nextWeek: 'Next week',
        thisMonth: 'This month',
        nextMonth: 'Next month',
        days: {
          monday: 'Monday',
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
          sunday: 'Sunday'
        },
        months: {
          january: 'January',
          february: 'February',
          march: 'March',
          april: 'April',
          may: 'May',
          june: 'June',
          july: 'July',
          august: 'August',
          september: 'September',
          october: 'October',
          november: 'November',
          december: 'December'
        }
      },
      // Privacy Policy
      privacy: {
        heroBadge: 'Your Privacy Matters',
        title: 'Privacy Policy',
        heroDescription: 'We are committed to protecting your personal information and your right to privacy. Learn how we collect, use, and safeguard your data.',
        dataProtection: 'Data Protection',
        secureStorage: 'Secure Storage',
        legalCompliance: 'Legal Compliance',
        lastUpdated: 'Last Updated',
        lastUpdatedDate: 'October 14, 2024',
        introduction: {
          title: 'Introduction',
          paragraph1: 'Welcome to DanceLink ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.',
          paragraph2: 'This privacy policy applies to all information collected through our website, mobile applications, and any related services, sales, marketing, or events.'
        },
        infoCollection: {
          title: 'Information We Collect',
          personalInfo: {
            title: 'Personal Information'
          }
        },
        contact: {
          title: 'Contact Us',
          description: 'If you have any questions about this Privacy Policy or our privacy practices, please contact us:'
        },
        cta: {
          badge: 'Your Privacy is Protected',
          title: 'Questions About Our Privacy Policy?',
          description: "We're here to help. Contact our support team for any privacy-related questions or concerns.",
          contactSupport: 'Contact Support',
          viewTerms: 'View Terms of Service'
        }
      },
      // Terms of Service
      terms: {
        heroBadge: 'Legal Terms & Conditions',
        title: 'Terms of Service',
        heroDescription: 'Please read these terms carefully before using our services. By accessing DanceLink, you agree to be bound by these terms and conditions.',
        clearGuidelines: 'Clear Guidelines',
        fairAgreement: 'Fair Agreement',
        legalProtection: 'Legal Protection',
        lastUpdated: 'Last Updated',
        lastUpdatedDate: 'October 14, 2024',
        agreement: {
          title: 'Agreement to Terms',
          paragraph1: 'By accessing and using DanceLink ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
          paragraph2: 'These terms apply to all visitors, users, and others who access or use the service, including instructors, students, and hosts.'
        },
        usage: {
          title: 'Use of the Service'
        },
        accounts: {
          title: 'User Accounts'
        },
        payment: {
          title: 'Booking and Payment Terms'
        },
        contact: {
          title: 'Contact Us',
          description: 'If you have any questions about these Terms of Service, please contact us:'
        },
        cta: {
          badge: 'Clear Terms & Fair Conditions',
          title: 'Ready to Join Our Dance Community?',
          description: "Now that you've read our terms, you're ready to start your dance journey with confidence and clarity.",
          browseClasses: 'Browse Classes',
          contactUs: 'Questions? Contact Us',
          agreement: 'By using our service, you agree to these terms.',
          viewPrivacy: 'View our Privacy Policy'
        }
      }
    }
  },
  ko: {
    common: {
      nav: {
        siteName: '댄스링크',
        home: '홈',
        classes: '수업',
        events: '이벤트',
        instructors: '강사',
        forum: '포럼',
        partnerMatch: '파트너 매칭',
        about: '소개',
        contact: '연락처',
        becomeHost: '호스트 신청',
        loggedInAs: '로그인된 계정'
      },
      hero: {
        subtitle: '움직임을 통한 연결',
        title: '댄스의 예술을 마스터하세요',
        description: '댄서들이 하나가 되고, 이야기가 펼쳐지며, 움직임의 보편적 언어를 통해 연결을 만들어가는 곳입니다. 오늘 우리의 활기찬 커뮤니티에 참여하세요.',
        exploreClasses: '수업 둘러보기',
        bookFreeTrial: '무료 체험 예약'
      },
      about: {
        title: '왜 댄스링크를 선택해야 할까요?',
        description: '전문 강습과 열정적인 커뮤니티의 차별화된 경험',
        expertInstructors: '전문 강사진',
        expertInstructorsDesc: '각 분야에서 수년간의 경험을 가진 인증된 전문가들로부터 배우세요',
        allLevelsWelcome: '모든 수준 환영',
        allLevelsWelcomeDesc: '완전 초보자부터 고급 댄서까지, 당신에게 완벽한 수업이 있습니다',
        modernFacilities: '현대적 시설',
        modernFacilitiesDesc: '최신 음향 시스템과 편의시설을 갖춘 아름다운 스튜디오에서 춤추세요',
        smallClassSizes: '소규모 수업'
      },
      homepage: {
        popularClasses: '인기 수업',
        discoverStyles: '댄스 스타일 발견',
        joinPopular: '실제 학생들과 함께하는 가장 인기있는 수업에 참여하세요',
        exploreDiverse: '다양한 댄스 스타일을 탐험해보세요',
        viewAll: '모든 수업 보기'
      },
      testLogin: {
        title: '테스트 사용자 로그인 기능',
        demoCredentials: '데모 자격 증명:'
      },
      stats: {
        happyStudents: '행복한 학생들',
        danceStyles: '댄스 스타일',
        expertInstructors: '전문 강사',
        studioLocations: '스튜디오 위치'
      },
      cta: {
        title: '댄스 여정을 시작할 준비가 되셨나요?',
        description: '수백 명의 행복한 댄서들과 함께하고 움직임을 통해 삶을 변화시키세요',
        startFreeTrial: '무료 체험 시작',
        browseClasses: '수업 둘러보기',
        benefits: '✅ 약속 불필요 • ✅ 모든 실력 수준 환영 • ✅ 전문 강사진'
      },
      danceStyles: {
        title: '저희의 댄스 스타일을 발견하세요',
        subtitle: '당신에게 완벽한 댄스 여정을 선택하세요',
        loading: '매력적인 댄스 스타일을 로딩 중...',
        noStyles: '현재 사용 가능한 댄스 스타일이 없습니다.',
        scrollLeft: '탭 왼쪽으로 스크롤',
        scrollRight: '탭 오른쪽으로 스크롤',
        swipeHint: '💡 더 많은 댄스 스타일을 보려면 왼쪽 또는 오른쪽으로 스와이프하세요',
        styleInfo: '📊 스타일 정보',
        characteristics: '✨ 특징',
        availability: '📈 사용 가능성',
        origin: '기원',
        difficulty: '난이도',
        musicStyle: '음악 스타일',
        category: '카테고리',
        classes: '수업',
        events: '이벤트',
        students: '학생',
        available: '사용 가능',
        upcoming: '예정된',
        learning: '학습 중',
        readyToStart: '{{style}} 여정을 시작할 준비가 되션나요?',
        joinCommunity: '열정적인 댄서들의 커뮤니티에 참여하여 {{style}}의 즐거움을 발견하세요',
        viewClasses: '{{style}} 수업 보기',
        bookFreeTrial: '무료 체험 예약'
      },
      footer: {
        allRightsReserved: '모든 권리가 보유됩니다.',
        quickLinks: '퀵링크',
        followUs: '팔로우하기',
        getInTouch: '연락처',
        emailPlaceholder: '이메일을 입력하세요',
        newsletter: {
          title: '최신 소식 받기',
          description: '클래스, 이벤트, 댓스 팁에 대한 최신 업데이트를 받아보세요!',
          subscribe: '구독하기',
          placeholder: '이메일을 입력하세요'
        }
      },
      // Urgency Banner
      urgencyBanner: {
        limitedTimeOffer: '한정 시간 제공:',
        fiftyPercentOff: '첫 달 50% 할인!',
        endsIn: '종료까지:',
        expired: '만료됨',
        claimOffer: '제공 받기'
      },
      // Floating CTA
      floatingCta: {
        readyToDance: '배운 준비가 되셈나요?',
        bookFreeTrialToday: '오늘 무료 체험 수업을 예약하세요!',
        bookFreeTrial: '무료 체험 예약',
        call: '전화',
        browse: '둘러보기',
        noCommitment: '약정 없음',
        allLevels: '모든 레벨'
      },
      // Classes Page (partial)
      classes: {
        minutesShort: '{{count}}분',
        tbd: '미정',
        proInstructor: '전문 강사',
        perClass: '/수업',
        left: '남음'
      },
      // Events Page (partial)
      events: {
        perPerson: '/인',
        spotsLeftCount: '{{count}}명 남음',
        soldOut: '매진',
        eventsFound: '이벤트 발견',
        searchPlaceholder: '🔍 이벤트를 이름 또는 설명으로 검색...',
        searchEvents: '이벤트 검색',
        availabilityLabel: '이벤트 예약 현황',
        filters: { all: '모든 유형' },
        types: {
          workshop: '워크샵',
          competition: '대회',
          performance: '공연',
          social: '소셜',
          masterclass: '마스터클래스',
          socialDance: '소셜 댄스',
          gala: '갈라',
          kidsEvent: '키즈 이벤트'
        },
        priceRanges: {
          anyPrice: '가격 무관',
          under25: '$25 미만',
          from25to50: '$25 - $50',
          from50to100: '$50 - $100',
          over100: '$100 이상'
        },
        // CTA Section
        ctaBadgeText: '체험에 참여하세요',
        ctaTitle: '춤출 준비되셨나요?',
        ctaDescription: '이 독점적인 댄스 이벤트를 놓치지 마세요! 조기 예약으로 자리를 확보하고 활기찬 댄서 커뮤니티에 참여하세요.',
        ctaButtons: {
          primary: '🎫 자리를 예약하세요',
          secondary: '📞 이벤트 업데이트 받기'
        },
        ctaFeatures: {
          earlyBird: '얼리버드 할인',
          earlyBirdDesc: '사전 예약으로 이벤트 티켓 최대 25% 할인',
          vip: 'VIP 경험',
          vipDesc: '앞줄 좌석과 독점 미트 앤 그릿 가능',
          group: '그룹 패키지',
          groupDesc: '친구들과 함께 특별 그룹 요금으로 더 많은 할인'
        }
      },
      // Privacy Policy
      privacy: {
        heroBadge: '개인정보가 중요합니다',
        title: '개인정보 보호정책',
        heroDescription: '저희는 귀하의 개인정보를 보호하고 개인정보 보호 권리를 지키는 데 최선을 다하고 있습니다. 저희가 어떻게 데이터를 수집, 사용, 보호하는지 알아보세요.',
        dataProtection: '데이터 보호',
        secureStorage: '안전한 저장',
        legalCompliance: '법적 준수',
        lastUpdated: '최종 업데이트',
        lastUpdatedDate: '2024년 10월 14일',
        introduction: {
          title: '소개',
          paragraph1: 'DanceLink("저희", "당사" 또는 "우리")에 오신 것을 환영합니다. 저희는 귀하의 개인정보를 존중하며 개인 데이터 보호에 최선을 다하고 있습니다. 이 개인정보 보호정책은 귀하가 저희 웹사이트를 방문할 때 개인 데이터를 어떻게 관리하는지, 그리고 개인정보 보호 권리와 법적 보호에 대해 알려드립니다.',
          paragraph2: '이 개인정보 보호정책은 저희 웹사이트, 모바일 애플리케이션 및 관련 서비스, 판매, 마케팅 또는 이벤트를 통해 수집되는 모든 정보에 적용됩니다.'
        },
        infoCollection: {
          title: '수집하는 정보',
          personalInfo: {
            title: '개인정보'
          }
        },
        contact: {
          title: '문의하기',
          description: '이 개인정보 보호정책이나 개인정보 보호 관행에 대해 궁금한 점이 있으시면 저희에게 연락해 주세요:'
        },
        cta: {
          badge: '귀하의 개인정보는 보호됩니다',
          title: '개인정보 보호정책에 대한 질문이 있으신가요?',
          description: '저희가 도와드리겠습니다. 개인정보 보호 관련 질문이나 우려사항이 있으시면 지원팀에 문의하세요.',
          contactSupport: '지원팀 연락',
          viewTerms: '서비스 약관 보기'
        }
      },
      // Terms of Service
      terms: {
        heroBadge: '법적 약관 및 조건',
        title: '서비스 약관',
        heroDescription: '저희 서비스를 사용하기 전에 이 약관을 신중히 읽어주세요. DanceLink에 접근함으로써 귀하는 이러한 약관 및 조건에 구속되는 것에 동의합니다.',
        clearGuidelines: '명확한 지침',
        fairAgreement: '공정한 계약',
        legalProtection: '법적 보호',
        lastUpdated: '최종 업데이트',
        lastUpdatedDate: '2024년 10월 14일',
        agreement: {
          title: '약관 동의',
          paragraph1: 'DanceLink("서비스")에 접근하고 사용함으로써 귀하는 이 계약의 약관 및 조항에 구속되는 것에 동의하고 승낙합니다. 위 사항에 동의하지 않으신다면 이 서비스를 사용하지 마십시오.',
          paragraph2: '이 약관은 강사, 학생, 호스트를 포함하여 서비스에 접근하거나 사용하는 모든 방문자, 사용자 및 기타 모든 이들에게 적용됩니다.'
        },
        usage: {
          title: '서비스 사용'
        },
        accounts: {
          title: '사용자 계정'
        },
        payment: {
          title: '예약 및 결제 약관'
        },
        contact: {
          title: '문의하기',
          description: '이 서비스 약관에 대해 궁금한 점이 있으시면 저희에게 연락해 주세요:'
        },
        cta: {
          badge: '명확한 약관 및 공정한 조건',
          title: '저희 댄스 커뮤니티에 참여할 준비가 되셨나요?',
          description: '약관을 읽어보셨으니 이제 자신감과 명확함을 가지고 댄스 여정을 시작할 준비가 되었습니다.',
          browseClasses: '수업 둘러보기',
          contactUs: '질문이 있나요? 문의하기',
          agreement: '저희 서비스를 사용함으로써 이 약관에 동의합니다.',
          viewPrivacy: '개인정보 보호정책 보기'
        }
      }
    }
  },
  vi: {
    common: {
      nav: {
        siteName: 'DanceLink',
        home: 'Trang chủ',
        classes: 'Lớp học',
        events: 'Sự kiện',
        instructors: 'Giảng viên',
        forum: 'Diễn đàn',
        partnerMatch: 'Ghép cặp Đối tác',
        about: 'Giới thiệu',
        contact: 'Liên hệ',
        becomeHost: 'Trở thành Host',
        loggedInAs: 'Đăng nhập với tư cách'
      },
      hero: {
        subtitle: 'Kết nối qua chuyển động',
        title: 'Làm chủ nghệ thuật khiêu vũ',
        description: 'Nơi các vũ công hòa hợp, câu chuyện được kể, và sự kết nối được tạo ra thông qua ngôn ngữ chung của chuyển động. Tham gia cộng đồng sôi động của chúng tôi ngay hôm nay.',
        exploreClasses: 'Khám phá lớp học',
        bookFreeTrial: 'Đặt học thử miễn phí'
      },
      about: {
        title: 'Tại sao chọn DanceLink?',
        description: 'Trải nghiệm sự khác biệt của hướng dẫn chuyên nghiệp và cộng đồng đam mê',
        expertInstructors: 'Giảng viên chuyên nghiệp',
        expertInstructorsDesc: 'Học từ các chuyên gia được chứng nhận với nhiều năm kinh nghiệm trong lĩnh vực của họ',
        allLevelsWelcome: 'Chào đón mọi trình độ',
        allLevelsWelcomeDesc: 'Từ người mới bắt đầu đến vũ công nâng cao, chúng tôi có lớp học hoàn hảo cho bạn',
        modernFacilities: 'Cơ sở vật chất hiện đại',
        modernFacilitiesDesc: 'Khiêu vũ trong các studio đẹp được trang bị hệ thống âm thanh và tiện nghi mới nhất',
        smallClassSizes: 'Lớp quy mô nhỏ'
      },
      homepage: {
        popularClasses: 'Lớp học phổ biến',
        discoverStyles: 'Khám phá phong cách khiêu vũ',
        joinPopular: 'Tham gia các lớp học phổ biến nhất của chúng tôi với học viên thật',
        exploreDiverse: 'Khám phá đa dạng phong cách khiêu vũ của chúng tôi',
        viewAll: 'Xem tất cả lớp học'
      },
      testLogin: {
        title: 'Tính năng đăng nhập người dùng thử',
        demoCredentials: 'Thông tin đăng nhập demo:'
      },
      stats: {
        happyStudents: 'Học viên hài lòng',
        danceStyles: 'Phong cách khiêu vũ',
        expertInstructors: 'Giảng viên chuyên nghiệp',
        studioLocations: 'Vị trí studio'
      },
      cta: {
        title: 'Sẵn sàng bắt đầu hành trình khiêu vũ?',
        description: 'Tham gia cùng hàng trăm vũ công hạnh phúc và thay đổi cuộc sống thông qua chuyển động',
        startFreeTrial: 'Bắt đầu học thử miễn phí',
        browseClasses: 'Duyệt lớp học',
        benefits: '✅ Không cam kết • ✅ Chào đón mọi trình độ • ✅ Giảng viên chuyên nghiệp'
      },
      danceStyles: {
        title: 'Khám phá phong cách khiêu vũ của chúng tôi',
        subtitle: 'Chọn hành trình khiêu vũ hoàn hảo của bạn',
        loading: 'Đang tải các phong cách khiêu vũ tuyệt vời...',
        noStyles: 'Hiện tại không có phong cách khiêu vũ nào.',
        scrollLeft: 'Cuộn tab sang trái',
        scrollRight: 'Cuộn tab sang phải',
        swipeHint: '💡 Trượt sang trái hoặc phải để xem thêm phong cách khiêu vũ',
        styleInfo: '📊 Thông tin phong cách',
        characteristics: '✨ Đặc điểm',
        availability: '📈 Tình trạng',
        origin: 'Xuất xứ',
        difficulty: 'Độ khó',
        musicStyle: 'Phong cách âm nhạc',
        category: 'Thể loại',
        classes: 'Lớp học',
        events: 'Sự kiện',
        students: 'Học viên',
        available: 'có sẵn',
        upcoming: 'sắp tới',
        learning: 'đang học',
        readyToStart: 'Sẵn sàng bắt đầu hành trình {{style}}?',
        joinCommunity: 'Tham gia cộng đồng các vũ công đam mê và khám phá niềm vui của {{style}}',
        viewClasses: 'Xem các lớp {{style}}',
        bookFreeTrial: 'Đặt học thử miễn phí'
      },
      footer: {
        allRightsReserved: 'Tất cả quyền được bảo lưu.',
        quickLinks: 'Liên kết nhanh',
        followUs: 'Theo dõi chúng tôi',
        getInTouch: 'Liên hệ',
        emailPlaceholder: 'Nhập email của bạn',
        newsletter: {
          title: 'Cập nhật thường xuyên',
          description: 'Nhận thông tin cập nhật mới nhất về lớp học, sự kiện và các mẹo khiêu vũ!',
          subscribe: 'Đăng ký',
          placeholder: 'Nhập email của bạn'
        }
      },
      // Urgency Banner
      urgencyBanner: {
        limitedTimeOffer: 'UU ĐÁI THỜI GIAN CÓ HẠN:',
        fiftyPercentOff: 'GIẢM 50% THÁNG ĐẦU TIÊN!',
        endsIn: 'Kết thúc trong:',
        expired: 'Hết hạn',
        claimOffer: 'Nhận Uu đái'
      },
      // Floating CTA
      floatingCta: {
        readyToDance: 'Sẵn sàng Khiêu Vũ?',
        bookFreeTrialToday: 'Đặt lớp học thử MIỄN PHÍ hôm nay!',
        bookFreeTrial: 'Đặt Học Thử Miễn Phí',
        call: 'Gọi Điện',
        browse: 'Duyệt',
        noCommitment: 'Không cam kết',
        allLevels: 'Mọi trình độ'
      },
      // Classes Page (partial)
      classes: {
        minutesShort: '{{count}} phút',
        tbd: 'Chưa xác định',
        proInstructor: 'Giảng viên chuyên nghiệp',
        perClass: '/lớp',
        left: 'còn'
      },
      // Events Page (partial)
      events: {
        perPerson: '/người',
        spotsLeftCount: '{{count}} chỗ còn lại',
        soldOut: 'Hết chỗ',
        eventsFound: 'sự kiện được tìm thấy',
        searchPlaceholder: '🔍 Tìm kiếm sự kiện theo tên hoặc mô tả...',
        searchEvents: 'Tìm kiếm sự kiện',
        availabilityLabel: 'Tình trạng sự kiện',
        filters: { all: 'Tất cả loại' },
        types: {
          workshop: 'Hội thảo',
          competition: 'Cuộc thi',
          performance: 'Biểu diễn',
          social: 'Xã hội',
          masterclass: 'Lớp chuyên sâu',
          socialDance: 'Khiêu vũ xã hội',
          gala: 'Dạ hội',
          kidsEvent: 'Sự kiện trẻ em'
        },
        priceRanges: {
          anyPrice: 'Bất kỳ giá',
          under25: 'Dưới $25',
          from25to50: '$25 - $50',
          from50to100: '$50 - $100',
          over100: 'Trên $100'
        },
        // CTA Section
        ctaBadgeText: 'Tham gia trải nghiệm',
        ctaTitle: 'Sẵn sàng khiêu vũ?',
        ctaDescription: 'Đừng bỏ lỡ những sự kiện khiêu vũ độc quyền này! Đặt chỗ sớm để đảm bảo vị trí và tham gia cộng đồng vũ công năng động của chúng tôi.',
        ctaButtons: {
          primary: '🎫 Đặt chỗ của bạn',
          secondary: '📞 Nhận cập nhật sự kiện'
        },
        ctaFeatures: {
          earlyBird: 'Giảm giá đặt sớm',
          earlyBirdDesc: 'Đặt chỗ trước và tiết kiệm tới 25% vé sự kiện',
          vip: 'Trải nghiệm VIP',
          vipDesc: 'Ghế hàng ghế đầu và gặp gỡ độc quyền có sẵn',
          group: 'Gói nhóm',
          groupDesc: 'Mang theo bạn bè và tiết kiệm nhiều hơn với giá nhóm đặc biệt'
        }
      },
      // Privacy Policy
      privacy: {
        heroBadge: 'Quyền riêng tư của bạn rất quan trọng',
        title: 'Chính sách bảo mật',
        heroDescription: 'Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của bạn. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
        dataProtection: 'Bảo vệ dữ liệu',
        secureStorage: 'Lưu trữ an toàn',
        legalCompliance: 'Tuân thủ pháp luật',
        lastUpdated: 'Cập nhật lần cuối',
        lastUpdatedDate: '14 tháng 10, 2024',
        introduction: {
          title: 'Giới thiệu',
          paragraph1: 'Chào mừng bạn đến với DanceLink ("chúng tôi", "công ty chúng tôi" hoặc "chúng ta"). Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ dữ liệu cá nhân của bạn. Chính sách bảo mật này sẽ thông báo cho bạn về cách chúng tôi quản lý dữ liệu cá nhân của bạn khi bạn truy cập trang web của chúng tôi và cho bạn biết về quyền riêng tư của bạn và cách pháp luật bảo vệ bản.',
          paragraph2: 'Chính sách bảo mật này áp dụng cho tất cả thông tin được thu thập thông qua trang web, ứng dụng di động và bất kỳ dịch vụ, bán hàng, tiếp thị hoặc sự kiện liên quan nào của chúng tôi.'
        },
        infoCollection: {
          title: 'Thông tin chúng tôi thu thập',
          personalInfo: {
            title: 'Thông tin cá nhân'
          }
        },
        contact: {
          title: 'Liên hệ',
          description: 'Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này hoặc các thái học bảo mật của chúng tôi, vui lòng liên hệ với chúng tôi:'
        },
        cta: {
          badge: 'Quyền riêng tư của bạn được bảo vệ',
          title: 'Câu hỏi về Chính sách Bảo mật của chúng tôi?',
          description: 'Chúng tôi sẵn sàng hỗ trợ. Liên hệ đội ngũ hỗ trợ của chúng tôi nếu bạn có bất kỳ câu hỏi hoặc mối quan tâm nào về quyền riêng tư.',
          contactSupport: 'Liên hệ hỗ trợ',
          viewTerms: 'Xem Điều khoản Dịch vụ'
        }
      },
      // Terms of Service
      terms: {
        heroBadge: 'Điều khoản & Điều kiện Pháp lý',
        title: 'Điều khoản Dịch vụ',
        heroDescription: 'Vui lòng đọc kỹ những điều khoản này trước khi sử dụng dịch vụ của chúng tôi. Bằng cách truy cập DanceLink, bạn đồng ý bị ràng buộc bởi những điều khoản và điều kiện này.',
        clearGuidelines: 'Hướng dẫn rõ ràng',
        fairAgreement: 'Thỏa thuận công bằng',
        legalProtection: 'Bảo vệ pháp lý',
        lastUpdated: 'Cập nhật lần cuối',
        lastUpdatedDate: '14 tháng 10, 2024',
        agreement: {
          title: 'Thỏa thuận Điều khoản',
          paragraph1: 'Bằng cách truy cập và sử dụng DanceLink ("Dịch vụ"), bạn chấp nhận và đồng ý bị ràng buộc bởi các điều khoản và điều kiện của thỏa thuận này. Nếu bạn không đồng ý tuân thủ các điều trên, vui lòng không sử dụng dịch vụ này.',
          paragraph2: 'Các điều khoản này áp dụng cho tất cả khách truy cập, người dùng và những người khác truy cập hoặc sử dụng dịch vụ, bao gồm giảng viên, học viên và host.'
        },
        usage: {
          title: 'Sử dụng Dịch vụ'
        },
        accounts: {
          title: 'Tài khoản Người dùng'
        },
        payment: {
          title: 'Điều khoản Đặt chỗ và Thanh toán'
        },
        contact: {
          title: 'Liên hệ',
          description: 'Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản Dịch vụ này, vui lòng liên hệ với chúng tôi:'
        },
        cta: {
          badge: 'Điều khoản Rõ ràng & Điều kiện Công bằng',
          title: 'Sẵn sàng Tham gia Cộng đồng Khiêu vũ của chúng tôi?',
          description: 'Bây giờ bạn đã đọc các điều khoản của chúng tôi, bạn đã sẵn sàng bắt đầu hành trình khiêu vũ của mình với sự tự tin và rõ ràng.',
          browseClasses: 'Duyệt lớp học',
          contactUs: 'Câu hỏi? Liên hệ chúng tôi',
          agreement: 'Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản này.',
          viewPrivacy: 'Xem Chính sách Bảo mật của chúng tôi'
        }
      }
    }
  },
  es: {
    common: {
      nav: {
        siteName: 'DanceLink',
        home: 'Inicio',
        classes: 'Clases',
        events: 'Eventos',
        instructors: 'Instructores',
        forum: 'Foro',
        partnerMatch: 'Buscar Pareja',
        about: 'Acerca de',
        contact: 'Contacto',
        becomeHost: 'Conviértete en Host',
        loggedInAs: 'Conectado como'
      },
      hero: {
        subtitle: 'Conéctate a través del movimiento',
        title: 'Domina el arte de la danza',
        description: 'Donde los bailarines se unen, las historias se despliegan y las conexiones se hacen a través del lenguaje universal del movimiento. Únete a nuestra vibrante comunidad hoy.',
        exploreClasses: 'Explorar clases',
        bookFreeTrial: 'Reservar prueba gratis'
      },
      about: {
        title: '¿Por qué elegir DanceLink?',
        description: 'Experimenta la diferencia de la instrucción profesional y la comunidad apasionada',
        expertInstructors: 'Instructores expertos',
        expertInstructorsDesc: 'Aprende de profesionales certificados con años de experiencia en su arte',
        allLevelsWelcome: 'Todos los niveles bienvenidos',
        allLevelsWelcomeDesc: 'Desde principiantes completos hasta bailarines avanzados, tenemos la clase perfecta para ti',
        modernFacilities: 'Instalaciones modernas',
        modernFacilitiesDesc: 'Baila en hermosos estudios equipados con los últimos sistemas de sonido y comodidades',
        smallClassSizes: 'Clases pequeñas'
      },
      homepage: {
        popularClasses: 'Clases populares',
        discoverStyles: 'Descubre estilos de danza',
        joinPopular: 'Únete a nuestras clases más populares con estudiantes reales',
        exploreDiverse: 'Explora nuestra diversa gama de estilos de danza',
        viewAll: 'Ver todas las clases'
      },
      stats: {
        happyStudents: 'Estudiantes felices',
        danceStyles: 'Estilos de danza',
        expertInstructors: 'Instructores expertos',
        studioLocations: 'Ubicaciones del estudio'
      },
      cta: {
        title: '¿Listo para comenzar tu viaje de danza?',
        description: 'Únete a cientos de bailarines felices y transforma tu vida a través del movimiento',
        startFreeTrial: 'Comenzar prueba gratis',
        browseClasses: 'Explorar clases',
        benefits: '✅ No se requiere compromiso • ✅ Todos los niveles bienvenidos • ✅ Instructores profesionales'
      },
      danceStyles: {
        title: 'Descubre nuestros estilos de danza',
        subtitle: 'Elige tu viaje de danza perfecto',
        loading: 'Cargando nuestros increíbles estilos de danza...',
        noStyles: 'No hay estilos de danza disponibles en este momento.',
        scrollLeft: 'Desplazar pestañas hacia la izquierda',
        scrollRight: 'Desplazar pestañas hacia la derecha',
        swipeHint: '💡 Desliza hacia la izquierda o derecha para ver más estilos de danza',
        styleInfo: '📊 Información del estilo',
        characteristics: '✨ Características',
        availability: '📈 Disponibilidad',
        origin: 'Origen',
        difficulty: 'Dificultad',
        musicStyle: 'Estilo musical',
        category: 'Categoría',
        classes: 'Clases',
        events: 'Eventos',
        students: 'Estudiantes',
        available: 'disponibles',
        upcoming: 'próximos',
        learning: 'aprendiendo',
        readyToStart: '¿Listo para comenzar tu viaje de {{style}}?',
        joinCommunity: 'Únete a nuestra comunidad de bailarines apasionados y descubre la alegría del {{style}}',
        viewClasses: 'Ver clases de {{style}}',
        bookFreeTrial: 'Reservar prueba gratis'
      },
      footer: {
        allRightsReserved: 'Todos los derechos reservados.',
        quickLinks: 'Enlaces rápidos',
        followUs: 'Síguenos',
        getInTouch: 'Contáctanos',
        emailPlaceholder: 'Ingresa tu email',
        newsletter: {
          title: 'Manténte actualizado',
          description: '¡Recibe las últimas noticias sobre clases, eventos y consejos de danza!',
          subscribe: 'Suscribirse',
          placeholder: 'Ingresa tu email'
        }
      },
      // Urgency Banner
      urgencyBanner: {
        limitedTimeOffer: '¡OFERTA POR TIEMPO LIMITADO:',
        fiftyPercentOff: '¡50% DE DESCUENTO en tu Primer Mes!',
        endsIn: 'Termina en:',
        expired: 'Expirado',
        claimOffer: 'Reclamar Oferta'
      },
      // Floating CTA
      floatingCta: {
        readyToDance: '¿Listo para Bailar?',
        bookFreeTrialToday: '¡Reserva tu clase de prueba GRATUITA hoy!',
        bookFreeTrial: 'Reservar Prueba Gratis',
        call: 'Llamar',
        browse: 'Explorar',
        noCommitment: 'Sin compromiso',
        allLevels: 'Todos los niveles'
      },
      // Common UI Elements
      ui: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        save: 'Guardar',
        edit: 'Editar',
        delete: 'Eliminar',
        back: 'Volver',
        next: 'Siguiente',
        previous: 'Anterior',
        search: 'Buscar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        submit: 'Enviar',
        close: 'Cerrar',
        open: 'Abrir',
        yes: 'Sí',
        no: 'No',
        confirm: 'Confirmar',
        book: 'Reservar',
        bookNow: 'Reservar ahora',
        learnMore: 'Saber más',
        viewDetails: 'Ver detalles',
        getStarted: 'Comenzar',
        tryFree: 'Prueba gratis',
        signUp: 'Registrarse',
        logIn: 'Iniciar sesión',
        logOut: 'Cerrar sesión',
        of: 'de'
      },
      // Classes Page
      classes: {
        title: 'Clases de Danza',
        subtitle: 'Encuentra la clase perfecta para tu nivel y estilo',
        description: 'Explora nuestra amplia gama de clases de danza para todos los niveles, desde principiantes hasta avanzados.',
        findPerfectClass: 'Encuentra Tu Clase Perfecta',
        filterDescription: 'Filtra clases por tus preferencias y nivel de habilidad',
        searchPlaceholder: '🔍 Buscar clases por nombre o descripción...',
        searchClasses: 'Buscar Clases',
        clearFilters: 'Limpiar Filtros',
        allLevels: 'Todos los Niveles',
        anyPrice: 'Cualquier Precio',
        under25: 'Menos de $25',
        from25to50: '$25 - $50',
        from50to75: '$50 - $75',
        over75: 'Más de $75',
        minutesShort: '{{count}} min',
        tbd: 'Por confirmar',
        proInstructor: 'Instructor profesional',
        perClass: '/clase',
        left: 'disponibles',
        classesFound: 'clases encontradas',
        classAvailability: 'Disponibilidad de la Clase',
        spotsLeft: 'cupos disponibles',
        classFull: 'Clase Completa',
        viewDetails: 'Ver Detalles',
        bookNow: 'Reservar Ahora',
        booking: 'Reservando...',
        almostFull: '¡Casi Completo!',
        noClassesFound: 'No se Encontraron Clases',
        noClassesMessage: 'No hay clases que coincidan con tus criterios de búsqueda actuales. Intenta ajustar tus filtros o términos de búsqueda.',
        clearAllFilters: 'Limpiar Todos los Filtros',
        cantDecide: '¿No puedes decidir qué clase elegir?',
        freeTrialDescription: 'Reserva una clase de prueba gratuita y descubre tu estilo de danza perfecto con nuestros instructores expertos',
        freeTrial: 'Prueba Gratis',
        getAdvice: 'Obtener Consejo',
        professionalGuidance: 'Orientación profesional',
        allStylesAvailable: 'Todos los estilos disponibles',
        smallGroupSizes: 'Grupos pequeños',
        filters: {
          all: 'Todas',
          level: 'Nivel',
          style: 'Estilo',
          time: 'Horario',
          price: 'Precio'
        },
        levels: {
          beginner: 'Principiante',
          intermediate: 'Intermedio',
          advanced: 'Avanzado',
          all: 'Todos los niveles'
        },
        schedule: {
          duration: 'Duración',
          minutes: 'minutos',
          spotsLeft: 'cupos disponibles',
          soldOut: 'Agotado',
          fullClass: 'Clase completa'
        },
        details: {
          instructor: 'Instructor',
          venue: 'Lugar',
          price: 'Precio',
          capacity: 'Capacidad',
          requirements: 'Requisitos',
          whatYouWillLearn: 'Qué aprenderás'
        }
      },
      // Events Page
      events: {
        title: 'Eventos de Danza',
        subtitle: 'Únete a nuestros emocionantes eventos y talleres',
        description: 'Participa en nuestros eventos especiales, competencias y talleres con instructores invitados.',
        upcoming: 'Próximos eventos',
        past: 'Eventos pasados',
        featured: 'Eventos destacados',
        viewAll: 'Ver Todos los Eventos',
        free: 'Gratis',
        noUpcoming: 'No Hay Eventos Próximos',
        stayTuned: '¡Mantente atento! Estamos planeando algunos eventos de danza increíbles para ti.',
        getNotified: 'Ser Notificado',
        perPerson: '/persona',
        spotsLeftCount: '{{count}} cupos disponibles',
        soldOut: 'Agotado',
        eventsFound: 'eventos encontrados',
        searchPlaceholder: '🔍 Buscar eventos por nombre o descripción...',
        searchEvents: 'Buscar Eventos',
        availabilityLabel: 'Disponibilidad del evento',
        filters: {
          type: 'Tipo de evento',
          date: 'Fecha',
          location: 'Ubicación'
        },
        types: {
          workshop: 'Taller',
          competition: 'Competencia',
          performance: 'Presentación',
          social: 'Social',
          masterclass: 'Clase magistral',
          socialDance: 'Baile social',
          gala: 'Gala',
          kidsEvent: 'Evento infantil'
        },
        details: {
          date: 'Fecha',
          time: 'Hora',
          location: 'Ubicación',
          price: 'Precio',
          organizer: 'Organizador',
          attendees: 'Asistentes'
        },
        // CTA Section
        ctaBadgeText: 'Únete a la Experiencia',
        ctaTitle: '¿Listo para Bailar?',
        ctaDescription: '¡No te pierdas estos eventos de baile exclusivos! Reserva con anticipación para asegurar tu lugar y únete a nuestra vibrante comunidad de bailarines.',
        ctaButtons: {
          primary: '🎫 Reserva tu Lugar',
          secondary: '📞 Recibe Actualizaciones'
        },
        ctaFeatures: {
          earlyBird: 'Descuentos por Reserva Anticipada',
          earlyBirdDesc: 'Reserva con anticipación y ahorra hasta un 25% en entradas',
          vip: 'Experiencia VIP',
          vipDesc: 'Asientos en primera fila y encuentros exclusivos disponibles',
          group: 'Paquetes para Grupos',
          groupDesc: 'Trae amigos y ahorra más con tarifas especiales para grupos'
        }
      },
      // About Page
      aboutPage: {
        title: 'Acerca de Nosotros',
        subtitle: 'Nuestra pasión por la danza',
        heroTitle: 'Acerca de DanceLink',
        heroSubtitle: 'Conectando bailarines a través del lenguaje universal del movimiento. Descubre nuestra pasión por la danza y compromiso con la excelencia.',
        heroBadgeText: 'Nuestra Historia y Misión',
        heroFeatures: {
          awardWinning: 'Plataforma galardonada',
          expertInstructors: 'Instructores expertos',
          passionateCommunity: 'Comunidad apasionada'
        },
        statsTitle: 'Nuestro Impacto en Números',
        statsDescription: 'Ve cómo estamos marcando la diferencia en la comunidad de danza con nuestra plataforma e instructores dedicados',
        stats: {
          happyStudents: 'Estudiantes Felices',
          happyStudentsDesc: 'Y creciendo diariamente',
          danceStyles: 'Estilos de Danza',
          danceStylesDesc: 'Del ballet al hip-hop',
          expertInstructorsCount: 'Instructores Expertos',
          expertInstructorsDesc: 'Profesionales y certificados',
          studioLocations: 'Ubicaciones de Estudio',
          studioLocationsDesc: 'Por toda la ciudad'
        },
        ourStory: 'Nuestra Historia',
        storyDescription1: 'DanceLink fue fundado con una simple creencia: todos merecen experimentar la alegría y conexión que proviene de la danza. Comenzamos como una pequeña comunidad de bailarines apasionados y hemos crecido hasta convertirnos en una plataforma próspera que conecta a miles de estudiantes con instructores de clase mundial.',
        storyDescription2: 'Nuestra misión es hacer que la danza sea accesible, acogedora y transformadora para personas de todos los orígenes y niveles de habilidad. Ya sea que estés dando tus primeros pasos o perfeccionando técnicas avanzadas, estamos aquí para apoyar tu viaje de danza.',
        whyChooseUsTitle: '¿Por qué elegir DanceLink?',
        features: {
          awardWinningInstructors: {
            title: 'Instructores galardonados',
            description: 'Aprende de profesionales certificados con años de experiencia'
          },
          stateOfTheArtStudios: {
            title: 'Estudios de vanguardia',
            description: 'Instalaciones modernas equipadas con la última tecnología'
          },
          welcomingCommunity: {
            title: 'Comunidad acogedora',
            description: 'Únete a una red de apoyo de entusiastas de la danza'
          },
          provenResults: {
            title: 'Resultados comprobados',
            description: 'Rastrea tu progreso y celebra tus logros'
          }
        },
        newsletterTitle: '¡Mantente al Día!',
        newsletterDescription: 'Obtén acceso exclusivo a nuevas clases, eventos especiales y consejos de danza entregados a tu bandeja de entrada semanalmente.',
        newsletterBenefits: {
          weeklyTips: 'Consejos Semanales',
          exclusiveEvents: 'Eventos Exclusivos',
          specialDiscounts: 'Descuentos Especiales'
        },
        newsletterPlaceholder: 'Ingresa tu dirección de email',
        subscribeButton: '🚀 Suscribirse',
        subscriptionSuccess: '¡Gracias por suscribirte!',
        checkEmail: 'Revisa tu email para confirmación',
        ctaTitle: '¿Listo para Comenzar tu Viaje de Danza?',
        ctaDescription: 'Únete a cientos de bailarines que han transformado sus vidas a través del movimiento en DanceLink. ¡Comienza tu aventura hoy!',
        ctaBadgeText: 'Inicia tu Viaje',
        ctaButtons: {
          startFreeTrial: '🎁 Comenzar Prueba Gratis',
          browseAllClasses: '👀 Explorar Todas las Clases'
        },
        ctaFeatures: {
          noExperienceNeeded: {
            title: 'No se Necesita Experiencia',
            description: 'Perfecto para principiantes y bailarines experimentados por igual'
          },
          flexibleScheduling: {
            title: 'Horarios Flexibles',
            description: 'Elige clases que se adapten a tu estilo de vida ocupado'
          },
          moneyBackGuarantee: {
            title: 'Garantía de Devolución',
            description: '100% satisfacción o te devolvemos tu dinero'
          }
        },
        exploreClasses: '💃 Explorar Clases',
        contactUs: '📞 Contáctanos'
      },
      // Forum Page
      forum: {
        title: 'Foro de la Comunidad',
        subtitle: 'Conéctate, comparte y aprende con otros bailarines',
        newPost: 'Nueva Publicación',
        signInToPost: 'Iniciar Sesión para Publicar',
        categories: {
          all: 'Todos los Temas',
          general: 'Discusión General',
          technique: 'Técnicas de Danza',
          events: 'Eventos y Sociales',
          partners: 'Búsqueda de Pareja',
          music: 'Música y Listas',
          beginners: 'Rincón de Principiantes'
        },
        noPosts: 'Aún no hay publicaciones',
        beFirst: '¡Sé el primero en iniciar una discusión!',
        createFirst: 'Crear Primera Publicación',
        loading: 'Cargando...',
        loadingPosts: 'Cargando publicaciones...',
        pinned: 'Fijado',
        locked: 'Bloqueado',
        views: 'vistas',
        replies: 'respuestas',
        page: 'Página',
        of: 'de'
      },
      // Contact Page  
      contactPage: {
        getInTouchWithUs: 'Ponte en contacto con nosotros',
        getInTouch: 'Contacto',
        readyToStartDancing: '¿Listo para empezar a bailar? Estamos aquí para ayudarte a encontrar la clase perfecta!',
        weAreHereToHelp: 'Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.',
        contactUs: 'Contáctanos',
        callNow: '📱 Llamar Ahora: (123) 456-7890',
        emailUs: '✉️ Envíanos un Email',
        bookFreeTrial: 'Reservar Prueba Gratis',
        tryAnyClassFree: 'Prueba cualquier clase gratis y ve si es adecuada para ti',
        bookNow: 'Reservar Ahora',
        liveChat: 'Chat en Vivo',
        getInstantAnswers: 'Obtén respuestas instantáneas a tus preguntas',
        chatNow: 'Chatear Ahora',
        scheduleVisit: 'Programar Visita',
        visitOurStudio: 'Visita nuestro estudio y conoce a nuestros instructores',
        schedule: 'Programar',
        sendUsAMessage: '📝 Envíanos un Mensaje',
        fillOutForm: 'Completa el formulario a continuación y te responderemos en 24 horas',
        nameRequired: 'Nombre *',
        yourName: 'Tu nombre',
        phone: 'Teléfono',
        emailRequired: 'Email *',
        youAtExample: 'tu@ejemplo.com',
        interestedIn: 'Estoy interesado en:',
        selectAnOption: 'Selecciona una opción',
        freeTrialClass: '🎁 Clase de Prueba Gratis',
        regularClasses: '💃 Clases Regulares',
        eventsWorkshops: '🎉 Eventos y Talleres',
        privateLessons: '👨‍🏫 Lecciones Privadas',
        other: '❓ Otro',
        message: 'Mensaje',
        tellUsAboutGoals: 'Cuéntanos sobre tus objetivos de baile, nivel de experiencia o cualquier pregunta que tengas...',
        sendMessage: '🚀 Enviar Mensaje',
        responseTime: 'Normalmente respondemos en 2-4 horas durante el horario comercial',
        frequentlyAskedQuestions: '❓ Preguntas Frecuentes',
        quickAnswers: 'Respuestas rápidas a preguntas comunes',
        doINeedExperience: '¿Necesito experiencia para empezar?',
        noExperienceNeeded: '¡Para nada! Tenemos clases para principiantes en todos los estilos de baile. Nuestros instructores tienen experiencia enseñando a principiantes completos.',
        whatShouldIWear: '¿Qué debo usar?',
        comfortableClothing: 'Ropa cómoda que te permita moverte libremente. La mayoría de los estudiantes usan ropa deportiva o casual con zapatos cómodos.',
        canITryBeforeCommit: '¿Puedo probar antes de comprometerme?',
        freeTrialAvailable: '¡Sí! Ofrecemos una clase de prueba gratuita para todos los nuevos estudiantes. Esto te permite experimentar nuestro estilo de enseñanza y ver si la clase es adecuada para ti.',
        howDoIBookClass: '¿Cómo reservo una clase?',
        bookingInstructions: 'Llámanos al (123) 456-7890, envíanos un email, o completa el formulario de contacto arriba. ¡Te ayudaremos a encontrar la clase perfecta!'
      },
      contact: {
        title: 'Contáctanos',
        subtitle: 'Ponte en contacto con nosotros',
        description: 'Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.',
        form: {
          name: 'Nombre',
          email: 'Correo electrónico',
          phone: 'Teléfono',
          subject: 'Asunto',
          message: 'Mensaje',
          send: 'Enviar mensaje',
          success: 'Mensaje enviado con éxito',
          error: 'Error al enviar el mensaje'
        },
        info: {
          address: 'Dirección',
          phone: 'Teléfono',
          email: 'Correo',
          hours: 'Horarios',
          followUs: 'Síguenos'
        }
      },
      // Instructors Page
      instructors: {
        title: 'Nuestros Instructores',
        subtitle: 'Conoce a nuestros profesionales expertos',
        description: 'Nuestro equipo de instructores certificados está aquí para guiarte en tu viaje de danza.',
        specialties: 'Especialidades',
        experience: 'Experiencia',
        years: 'años',
        rating: 'Calificación',
        bookWith: 'Reservar con',
        viewProfile: 'Ver perfil'
      },
      // Booking
      booking: {
        title: 'Reservar',
        selectDate: 'Seleccionar fecha',
        selectTime: 'Seleccionar hora',
        personalInfo: 'Información personal',
        paymentInfo: 'Información de pago',
        confirmation: 'Confirmación',
        summary: 'Resumen de reserva',
        total: 'Total',
        deposit: 'Depósito',
        balance: 'Saldo',
        terms: 'Términos y condiciones',
        agree: 'Acepto los términos y condiciones',
        success: '¡Reserva exitosa!',
        confirmationNumber: 'Número de confirmación',
        checkEmail: 'Revisa tu correo electrónico para más detalles'
      },
      // Dashboard
      dashboard: {
        title: 'Panel de Control',
        welcome: 'Bienvenido',
        myBookings: 'Mis Reservas',
        myClasses: 'Mis Clases',
        profile: 'Perfil',
        settings: 'Configuración',
        notifications: 'Notificaciones',
        payments: 'Pagos',
        history: 'Historial'
      },
      // Pricing
      pricing: {
        title: 'Precios',
        subtitle: 'Elige el plan perfecto para ti',
        monthly: 'Mensual',
        yearly: 'Anual',
        perMonth: '/mes',
        perYear: '/año',
        save: 'Ahorra',
        mostPopular: 'Más Popular',
        features: 'Características',
        unlimited: 'Ilimitado',
        support: 'Soporte',
        choosePlan: 'Elegir Plan'
      },
      // Become Host Page
      becomeHost: {
        becomeA: 'Convértete en',
        host: 'Anfitrión',
        heroDescription: 'Transforma tu pasión en un próspero negocio de danza. Crea tu academia, gestiona sedes e inspira a bailarines de todo el mundo.',
        startYourApplication: 'Inicia tu Solicitud',
        learnMore: 'Saber Más',
        benefits: 'Beneficios',
        features: 'Características',
        howItWorks: 'Cómo Funciona',
        faq: 'Preguntas Frecuentes',
        whyBecomeHost: '¿Por qué ser Anfitrión?',
        joinCommunity: 'Únete a nuestra comunidad de profesionales de la danza y lleva tu negocio al siguiente nivel',
        buildDanceCommunity: 'Construye tu Comunidad de Danza',
        buildDanceCommunityDesc: 'Crea y gestiona tu propia academia de danza con múltiples sedes, clases y eventos en una sola plataforma.',
        professionalTools: 'Herramientas de Gestión Profesional',
        professionalToolsDesc: 'Obtén acceso a herramientas de nivel profesional para gestionar reservas, comunicaciones con estudiantes y análisis de negocio.',
        growBusiness: 'Haz Crecer tu Negocio',
        growBusinessDesc: 'Alcanza más estudiantes, aumenta las reservas y rastrea tu rendimiento con análisis detallados e insights.',
        globalReach: 'Alcance Global',
        globalReachDesc: 'Conéctate con bailarines de todo el mundo y expande tu audiencia más allá de tu área local.',
        qualityAssurance: 'Garantía de Calidad',
        qualityAssuranceDesc: 'Todas las solicitudes de anfitrión son revisadas cuidadosamente para mantener altos estándares y generar confianza con los estudiantes.',
        marketingSupport: 'Apoyo de Marketing',
        marketingSupportDesc: 'Apapérece destacado en nuestro directorio y benéficate de nuestros esfuerzos de marketing para atraer más estudiantes.',
        powerfulTools: 'Herramientas Poderosas para el Éxito',
        everythingYouNeed: 'Todo lo que necesitas para gestionar y hacer crecer tu negocio de danza',
        venueManagement: 'Gestión de Sedes',
        createMultipleVenues: 'Crear y gestionar múltiples sedes',
        addVenueDetails: 'Añadir información detallada de sedes con fotos',
        setLocation: 'Establecer ubicación con detalles de país y ciudad',
        trackVenueUtilization: 'Rastrear utilización de sedes y reservas',
        classManagement: 'Gestión de Clases',
        designCurriculums: 'Diseñar currículos integrales de clases',
        flexibleScheduling: 'Establecer horarios flexibles y precios',
        manageEnrollments: 'Gestionar inscripciones de estudiantes',
        trackClassPerformance: 'Rastrear rendimiento y asistencia de clases',
        eventPlanning: 'Planificación de Eventos',
        organizeWorkshops: 'Organizar talleres y presentaciones',
        createSpecialEvents: 'Crear eventos especiales y masterclasses',
        manageEventRegistrations: 'Gestionar registros de eventos',
        buildCommunity: 'Construir comunidad a través de eventos',
        businessAnalytics: 'Análisis de Negocio',
        trackRevenue: 'Rastrear ingresos y tendencias de reservas',
        monitorEngagement: 'Monitorear compromiso de estudiantes',
        analyzePopularity: 'Analizar popularidad de clases',
        generateReports: 'Generar reportes de rendimiento',
        howToGetStarted: 'Cómo Comenzar',
        simpleSteps: 'Pasos simples para convertirse en un anfitrión verificado en nuestra plataforma',
        submitApplication: 'Enviar Solicitud',
        submitApplicationDesc: 'Completa el formulario de registro de anfitrión con la información de tu negocio.',
        adminReview: 'Revisión de Admin',
        adminReviewDesc: 'Nuestro equipo revisa cuidadosamente tu solicitud para asegurar estándares de calidad.',
        getApproved: 'Obtener Aprobación',
        getApprovedDesc: 'Recibe notificación de aprobación y obtén acceso a tu panel de anfitrión.',
        startCreating: 'Comenzar a Crear',
        startCreatingDesc: 'Empieza a crear sedes, clases y eventos para tu comunidad de danza.',
        frequentlyAskedQuestions: 'Preguntas Frecuentes',
        everythingToKnow: 'Todo lo que necesitas saber sobre convertirte en anfitrión',
        requirementsQuestion: '¿Cuáles son los requisitos para ser anfitrión?',
        requirementsAnswer: 'Necesitas tener experiencia en instrucción de danza o gestión de academias, proporcionar información del negocio y pasar nuestro proceso de revisión de calidad.',
        approvalTimeQuestion: '¿Cuánto tarda el proceso de aprobación?',
        approvalTimeAnswer: 'Nuestro equipo administrativo típicamente revisa solicitudes en 3-5 días hábiles. Recibirás una notificación por email una vez que tu solicitud sea procesada.',
        createBeforeApprovalQuestion: '¿Puedo crear contenido antes de la aprobación?',
        createBeforeApprovalAnswer: 'Sí, puedes crear sedes, clases y eventos, pero no serán visibles para los estudiantes hasta la aprobación del admin. Esto te permite preparar tu contenido con anticipación.',
        feesQuestion: '¿Qué tarifas están asociadas con ser anfitrión?',
        feesAnswer: 'Tomamos una pequeña comisión de las reservas exitosas. No hay tarifas iniciales o cargos mensuales para convertirte en anfitrión.',
        multipleVenuesQuestion: '¿Puedo gestionar múltiples sedes?',
        multipleVenuesAnswer: '¡Absolutamente! Puedes crear y gestionar múltiples sedes en diferentes ubicaciones, perfecto para academias de danza con múltiples sucursales.',
        rejectionQuestion: '¿Qué pasa si mi solicitud es rechazada?',
        rejectionAnswer: 'Si tu solicitud no cumple con nuestros requisitos actuales, recibirás comentarios sobre áreas de mejora y puedes volver a solicitar después de abordar las preocupaciones.',
        readyToShare: '¿Listo para Compartir tu Pasión?',
        joinHundreds: 'Únete a cientos de profesionales de la danza que confían en nuestra plataforma para hacer crecer su negocio',
        startHostApplication: 'Iniciar Solicitud de Anfitrión',
        noSetupFees: 'Sin tarifas de configuración • Proceso de aprobación rápido • Soporte profesional'
      },
      // Error Messages
      errors: {
        pageNotFound: 'Página no encontrada',
        somethingWrong: 'Algo salió mal',
        tryAgain: 'Inténtalo de nuevo',
        contactSupport: 'Contactar soporte',
        networkError: 'Error de conexión',
        unauthorized: 'No autorizado',
        sessionExpired: 'Sesión expirada'
      },
      // Time and Date
      time: {
        today: 'Hoy',
        tomorrow: 'Mañana',
        yesterday: 'Ayer',
        thisWeek: 'Esta semana',
        nextWeek: 'Próxima semana',
        thisMonth: 'Este mes',
        nextMonth: 'Próximo mes',
        days: {
          monday: 'Lunes',
          tuesday: 'Martes',
          wednesday: 'Miércoles',
          thursday: 'Jueves',
          friday: 'Viernes',
          saturday: 'Sábado',
          sunday: 'Domingo'
        },
        months: {
          january: 'Enero',
          february: 'Febrero',
          march: 'Marzo',
          april: 'Abril',
          may: 'Mayo',
          june: 'Junio',
          july: 'Julio',
          august: 'Agosto',
          september: 'Septiembre',
          october: 'Octubre',
          november: 'Noviembre',
          december: 'Diciembre'
        }
      },
      // Privacy Policy
      privacy: {
        heroBadge: 'Tu privacidad importa',
        title: 'Política de Privacidad',
        heroDescription: 'Estamos comprometidos a proteger tu información personal y tu derecho a la privacidad. Aprende cómo recopilamos, usamos y protegemos tus datos.',
        dataProtection: 'Protección de Datos',
        secureStorage: 'Almacenamiento Seguro',
        legalCompliance: 'Cumplimiento Legal',
        lastUpdated: 'Última Actualización',
        lastUpdatedDate: '14 de octubre de 2024',
        introduction: {
          title: 'Introducción',
          paragraph1: 'Bienvenido a DanceLink ("nosotros", "nuestra empresa" o "nos"). Respetamos tu privacidad y estamos comprometidos a proteger tus datos personales. Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestro sitio web y te dirá sobre tus derechos de privacidad y cómo te protege la ley.',
          paragraph2: 'Esta política de privacidad se aplica a toda la información recopilada a través de nuestro sitio web, aplicaciones móviles y cualquier servicio relacionado, ventas, marketing o eventos.'
        },
        infoCollection: {
          title: 'Información que Recopilamos',
          personalInfo: {
            title: 'Información Personal'
          }
        },
        contact: {
          title: 'Contáctanos',
          description: 'Si tienes alguna pregunta sobre esta Política de Privacidad o nuestras prácticas de privacidad, por favor contáctanos:'
        },
        cta: {
          badge: 'Tu Privacidad está Protegida',
          title: '¿Preguntas sobre nuestra Política de Privacidad?',
          description: 'Estamos aquí para ayudarte. Contacta a nuestro equipo de soporte para cualquier pregunta o preocupación relacionada con la privacidad.',
          contactSupport: 'Contactar Soporte',
          viewTerms: 'Ver Términos de Servicio'
        }
      },
      // Terms of Service
      terms: {
        heroBadge: 'Términos y Condiciones Legales',
        title: 'Términos de Servicio',
        heroDescription: 'Por favor lee estos términos cuidadosamente antes de usar nuestros servicios. Al acceder a DanceLink, aceptas estar sujeto a estos términos y condiciones.',
        clearGuidelines: 'Guías Claras',
        fairAgreement: 'Acuerdo Justo',
        legalProtection: 'Protección Legal',
        lastUpdated: 'Última Actualización',
        lastUpdatedDate: '14 de octubre de 2024',
        agreement: {
          title: 'Acuerdo a los Términos',
          paragraph1: 'Al acceder y usar DanceLink ("el Servicio"), aceptas y acuerdas estar sujeto a los términos y provisiones de este acuerdo. Si no estás de acuerdo en cumplir con lo anterior, por favor no uses este servicio.',
          paragraph2: 'Estos términos se aplican a todos los visitantes, usuarios y otros que accedan o usen el servicio, incluidos instructores, estudiantes y hosts.'
        },
        usage: {
          title: 'Uso del Servicio'
        },
        accounts: {
          title: 'Cuentas de Usuario'
        },
        payment: {
          title: 'Términos de Reserva y Pago'
        },
        contact: {
          title: 'Contáctanos',
          description: 'Si tienes alguna pregunta sobre estos Términos de Servicio, por favor contáctanos:'
        },
        cta: {
          badge: 'Términos Claros y Condiciones Justas',
          title: '¿¿Listo para Unirte a Nuestra Comunidad de Danza?',
          description: 'Ahora que has leído nuestros términos, estás listo para comenzar tu viaje de danza con confianza y claridad.',
          browseClasses: 'Explorar Clases',
          contactUs: '¿Preguntas? Contáctanos',
          agreement: 'Al usar nuestro servicio, aceptas estos términos.',
          viewPrivacy: 'Ver nuestra Política de Privacidad'
        }
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    },
  })

export default i18n