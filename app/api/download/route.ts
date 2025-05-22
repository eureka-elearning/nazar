import { NextResponse } from "next/server"

const API_KEY = "vibecoding" // Public API key

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { task_uuid } = body

    if (!task_uuid) {
      return NextResponse.json({ error: "Missing task_uuid" }, { status: 400 })
    }

    const response = await fetch("https://hyperhuman.deemos.com/api/v2/download", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_uuid }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Download failed: ${response.status}`, details: errorText },
        { status: response.status },
      )
    }

    // Проверяем Content-Type ответа
    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      // Если ответ в формате JSON, обрабатываем его как JSON
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      // Если ответ не в формате JSON, обрабатываем его как текст
      const text = await response.text()
      return NextResponse.json({ message: text })
    }
  } catch (error) {
    console.error("Error in Download API route:", error)
    return NextResponse.json({ error: "Failed to download model" }, { status: 500 })
  }
}
