import fs from 'fs';
import path from 'path';
import { geoBenchmarkApiPath } from './domain/proxy-path';
import { verifyAdminToken } from '../common/admin-auth.util';

describe('geo benchmark authorization', () => {
  const original = process.env.ADMIN_IMAGE_PASSWORD;

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_IMAGE_PASSWORD;
    else process.env.ADMIN_IMAGE_PASSWORD = original;
  });

  it('rejects a missing or wrong admin token', () => {
    process.env.ADMIN_IMAGE_PASSWORD = 'geo-admin-test-secret';
    expect(() => verifyAdminToken(undefined)).toThrow();
    expect(() => verifyAdminToken('wrong-token')).toThrow();
  });

  it('accepts the configured admin token', () => {
    process.env.ADMIN_IMAGE_PASSWORD = 'geo-admin-test-secret';
    expect(() => verifyAdminToken('geo-admin-test-secret')).not.toThrow();
  });

  it('requires the admin token on every benchmark route', () => {
    const source = fs.readFileSync(path.join(__dirname, 'geo-benchmark.controller.ts'), 'utf8');
    const routes = source.match(/@(Get|Post|Patch)\(/g) ?? [];
    const checks = source.match(/verifyAdminToken\(token\)/g) ?? [];
    expect(routes.length).toBeGreaterThanOrEqual(12);
    expect(checks).toHaveLength(routes.length);
  });
});

describe('geo admin proxy', () => {
  it('forwards only the benchmark path and keeps the token out of the response body', () => {
    expect(geoBenchmarkApiPath('/api/admin/geo/providers', '')).toBe(
      '/admin/geo-benchmark/providers',
    );
    expect(geoBenchmarkApiPath('/api/admin/geo/results/abc', '?format=json')).toBe(
      '/admin/geo-benchmark/results/abc?format=json',
    );
    expect(() => geoBenchmarkApiPath('/api/admin/geo/../news', '')).toThrow(/Rejected/);
    expect(() => geoBenchmarkApiPath('/api/admin/news', '')).toThrow(/Rejected/);
    expect(() =>
      geoBenchmarkApiPath('/api/admin/geo/providers', '?next=https://evil.example'),
    ).toThrow(/Rejected/);

    const proxy = fs.readFileSync(
      path.join(__dirname, '../../../../apps/web/app/api/admin/_lib/proxy.ts'),
      'utf8',
    );
    expect(proxy).toContain("'x-admin-token'");
    expect(proxy).not.toMatch(/console\./);
    const route = fs.readFileSync(
      path.join(__dirname, '../../../../apps/web/app/api/admin/geo/[...path]/route.ts'),
      'utf8',
    );
    expect(route).toContain('geoBenchmarkApiPath');
    expect(route).not.toContain('mateyou-admin');
    const webHelper = fs.readFileSync(
      path.join(__dirname, '../../../../apps/web/app/api/admin/_lib/geo-proxy-path.ts'),
      'utf8',
    );
    const apiHelper = fs.readFileSync(path.join(__dirname, 'domain/proxy-path.ts'), 'utf8');
    expect(webHelper.trim()).toBe(apiHelper.trim());
  });
});
