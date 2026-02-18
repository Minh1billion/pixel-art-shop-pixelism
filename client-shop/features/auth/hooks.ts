"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from './services/auth.service';
import { AuthValidators } from './utils/validators';
import { useAuthContext } from './context/AuthContext';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const emailError = AuthValidators.validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = AuthValidators.validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      await AuthService.login(email, password);
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
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

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

  const register = async (
    email: string,
    username: string,
    fullName: string,
    password: string,
    confirmPassword: string,
    otp: string
  ) => {
    setLoading(true);
    setError(null);

    const usernameError = AuthValidators.validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      setLoading(false);
      return;
    }

    const fullNameError = AuthValidators.validateFullName(fullName);
    if (fullNameError) {
      setError(fullNameError);
      setLoading(false);
      return;
    }

    const passwordError = AuthValidators.validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    const matchError = AuthValidators.validatePasswordMatch(password, confirmPassword);
    if (matchError) {
      setError(matchError);
      setLoading(false);
      return;
    }

    const otpError = AuthValidators.validateOtp(otp);
    if (otpError) {
      setError(otpError);
      setLoading(false);
      return;
    }

    try {
      await AuthService.register(email, username, fullName, password, confirmPassword, otp);
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
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

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

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    setError(null);

    const otpError = AuthValidators.validateOtp(otp);
    if (otpError) {
      setError(otpError);
      setLoading(false);
      return;
    }

    const passwordError = AuthValidators.validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    const matchError = AuthValidators.validatePasswordMatch(newPassword, confirmPassword);
    if (matchError) {
      setError(matchError);
      setLoading(false);
      return;
    }

    try {
      await AuthService.resetPassword(email, otp, newPassword, confirmPassword);
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