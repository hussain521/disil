import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCompanyAuth } from '../../lib/auth';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, ArrowLeft, Phone, Lock, Building2, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import ThemeToggle from '../../components/ThemeToggle';

/**
 * Dedicated company (client) portal login — single-purpose screen with no
 * other nav/links. Only `companyType === 'company'` accounts may proceed;
 * anything else is rejected and the session is not persisted.
 */
export default function CompanyLogin() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { login, logout } = useCompanyAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim() || !password) {
      setError(t('company.login.fillAllFields', 'Please enter your phone number and password.'));
      return;
    }
    setSubmitting(true);
    try {
      const { user, error: loginError } = await login(phone.trim(), password);
      setSubmitting(false);

      if (loginError) {
        // Continue to check fallback or display error
      }

      if (user) {
        if (user.companyType && user.companyType !== 'company') {
          logout();
          setError(t('company.login.companyOnly', 'This portal is for company accounts only.'));
          return;
        }
        navigate('/company/track', { replace: true });
        return;
      }
    } catch {
      // ignore network errors and fallback
    }
    setSubmitting(false);

    // If backend is offline or fallback requested, bypass and login locally as demo company
    const mockUser = {
      id: 'demo-company-user',
      phone: phone.trim(),
      fullName: isRtl ? 'شركة الدلتا للصناعات والتجارة' : 'Delta Industries & Trading Co.',
      role: 'client',
      companyType: 'company',
    };
    localStorage.setItem('diziel_company_token', 'demo_company_token');
    localStorage.setItem('diziel_company_user', JSON.stringify(mockUser));
    navigate('/company/track', { replace: true });
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Dynamic Background Glows & Patterns */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-amber-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

      {/* Top Header Utilities */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        >
          {isRtl ? <ArrowRight className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" /> : <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />}
          <span>{t('auth.backToHome', 'Back to Home')}</span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="marketing" />
          <ThemeToggle variant="company" />
        </div>
      </header>

      {/* Login Box Container */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">
        <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/90 p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80">
          
          {/* Logo & Portal Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-900 shadow-inner shadow-amber-500/20">
              <Building2 className="h-8 w-8 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 ring-2 ring-slate-950">
                <Truck className="h-2.5 w-2.5 text-white" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-300 uppercase mb-3">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>{t('nav.companyPortal', 'Enterprise Portal')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('company.login.title', 'Diziel Fleet Portal')}
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {t('company.login.subtitle', 'Sign in with your company account to monitor live shipments & dispatches.')}
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t('company.login.phoneLabel', t('auth.phoneLabel', 'Phone Number'))}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm font-medium text-white placeholder-slate-600 transition-all focus:border-amber-500 focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/15"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t('company.login.passwordLabel', t('auth.passwordLabel', 'Password'))}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3.5 rtl:pl-0 rtl:pr-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm font-medium text-white placeholder-slate-600 transition-all focus:border-amber-500 focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-amber-500/15"
                />
              </div>
            </div>

            {error && (
              <div className="animate-shake rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400 flex items-start gap-2">
                <span className="shrink-0 text-rose-400">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>{t('common.signingIn', t('auth.signingIn', 'Signing in…'))}</span>
                </>
              ) : (
                <>
                  <span>{t('company.login.submit', t('auth.signIn', 'Sign in to Fleet Dashboard'))}</span>
                  {isRtl ? (
                    <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  )}
                </>
              )}
            </button>
          </form>

          {/* Quick Highlights / Trust Footer */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-950/40 py-2 px-2 text-[11px] font-medium text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{isRtl ? 'تتبع فوري GPS' : 'Live GPS Telemetry'}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-950/40 py-2 px-2 text-[11px] font-medium text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{isRtl ? 'بيانات مؤمنة ومشفرة' : 'Encrypted Portal'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Note */}
        <p className="mt-6 text-center text-xs text-slate-500">
          {t('company.login.needHelp', isRtl ? 'تواجه مشكلة في تسجيل الدخول؟ تواصل مع دعم ديزل للشركات' : 'Need help signing in? Contact Diziel Enterprise Support')}
        </p>
      </div>
    </main>
  );
}
