"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"

const pageSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, {
    message: "Le slug ne peut contenir que des lettres, chiffres et tirets",
  }),
  isPublic: z.boolean().default(true),
  theme: z.string().optional(),
})

type PageFormValues = z.infer<typeof pageSchema>

interface EditPageFormProps {
  page: {
    id: string
    title: string
    description: string | null
    slug: string
    isPublic: boolean
    theme: string | null
  }
}

export function EditPageForm({ page }: EditPageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page.title,
      description: page.description || "",
      slug: page.slug,
      isPublic: page.isPublic,
      theme: page.theme || "default",
    },
  })

  async function onSubmit(data: PageFormValues) {
    setLoading(true)

    try {
      const response = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      toast.success("Page modifiée avec succès")
      router.refresh()
    } catch (error) {
      toast.error("Erreur lors de la modification de la page")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Une brève description de votre page (optionnel)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL personnalisée</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {process.env.NEXT_PUBLIC_APP_URL}/p/
                  </span>
                  <Input {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Page publique</FormLabel>
                <FormDescription>
                  Rendre cette page accessible à tous
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  )
} 