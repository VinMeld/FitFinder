import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import "server-only";

//import type { Database } from "@/types/supabase";
//add typescript tag later
// createServerComponentClient<Database>({
//     cookies,
//   });
export const createClient = () =>
createServerComponentClient({
    cookies,
  });