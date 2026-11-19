import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseService } from '../../src/services/storage/db';

describe('DatabaseService Multi-Account & Profile Manager', () => {
  let db: DatabaseService;

  beforeEach(async () => {
    db = new DatabaseService();
    await db.initialize();
  });

  it('starts by default with Suhani profile and personal profile available', () => {
    const profiles = db.getAllProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(2);
    expect(profiles.some((p) => p.id === 'suhani')).toBe(true);
    expect(profiles.some((p) => p.id === 'personal')).toBe(true);

    const active = db.getUserProfile();
    expect(active.id).toBe('personal');
    expect(active.name).toBe('My Account');
  });

  it('isolates cycle data when switching between profiles', async () => {
    // Switch to Suhani profile: has 47 cycles
    await db.switchProfile('suhani');
    const suhaniCycles = await db.getCycles();
    expect(suhaniCycles.length).toBe(47);

    // Switch to personal profile
    await db.switchProfile('personal');
    const personalActive = db.getUserProfile();
    expect(personalActive.id).toBe('personal');

    const personalCycles = await db.getCycles();
    // Personal profile starts with 0 or 1 baseline cycle, isolated from Suhani
    expect(personalCycles.length).toBeLessThan(47);

    // Add a cycle to personal profile
    await db.saveCycle({
      id: 'personal-c1',
      startDate: '2026-11-10',
      endDate: '2026-11-14',
      periodLengthDays: 5,
    });
    expect((await db.getCycles()).some((c) => c.id === 'personal-c1')).toBe(true);

    // Switch back to Suhani: her cycles are intact and do not contain personal-c1
    await db.switchProfile('suhani');
    const suhaniCyclesAgain = await db.getCycles();
    expect(suhaniCyclesAgain.length).toBe(47);
    expect(suhaniCyclesAgain.some((c) => c.id === 'personal-c1')).toBe(false);
  });

  it('allows creating a new custom profile and switching to it', async () => {
    const newProfile = await db.createProfile('Aria', '✨', 29, 5);
    expect(newProfile.name).toBe('Aria');
    expect(newProfile.avatar).toBe('✨');
    expect(db.getUserProfile().id).toBe(newProfile.id);

    const all = db.getAllProfiles();
    expect(all.some((p) => p.name === 'Aria')).toBe(true);
  });

  it('handles logout and login state correctly', async () => {
    expect(db.isLoggedIn()).toBe(true);
    await db.logout();
    expect(db.isLoggedIn()).toBe(false);

    await db.login('suhani');
    expect(db.isLoggedIn()).toBe(true);
    expect(db.getUserProfile().id).toBe('suhani');
  });
});
