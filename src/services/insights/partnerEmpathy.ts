import { CyclePhase, PhysicalSymptom } from '../../types/cycle';

export interface PartnerEmpathyTip {
  emotionalVibe: string;
  energyForecast: string;
  actionableIdea: string;
  communicationTip: string;
}

export class PartnerEmpathyEngine {
  public static generateTip(
    phase: CyclePhase,
    cycleDay: number,
    symptoms: PhysicalSymptom[],
    energyLevel: number = 3
  ): PartnerEmpathyTip {
    // Acute symptom overrides
    if (symptoms.includes('cramps')) {
      return {
        emotionalVibe: 'Physical visceral discomfort & elevated pain threshold strain',
        energyForecast: 'Low — internal ATP reserves are allocated to uterine micro-repair',
        actionableIdea:
          'Heat up her heating pad without asking, prepare a hot cup of raspberry or chamomile tea, and take complete ownership of dinner and chores tonight.',
        communicationTip:
          'Keep your presence comforting, gentle, and unhurried; ask: "What can I take off your plate tonight?" rather than open-ended questions.',
      };
    }

    if (symptoms.includes('headache')) {
      return {
        emotionalVibe: 'Sensory overwhelm & heightened sensitivity to light and noise',
        energyForecast: 'Fragile — loud sounds, bright screens, or sudden plans will cause rapid drain',
        actionableIdea:
          'Dim the household lights, keep the room quiet and cool, bring a chilled water glass with electrolytes, and keep voices soft.',
        communicationTip:
          'Minimize back-and-forth decision making. Reassure her that she doesn’t need to host or entertain anyone.',
      };
    }

    if (symptoms.includes('insomnia') || symptoms.includes('cravings') || symptoms.includes('fatigue')) {
      return {
        emotionalVibe: 'Fluctuating neurosteroids / seeking emotional grounding and physical warmth',
        energyForecast: 'Gentle / afternoon energy dips are biologically expected',
        actionableIdea:
          'Surprise her with her favorite wholesome comfort food or a bar of dark chocolate, and prepare a cozy movie setup on the couch.',
        communicationTip:
          'Offer unprompted emotional validation: "I hear you, and it completely makes sense that you feel this way. I’ve got your back."',
      };
    }

    // Phase-specific guidance
    switch (phase) {
      case 'menstrual':
        return {
          emotionalVibe: 'Reflective, quiet, and deeply appreciative of peaceful consideration',
          energyForecast: 'Lowest biological energy baseline of the month — full recharge mode',
          actionableIdea:
            'Protect her sanctuary. Offer an unprompted neck or foot massage, restock any cycle supplies she needs, and handle household errands.',
          communicationTip:
            'Do not interpret her quietness as withdrawal. She is resting inward; simple warmth and thoughtful gestures mean the world right now.',
        };

      case 'follicular':
        return {
          emotionalVibe: 'Upbeat, intellectually curious, expressive, and energized',
          energyForecast: 'Rising steadily — physical stamina and cognitive optimism are high',
          actionableIdea:
            'Plan an engaging evening out, explore a new culinary spot or neighborhood walk together, and ask her about new ideas or goals on her mind.',
          communicationTip:
            'Match her enthusiasm! Be an active sounding board for her creative thoughts and celebrate her projects with genuine excitement.',
        };

      case 'ovulatory':
        return {
          emotionalVibe: 'Radiant, socially magnetic, confident, and communicative',
          energyForecast: 'Peak monthly vitality and dynamic enthusiasm',
          actionableIdea:
            'Plan a special romantic date night, take shared candid photos, and engage in active, fun, high-energy weekend adventures together.',
          communicationTip:
            'Be expressive with your appreciation and compliments. Her confidence is magnetic, and shared quality time feels especially connected.',
        };

      case 'luteal':
        return {
          emotionalVibe: 'Observant, nest-building, and sensitive to environmental disorder or stress',
          energyForecast: 'Calm & grounding — her body is burning up to 300 additional calories daily',
          actionableIdea:
            'Tidy up shared spaces without prompting, prepare a warm and satisfying dinner rich in healthy carbs, and run an evening bath for her.',
          communicationTip:
            'Avoid dismissive or unsolicited problem-solving. Practice patient, attentive listening and reinforce that she is appreciated and safe.',
        };
    }
  }
}
