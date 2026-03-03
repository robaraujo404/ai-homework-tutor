import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const { locale } = await params;
    const messagesPath = path.join(process.cwd(), "src/messages", `${locale}.json`);
    const messages = JSON.parse(fs.readFileSync(messagesPath, "utf-8"));
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: "Messages not found" }, { status: 404 });
  }
}
