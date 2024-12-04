import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function useSecurityLog() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      const logSecurityEvent = async () => {
        try {
          await fetch("/api/security/log", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event: "session_start",
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            }),
          })
        } catch (error) {
          console.error("Erreur lors du logging:", error)
        }
      }

      logSecurityEvent()
    }
  }, [session])
} 