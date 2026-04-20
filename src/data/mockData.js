// Question structure with versioning and soft-delete
export const checklistSeed = [
  {
    id: "ba-name",
    version: 1,
    section: "BA Name",
    item: "BA Name",
    type: "Input Required",
    instruction: "Please add your email to the Description section",
    warningTrigger: null,
    isActive: true
  },
  {
    id: "fs-ticket",
    version: 1,
    section: "Request Information",
    item: "Fresh Service Ticket Number",
    type: "Input Required",
    instruction: "All related Jira stories will be tagged with this number.",
    warningTrigger: null,
    isActive: true
  },
  {
    id: "requestor",
    version: 1,
    section: "Request Information",
    item: "Requestor",
    type: "Input Required",
    instruction: "Name of person who raised the ticket",
    warningTrigger: null,
    isActive: true
  },
  {
    id: "something-broken",
    version: 1,
    section: "Request Information",
    item: "Is the requestor advising that something is broken or incorrect?",
    type: "Check",
    instruction: "If Yes, this ticket should have been auto routed to QA, please redirect the ticket and flag the incorrect assignment to your manager",
    warningTrigger: "Yes",
    isActive: true
  }
];

// Forms store specific question versions {id, version}
export const initialForms = [
  {
    id: "std-intake",
    name: "Standard BA Intake",
    description: "Standard business analysis intake checklist for all new requests.",
    questions: [
      { id: "ba-name", version: 1 },
      { id: "fs-ticket", version: 1 },
      { id: "requestor", version: 1 },
      { id: "something-broken", version: 1 }
    ]
  }
];

export const mockSubmissions = [
  {
    id: "TK-8821",
    client: "Starlight Industries",
    project: "Global Logistics Optimization",
    status: "In-Progress",
    date: "24 April 2026",
    analyst: "Elena Rodriguez"
  }
];
