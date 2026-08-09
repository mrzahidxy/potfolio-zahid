export type PortfolioContext = {
  profile: {
    name: string;
    role: string;
    headline: string;
    location: string;
    availability: string;
    summary: string;
    about: {
      title: string;
      description: string[];
    };
  };
  skills: {
    frontend: string[];
    backend: string[];
    databases: string[];
    tools: string[];
  };
  experience: PortfolioExperience[];
  projects: PortfolioProject[];
  services: string[];
  contact: {
    email: string;
    phone: string;
    location: string;
    profiles: {
      linkedin: string;
      github: string;
    };
    quickLinks: string[];
  };
  portfolio: {
    url: string;
    sections: string[];
    primaryCta: string;
    secondaryCta: string;
  };
};

export type PortfolioExperience = {
  title: string;
  company: string;
  location: string;
  type?: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
};

export type PortfolioProject = {
  name: string;
  description: string;
  technologies: string[];
  links: {
    project: string | null;
    code: string | null;
  };
};

export const portfolioContext: PortfolioContext = {
  profile: {
    name: "Md. Zahid Hasan",
    role: "Full-Stack Software Engineer",
    headline:
      "I build dependable web products for teams, products, and independent clients.",
    location: "Dhaka, Bangladesh",
    availability: "Available for work and collaboration",
    summary:
      "Md. Zahid Hasan builds thoughtful web products and internal tools with a focus on clean interfaces, dependable integration, and maintainable implementation.",
    about: {
      title: "A Bit More Context",
      description: [
        "Zahid works across customer-facing products, admin panels, and internal tools that need to be clear, dependable, and useful in day-to-day work.",
        "His work usually covers both product thinking and implementation, from interface decisions and API integration to the practical details required to ship responsibly.",
        "Whether contributing to a team or handling a focused engagement independently, he likes to stay close to user outcomes, sensible tradeoffs, and code that stays maintainable as the product grows.",
      ],
    },
  },

  skills: {
    frontend: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Redux Toolkit",
      "React Query",
    ],
    backend: ["Node.js", "Express.js", "Python", "FastAPI", "REST API"],
    databases: ["PostgreSQL", "MongoDB", "Prisma", "Mongoose"],
    tools: [
      "GitHub Actions",
      "CI/CD",
      "Vercel",
      "Docker",
      "Figma",
      "Supabase",
      "Cloudinary",
      "Postman",
    ],
  },

  experience: [
    {
      title: "Intermediate Software Engineer",
      company: "Bizznect Ltd.",
      location: "Dhaka, Bangladesh",
      type: "Current",
      startDate: "July 2025",
      endDate: "Present",
      summary:
        "Building frontend for a restaurant portal app and working on an ad monitoring platform, covering order flow, admin tooling, and everyday usability.",
      highlights: [
        "Built SaaS-level dashboards for order status, kitchen workflow, and operational visibility.",
        "Improved menu, inventory, and fulfillment workflows for internal teams.",
        "Improved responsiveness and load times across the product.",
      ],
    },
    {
      title: "Software Engineer",
      company: "TechnoNext",
      location: "Dhaka, Bangladesh",
      startDate: "January 2025",
      endDate: "June 2025",
      summary:
        "Built order, admin, and customer service interfaces, including live communication and workflow-heavy internal features.",
      highlights: [
        "Implemented WebSocket-based chat and notifications alongside secure gateway integrations.",
        "Improved image upload handling and fixed backend workflow issues for internal teams.",
        "Worked with design, QA, and backend teams to ship production releases.",
      ],
    },
    {
      title: "Junior Software Engineer",
      company: "TechnoNext",
      location: "Dhaka, Bangladesh",
      startDate: "May 2022",
      endDate: "December 2024",
      summary:
        "Maintained core sales, admin, and support products with a focus on frontend structure, speed, and everyday usability.",
      highlights: [
        "Improved performance with SSR, code-splitting, and lazy loading across core interfaces.",
        "Built data features with WebSockets and integrated secure service gateways.",
        "Handled API integrations and bug fixes for active production applications.",
      ],
    },
    {
      title: "Junior Frontend Developer",
      company: "Infinitive Limited",
      location: "Dhaka, Bangladesh",
      startDate: "June 2022",
      endDate: "October 2022",
      summary:
        "Contributed frontend features and API integrations for production web platforms across different business domains.",
      highlights: [
        "Improved responsiveness and cross-browser behavior for SaaS/customer B2B sites.",
        "Built frontend components and REST API integrations for the Payra Port Water Management project.",
      ],
    },
  ],

  projects: [
    {
      name: "Ecommerce Site",
      description:
        "Full-stack ecommerce platform built for real catalogs, checkout, payment, and invoice workflows rather than a static storefront.",
      technologies: ["Next.js", "Express.js", "PostgreSQL"],
      links: {
        project: null,
        code: null,
      },
    },
    {
      name: "Chat App",
      description:
        "Real-time messaging product built around authentication, instant communication, and a clean interface for everyday conversation.",
      technologies: ["React.js", "Firebase"],
      links: {
        project: null,
        code: null,
      },
    },
    {
      name: "Book Inn",
      description:
        "Booking platform for hotels and restaurants with authentication, role-based access, inventory handling, and payment-ready reservation flows.",
      technologies: [
        "React.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "Prisma",
      ],
      links: {
        project: null,
        code: null,
      },
    },
  ],

  services: [
    "Open to product roles",
    "Freelance work",
    "Focused builds that need thoughtful execution",
    "Frontend development",
    "Full-stack web development",
    "API integration",
    "Internal tools",
    "SaaS-style product development",
  ],

  contact: {
    email: "mrzahidxy@gmail.com",
    phone: "+8801405232258",
    location: "Dhaka, Bangladesh",
    profiles: {
      linkedin: "https://www.linkedin.com/in/mrzahidxy/",
      github: "https://github.com/mrzahidxy/",
    },
    quickLinks: ["Email Me", "LinkedIn", "GitHub"],
  },

  portfolio: {
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL || process.env.NEXT_PUBLIC_SITE_URL || "",
    sections: ["Intro", "About", "Experience", "Projects", "Contact"],
    primaryCta: "See selected work",
    secondaryCta: "Get in touch",
  },
};
