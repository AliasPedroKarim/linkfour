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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const linkSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  url: z.string().url("L'URL doit être valide"),
  pageId: z.string().optional(),
})

type LinkFormValues = z.infer<typeof linkSchema>

interface EditLinkFormProps {
  link: {
    id: string
    title: string
    url: string
    pageId: string | null
  }
  pages: {
    id: string
    title: string
  }[]
}

export function EditLinkForm({ link, pages }: EditLinkFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
      pageId: link.pageId || undefined,
    },
  })

  async function onSubmit(data: LinkFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      toast.success("Lien modifié avec succès")
      router.refresh()
      router.push("/dashboard/links")
    } catch (error) {
      toast.error("Erreur lors de la modification du lien")
    } finally {
      setIsLoading(false)
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
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une page" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Aucune page</SelectItem>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Optionnel : associez ce lien à une de vos pages
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Modification..." : "Modifier le lien"}
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