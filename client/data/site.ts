import { PROJECT_SECTORS } from "@shared/cms";

export const company = {
  name: "T&W QUANTUS LTD",
  shortName: "T&W Quantus",
  slogan: "Building Excellence, Delivering Trust",
  industry: "Construction & Project Management",
  location: "Gasabo, Kigali, Rwanda",
  registeredAddress: "Gasabo, Kigali, Rwanda",
  phone: "+250 780 410 570",
  phoneHref: "tel:+250780410570",
  /** Chat on WhatsApp (same number, international format without +). */
  whatsappHref: "https://wa.me/250780410570",
  email: "twquantus2025@gmail.com",
  emailHref: "mailto:twquantus2025@gmail.com",
  /** Set public profile URLs; empty string falls back to the contact page in the footer. */
  social: {
    linkedin: "",
    facebook: "",
    instagram: "",
    x: "",
  },
  registrationDate: "21 July 2025",
  amendmentDate: "28 April 2026",
  managingDirector: "Isaac UWUMUREMYI",
  logo: "/assets/tw-quantus-logo.webp",
};

export const navigation = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Who We Are", href: "/about#who-we-are" },
      { label: "Collaborate With Us", href: "/about#collaborate" },
      { label: "Vision & Mission", href: "/about#vision-mission" },
      { label: "Core Values", href: "/about#core-values" },
    ],
  },
  {
    label: "Services & Sectors",
    href: "/services",
    children: [
      { label: "Services Overview", href: "/services#services-overview" },
      { label: "Cost Management", href: "/services/quantity-surveying-cost-management" },
      { label: "Construction Management", href: "/services/construction-management" },
      { label: "Project Management", href: "/services/project-management" },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "Delivery Areas", href: "/projects#delivery-areas" },
      { label: "Residential Buildings", href: "/projects#residential-buildings" },
      { label: "Renovations & Repairs", href: "/projects#renovations-and-repairs" },
      { label: "Registered Activities", href: "/projects#registered-activities" },
    ],
  },
  {
    label: "Perspectives & News",
    href: "/perspectives",
    children: [
      { label: "Cost Certainty", href: "/perspectives/cost-certainty" },
      { label: "Tender Documentation", href: "/perspectives/tender-documentation" },
      { label: "Site Coordination", href: "/perspectives/site-coordination" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Request Consultation", href: "/contact#request-consultation" },
      { label: "FAQs", href: "/contact#faqs" },
      { label: "Email T&W Quantus", href: "mailto:twquantus2025@gmail.com" },
    ],
  },
];

export const services = [
  {
    number: "01",
    slug: "quantity-surveying-cost-management",
    title: "Quantity Surveying & Cost Management",
    pageTitle: "Cost certainty and value across the construction life-cycle.",
    pageIntro:
      "Our Quantity Surveying & Cost Management services provide rigorous financial oversight to maximize value and ensure cost certainty throughout the construction life-cycle. With deep expertise in cost control and contractual compliance, we empower clients to make informed decisions at every project stage.",
    summary:
      "With deep expertise in cost control and contractual compliance, we empower clients to make informed decisions at every project stage.",
    highlights: [
      "Cost Estimating & Feasibility Study",
      "Cost Planning & Value Management",
      "Tender Documentation & Process Management",
      "Contract Administration",
      "Final Account & Reconciliation",
    ],
    detailGroups: [
      {
        title: "Cost Estimating & Feasibility Study",
        items: [
          "Preliminary cost advice",
          "Feasibility cost assessments",
          "Budget and budget monitoring",
        ],
      },
      {
        title: "Cost Planning & Value Management",
        items: [
          "Detailed cost planning and control",
          "Life-cycle costing",
          "Value engineering for cost optimization",
        ],
      },
      {
        title: "Tender Documentation & Process Management",
        items: [
          "Bills of Quantities (BOQ) preparation",
          "Tender specifications and bid documentation",
          "Bid evaluation and contractor selection",
        ],
      },
      {
        title: "Contract Administration",
        items: [
          "Contract drafting and negotiation",
          "Compliance with FIDIC, RPPA, JCT, NEC standards",
          "Advice on procurement models (Traditional, D&B, EPC)",
        ],
      },
      {
        title: "Final Account & Reconciliation",
        items: [
          "Verification of contractor claims and work completed",
          "Assessment of variations and any adjustments",
          "Preparation of the final payment statement",
          "Reconciliation of all payments and deductions",
          "Issuance of final account certificate and closure documentation",
        ],
      },
    ],
  },
  {
    number: "02",
    slug: "construction-management",
    title: "Construction Management Services",
    pageTitle: "Structured execution, site leadership, and operational control.",
    pageIntro:
      "Through our Construction Management Services, we bring structured execution, site leadership, and operational control to every project. T&W Quantus oversees all site activities, coordinates subcontractors and trades, monitors progress, and enforces stringent quality and safety standards.",
    summary:
      "T&W Quantus oversees all site activities, coordinates subcontractors and trades, monitors progress, and enforces stringent quality and safety standards.",
    highlights: [
      "Site Mobilization & Supervision",
      "Construction Program & Scheduling",
      "Risk, Quality & Compliance Management",
      "Cost Control during Execution",
      "Cost & Schedule Control",
      "Quality & Compliance Control",
      "Technical Support & Issue Resolution",
      "Handover & Post-Construction Review",
    ],
    detailGroups: [
      {
        title: "Site Mobilization & Supervision",
        items: ["Contractor on-boarding and mobilization", "Subcontractor coordination", "Daily site oversight"],
      },
      {
        title: "Construction Program & Scheduling",
        items: ["Execution timeline tracking", "Progress monitoring and milestone checks", "Integration of suppliers and trades"],
      },
      {
        title: "Risk, Quality & Compliance Management",
        items: ["Risk identification and mitigation planning", "Quality assurance and compliance oversight", "HSE (Health, Safety, and Environment) and statutory regulation monitoring"],
      },
      {
        title: "Cost Control during Execution",
        items: ["Interim valuations and financial reporting", "Cost tracking and variation management", "Final account preparation and reconciliation"],
      },
      {
        title: "Cost & Schedule Control",
        items: ["Budget tracking and financial reporting", "Milestone planning and construction program scheduling", "Cash flow forecasting and resource alignment"],
      },
      {
        title: "Quality & Compliance Control",
        items: ["On-site quality assurance inspections", "Health, Safety & Environmental (HSE) compliance", "Testing and material standards verification"],
      },
      {
        title: "Technical Support & Issue Resolution",
        items: ["Handling design changes and RFIs", "Resolving site technical issues", "Monitoring workmanship and standards"],
      },
      {
        title: "Handover & Post-Construction Review",
        items: ["Snag list management", "Client support during defects liability period"],
      },
    ],
  },
  {
    number: "03",
    slug: "project-management",
    title: "Project Management Services",
    pageTitle: "Strategic leadership and structured control on every project.",
    pageIntro:
      "At T&W QUANTUS, our Project Management Services provide clients with strategic leadership and structured control across every phase of a construction project. We guide projects from initial concept to successful completion, ensuring they are delivered on time, within budget, and to the highest quality standards.",
    summary:
      "We guide projects from initial concept to successful completion, ensuring they are delivered on time, within budget, and to the highest quality standards.",
    highlights: [
      "Project Initiation & Feasibility",
      "Design & Consultant Coordination",
      "Procurement & Contract Planning",
      "Stakeholder Management & Project Close-Out",
    ],
    detailGroups: [
      {
        title: "Project Initiation & Feasibility",
        items: ["Feasibility studies", "Early-stage planning", "Development strategy and project definition"],
      },
      {
        title: "Design & Consultant Coordination",
        items: ["Design team leadership and coordination", "Technical consultant management", "Scope definition and planning integration"],
      },
      {
        title: "Procurement & Contract Planning",
        items: ["Procurement strategy formulation", "Contract packaging and procurement scheduling"],
      },
      {
        title: "Stakeholder Management & Project Close-Out",
        items: ["Client and stakeholder engagement", "Change management and claims resolution", "Final handover, commissioning, and project close-out"],
      },
    ],
  },
];

export const values = [
  {
    title: "Integrity",
    description: "Transparent, honest, and ethical business practices across every engagement.",
  },
  {
    title: "Excellence",
    description: "A commitment to superior quality in planning, management, execution, and handover.",
  },
  {
    title: "Innovation",
    description: "Practical, modern solutions that respond to changing client and project needs.",
  },
  {
    title: "Collaboration",
    description: "Strong partnerships with clients, consultants, contractors, and stakeholders.",
  },
  {
    title: "Sustainability",
    description: "Environmentally responsible construction thinking and resource-conscious delivery.",
  },
  {
    title: "Client-Centered Service",
    description: "Clear communication and tailored solutions designed around each project's priorities.",
  },
];

export const benefits = [
  "Expertise and precision",
  "Timely completion",
  "Cost-efficient solutions",
  "Tailored delivery",
  "Sustainable practices",
  "Transparent client communication",
];

export const projectTypes = [...PROJECT_SECTORS];

export const businessActivities = [
  {
    title: "Activities of quantity surveyors",
    description: "Main registered business activity covering measurement, cost evaluation, BOQs, tender support, and cost control.",
  },
  {
    title: "Building project development",
    description: "Development of building projects for own operation and advisory support across project stages.",
  },
  {
    title: "Construction materials",
    description: "Wholesale and retail support for sand, gravel, bricks, wood, sanitary equipment, and other building materials.",
  },
  {
    title: "Finishes and fit-out works",
    description: "Painting, plastering, tiling, floor coverings, interior and exterior finishes, and renovation-related works.",
  },
  {
    title: "Technical installations",
    description: "Installation support for elevators, automated doors, lightning conductors, insulation, and related building systems.",
  },
  {
    title: "Community and repair works",
    description: "Low-cost housing repair partnerships, repair work, and selected mechanical or electronic locking device services.",
  },
];

export const perspectives = [
  {
    slug: "cost-certainty",
    title: "Cost certainty from feasibility to final account",
    category: "Cost Management",
    date: "01 May 2026",
    visual: "service-visual-1",
    summary:
      "How early estimates, BOQs, tender reviews, variation control, and final account discipline protect project value.",
    intro:
      "Reliable cost information gives clients confidence before design decisions become expensive, before tenders are issued, and before construction changes affect the approved budget.",
    sections: [
      {
        title: "Early Cost Definition",
        body: "Preliminary cost advice and feasibility assessments help define whether a project can move forward with realistic budget limits and clear financial assumptions.",
      },
      {
        title: "Budget Monitoring",
        body: "Cost plans, budget reporting, life-cycle costing, and value engineering keep decisions connected to the client's priorities throughout design and execution.",
      },
      {
        title: "Final Account Control",
        body: "Variation assessment, claims review, payment verification, and final reconciliation help close the project with transparency and fewer surprises.",
      },
    ],
  },
  {
    slug: "tender-documentation",
    title: "Tender documentation that keeps procurement transparent",
    category: "Tendering",
    date: "28 Apr 2026",
    visual: "service-visual-2",
    summary:
      "Why BOQs, specifications, bid documentation, evaluation, and procurement strategy reduce uncertainty before contractor appointment.",
    intro:
      "Tendering is more than price comparison. Strong documentation clarifies scope, defines quality, supports fair evaluation, and helps clients select teams that can deliver.",
    sections: [
      {
        title: "BOQ Preparation",
        body: "Bills of Quantities create a shared measurement basis so bidders price comparable scope and clients can review submissions with confidence.",
      },
      {
        title: "Bid Evaluation",
        body: "Technical capacity, commercial risk, past performance, program, and methodology should be considered alongside the tender sum.",
      },
      {
        title: "Procurement Route",
        body: "Traditional, design-and-build, EPC, and other procurement models must be selected around the client's budget, risk profile, and delivery priorities.",
      },
    ],
  },
  {
    slug: "site-coordination",
    title: "Site coordination for safer and clearer project delivery",
    category: "Construction Management",
    date: "24 Apr 2026",
    visual: "service-visual-3",
    summary:
      "Daily supervision, subcontractor coordination, HSE monitoring, quality assurance, and issue resolution keep construction moving.",
    intro:
      "Construction delivery depends on consistent coordination between client objectives, design intent, contractor progress, suppliers, trades, and site realities.",
    sections: [
      {
        title: "Daily Site Oversight",
        body: "Mobilization, site supervision, trade coordination, and progress monitoring help identify issues early and keep work aligned with the program.",
      },
      {
        title: "Quality & HSE",
        body: "Inspection routines, testing, material standards verification, and health, safety, and environmental monitoring protect people and project outcomes.",
      },
      {
        title: "Handover Discipline",
        body: "Snag management, defects liability support, and close-out documentation ensure the transition from construction to use is controlled and accountable.",
      },
    ],
  },
];

export const stats = [
  { value: "2025", label: "Registered in Rwanda" },
  { value: "4", label: "Core service pillars" },
  { value: "East Africa", label: "Regional delivery focus" },
];
