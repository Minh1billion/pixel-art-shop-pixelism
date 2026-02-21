"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from './services/auth.service';
import { AuthValidators } from './utils/validators';
import { useAuthContext } from './context/AuthContext';
import type { LoginRequest, RegisterRequest, ResetPasswordRequest } from '@/features/auth/types';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);

    const emailError = AuthValidators.validateEmail(data.email);
    if (emailError) { setError(emailError); setLoading(false); return; }

    const passwordError = AuthValidators.validatePassword(data.password);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    try {
      await AuthService.login(data);
      refreshUser();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const sendOtp = async (email: string) => {
    setLoading(true);
    setError(null);

    const emailError = AuthValidators.validateEmail(email);
    if (emailError) { setError(emailError); setLoading(false); return; }

    try {
      await AuthService.sendRegistrationOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);

    const usernameError = AuthValidators.validateUsername(data.username);
    if (usernameError) { setError(usernameError); setLoading(false); return; }

    const fullNameError = AuthValidators.validateFullName(data.fullName);
    if (fullNameError) { setError(fullNameError); setLoading(false); return; }

    const passwordError = AuthValidators.validatePassword(data.password);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    const matchError = AuthValidators.validatePasswordMatch(data.password, data.confirmPassword);
    if (matchError) { setError(matchError); setLoading(false); return; }

    const otpError = AuthValidators.validateOtp(data.otp);
    if (otpError) { setError(otpError); setLoading(false); return; }

    try {
      await AuthService.register(data);
      refreshUser();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, register, loading, error, otpSent };
};

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const sendOtp = async (email: string) => {
    setLoading(true);
    setError(null);

    const emailError = AuthValidators.validateEmail(email);
    if (emailError) { setError(emailError); setLoading(false); return; }

    try {
      await AuthService.sendResetPasswordOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setLoading(true);
    setError(null);

    const otpError = AuthValidators.validateOtp(data.otp);
    if (otpError) { setError(otpError); setLoading(false); return; }

    const passwordError = AuthValidators.validatePassword(data.newPassword);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    const matchError = AuthValidators.validatePasswordMatch(data.newPassword, data.confirmPassword);
    if (matchError) { setError(matchError); setLoading(false); return; }

    try {
      await AuthService.resetPassword(data);
      refreshUser();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, resetPassword, loading, error, otpSent };
};

export const useLogout = () => {
  const { logout } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return { logout: handleLogout, loading };
};

export const useAuth = () => {
  return useAuthContext();
};