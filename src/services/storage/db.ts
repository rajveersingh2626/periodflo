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
  private isSeeding = false;

  constructor() {
    this.masterKey = CryptoService.generateMasterKey();
    this.setupDefaultProfiles();
    this.loadFromLocalStorage();
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
  }

  private persistProfile(profileId: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const store = this.profiles.get(profileId);
      if (!store) return;
      const cyclesObj: Record<string, string> = {};
      store.cyclesStore.forEach((v, k) => {
        cyclesObj[k] = v;
      });
      window.localStorage.setItem(`periodflo_v1_cycles_${profileId}`, JSON.stringify(cyclesObj));

      const logsObj: Record<string, string> = {};
      store.logsStore.forEach((v, k) => {
        logsObj[k] = v;
      });
      window.localStorage.setItem(`periodflo_v1_logs_${profileId}`, JSON.stringify(logsObj));

      const allProfiles = this.getAllProfiles();
      window.localStorage.setItem('periodflo_v1_profiles', JSON.stringify(allProfiles));
      window.localStorage.setItem('periodflo_v1_active_profile', this.activeProfileId);
      window.localStorage.setItem('periodflo_v1_master_key', this.masterKey);
    } catch {
      // Ignore localStorage errors (e.g. quota or sandbox restrictions)
    }
  }

  private persistAll(): void {
    for (const profileId of this.profiles.keys()) {
      this.persistProfile(profileId);
    }
  }

  private clearLocalStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('periodflo_v1_')) {
          keysToRemove.push(key);
        }
      }
      for (const k of keysToRemove) {
        window.localStorage.removeItem(k);
      }
    } catch {
      // Ignore
    }
  }

  private loadFromLocalStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const savedKey = window.localStorage.getItem('periodflo_v1_master_key');
      if (savedKey) {
        this.masterKey = savedKey;
      }
      const savedActiveProfile = window.localStorage.getItem('periodflo_v1_active_profile');
      if (savedActiveProfile) {
        this.activeProfileId = savedActiveProfile;
      }
      const savedProfilesStr = window.localStorage.getItem('periodflo_v1_profiles');
      if (savedProfilesStr) {
        const savedProfiles: UserProfile[] = JSON.parse(savedProfilesStr);
        for (const p of savedProfiles) {
          const cyclesStr = window.localStorage.getItem(`periodflo_v1_cycles_${p.id}`);
          const logsStr = window.localStorage.getItem(`periodflo_v1_logs_${p.id}`);
          const cyclesMap = new Map<string, string>();
          const logsMap = new Map<string, string>();
          if (cyclesStr) {
            const obj = JSON.parse(cyclesStr);
            Object.keys(obj).forEach((k) => cyclesMap.set(k, obj[k]));
          }
          if (logsStr) {
            const obj = JSON.parse(logsStr);
            Object.keys(obj).forEach((k) => logsMap.set(k, obj[k]));
          }
          this.profiles.set(p.id, {
            profile: p,
            cyclesStore: cyclesMap,
            logsStore: logsMap,
          });
        }
      }
    } catch {
      // Fallback gracefully to default in-memory stores
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
    this.persistProfile(profile.id);
  }

  public getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).map((p) => p.profile);
  }

  public async switchProfile(profileId: string): Promise<void> {
    if (this.profiles.has(profileId)) {
      this.activeProfileId = profileId;
      this.loggedIn = true;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('periodflo_v1_active_profile', profileId);
      }
    }
  }

  public async createProfile(
    name: string,
    avatar: string = 'U',
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
    this.persistProfile(id);
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
    if (this.isSeeding) return;
    this.isSeeding = true;
    try {
      this.activeProfileId = 'suhani';
      this.loggedIn = true;
      let suhaniStore = this.profiles.get('suhani');
      if (!suhaniStore) {
        suhaniStore = {
          profile: { ...SUHANI_PROFILE },
          cyclesStore: new Map(),
          logsStore: new Map(),
        };
        this.profiles.set('suhani', suhaniStore);
      }
      suhaniStore.cyclesStore.clear();
      suhaniStore.logsStore.clear();

      for (const cycle of SUHANI_CYCLES) {
        const serialized = JSON.stringify(cycle);
        const encrypted = await CryptoService.encrypt(serialized, this.masterKey);
        suhaniStore.cyclesStore.set(cycle.id, JSON.stringify(encrypted));
      }
      for (const log of SUHANI_LOGS) {
        const serialized = JSON.stringify(log);
        const encrypted = await CryptoService.encrypt(serialized, this.masterKey);
        suhaniStore.logsStore.set(log.date, JSON.stringify(encrypted));
      }
      this.persistProfile('suhani');
    } finally {
      this.isSeeding = false;
    }
  }

  public setMasterKey(key: string): void {
    this.masterKey = key;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('periodflo_v1_master_key', key);
    }
  }

  public getMasterKey(): string {
    return this.masterKey;
  }

  public async saveCycle(cycle: PeriodCycle): Promise<void> {
    const store = this.getActiveStore();
    const serialized = JSON.stringify(cycle);
    const encrypted = await CryptoService.encrypt(serialized, this.masterKey);
    store.cyclesStore.set(cycle.id, JSON.stringify(encrypted));
    this.persistProfile(this.activeProfileId);
  }

  public async getCycles(): Promise<PeriodCycle[]> {
    let store = this.getActiveStore();
    if (this.activeProfileId === 'suhani' && store.cyclesStore.size === 0 && !this.isSeeding) {
      await this.seedSuhaniData();
      store = this.getActiveStore();
    }
    const list: PeriodCycle[] = [];
    for (const encryptedStr of store.cyclesStore.values()) {
      const payload = JSON.parse(encryptedStr);
      const decrypted = await CryptoService.decrypt(payload, this.masterKey);
      list.push(JSON.parse(decrypted));
    }
    return list.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  public async saveDailyLog(log: DailyLog): Promise<void> {
    const store = this.getActiveStore();
    const serialized = JSON.stringify(log);
    const encrypted = await CryptoService.encrypt(serialized, this.masterKey);
    store.logsStore.set(log.date, JSON.stringify(encrypted));
    this.persistProfile(this.activeProfileId);
  }

  public async getDailyLog(date: string): Promise<DailyLog | null> {
    let store = this.getActiveStore();
    if (this.activeProfileId === 'suhani' && store.logsStore.size === 0 && !this.isSeeding) {
      await this.seedSuhaniData();
      store = this.getActiveStore();
    }
    const encryptedStr = store.logsStore.get(date);
    if (!encryptedStr) return null;
    const payload = JSON.parse(encryptedStr);
    const decrypted = await CryptoService.decrypt(payload, this.masterKey);
    return JSON.parse(decrypted);
  }

  public async getDailyLogs(): Promise<DailyLog[]> {
    let store = this.getActiveStore();
    if (this.activeProfileId === 'suhani' && store.logsStore.size === 0 && !this.isSeeding) {
      await this.seedSuhaniData();
      store = this.getActiveStore();
    }
    const list: DailyLog[] = [];
    for (const encryptedStr of store.logsStore.values()) {
      const payload = JSON.parse(encryptedStr);
      const decrypted = await CryptoService.decrypt(payload, this.masterKey);
      list.push(JSON.parse(decrypted));
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }

  public async wipeDatabase(): Promise<void> {
    const store = this.getActiveStore();
    store.cyclesStore.clear();
    store.logsStore.clear();
    this.masterKey = CryptoService.generateMasterKey();
    this.clearLocalStorage();
  }
}

export const dbService = new DatabaseService();
