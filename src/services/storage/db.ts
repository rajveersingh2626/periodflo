import { PeriodCycle, DailyLog } from '../../types/cycle';
import { CryptoService } from './crypto';
import {
  SUHANI_PROFILE,
  DEFAULT_PERSONAL_PROFILE,
  SUHANI_CYCLES,
  SUHANI_LOGS,
  UserProfile,
} from './suhaniData';

interface ProfileDataStore {
  profile: UserProfile;
  cyclesStore: Map<string, string>; // id -> encrypted JSON
  logsStore: Map<string, string>; // date -> encrypted JSON
}

export class DatabaseService {
  private masterKey: string;
  private profiles: Map<string, ProfileDataStore> = new Map();
  private activeProfileId: string = 'personal';
  private loggedIn: boolean = true;
  private isInitialized = false;

  constructor() {
    this.masterKey = CryptoService.generateMasterKey();
    this.setupDefaultProfiles();
  }

  private setupDefaultProfiles(): void {
    // 1. Suhani profile
    const suhaniStore: ProfileDataStore = {
      profile: { ...SUHANI_PROFILE },
      cyclesStore: new Map(),
      logsStore: new Map(),
    };
    this.profiles.set('suhani', suhaniStore);

    // 2. Personal profile (clean slate / customizable)
    const personalStore: ProfileDataStore = {
      profile: { ...DEFAULT_PERSONAL_PROFILE },
      cyclesStore: new Map(),
      logsStore: new Map(),
    };
    this.profiles.set('personal', personalStore);

    // Pre-populate Suhani profile with her 47 cycles and logs
    for (const cycle of SUHANI_CYCLES) {
      const serialized = JSON.stringify(cycle);
      const encrypted = CryptoService.encrypt(serialized, this.masterKey);
      suhaniStore.cyclesStore.set(cycle.id, JSON.stringify(encrypted));
    }
    for (const log of SUHANI_LOGS) {
      const serialized = JSON.stringify(log);
      const encrypted = CryptoService.encrypt(serialized, this.masterKey);
      suhaniStore.logsStore.set(log.date, JSON.stringify(encrypted));
    }
  }

  public async initialize(dbPath: string = 'periodflo.db', seedDefault: boolean = false): Promise<void> {
    if (!this.isInitialized) {
      this.isInitialized = true;
      if (seedDefault) {
        await this.seedSuhaniData();
      }
    }
  }

  private getActiveStore(): ProfileDataStore {
    let store = this.profiles.get(this.activeProfileId);
    if (!store) {
      this.activeProfileId = 'suhani';
      store = this.profiles.get('suhani')!;
    }
    return store;
  }

  public getUserProfile(): UserProfile {
    return this.getActiveStore().profile;
  }

  public setUserProfile(profile: UserProfile): void {
    const store = this.getActiveStore();
    store.profile = profile;
    this.profiles.set(profile.id, store);
  }

  public getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).map((p) => p.profile);
  }

  public async switchProfile(profileId: string): Promise<void> {
    if (this.profiles.has(profileId)) {
      this.activeProfileId = profileId;
      this.loggedIn = true;
    }
  }

  public async createProfile(
    name: string,
    avatar: string = '✨',
    averageCycleLengthDays: number = 28,
    averagePeriodLengthDays: number = 5
  ): Promise<UserProfile> {
    const id = `profile-${Date.now()}`;
    const newProfile: UserProfile = {
      id,
      name,
      avatar,
      averageCycleLengthDays,
      averagePeriodLengthDays,
      estimatedLutealPhaseDays: 14,
      isCustomized: true,
    };
    this.profiles.set(id, {
      profile: newProfile,
      cyclesStore: new Map(),
      logsStore: new Map(),
    });
    this.activeProfileId = id;
    this.loggedIn = true;
    return newProfile;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public async logout(): Promise<void> {
    this.loggedIn = false;
  }

  public async login(profileId: string): Promise<void> {
    await this.switchProfile(profileId);
  }

  public async seedSuhaniData(): Promise<void> {
    this.activeProfileId = 'suhani';
    this.loggedIn = true;
    const suhaniStore = this.profiles.get('suhani');
    if (!suhaniStore) return;
    suhaniStore.cyclesStore.clear();
    suhaniStore.logsStore.clear();
    for (const cycle of SUHANI_CYCLES) {
      const serialized = JSON.stringify(cycle);
      const encrypted = CryptoService.encrypt(serialized, this.masterKey);
      suhaniStore.cyclesStore.set(cycle.id, JSON.stringify(encrypted));
    }
    for (const log of SUHANI_LOGS) {
      const serialized = JSON.stringify(log);
      const encrypted = CryptoService.encrypt(serialized, this.masterKey);
      suhaniStore.logsStore.set(log.date, JSON.stringify(encrypted));
    }
  }

  public setMasterKey(key: string): void {
    this.masterKey = key;
  }

  public getMasterKey(): string {
    return this.masterKey;
  }

  public async saveCycle(cycle: PeriodCycle): Promise<void> {
    const store = this.getActiveStore();
    const serialized = JSON.stringify(cycle);
    const encrypted = CryptoService.encrypt(serialized, this.masterKey);
    store.cyclesStore.set(cycle.id, JSON.stringify(encrypted));
  }

  public async getCycles(): Promise<PeriodCycle[]> {
    const store = this.getActiveStore();
    const list: PeriodCycle[] = [];
    for (const encryptedStr of store.cyclesStore.values()) {
      const payload = JSON.parse(encryptedStr);
      const decrypted = CryptoService.decrypt(payload, this.masterKey);
      list.push(JSON.parse(decrypted));
    }
    return list.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  public async saveDailyLog(log: DailyLog): Promise<void> {
    const store = this.getActiveStore();
    const serialized = JSON.stringify(log);
    const encrypted = CryptoService.encrypt(serialized, this.masterKey);
    store.logsStore.set(log.date, JSON.stringify(encrypted));
  }

  public async getDailyLog(date: string): Promise<DailyLog | null> {
    const store = this.getActiveStore();
    const encryptedStr = store.logsStore.get(date);
    if (!encryptedStr) return null;
    const payload = JSON.parse(encryptedStr);
    const decrypted = CryptoService.decrypt(payload, this.masterKey);
    return JSON.parse(decrypted);
  }

  public async getDailyLogs(): Promise<DailyLog[]> {
    const store = this.getActiveStore();
    const list: DailyLog[] = [];
    for (const encryptedStr of store.logsStore.values()) {
      const payload = JSON.parse(encryptedStr);
      const decrypted = CryptoService.decrypt(payload, this.masterKey);
      list.push(JSON.parse(decrypted));
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }

  public async wipeDatabase(): Promise<void> {
    const store = this.getActiveStore();
    store.cyclesStore.clear();
    store.logsStore.clear();
    this.masterKey = CryptoService.generateMasterKey();
  }
}

export const dbService = new DatabaseService();
