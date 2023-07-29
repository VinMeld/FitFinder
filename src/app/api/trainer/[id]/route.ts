import { createClient } from "../../../utils/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from '@supabase/supabase-js'

type Props = {
    params: {
        id: string
    }
}

export async function GET(request: Request, { params: { id } }: Props) {
  const supabase = createClient();

  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabaseAdminClient = createAdminClient(URL, KEY);

  let idToDisplayNameMap: Record<string, string> = {};
  let idToPhoneNumberMap: Record<string, string> = {};

  const { data: trainers, error: trainersError } = await supabase.from("trainer").select("*").filter('id', 'eq', id);
  if (trainersError) return new NextResponse(trainersError.message, { status: 500 });

  const { data: users, error: usersError } = await supabaseAdminClient.from('users').select('display_name, id, phone_number').filter('id', 'eq', id);
  if (usersError) return new NextResponse(usersError.message, { status: 500 });

  users?.forEach(user => {
    idToDisplayNameMap[user.id] = user.display_name;
    idToPhoneNumberMap[user.id] = user.phone_number; 
  });

  trainers?.forEach(trainer => {
    trainer.display_name = idToDisplayNameMap[trainer.id] || 'Not Found';
    trainer.phone_number = idToPhoneNumberMap[trainer.id] || 'Not Found';
  });

  return NextResponse.json(trainers);
}

