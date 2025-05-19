export interface Card {
  title: string;
  body: string;
  icon?: string; // Optional: emoji or icon identifier
  image?: string; // Optional: URL or path to an image
  bgColor?: string; // Optional: Tailwind background class for the card
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // This should exactly match one of the options
}

export interface Course {
  id: string; // Use string IDs for easier route matching
  title: string;
  description: string;
  role?: string; // For potential future personalization
  cards: Card[];
  badge: string; // Name of the badge unlocked upon completion
  quiz?: QuizQuestion[]; // Added optional quiz property
}

export const learningCourses: Course[] = [
  {
    id: "role-personalized",
    title: "🚀 Welcome to Your Role at FIDO Spark!",
    description: "A personalized guide to help you hit the ground running in your new role. Let's get you acquainted with your mission, tools, and first steps.",
    role: "Engineer", 
    cards: [
      { title: "Your Mission, Sparky!", body: "As an Engineer, you're at the heart of innovation, building the secure and scalable systems that power FIDO Spark.", icon: "🎯", bgColor: "bg-gradient-to-br from-aqua/60 to-mauve/40" },
      { title: "Tech Stack & Tools", body: "We primarily use TypeScript, React (Next.js), Node.js, and Tailwind CSS. Get familiar with our CI/CD pipeline and code review practices.", icon: "🛠️", bgColor: "bg-gradient-to-br from-lime/60 to-aqua/40" },
      { title: "First 30 Days", body: "Expect to pair program, meet your onboarding buddy, dive into the codebase, and make your first contribution!", icon: "🗓️", bgColor: "bg-gradient-to-br from-mauve/60 to-primary/30" }
    ],
    badge: "Engineer Explorer",
    quiz: [
      {
        question: "What is the primary tech stack mentioned for Engineers at FIDO Spark?",
        options: [
          "Python, Django, and Vue.js",
          "TypeScript, React (Next.js), Node.js, and Tailwind CSS",
          "Java, Spring, and Angular",
          "Ruby on Rails and jQuery"
        ],
        answer: "TypeScript, React (Next.js), Node.js, and Tailwind CSS"
      },
      {
        question: "What is one expectation for an Engineer in their first 30 days?",
        options: [
          "Lead a major project independently",
          "Deploy a new global service",
          "Pair program and make a first contribution",
          "Rewrite the authentication system"
        ],
        answer: "Pair program and make a first contribution"
      }
    ]
  },
  {
    id: "department-overview",
    title: "🤝 FIDO Departments: A Grand Tour",
    description: "Understand how different teams across FIDO collaborate to achieve our mission. See the bigger picture and how we all connect.",
    role: "All",
    cards: [
      { title: "Engineering Team", body: "Builds, maintains, and scales the core systems and infrastructure powering our innovative products.", icon: "💻", bgColor: "bg-gradient-to-br from-aqua/50 to-bg" },
      { title: "Design & UX", body: "Crafts intuitive, accessible, and delightful user experiences that make FIDO Spark lovable.", icon: "🎨", bgColor: "bg-gradient-to-br from-mauve/50 to-bg" },
      { title: "Customer Success", body: "Our champions for users! They provide support, gather feedback, and ensure everyone gets the most out of FIDO Spark.", icon: "💬", bgColor: "bg-gradient-to-br from-lime/50 to-bg" }
    ],
    badge: "Team Player",
    quiz: [
      {
        question: "Which FIDO department is primarily responsible for building and scaling core systems?",
        options: ["Design & UX", "Customer Success", "Engineering Team", "Marketing"],
        answer: "Engineering Team"
      },
      {
        question: "What is a key function of the Design & UX team at FIDO Spark?",
        options: ["Managing server infrastructure", "Crafting intuitive user experiences", "Direct sales to enterprise clients", "Providing technical support"],
        answer: "Crafting intuitive user experiences"
      }
    ]
  },
  {
    id: "products-101",
    title: "💡 FIDO Spark Products: The Lowdown",
    description: "Explore the innovative products and services that drive FIDO Spark's mission forward. What we build and why it matters.",
    role: "All",
    cards: [
      { title: "SparkLearn Platform", body: "Our flagship gamified learning environment for onboarding and continuous education.", icon: "🎓", bgColor: "bg-gradient-to-br from-primary/40 to-mauve/30" },
      { title: "SparkAuth Solutions", body: "Cutting-edge FIDO2 and WebAuthn solutions for passwordless authentication.", icon: "🛡️", bgColor: "bg-gradient-to-br from-aqua/60 to-lime/40" },
      { title: "SparkConnect API", body: "Enables seamless integration of FIDO Spark functionalities into third-party applications.", icon: "🔗", bgColor: "bg-gradient-to-br from-lime/50 to-primary/20" }
    ],
    badge: "Product Pro",
    quiz: [
      {
        question: "Which FIDO Spark product is focused on passwordless authentication?",
        options: ["SparkLearn Platform", "SparkConnect API", "SparkAuth Solutions", "SparkAnalytics Suite"],
        answer: "SparkAuth Solutions"
      },
      {
        question: "What is the primary purpose of the SparkLearn Platform?",
        options: ["To provide API integration tools", "To offer customer support chat", "A gamified learning environment for onboarding", "To manage user authentication"],
        answer: "A gamified learning environment for onboarding"
      }
    ]
  },
  {
    id: "fido-policies-culture",
    title: "📜 FIDO Policies & Our Vibrant Culture",
    description: "Understanding our code of conduct, core values, remote work best practices, and the everyday culture that makes FIDO Spark unique.",
    role: "All",
    cards: [
      { title: "Code of Conduct", body: "We are committed to a respectful, inclusive, and collaborative environment for everyone.", icon: "⚖️", bgColor: "bg-gradient-to-br from-mauve/40 to-aqua/30" },
      { title: "Core Values: S.P.A.R.K.", body: "Security, Passion, Accountability, Respect, Knowledge. These guide our decisions and actions.", icon: "💖", bgColor: "bg-gradient-to-br from-lime/50 to-mauve/30" },
      { title: "Remote-First Excellence", body: "Best practices for asynchronous communication, virtual collaboration, and maintaining work-life balance.", icon: "🏠", bgColor: "bg-gradient-to-br from-aqua/50 to-primary/20" }
    ],
    badge: "Culture Champ",
    quiz: [
      {
        question: "What does the 'S' in FIDO Spark's S.P.A.R.K. core values stand for?",
        options: ["Synergy", "Speed", "Security", "Sales"],
        answer: "Security"
      },
      {
        question: "Which of the following is emphasized by FIDO Spark's Code of Conduct?",
        options: ["Strict adherence to office hours", "A respectful and inclusive environment", "Mandatory social events", "Use of specific programming languages"],
        answer: "A respectful and inclusive environment"
      }
    ]
  },
  {
    id: "iso-compliance",
    title: "🔒 ISO Compliance Essentials",
    description: "Learn the key principles of ISO 27001 and how we stay compliant with information security standards to protect our users and data.",
    role: "All",
    cards: [
      { title: "What is ISO 27001?", body: "An international standard for managing information security. It helps us protect sensitive data systematically.", icon: "🌍", bgColor: "bg-gradient-to-br from-primary/30 to-lime/40" },
      { title: "Key Security Controls", body: "Understand access control, data encryption, incident response, and risk management as per ISO guidelines.", icon: "🔑", bgColor: "bg-gradient-to-br from-aqua/60 to-mauve/40" },
      { title: "Your Responsibility", body: "Everyone at FIDO Spark plays a role in maintaining compliance, from secure coding to reporting potential incidents.", icon: "👤", bgColor: "bg-gradient-to-br from-lime/60 to-aqua/40" }
    ],
    badge: "ISO Avenger",
    quiz: [
      {
        question: "What is ISO 27001 primarily concerned with?",
        options: ["Financial auditing standards", "Environmental protection policies", "Managing information security", "Software development lifecycle"],
        answer: "Managing information security"
      },
      {
        question: "Which of these is an example of a key security control under ISO guidelines?",
        options: ["Marketing campaign strategies", "Employee snack preferences", "Access control and data encryption", "Office layout design"],
        answer: "Access control and data encryption"
      }
    ]
  }
]; 