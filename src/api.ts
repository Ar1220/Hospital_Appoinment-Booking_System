// =====================================================
// REQUIEM MEDICAL CENTER - Frontend API Client
// Talks to the Express + MySQL backend (../backend)
// =====================================================

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:3002/api").replace(/\/+$/, "");

export type ApiDoctor = {
  id: string;
  initials: string;
  name: string;
  specialty: string;
  experience: string | null;
  education: string | null;
  languages: string | null;
  rating: string | number;
  status: "available" | "busy" | "offline";
  availability_note: string | null;
  portrait_url: string | null;
  hue: string;
};

export type ApiAppointmentType = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  duration_minutes: number;
};

export type CreatedAppointment = {
  appointmentId: number;
  appointmentNumber: string;
  confirmationCode: string;
  status: string;
};

export type AppointmentPayload = {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  appointmentType: string;
  doctor: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  emergencyName: string;
  emergencyPhone: string;
  notes: string;
};

type Envelope<T> = { success: boolean; count?: number; data: T; message?: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body as T;
}

export const api = {
  baseUrl: API_BASE,

  health() {
    return request<{ status: string; database: string }>("/health");
  },

  async doctors(): Promise<ApiDoctor[]> {
    const body = await request<Envelope<ApiDoctor[]>>("/doctors");
    return body.data;
  },

  async appointmentTypes(): Promise<ApiAppointmentType[]> {
    const body = await request<Envelope<ApiAppointmentType[]>>("/appointment-types");
    return body.data;
  },

  async createAppointment(payload: AppointmentPayload): Promise<CreatedAppointment> {
    const body = await request<Envelope<CreatedAppointment>>("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return body.data;
  },

  async subscribeNewsletter(email: string): Promise<void> {
    await request<Envelope<null>>("/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};
