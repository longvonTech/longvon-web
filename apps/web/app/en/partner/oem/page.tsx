export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { PartnerLandingLayout } from '../../../../components/PartnerLandingLayout';
import { getSiteUrl } from '../../../../lib/site';
import { ENTITY_STATEMENT_EN } from '../../../../lib/geo';
import { siteAlternates } from '../../../../lib/i18n-routes';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'OEM / ODM Inquiry | LONGVON' },
  description: `Contact LONGVON for smart ring OEM manufacturing and ODM/custom development. ${ENTITY_STATEMENT_EN}`,
  alternates: siteAlternates(site, '/partner/oem', 'en'),
};

export default function EnglishPartnerOemPage() {
  return (
    <PartnerLandingLayout
      locale="en"
      cooperationType="oem"
      title="OEM / ODM Inquiry"
      intro={`${ENTITY_STATEMENT_EN} Share your volume, certification, and customization needs — our team reviews Chinese and international requests.`}
      valueProps={[
        {
          title: 'Capacity planning',
          description: 'Current line capacity and lead-time guidance based on order volume',
        },
        {
          title: 'Quality systems',
          description: 'Quality documentation available for your supply-chain evaluation',
        },
        {
          title: 'Quotation',
          description: 'Commercial proposals sized to order scale and customization scope',
        },
        {
          title: 'Customization',
          description: 'Support for appearance, packaging, and selected module customization',
        },
      ]}
    />
  );
}
