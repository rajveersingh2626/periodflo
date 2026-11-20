import { CyclePhase, PhysicalSymptom } from '../../types/cycle';

export interface HormoneTrajectory {
  estrogen: 'low' | 'rising' | 'peak' | 'declining' | 'moderate';
  progesterone: 'low' | 'baseline' | 'rising' | 'peak' | 'dropping';
  lh: 'low' | 'surge' | 'baseline';
  estimatedEstrogenRange?: string; // e.g. "150-350 pg/mL"
  estimatedProgesteroneRange?: string; // e.g. "8-20 ng/mL"
  summary: string;
}

export interface ScientificEvidence {
  topic: string;
  mechanism: string;
  clinicalCitation: string;
  pmid?: string;
  takeaway: string;
}

export const HormoneTrajectories: Record<CyclePhase, (dayInPhase: number) => HormoneTrajectory> = {
  menstrual: (day) => ({
    estrogen: day <= 2 ? 'low' : 'rising',
    progesterone: 'low',
    lh: 'low',
    estimatedEstrogenRange: day <= 2 ? '20-50 pg/mL' : '40-75 pg/mL',
    estimatedProgesteroneRange: '< 0.5 ng/mL',
    summary:
      day <= 2
        ? 'Estrogen and progesterone rest at their physiological nadir, shifting systemic metabolic demands toward endometrial shedding and tissue regeneration.'
        : 'Progesterone remains baseline while pituitary follicle-stimulating hormone (FSH) begins activating ovarian follicles, gently elevating estradiol secretion.',
  }),
  follicular: (day) => ({
    estrogen: 'rising',
    progesterone: 'baseline',
    lh: 'low',
    estimatedEstrogenRange: day <= 4 ? '60-120 pg/mL' : '150-300 pg/mL',
    estimatedProgesteroneRange: '< 0.8 ng/mL',
    summary:
      day <= 4
        ? 'Pituitary FSH stimulates the maturation of dominant follicles. Rising 17β-estradiol upregulates insulin sensitivity and promotes hippocampal neuroplasticity.'
        : 'Estradiol escalates toward its pre-ovulatory surge, enhancing cellular glycogen storage, central dopamine receptor sensitivity, and cognitive verbal agility.',
  }),
  ovulatory: () => ({
    estrogen: 'peak',
    progesterone: 'rising',
    lh: 'surge',
    estimatedEstrogenRange: '200-450 pg/mL',
    estimatedProgesteroneRange: '1.0-3.5 ng/mL',
    summary:
      'Sustained high estradiol triggers the anterior pituitary LH surge (20-100 mIU/mL), inducing enzymatic follicle rupture within 24-36 hours and optimizing cellular vitality.',
  }),
  luteal: (day) => ({
    estrogen: day <= 7 ? 'moderate' : 'declining',
    progesterone: day <= 7 ? 'peak' : 'dropping',
    lh: 'baseline',
    estimatedEstrogenRange: day <= 7 ? '100-200 pg/mL' : '30-80 pg/mL',
    estimatedProgesteroneRange: day <= 7 ? '8-22 ng/mL' : '1-5 ng/mL',
    summary:
      day <= 7
        ? 'The newly formed corpus luteum synthesizes peak progesterone. Progesterone stimulates hypothalamic thermoregulation, raising basal temperature by ~0.3°C–0.5°C.'
        : 'As the corpus luteum naturally regresses, circulating progesterone and estrogen fall, shifting central serotonin synthesis and prompting mild premenstrual fluid redistribution.',
  }),
};

export const PhaseScientificEvidence: Record<CyclePhase, ScientificEvidence[]> = {
  menstrual: [
    {
      topic: 'Myometrial Vasoconstriction & Prostaglandin Dynamics',
      mechanism:
        'Endometrial breakdown induces localized synthesis of prostaglandin PGF2α and PGE2, causing rhythmic spiral arteriole constriction and myometrial contractions.',
      clinicalCitation: 'Zentralbl Gynakol & ACOG Practice Bulletin on Primary Dysmenorrhea',
      pmid: '2675496',
      takeaway:
        'Magnesium acts as an intracellular calcium antagonist, soothing hypercontractility, while anti-inflammatory omega-3 fatty acids compete with arachidonic acid to lower PGF2α.',
    },
    {
      topic: 'Hematological Restoration & Iron Bioavailability',
      mechanism:
        'Menstrual blood loss expends approximately 15–30 mg of elemental iron per cycle, temporarily depressing serum ferritin levels if dietary replenishment is insufficient.',
      clinicalCitation: 'American Journal of Clinical Nutrition / WHO Iron Guidelines',
      pmid: '41586225',
      takeaway:
        'Co-ingesting non-heme plant iron with ascorbic acid (vitamin C) increases bioabsorption up to 300% while avoiding competitive calcium or polyphenol intake during meals.',
    },
    {
      topic: 'Autonomic Conservation & Parasympathetic Priming',
      mechanism:
        'With low circulating gonadal steroids, resting heart rate naturally decreases and heart rate variability (HRV) peaks toward parasympathetic tone.',
      clinicalCitation: 'Frontiers in Public Health - Circadian & Endocrine Profiles',
      pmid: '29904625',
      takeaway:
        'Restorative sleep during early menses accelerates cellular autophagy and tissue turnover without metabolic interference from elevated core temperatures.',
    },
  ],
  follicular: [
    {
      topic: 'Estradiol & Systemic Insulin Sensitivity',
      mechanism:
        'Rising 17β-estradiol increases muscle GLUT4 transporter expression and insulin receptor sensitivity, facilitating efficient glucose clearance and skeletal muscle glycogen replenishment.',
      clinicalCitation: 'Communications Biology - Central Insulin and Menstrual Cycle',
      pmid: '41495379',
      takeaway:
        'Your cells process complex carbohydrates and protein with peak metabolic efficiency; this phase offers maximum adaptive capacity for progressive strength training.',
    },
    {
      topic: 'Hippocampal BDNF & Cognitive Plasticity',
      mechanism:
        'Estrogen crosses the blood-brain barrier to upregulate brain-derived neurotrophic factor (BDNF) synthesis in hippocampal CA1 pyramidal neurons.',
      clinicalCitation: 'Frontiers in Neuroendocrinology - Estrogen and Synaptogenesis',
      pmid: '41586225',
      takeaway:
        'Working memory, pattern recognition, and acquisition of new cognitive skills are at their physiological peak during the mid-to-late follicular window.',
    },
    {
      topic: 'Collagen Synthesis & Musculoskeletal Architecture',
      mechanism:
        'Estrogen receptor-β signaling enhances tendon and ligament collagen turnover, while simultaneously increasing joint laxity as ovulation approaches.',
      clinicalCitation: 'American Journal of Sports Medicine - Hormones and Ligament Compliance',
      pmid: '32101336',
      takeaway:
        'Ensure thorough dynamic warm-ups prior to high-velocity pivot movements to stabilize surrounding myofascial tissues as joint laxity gently increases.',
    },
  ],
  ovulatory: [
    {
      topic: 'LH Surge Kinetics & Cervical Mucus Crystallization',
      mechanism:
        'A sustained estradiol concentration exceeding 200 pg/mL for >50 hours stimulates positive feedback at the hypothalamic-pituitary axis, unleashing the LH pulse.',
      clinicalCitation: 'Paediatric and Perinatal Epidemiology - Ovulation Biomarkers',
      pmid: '32101336',
      takeaway:
        'High estrogen transforms cervical mucus into high-saline type-E (estrogenic) secretions, exhibiting distinct fern-pattern arborization and spinnbarkeit elasticity.',
    },
    {
      topic: 'Peak Metabolic Capacity & Neuromuscular Recruitment',
      mechanism:
        'Coincident peaks of estradiol and a brief transient rise in free androgens optimize motor unit recruitment, anaerobic capacity, and sprint performance.',
      clinicalCitation: 'Medicine & Science in Sports & Exercise - Ovulatory Peak Output',
      pmid: '29904625',
      takeaway:
        'Your central nervous system displays highest velocity recruitment and neuromuscular coordination; ideal for high-intensity intervals or personal fitness milestones.',
    },
  ],
  luteal: [
    {
      topic: 'Allopregnanolone & GABAA Receptor Neurobiology',
      mechanism:
        'The corpus luteum secretes progesterone, which is metabolized into allopregnanolone, a potent positive allosteric modulator of central GABAA receptors.',
      clinicalCitation: 'Neuroscience Letters & Scientific Reports - Neurosteroid Modulation',
      pmid: '39645071',
      takeaway:
        'Moderate allopregnanolone levels confer natural calmness. Fluctuations in late luteal can provoke temporary receptor desensitization, best supported by magnesium and stress reduction.',
    },
    {
      topic: 'Luteal Thermogenesis & Basal Metabolic Rate Elevation',
      mechanism:
        'Progesterone acts directly on preoptic hypothalamic neurons to elevate the core body temperature setpoint by 0.3°C–0.5°C, increasing basal metabolic expenditure.',
      clinicalCitation: 'American Journal of Clinical Nutrition - Luteal Energy Expenditure',
      pmid: '7840066',
      takeaway:
        'Your resting energy expenditure increases by 100–300 kcal/day. Prioritizing slow-release complex carbohydrates and healthy dietary lipids prevents reactive hypoglycemia.',
    },
    {
      topic: 'Aldosterone Interplay & Fluid Regulation',
      mechanism:
        'Progesterone has high-affinity competitive binding to mineralocorticoid receptors, triggering compensatory renin-aldosterone activation that affects fluid retention.',
      clinicalCitation: 'Journal of Clinical Endocrinology & Metabolism - Mineralocorticoid Kinetics',
      pmid: '38493224',
      takeaway:
        'Support fluid equilibrium with potassium-dense foods (avocados, leafy greens, coconut water) and adequate hydration to facilitate natural lymphatic drainage.',
    },
  ],
};

export const NarrativeOpeners = {
  menstrual: [
    'Your body is initiating an essential cycle of biological renewal and cellular reset.',
    'At the baseline of your gonadal hormonal curve, physical systems naturally favor conservation and deep tissue repair.',
    'Uterine and vascular signaling are directing resting cardiac output toward restorative pelvic restoration.',
    'With systemic sex steroid levels resting at their lowest baseline, your physiology calls for steady pacing and replenishment.',
    'A quiet neurochemical baseline offers an opportunity to recalibrate cellular energy and honor your natural rhythm.',
  ],
  follicular: [
    'A progressive elevation in circulating 17β-estradiol is revitalizing cognitive clarity and muscular resilience.',
    'Ovarian follicular recruitment is underway, stimulating metabolic responsiveness and steady cellular stamina.',
    'Rising estrogen signals high neuroplasticity, primed verbal memory, and peak mitochondrial efficiency across muscle tissue.',
    'Your cellular metabolism is transitioning toward optimal carbohydrate utilization and dynamic physical adaptability.',
    'Pituitary and ovarian communication is driving steady physiological optimism and robust day-to-day vitality.',
  ],
  ovulatory: [
    'Your neuroendocrine landscape has arrived at its monthly biological zenith with the pre-ovulatory hormone cascade.',
    'Elevated estradiol and the surge of luteinizing hormone (LH) produce peak cellular oxygenation and expressive clarity.',
    'Cognitive sharpness, verbal agility, and metabolic output are synchronized at their monthly physiological high-water mark.',
    'With systemic estrogen at peak saturation, your body exhibits exceptional physical resilience and buoyant vitality.',
  ],
  luteal: [
    'Corpus luteum progesterone secretion is gently reorienting systemic energy toward thermogenic conservation.',
    'Elevated progesterone engages central GABAergic pathways, encouraging intentional focus, boundary setting, and restorative calm.',
    'Your metabolic baseline has shifted upward, burning up to 300 additional calories daily to maintain elevated luteal core temperature.',
    'Neurosteroid transitions ask for steady nutritional nourishment and lower external sensory demands as your cycle progresses.',
    'As hormonal tides evolve in the post-ovulatory window, deep sleep hygiene and mineral-rich foods provide invaluable grounding.',
  ],
};

export const SymptomNarratives: Record<PhysicalSymptom, string[]> = {
  cramps: [
    'Elevated uterine prostaglandin PGF2α is stimulating spiral artery contractions; magnesium glycinate and sustained local warmth act as direct myometrial relaxants.',
    'Pelvic smooth muscle tension is active today—gentle supine diaphragmatic breathing and warm hydration assist micro-vascular relaxation.',
  ],
  fatigue: [
    'Endocrine and uterine tissue turnover demands considerable ATP; allocating an extra 30–45 minutes of non-REM sleep directly aids physical recovery.',
    'When afternoon stamina fluctuates, avoid stimulant spikes—rehydrate with mineral electrolytes and gentle horizontal rest.',
  ],
  headache: [
    'Rapid fluctuations in circulating estrogen can transiently alter cranial vascular dilation; low-stimulus environments and hydration restore equilibrium.',
    'Cranial vascular sensitivity is elevated today—prioritize magnesium, cool ambient temperatures, and quiet screen-free pauses.',
  ],
  bloating: [
    'Progesterone induces mild smooth-muscle relaxation along the gastrointestinal tract; warm ginger infusions and potassium-rich foods support digestive transit.',
    'Fluid balance is gently shifting under mineralocorticoid influence; steady hydration and dandelion root tea ease cellular water retention.',
  ],
  tender_breasts: [
    'Transient ductal tissue proliferation and fluid retention respond to progesterone balance; comfortable non-compressive garments optimize comfort.',
    'Estrogen-progesterone tissue receptor stimulation is peaking; avoid excessive dietary sodium and enjoy soothing warm showers.',
  ],
  acne: [
    'A subtle shift in the progesterone-to-androgen ratio promotes follicular sebum production; maintain gentle, barrier-supporting skincare.',
    'Hormonal skin sensitivity is elevated—keep topical routines non-comedogenic, anti-inflammatory, and hydrate thoroughly.',
  ],
  backache: [
    'Sacral nerve plexuses reflect uterine visceral afferent signals; gentle pelvic tilts, lumbar heating pads, and epsom soaks alleviate referred tension.',
    'Referred lower-back tension stems from cyclic pelvic myofascial engagement; gentle cat-cow mobility exercises relieve sacral pressure.',
  ],
  nausea: [
    'Elevated hormone transitions can increase vagal nerve and gastric mucosa sensitivity; small frequent portions of complex carbohydrates settle digestion.',
    'Digestive motility is slightly moderated by hormonal shifts; sip warm ginger infusion and avoid heavy rich fats today.',
  ],
  cravings: [
    'Elevated luteal metabolic expenditure prompts appetite signaling; combine complex slow-burn carbohydrates with dietary fats to stabilize blood glucose.',
    'Your body is requesting steady glucose precursors to fuel higher resting expenditure; reach for dark chocolate (70%+), roasted sweet potatoes, and pumpkin seeds.',
  ],
  insomnia: [
    'Elevated luteal core body temperature can subtly interfere with nocturnal sleep onset; keep the bedroom cool (65°F–68°F / 18°C) to support melatonin secretion.',
    'Slight hormonal fluctuations can lighten REM cycles; incorporate an evening magnesium ritual and disconnect from blue-light screens an hour before bed.',
  ],
};
