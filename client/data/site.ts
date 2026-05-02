import { PROJECT_SECTORS } from "@shared/cms";

export const company = {
  name: "T&W QUANTUS LTD",
  shortName: "T&W Quantus",
  slogan: "Building Excellence, Delivering Trust",
  industry: "Construction & Project Management",
  location: "Gasabo, Kigali, Rwanda",
  registeredAddress: "Rukurazo, Kibagabaga, Kimironko, Gasabo, Kigali, Rwanda",
  phone: "+250 780 410 570",
  phoneHref: "tel:+250780410570",
  email: "twquantus2025@gmail.com",
  emailHref: "mailto:twquantus2025@gmail.com",
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
      { label: "Vision & Mission", href: "/about#vision-mission" },
      { label: "Core Values", href: "/about#core-values" },
      { label: "Registration", href: "/about#registration" },
    ],
  },
  {
    label: "Services & Sectors",
    href: "/services",
    children: [
      { label: "Services Overview", href: "/services#services-overview" },
      { label: "Cost Management", href: "/services/quantity-surveying-cost-management" },
      { label: "Project Management", href: "/services/project-management" },
      { label: "Construction Management", href: "/services/construction-management" },
      { label: "Technical Services", href: "/services/turnkey-construction-technical-services" },
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
    pageTitle: "Cost certainty from feasibility to final account.",
    pageIntro:
      "Clients need reliable project cost data for budgeting, tendering, controlling expenditure, and closing contracts with confidence.",
    summary:
      "Rigorous financial oversight that helps clients protect budgets, improve value, and make informed decisions at every project stage.",
    highlights: [
      "Cost estimating and feasibility studies",
      "Budget monitoring and cost planning",
      "Bills of Quantities and tender documentation",
      "Value engineering and life-cycle costing",
      "Final accounts, claims review, and reconciliation",
    ],
    detailGroups: [
      {
        title: "Cost Estimating & Feasibility Study",
        items: ["Preliminary cost advice", "Feasibility cost assessments", "Budget and budget monitoring"],
      },
      {
        title: "Cost Planning & Value Management",
        items: ["Detailed cost planning and control", "Life-cycle costing", "Value engineering for cost optimization"],
      },
      {
        title: "Tender Documentation & Process Management",
        items: ["BOQ preparation", "Tender specifications and bid documentation", "Bid evaluation and contractor selection"],
      },
      {
        title: "Contract Administration & Final Account",
        items: [
          "Contract drafting and negotiation",
          "FIDIC, RPPA, JCT, and NEC compliance advice",
          "Variation assessment, claims review, final payment statements, and reconciliation",
        ],
      },
    ],
  },
  {
    number: "02",
    slug: "project-management",
    title: "Project Management",
    pageTitle: "Structured leadership from concept to successful completion.",
    pageIntro:
      "We guide clients through feasibility, design coordination, procurement, stakeholder alignment, delivery control, commissioning, and close-out.",
    summary:
      "Structured leadership from early concept through close-out, aligning design, procurement, stakeholders, time, quality, and cost.",
    highlights: [
      "Project initiation and feasibility",
      "Design and consultant coordination",
      "Procurement strategy and contract packaging",
      "Stakeholder engagement and change control",
      "Commissioning, handover, and project close-out",
    ],
    detailGroups: [
      {
        title: "Project Initiation & Feasibility",
        items: ["Feasibility studies", "Early-stage planning", "Development strategy and project definition"],
      },
      {
        title: "Design & Consultant Coordination",
        items: ["Design team leadership", "Technical consultant management", "Scope definition and planning integration"],
      },
      {
        title: "Procurement & Contract Planning",
        items: ["Procurement strategy formulation", "Contract packaging", "Procurement scheduling"],
      },
      {
        title: "Stakeholder Management & Close-Out",
        items: ["Client and stakeholder engagement", "Change management and claims resolution", "Final handover and commissioning"],
      },
    ],
  },
  {
    number: "03",
    slug: "construction-management",
    title: "Construction Management",
    pageTitle: "Site leadership, program control, and safer construction execution.",
    pageIntro:
      "Our construction management support brings daily site oversight, trade coordination, quality control, HSE monitoring, and handover discipline.",
    summary:
      "Hands-on site coordination and delivery control for safer, clearer, and better managed construction execution.",
    highlights: [
      "Site mobilization and daily supervision",
      "Subcontractor and trade coordination",
      "Construction program and milestone tracking",
      "Quality assurance and HSE compliance",
      "Technical issue resolution and snag management",
    ],
    detailGroups: [
      {
        title: "Site Mobilization & Supervision",
        items: ["Contractor onboarding and mobilization", "Subcontractor coordination", "Daily site oversight"],
      },
      {
        title: "Program, Cost & Schedule Control",
        items: ["Execution timeline tracking", "Milestone planning", "Cash-flow forecasting and resource alignment"],
      },
      {
        title: "Risk, Quality & Compliance Management",
        items: ["Risk mitigation planning", "Quality assurance inspections", "HSE and statutory regulation monitoring"],
      },
      {
        title: "Technical Support & Handover",
        items: ["Design change and RFI resolution", "Workmanship monitoring", "Snag list and defects liability support"],
      },
    ],
  },
  {
    number: "04",
    slug: "turnkey-construction-technical-services",
    title: "Turnkey Construction & Technical Services",
    pageTitle: "One accountable delivery partner for technical and turnkey works.",
    pageIntro:
      "We integrate construction execution, architectural drawing support, civil and structural works, MEP installations, renovations, repairs, and selected material supply.",
    summary:
      "End-to-end delivery for residential, commercial, and institutional developments with one accountable delivery partner.",
    highlights: [
      "General building construction",
      "Architectural drawing support",
      "Civil and structural works execution",
      "Electrical and mechanical installations",
      "Minor works, renovations, repairs, and material supply",
    ],
    detailGroups: [
      {
        title: "Construction Execution",
        items: ["Residential building construction", "Commercial developments", "Institutional developments"],
      },
      {
        title: "Technical Design & Works",
        items: ["Architectural drawing", "Civil and structural works", "Electrical and mechanical installations"],
      },
      {
        title: "Renovations & Repairs",
        items: ["Minor works", "Renovations", "Repair works and fit-out improvements"],
      },
      {
        title: "Material Supply & Installation",
        items: ["Tiles and fixtures", "Finishes and piping", "Roofing and selected construction materials"],
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
