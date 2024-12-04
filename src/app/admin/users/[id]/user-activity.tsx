"use client"

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistance } from "date-fns"
import { fr } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserActivityProps {
  recentClicks: Array<{
    id: string
    createdAt: Date
    link: {
      title: string
    }
  }>
  recentViews: Array<{
    id: string
    createdAt: Date
    page: {
      title: string
    }
  }>
}

export function UserActivity({ recentClicks, recentViews }: UserActivityProps) {
  return (
    <Card>
      <Tabs defaultValue="clicks" className="p-6">
        <h3 className="text-lg font-medium mb-4">Activité récente</h3>
        <TabsList>
          <TabsTrigger value="clicks">Clics</TabsTrigger>
          <TabsTrigger value="views">Vues</TabsTrigger>
        </TabsList>
        <TabsContent value="clicks">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lien</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentClicks.map((click) => (
                <TableRow key={click.id}>
                  <TableCell>{click.link.title}</TableCell>
                  <TableCell>
                    {formatDistance(new Date(click.createdAt), new Date(), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="views">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentViews.map((view) => (
                <TableRow key={view.id}>
                  <TableCell>{view.page.title}</TableCell>
                  <TableCell>
                    {formatDistance(new Date(view.createdAt), new Date(), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  )
} 