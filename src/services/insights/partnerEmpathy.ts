import { CyclePhase, PhysicalSymptom } from '../../types/cycle';

export interface PartnerEmpathyTip {
  emotionalVibe: string;
  energyForecast: string;
  actionableIdea: string;
}

export class PartnerEmpathyEngine {
  public static generateTip(
    phase: CyclePhase,
    cycleDay: number,
    symptoms: PhysicalSymptom[],
    energyLevel: number = 3
  ): PartnerEmpathyTip {
    // If specific acute symptoms are active, prioritize empathetic assistance
    if (symptoms.includes('cramps')) {
      return {
        emotionalVibe: 'Physical discomfort & heightened sensory sensitivity',
        energyForecast: 'Low — reserves are focused on internal healing',
        actionableIdea:
          'Warm up a heating pad for her without having to be asked, brew a mug of herbal tea, and handle dinner or household chores tonight.',
      };
    }

    if (symptoms.includes('headache')) {
      return {
        emotionalVibe: 'Sensory overload / needs a low-stimulus environment',
        energyForecast: 'Delicate — loud sounds or bright lights will drain her fast',
        actionableIdea:
          'Keep home lighting dim and calming, bring her an ice pack or a tall glass of cold electrolyte water, and keep conversation gentle.',
      };
    }

    if (symptoms.includes('cravings') || symptoms.includes('fatigue')) {
      return {
        emotionalVibe: 'Craving comfort, security, and steady warmth',
        energyForecast: 'Gentle / dip in afternoon stamina',
        actionableIdea:
          'Surprise her with her favorite nourishing snack or comforting treat, and suggest watching a movie together from the couch.',
      };
    }

    // Phase-specific empathetic guidance
    switch (phase) {
      case 'menstrual':
        return {
          emotionalVibe: 'Introspective, quiet, deeply appreciative of gentle consideration',
          energyForecast: 'Lowest phase of the cycle — physical recharge mode',
          actionableIdea:
            'Protect her downtime. Offer a back rub or neck massage, handle grocery errands, and don’t take quietness personally.',
        };
      case 'follicular':
        return {
          emotionalVibe: 'Curious, buoyant, upbeat, and eager to explore',
          energyForecast: 'Steady upward trend — stamina and positivity rising',
          actionableIdea:
            'Plan a spontaneous evening walk, try a new recipe together, or ask her about the new ideas and projects on her mind.',
        };
      case 'ovulatory':
        return {
          emotionalVibe: 'Radiant, socially vibrant, magnetic, and confident',
          energyForecast: 'Peak monthly vitality and enthusiasm',
          actionableIdea:
            'Book an exciting dinner date, plan an active weekend adventure, and celebrate her energy and ideas with enthusiastic support.',
        };
      case 'luteal':
        return {
          emotionalVibe: 'Observant, nest-building, sensitive to stress and clutter',
          energyForecast: 'Gradual taper — body uses up to 300 more calories daily',
          actionableIdea:
            'Give her thoughtful emotional validation, prepare a warm dinner with healthy carbs, and offer unprompted reassurance.',
        };
    }
  }
}
