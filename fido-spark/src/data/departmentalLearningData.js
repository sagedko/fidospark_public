export const departmentalLearningData = {
  "Technology": [
    { 
      id: "tech_d1", 
      title: "Tech Department: Core Responsibilities", 
      content: "Developing and maintaining FIDO_s software platforms, ensuring system reliability, cybersecurity, and exploring new technologies to enhance our services." 
    },
    { 
      id: "tech_d2", 
      title: "Key Technologies at FIDO", 
      content: "We primarily use React for frontend, Node.js for backend services, and manage our infrastructure on AWS. Familiarity with these is key."
    },
    { 
      id: "tech_d3", 
      title: "Agile & DevOps Practices", 
      content: "Our teams follow Agile methodologies (Scrum/Kanban) and embrace DevOps culture for continuous integration and delivery."
    }
  ],
  "Marketing": [
    { 
      id: "mktg_d1", 
      title: "Marketing Department: Goals", 
      content: "Driving brand awareness, acquiring new customers, managing FIDO_s public image, and creating engaging campaigns across various channels." 
    },
    { 
      id: "mktg_d2", 
      title: "Understanding Our Target Audience", 
      content: "Our primary audience includes young professionals and small business owners across Sub-Saharan Africa seeking accessible financial solutions."
    },
    { 
      id: "mktg_d3", 
      title: "Key Marketing Channels", 
      content: "We leverage digital marketing (social media, SEO, content), partnerships, and community engagement to reach our audience."
    }
  ],
  "Customer Support": [
    { 
      id: "cs_d1", 
      title: "CS Department: Mission", 
      content: "To provide exceptional support to FIDO users, resolve issues promptly, gather feedback for product improvement, and ensure customer satisfaction." 
    },
    { 
      id: "cs_d2", 
      title: "Core Support Tools", 
      content: "We use Zendesk for ticketing, Intercom for live chat, and an internal knowledge base for quick resolutions."
    },
    { 
      id: "cs_d3", 
      title: "Escalation Procedures", 
      content: "Understanding the L1/L2/L3 support tiers and when to escalate complex issues to ensure timely resolution is crucial."
    }
  ],
  "Credit": [
    { 
      id: "credit_d1", 
      title: "Credit Department: Overview", 
      content: "Assessing creditworthiness, managing loan portfolios, developing lending policies, and minimizing credit risk for FIDO."
    },
    { 
      id: "credit_d2", 
      title: "Loan Origination Process", 
      content: "From application intake, through underwriting and approval, to disbursement – understanding each step is vital."
    },
    { 
      id: "credit_d3", 
      title: "Risk Management Principles", 
      content: "Key principles include the 5 Cs of Credit (Character, Capacity, Capital, Collateral, Conditions) and adherence to regulatory compliance."
    }
  ]
  // Add more departments and their specific learning cards as needed
};

export const availableDepartments = Object.keys(departmentalLearningData); 