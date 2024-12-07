export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public errors: Record<string, string[]> = {}
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return new Response(JSON.stringify({
      message: error.message,
      errors: error.errors
    }), {
      status: error.statusCode,
      headers: { "Content-Type": "application/json" }
    })
  }

  console.error("Erreur non gérée:", error)
  return new Response(JSON.stringify({
    message: "Une erreur interne est survenue"
  }), {
    status: 500,
    headers: { "Content-Type": "application/json" }
  })
} 