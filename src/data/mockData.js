export const checklistSeed = [
  // Request Information
  { id: "ba-name", version: 1, section: "Request Information", item: "BA Name", type: "Text", instruction: "Please add your email to the Description section", warningTrigger: "None", isActive: true },
  { id: "ticket-num", version: 1, section: "Request Information", item: "Fresh Service Ticket Number", type: "Text", instruction: "All related Jira stories will be tagged with this number.", warningTrigger: "None", isActive: true },
  { id: "requestor", version: 1, section: "Request Information", item: "Requestor", type: "Text", instruction: "Name of person who raised the ticket", warningTrigger: "None", isActive: true },
  { id: "broken", version: 1, section: "Request Information", item: "Is the requestor advising that something is broken or incorrect?", type: "Checkbox", instruction: "If Yes, redirect to QA and flag incorrect assignment to manager.", warningTrigger: "Yes", isActive: true },
  { id: "change-existing", version: 1, section: "Request Information", item: "Is this a change to an existing solution?", type: "Checkbox", instruction: "Enter details (amended calculations/charts/filters) in Description.", warningTrigger: "Yes", isActive: true },
  { id: "new-solution", version: 1, section: "Request Information", item: "Is this a request for a new solution/KPI?", type: "Checkbox", instruction: "Enter details (new measure/card/page/field) in Description.", warningTrigger: "Yes", isActive: true },
  { id: "system-change", version: 1, section: "Request Information", item: "Is there a change to system or new territory/LOB?", type: "Checkbox", instruction: "Please consult your line manager if implementation is needed.", warningTrigger: "Yes", isActive: true },
  { id: "matrix", version: 1, section: "Request Information", item: "Prioritisation matrix completed", type: "Checkbox", instruction: "If Yes, please enter score in Description.", warningTrigger: "Yes", isActive: true },
  { id: "client-name", version: 1, section: "Request Information", item: "Client Name", type: "Dropdown", instruction: "Select the affected client.", warningTrigger: "None", isActive: true },
  { id: "region", version: 1, section: "Request Information", item: "Region", type: "Dropdown", instruction: "Select the affected region.", warningTrigger: "None", isActive: true },
  { id: "sol-type", version: 1, section: "Request Information", item: "Solution Type", type: "Dropdown", instruction: "Select the solution category.", warningTrigger: "None", isActive: true },
  { id: "source-sys", version: 1, section: "Request Information", item: "System (Workday/FieldGlass/VNDLY)", type: "Dropdown", instruction: "Select the source system.", warningTrigger: "None", isActive: true },
  
  // I. Discovery
  { id: "discovery-purpose", version: 1, section: "I. Discovery", item: "Do you understand the business purpose?", type: "Checkbox", instruction: "If No, please request clarification.", warningTrigger: "No", isActive: true },
  { id: "discovery-exists", version: 1, section: "I. Discovery", item: "Does an existing solution exist in another program?", type: "Checkbox", instruction: "Leverage prior work and encourage consistency.", warningTrigger: "None", isActive: true },
  
  // II. Feasibility
  { id: "feas-feasible", version: 1, section: "II. Feasibility", item: "Is the request feasible?", type: "Checkbox", instruction: "Check if DE work is required.", warningTrigger: "No", isActive: true },
  { id: "feas-missing", version: 1, section: "II. Feasibility", item: "Is lack of feasibility due to missing fields?", type: "Checkbox", instruction: "Identify if data is missing from source.", warningTrigger: "Yes", isActive: true },
  { id: "feas-unavailable", version: 1, section: "II. Feasibility", item: "Are fields permanently unavailable?", type: "Checkbox", instruction: "If Yes, inform requestor and close ticket.", warningTrigger: "Yes", isActive: true },
  { id: "feas-new-report", version: 1, section: "II. Feasibility", item: "Requires new custom report or new field?", type: "Checkbox", instruction: "List impacted fields and reports in Description.", warningTrigger: "Yes", isActive: true },
  { id: "feas-new-source", version: 1, section: "II. Feasibility", item: "Involves new source/system?", type: "Checkbox", instruction: "If Yes, please consult your line manager.", warningTrigger: "Yes", isActive: true },
  { id: "feas-report-details", version: 1, section: "II. Feasibility", item: "New Report Details Provided?", type: "Checkbox", instruction: "Include report name, ID, and date filters.", warningTrigger: "None", isActive: true },
  { id: "feas-load-type", version: 1, section: "II. Feasibility", item: "History Load vs Delta Load required?", type: "Dropdown", instruction: "If delta, include unique key and start date.", warningTrigger: "None", isActive: true },
  { id: "feas-history-req", version: 1, section: "II. Feasibility", item: "New Field History requirements?", type: "Text", instruction: "Specify date if full history is not required.", warningTrigger: "None", isActive: true },
  { id: "feas-dg-flag", version: 1, section: "II. Feasibility", item: "Flagged to Data Governance for classification?", type: "Checkbox", instruction: "Contact Data Governance with details as required.", warningTrigger: "No", isActive: true },
  { id: "feas-new-mst", version: 1, section: "II. Feasibility", item: "Requires new custom MST/dataset?", type: "Checkbox", instruction: "Update RRD and add field/date/join details to Description.", warningTrigger: "Yes", isActive: true },
  { id: "feas-calc-update", version: 1, section: "II. Feasibility", item: "New/updated calculation in dataset?", type: "Checkbox", instruction: "If Yes, complete Defining Specifics section.", warningTrigger: "Yes", isActive: true },
  { id: "feas-calc-no-logic", version: 1, section: "II. Feasibility", item: "Calculation achievable without new logic?", type: "Checkbox", instruction: "Explain desired output in the Description section.", warningTrigger: "Yes", isActive: true },
  { id: "feas-pii", version: 1, section: "II. Feasibility", item: "Involves Personal Information (PII)?", type: "Checkbox", instruction: "If Yes, ensure consent is obtained.", warningTrigger: "Yes", isActive: true },
  { id: "feas-pii-consent", version: 1, section: "II. Feasibility", item: "Consent for PII ingestion obtained?", type: "Checkbox", instruction: "If No, all activity must cease until obtained.", warningTrigger: "No", isActive: true },
  { id: "feas-rba", version: 1, section: "II. Feasibility", item: "Requires new or changed RBA?", type: "Checkbox", instruction: "If Yes, please contact Data Governance.", warningTrigger: "Yes", isActive: true },
  
  // III. Specifics
  { id: "spec-details", version: 1, section: "III. Specifics", item: "Calculation details defined?", type: "Checkbox", instruction: "List details in Description and include link to MST.", warningTrigger: "No", isActive: true },
  { id: "spec-exclusions", version: 1, section: "III. Specifics", item: "Exclusions/removals accounted for?", type: "Checkbox", instruction: "List details in Description Section.", warningTrigger: "No", isActive: true },
  { id: "spec-negatives", version: 1, section: "III. Specifics", item: "Negative/failed outcomes handled?", type: "Checkbox", instruction: "List details (nulls/less than zero) in Description.", warningTrigger: "No", isActive: true },
  { id: "spec-sla", version: 1, section: "III. Specifics", item: "Metric tied to contractual SLA?", type: "Checkbox", instruction: "Identify if legal penalties apply.", warningTrigger: "None", isActive: true },
  { id: "spec-peer-review", version: 1, section: "III. Specifics", item: "Logic peer-reviewed?", type: "Checkbox", instruction: "Add link to RRD in Description once reviewed.", warningTrigger: "No", isActive: true },
  
  // IV. Sizing
  { id: "sizing-multiple", version: 1, section: "IV. Sizing", item: "Impacts standards across multiple areas?", type: "Checkbox", instruction: "Consider if Product team needs to be involved.", warningTrigger: "Yes", isActive: true },
  { id: "sizing-cards", version: 1, section: "IV. Sizing", item: "Number of cards impacted", type: "Number", instruction: "List all required visuals in the Description section.", warningTrigger: "None", isActive: true },
  
  // V. Sign-off
  { id: "sign-off", version: 1, section: "V. Sign-off", item: "Scope Document Signed Off", type: "Checkbox", instruction: "No work can begin until this step is confirmed.", warningTrigger: "No", isActive: true }
];

export const initialForms = [
  {
    id: "std-intake",
    name: "Standard BA Intake",
    description: "Standard business analysis intake checklist for all new requests.",
    questions: checklistSeed.map(q => ({ id: q.id, version: q.version }))
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
