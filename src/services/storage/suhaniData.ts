import { PeriodCycle, DailyLog, CycleBaseline } from '../../types/cycle';

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  averageCycleLengthDays: number;
  averagePeriodLengthDays: number;
  estimatedLutealPhaseDays: number;
  isCustomized: boolean;
}

export const SUHANI_PROFILE: UserProfile = {
  id: "suhani",
  name: "Suhani",
  avatar: "🌸",
  averageCycleLengthDays: 30,
  averagePeriodLengthDays: 4,
  estimatedLutealPhaseDays: 14,
  isCustomized: true,
};

export const DEFAULT_PERSONAL_PROFILE: UserProfile = {
  id: "personal",
  name: "My Account",
  avatar: "🌿",
  averageCycleLengthDays: 28,
  averagePeriodLengthDays: 5,
  estimatedLutealPhaseDays: 14,
  isCustomized: false,
};

export const SUHANI_CYCLES: PeriodCycle[] = [
  {
    "id": "cycle-2026-11-02",
    "startDate": "2026-11-02",
    "endDate": "2026-11-05",
    "periodLengthDays": 4
  },
  {
    "id": "cycle-2026-10-03",
    "startDate": "2026-10-03",
    "endDate": "2026-10-07",
    "periodLengthDays": 5,
    "cycleLengthDays": 30
  },
  {
    "id": "cycle-2026-09-04",
    "startDate": "2026-09-04",
    "endDate": "2026-09-08",
    "periodLengthDays": 5,
    "cycleLengthDays": 29
  },
  {
    "id": "cycle-2026-08-06",
    "startDate": "2026-08-06",
    "endDate": "2026-08-10",
    "periodLengthDays": 5,
    "cycleLengthDays": 29
  },
  {
    "id": "cycle-2026-07-06",
    "startDate": "2026-07-06",
    "endDate": "2026-07-09",
    "periodLengthDays": 4,
    "cycleLengthDays": 31
  },
  {
    "id": "cycle-2026-06-01",
    "startDate": "2026-06-01",
    "endDate": "2026-06-04",
    "periodLengthDays": 4,
    "cycleLengthDays": 35
  },
  {
    "id": "cycle-2026-04-28",
    "startDate": "2026-04-28",
    "endDate": "2026-05-02",
    "periodLengthDays": 5,
    "cycleLengthDays": 34
  },
  {
    "id": "cycle-2026-03-18",
    "startDate": "2026-03-18",
    "endDate": "2026-03-23",
    "periodLengthDays": 6,
    "cycleLengthDays": 41
  },
  {
    "id": "cycle-2026-02-17",
    "startDate": "2026-02-17",
    "endDate": "2026-02-22",
    "periodLengthDays": 6,
    "cycleLengthDays": 29
  },
  {
    "id": "cycle-2026-01-20",
    "startDate": "2026-01-20",
    "endDate": "2026-01-24",
    "periodLengthDays": 5,
    "cycleLengthDays": 28
  },
  {
    "id": "cycle-2025-12-22",
    "startDate": "2025-12-22",
    "endDate": "2025-12-26",
    "periodLengthDays": 5,
    "cycleLengthDays": 29
  },
  {
    "id": "cycle-2025-11-21",
    "startDate": "2025-11-21",
    "endDate": "2025-11-25",
    "periodLengthDays": 5,
    "cycleLengthDays": 31
  },
  {
    "id": "cycle-2025-10-22",
    "startDate": "2025-10-22",
    "endDate": "2025-10-26",
    "periodLengthDays": 5,
    "cycleLengthDays": 30
  },
  {
    "id": "cycle-2025-09-14",
    "startDate": "2025-09-14",
    "endDate": "2025-09-19",
    "periodLengthDays": 6,
    "cycleLengthDays": 38
  },
  {
    "id": "cycle-2025-08-08",
    "startDate": "2025-08-08",
    "endDate": "2025-08-13",
    "periodLengthDays": 6,
    "cycleLengthDays": 37
  },
  {
    "id": "cycle-2025-07-04",
    "startDate": "2025-07-04",
    "endDate": "2025-07-10",
    "periodLengthDays": 7,
    "cycleLengthDays": 35
  },
  {
    "id": "cycle-2025-06-18",
    "startDate": "2025-06-18",
    "endDate": "2025-06-24",
    "periodLengthDays": 7,
    "cycleLengthDays": 16
  },
  {
    "id": "cycle-2025-05-29",
    "startDate": "2025-05-29",
    "endDate": "2025-06-02",
    "periodLengthDays": 5,
    "cycleLengthDays": 20
  },
  {
    "id": "cycle-2025-05-01",
    "startDate": "2025-05-01",
    "endDate": "2025-05-06",
    "periodLengthDays": 6,
    "cycleLengthDays": 28
  },
  {
    "id": "cycle-2025-03-27",
    "startDate": "2025-03-27",
    "endDate": "2025-04-01",
    "periodLengthDays": 6,
    "cycleLengthDays": 35
  },
  {
    "id": "cycle-2025-02-21",
    "startDate": "2025-02-21",
    "endDate": "2025-02-27",
    "periodLengthDays": 7,
    "cycleLengthDays": 34
  },
  {
    "id": "cycle-2025-01-19",
    "startDate": "2025-01-19",
    "endDate": "2025-01-24",
    "periodLengthDays": 6,
    "cycleLengthDays": 33
  },
  {
    "id": "cycle-2024-12-19",
    "startDate": "2024-12-19",
    "endDate": "2024-12-23",
    "periodLengthDays": 5,
    "cycleLengthDays": 31
  },
  {
    "id": "cycle-2024-11-22",
    "startDate": "2024-11-22",
    "endDate": "2024-11-27",
    "periodLengthDays": 6,
    "cycleLengthDays": 27
  },
  {
    "id": "cycle-2024-10-23",
    "startDate": "2024-10-23",
    "endDate": "2024-10-28",
    "periodLengthDays": 6,
    "cycleLengthDays": 30
  },
  {
    "id": "cycle-2024-09-21",
    "startDate": "2024-09-21",
    "endDate": "2024-09-26",
    "periodLengthDays": 6,
    "cycleLengthDays": 32
  },
  {
    "id": "cycle-2024-08-13",
    "startDate": "2024-08-13",
    "endDate": "2024-08-17",
    "periodLengthDays": 5,
    "cycleLengthDays": 39
  },
  {
    "id": "cycle-2024-07-10",
    "startDate": "2024-07-10",
    "endDate": "2024-07-15",
    "periodLengthDays": 6,
    "cycleLengthDays": 34
  },
  {
    "id": "cycle-2024-06-05",
    "startDate": "2024-06-05",
    "endDate": "2024-06-10",
    "periodLengthDays": 6,
    "cycleLengthDays": 35
  },
  {
    "id": "cycle-2024-05-02",
    "startDate": "2024-05-02",
    "endDate": "2024-05-07",
    "periodLengthDays": 6,
    "cycleLengthDays": 34
  },
  {
    "id": "cycle-2024-04-04",
    "startDate": "2024-04-04",
    "endDate": "2024-04-08",
    "periodLengthDays": 5,
    "cycleLengthDays": 28
  },
  {
    "id": "cycle-2024-03-06",
    "startDate": "2024-03-06",
    "endDate": "2024-03-10",
    "periodLengthDays": 5,
    "cycleLengthDays": 29
  },
  {
    "id": "cycle-2024-02-07",
    "startDate": "2024-02-07",
    "endDate": "2024-02-12",
    "periodLengthDays": 6,
    "cycleLengthDays": 28
  },
  {
    "id": "cycle-2024-01-05",
    "startDate": "2024-01-05",
    "endDate": "2024-01-10",
    "periodLengthDays": 6,
    "cycleLengthDays": 33
  },
  {
    "id": "cycle-2023-11-28",
    "startDate": "2023-11-28",
    "endDate": "2023-12-02",
    "periodLengthDays": 5,
    "cycleLengthDays": 38
  },
  {
    "id": "cycle-2023-10-28",
    "startDate": "2023-10-28",
    "endDate": "2023-11-01",
    "periodLengthDays": 5,
    "cycleLengthDays": 31
  },
  {
    "id": "cycle-2023-09-24",
    "startDate": "2023-09-24",
    "endDate": "2023-09-29",
    "periodLengthDays": 6,
    "cycleLengthDays": 34
  },
  {
    "id": "cycle-2023-08-24",
    "startDate": "2023-08-24",
    "endDate": "2023-08-28",
    "periodLengthDays": 5,
    "cycleLengthDays": 31
  },
  {
    "id": "cycle-2023-07-18",
    "startDate": "2023-07-18",
    "endDate": "2023-07-24",
    "periodLengthDays": 7,
    "cycleLengthDays": 37
  },
  {
    "id": "cycle-2023-06-07",
    "startDate": "2023-06-07",
    "endDate": "2023-06-13",
    "periodLengthDays": 7,
    "cycleLengthDays": 41
  },
  {
    "id": "cycle-2023-05-01",
    "startDate": "2023-05-01",
    "endDate": "2023-05-06",
    "periodLengthDays": 6,
    "cycleLengthDays": 37
  },
  {
    "id": "cycle-2023-03-28",
    "startDate": "2023-03-28",
    "endDate": "2023-04-02",
    "periodLengthDays": 6,
    "cycleLengthDays": 34
  },
  {
    "id": "cycle-2023-02-25",
    "startDate": "2023-02-25",
    "endDate": "2023-03-02",
    "periodLengthDays": 6,
    "cycleLengthDays": 31
  },
  {
    "id": "cycle-2023-01-23",
    "startDate": "2023-01-23",
    "endDate": "2023-01-27",
    "periodLengthDays": 5,
    "cycleLengthDays": 33
  },
  {
    "id": "cycle-2023-01-11",
    "startDate": "2023-01-11",
    "endDate": "2023-01-15",
    "periodLengthDays": 5
  },
  {
    "id": "cycle-2022-12-19",
    "startDate": "2022-12-19",
    "endDate": "2022-12-24",
    "periodLengthDays": 6,
    "cycleLengthDays": 23
  },
  {
    "id": "cycle-2022-11-19",
    "startDate": "2022-11-19",
    "endDate": "2022-11-24",
    "periodLengthDays": 6,
    "cycleLengthDays": 30
  }
];

export const SUHANI_LOGS: DailyLog[] = [
  {
    "id": "log-2026-11-05",
    "date": "2026-11-05",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-11-02",
    "date": "2026-11-02",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-11-01",
    "date": "2026-11-01",
    "symptoms": [
      "cravings"
    ],
    "moods": [
      "irritable"
    ]
  },
  {
    "id": "log-2026-10-07",
    "date": "2026-10-07",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-10-03",
    "date": "2026-10-03",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-10-02",
    "date": "2026-10-02",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-09-30",
    "date": "2026-09-30",
    "symptoms": [],
    "moods": [
      "sensitive",
      "irritable"
    ]
  },
  {
    "id": "log-2026-09-29",
    "date": "2026-09-29",
    "symptoms": [
      "fatigue"
    ],
    "moods": [
      "irritable",
      "sensitive",
      "low_energy",
      "anxious"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2026-09-26",
    "date": "2026-09-26",
    "symptoms": [
      "nausea",
      "fatigue"
    ],
    "moods": [
      "sensitive"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2026-09-08",
    "date": "2026-09-08",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-09-04",
    "date": "2026-09-04",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-08-29",
    "date": "2026-08-29",
    "symptoms": [
      "backache"
    ],
    "moods": [
      "irritable",
      "anxious"
    ]
  },
  {
    "id": "log-2026-08-10",
    "date": "2026-08-10",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-08-06",
    "date": "2026-08-06",
    "flowIntensity": "medium",
    "symptoms": [
      "cramps",
      "fatigue",
      "bloating",
      "backache"
    ],
    "moods": [
      "low_energy",
      "sensitive"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2026-08-05",
    "date": "2026-08-05",
    "flowIntensity": "spotting",
    "symptoms": [
      "headache"
    ],
    "moods": []
  },
  {
    "id": "log-2026-08-03",
    "date": "2026-08-03",
    "flowIntensity": "spotting",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-07-09",
    "date": "2026-07-09",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-07-06",
    "date": "2026-07-06",
    "flowIntensity": "medium",
    "symptoms": [
      "cramps",
      "fatigue"
    ],
    "moods": [],
    "energyLevel": 2
  },
  {
    "id": "log-2026-06-04",
    "date": "2026-06-04",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-06-01",
    "date": "2026-06-01",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-05-02",
    "date": "2026-05-02",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-04-28",
    "date": "2026-04-28",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-03-23",
    "date": "2026-03-23",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-03-18",
    "date": "2026-03-18",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-02-22",
    "date": "2026-02-22",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-02-17",
    "date": "2026-02-17",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-01-24",
    "date": "2026-01-24",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2026-01-20",
    "date": "2026-01-20",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-12-26",
    "date": "2025-12-26",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-12-22",
    "date": "2025-12-22",
    "flowIntensity": "medium",
    "symptoms": [
      "cramps",
      "bloating"
    ],
    "moods": []
  },
  {
    "id": "log-2025-11-25",
    "date": "2025-11-25",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-11-21",
    "date": "2025-11-21",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-10-26",
    "date": "2025-10-26",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-10-22",
    "date": "2025-10-22",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-10-17",
    "date": "2025-10-17",
    "symptoms": [],
    "moods": [
      "irritable"
    ]
  },
  {
    "id": "log-2025-09-19",
    "date": "2025-09-19",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-09-17",
    "date": "2025-09-17",
    "symptoms": [],
    "moods": [
      "irritable",
      "low_energy",
      "sensitive"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2025-09-14",
    "date": "2025-09-14",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-08-13",
    "date": "2025-08-13",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-08-08",
    "date": "2025-08-08",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-07-10",
    "date": "2025-07-10",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-07-04",
    "date": "2025-07-04",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-06-24",
    "date": "2025-06-24",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-06-18",
    "date": "2025-06-18",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-06-02",
    "date": "2025-06-02",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-05-29",
    "date": "2025-05-29",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-05-06",
    "date": "2025-05-06",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-05-01",
    "date": "2025-05-01",
    "flowIntensity": "light",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-04-01",
    "date": "2025-04-01",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-03-27",
    "date": "2025-03-27",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-02-27",
    "date": "2025-02-27",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-02-21",
    "date": "2025-02-21",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-01-24",
    "date": "2025-01-24",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2025-01-19",
    "date": "2025-01-19",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-12-23",
    "date": "2024-12-23",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-12-19",
    "date": "2024-12-19",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-11-27",
    "date": "2024-11-27",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-11-22",
    "date": "2024-11-22",
    "flowIntensity": "heavy",
    "symptoms": [
      "cramps",
      "fatigue",
      "backache"
    ],
    "moods": [
      "irritable",
      "sensitive",
      "low_energy",
      "anxious"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2024-10-28",
    "date": "2024-10-28",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-10-23",
    "date": "2024-10-23",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-09-26",
    "date": "2024-09-26",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-09-21",
    "date": "2024-09-21",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-08-17",
    "date": "2024-08-17",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-08-13",
    "date": "2024-08-13",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-07-15",
    "date": "2024-07-15",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-07-11",
    "date": "2024-07-11",
    "flowIntensity": "heavy",
    "symptoms": [
      "cramps",
      "fatigue"
    ],
    "moods": [
      "irritable",
      "low_energy"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2024-07-10",
    "date": "2024-07-10",
    "flowIntensity": "medium",
    "symptoms": [
      "cramps",
      "fatigue"
    ],
    "moods": [
      "irritable",
      "sensitive"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2024-06-10",
    "date": "2024-06-10",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-06-05",
    "date": "2024-06-05",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-05-07",
    "date": "2024-05-07",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-05-02",
    "date": "2024-05-02",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-04-08",
    "date": "2024-04-08",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-04-04",
    "date": "2024-04-04",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-03-10",
    "date": "2024-03-10",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-03-06",
    "date": "2024-03-06",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-02-12",
    "date": "2024-02-12",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-02-07",
    "date": "2024-02-07",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-01-10",
    "date": "2024-01-10",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2024-01-05",
    "date": "2024-01-05",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-12-02",
    "date": "2023-12-02",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-11-28",
    "date": "2023-11-28",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-11-01",
    "date": "2023-11-01",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-10-28",
    "date": "2023-10-28",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-09-29",
    "date": "2023-09-29",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-09-24",
    "date": "2023-09-24",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-08-28",
    "date": "2023-08-28",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-08-24",
    "date": "2023-08-24",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-07-24",
    "date": "2023-07-24",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-07-18",
    "date": "2023-07-18",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-06-13",
    "date": "2023-06-13",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-06-07",
    "date": "2023-06-07",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-05-06",
    "date": "2023-05-06",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-05-01",
    "date": "2023-05-01",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-04-02",
    "date": "2023-04-02",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-03-28",
    "date": "2023-03-28",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-03-02",
    "date": "2023-03-02",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-02-25",
    "date": "2023-02-25",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-01-27",
    "date": "2023-01-27",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-01-23",
    "date": "2023-01-23",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-01-15",
    "date": "2023-01-15",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2023-01-11",
    "date": "2023-01-11",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2022-12-24",
    "date": "2022-12-24",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2022-12-19",
    "date": "2022-12-19",
    "flowIntensity": "light",
    "symptoms": [
      "cramps",
      "fatigue"
    ],
    "moods": [
      "low_energy",
      "anxious"
    ],
    "energyLevel": 2
  },
  {
    "id": "log-2022-11-24",
    "date": "2022-11-24",
    "symptoms": [],
    "moods": []
  },
  {
    "id": "log-2022-11-20",
    "date": "2022-11-20",
    "flowIntensity": "medium",
    "symptoms": [
      "backache",
      "cramps"
    ],
    "moods": [
      "calm"
    ],
    "notes": "Weight: 94.78 kg"
  },
  {
    "id": "log-2022-11-19",
    "date": "2022-11-19",
    "flowIntensity": "medium",
    "symptoms": [],
    "moods": []
  }
];

export const SUHANI_BASELINE: CycleBaseline = {
  averageCycleLengthDays: 30,
  averagePeriodLengthDays: 4,
  estimatedLutealPhaseDays: 14,
  regularityScore: 92,
  totalCyclesAnalyzed: 47,
};
