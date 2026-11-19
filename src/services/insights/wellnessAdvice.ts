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
      nutrition: 'Iron-rich legumes, cooked greens, dark chocolate, and nourishing bone or miso broth.',
      hydration: 'Warm herbal infusions (raspberry leaf, chamomile) to support pelvic micro-circulation.',
      workout: 'Restorative yoga, yin stretches, and unhurried outdoor walks; honor physical pauses.',
      selfCare: 'Warm heating compress, cozy loose layers, and protected quiet evening time.',
    },
    {
      nutrition: 'Slow-simmered stews with ginger, turmeric, and zinc-dense pumpkin seeds.',
      hydration: 'Room-temperature water with lemon and a pinch of unrefined sea salt.',
      workout: 'Gentle mobility flow or dynamic stretching focusing on hips and lower back.',
      selfCare: 'Early bedtime without screens; let cellular repair do its restorative work.',
    },
  ],
  follicular: [
    {
      nutrition: 'Fermented foods (kimchi, kefir), sprouted grains, fresh citrus, and vibrant seasonal salads.',
      hydration: 'Infused water with mint and cucumber to match increasing cellular metabolic activity.',
      workout: 'Strength training, brisk interval sessions, dance, or trying a new fitness modality.',
      selfCare: 'Journaling, creative brainstorming, and launching fresh projects or personal goals.',
    },
    {
      nutrition: 'Lean proteins paired with cruciferous vegetables (broccoli, arugula) to aid estrogen clearance.',
      hydration: 'Pure filtered water with electrolyte trace drops before workout sessions.',
      workout: 'Progressive overload lifting or moderate-intensity cardio while endurance is naturally elevated.',
      selfCare: 'Socializing, engaging conversations, and scheduling challenging creative sprints.',
    },
  ],
  ovulatory: [
    {
      nutrition: 'Fiber-rich quinoa, avocado, glutathione-rich asparagus, and antioxidant berries.',
      hydration: 'At least 2.5–3 liters of water; metabolic rate and body temperature are slightly higher.',
      workout: 'Peak athletic performance: HIIT, heavy lifting, high-energy sprints, or competitive sports.',
      selfCare: 'Public speaking, meaningful romantic dates, collaborative meetings, and vibrant outings.',
    },
  ],
  luteal: [
    {
      nutrition: 'Roasted root vegetables, sweet potatoes, magnesium-rich seeds, and comforting curries.',
      hydration: 'Peppermint or dandelion root tea to relieve fluid retention and support liver detox.',
      workout: 'Steady-state cardio (LISS), Pilates, resistance bands, and deliberate tempo lifts.',
      selfCare: 'Boundaries on social obligations; carve out uninterrupted solo recharge hours.',
    },
    {
      nutrition: 'Complex slow-burn carbohydrates paired with healthy fats to prevent glucose dips and irritability.',
      hydration: 'Warm water with apple cider vinegar or cinnamon herbal brews.',
      workout: 'Deep stretching, slow mat Pilates, or calming scenic neighborhood walks.',
      selfCare: 'Tidy your sanctuary space, soak in an Epsom salt bath, and enjoy an early book in bed.',
    },
  ],
};
