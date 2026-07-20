export interface SessionUser {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  es_admin: number;
  avatar: string | null;
}

export type LoginUser = SessionUser;

export interface LoginResponse {
  success: boolean;
  message: string;
  usuario?: LoginUser;
}

export interface MeResponse {
  success: boolean;
  message?: string;
  usuario?: LoginUser;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
