import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Organisations (multi-tenant synthetic)
export const organisations = pgTable("organisations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  region: text("region").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const businessUnits = pgTable("business_units", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
});

// Assets (data assets)
export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  unitId: text("unit_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Database, File share, etc
  domain: text("domain").notNull(), // Customer, Employee, Finance, etc
  classification: text("classification").notNull(), // Public, Internal, Confidential, Restricted, Highly Sensitive
  containsPersonal: boolean("contains_personal").default(false).notNull(),
  containsSpecialCategory: boolean("contains_special_category").default(false).notNull(),
  repository: text("repository").notNull(),
  owner: text("owner").notNull(),
  custodian: text("custodian"),
  retentionRule: text("retention_rule"),
  reviewStatus: text("review_status").notNull(), // Confirmed, Awaiting Review, Draft
  riskLevel: text("risk_level").notNull(), // Critical, High, Medium, Low
  lastReviewed: timestamp("last_reviewed"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discovery items (candidates from scans)
export const discoveryItems = pgTable("discovery_items", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  source: text("source").notNull(),
  location: text("location").notNull(),
  proposedName: text("proposed_name").notNull(),
  candidateClassification: text("candidate_classification").notNull(),
  detectionBasis: text("detection_basis").notNull(),
  confidence: integer("confidence").notNull(),
  state: text("state").notNull(), // New, In Review, Confirmed, False Positive
  reviewer: text("reviewer"),
  detectedCategories: jsonb("detected_categories").$type<string[]>().notNull(),
  linkedAssetId: text("linked_asset_id"),
  runDate: timestamp("run_date").defaultNow().notNull(),
});

// Applications / Systems
export const systems = pgTable("systems", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // SaaS, Internal, Cloud, etc
  unitId: text("unit_id").notNull(),
  businessOwner: text("business_owner").notNull(),
  technicalOwner: text("technical_owner").notNull(),
  deployment: text("deployment").notNull(),
});

// Data Flows
export const dataFlows = pgTable("data_flows", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  sourceAssetId: text("source_asset_id"),
  sourceSystem: text("source_system"),
  destinationAssetId: text("destination_asset_id"),
  destinationSystem: text("destination_system"),
  destinationType: text("destination_type").notNull(), // Internal, External, AI Processor
  dataCategories: jsonb("data_categories").$type<string[]>().notNull(),
  businessPurpose: text("business_purpose").notNull(),
  transferMethod: text("transfer_method").notNull(),
  jurisdictions: jsonb("jurisdictions").$type<string[]>().notNull(),
  classification: text("classification").notNull(),
  approvalStatus: text("approval_status").notNull(),
  lastReviewed: timestamp("last_reviewed"),
  vendorId: text("vendor_id"),
  aiSystemId: text("ai_system_id"),
});

// Processing Activities
export const processingActivities = pgTable("processing_activities", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  businessPurpose: text("business_purpose").notNull(),
  unitId: text("unit_id").notNull(),
  controller: text("controller").notNull(),
  dataCategories: jsonb("data_categories").$type<string[]>().notNull(),
  categoriesOfIndividuals: jsonb("categories_of_individuals").$type<string[]>().notNull(),
  sourceAssetIds: jsonb("source_asset_ids").$type<string[]>().notNull(),
  recipients: jsonb("recipients").$type<string[]>().notNull(),
  processors: jsonb("processors").$type<string[]>().notNull(),
  jurisdictions: jsonb("jurisdictions").$type<string[]>().notNull(),
  retentionRule: text("retention_rule").notNull(),
  lawfulBasis: text("lawful_basis").notNull(),
  crossBorderTransfer: boolean("cross_border_transfer").default(false).notNull(),
  riskAssessmentId: text("risk_assessment_id"),
  controls: jsonb("controls").$type<string[]>().notNull(),
  owner: text("owner").notNull(),
  lastReviewed: timestamp("last_reviewed"),
});

// AI Systems
export const aiSystems = pgTable("ai_systems", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  businessPurpose: text("business_purpose").notNull(),
  unitId: text("unit_id").notNull(),
  businessOwner: text("business_owner").notNull(),
  technicalOwner: text("technical_owner").notNull(),
  riskTier: text("risk_tier").notNull(), // Critical, High, Medium, Low
  deployment: text("deployment").notNull(),
  modelProvider: text("model_provider").notNull(),
  modelFamily: text("model_family").notNull(),
  dataClasses: jsonb("data_classes").$type<string[]>().notNull(),
  connectedAssets: jsonb("connected_assets").$type<string[]>().notNull(),
  externalProcessing: boolean("external_processing").default(false).notNull(),
  assessmentStatus: text("assessment_status").notNull(),
  approvalStatus: text("approval_status").notNull(), // Proposed, Under Assessment, Approved w/Conditions, Approved, Restricted, Rejected, Retired
  lastReview: timestamp("last_review"),
  description: text("description"),
  approvalConditions: text("approval_conditions"),
});

// Vendors
export const vendors = pgTable("vendors", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  serviceType: text("service_type").notNull(),
  dataCategories: jsonb("data_categories").$type<string[]>().notNull(),
  connectedAssets: jsonb("connected_assets").$type<string[]>().notNull(),
  connectedSystems: jsonb("connected_systems").$type<string[]>().notNull(),
  processingLocations: jsonb("processing_locations").$type<string[]>().notNull(),
  subProcessors: jsonb("sub_processors").$type<string[]>().notNull(),
  contractStatus: text("contract_status").notNull(),
  dpaStatus: text("dpa_status").notNull(),
  securityReview: text("security_review").notNull(),
  privacyReview: text("privacy_review").notNull(),
  aiUsage: boolean("ai_usage").default(false).notNull(),
  transferAssessment: text("transfer_assessment").notNull(),
  reviewDate: timestamp("review_date"),
  openIssues: integer("open_issues").default(0).notNull(),
});

// Assessments (Risk / Impact)
export const assessments = pgTable("assessments", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  type: text("type").notNull(), // DPIA, AI Risk, TPRM, etc
  relatedRecordId: text("related_record_id"),
  relatedRecordType: text("related_record_type"),
  owner: text("owner").notNull(),
  reviewer: text("reviewer"),
  inherentRisk: text("inherent_risk").notNull(),
  residualRisk: text("residual_risk").notNull(),
  status: text("status").notNull(),
  dueDate: timestamp("due_date"),
  purpose: text("purpose").notNull(),
  scope: text("scope").notNull(),
  dataCategories: jsonb("data_categories").$type<string[]>().notNull(),
  affectedIndividuals: jsonb("affected_individuals").$type<string[]>().notNull(),
  riskFactors: jsonb("risk_factors").$type<string[]>().notNull(),
  existingControls: jsonb("existing_controls").$type<string[]>().notNull(),
  mitigationActions: jsonb("mitigation_actions").$type<string[]>().notNull(),
  approvalDecision: text("approval_decision"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Obligations
export const obligations = pgTable("obligations", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  source: text("source").notNull(), // GDPR, HIPAA, EU AI Act, etc
  jurisdiction: text("jurisdiction").notNull(),
  requirement: text("requirement").notNull(),
  applicability: text("applicability").notNull(),
  owner: text("owner").notNull(),
  relatedPolicies: jsonb("related_policies").$type<string[]>().notNull(),
  relatedControls: jsonb("related_controls").$type<string[]>().notNull(),
  evidenceStatus: text("evidence_status").notNull(),
  reviewStatus: text("review_status").notNull(),
});

// Policies
export const policies = pgTable("policies", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  scope: text("scope").notNull(),
  version: text("version").notNull(),
  owner: text("owner").notNull(),
  approvalStatus: text("approval_status").notNull(),
  effectiveDate: timestamp("effective_date"),
  nextReview: timestamp("next_review"),
  relatedObligations: jsonb("related_obligations").$type<string[]>().notNull(),
  relatedControls: jsonb("related_controls").$type<string[]>().notNull(),
});

// Controls
export const controls = pgTable("controls", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  owner: text("owner").notNull(),
  implementationStatus: text("implementation_status").notNull(),
  operatingFrequency: text("operating_frequency").notNull(),
  relatedAssets: jsonb("related_assets").$type<string[]>().notNull(),
  relatedObligations: jsonb("related_obligations").$type<string[]>().notNull(),
  evidenceRequirement: text("evidence_requirement").notNull(),
  lastTest: timestamp("last_test"),
  exceptions: integer("exceptions").default(0).notNull(),
});

// Privacy Requests
export const privacyRequests = pgTable("privacy_requests", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  type: text("type").notNull(), // Access, Correction, Deletion, etc
  dateReceived: timestamp("date_received").defaultNow().notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  status: text("status").notNull(),
  assignedOwner: text("assigned_owner").notNull(),
  relevantSystems: jsonb("relevant_systems").$type<string[]>().notNull(),
  relevantAssets: jsonb("relevant_assets").$type<string[]>().notNull(),
  dueDate: timestamp("due_date"),
  verificationStatus: text("verification_status").notNull(),
  description: text("description"),
});

// Data Egress Events
export const dataEgressEvents = pgTable("data_egress_events", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  user: text("user").notNull(),
  sourceApp: text("source_app").notNull(),
  destination: text("destination").notNull(),
  modelProvider: text("model_provider"),
  detectedClass: text("detected_class").notNull(),
  policyApplied: text("policy_applied").notNull(),
  decision: text("decision").notNull(), // Allowed, Allowed after redaction, Blocked, Pending review, Exception requested
  transformation: text("transformation"),
  reviewStatus: text("review_status").notNull(),
  relatedAssetId: text("related_asset_id"),
  aiSystemId: text("ai_system_id"),
  description: text("description"),
});

// Incidents & Exceptions
export const incidents = pgTable("incidents", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  dateDetected: timestamp("date_detected").defaultNow().notNull(),
  relatedAssetId: text("related_asset_id"),
  relatedSystem: text("related_system"),
  dataCategories: jsonb("data_categories").$type<string[]>().notNull(),
  businessUnit: text("business_unit").notNull(),
  owner: text("owner").notNull(),
  status: text("status").notNull(),
  containment: text("containment"),
  evidence: text("evidence"),
  reviewDeadline: timestamp("review_deadline"),
  description: text("description"),
});

export const exceptions = pgTable("exceptions", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  requestedAction: text("requested_action").notNull(),
  businessJustification: text("business_justification").notNull(),
  relatedPolicy: text("related_policy").notNull(),
  relatedAsset: text("related_asset"),
  risk: text("risk").notNull(),
  compensatingControl: text("compensating_control"),
  approver: text("approver").notNull(),
  expiryDate: timestamp("expiry_date"),
  reviewStatus: text("review_status").notNull(),
});

// Evidence
export const evidence = pgTable("evidence", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  relatedAssetId: text("related_asset_id"),
  relatedControlId: text("related_control_id"),
  relatedObligationId: text("related_obligation_id"),
  relatedAssessmentId: text("related_assessment_id"),
  relatedVendorId: text("related_vendor_id"),
  relatedIncidentId: text("related_incident_id"),
  owner: text("owner").notNull(),
  source: text("source").notNull(),
  dateCollected: timestamp("date_collected").defaultNow().notNull(),
  validityDate: timestamp("validity_date"),
  status: text("status").notNull(),
  accessClassification: text("access_classification").notNull(),
});

// Audit events
export const auditEvents = pgTable("audit_events", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  record: text("record").notNull(),
  change: text("change").notNull(),
  reason: text("reason"),
  relatedEvidence: text("related_evidence"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});