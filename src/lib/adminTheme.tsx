import React from 'react';
import { useTheme, ThemeMode } from './theme';

export type { ThemeMode };

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  // Global ThemeProvider in App now manages theme.
  return <>{children}</>;
}

export function useAdminTheme() {
  const { themeMode, isDark, setThemeMode, toggleTheme } = useTheme();
  return {
    isAdminTheme: true,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
  };
}

export type UiVariant = 'brand' | 'admin';

export function resolveVariant(explicit?: UiVariant, isAdminTheme = false): UiVariant {
  if (explicit) return explicit;
  return isAdminTheme ? 'admin' : 'brand';
}
