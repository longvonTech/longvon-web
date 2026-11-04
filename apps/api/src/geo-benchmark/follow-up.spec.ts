import { pickLatestVersion } from './domain/versions';
import { capturedAtRange, parseFilterInstant } from './domain/validation';

describe('captured-at filters', () => {
  it('treats a date-only end as the end of that UTC day', () => {
    expect(parseFilterInstant('2026-11-04', 'from').toISOString()).toBe('2026-11-04T00:00:00.000Z');
    expect(parseFilterInstant('2026-11-04', 'to').toISOString()).toBe('2026-11-04T23:59:59.999Z');
    expect(capturedAtRange('2026-11-01', '2026-11-04')).toEqual({
      gte: new Date('2026-11-01T00:00:00.000Z'),
      lte: new Date('2026-11-04T23:59:59.999Z'),
    });
    expect(capturedAtRange()).toBeUndefined();
  });

  it('rejects a filter that is not a date', () => {
    expect(() => parseFilterInstant('yesterday', 'from')).toThrow(/ISO date/);
  });
});

describe('version selection', () => {
  it('prefers the highest version and then the newest capture', () => {
    expect(
      pickLatestVersion([
        { id: 'old', version: 1, capturedAt: '2026-11-01T00:00:00.000Z' },
        { id: 'newer-same-version', version: 1, capturedAt: '2026-11-03T00:00:00.000Z' },
      ])?.id,
    ).toBe('newer-same-version');
    expect(
      pickLatestVersion([
        { id: 'newest-v1', version: 1, capturedAt: '2026-11-04T00:00:00.000Z' },
        { id: 'reviewed-v2', version: 2, capturedAt: '2026-11-02T00:00:00.000Z' },
      ])?.id,
    ).toBe('reviewed-v2');
  });
});
