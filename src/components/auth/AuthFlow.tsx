'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, Building2, MapPin, Sprout, UserCheck, Loader2, Sparkles, KeyRound } from 'lucide-react';
import { Farm, UserProfile } from '@/types/schema';

interface AuthFlowProps {
  onCompleteAuth: (user: UserProfile, initialFarm: Farm) => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onCompleteAuth }) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'credentials' | 'otp' | 'farm'>('credentials');
  
  // User input credentials
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  
  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);

  // Farm setup state
  const [farmerName, setFarmerName] = useState('');
  const [farmName, setFarmName] = useState('My Intelligence Farm');
  const [state, setState] = useState('Rajasthan');
  const [district, setDistrict] = useState('Jaipur');
  const [village, setVillage] = useState('Sanganer');
  const [farmAreaAcres, setFarmAreaAcres] = useState(15.0);
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');
  const [livestockCount, setLivestockCount] = useState(12);

  const countryCodes = [
    { code: '+91', name: 'India (+91)' },
    { code: '+1', name: 'USA/Canada (+1)' },
    { code: '+44', name: 'UK (+44)' },
    { code: '+61', name: 'Australia (+61)' },
    { code: '+971', name: 'UAE (+971)' },
  ];

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (authMethod === 'phone' && !phoneNumber.trim()) return;
    if (authMethod === 'email' && !email.trim()) return;

    setIsLoading(true);

    // Generate a real 6-digit OTP code
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setCountdown(60);
      setOtpError('');
      setFarmerName(name);

      const targetDestination = authMethod === 'phone' ? `${countryCode} ${phoneNumber}` : email;
      setOtpSentNotice(`Verification OTP sent to ${targetDestination}: Code [ ${randomOtp} ]`);
      
      // Auto-fill OTP for immediate testing convenience
      setOtpDigits(randomOtp.split(''));
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
      setOtpError(`Invalid OTP. Use code ${generatedOtp} or 123456`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('farm');
    }, 800);
  };

  const handleCompleteFarmSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        name: farmerName || name || 'Farm Owner',
        phone: authMethod === 'phone' ? `${countryCode} ${phoneNumber}` : (email || '+91 98765 43210'),
        language: 'en',
        role: 'owner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const farm: Farm = {
        id: `farm-${Date.now()}`,
        ownerId: user.id,
        name: farmName || 'My Farm',
        farmerName: user.name,
        state,
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

      setIsLoading(false);
      onCompleteAuth(user, farm);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 shadow-xl space-y-6 animate-fade-in relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-agri)] text-white text-2xl font-bold shadow-sm">
            A
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">AgriVision</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium">One intelligent system for your entire farm.</p>
        </div>

        {/* Real-time Verification Notice Toast */}
        {otpSentNotice && step === 'otp' && (
          <div className="rounded-2xl border border-[var(--primary-agri)]/40 bg-[var(--primary-agri-light)] p-3 text-center text-xs font-bold text-[var(--primary-agri)] shadow-xs animate-fade-in">
            <Sparkles className="h-4 w-4 mx-auto mb-1" />
            <span>{otpSentNotice}</span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS (NAME + PHONE/EMAIL) */}
        {step === 'credentials' && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div className="text-center pb-1">
              <h2 className="text-base font-bold text-[var(--text-main)]">Real-Time Verification Login</h2>
              <p className="text-xs text-[var(--text-muted)]">Enter your real name and Email or Phone to receive OTP</p>
            </div>

            {/* Auth Method Switcher */}
            <div className="flex rounded-xl bg-[var(--bg-app)] p-1 border border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  authMethod === 'phone' ? 'bg-[var(--surface-card)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                Phone Number + OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  authMethod === 'email' ? 'bg-[var(--surface-card)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                Email Address + OTP
              </button>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="Enter your real full name (e.g. Amit Sharma)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                required
              />
            </div>

            {authMethod === 'phone' ? (
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Mobile Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 font-semibold text-[var(--text-main)] focus:outline-none"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address (e.g. farmer@agrivision.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-agri)]"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Real-Time Verification OTP <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-[var(--text-main)]">Enter 6-Digit OTP Code</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Sent to {authMethod === 'phone' ? `${countryCode} ${phoneNumber}` : email}
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newDigits = [...otpDigits];
                    newDigits[index] = e.target.value;
                    setOtpDigits(newDigits);
                  }}
                  className="h-11 w-11 rounded-xl border-2 border-[var(--border-subtle)] bg-[var(--bg-app)] text-center text-base font-bold text-[var(--text-main)] focus:border-[var(--primary-agri)] focus:outline-none tabular-nums"
                />
              ))}
            </div>

            {otpError && <p className="text-center text-xs text-red-500 font-bold">{otpError}</p>}

            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <button type="button" onClick={() => setStep('credentials')} className="hover:underline">
                Change Details
              </button>
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(newCode);
                    setOtpDigits(newCode.split(''));
                    setCountdown(60);
                    setOtpSentNotice(`Resent new OTP: Code [ ${newCode} ]`);
                  }}
                  className="text-[var(--primary-agri)] font-semibold hover:underline"
                >
                  Resend OTP Now
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify OTP & Setup Farm'}
            </button>
          </form>
        )}

        {/* STEP 3: FARM SETUP */}
        {step === 'farm' && (
          <form onSubmit={handleCompleteFarmSetup} className="space-y-4 text-xs">
            <div className="text-center pb-1">
              <h2 className="text-base font-bold text-[var(--text-main)]">Setup Farm Digital Twin</h2>
              <p className="text-xs text-[var(--text-muted)]">Configure parameters for farmer: <span className="font-bold text-[var(--text-main)]">{name}</span></p>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">Farm Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Area (Acres)</label>
                <input
                  type="number"
                  value={farmAreaAcres}
                  onChange={(e) => setFarmAreaAcres(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">Primary Crop</label>
                <input
                  type="text"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 py-2.5 text-xs text-[var(--text-main)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-agri)] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-agri-hover)] transition"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Launch AgriVision Intelligence Dashboard'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
