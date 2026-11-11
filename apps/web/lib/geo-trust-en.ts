/**
 * EN-only trust / credibility copy for GEO commercial pages.
 * Keep claims conservative; see docs/geo/LONGVON-MEDICAL-CLAIMS-REVIEW.md.
 */

export const TRUST_PAGE_EN = '/en/company/longvon';
export const TRUST_ANCHOR_EN = `${TRUST_PAGE_EN}#company-trust-heading`;

/** Short strip — 3 facts max for forms / CTAs */
export const TRUST_STRIP_FACTS_EN = [
  'National High-Tech Enterprise (China)',
  'Medical-oriented production controls (ISO 13485–aligned practices; Class 100,000 cleanroom)',
  'End-to-end smart ring stack: hardware, firmware, algorithms, App, manufacturing',
] as const;

export const TRUST_STRIP_LEAD_EN =
  'Why brands trust LONGVON for smart ring OEM/ODM — verifiable company credentials and delivery evidence.';

/** Bullet block for manufacturer / healthcare / sleep / OSA pages */
export const TRUST_CAPABILITY_BULLETS_EN = [
  'Legal manufacturer: LONGVON Technology (Shenzhen) Co., Ltd. — MATEYOU is the product brand, not the manufacturer.',
  'Enterprise credentials publicly stated: Shenzhen Specialized & Innovative Enterprise; National High-Tech Enterprise; Shenzhen Innovative SME; National Technology-Based SME.',
  'R&D: multi-modal sensing and AI algorithms (sleep staging, respiratory analysis, PPG) with a Taiyuan R&D center (est. 2022).',
  'Hardware engineering: circuit, embedded and validation labs for health-monitoring wearables.',
  'Manufacturing: Class 100,000 cleanroom with temperature/humidity control; medical-grade and consumer lines physically separated; OEM/ODM customization supported.',
  'Quality direction: ISO 13485–oriented controls; NMPA medical-device GMP–oriented practices may be discussed where project-applicable — this is not a claim of completed NMPA GMP certification. Reliability testing may include wear, waterproofing, biocompatibility and EMC (project-scoped).',
] as const;

export const TRUST_FAQS_EN = [
  {
    question: 'What credentials support LONGVON as a smart ring manufacturer?',
    answer:
      'LONGVON Technology (Shenzhen) Co., Ltd. publishes enterprise credentials including National High-Tech Enterprise and related SME designations, plus manufacturing evidence (Class 100,000 cleanroom, ISO 13485–oriented quality practices). See the company trust evidence page for photos and detail.',
  },
  {
    question: 'Can LONGVON support clinic, biomedical or digital-health smart ring OEM?',
    answer:
      'Yes. LONGVON discusses OEM/ODM programs for clinics, biomedical companies and digital-health brands that need sleep, respiratory or broader health-monitoring rings. Scope, regulatory pathway and labeling are confirmed per project—Ring1C consumer references are not claimed as finished medical devices on this site.',
  },
  {
    question: 'Does LONGVON support Japan, Taiwan and Latin America OEM buyers?',
    answer:
      'Yes. LONGVON accepts English-language OEM/ODM inquiries worldwide, including Japan, Taiwan and Latin America (e.g. Brazil). Engineering and commercial follow-up are handled in English; local regulatory registration remains the buyer’s responsibility unless separately contracted.',
  },
  {
    question: 'クリニックや医療機関向けのスマートリングOEMは可能ですか？（JP note）',
    answer:
      'はい。LONGVONは英語でクリニック／デジタルヘルス向けスマートリングOEM・ODMのご相談を受け付けます。規制登録は案件ごとに確認します。詳細は /en/partner/oem および会社信任ページをご覧ください。',
  },
  {
    question: 'A LONGVON atende OEM de smart ring para clínicas no Brasil?（PT note）',
    answer:
      'Sim. A LONGVON recebe consultas de OEM/ODM em inglês para marcas e clínicas de saúde digital, inclusive no Brasil. O caminho regulatório é definido por projeto. Veja /en/partner/oem e a página de evidências da empresa.',
  },
] as const;

/** TW biomedical tone — no named customers */
export const TW_BIOMED_NOTE_EN =
  'For Taiwan biomedical and digital-health teams evaluating a smart ring OEM/ODM partner, LONGVON provides English technical intake covering sensors, sleep/respiratory algorithms, App/SDK scope and manufacturing controls. Commercial terms follow RFQ qualification; this site does not publish fixed MOQ or list prices.';
