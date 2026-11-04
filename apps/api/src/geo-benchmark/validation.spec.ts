import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateApiRunDto, CreateCaptureDto, ReviewResultDto } from './dto/geo-benchmark.dto';
import { SCORE_RUBRIC } from './query-bank';
import {
  assertCostConfirmed,
  assertPublicHttpUrl,
  assertQueryCodes,
  assertRawMutable,
  assertScreenshotRef,
  BenchmarkValidationError,
  normalizeCitations,
  normalizeReview,
} from './domain/validation';

describe('scoring rubric', () => {
  it('defines human scores 0 through 5', () => {
    expect(Object.keys(SCORE_RUBRIC).map(Number).sort()).toEqual([0, 1, 2, 3, 4, 5]);
    expect(SCORE_RUBRIC[0]).toMatch(/No LONGVON mention/);
    expect(SCORE_RUBRIC[5]).toMatch(/official website/);
    expect(SCORE_RUBRIC[5]).toMatch(/independent third-party/);
  });

  it('accepts a complete reviewed score and flags', () => {
    const review = normalizeReview({
      reviewStatus: 'reviewed',
      score: 5,
      mention: true,
      identityCorrect: true,
      supplierCandidate: true,
      activeRecommendation: true,
      officialCitation: true,
      independentCitation: true,
      factualErrors: false,
      rationale: 'Official site and an independent source were both cited.',
      evaluator: 'geo-reviewer',
    });
    expect(review.score).toBe(5);
    expect(review.flags.officialCitation).toBe(true);
  });

  it('rejects scores outside 0-5, missing rationale, and personal contact labels', () => {
    expect(() =>
      normalizeReview({
        reviewStatus: 'reviewed',
        score: 6,
        mention: true,
        identityCorrect: true,
        supplierCandidate: false,
        activeRecommendation: false,
        officialCitation: false,
        independentCitation: false,
        factualErrors: false,
        rationale: 'Too high',
        evaluator: 'geo-reviewer',
      }),
    ).toThrow(/0 through 5/);
    expect(() =>
      normalizeReview({
        reviewStatus: 'reviewed',
        score: 2,
        mention: true,
        identityCorrect: true,
        supplierCandidate: false,
        activeRecommendation: false,
        officialCitation: false,
        independentCitation: false,
        factualErrors: false,
        rationale: '   ',
        evaluator: 'geo-reviewer',
      }),
    ).toThrow(/rationale/);
    expect(() =>
      normalizeReview({
        reviewStatus: 'excluded',
        rationale: 'Duplicate capture',
        evaluator: 'person@example.com',
      }),
    ).toThrow(/role label/);
  });

  it('lets exclusion omit the numeric score', () => {
    const review = normalizeReview({
      reviewStatus: 'excluded',
      rationale: 'Incomplete paste. Kept for audit only.',
      evaluator: 'geo-reviewer',
    });
    expect(review.score).toBeNull();
    expect(review.reviewStatus).toBe('excluded');
  });
});

describe('validation', () => {
  it('accepts public citation URLs and rejects credentials and script URLs', () => {
    expect(assertPublicHttpUrl('https://www.longvon.com/company')).toBe(
      'https://www.longvon.com/company',
    );
    expect(() => assertPublicHttpUrl('javascript:alert(1)')).toThrow(BenchmarkValidationError);
    expect(() => assertPublicHttpUrl('https://user:secret@example.com/a')).toThrow(/credentials/);
    expect(() => assertPublicHttpUrl('not a url')).toThrow(BenchmarkValidationError);
  });

  it('limits citation count and screenshot references', () => {
    expect(() =>
      normalizeCitations(Array.from({ length: 41 }, () => ({ url: 'https://example.com' }))),
    ).toThrow(/40/);
    expect(assertScreenshotRef('/uploads/geo/capture-1.png')).toBe('/uploads/geo/capture-1.png');
    expect(() => assertScreenshotRef('/uploads/../../etc/passwd')).toThrow(
      BenchmarkValidationError,
    );
    expect(assertScreenshotRef('')).toBeNull();
  });

  it('requires the fixed query ids and explicit batch confirmation', () => {
    expect(assertQueryCodes(['Q001', 'Q060'])).toEqual(['Q001', 'Q060']);
    expect(() => assertQueryCodes(['Q061'])).toThrow(/Q001-Q060/);
    expect(() => assertQueryCodes(['Q001', 'Q001'])).toThrow(/more than once/);
    expect(() => assertCostConfirmed(1, undefined)).toThrow(/No request was sent/);
    expect(() => assertCostConfirmed(1, false)).toThrow(/No request was sent/);
    expect(() => assertCostConfirmed(2, false)).toThrow(/No request was sent/);
    expect(() => assertCostConfirmed(1, true)).not.toThrow();
    expect(() => assertCostConfirmed(60, true)).not.toThrow();
  });

  it('locks the raw answer after review or exclusion', () => {
    expect(() => assertRawMutable('pending')).not.toThrow();
    expect(() => assertRawMutable('needs_recheck')).not.toThrow();
    expect(() => assertRawMutable('reviewed')).toThrow(/immutable/);
    expect(() => assertRawMutable('excluded')).toThrow(/immutable/);
  });
});

describe('DTO validation', () => {
  it('rejects a capture whose citation URL is missing', async () => {
    const dto = new CreateCaptureDto();
    dto.provider = 'gemini';
    dto.queryCode = 'Q001';
    dto.rawAnswer = 'Answer text';
    dto.citations = [{ url: '' } as never];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects an API run without query codes', async () => {
    const dto = new CreateApiRunDto();
    dto.provider = 'perplexity';
    dto.queryCodes = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects a review without a rationale', async () => {
    const dto = new ReviewResultDto();
    dto.reviewStatus = 'reviewed';
    dto.score = 3;
    dto.rationale = '';
    dto.evaluator = 'geo-reviewer';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
