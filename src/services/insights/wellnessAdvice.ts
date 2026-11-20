import { CyclePhase } from '../../types/cycle';

export interface WellnessTips {
  nutrition: string;
  hydration: string;
  workout: string;
  selfCare: string;
}

export const PhaseWellnessAdvice: Record<CyclePhase, WellnessTips[]> = {
  menstrual: [
    {
      nutrition:
        'Heme & non-heme iron sources (grass-fed beef, lentils, spinach) paired with vitamin C (citrus, bell peppers) to boost iron absorption by up to 300%. Add anti-inflammatory turmeric and dark chocolate.',
      hydration:
        'Warm infusions of red raspberry leaf and chamomile to soothe pelvic smooth-muscle contractions, alongside mineral-rich bone or shiitake mushroom broth.',
      workout:
        'Restorative yoga, yin stretches, and slow unhurried nature walks; honor your physiological nadir and let tissue regeneration proceed uninterrupted.',
      selfCare:
        'Sustained lower-abdomen heat therapy, loose breathable cotton clothing, and an unhurried evening routine free of performance demands.',
    },
    {
      nutrition:
        'Slow-simmered root vegetable stews seasoned with ginger, garlic, and zinc-rich pumpkin seeds to replenish micronutrient stores expended during shedding.',
      hydration:
        'Room-temperature water enhanced with trace ionic minerals and freshly squeezed lemon to maintain optimal blood volume and cellular hydration.',
      workout:
        'Gentle pelvic tilts, child’s pose, and light thoracic mobility work; avoid inverted postures or strenuous abdominal loading today.',
      selfCare:
        'A warm magnesium flake bath before an early bedtime; prioritize circadian melatonin production by dimming artificial lights after sunset.',
    },
    {
      nutrition:
        'Easily digestible warm meals with healthy fats (avocado, extra virgin olive oil, wild salmon) providing omega-3 EPA/DHA to downregulate inflammatory prostaglandins.',
      hydration:
        'Peppermint and ginger root tea to alleviate digestive sluggishness and keep gut motility gentle and steady.',
      workout:
        'Gentle somatic movement, foam rolling for hips and lower back, and deep diaphragmatic breathing to release pelvic floor tension.',
      selfCare:
        'Boundary setting: decline non-essential commitments, read a physical book, and indulge in 8–9 hours of deep restorative sleep.',
    },
  ],
  follicular: [
    {
      nutrition:
        'Fermented foods (kefir, sauerkraut, kimchi) for gut microbiome diversity, paired with cruciferous vegetables (broccoli, arugula) containing DIM to support healthy estrogen clearance.',
      hydration:
        'Electrolyte-infused water with fresh mint and lime to support expanding blood volume and heightened cellular metabolic output.',
      workout:
        'Progressive resistance training (hypertrophy or strength blocks) and high-velocity sprints; elevated estradiol enhances muscle glycogen replenishment and neuromuscular power.',
      selfCare:
        'Harness peak neuroplasticity: brainstorm ambitious creative projects, structure strategic quarterly goals, and schedule engaging collaborative meetings.',
    },
    {
      nutrition:
        'Lean bioavailable proteins (eggs, wild fish, tempeh) combined with complex low-glycemic carbohydrates (quinoa, oats) to fuel heightened physical vitality.',
      hydration:
        'Cold filtered water with a pinch of Celtic sea salt 30 minutes prior to physical training for optimal intracellular osmolarity.',
      workout:
        'Challenging strength training sessions, plyometrics, or intermediate cardio; your recovery speed and stamina are at their highest monthly efficiency.',
      selfCare:
        'Social outings, learning a new technical skill or language, and organizing environments while cognitive focus and dopamine sensitivity are elevated.',
    },
    {
      nutrition:
        'Antioxidant-rich berries, sprouted grains, pumpkin and flax seeds (seed cycling phase 1) providing lignans to modulate natural estrogen receptor binding.',
      hydration:
        'Chlorophyll-infused spring water or green tea rich in EGCG to combat oxidative stress and stimulate hepatic detoxification pathways.',
      workout:
        'High-energy dance, tempo runs, or progressive barbell training; leverage natural pain tolerance and rapid musculoskeletal adaptation.',
      selfCare:
        'Engage in spontaneous social plans, networking, or creative presentations where verbal fluency and interpersonal charisma shine effortlessly.',
    },
  ],
  ovulatory: [
    {
      nutrition:
        'Glutathione-supporting foods (asparagus, avocado, sulfur-rich eggs) and dark leafy greens to assist hepatic clearance of peak estradiol and support ovarian follicular release.',
      hydration:
        'Generous hydration (2.5–3 liters daily); increased metabolic rate and fluid shifts into estrogenic cervical secretions require steady fluid intake.',
      workout:
        'Peak athletic milestones: test your one-rep max, participate in competitive athletic games, or execute high-intensity interval training (HIIT).',
      selfCare:
        'Schedule high-stakes presentations, romantic celebrations, and vibrant dinners; your communication, magnetic presence, and confidence are at their biological summit.',
    },
    {
      nutrition:
        'High-fiber seeds (chia, sesame) and raw crunchy salads with bitter greens to ensure steady gastrointestinal elimination of metabolized hormones.',
      hydration:
        'Chilled coconut water with a squeeze of fresh lime for natural potassium and sodium to support rapid neuromuscular recovery.',
      workout:
        'Dynamic athletic challenges, sprint intervals, or power yoga; ensure thorough warm-ups to stabilize joints amid slight estrogen-induced ligament laxity.',
      selfCare:
        'Host friends, express heartfelt feelings, and channel peak emotional empathy and verbal confidence into collaborative projects.',
    },
  ],
  luteal: [
    {
      nutrition:
        'Complex slow-burning carbohydrates (baked sweet potatoes, butternut squash, brown rice) to support brain serotonin synthesis and balance the ~100-300 kcal/day rise in basal metabolic rate.',
      hydration:
        'Dandelion root and hibiscus tea to promote natural renal fluid excretion and alleviate mild progesterone-mediated fluid retention.',
      workout:
        'Steady-state zone 2 aerobic cardio, controlled Pilates, and moderate tempo resistance lifts; protect against elevated core body temperature during heavy exertion.',
      selfCare:
        'Declutter your living sanctuary, establish firm digital boundaries after 8 PM, and keep your bedroom temperature cooler (66°F / 19°C) for optimal sleep onset.',
    },
    {
      nutrition:
        'Magnesium-dense foods (dark cacao 75%+, pumpkin seeds, almonds, black beans) and vitamin B6 to facilitate neurotransmitter synthesis and mitigate premenstrual mood sensitivity.',
      hydration:
        'Warm water with organic apple cider vinegar or cinnamon herbal brews to stabilize postprandial glucose curves and curb late-afternoon cravings.',
      workout:
        'Mat Pilates, sculpt sessions, or deliberate isometric strength work; keep heart rate below maximal thresholds to avoid cortisol spikes.',
      selfCare:
        'Carve out non-negotiable solo recharge windows; allow yourself guilt-free permission to decline excess social invitations and practice restorative quietude.',
    },
    {
      nutrition:
        'Anti-inflammatory nourishment: wild-caught fatty fish (salmon, sardines) or walnuts, paired with steamed warming vegetables and gut-soothing bone broth.',
      hydration:
        'Warm chamomile, skullcap, or holy basil (tulsi) infusions to gently upregulate parasympathetic GABAergic pathways before sleep.',
      workout:
        'Long peaceful walks in nature, slow mindful stretching, or leisurely swimming to encourage lymphatic circulation without stressing the endocrine axis.',
      selfCare:
        'A warm epsom salt soak, deep body moisturization with calming botanicals, and journaling to process emotions with tenderness and clarity.',
    },
  ],
};
