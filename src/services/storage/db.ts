import { PeriodCycle, DailyLog } from '../../types/cycle';
import { CryptoService } from './crypto';
import {
  SUHANI_PROFILE,
  SUHANI_CYCLES,
  SUHANI_LOGS,
  UserProfile,
} from './suhaniData';

export class DatabaseService {
  private masterKey: string;
  private cyclesStore: Map<string, string> = new Map(); // id -> encrypted JSON
  private logsStore: Map<string, string> = new Map(); // date -> encrypted JSON
  private userProfile: UserProfile = { ...SUHANI_PROFILE };
  private isInitialized = false;

  constructor() {
    this.masterKey = CryptoService.generateMasterKey();
  }

  public async initialize(dbPath: string = 'periodflo.db', seedDefault: boolean = false): Promise<void> {
    if (!this.isInitialized) {
      this.isInitialized = true;
      if (seedDefault && this.cyclesStore.size === 0) {
        await this.seedSuhaniData();
      }
    }
  }

  public getUserProfile(): UserProfile {
    return this.userProfile;
  }

  public setUserProfile(profile: UserProfile): void {
    this.userProfile = profile;
  }

  public async seedSuhaniData(): Promise<void> {
    this.userProfile = { ...SUHANI_PROFILE };
    for (const cycle of SUHANI_CYCLES) {
      await this.saveCycle(cycle);
    }
    for (const log of SUHANI_LOGS) {
      await this.saveDailyLog(log);
    }
  }

  public setMasterKey(key: string): void {
    this.masterKey = key;
  }

  public getMasterKey(): string {
    return this.masterKey;
  }

  public async saveCycle(cycle: PeriodCycle): Promise<void> {
    const serialized = JSON.stringify(cycle);
    const encrypted = CryptoService.encrypt(serialized, this.masterKey);
    this.cyclesStore.set(cycle.id, JSON.stringify(encrypted));
  }

  public async getCycles(): Promise<PeriodCycle[]> {
    const list: PeriodCycle[] = [];
    for (const encryptedStr of this.cyclesStore.values()) {
      const payload = JSON.parse(encryptedStr);
      const decrypted = CryptoService.decrypt(payload, this.masterKey);
      list.push(JSON.parse(decrypted));
    }
    // Sort descending by startDate
    return list.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  public async saveDailyLog(log: DailyLog): Promise<void> {
    const serialized = JSON.stringify(log);
    const encrypted = CryptoService.encrypt(serialized, this.masterKey);
    this.logsStore.set(log.date, JSON.stringify(encrypted));
  }

  public async getDailyLog(date: string): Promise<DailyLog | null> {
    const encryptedStr = this.logsStore.get(date);
    if (!encryptedStr) return null;
    const payload = JSON.parse(encryptedStr);
    const decrypted = CryptoService.decrypt(payload, this.masterKey);
    return JSON.parse(decrypted);
  }

  public async getDailyLogs(): Promise<DailyLog[]> {
    const list: DailyLog[] = [];
    for (const encryptedStr of this.logsStore.values()) {
      const payload = JSON.parse(encryptedStr);
      const decrypted = CryptoService.decrypt(payload, this.masterKey);
      list.push(JSON.parse(decrypted));
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }

  public async wipeDatabase(): Promise<void> {
    this.cyclesStore.clear();
    this.logsStore.clear();
    // Rotate master key on wipe to ensure cryptographic erasure
    this.masterKey = CryptoService.generateMasterKey();
  }
}

export const dbService = new DatabaseService();
