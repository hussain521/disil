import { useTranslation } from "react-i18next";
import LegalPageLayout, { type LegalSection } from "./components/LegalPageLayout";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  const sections: LegalSection[] = [
    {
      title: t("marketing.privacy.sections.collection.title", "1. Information We Collect"),
      body: t(
        "marketing.privacy.sections.collection.body",
        "We collect necessary information to facilitate freight operations including: contact details, commercial registrations, driver licenses, vehicle specs, and pickup/drop-off coordinates.",
      ),
    },
    {
      title: t("marketing.privacy.sections.telemetry.title", "2. GPS Telemetry & Live Geo-Tracking"),
      body: t(
        "marketing.privacy.sections.telemetry.body",
        "Diziel utilizes live satellite telemetry during active shipments to ensure cargo safety, verify route milestones, and provide accurate ETAs to verified parties.",
      ),
    },
    {
      title: t("marketing.privacy.sections.usage.title", "3. How Data Is Used"),
      body: t(
        "marketing.privacy.sections.usage.body",
        "Data is used solely to execute freight dispatches, process digital waybills, compute transparent tariffs, and comply with Egyptian transport regulations.",
      ),
    },
    {
      title: t("marketing.privacy.sections.sharing.title", "4. Authorized Information Sharing"),
      body: t(
        "marketing.privacy.sections.sharing.body",
        "Trip details are only shared between authorized shipment parties (Shipper, Assigned Driver, Fleet Agent). We never sell user data to third-party advertisers.",
      ),
    },
    {
      title: t("marketing.privacy.sections.security.title", "5. Data Security & Encryption"),
      body: t(
        "marketing.privacy.sections.security.body",
        "We implement bank-grade encryption protocols to safeguard all documents, financial settlements, and digital waybill records against unauthorized access.",
      ),
    },
    {
      title: t("marketing.privacy.sections.rights.title", "6. User Rights & Updates"),
      body: t(
        "marketing.privacy.sections.rights.body",
        "Users may request corrections or updates to their stored profile data by contacting our operations support team or via their account portal.",
      ),
    },
  ];

  return (
    <LegalPageLayout
      title={t("marketing.privacy.title", "Privacy & Data Protection Policy")}
      subtitle={t(
        "marketing.privacy.subtitle",
        "How Diziel collects, protects, and handles shipper and carrier data.",
      )}
      sections={sections}
      footnote={t("marketing.terms.footnote", "Contact us through the app's official support channels.")}
    />
  );
}