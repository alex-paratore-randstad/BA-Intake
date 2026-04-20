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
  {
    id: "change-existing",
    section: "Request Information",
    item: "Is the request for a change to the existing solution? (amended calculation, change to a table or chart, change of filters)",
    type: "Check",
    instruction: "If Yes, please enter details of the request in the Description section",
    warningTrigger: null
  },
  {
    id: "not-exist-client",
    section: "Request Information",
    item: "Is the request for something that does not currently exist in the client instance/enterprise navigator? (new measure/KPI, brand new card or page, new field to filter by)",
    type: "Check",
    instruction: "If Yes, please enter details of the request in the Description section",
    warningTrigger: null
  },
  {
    id: "system-change-territory",
    section: "Request Information",
    item: "Is there a change to system, a new territory or a new line of business being added?",
    type: "Check",
    instruction: "If Yes, please consult your line manager if implementation is needed",
    warningTrigger: null
  },
  {
    id: "prioritisation-matrix",
    section: "Request Information",
    item: "Prioritisation matrix completed",
    type: "Check",
    instruction: "If Yes, please enter score in Description",
    warningTrigger: null
  },
  {
    id: "client-name",
    section: "Request Information",
    item: "Client Name",
    type: "[Client Name]",
    instruction: "",
    warningTrigger: null
  },
  {
    id: "region",
    section: "Request Information",
    item: "Region",
    type: "Check",
    instruction: "",
    warningTrigger: null
  },
  {
    id: "solution-type",
    section: "Request Information",
    item: "Solution Type",
    type: "Check",
    instruction: "",
    warningTrigger: null
  },
  {
    id: "system-source",
    section: "Request Information",
    item: "System (e.g. Workday, FieldGlass, VNDLY etc)",
    type: "Beeline",
    instruction: "",
    warningTrigger: null
  },
  {
    id: "discovery-purpose",
    section: "I. Discovery & Existing Solutions",
    item: "Do you understand the business purpose of this request?",
    type: "Check",
    instruction: "If No, please request clarification",
    warningTrigger: "No"
  },
  {
    id: "asked-before",
    section: "I. Discovery & Existing Solutions",
    item: "Has this been asked for before/Does an existing solution exist in another program?",
    type: "Check",
    instruction: "(Leverage prior work and encourage consistency)",
    warningTrigger: null
  },
  {
    id: "feasibility-possible",
    section: "II. Feasibility Assessment",
    item: "Is the request feasible (do we have the necessary component parts)?",
    type: "Check",
    instruction: "Check if DE work is required",
    warningTrigger: "No"
  },
  {
    id: "not-feasible-fields",
    section: "II. Feasibility Assessment",
    item: "If Not Feasible: Is this due to missing fields?",
    type: "Check",
    instruction: "",
    warningTrigger: null
  },
  {
    id: "not-feasible-permanent",
    section: "II. Feasibility Assessment",
    item: "If Not Feasible: Are the fields permanently unavailable?",
    type: "Check",
    instruction: "If Yes, please inform the requestor and close the ticket",
    warningTrigger: "Yes"
  },
  {
    id: "new-custom-report",
    section: "II. Feasibility Assessment",
    item: "Does the request require a new custom report from source or a new field in report?",
    type: "Check",
    instruction: "If Yes, please list the fields and reports impacted. Global Functions - include comments if using blue consolidated",
    warningTrigger: null
  },
  {
    id: "new-source-system",
    section: "II. Feasibility Assessment",
    item: "Does the request involve a new source/system?",
    type: "Check",
    instruction: "If Yes - please consult your line manager",
    warningTrigger: null
  },
  {
    id: "pii-involved",
    section: "II. Feasibility Assessment",
    item: "Does the request involve Personal Information (PII)?",
    type: "Check",
    instruction: "If No, please move to next section",
    warningTrigger: null
  },
  {
    id: "pii-consent",
    section: "II. Feasibility Assessment",
    item: "If PII is involved: Do we have consent for PII ingestion?",
    type: "Check",
    instruction: "If No, all activity must cease until this is obtained",
    warningTrigger: "No"
  },
  {
    id: "sign-off",
    section: "V. Sign-off and Jira Tagging",
    item: "Scope Document Signed Off",
    type: "Check",
    instruction: "No work can begin until this step is confirmed",
    warningTrigger: "No"
  }
];

export const mockSubmissions = [
  {
    id: "TK-8821",
    client: "Starlight Industries",
    project: "Global Logistics Optimization",
    status: "In-Progress",
    date: "2023-10-24",
    analyst: "Elena Rodriguez"
  },
  {
    id: "TK-8794",
    client: "Internal IT Dept",
    project: "Customer Portal Migration",
    status: "Pending Review",
    date: "2023-10-22",
    analyst: "Elena Rodriguez"
  }
];
