import { signIn } from "@/auth";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('callbackUrl');

  if (query !== null) {
    await signIn('discord', { callbackUrl: query });
  } else {
    await signIn('discord');
  }
}