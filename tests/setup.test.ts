import { describe, it, expect } from 'vitest';
import { Colors } from '../src/theme/colors';
import { SpringConfigs } from '../src/theme/springs';

describe('Project Foundation & Theme Tokens', () => {
  it('should export all required palette colors according to Apple/Emil design principles', () => {
    expect(Colors).toBeDefined();
    expect(Colors.light).toBeDefined();
    expect(Colors.dark).toBeDefined();

    // Warm, restorative, non-clinical palette
    expect(Colors.light.terracotta).toBe('#E07A5F');
    expect(Colors.light.sand).toBe('#FDFBF7');
    expect(Colors.light.sage).toBe('#81B29A');
    expect(Colors.light.mauve).toBe('#8D82A2');

    // Dark mode obsidian
    expect(Colors.dark.background).toBe('#121214');
  });

  it('should define Apple WWDC fluid spring curves', () => {
    expect(SpringConfigs).toBeDefined();
    expect(SpringConfigs.snappy).toEqual({ damping: 20, stiffness: 300, mass: 0.8 });
    expect(SpringConfigs.gentle).toEqual({ damping: 26, stiffness: 180, mass: 1 });
    expect(SpringConfigs.tactileScale).toBe(0.97);
  });
});
