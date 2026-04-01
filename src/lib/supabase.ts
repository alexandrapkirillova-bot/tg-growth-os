import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Plan = "founder" | "free" | "standard" | "pro";

export async function getUserPlan(): Promise<Plan> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "free";
  const { data } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();
  return (data?.plan as Plan) ?? "free";
}

export async function isFounderSlotAvailable(): Promise<boolean> {
  const { count } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("plan", "founder");
  return (count ?? 0) < 20;
}
