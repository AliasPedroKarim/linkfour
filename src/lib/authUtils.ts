import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  return user
} 