import { describe, it, expect } from 'vitest';
import { InsightEngine } from '../../src/services/insights/nlgEngine';

describe('Physiological NLG Insights Engine', () => {
  it('should generate deep, non-repetitive narratives across consecutive cycle days', () => {
    // Generate insights for Day 1, Day 2, Day 3 of Menstruation
    const day1 = InsightEngine.generateDailyInsight({
      cycleDay: 1,
      phase: 'menstrual',
      symptoms: ['cramps', 'fatigue'],
      energyLevel: 1,
      sleepQuality: 3,
    });

    const day2 = InsightEngine.generateDailyInsight({
      cycleDay: 2,
      phase: 'menstrual',
      symptoms: ['cramps'],
      energyLevel: 2,
      sleepQuality: 4,
    });

    const day3 = InsightEngine.generateDailyInsight({
      cycleDay: 3,
      phase: 'menstrual',
      symptoms: ['bloating'],
      energyLevel: 2,
      sleepQuality: 4,
    });

    expect(day1.primaryNarrative).toBeDefined();
    expect(day2.primaryNarrative).toBeDefined();
    expect(day3.primaryNarrative).toBeDefined();

    // Must not be repetitive canned identical strings
    expect(day1.primaryNarrative).not.toBe(day2.primaryNarrative);
    expect(day2.primaryNarrative).not.toBe(day3.primaryNarrative);

    // Deep physiological context
    expect(day1.hormoneStatus.estrogen).toBeDefined();
    expect(day1.hormoneStatus.progesterone).toBeDefined();
    expect(day1.hormoneStatus.estimatedEstrogenRange).toBeDefined();
    expect(day1.hormoneStatus.estimatedProgesteroneRange).toBeDefined();
  });

  it('should dynamically adapt narrative when severe symptoms are present', () => {
    const withSevereSymptoms = InsightEngine.generateDailyInsight({
      cycleDay: 26,
      phase: 'luteal',
      symptoms: ['cramps', 'headache', 'insomnia'],
      energyLevel: 1,
      sleepQuality: 2,
    });

    expect(withSevereSymptoms.primaryNarrative.toLowerCase()).toMatch(
      /progesterone|cramps|rest|soothe|calm|headache|prostaglandin/
    );
    expect(withSevereSymptoms.wellnessTips.nutrition).toBeDefined();
    expect(withSevereSymptoms.wellnessTips.workout).toBeDefined();
  });

  it('should generate evidence-based scientific mechanisms and PubMed citations', () => {
    const follicularInsight = InsightEngine.generateDailyInsight({
      cycleDay: 9,
      phase: 'follicular',
      symptoms: [],
      energyLevel: 4,
    });

    expect(follicularInsight.scientificEvidence).toBeDefined();
    expect(follicularInsight.scientificEvidence.topic).toBeDefined();
    expect(follicularInsight.scientificEvidence.mechanism.length).toBeGreaterThan(30);
    expect(follicularInsight.scientificEvidence.clinicalCitation).toBeDefined();
    expect(follicularInsight.scientificEvidence.takeaway.length).toBeGreaterThan(20);

    const lutealInsight = InsightEngine.generateDailyInsight({
      cycleDay: 21,
      phase: 'luteal',
      symptoms: ['bloating'],
      energyLevel: 3,
    });

    expect(lutealInsight.scientificEvidence).toBeDefined();
    expect(lutealInsight.scientificEvidence.pmid).toBeDefined();
    expect(typeof lutealInsight.scientificEvidence.pmid).toBe('string');
  });

  it('should generate actionable, empathetic tips for the partner view', () => {
    const partnerInsight = InsightEngine.generateDailyInsight({
      cycleDay: 25,
      phase: 'luteal',
      symptoms: ['fatigue', 'cravings'],
      energyLevel: 2,
      sleepQuality: 3,
    });

    expect(partnerInsight.partnerEmpathyTip).toBeDefined();
    expect(partnerInsight.partnerEmpathyTip.actionableIdea).toBeDefined();
    expect(partnerInsight.partnerEmpathyTip.emotionalVibe).toBeDefined();
    expect(partnerInsight.partnerEmpathyTip.actionableIdea.length).toBeGreaterThan(20);
    expect(partnerInsight.partnerEmpathyTip.communicationTip).toBeDefined();
  });
});
