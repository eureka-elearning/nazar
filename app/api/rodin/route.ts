import { NextResponse } from "next/server"

const API_KEY = "vibecoding" // Public API key

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()

    // Forward the request to the Hyper3D API
    const response = await fetch("https://hyperhuman.deemos.com/api/v2/rodin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API request failed: ${response.status}`, details: errorText },
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
    console.error("Error in Rodin API route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
