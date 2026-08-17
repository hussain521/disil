import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type DevicePlatform = "ios" | "android" | "desktop";

export const APP_STORE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_APP_STORE_URL) ||
  "https://apps.apple.com/app/diziel/id0000000000";

export const PLAY_STORE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_PLAY_STORE_URL) ||
  "https://play.google.com/store/apps/details?id=com.diziel.app";

/**
 * Detect user device platform (iOS, Android, or Desktop)
 */
export function detectDevicePlatform(): DevicePlatform {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "desktop";
  }

  const ua = (
    navigator.userAgent ||
    navigator.vendor ||
    (window as unknown as { opera?: string }).opera ||
    ""
  ).toLowerCase();

  // Android detection
  if (/android/i.test(ua)) {
    return "android";
  }

  // iOS detection (iPhone, iPad, iPod, iPadOS 13+ desktop-class Safari)
  const isIosDevice =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (
    isIosDevice &&
    !(window as unknown as { MSStream?: unknown }).MSStream
  ) {
    return "ios";
  }

  return "desktop";
}

/**
 * Get target download link based on detected platform
 */
export function getPlatformDownloadUrl(platform: DevicePlatform): string {
  if (platform === "ios") {
    return APP_STORE_URL;
  }
  if (platform === "android") {
    return PLAY_STORE_URL;
  }
  return "#app-download";
}

/**
 * React hook to manage smart download routing and platform tracking
 */
export function useAppDownload() {
  const [platform, setPlatform] = useState<DevicePlatform>("desktop");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setPlatform(detectDevicePlatform());
  }, []);

  const scrollToAppSection = useCallback(() => {
    const downloadSection =
      document.getElementById("app-download") ||
      document.getElementById("app-screens") ||
      document.getElementById("download");

    if (downloadSection) {
      const headerOffset = 90;
      const elementPosition = downloadSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const handleDownload = useCallback(
    (e?: React.MouseEvent) => {
      const detected = detectDevicePlatform();

      if (detected === "ios") {
        if (e) e.preventDefault();
        window.open(APP_STORE_URL, "_blank", "noopener,noreferrer");
        return;
      }

      if (detected === "android") {
        if (e) e.preventDefault();
        window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
        return;
      }

      // Desktop fallback: smooth scroll to app showcase / download section
      if (e) e.preventDefault();

      if (location.pathname !== "/") {
        navigate("/#app-download");
        return;
      }

      scrollToAppSection();
    },
    [location.pathname, navigate, scrollToAppSection],
  );

  const downloadUrl = getPlatformDownloadUrl(platform);

  return {
    platform,
    downloadUrl,
    appStoreUrl: APP_STORE_URL,
    playStoreUrl: PLAY_STORE_URL,
    handleDownload,
    scrollToAppSection,
  };
}