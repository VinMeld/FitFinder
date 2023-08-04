'use server'
import { createClient } from "../../utils/supabase-server";
import { NextResponse } from "next/server";
import { zeroShotClassification } from "../utils/zero_shot_api";
export async function GET(request: Request) {
    const supabase = createClient();

    // Fetch the Current User
    const {
    data: { session },
    } = await supabase.auth.getSession();
    // If there is no user, return 401 Unauthorized
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    // Get trainer
    const { data: trainer, error } = await supabase
    .from("trainer")
    .select("*")
    .eq('id', session.user.id);
    if (error) {
        return new NextResponse(error.message, { status: 500 });
    }
    const classificationResult = await zeroShotClassification(trainer[0].bio);
    console.log(classificationResult);

    return NextResponse.json(classificationResult);
}