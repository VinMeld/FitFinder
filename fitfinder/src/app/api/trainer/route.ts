import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from '@supabase/supabase-js'
interface User {
  display_name: string;
  id: string;
}

interface Trainer {
  id: string;
  created_at: string;
  location: string | null;
  yoe: number | null;
  price_range_start: number | null;
  price_range_end: number | null;
  website: string | null;
  bio: string | null;
  instagram: string | null;
  display_name?: string;
}

export async function GET(request: Request) {
  const supabase = createClient();
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabaseAdminClient = createAdminClient(URL, KEY);

  let idToDisplayNameMap: Record<string, string> = {};

  const { data: trainers, error: trainersError } = await supabase.from("trainer").select("*");
  if (trainersError) return new NextResponse(trainersError.message, { status: 500 });

  const { data: users, error: usersError } = await supabaseAdminClient.from('users').select('display_name, id');
  if (usersError) return new NextResponse(usersError.message, { status: 500 });

  users?.forEach(user => idToDisplayNameMap[user.id] = user.display_name);

  trainers?.forEach(trainer => {
    trainer.display_name = idToDisplayNameMap[trainer.id] || 'Not Found';
  });

  console.log(users, trainers);

  return NextResponse.json(trainers);
}
