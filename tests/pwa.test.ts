import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Progressive Web App (PWA) Configuration', () => {
  it('should have a valid web app manifest with required PWA metadata', () => {
    const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(content.name).toContain('PeriodFLO');
    expect(content.short_name).toBe('PeriodFLO');
    expect(content.start_url).toBe('/');
    expect(content.display).toBe('standalone');
    expect(content.theme_color).toBe('#E07A5F');
    expect(content.background_color).toBe('#FDFBF7');
    expect(content.icons.length).toBeGreaterThanOrEqual(2);

    const has192 = content.icons.some((i: any) => i.sizes === '192x192');
    const has512 = content.icons.some((i: any) => i.sizes === '512x512');
    expect(has192).toBe(true);
    expect(has512).toBe(true);
  });

  it('should have a service worker script implementing offline cache strategies', () => {
    const swPath = path.join(__dirname, '..', 'public', 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf8');
    expect(swContent).toContain('addEventListener(\'install\'');
    expect(swContent).toContain('addEventListener(\'activate\'');
    expect(swContent).toContain('addEventListener(\'fetch\'');
    expect(swContent).toContain('caches.open');
  });

  it('should have all required PWA icons generated in public directory', () => {
    const icon192 = path.join(__dirname, '..', 'public', 'icon-192.png');
    const icon512 = path.join(__dirname, '..', 'public', 'icon-512.png');
    const favicon = path.join(__dirname, '..', 'public', 'favicon.ico');

    expect(fs.existsSync(icon192)).toBe(true);
    expect(fs.existsSync(icon512)).toBe(true);
    expect(fs.existsSync(favicon)).toBe(true);

    expect(fs.statSync(icon192).size).toBeGreaterThan(0);
    expect(fs.statSync(icon512).size).toBeGreaterThan(0);
  });
});
