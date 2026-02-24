import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';
const TOKEN_KEY = '@petkeep_token';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiError {
  [key: string]: string | string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    user_type: 'customer' | 'petsitter';
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface CustomerSignupPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface PetSitterSignupPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  location: string;
  about: string;
  animal_types: string[];
  service_types: string[];
  other_animals?: string;
}

export interface CustomerSignupResponse {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  user_type: string;
  created_at: string;
}

export interface PetSitterSignupResponse {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  user_type: string;
  location: string;
  about: string;
  animal_types: { id: number; animal_type: string; display_name: string }[];
  service_types: { id: number; service_type: string; display_name: string }[];
  other_animals: string | null;
  created_at: string;
}

export interface PetSitter {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  user_type: string;
  location: string;
  about: string;
  animal_types: { id: number; animal_type: string; display_name: string }[];
  service_types: { id: number; service_type: string; display_name: string }[];
  other_animals: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PetSitterListParams {
  search?: string;
  animal_type?: string;   // comma-separated: "dog,cat"
  service_type?: string;  // comma-separated: "keepsitter,keepwalk"
}

// ─── Token helpers ─────────────────────────────────────────────────────────────

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ─── Core fetch ────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (requiresAuth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Token ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 204) return undefined as T;

  const data = await response.json();

  if (!response.ok) throw data as ApiError;

  return data as T;
}

// ─── API ───────────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
      const data = await request<LoginResponse>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      await setToken(data.token);
      return data;
    },
    logout: async (): Promise<void> => {
      try {
        await request('/auth/logout/', { method: 'POST' }, true);
      } finally {
        await removeToken();
      }
    },
  },

  customers: {
    signup: (payload: CustomerSignupPayload) =>
      request<CustomerSignupResponse>('/customers/signup/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  petsitters: {
    list: async (params: PetSitterListParams = {}): Promise<PetSitter[]> => {
      const qs = new URLSearchParams();
      if (params.search)       qs.set('search', params.search);
      if (params.animal_type)  qs.set('animal_type', params.animal_type);
      if (params.service_type) qs.set('service_type', params.service_type);
      const query = qs.toString() ? `?${qs.toString()}` : '';
      const data = await request<PaginatedResponse<PetSitter>>(`/petsitters/${query}`, {}, true);
      return data.results;
    },

    signup: (payload: PetSitterSignupPayload) =>
      request<PetSitterSignupResponse>('/petsitters/signup/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
};
