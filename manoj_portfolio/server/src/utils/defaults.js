/**
 * Default values for models
 * These are used when creating default documents in the database
 */

export const DEFAULT_HERO = {
  greeting: 'Hi I am',
  name: 'Manoj V',
  designation: 'Software Developer',
  description: 'With a passion for crafting clean, intuitive, and high-performing digital experiences, I develop both web and mobile applications that merge design and functionality seamlessly. From concept to deployment, I focus on creating interactive solutions that captivate users and make a lasting impression.',
  linkedinUrl: 'https://www.linkedin.com/in/manojv03/',
  githubUrl: 'https://github.com/ManojGowda15',
  image: '',
};

export const DEFAULT_ABOUT = {
  description: 'Passionate UI/UX Designer with a Creative Approach to Crafting Intuitive and Engaging User Experiences',
  skills: [
    { name: 'Java', progress: 85, color: 'bg-orange-500' },
    { name: 'Kotlin', progress: 75, color: 'bg-purple-600' },
    { name: 'Website Design', progress: 80, color: 'bg-blue-600' },
    { name: 'App Design', progress: 75, color: 'bg-gray-500' },
    { name: 'MySQL', progress: 70, color: 'bg-red-500' },
  ],
  image: '',
};

export const DEFAULT_SERVICES = {
  sectionTitle: 'My Design Services',
  sectionDescription: 'Crafting visually engaging interfaces that are both intuitive and user-centered, ensuring a seamless experience.',
  services: [
    {
      slug: 'app-design',
      title: 'App Design',
      icon: 'Smartphone',
      shortDescription: 'Designing mobile applications that are both beautiful and functional. I create app interfaces that users love to interact with on iOS and Android platforms.',
      fullDescription: `I design mobile applications that users love to interact with. Whether it's iOS, Android, or cross-platform apps, I create intuitive interfaces that make complex tasks feel simple and enjoyable.

My app design process focuses on creating seamless user flows, engaging micro-interactions, and pixel-perfect interfaces that align with platform guidelines while maintaining your unique brand identity. I ensure every screen is optimized for touch interactions and provides clear feedback to users.`,
      features: [
        'iOS & Android Design',
        'Native & Cross-Platform',
        'User Flow Optimization',
        'Micro-Interactions & Animations',
        'App Store Optimization',
        'Prototyping & Testing',
      ],
      process: [
        { step: '01', title: 'Research & Analysis', description: 'Studying user behavior, competitor apps, and market trends.' },
        { step: '02', title: 'User Flow Design', description: 'Mapping out user journeys and creating intuitive navigation structures.' },
        { step: '03', title: 'UI Design & Prototyping', description: 'Designing screens and creating interactive prototypes for testing.' },
        { step: '04', title: 'Usability Testing', description: 'Testing with real users to identify and fix usability issues.' },
        { step: '05', title: 'Handoff & Collaboration', description: 'Providing detailed design specs and assets for development.' },
      ],
      color: 'purple',
      order: 0,
    },
    {
      slug: 'web-design',
      title: 'Web Design',
      icon: 'Monitor',
      shortDescription: 'Creating responsive and modern websites that provide excellent user experiences across all devices. From concept to deployment, I handle every aspect of web design.',
      fullDescription: `I create stunning, responsive websites that work flawlessly across all devices and screen sizes. From landing pages to complex web applications, I design digital experiences that captivate users and drive conversions.

My web design approach combines modern aesthetics with performance optimization, ensuring your website not only looks great but also loads quickly and ranks well in search engines. I focus on creating intuitive navigation, compelling visuals, and seamless interactions that keep visitors engaged.`,
      features: [
        'Responsive & Mobile-First Design',
        'Modern UI/UX Principles',
        'Performance Optimization',
        'SEO-Friendly Structure',
        'Cross-Browser Compatibility',
        'Content Management Integration',
      ],
      process: [
        { step: '01', title: 'Planning & Strategy', description: 'Defining project scope, goals, and technical requirements.' },
        { step: '02', title: 'Design & Mockups', description: 'Creating visual designs and interactive prototypes for approval.' },
        { step: '03', title: 'Development Preparation', description: 'Preparing design assets and specifications for development.' },
        { step: '04', title: 'Quality Assurance', description: 'Testing across devices and browsers to ensure perfect functionality.' },
        { step: '05', title: 'Launch & Support', description: 'Deploying the website and providing ongoing maintenance support.' },
      ],
      color: 'green',
      order: 1,
    },
  ],
};

