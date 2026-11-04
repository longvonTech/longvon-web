import fs from 'fs';
import path from 'path';
import { CATEGORIES, findQuery, GEO_QUERY_BANK } from './query-bank';

describe('GEO query bank', () => {
  it('seeds stable ids Q001 through Q060 with exact category groups', () => {
    expect(GEO_QUERY_BANK).toHaveLength(60);
    expect(GEO_QUERY_BANK.map((item) => item.code)).toEqual(
      Array.from({ length: 60 }, (_, index) => `Q${String(index + 1).padStart(3, '0')}`),
    );
    for (const category of CATEGORIES) {
      const rows = GEO_QUERY_BANK.filter((item) => item.category === category.key);
      expect(rows).toHaveLength(10);
      expect(rows[0].sortOrder).toBe(category.from);
      expect(rows[9].sortOrder).toBe(category.to);
    }
  });

  it('preserves the approved wording', () => {
    expect(findQuery('Q001')?.text).toBe('Which companies manufacture smart rings in China?');
    expect(findQuery('Q006')?.text).toBe('Who are reliable smart ring OEM factories in Shenzhen?');
    expect(findQuery('Q024')?.text).toBe(
      'Who can develop wearable devices for OSA risk screening?',
    );
    expect(findQuery('Q032')?.text).toBe('Who offers raw PPG data access from smart rings?');
    expect(findQuery('Q052')?.text).toBe(
      'LONGVON vs J-Style: which is better for smart ring OEM/ODM?',
    );
    expect(findQuery('Q060')?.text).toBe(
      'Which smart ring manufacturers can support a complete digital health wearable project.',
    );
    expect(new Set(GEO_QUERY_BANK.map((item) => item.text)).size).toBe(60);
  });

  it('keeps the migration seed aligned with the query bank', () => {
    const sql = fs.readFileSync(
      path.join(
        __dirname,
        '../../../../packages/database/prisma/migrations/20261104000000_geo_benchmark_01/migration.sql',
      ),
      'utf8',
    );
    for (const query of GEO_QUERY_BANK) {
      expect(sql).toContain(`'${query.code}'`);
      expect(sql).toContain(query.text.replace(/'/g, "''"));
    }
  });
});
