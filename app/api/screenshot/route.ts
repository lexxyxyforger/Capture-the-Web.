import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "URL wajib diisi bro!" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    return NextResponse.json({ error: "URL ga valid nih, cek lagi!" }, { status: 400 });
  }

  try {
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--window-size=1280,800",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.5 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(parsedUrl.href, {
      waitUntil: "networkidle2",
      timeout: 25000,
    });

    await new Promise((r) => setTimeout(r, 1500));

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    await browser.close();

    const base64 = Buffer.from(screenshot).toString("base64");
    const hostname = parsedUrl.hostname.replace("www.", "");

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
      filename: `snapshot-${hostname}-${Date.now()}.png`,
      hostname,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Gagal screenshot: ${message}` },
      { status: 500 }
    );
  }
}