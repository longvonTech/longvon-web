import { CloudIntegrationService } from './cloud-integration.service';

describe('CloudIntegrationService', () => {
  const service = new CloudIntegrationService();

  it('exposes the SDK-derived upload catalog in metadata-only mode', () => {
    const catalog = service.getCatalog();
    expect(catalog.mode).toBe('metadata-only');
    expect(catalog.outboundUploadEnabled).toBe(false);
    expect(catalog.dataPersistenceEnabled).toBe(false);
    expect(catalog.operations.map((item) => item.operation)).toEqual(
      expect.arrayContaining([
        'heart-rate',
        'spo2',
        'temperature',
        'steps-calories',
        'sleep-basic',
        'osa-history',
        'raw-ppg',
      ]),
    );
  });

  it('prepares a dry-run without sending or persisting data', () => {
    const result = service.prepareUpload({
      operation: 'osa-history',
      sampleCount: 10,
      startTime: '2026-11-14T00:00:00.000Z',
      endTime: '2026-11-14T08:00:00.000Z',
    });

    expect(result.accepted).toBe(true);
    if (result.accepted) {
      expect(result.mode).toBe('dry-run');
      expect(result.outboundRequestSent).toBe(false);
      expect(result.dataPersisted).toBe(false);
    }
  });

  it('rejects invalid time ranges', () => {
    const result = service.prepareUpload({
      operation: 'spo2',
      sampleCount: 2,
      startTime: '2026-11-14T08:00:00.000Z',
      endTime: '2026-11-14T00:00:00.000Z',
    });
    expect(result).toEqual({ accepted: false, reason: 'invalid-time-range' });
  });

  it('does not invent a raw PPG cloud endpoint', () => {
    const result = service.prepareUpload({
      operation: 'raw-ppg',
      sampleCount: 100,
      startTime: '2026-11-14T00:00:00.000Z',
      endTime: '2026-11-14T00:01:00.000Z',
    });
    expect(result.accepted).toBe(true);
    if (result.accepted) {
      expect(result.readiness).toBe('blocked');
      expect(result.endpointCandidates[0].path).toBeNull();
      expect(result.outboundRequestSent).toBe(false);
    }
  });
});
