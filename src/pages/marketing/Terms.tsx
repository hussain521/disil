import { useTranslation } from 'react-i18next';
import LegalPageLayout, { type LegalSection } from './components/LegalPageLayout';

export default function Terms() {
  const { t } = useTranslation();

  const sections: LegalSection[] = [
    {
      title: t('marketing.terms.sections.s1.title', '1. Definitions'),
      body: t('marketing.terms.sections.s1.body', 'Application: the Diziel app and all its associated services.\nUser: any person using the app, whether a client or service provider.\nAgent: an accredited transport company that provides trucks and is the operational manager for its fleet.\nDriver: any person registered in the app to provide transport services.'),
    },
    {
      title: t('marketing.terms.sections.s2.title', '2. Eligibility'),
      body: t('marketing.terms.sections.s2.body', 'Users must be at least 18 years old to have legal capacity to contract.\nUsers are required to provide accurate, up-to-date data; they alone bear responsibility for any errors.'),
    },
    {
      title: t('marketing.terms.sections.s3.title', '3. Account Creation'),
      body: t('marketing.terms.sections.s3.body', 'A personal account must be created before using the app.\nThe user is responsible for keeping their account credentials confidential.\nThe app reserves the right to reject or suspend any account.\nNo account is activated until provided data is verified.\nForged or incorrect documents result in immediate suspension and referral to authorities.'),
    },
    {
      title: t('marketing.terms.sections.s4.title', '4. Nature of Service'),
      body: t('marketing.terms.sections.s4.body', 'The app provides a smart platform connecting clients with service providers for cargo transport.\nPrices and delivery times may vary based on trip conditions.'),
    },
    {
      title: t('marketing.terms.sections.s5.title', '5. Pricing & Payment'),
      body: t('marketing.terms.sections.s5.body', "Trip value is calculated according to the published tariff inside the app.\nPayment may be made in cash or electronically via available means.\nThe client must settle trip dues without delay; otherwise financial penalties apply.\nThe app may adjust prices before a trip starts based on market variables.\nA 1% per-day late-payment penalty applies to any overdue balance.\nThe app may freeze any account's balance during a dispute until the issue is resolved."),
    },
    {
      title: t('marketing.terms.sections.s6.title', '6. User Obligations'),
      body: t('marketing.terms.sections.s6.body', 'Respect service providers (driver, technical support, customer service).\nPreserve the truck at loading and unloading sites.'),
    },
    {
      title: t('marketing.terms.sections.s7.title', '7. Driver Obligations'),
      body: t('marketing.terms.sections.s7.body', "Comply with traffic laws.\nAbide by user conditions at loading and unloading sites.\nFollow user instructions to ensure everyone's safety.\nAdhere to departure and arrival schedules.\nMaintain vehicle cleanliness and personal appearance.\nFollow the route shown on the app map.\nProtect cargo integrity throughout the journey."),
    },
    {
      title: t('marketing.terms.sections.s8.title', '8. Cargo Liability (Insurance & Compensation)'),
      body: t('marketing.terms.sections.s8.body', 'The app provides cargo insurance policies for users.\nIf the user opts out of insurance, they bear full responsibility with no claims against the app.\nAny damage must be reported within 24 hours — later reports will not be accepted.\nReporting must be done via the app or the officially recognised email.'),
    },
    {
      title: t('marketing.terms.sections.s9.title', '9. App Liability'),
      body: t('marketing.terms.sections.s9.body', 'The app is a technical and operational intermediary, not the primary carrier.\nThe app bears no direct responsibility for events beyond its control.\nThe app is not liable for driver violations or illegal cargo during a trip.'),
    },
    {
      title: t('marketing.terms.sections.s10.title', '10. Amendment of Terms'),
      body: t('marketing.terms.sections.s10.body', 'The app may amend these terms at any time. Continued use constitutes acceptance of amendments.'),
    },
    {
      title: t('marketing.terms.sections.s11.title', '11. Agent Obligations'),
      body: t('marketing.terms.sections.s11.body', 'Agents must provide high-quality vehicles and qualified drivers.\nAgents must monitor trip execution on the app and coordinate at all stages.'),
    },
    {
      title: t('marketing.terms.sections.s12.title', '12. Cancellation or Postponement'),
      body: t('marketing.terms.sections.s12.body', 'Cancellation before truck dispatch: no charge.\nCancellation or postponement after dispatch: EGP 75 per kilometre.\nDelay at loading or unloading: EGP 500 per 6 hours of delay.'),
    },
    {
      title: t('marketing.terms.sections.s13.title', '13. Tracking'),
      body: t('marketing.terms.sections.s13.body', 'The user must consent to geo-tracking of the shipment during the trip.\nThe user must consent to storage of shipment data.\nCalls and chats may be recorded for quality and security purposes.'),
    },
    {
      title: t('marketing.terms.sections.s14.title', '14. Privacy & Responsibilities'),
      body: t('marketing.terms.sections.s14.body', 'The app is committed to protecting user data and not using it for any unauthorised purpose.\nThe user is solely responsible for the contents of cargo being transported and ensuring it does not violate Egyptian law.\nThe app does not transport pets, cash, gold, alcohol, or any otherwise prohibited items.\nViolating these rules makes the user solely responsible before Egyptian law.'),
    },
    {
      title: t('marketing.terms.sections.s15.title', '15. Ratings & Penalties'),
      body: t('marketing.terms.sections.s15.body', 'A rating system applies to drivers, agents, and clients.\nWarning first, then account suspension.\nImmediate suspension for fraud, forgery, manipulation, abuse, or financial evasion.'),
    },
    {
      title: t('marketing.terms.sections.s16.title', '16. Governing Law'),
      body: t('marketing.terms.sections.s16.body', 'These terms are governed by the laws of the Arab Republic of Egypt.'),
    },
    {
      title: t('marketing.terms.sections.s17.title', '17. Force Majeure'),
      body: t('marketing.terms.sections.s17.body', 'Includes accidents, natural disasters, earthquakes, revolutions, wars, political decisions, road closures, and similar events. In such cases the app bears no obligations toward users.'),
    },
    {
      title: t('marketing.terms.sections.s18.title', '18. Intellectual Property'),
      body: t('marketing.terms.sections.s18.body', 'Everything related to the app — logo, systems, operational rules, and visual identity — is the exclusive property of Diziel and may not be contested by anyone.'),
    },
    {
      title: t('marketing.terms.sections.s19.title', '19. Contact & Support'),
      body: t('marketing.terms.sections.s19.body', 'You can reach support via: Email — Facebook — WhatsApp.'),
    },
  ];

  return (
    <LegalPageLayout
      title={t('marketing.terms.title', 'Terms & Conditions')}
      subtitle={t('marketing.terms.subtitle', 'Diziel app — terms and conditions. Please read carefully.')}
      sections={sections}
      footnote={t('marketing.terms.footnote', "Contact us through the app's official support channels.")}
    />
  );
}
