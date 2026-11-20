import { CyclePhase, PhysicalSymptom } from '../../types/cycle';
import {
  HormoneTrajectories,
  HormoneTrajectory,
  NarrativeOpeners,
  SymptomNarratives,
  PhaseScientificEvidence,
  ScientificEvidence,
} from './vocabulary';
import { PhaseWellnessAdvice, WellnessTips } from './wellnessAdvice';
import { PartnerEmpathyEngine, PartnerEmpathyTip } from './partnerEmpathy';

export interface DailyInsightParams {
  cycleDay: number;
  phase: CyclePhase;
  symptoms: PhysicalSymptom[];
  energyLevel?: number;
  sleepQuality?: number;
  notes?: string;
}

export interface DailyInsightResult {
  cycleDay: number;
  phase: CyclePhase;
  primaryNarrative: string;
  hormoneStatus: HormoneTrajectory;
  scientificEvidence: ScientificEvidence;
  wellnessTips: WellnessTips;
  partnerEmpathyTip: PartnerEmpathyTip;
}

export class InsightEngine {
  /**
   * Deterministic seed generator from cycle day and phase to vary openings predictably without random flicker
   */
  private static getVariationIndex(cycleDay: number, listLength: number): number {
    return Math.abs((cycleDay * 7 + 3) % listLength);
  }

  public static generateDailyInsight(params: DailyInsightParams): DailyInsightResult {
    const { cycleDay, phase, symptoms, energyLevel = 3 } = params;

    // Day in phase estimation (approximated for hormonal curve resolution)
    let dayInPhase = cycleDay;
    if (phase === 'follicular') dayInPhase = Math.max(1, cycleDay - 5);
    else if (phase === 'ovulatory') dayInPhase = Math.max(1, cycleDay - 13);
    else if (phase === 'luteal') dayInPhase = Math.max(1, cycleDay - 16);

    const hormoneStatus = HormoneTrajectories[phase](dayInPhase);

    // Pick contextual narrative opener
    const openers = NarrativeOpeners[phase];
    const opener = openers[this.getVariationIndex(cycleDay, openers.length)];

    // Build physiological story paragraphs
    const paragraphs: string[] = [opener, hormoneStatus.summary];

    // Symptom-specific contextual insertions
    if (symptoms.length > 0) {
      for (const sym of symptoms.slice(0, 2)) {
        const pool = SymptomNarratives[sym];
        if (pool && pool.length > 0) {
          const symSentence = pool[this.getVariationIndex(cycleDay, pool.length)];
          paragraphs.push(symSentence);
        }
      }
    } else {
      // General energy flow reflection if no acute symptoms logged
      if (energyLevel <= 2) {
        paragraphs.push(
          'Your nervous system is signaling for conservation; prioritize nourishing hydration and restful pauses.'
        );
      } else if (energyLevel >= 4) {
        paragraphs.push(
          'Your cellular reserves are primed for high physical vitality and cognitive focus today.'
        );
      }
    }

    const primaryNarrative = paragraphs.join(' ');

    // Scientific clinical evidence selection
    const evidenceList = PhaseScientificEvidence[phase];
    const scientificEvidence = evidenceList[this.getVariationIndex(cycleDay, evidenceList.length)];

    // Wellness advice selection
    const adviceList = PhaseWellnessAdvice[phase];
    const wellnessTips = adviceList[this.getVariationIndex(cycleDay, adviceList.length)];

    // Partner empathy generation
    const partnerEmpathyTip = PartnerEmpathyEngine.generateTip(
      phase,
      cycleDay,
      symptoms,
      energyLevel
    );

    return {
      cycleDay,
      phase,
      primaryNarrative,
      hormoneStatus,
      scientificEvidence,
      wellnessTips,
      partnerEmpathyTip,
    };
  }
}
