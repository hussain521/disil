import { useTranslation } from "react-i18next";
import { Apple, Smartphone, Download } from "lucide-react";
import { useAppDownload } from "../../../../lib/appDownload";

interface NavDownloadButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function NavDownloadButton({
  className = "",
  onClick,
}: NavDownloadButtonProps) {
  const { t } = useTranslation();
  const { platform, downloadUrl, handleDownload } = useAppDownload();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    handleDownload(e);
  };

  const buttonLabel =
    platform === "ios"
      ? t("marketing.nav.downloadForIos", "Download for iPhone (iOS)")
      : platform === "android"
        ? t("marketing.nav.downloadForAndroid", "Download for Android")
        : t("marketing.nav.downloadApp", "Download App");

  return (
    <a
      href={downloadUrl}
      onClick={handleClick}
      title={buttonLabel}
      aria-label={buttonLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#f7a224] hover:bg-[#eb9517] active:bg-[#db870b] text-[#2b1803] px-7 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] focus:outline-none cursor-pointer ${className}`}
    >
      {platform === "ios" ? (
        <Apple className="h-4 w-4 shrink-0 text-[#2b1803]/90" />
      ) : platform === "android" ? (
        <Smartphone className="h-4 w-4 shrink-0 text-[#2b1803]/90" />
      ) : (
        <Download className="h-4 w-4 shrink-0 text-[#2b1803]/90" />
      )}
      <span>{buttonLabel}</span>
    </a>
  );
}