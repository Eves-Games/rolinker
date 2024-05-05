import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    redirect(`https://www.iubenda.com/privacy-policy/42805761`)
}