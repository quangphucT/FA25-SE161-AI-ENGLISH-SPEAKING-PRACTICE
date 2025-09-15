
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  message: string;
  account: {
    accessToken: string;
    refreshToken: string;
    avatar: string | null;
    createdAt: string;
    description: string | null;
    email: string;
    firstName: string;
    id: number;
    isActive: boolean;
    phone: string | null;
    updatedAt: string;
    lastName: string;
  };
}


export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
} 

export interface RegisterResponse {
  message: string;
  account: {
    accessToken: string;
    refreshToken: string;
    avatar: string | null;
    createdAt: string;
    description: string | null;
    email: string;
    firstName: string;
    id: number; 
    isActive: boolean;
    phone: string | null;
    updatedAt: string;
    lastName: string;
  };
} 