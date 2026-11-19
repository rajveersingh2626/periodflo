import { CyclePhase, PhysicalSymptom } from '../../types/cycle';

export interface HormoneTrajectory {
  estrogen: 'low' | 'rising' | 'peak' | 'declining' | 'moderate';
  progesterone: 'low' | 'baseline' | 'rising' | 'peak' | 'dropping';
  lh: 'low' | 'surge' | 'baseline';
  summary: string;
}

export const HormoneTrajectories: Record<CyclePhase, (dayInPhase: number) => HormoneTrajectory> = {
  menstrual: (day) => ({
    estrogen: day <= 2 ? 'low' : 'rising',
    progesterone: 'low',
    lh: 'low',
    summary:
      day <= 2
        ? 'Estrogen and progesterone are at their lowest baseline, directing your body energy inward for physiological renewal.'
        : 'Progesterone remains baseline while estrogen begins its gentle upward climb, subtly lifting mental clarity.',
  }),
  follicular: (day) => ({
    estrogen: 'rising',
    progesterone: 'baseline',
    lh: 'low',
    summary:
      day <= 4
        ? 'Follicle-stimulating hormone (FSH) prompts follicular growth as rising estradiol enhances insulin sensitivity and mood.'
        : 'Estradiol surges toward its peak, priming neurochemistry for creative connection, spatial memory, and physical resilience.',
  }),
  ovulatory: () => ({
    estrogen: 'peak',
    progesterone: 'rising',
    lh: 'surge',
    summary:
      'Luteinizing Hormone (LH) surges alongside peak estrogen, driving cellular energy, heightened verbal fluency, and basal vitality.',
  }),
  luteal: (day) => ({
    estrogen: day <= 7 ? 'moderate' : 'declining',
    progesterone: day <= 7 ? 'peak' : 'dropping',
    lh: 'baseline',
    summary:
      day <= 7
        ? 'The corpus luteum produces peak progesterone, elevating core body temperature and promoting GABA synthesis for grounded calm.'
        : 'A natural drop in progesterone and estrogen triggers endometrial shift; your body expends ~100-300 more basal calories daily.',
  }),
};

export const NarrativeOpeners = {
  menstrual: [
    'Your body is carrying out deep regenerative work today.',
    'A quiet, introspective rhythm naturally takes priority right now.',
    'Hormonal baselines invite you to slow the pace and protect your energy.',
    'Today is about honoring physical recovery and self-compassion.',
  ],
  follicular: [
    'A fresh surge of neurochemical vitality is building across your system.',
    'Estrogen is steadily rising, opening a window of clarity and curiosity.',
    'You are entering a high-neuroplasticity window ideal for new plans.',
    'Physical stamina and social confidence are naturally lifting today.',
  ],
  ovulatory: [
    'Your hormonal landscape is at its most radiant, peak expressive state.',
    'With estrogen peaking and LH surging, vitality and verbal ease are amplified.',
    'Confidence, magnetic presence, and quick intuition are in full harmony today.',
    'Metabolic output and cognitive sharpness are at their biological high-water mark.',
  ],
  luteal: [
    'Progesterone is stepping forward, nudging your focus toward restorative calm.',
    'Your metabolic baseline has shifted inward, asking for nourishment and warmth.',
    'Slower afternoons and intentional boundaries will serve you especially well today.',
    'As hormonal tides settle, tuning into gentle grounding practices pays dividends.',
  ],
};

export const SymptomNarratives: Record<PhysicalSymptom, string[]> = {
  cramps: [
    'Uterine prostaglandins are active today; magnesium glycinate and heat will help smooth muscle contraction.',
    'Pelvic muscular tension is elevated—gentle pelvic tilts and warm infusions can bring soothing relief.',
  ],
  fatigue: [
    'Resting metabolic energy is prioritized for uterine maintenance; an extra 30 minutes of sleep is physiologically well-earned.',
    'If lethargy creeps in, don’t fight it with excess caffeine—opt for deep hydration and horizontal rest.',
  ],
  headache: [
    'Rapid estrogen shifts can alter cranial vascular tone; prioritize electrolyte hydration and low-stimulus environments.',
  ],
  bloating: [
    'Progesterone can slow smooth gastrointestinal motility; warm potassium-rich broths and herbal teas assist digestive flow.',
  ],
  tender_breasts: [
    'Mild fluid retention from hormonal shifting is common; supportive non-constricting layers will keep you comfortable.',
  ],
  acne: [
    'Slight androgen-progesterone interplay increases sebum output; keep topical routines simple, gentle, and anti-inflammatory.',
  ],
  backache: [
    'Sacral nerve pathways reflect uterine activity; gentle lower-back traction and warm baths relieve referred tension.',
  ],
  nausea: [
    'Vagal sensitivity can rise with hormone transitions; small sips of ginger tea and bland complex carbohydrates soothe the gut.',
  ],
  cravings: [
    'Your luteal basal metabolic rate burns up to 300 extra calories; reach for complex carbs paired with healthy fats to balance blood sugar.',
  ],
  insomnia: [
    'Progesterone withdrawal or temperature shifts can disrupt REM cycles; dim blue lights early and try a slightly cooler bedroom.',
  ],
};
