'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Building2,
  MapPin,
  Sprout,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Farm, UserProfile } from '@/types/schema';

interface AuthFlowProps {
  onCompleteAuth: (user: UserProfile, initialFarm: Farm) => void;
}

// ─── Firebase error → human-friendly message ────────────────────────────────
function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-phone-number':
      'Invalid phone number. Please enter a valid 10-digit Indian mobile number.',
    'auth/too-many-requests':
      'Too many OTP requests. Please wait a few minutes before trying again.',
    'auth/quota-exceeded':
      'SMS quota exceeded. Please try again later.',
    'auth/invalid-verification-code':
      'Incorrect OTP. Please check the SMS and try again.',
    'auth/code-expired':
      'OTP expired. Please request a new OTP.',
    'auth/session-expired':
      'Session expired. Please request a new OTP.',
    'auth/captcha-check-failed':
      'reCAPTCHA verification failed. Please refresh and try again.',
    'auth/network-request-failed':
      'Network error. Please check your internet connection.',
    'auth/missing-phone-number':
      'Please enter your phone number.',
    'auth/invalid-app-credential':
      'Firebase configuration error. Please contact support.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ─── Validate Indian mobile number ──────────────────────────────────────────
function validateIndianPhone(raw: string): { valid: boolean; message: string } {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 10) {
    return { valid: false, message: 'Phone number must be exactly 10 digits.' };
  }
  if (!/^[6-9]/.test(digits)) {
    return {
      valid: false,
      message: 'Indian mobile numbers must start with 6, 7, 8, or 9.',
    };
  }
  return { valid: true, message: '' };
}

// ─── Mask phone for display ──────────────────────────────────────────────────
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone;
  return `+91 ${digits.slice(0, 2)}XXXXX${digits.slice(-3)}`;
}

// ─── Dev bypass flag (set NEXT_PUBLIC_DEV_BYPASS=true in .env.local) ────────
const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

export const AuthFlow: React.FC<AuthFlowProps> = ({ onCompleteAuth }) => {
  const [step, setStep] = useState<'credentials' | 'otp' | 'farm'>('credentials');

  // Credentials
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // OTP
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [sentNotice, setSentNotice] = useState('');

  // reCAPTCHA
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Farm setup
  const [farmerName, setFarmerName] = useState('');
  const [farmName, setFarmName] = useState('My Intelligence Farm');
  const [farmState, setFarmState] = useState('Rajasthan');
  const [district, setDistrict] = useState('Jaipur');
  const [village, setVillage] = useState('Sanganer');
  const [farmAreaAcres, setFarmAreaAcres] = useState(15.0);
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');
  const [livestockCount, setLivestockCount] = useState(12);
  const [isSettingUp, setIsSettingUp] = useState(false);

  // OTP refs for focus management
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  // ── Cleanup reCAPTCHA on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  // ── Create (or re-create) reCAPTCHA verifier ─────────────────────────────
  const initRecaptcha = useCallback(() => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
    // Remove old container content so Firebase can re-render
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';

    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'normal',
        callback: () => {
          // reCAPTCHA solved — nothing to do here; submit button handles it
        },
        'expired-callback': () => {
          setPhoneError('reCAPTCHA expired. Please solve it again.');
        },
      }
    );
    recaptchaVerifierRef.current.render().catch(() => {
      setPhoneError('Failed to load reCAPTCHA. Please refresh and try again.');
    });
  }, []);

  // Render reCAPTCHA when on credentials step (skip in dev bypass mode)
  useEffect(() => {
    if (step === 'credentials' && !DEV_BYPASS) {
      const timeout = setTimeout(() => initRecaptcha(), 300);
      return () => clearTimeout(timeout);
    }
  }, [step, initRecaptcha]);

  // ── Send OTP ─────────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    if (!name.trim()) {
      setPhoneError('Please enter your full name.');
      return;
    }

    const { valid, message } = validateIndianPhone(phoneNumber);
    if (!valid) {
      setPhoneError(message);
      return;
    }

    // ── Dev bypass: skip OTP entirely and go straight to farm setup ──────────
    if (DEV_BYPASS) {
      setFarmerName(name.trim());
      setStep('farm');
      return;
    }

    if (!recaptchaVerifierRef.current) {
      setPhoneError('reCAPTCHA not ready. Please wait and try again.');
      return;
    }

    const fullPhone = `+91${phoneNumber.replace(/\D/g, '')}`;

    setIsSending(true);
    try {
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaVerifierRef.current
      );
      setConfirmationResult(result);
      setFarmerName(name.trim());
      setSentNotice(`OTP sent to ${maskPhone(phoneNumber)}`);
      setStep('otp');
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    } catch (err: any) {
      const code = err?.code ?? '';
      setPhoneError(friendlyError(code));
      initRecaptcha();
    } finally {
      setIsSending(false);
    }
  };

  // ── OTP input handling ───────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    // Allow only digits
    if (value && !/^\d$/.test(value)) return;
    setOtpError('');
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      setOtpError('');
      otpRefs.current[5]?.focus();
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }
    if (!confirmationResult) {
      setOtpError('Session lost. Please go back and request a new OTP.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');
    try {
      await confirmationResult.confirm(enteredOtp);
      // Firebase auth state is now set. Proceed to farm setup.
      setStep('farm');
    } catch (err: any) {
      const code = err?.code ?? '';
      setOtpError(friendlyError(code));
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (countdown > 0 || isSending) return;
    setOtpError('');
    setPhoneError('');

    initRecaptcha();
    // Small wait for DOM re-render
    await new Promise((res) => setTimeout(res, 400));

    const fullPhone = `+91${phoneNumber.replace(/\D/g, '')}`;
    setIsSending(true);
    try {
      if (!recaptchaVerifierRef.current) throw new Error('reCAPTCHA not ready');
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaVerifierRef.current
      );
      setConfirmationResult(result);
      setSentNotice(`New OTP sent to ${maskPhone(phoneNumber)}`);
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    } catch (err: any) {
      const code = err?.code ?? '';
      setOtpError(friendlyError(code));
      initRecaptcha();
    } finally {
      setIsSending(false);
    }
  };

  // ── Farm Setup ───────────────────────────────────────────────────────────
  const handleCompleteFarmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingUp(true);

    // In dev bypass mode use a fixed local UID; in production require a real Firebase user.
    // auth is null when DEV_BYPASS=true, so never call auth.currentUser in that mode.
    const firebaseUser = DEV_BYPASS ? null : auth.currentUser;
    if (!DEV_BYPASS && !firebaseUser) {
      setIsSettingUp(false);
      setOtpError(
        'Authentication session lost. Please verify your phone number again.'
      );
      setStep('credentials');
      setConfirmationResult(null);
      setOtpDigits(['', '', '', '', '', '']);
      return;
    }

    const uid = DEV_BYPASS ? 'dev-user-local' : firebaseUser!.uid;
    const verifiedPhone = DEV_BYPASS
      ? `+91${phoneNumber.replace(/\D/g, '')}`
      : (firebaseUser!.phoneNumber ?? `+91${phoneNumber.replace(/\D/g, '')}`);

    const user: UserProfile = {
      id: uid,
      name: farmerName || name || 'Farm Owner',
      phone: verifiedPhone,
      language: 'en',
      role: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const farm: Farm = {
      id: `farm-${Date.now()}`,
      ownerId: uid,           // Farm owner ID always equals the Firebase UID
      name: farmName || 'My Farm',
      farmerName: user.name,
      state: farmState,
      district,
      village,
      farmAreaAcres,
      primaryCrop,
      livestockCount,
      latitude: 26.8206,
      longitude: 75.8055,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSettingUp(false);
    onCompleteAuth(user, farm);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 shadow-xl space-y-6 animate-fade-in relative overflow-hidden">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-agri)] text-white text-2xl font-bold shadow-sm">
            A
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">AgriVision</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            One intelligent system for your entire farm.
          </p>
        </div>

        {/* OTP Sent Notice */}
        {sentNotice && step === 'otp' && (
          <div className="rounded-2xl border border-[var(--primary-agri)]/40 bg-[var(--primary-agri-light)] p-3 text-center text-xs font-bold text-[var(--primary-agri)] shadow-xs animate-fade-in">
            <Sparkles className="h-4 w-4 mx-auto mb-1" />
            <span>{sentNotice}</span>
          </div>
        )}

        {/* ── STEP 1: CREDENTIALS ─────────────────────────────────────── */}
        {step === 'credentials' && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div className="text-center pb-1">
              <h2 className="text-base font-bold text-[var(--text-main)]">
                Verify with Phone OTP
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {DEV_BYPASS
                  ? 'Dev mode active — enter any name and number to skip OTP.'
                  : 'Enter your name and Indian mobile number. A real SMS OTP will be sent.'}
              </p>
              {DEV_BYPASS && (
                <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
                  ⚠ DEV MODE — Firebase OTP bypassed. Set NEXT_PUBLIC_DEV_BYPASS=false for production.
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Your Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                placeholder="e.g. Amit Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                required
                autoComplete="name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Indian Mobile Number
              </label>
              <div className="flex gap-2">
                <span className="flex items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 font-semibold text-[var(--text-main)] text-xs select-none">
                  +91
                </span>
                <input
                  id="auth-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  maxLength={10}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                    setPhoneError('');
                  }}
                  className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                  autoComplete="tel-national"
                />
              </div>
            </div>

            {/* SMS consent notice */}
            <p className="text-[11px] text-[var(--text-muted)] text-center leading-snug">
              By continuing, you agree to receive an SMS verification code.
              Standard messaging rates may apply.
            </p>

            {/* Phone / reCAPTCHA error */}
            {phoneError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{phoneError}</p>
              </div>
            )}

            {/* reCAPTCHA container — only rendered when Firebase is active */}
            {!DEV_BYPASS && (
              <div className="flex justify-center">
                <div id="recaptcha-container" ref={recaptchaContainerRef} />
              </div>
            )}

            <button
              id="send-otp-btn"
              type="submit"
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : DEV_BYPASS ? (
                <><ArrowRight className="h-4 w-4" /> Continue (Dev Mode)</>
              ) : (
                <>Send OTP via SMS <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: VERIFY OTP ──────────────────────────────────────── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-[var(--text-main)]">
                Enter 6-Digit OTP
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Sent via SMS to {maskPhone(phoneNumber)}
              </p>
            </div>

            {/* Six OTP boxes */}
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  id={`otp-digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="h-11 w-11 rounded-xl border-2 border-[var(--border-subtle)] bg-[var(--bg-app)] text-center text-base font-bold text-[var(--text-main)] focus:border-[var(--primary-agri)] focus:outline-none tabular-nums"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {otpError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{otpError}</p>
              </div>
            )}

            {/* Resend / countdown row */}
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtpDigits(['', '', '', '', '', '']);
                  setOtpError('');
                  setSentNotice('');
                }}
                className="hover:underline"
              >
                Change Number
              </button>
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSending}
                  className="text-[var(--primary-agri)] font-semibold hover:underline disabled:opacity-50"
                >
                  {isSending ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Sending…
                    </span>
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              )}
            </div>

            {/* NOTE: The reCAPTCHA verifier is kept alive in recaptchaVerifierRef.
                 The actual DOM container lives only on the credentials step
                 (id="recaptcha-container" rendered there). Rendering a second
                 element with the same id here would violate DOM uniqueness and
                 break Firebase's internal widget lookup. */}

            <button
              id="verify-otp-btn"
              type="submit"
              disabled={isVerifying || otpDigits.join('').length < 6}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Verify OTP &amp; Setup Farm
                </>
              )}
            </button>
          </form>
        )}

        {/* ── STEP 3: FARM SETUP ──────────────────────────────────────── */}
        {step === 'farm' && (
          <form onSubmit={handleCompleteFarmSetup} className="space-y-4 text-xs">
            <div className="text-center pb-1">
              <CheckCircle2 className="h-8 w-8 text-[var(--primary-agri)] mx-auto mb-1" />
              <h2 className="text-base font-bold text-[var(--text-main)]">
                Setup Farm Digital Twin
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Phone verified! Configure your farm for:{' '}
                <span className="font-bold text-[var(--text-main)]">{farmerName || name}</span>
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                <Building2 className="inline h-3.5 w-3.5 mr-1" />Farm Name
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />State
                </label>
                <input
                  type="text"
                  value={farmState}
                  onChange={(e) => setFarmState(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  <Sprout className="inline h-3.5 w-3.5 mr-1" />Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={farmAreaAcres}
                  onChange={(e) => setFarmAreaAcres(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Primary Crop</label>
                <input
                  type="text"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>
            </div>

            <button
              id="launch-dashboard-btn"
              type="submit"
              disabled={isSettingUp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSettingUp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Launch AgriVision Intelligence Dashboard'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
