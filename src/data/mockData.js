export const checklistSeed = [
  {
    id: "ba-name",
    section: "BA Name",
    item: "BA Name",
    type: "Input Required",
    instruction: "Please add your email to the Description section",
    warningTrigger: null
  },
  {
    id: "fs-ticket",
    section: "Request Information",
    item: "Fresh Service Ticket Number",
    type: "Input Required",
    instruction: "All related Jira stories will be tagged with this number.",
    warningTrigger: null
  },
  {
    id: "requestor",
    section: "Request Information",
    item: "Requestor",
    type: "Input Required",
    instruction: "Name of person who raised the ticket",
    warningTrigger: null
  },
  {
    id: "something-broken",
    section: "Request Information",
    item: "Is the requestor advising that something is broken or incorrect?",
    type: "Check",
    instruction: "If Yes, this ticket should have been auto routed to QA, please redirect the ticket and flag the incorrect assignment to your manager",
    warningTrigger: "Yes"
  },
  // ... more questions can be added here
];

export const initialForms = [
  {
    id: "std-intake",
    name: "Standard BA Intake",
    description: "Standard business analysis intake checklist for all new requests.",
    questionIds: ["ba-name", "fs-ticket", "requestor", "something-broken"]
  }
];

export const mockSubmissions = [
  {
    id: "TK-8821",
    client: "Starlight Industries",
    project: "Global Logistics Optimization",
    status: "In-Progress",
    date: "24 Apr 2026",
    analyst: "Elena Rodriguez"
  }
];
