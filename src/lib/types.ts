export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: number;
    email: string;
    name?: string | null;
    emailVerified?: boolean;
}

export interface AuthResponse extends AuthTokens {
    user?: User;
}

export interface ApiSuccessResponse {
    success: true;
}

export interface ApiErrorShape {
    statusCode: number;
    message: string | string[];
    error?: string;
}