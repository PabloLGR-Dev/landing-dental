'use server'

import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// ZOD: Validación estricta para clínica
const pacienteSchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto").max(50),
  email: z.string().email("Correo inválido"),
  telefono: z.string().min(7, "Teléfono inválido").max(15),
  servicio: z.string().min(2, "Selecciona un servicio"),
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 citas por minuto max
});

export async function agendarCitaAction(formData: FormData) {
  const honeypot = formData.get("direccion_postal"); // Trampa para bots
  if (honeypot) return { success: true, isBot: true }; 

  const data = {
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
    servicio: formData.get("servicio"),
  };

  const parsed = pacienteSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
  const { success: rateLimitSuccess } = await ratelimit.limit(ip);
  
  if (!rateLimitSuccess) {
    return { error: "Por favor, espera un momento antes de enviar otra solicitud." };
  }

  const { error: supabaseError } = await supabase
    .from('pacientes')
    .insert([parsed.data]);

  if (supabaseError) {
    return { error: "Hubo un error al agendar tu cita. Intenta llamarnos." };
  }

  return { success: true };
}