import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export function GET() {
  const html = readFileSync(path.join(process.cwd(), "Analysis.html"), "utf-8")
    // Fix the back link to point to the Next.js portfolio instead of main.html
    .replace(/href="main\.html"/g, 'href="/"');

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
