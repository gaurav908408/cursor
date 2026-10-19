export interface Project {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  imageUrl: string;
  projectUrl: string;
}

export const demoProjects: Project[] = [
  {
    title: "E-commerce Storefront",
    description: "A modern online shop with product listings, cart, and checkout functionality.",
    category: "Web Development",
    technologies: ["Next.js", "React", "Tailwind CSS", "Stripe"],
    imageUrl: "/images/project-ecommerce.jpg",
    projectUrl: "https://example.com/ecommerce"
  },
  {
    title: "Personal Portfolio Website",
    description: "Showcasing projects, skills, and contact information for a developer.",
    category: "Web Design",
    technologies: ["React", "SCSS", "Framer Motion"],
    imageUrl: "/images/project-portfolio.jpg",
    projectUrl: "https://example.com/portfolio"
  },
  {
    title: "Task Management App",
    description: "Organize daily tasks with drag-and-drop, due dates, and priority settings.",
    category: "Productivity",
    technologies: ["Vue.js", "Node.js", "Express", "MongoDB"],
    imageUrl: "/images/project-taskapp.jpg",
    projectUrl: "https://example.com/taskapp"
  },
  {
    title: "Recipe Sharing Platform",
    description: "Users can share, discover, and save recipes with ratings and comments.",
    category: "Community",
    technologies: ["Angular", "Firebase", "TypeScript"],
    imageUrl: "/images/project-recipes.jpg",
    projectUrl: "https://example.com/recipes"
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather updates for multiple locations using a public API.",
    category: "Utility",
    technologies: ["JavaScript", "HTML", "CSS", "OpenWeather API"],
    imageUrl: "/images/project-weather.jpg",
    projectUrl: "https://example.com/weather"
  },
  {
    title: "Blog Platform",
    description: "A content management system for publishing articles with rich text editing.",
    category: "Content",
    technologies: ["Gatsby", "GraphQL", "Markdown"],
    imageUrl: "/images/project-blog.jpg",
    projectUrl: "https://example.com/blog"
  },
  {
    title: "Fitness Tracker",
    description: "Log workouts, track progress, and set fitness goals with data visualization.",
    category: "Health",
    technologies: ["React Native", "Expo", "Redux"],
    imageUrl: "/images/project-fitness.jpg",
    projectUrl: "https://example.com/fitness"
  },
  {
    title: "Online Quiz Application",
    description: "Create and take quizzes with instant feedback and score tracking.",
    category: "Education",
    technologies: ["Svelte", "Node.js", "PostgreSQL"],
    imageUrl: "/images/project-quiz.jpg",
    projectUrl: "https://example.com/quiz"
  },
  {
    title: "Movie Database",
    description: "Browse movies, view details, ratings, and trailers from a large database.",
    category: "Entertainment",
    technologies: ["Next.js", "TMDB API", "TypeScript"],
    imageUrl: "/images/project-movies.jpg",
    projectUrl: "https://example.com/movies"
  },
  {
    title: "Chat Application",
    description: "Real-time messaging with user authentication and group chat features.",
    category: "Communication",
    technologies: ["Socket.IO", "React", "Express"],
    imageUrl: "/images/project-chat.jpg",
    projectUrl: "https://example.com/chat"
  },
  {
    title: "Event Management System",
    description: "Plan, organize, and promote events with ticketing and attendee tracking.",
    category: "Business",
    technologies: ["Django", "Python", "Bootstrap"],
    imageUrl: "/images/project-events.jpg",
    projectUrl: "https://example.com/events"
  },
  {
    title: "Music Player Web App",
    description: "Stream music, create playlists, and manage your favorite tracks.",
    category: "Entertainment",
    technologies: ["React", "Web Audio API", "Styled Components"],
    imageUrl: "/images/project-music.jpg",
    projectUrl: "https://example.com/music"
  },
  {
    title: "Job Board Platform",
    description: "Post and search for job openings with filtering and application features.",
    category: "Recruitment",
    technologies: ["Laravel", "PHP", "Vue.js"],
    imageUrl: "/images/project-jobboard.jpg",
    projectUrl: "https://example.com/jobboard"
  },
  {
    title: "Online Code Editor",
    description: "Write and execute code snippets in various languages directly in the browser.",
    category: "Developer Tools",
    technologies: ["React", "Monaco Editor", "WebAssembly"],
    imageUrl: "/images/project-codeeditor.jpg",
    projectUrl: "https://example.com/codeeditor"
  },
  {
    title: "Expense Tracker",
    description: "Monitor personal finances, categorize expenses, and visualize spending habits.",
    category: "Finance",
    technologies: ["Next.js", "Chart.js", "Prisma", "PostgreSQL"],
    imageUrl: "/images/project-expense.jpg",
    projectUrl: "https://example.com/expense"
  },
  {
    title: "Social Media Feed",
    description: "A simplified social feed with posts, likes, and comments.",
    category: "Social",
    technologies: ["React", "Firebase", "Material-UI"],
    imageUrl: "/images/project-social.jpg",
    projectUrl: "https://example.com/social"
  },
  {
    title: "Booking System",
    description: "Schedule appointments or reservations for services with calendar integration.",
    category: "Business",
    technologies: ["Next.js", "Calendar API", "MongoDB"],
    imageUrl: "/images/project-booking.jpg",
    projectUrl: "https://example.com/booking"
  },
  {
    title: "Image Gallery",
    description: "Upload, display, and manage image collections with search and filters.",
    category: "Media",
    technologies: ["React", "Cloudinary", "Node.js"],
    imageUrl: "/images/project-gallery.jpg",
    projectUrl: "https://example.com/gallery"
  },
  {
    title: "Survey Platform",
    description: "Create custom surveys, collect responses, and analyze data.",
    category: "Research",
    technologies: ["Vue.js", "Express", "MySQL"],
    imageUrl: "/images/project-survey.jpg",
    projectUrl: "https://example.com/survey"
  },
  {
    title: "Cryptocurrency Tracker",
    description: "Monitor real-time prices, market caps, and historical data for cryptocurrencies.",
    category: "Finance",
    technologies: ["React", "CoinGecko API", "Chart.js"],
    imageUrl: "/images/project-crypto.jpg",
    projectUrl: "https://example.com/crypto"
  },
  {
    title: "Educational Platform",
    description: "Online courses with video lessons, quizzes, and progress tracking.",
    category: "Education",
    technologies: ["Next.js", "Stripe", "Mux"],
    imageUrl: "/images/project-education.jpg",
    projectUrl: "https://example.com/education"
  },
  {
    title: "Recipe Calculator",
    description: "Adjust ingredient quantities based on serving size and unit conversions.",
    category: "Utility",
    technologies: ["JavaScript", "HTML", "CSS"],
    imageUrl: "/images/project-calculator.jpg",
    projectUrl: "https://example.com/calculator"
  },
  {
    title: "Forum Application",
    description: "A discussion board where users can create topics and reply to posts.",
    category: "Community",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "NextAuth.js"],
    imageUrl: "/images/project-forum.jpg",
    projectUrl: "https://example.com/forum"
  },
  {
    title: "Landing Page Generator",
    description: "Create custom landing pages with various templates and drag-and-drop editor.",
    category: "Marketing",
    technologies: ["React", "GrapesJS", "Node.js"],
    imageUrl: "/images/project-landingpage.jpg",
    projectUrl: "https://example.com/landingpage"
  },
  {
    title: "Portfolio Builder",
    description: "Generate a professional online portfolio from pre-designed templates.",
    category: "Web Design",
    technologies: ["Vue.js", "Nuxt.js", "Tailwind CSS"],
    imageUrl: "/images/project-portfoliogen.jpg",
    projectUrl: "https://example.com/portfoliogen"
  },
  {
    title: "Stock Market Simulator",
    description: "Practice trading with virtual money and real-time stock data.",
    category: "Finance",
    technologies: ["React", "Alpha Vantage API", "Redux"],
    imageUrl: "/images/project-stocksim.jpg",
    projectUrl: "https://example.com/stocksim"
  },
  {
    title: "Travel Planner",
    description: "Plan itineraries, discover destinations, and manage bookings.",
    category: "Travel",
    technologies: ["Next.js", "Google Maps API", "MongoDB"],
    imageUrl: "/images/project-travel.jpg",
    projectUrl: "https://example.com/travel"
  },
  {
    title: "CRM System",
    description: "Manage customer relationships, sales leads, and support tickets.",
    category: "Business",
    technologies: ["Angular", "Node.js", "Express", "PostgreSQL"],
    imageUrl: "/images/project-crm.jpg",
    projectUrl: "https://example.com/crm"
  },
  {
    title: "Online Whiteboard",
    description: "Collaborative drawing and brainstorming tool with real-time updates.",
    category: "Productivity",
    technologies: ["React", "Socket.IO", "Canvas API"],
    imageUrl: "/images/project-whiteboard.jpg",
    projectUrl: "https://example.com/whiteboard"
  },
  {
    title: "Podcast Directory",
    description: "Browse, listen, and subscribe to podcasts with episode management.",
    category: "Entertainment",
    technologies: ["Next.js", "RSS Feed Parser", "Styled Components"],
    imageUrl: "/images/project-podcast.jpg",
    projectUrl: "https://example.com/podcast"
  }
];
