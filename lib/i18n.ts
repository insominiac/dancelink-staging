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
        perPerson: '/person',
        spotsLeftCount: '{{count}} spots left',
        soldOut: 'Sold out',
        searchPlaceholder: '🔍 Search events by name or description...',
        searchEvents: 'Search Events',
        availabilityLabel: 'Event Availability',
        filters: {
          all: 'All Types'
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
        filters: {
          type: 'Event Type',
          date: 'Date',
          location: 'Location'
        },
        priceRanges: {
          anyPrice: 'Cualquier Precio',
          under25: 'Menos de $25',
          from25to50: '$25 - $50',
          from50to100: '$50 - $100',
          over100: 'Más de $100'
        },
        types: {
          workshop: 'Workshop',
          competition: 'Competition',
          performance: 'Performance',
          social: 'Social',
          masterclass: 'Masterclass'
        },
        details: {
          date: 'Date',
          time: 'Time',
          location: 'Location',
          price: 'Price',
          organizer: 'Organizer',
          attendees: 'Attendees'
        }
      },
      // About Page
      aboutPage: {
        title: 'About Us',
        subtitle: 'Our passion for dance',
        ourStory: 'Our Story',
        ourMission: 'Our Mission',
        ourVision: 'Our Vision',
        ourValues: 'Our Values',
        meetTheTeam: 'Meet the Team',
        facilities: 'Our Facilities',
        testimonials: 'Testimonials'
      },
      // Contact Page
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
      // Forum
      forum: {
        title: 'Community Forum',
        subtitle: 'Connect with other dancers',
        newPost: 'New Post',
        reply: 'Reply',
        replies: 'Replies',
        lastReply: 'Last Reply',
        categories: 'Categories',
        popular: 'Popular',
        recent: 'Recent'
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
        perPerson: '/persona',
        spotsLeftCount: '{{count}} cupos disponibles',
        soldOut: 'Agotado',
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
        }
      },
      // About Page
      aboutPage: {
        title: 'Acerca de Nosotros',
        subtitle: 'Nuestra pasión por la danza',
        ourStory: 'Nuestra Historia',
        ourMission: 'Nuestra Misión',
        ourVision: 'Nuestra Visión',
        ourValues: 'Nuestros Valores',
        meetTheTeam: 'Conoce al Equipo',
        facilities: 'Nuestras Instalaciones',
        testimonials: 'Testimonios'
      },
      // Contact Page
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
      // Forum
      forum: {
        title: 'Foro de la Comunidad',
        subtitle: 'Conecta con otros bailarines',
        newPost: 'Nueva publicación',
        reply: 'Responder',
        replies: 'Respuestas',
        lastReply: 'Última respuesta',
        categories: 'Categorías',
        popular: 'Popular',
        recent: 'Reciente'
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