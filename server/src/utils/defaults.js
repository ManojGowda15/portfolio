/**
 * Default values for models
 * These are used when creating default documents in the database
 */

export const DEFAULT_HERO = {
  greeting: 'Hi I am',
  name: 'Manoj V',
  designation: 'Full Stack Developer & UI/UX Designer',
  description: 'With a passion for crafting clean, intuitive, and high-performing digital experiences, I develop both web and mobile applications that merge design and functionality seamlessly. From concept to deployment, I focus on creating interactive solutions that captivate users and make a lasting impression.',
  linkedinUrl: 'https://www.linkedin.com/in/manojv03/',
  githubUrl: 'https://github.com/ManojGowda15',
  image: '',
  phone: '+91-7204540632',
  email: 'manojv13579@gmail.com',
  address: 'Bangalore, Karnataka, India',
};

export const DEFAULT_ABOUT = {
  description: 'Passionate Full Stack Developer and UI/UX Designer with a Creative Approach to Crafting Intuitive and Engaging User Experiences. I specialize in building modern web and mobile applications using cutting-edge technologies.',
  skills: [
    { name: 'React.js', progress: 90, color: 'bg-blue-600' },
    { name: 'Node.js', progress: 85, color: 'bg-green-600' },
    { name: 'MongoDB', progress: 80, color: 'bg-green-500' },
    { name: 'JavaScript', progress: 88, color: 'bg-yellow-500' },
    { name: 'UI/UX Design', progress: 85, color: 'bg-purple-600' },
    { name: 'Mobile Development', progress: 75, color: 'bg-indigo-600' },
  ],
  highlights: [
    { value: '5+', label: 'Years of Experience', detail: 'Building digital products' },
    { value: '50+', label: 'Projects Delivered', detail: 'Web & mobile solutions' },
    { value: '20+', label: 'Technologies', detail: 'Across the stack' },
    { value: '100%', label: 'Client Satisfaction', detail: 'Happy customers' },
  ],
  mission: 'Crafting meaningful products that balance stunning visuals with dependable performance. I believe in creating digital experiences that not only look great but also solve real problems and deliver measurable results.',
};

export const DEFAULT_SERVICES = {
  sectionTitle: 'Services',
  sectionDescription: 'Comprehensive development solutions tailored to your business needs. From mobile apps to web platforms and seamless API integrations.',
  services: [
    {
      slug: 'app-development',
      title: 'App Development',
      icon: 'Smartphone',
      shortDescription: 'Building native and cross-platform mobile applications for iOS and Android. Creating high-performance apps with modern frameworks and best practices.',
      fullDescription: `I specialize in developing mobile applications that deliver exceptional user experiences across iOS and Android platforms. Using modern frameworks like React Native, Flutter, and native technologies, I build apps that are fast, reliable, and scalable.

My app development process includes thorough planning, clean architecture implementation, rigorous testing, and seamless deployment. I focus on creating apps that not only meet your business objectives but also provide users with intuitive and engaging experiences. From concept to app store submission, I handle every aspect of the development lifecycle.`,
      features: [
        'iOS & Android Development',
        'React Native & Flutter',
        'Native App Development',
        'App Store Deployment',
        'Performance Optimization',
        'Backend Integration',
      ],
      process: [
        { step: '01', title: 'Requirements Analysis', description: 'Understanding your business needs and defining app features and functionality.' },
        { step: '02', title: 'Architecture & Planning', description: 'Designing app architecture and creating development roadmap.' },
        { step: '03', title: 'Development & Testing', description: 'Building the app with clean code and comprehensive testing.' },
        { step: '04', title: 'Quality Assurance', description: 'Rigorous testing across devices and platforms to ensure flawless performance.' },
        { step: '05', title: 'Deployment & Support', description: 'App store submission and ongoing maintenance and updates.' },
      ],
      color: 'blue',
      order: 0,
    },
    {
      slug: 'web-development',
      title: 'Web Development',
      icon: 'Monitor',
      shortDescription: 'Creating responsive, scalable web applications and websites using modern technologies. From frontend to backend, delivering complete web solutions.',
      fullDescription: `I develop modern, responsive web applications that provide excellent user experiences across all devices. Using cutting-edge technologies like React, Node.js, and modern frameworks, I build websites and web apps that are fast, secure, and scalable.

My web development expertise covers both frontend and backend development, ensuring end-to-end solutions. I create websites that are not only visually appealing but also optimized for performance, SEO, and user engagement. From simple landing pages to complex web applications, I deliver solutions that drive business growth.`,
      features: [
        'Responsive Web Design',
        'Frontend & Backend Development',
        'Modern Frameworks (React, Vue, Angular)',
        'Database Integration',
        'API Development',
        'Performance Optimization',
      ],
      process: [
        { step: '01', title: 'Planning & Design', description: 'Defining project requirements and creating wireframes and designs.' },
        { step: '02', title: 'Frontend Development', description: 'Building responsive user interfaces with modern frameworks.' },
        { step: '03', title: 'Backend Development', description: 'Developing server-side logic, APIs, and database integration.' },
        { step: '04', title: 'Testing & Optimization', description: 'Comprehensive testing and performance optimization.' },
        { step: '05', title: 'Deployment & Maintenance', description: 'Deploying to production and providing ongoing support.' },
      ],
      color: 'blue',
      order: 1,
    },
    {
      slug: 'api-integration',
      title: 'API Integration',
      icon: 'Code',
      shortDescription: 'Seamlessly connecting your applications with third-party services and APIs. Building robust integrations that enhance functionality and streamline workflows.',
      fullDescription: `I specialize in API integration and development, connecting your applications with external services, payment gateways, social media platforms, and other third-party APIs. I build secure, efficient, and scalable API integrations that enhance your application's functionality.

My API integration services include RESTful API development, GraphQL implementation, webhook setup, and real-time data synchronization. I ensure all integrations are secure, well-documented, and follow industry best practices. Whether you need payment processing, social media integration, or custom API development, I deliver solutions that work seamlessly with your existing systems.`,
      features: [
        'RESTful API Development',
        'Third-Party API Integration',
        'Payment Gateway Integration',
        'GraphQL Implementation',
        'Webhook Setup',
        'API Documentation',
      ],
      process: [
        { step: '01', title: 'API Analysis', description: 'Analyzing requirements and identifying integration points.' },
        { step: '02', title: 'Integration Planning', description: 'Designing integration architecture and data flow.' },
        { step: '03', title: 'Development & Testing', description: 'Building and testing API integrations thoroughly.' },
        { step: '04', title: 'Security & Optimization', description: 'Implementing security measures and optimizing performance.' },
        { step: '05', title: 'Documentation & Support', description: 'Providing comprehensive documentation and ongoing support.' },
      ],
      color: 'blue',
      order: 2,
    },
  ],
};

export const DEFAULT_EDUCATION = {
  sectionTitle: 'Education',
  sectionDescription: 'All my life I have been driven by my strong belief that education is important. I try to learn something new every single day.',
  educationItems: [
    {
      degree: 'Bachelor of Engineering (B.E.)',
      collegeName: 'Visvesvaraya Technological University',
      institution: 'Computer Science & Engineering',
      year: '2018 - 2022',
      percentage: '8.5 CGPA',
      description: 'Specialized in software development, database management, and computer networks. Completed various projects in web and mobile development.',
      order: 0,
    },
    {
      degree: 'Higher Secondary Education',
      collegeName: 'State Board',
      institution: 'Science Stream',
      year: '2016 - 2018',
      percentage: '85%',
      description: 'Completed with focus on Mathematics, Physics, and Chemistry.',
      order: 1,
    },
  ],
};

export const DEFAULT_PROJECTS = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with user authentication, product management, shopping cart, and payment integration. Built with React, Node.js, and MongoDB.',
    category: 'Website Design',
    image: 'https://via.placeholder.com/800x600?text=E-Commerce+Platform',
    technologies: ['React.js', 'Node.js', 'MongoDB', 'Express', 'Stripe API'],
    liveUrl: 'https://example.com/ecommerce',
    githubUrl: 'https://github.com/example/ecommerce',
    featured: true,
  },
  {
    title: 'Task Management App',
    description: 'A modern task management application with real-time collaboration features. Users can create projects, assign tasks, set deadlines, and track progress.',
    category: 'App Design',
    image: 'https://via.placeholder.com/800x600?text=Task+Management+App',
    technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
    liveUrl: 'https://example.com/taskapp',
    githubUrl: 'https://github.com/example/taskapp',
    featured: true,
  },
  {
    title: 'Portfolio Website',
    description: 'A responsive portfolio website showcasing projects, skills, and experience. Features smooth animations, modern design, and optimized performance.',
    category: 'Website Design',
    image: 'https://via.placeholder.com/800x600?text=Portfolio+Website',
    technologies: ['React.js', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
    liveUrl: 'https://example.com/portfolio',
    githubUrl: 'https://github.com/example/portfolio',
    featured: false,
  },
  {
    title: 'Social Media Dashboard',
    description: 'A comprehensive dashboard for managing social media accounts, scheduling posts, and analyzing engagement metrics across multiple platforms.',
    category: 'Website Design',
    image: 'https://via.placeholder.com/800x600?text=Social+Media+Dashboard',
    technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Chart.js'],
    liveUrl: 'https://example.com/social-dashboard',
    githubUrl: 'https://github.com/example/social-dashboard',
    featured: false,
  },
  {
    title: 'Fitness Tracking App',
    description: 'A mobile application for tracking workouts, monitoring progress, and setting fitness goals. Includes features for exercise logging and progress visualization.',
    category: 'App Design',
    image: 'https://via.placeholder.com/800x600?text=Fitness+Tracking+App',
    technologies: ['Flutter', 'Firebase', 'Health API', 'Dart'],
    liveUrl: 'https://example.com/fitness-app',
    githubUrl: 'https://github.com/example/fitness-app',
    featured: true,
  },
  {
    title: 'Restaurant Booking System',
    description: 'An online reservation system for restaurants allowing customers to book tables, view menus, and make orders. Includes admin panel for restaurant management.',
    category: 'Website Design',
    image: 'https://via.placeholder.com/800x600?text=Restaurant+Booking+System',
    technologies: ['React.js', 'Node.js', 'MongoDB', 'Socket.io'],
    liveUrl: 'https://example.com/restaurant',
    githubUrl: 'https://github.com/example/restaurant',
    featured: false,
  },
];

