const BASE_URL = 'http://localhost:8080/api/v1';

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

export interface ApiError {
  [key: string]: string | string[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ApiError;
  }

  return data as T;
}

export const api = {
  customers: {
    signup: (payload: CustomerSignupPayload) =>
      request<CustomerSignupResponse>('/customers/signup/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  petsitters: {
    signup: (payload: PetSitterSignupPayload) =>
      request<PetSitterSignupResponse>('/petsitters/signup/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
};
