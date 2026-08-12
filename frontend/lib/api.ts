import { supabase } from "./supabase";

export type Charity = {
  id: string;
  slug: string;
  name: string;
};

export async function getCharities(): Promise<Charity[]> {
  const { data, error } = await supabase.rpc("get_charities");
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.out_id,
    slug: row.out_slug,
    name: row.out_name,
  }));
}