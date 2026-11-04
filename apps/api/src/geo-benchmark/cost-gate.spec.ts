import { BadRequestException } from '@nestjs/common';
import { CreateApiRunDto } from './dto/geo-benchmark.dto';
import { GeoBenchmarkService } from './geo-benchmark.service';

describe('provider API cost gate', () => {
  function service() {
    const fetchImpl = jest.fn();
    const prisma = {
      geoQuery: { findMany: jest.fn(), upsert: jest.fn() },
      geoRun: { create: jest.fn(), update: jest.fn() },
      geoAuditEvent: { create: jest.fn() },
    };
    return {
      fetchImpl,
      prisma,
      service: new GeoBenchmarkService(prisma as never),
    };
  }

  async function expectNoFetch(dto: CreateApiRunDto) {
    const harness = service();
    await expect(harness.service.runApi(dto, harness.fetchImpl)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(harness.fetchImpl).not.toHaveBeenCalled();
    expect(harness.prisma.geoQuery.findMany).not.toHaveBeenCalled();
    expect(harness.prisma.geoRun.create).not.toHaveBeenCalled();
  }

  it('does not fetch when a single query is missing confirmCost', async () => {
    const dto = new CreateApiRunDto();
    dto.provider = 'gemini';
    dto.queryCodes = ['Q001'];
    await expectNoFetch(dto);
  });

  it('does not fetch when confirmCost is false for one query or a batch', async () => {
    const single = new CreateApiRunDto();
    single.provider = 'gemini';
    single.queryCodes = ['Q001'];
    single.confirmCost = false;
    await expectNoFetch(single);

    const batch = new CreateApiRunDto();
    batch.provider = 'perplexity';
    batch.queryCodes = ['Q001', 'Q002'];
    batch.confirmCost = false;
    await expectNoFetch(batch);
  });
});
