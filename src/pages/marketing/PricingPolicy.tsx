import { useTranslation } from 'react-i18next';
import LegalPageLayout, { type LegalSection } from './components/LegalPageLayout';

export default function PricingPolicy() {
  const { t } = useTranslation();

  const sections: LegalSection[] = [
    {
      title: t('marketing.pricing.sections.basis.title', 'Basis of Pricing'),
      body: t('marketing.pricing.sections.basis.body', 'The indicative price is computed from distance (km) × weight (t) using a Diziel-approved tariff table, with adjustments based on truck type and service category.'),
    },
    {
      title: t('marketing.pricing.sections.distance.title', 'Distance'),
      body: t('marketing.pricing.sections.distance.body', 'A unified Google route is used to measure distance from pickup to drop-off and is the source of truth for the invoice.'),
    },
    {
      title: t('marketing.pricing.sections.margin.title', 'Diziel Margin & VAT'),
      body: t('marketing.pricing.sections.margin.body', 'A 5% Diziel margin is added on top of the base price; 14% VAT is then added when applicable to the order.'),
    },
    {
      title: t('marketing.pricing.sections.extra.title', 'Extra Expenses'),
      body: t('marketing.pricing.sections.extra.body', 'Road, loading, unloading, government, port, and customs fees are tracked separately, and the payer (Client or Diziel) is selected per order.'),
    },
    {
      title: t('marketing.pricing.sections.downPayments.title', 'Down Payments'),
      body: t('marketing.pricing.sections.downPayments.body', 'New clients: 10% deposit before truck dispatch. Trusted clients: 50% on loading, balance on unloading. Long-term contracts: deposit handed to the driver.'),
    },
    {
      title: t('marketing.pricing.sections.insurance.title', 'Insurance'),
      body: t('marketing.pricing.sections.insurance.body', 'If insurance is requested, an insurance premium is added to the total based on the declared cargo value.'),
    },
    {
      title: t('marketing.pricing.sections.adjustments.title', 'Adjustments & Discounts'),
      body: t('marketing.pricing.sections.adjustments.body', 'Any discount or adjustment is admin-only and is recorded on the order with a reason.'),
    },
  ];

  return (
    <LegalPageLayout
      title={t('marketing.pricing.title', 'Pricing Policy')}
      subtitle={t('marketing.pricing.subtitle', 'How shipment prices are computed inside Diziel.')}
      sections={sections}
    />
  );
}
