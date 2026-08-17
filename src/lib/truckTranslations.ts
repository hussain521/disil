export const TRUCK_TYPE_MAP: Record<string, { ar: string; en: string }> = {
  flatbed: { ar: 'فرش', en: 'Flatbed' },
  flat_surface: { ar: 'فرش (سطحة)', en: 'Flat Surface' },
  container: { ar: 'كنتر', en: 'Container' },
  refrigerated: { ar: 'براد', en: 'Refrigerated' },
  insulated: { ar: 'حافظة', en: 'Insulated' },
  preserved: { ar: 'حافظة', en: 'Preserved' },
  sided: { ar: 'جوانب', en: 'Sided' },
  side_walls: { ar: 'جوانب', en: 'Side Walls' },
  tanker: { ar: 'صهريج', en: 'Tanker' },
  fuel_tank: { ar: 'خزان وقود', en: 'Fuel Tank' },
  alcohol_tank: { ar: 'خزان كحول', en: 'Alcohol Tank' },
  water_tank: { ar: 'خزان مياه', en: 'Water Tank' },
  bulk: { ar: 'سائبة', en: 'Bulk' },
  curtainsider: { ar: 'ستارة', en: 'Curtain' },
  curtain: { ar: 'ستارة', en: 'Curtain' },
  tipper: { ar: 'قلاب', en: 'Tipper' },
  recovery_winch: { ar: 'ونش انقاذ', en: 'Recovery Winch' },
  car_carrier: { ar: 'ناقلة سيارات', en: 'Car Carrier' },
  box: { ar: 'مغلقة', en: 'Box' },
  jumbo: { ar: 'جامبو', en: 'Jumbo' },
  single: { ar: 'فردي', en: 'Single' },
  truck: { ar: 'تريلا', en: 'Truck' },
  crane: { ar: 'ونش', en: 'Crane' },
  pump: { ar: 'مضخة', en: 'Pump' },
  mixer: { ar: 'خلاطة', en: 'Mixer' },
  silo: { ar: 'صومعة', en: 'Silo' },
  sweeper: { ar: 'كساحة', en: 'Sweeper' },
  telescopic: { ar: 'تلسكوبي', en: 'Telescopic' },
};

export const HEAD_TYPE_MAP: Record<string, { ar: string; en: string }> = {
  fardany: { ar: 'فرداني', en: 'Single' },
  ras: { ar: 'راس', en: 'Head' },
  jambo: { ar: 'جامبو', en: 'Jumbo' },
};

export const TRAILER_TYPE_MAP: Record<string, { ar: string; en: string }> = {
  dail: { ar: 'ديل', en: 'Tail' },
  maqtoura: { ar: 'مقطورة', en: 'Full Trailer' },
};

export const CARGO_TYPE_MAP: Record<string, { ar: string; en: string }> = {
  electronics: { ar: 'إلكترونيات', en: 'Electronics' },
  furniture: { ar: 'أثاث', en: 'Furniture' },
  food: { ar: 'أغذية / أطعمة', en: 'Food' },
  machinery: { ar: 'معدات / آلات', en: 'Machinery' },
  construction: { ar: 'مواد بناء', en: 'Construction' },
  chemicals: { ar: 'كيماويات', en: 'Chemicals' },
  grain: { ar: 'حبوب', en: 'Grain' },
  general: { ar: 'بضائع عامة', en: 'General' },
  packages: { ar: 'طرود', en: 'Packages' },
  other: { ar: 'أخرى', en: 'Other' },
};

export function formatTruckType(typeKey: string | null | undefined, lang?: 'ar' | 'en'): string {
  if (!typeKey) return '—';
  const currentLang = lang || (document.documentElement.lang?.startsWith('en') ? 'en' : 'ar');
  const clean = typeKey.trim().toLowerCase().replace(/^truck_type_/, '');
  const match = TRUCK_TYPE_MAP[clean];
  if (match) {
    return currentLang === 'en' ? match.en : match.ar;
  }
  return typeKey;
}

export function formatHeadType(headKey: string | null | undefined, lang?: 'ar' | 'en'): string {
  if (!headKey) return '—';
  const currentLang = lang || (document.documentElement.lang?.startsWith('en') ? 'en' : 'ar');
  const clean = headKey.trim().toLowerCase();
  const match = HEAD_TYPE_MAP[clean];
  if (match) {
    return currentLang === 'en' ? match.en : match.ar;
  }
  return headKey;
}

export function formatTrailerType(trailerKey: string | null | undefined, lang?: 'ar' | 'en'): string {
  if (!trailerKey) return '—';
  const currentLang = lang || (document.documentElement.lang?.startsWith('en') ? 'en' : 'ar');
  const clean = trailerKey.trim().toLowerCase();
  const match = TRAILER_TYPE_MAP[clean];
  if (match) {
    return currentLang === 'en' ? match.en : match.ar;
  }
  return trailerKey;
}

export function getCombinedTruckTypeLabel(
  headType?: string | null,
  trailerType?: string | null,
  lang: 'ar' | 'en' = 'ar'
): string | null {
  const cleanHead = headType?.trim().toLowerCase();
  const cleanTrailer = trailerType?.trim().toLowerCase();
  if (cleanHead === 'ras' && cleanTrailer === 'dail') {
    return lang === 'ar' ? 'تريلا' : 'Trela';
  }
  if (cleanHead === 'fardany' && cleanTrailer === 'maqtoura') {
    return lang === 'ar' ? 'جرار' : 'Jarrar';
  }
  return null;
}

export function formatCargoType(cargoKey: string | null | undefined, lang?: 'ar' | 'en'): string {
  if (!cargoKey) return '—';
  const currentLang = lang || (document.documentElement.lang?.startsWith('en') ? 'en' : 'ar');
  const clean = cargoKey.trim().toLowerCase().replace(/\s+/g, '_');
  const match = CARGO_TYPE_MAP[clean];
  if (match) {
    return currentLang === 'en' ? match.en : match.ar;
  }
  return cargoKey;
}
