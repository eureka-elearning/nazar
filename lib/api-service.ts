export async function submitRodinJob(formData: FormData) {
  try {
    const response = await fetch("/api/rodin", {
      method: "POST",
      body: formData,
    })

    const contentType = response.headers.get("content-type") || ""

    if (!response.ok) {
      // Пытаемся получить детали ошибки
      let errorDetails = ""
      try {
        if (contentType.includes("application/json")) {
          const errorJson = await response.json()
          errorDetails = errorJson.details || errorJson.error || JSON.stringify(errorJson)
        } else {
          errorDetails = await response.text()
        }
      } catch (e) {
        errorDetails = `Status: ${response.status}`
      }

      throw new Error(`API request failed: ${errorDetails}`)
    }

    // Обрабатываем успешный ответ
    if (contentType.includes("application/json")) {
      return await response.json()
    } else {
      const text = await response.text()
      return { message: text }
    }
  } catch (error) {
    console.error("Error submitting job:", error)
    throw error
  }
}

export async function checkJobStatus(subscriptionKey: string) {
  try {
    const response = await fetch(`/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription_key: subscriptionKey,
      }),
    })

    const contentType = response.headers.get("content-type") || ""

    if (!response.ok) {
      // Пытаемся получить детали ошибки
      let errorDetails = ""
      try {
        if (contentType.includes("application/json")) {
          const errorJson = await response.json()
          errorDetails = errorJson.details || errorJson.error || JSON.stringify(errorJson)
        } else {
          errorDetails = await response.text()
        }
      } catch (e) {
        errorDetails = `Status: ${response.status}`
      }

      throw new Error(`Status check failed: ${errorDetails}`)
    }

    // Обрабатываем успешный ответ
    if (contentType.includes("application/json")) {
      return await response.json()
    } else {
      const text = await response.text()
      return { message: text }
    }
  } catch (error) {
    console.error("Error checking status:", error)
    throw error
  }
}

export async function downloadModel(taskUuid: string) {
  try {
    const response = await fetch(`/api/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_uuid: taskUuid,
      }),
    })

    const contentType = response.headers.get("content-type") || ""

    if (!response.ok) {
      // Пытаемся получить детали ошибки
      let errorDetails = ""
      try {
        if (contentType.includes("application/json")) {
          const errorJson = await response.json()
          errorDetails = errorJson.details || errorJson.error || JSON.stringify(errorJson)
        } else {
          errorDetails = await response.text()
        }
      } catch (e) {
        errorDetails = `Status: ${response.status}`
      }

      throw new Error(`Download failed: ${errorDetails}`)
    }

    // Обрабатываем успешный ответ
    if (contentType.includes("application/json")) {
      return await response.json()
    } else {
      const text = await response.text()
      return { message: text }
    }
  } catch (error) {
    console.error("Error downloading model:", error)
    throw error
  }
}
