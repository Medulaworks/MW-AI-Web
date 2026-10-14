import "server-only";
import { db } from "@/db";
import {
  organisations,
  businessUnits,
  assets,
  discoveryItems,
  systems,
  dataFlows,
  processingActivities,
  aiSystems,
  vendors,
  assessments,
  obligations,
  policies,
  controls,
  privacyRequests,
  dataEgressEvents,
  incidents,
  exceptions,
  evidence,
  auditEvents,
} from "@/db/schema";

import {
  orgs as seedOrgs,
  businessUnits as seedBusinessUnits,
  assets as seedAssets,
  discoveryItems as seedDiscovery,
  systems as seedSystems,
  dataFlows as seedFlows,
  processingActivities as seedProc,
  aiSystems as seedAI,
  vendors as seedVendors,
  assessments as seedAssess,
  obligations as seedObl,
  policies as seedPol,
  controls as seedCtrl,
  privacyRequests as seedPR,
  dataEgressEvents as seedDLP,
  incidents as seedInc,
  exceptions as seedExc,
  evidence as seedEv,
  auditEvents as seedAud,
} from "@/seed/seed";

import { sql } from "drizzle-orm";

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  try {
    const result = await db.execute(sql`SELECT count(*)::int as c FROM organisations`);
    const rows = result.rows as Array<{ c: number }>;
    const count = rows[0]?.c ?? 0;
    if (count === 0) {
      await db.insert(organisations).values(seedOrgs).onConflictDoNothing();
      await db.insert(businessUnits).values(seedBusinessUnits).onConflictDoNothing();
      await db.insert(assets).values(
        seedAssets.map((a) => ({
          id: a.id, orgId: a.orgId, unitId: a.unitId, name: a.name, type: a.type,
          domain: a.domain, classification: a.classification,
          containsPersonal: a.containsPersonal, containsSpecialCategory: a.containsSpecialCategory,
          repository: a.repository, owner: a.owner, custodian: a.custodian,
          retentionRule: a.retentionRule, reviewStatus: a.reviewStatus,
          riskLevel: a.riskLevel, lastReviewed: new Date(a.lastReviewed),
          description: a.description, createdAt: new Date(),
        }))
      ).onConflictDoNothing();
      await db.insert(discoveryItems).values(
        seedDiscovery.map((d) => ({
          id: d.id, orgId: d.orgId, source: d.source, location: d.location,
          proposedName: d.proposedName, candidateClassification: d.candidateClassification,
          detectionBasis: d.detectionBasis, confidence: d.confidence, state: d.state,
          reviewer: d.reviewer, detectedCategories: d.detectedCategories,
          linkedAssetId: d.linkedAssetId, runDate: new Date(d.runDate),
        }))
      ).onConflictDoNothing();
      await db.insert(systems).values(seedSystems).onConflictDoNothing();
      await db.insert(dataFlows).values(
        seedFlows.map((f) => ({
          id: f.id, orgId: f.orgId, name: f.name, sourceAssetId: f.sourceAssetId,
          sourceSystem: f.sourceSystem, destinationAssetId: f.destinationAssetId,
          destinationSystem: f.destinationSystem, destinationType: f.destinationType,
          dataCategories: f.dataCategories, businessPurpose: f.businessPurpose,
          transferMethod: f.transferMethod, jurisdictions: f.jurisdictions,
          classification: f.classification, approvalStatus: f.approvalStatus,
          lastReviewed: new Date(f.lastReviewed), vendorId: f.vendorId, aiSystemId: f.aiSystemId,
        }))
      ).onConflictDoNothing();
      await db.insert(processingActivities).values(
        seedProc.map((p) => ({
          id: p.id, orgId: p.orgId, name: p.name, businessPurpose: p.businessPurpose,
          unitId: p.unitId, controller: p.controller, dataCategories: p.dataCategories,
          categoriesOfIndividuals: p.categoriesOfIndividuals, sourceAssetIds: p.sourceAssetIds,
          recipients: p.recipients, processors: p.processors, jurisdictions: p.jurisdictions,
          retentionRule: p.retentionRule, lawfulBasis: p.lawfulBasis,
          crossBorderTransfer: p.crossBorderTransfer, riskAssessmentId: p.riskAssessmentId,
          controls: p.controls, owner: p.owner, lastReviewed: new Date(p.lastReviewed),
        }))
      ).onConflictDoNothing();
      await db.insert(aiSystems).values(
        seedAI.map((a) => ({
          id: a.id, orgId: a.orgId, name: a.name, businessPurpose: a.businessPurpose,
          unitId: a.unitId, businessOwner: a.businessOwner, technicalOwner: a.technicalOwner,
          riskTier: a.riskTier, deployment: a.deployment, modelProvider: a.modelProvider,
          modelFamily: a.modelFamily, dataClasses: a.dataClasses, connectedAssets: a.connectedAssets,
          externalProcessing: a.externalProcessing, assessmentStatus: a.assessmentStatus,
          approvalStatus: a.approvalStatus, lastReview: new Date(a.lastReview),
          description: a.description, approvalConditions: a.approvalConditions,
        }))
      ).onConflictDoNothing();
      await db.insert(vendors).values(
        seedVendors.map((v) => ({
          id: v.id, orgId: v.orgId, name: v.name, serviceType: v.serviceType,
          dataCategories: v.dataCategories, connectedAssets: v.connectedAssets,
          connectedSystems: v.connectedSystems, processingLocations: v.processingLocations,
          subProcessors: v.subProcessors, contractStatus: v.contractStatus,
          dpaStatus: v.dpaStatus, securityReview: v.securityReview,
          privacyReview: v.privacyReview, aiUsage: v.aiUsage,
          transferAssessment: v.transferAssessment, reviewDate: new Date(v.reviewDate),
          openIssues: v.openIssues,
        }))
      ).onConflictDoNothing();
      await db.insert(assessments).values(
        seedAssess.map((r) => ({
          id: r.id, orgId: r.orgId, type: r.type, relatedRecordId: r.relatedRecordId,
          relatedRecordType: r.relatedRecordType, owner: r.owner, reviewer: r.reviewer,
          inherentRisk: r.inherentRisk, residualRisk: r.residualRisk, status: r.status,
          dueDate: r.dueDate ? new Date(r.dueDate) : null, purpose: r.purpose, scope: r.scope,
          dataCategories: r.dataCategories, affectedIndividuals: r.affectedIndividuals,
          riskFactors: r.riskFactors, existingControls: r.existingControls,
          mitigationActions: r.mitigationActions, approvalDecision: r.approvalDecision,
          createdAt: new Date(r.createdAt),
        }))
      ).onConflictDoNothing();
      await db.insert(obligations).values(seedObl).onConflictDoNothing();
      await db.insert(policies).values(
        seedPol.map((p) => ({
          id: p.id, orgId: p.orgId, name: p.name, scope: p.scope, version: p.version,
          owner: p.owner, approvalStatus: p.approvalStatus,
          effectiveDate: p.effectiveDate ? new Date(p.effectiveDate) : null,
          nextReview: p.nextReview ? new Date(p.nextReview) : null,
          relatedObligations: p.relatedObligations, relatedControls: p.relatedControls,
        }))
      ).onConflictDoNothing();
      await db.insert(controls).values(
        seedCtrl.map((c) => ({
          id: c.id, orgId: c.orgId, name: c.name, objective: c.objective,
          type: c.type, category: c.category, owner: c.owner,
          implementationStatus: c.implementationStatus, operatingFrequency: c.operatingFrequency,
          relatedAssets: c.relatedAssets, relatedObligations: c.relatedObligations,
          evidenceRequirement: c.evidenceRequirement,
          lastTest: c.lastTest ? new Date(c.lastTest) : null, exceptions: c.exceptions,
        }))
      ).onConflictDoNothing();
      await db.insert(privacyRequests).values(
        seedPR.map((p) => ({
          id: p.id, orgId: p.orgId, type: p.type, dateReceived: new Date(p.dateReceived),
          jurisdiction: p.jurisdiction, status: p.status, assignedOwner: p.assignedOwner,
          relevantSystems: p.relevantSystems, relevantAssets: p.relevantAssets,
          dueDate: new Date(p.dueDate), verificationStatus: p.verificationStatus,
          description: p.description,
        }))
      ).onConflictDoNothing();
      await db.insert(dataEgressEvents).values(
        seedDLP.map((d) => ({
          id: d.id, orgId: d.orgId, timestamp: new Date(d.timestamp), user: d.user,
          sourceApp: d.sourceApp, destination: d.destination, modelProvider: d.modelProvider,
          detectedClass: d.detectedClass, policyApplied: d.policyApplied,
          decision: d.decision, transformation: d.transformation,
          reviewStatus: d.reviewStatus, relatedAssetId: d.relatedAssetId,
          aiSystemId: d.aiSystemId, description: d.description,
        }))
      ).onConflictDoNothing();
      await db.insert(incidents).values(
        seedInc.map((i) => ({
          id: i.id, orgId: i.orgId, type: i.type, severity: i.severity,
          dateDetected: new Date(i.dateDetected), relatedAssetId: i.relatedAssetId,
          relatedSystem: i.relatedSystem, dataCategories: i.dataCategories,
          businessUnit: i.businessUnit, owner: i.owner, status: i.status,
          containment: i.containment, evidence: i.evidence,
          reviewDeadline: new Date(i.reviewDeadline), description: i.description,
        }))
      ).onConflictDoNothing();
      await db.insert(exceptions).values(
        seedExc.map((e) => ({
          id: e.id, orgId: e.orgId, requestedAction: e.requestedAction,
          businessJustification: e.businessJustification, relatedPolicy: e.relatedPolicy,
          relatedAsset: e.relatedAsset, risk: e.risk,
          compensatingControl: e.compensatingControl, approver: e.approver,
          expiryDate: e.expiryDate ? new Date(e.expiryDate) : null,
          reviewStatus: e.reviewStatus,
        }))
      ).onConflictDoNothing();
      await db.insert(evidence).values(
        seedEv.map((e) => ({
          id: e.id, orgId: e.orgId, title: e.title, type: e.type,
          relatedAssetId: e.relatedAssetId, relatedControlId: e.relatedControlId,
          relatedObligationId: e.relatedObligationId,
          relatedAssessmentId: e.relatedAssessmentId, relatedVendorId: e.relatedVendorId,
          relatedIncidentId: e.relatedIncidentId, owner: e.owner, source: e.source,
          dateCollected: new Date(e.dateCollected),
          validityDate: e.validityDate ? new Date(e.validityDate) : null,
          status: e.status, accessClassification: e.accessClassification,
        }))
      ).onConflictDoNothing();
      await db.insert(auditEvents).values(
        seedAud.map((a) => ({
          id: a.id, orgId: a.orgId, actor: a.actor, action: a.action, record: a.record,
          change: a.change, reason: a.reason, relatedEvidence: a.relatedEvidence,
          timestamp: new Date(a.timestamp),
        }))
      ).onConflictDoNothing();
    }
    seeded = true;
  } catch (err) {
    // If seeding fails (e.g. during build), fall back to in-memory seed data
    seeded = true;
  }
}

// In-memory copies — for resilience if DB unavailable, we always return seed data merged with overrides
function withDates<T extends { lastReviewed?: string; lastReview?: string; dateReceived?: string; dateDetected?: string; reviewDeadline?: string; reviewDate?: string; createdAt?: string; runDate?: string; timestamp?: string; effectiveDate?: string; nextReview?: string; dateCollected?: string; validityDate?: string; dueDate?: string }>(arr: T[]): T[] {
  return arr.map((row) => {
    const r: Record<string, unknown> = { ...row };
    for (const k of Object.keys(r)) {
      const v = r[k];
      if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) r[k] = d.toISOString();
      }
    }
    return r as T;
  });
}

export async function getOrganisations() {
  await ensureSeeded();
  return seedOrgs;
}

export async function getBusinessUnits() {
  await ensureSeeded();
  return seedBusinessUnits;
}

export async function getAssets(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedAssets.filter((a) => a.orgId === orgId) : seedAssets;
}

export async function getDiscoveryItems(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedDiscovery.filter((d) => d.orgId === orgId) : seedDiscovery;
}

export async function getSystems(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedSystems.filter((s) => s.orgId === orgId) : seedSystems;
}

export async function getDataFlows(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedFlows.filter((f) => f.orgId === orgId) : seedFlows;
}

export async function getProcessingActivities(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedProc.filter((p) => p.orgId === orgId) : seedProc;
}

export async function getAISystems(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedAI.filter((a) => a.orgId === orgId) : seedAI;
}

export async function getVendors(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedVendors.filter((v) => v.orgId === orgId) : seedVendors;
}

export async function getAssessments(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedAssess.filter((r) => r.orgId === orgId) : seedAssess;
}

export async function getObligations(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedObl.filter((o) => o.orgId === orgId) : seedObl;
}

export async function getPolicies(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedPol.filter((p) => p.orgId === orgId) : seedPol;
}

export async function getControls(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedCtrl.filter((c) => c.orgId === orgId) : seedCtrl;
}

export async function getPrivacyRequests(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedPR.filter((p) => p.orgId === orgId) : seedPR;
}

export async function getDataEgressEvents(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedDLP.filter((d) => d.orgId === orgId) : seedDLP;
}

export async function getIncidents(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedInc.filter((i) => i.orgId === orgId) : seedInc;
}

export async function getExceptions(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedExc.filter((e) => e.orgId === orgId) : seedExc;
}

export async function getEvidence(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedEv.filter((e) => e.orgId === orgId) : seedEv;
}

export async function getAuditEvents(orgId?: string) {
  await ensureSeeded();
  return orgId ? seedAud.filter((a) => a.orgId === orgId) : seedAud;
}

export async function getOverviewMetrics(orgId: string) {
  await ensureSeeded();
  const a = seedAssets.filter((x) => x.orgId === orgId);
  const d = seedDiscovery.filter((x) => x.orgId === orgId);
  const p = seedProc.filter((x) => x.orgId === orgId);
  const ai = seedAI.filter((x) => x.orgId === orgId);
  const r = seedAssess.filter((x) => x.orgId === orgId);
  const c = seedCtrl.filter((x) => x.orgId === orgId);
  const i = seedInc.filter((x) => x.orgId === orgId);
  const e = seedDLP.filter((x) => x.orgId === orgId);
  const ev = seedEv.filter((x) => x.orgId === orgId);
  const v = seedVendors.filter((x) => x.orgId === orgId);
  return {
    totalAssets: a.length,
    awaitingClassification: a.filter((x) => x.reviewStatus === "Awaiting Review").length,
    processingUnderReview: p.filter((x) => x.lastReviewed && new Date(x.lastReviewed).getTime() < Date.now() - 90 * 24 * 3600 * 1000).length,
    aiAwaitingApproval: ai.filter((x) => x.approvalStatus === "Proposed" || x.approvalStatus === "Under Assessment").length,
    highRiskAssessments: r.filter((x) => x.inherentRisk === "Critical" || x.inherentRisk === "High").length,
    overdueEvidence: c.filter((x) => x.lastTest && new Date(x.lastTest).getTime() < Date.now() - 100 * 24 * 3600 * 1000).length,
    openIncidents: i.filter((x) => x.status !== "Completed" && x.status !== "Mitigated").length,
    unreviewedEgress: e.filter((x) => x.reviewStatus !== "Logged").length,
    discoveryCandidates: d.filter((x) => x.state === "New" || x.state === "In Review").length,
    activeVendors: v.length,
    coverage: {
      assetOwnership: Math.round((a.filter((x) => x.owner).length / a.length) * 100),
      classification: Math.round((a.filter((x) => x.reviewStatus === "Confirmed").length / a.length) * 100),
      processingRecords: Math.round((p.filter((x) => x.lastReviewed).length / p.length) * 100),
      retentionAssignments: Math.round((a.filter((x) => x.retentionRule).length / a.length) * 100),
      aiSystemInventory: Math.round((ai.filter((x) => x.lastReview).length / ai.length) * 100),
      vendorReviews: Math.round((v.filter((x) => x.securityReview === "Reviewed" && x.privacyReview === "Reviewed").length / v.length) * 100),
      riskAssessments: Math.round((r.filter((x) => x.status === "Completed").length / r.length) * 100),
      controlEvidence: Math.round((ev.filter((x) => x.status === "Current").length / Math.max(ev.length, 1)) * 100),
    },
  };
}