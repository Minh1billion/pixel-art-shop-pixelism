import { api } from "@/lib/axios";
import { AuthValidators } from "../utils/validators";
import type {
    SendOtpRequest,
    RegisterRequest,
    LoginRequest,
    ResetPasswordRequest,
    ApiResponse,
    AuthResponse
} from "@/features/auth/types";

export class AuthService {

    static async sendRegistrationOtp(email: string): Promise<void> {
        const emailError = AuthValidators.validateEmail(email);
        if (emailError) {
            throw new Error(emailError);
        }

        try {
            const response = await api.post<ApiResponse<string>>(
                "/auth/register/send-otp",
                { email } as SendOtpRequest
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static async sendResetPasswordOtp(email: string): Promise<void> {
        const emailError = AuthValidators.validateEmail(email);
        if (emailError) {
            throw new Error(emailError);
        }

        try {
            const response = await api.post<ApiResponse<string>>(
                "/auth/reset-password/send-otp",
                { email } as SendOtpRequest
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static async register(
        email: string,
        username: string,
        fullName: string,
        password: string,
        confirmPassword: string,
        otp: string
    ): Promise<void> {
        const emailError = AuthValidators.validateEmail(email);
        if (emailError) throw new Error(emailError);

        const usernameError = AuthValidators.validateUsername(username);
        if (usernameError) throw new Error(usernameError);

        const fullNameError = AuthValidators.validateFullName(fullName);
        if (fullNameError) throw new Error(fullNameError);

        const passwordError = AuthValidators.validatePassword(password);
        if (passwordError) throw new Error(passwordError);

        const matchError = AuthValidators.validatePasswordMatch(password, confirmPassword);
        if (matchError) throw new Error(matchError);

        const otpError = AuthValidators.validateOtp(otp);
        if (otpError) throw new Error(otpError);

        try {
            const response = await api.post<ApiResponse<AuthResponse["user"]>>(
                "/auth/register",
                {
                    email,
                    username,
                    fullName,
                    password,
                    otp
                } as RegisterRequest
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            if (response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static async login(email: string, password: string): Promise<void> {
        const emailError = AuthValidators.validateEmail(email);
        if (emailError) throw new Error(emailError);

        const passwordError = AuthValidators.validatePassword(password);
        if (passwordError) throw new Error(passwordError);

        try {
            const response = await api.post<ApiResponse<AuthResponse["user"]>>(
                "/auth/login",
                { email, password } as LoginRequest
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            if (response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static async resetPassword(
        email: string,
        otp: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<void> {
        const emailError = AuthValidators.validateEmail(email);
        if (emailError) throw new Error(emailError);

        const otpError = AuthValidators.validateOtp(otp);
        if (otpError) throw new Error(otpError);

        const passwordError = AuthValidators.validatePassword(newPassword);
        if (passwordError) throw new Error(passwordError);

        const matchError = AuthValidators.validatePasswordMatch(newPassword, confirmPassword);
        if (matchError) throw new Error(matchError);

        try {
            const response = await api.post<ApiResponse<AuthResponse["user"]>>(
                "/auth/reset-password",
                {
                    email,
                    otp,
                    newPassword
                } as ResetPasswordRequest
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            if (response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static async logout(): Promise<void> {
        try {
            await api.post("/auth/logout");
        } finally {
            localStorage.removeItem("user");
        }
    }

    static getCurrentUser(): AuthResponse["user"] | null {
        if (typeof window === "undefined") return null;

        const userStr = localStorage.getItem("user");
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    static async fetchCurrentUser(): Promise<AuthResponse["user"]> {
        try {
            const response = await api.get<ApiResponse<AuthResponse["user"]>>("/auth/me");

            if (response.data.success && response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
                return response.data.data;
            }

            throw new Error("Failed to fetch user");
        } catch (error: any) {
            localStorage.removeItem("user");
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    static async refreshUserData(): Promise<void> {
        try {
            const response = await api.get<ApiResponse<AuthResponse["user"]>>("/auth/me");

            if (response.data.success && response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error: any) {
            localStorage.removeItem("user");
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }
}