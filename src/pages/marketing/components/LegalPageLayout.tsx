import type { ReactNode } from 'react';
import MarketingFooter from './MarketingFooter';
import MarketingNav from './MarketingNav';

export type LegalSection = {
  title: string;
  body: string;
};

type LegalPageLayoutProps = {
  title: string;
  subtitle: string;
  sections: LegalSection[];
  footnote?: ReactNode;
};

/** Shared layout for lightweight legal/content pages (Terms, Pricing Policy). */
export default function LegalPageLayout({ title, subtitle, sections, footnote }: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 no-scrollbar transition-colors duration-200">
      <MarketingNav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">{subtitle}</p>

        <div className="mt-10 space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs"
            >
              <h2 className="text-base font-bold text-brand-primary dark:text-blue-400">{section.title}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">{section.body}</p>
            </section>
          ))}
        </div>

        {footnote && <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">{footnote}</p>}
      </main>

      <MarketingFooter />
    </div>
  );
}
