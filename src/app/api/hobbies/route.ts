import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { HobbiesData } from "@/lib/types";

const filePath = path.join(process.cwd(), "data", "hobbies.json");

export async function GET() {
  try {
    const data = JSON.parse(readFileSync(filePath, "utf-8")) as HobbiesData;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read hobbies data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HobbiesData;
    writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hobbies data" }, { status: 500 });
  }
}
