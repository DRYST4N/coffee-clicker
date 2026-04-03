window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};

const SUPABASE_URL = window.__APP_CONFIG__.SUPABASE_URL || "";
const SUPABASE_KEY = window.__APP_CONFIG__.SUPABASE_KEY || "";
const HAS_SUPABASE_CONFIG = Boolean(SUPABASE_URL && SUPABASE_KEY);

if (!HAS_SUPABASE_CONFIG) {
    console.warn("Supabase no esta configurado para este entorno.");
}
