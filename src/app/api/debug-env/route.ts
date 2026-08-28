import { NextResponse } from "next/server";

// TEMPORARY DEBUG — remove after confirming env var works
export async function GET() {
  const pwd = process.env.ADMIN_PASSWORD;
  return NextResponse.json({
    set: !!pwd,
    length: pwd?.length ?? 0,
    firstChar: pwd?.[0] ?? null,
    lastChar: pwd?.[pwd.length - 1] ?? null,
  });
}
