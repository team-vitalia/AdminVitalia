import { apiFetch, setAuthToken, removeAuthToken } from "./api";

export interface AdministradorClinica {
  id: number;
  nombre_completo: string;
  correo_electronico: string;
  estado?: string | null;
  ultimo_acceso?: string | null;
}

export interface PlanClinica {
  id: number;
  nombre: string;
  precio_mensual: number;
  paypal_plan_id?: string | null;
}

export interface ClinicaSuperadmin {
  id: number;
  nombre_comercial: string;
  activa: boolean;
  fecha_registro: string;
  paypal_subscription_id?: string | null;
  plan?: PlanClinica | null;
  administradores: AdministradorClinica[];
  total_usuarios: number;
  total_pacientes: number;
}

export interface MetricasSuperadmin {
  total_clinicas: number;
  clinicas_activas: number;
  clinicas_inactivas: number;
  ingresos_mensuales: number;
  total_planes: number;
  total_usuarios: number;
}

export interface PlanSuperadmin {
  id: number;
  nombre: string;
  precio_mensual: number;
  precio_anual: number;
  limite_personal: number;
  limite_pacientes: number;
  incluye_calendar: boolean;
  incluye_correos: boolean;
  limite_ia_mensual: number;
  paypal_plan_id?: string | null;
  clinicas_activas_count: number;
}

export interface UsuarioSuperadmin {
  id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  estado: string;
}

export async function loginSuperadmin(
  correo_electronico: string,
  password: string
): Promise<{ access_token: string; usuario: UsuarioSuperadmin }> {
  const loginRes = await apiFetch<{ access_token: string; token_type: string }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ correo_electronico, password }),
    }
  );

  setAuthToken(loginRes.access_token);

  const meRes = await apiFetch<UsuarioSuperadmin>("/api/auth/me");

  if (meRes.rol_id !== 1) {
    removeAuthToken();
    throw new Error("Acceso denegado: esta cuenta no posee privilegios de Super Administrador.");
  }

  return { access_token: loginRes.access_token, usuario: meRes };
}

export async function getMe(): Promise<UsuarioSuperadmin> {
  return apiFetch<UsuarioSuperadmin>("/api/auth/me");
}

export async function getMetricas(): Promise<MetricasSuperadmin> {
  return apiFetch<MetricasSuperadmin>("/api/superadmin/metricas");
}

export async function getClinicas(): Promise<ClinicaSuperadmin[]> {
  return apiFetch<ClinicaSuperadmin[]>("/api/superadmin/clinicas");
}

export async function updateEstadoClinica(
  id: number,
  activa: boolean
): Promise<ClinicaSuperadmin> {
  return apiFetch<ClinicaSuperadmin>(`/api/superadmin/clinicas/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ activa }),
  });
}

export async function getPlanes(): Promise<PlanSuperadmin[]> {
  return apiFetch<PlanSuperadmin[]>("/api/superadmin/planes");
}
