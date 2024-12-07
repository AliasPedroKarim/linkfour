"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { type Report } from "@/app/admin/reports/columns"

interface ReportDetailsDialogProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDetailsDialog({
  report,
  open,
  onOpenChange,
}: ReportDetailsDialogProps) {
  if (!report) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du signalement</DialogTitle>
          <DialogDescription>
            Signalé le{" "}
            {format(new Date(report.createdAt), "PPP 'à' HH:mm", {
              locale: fr,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Type</h4>
            <p className="text-sm text-muted-foreground">
              {report.type === "link" ? "Lien" : "Page"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Titre</h4>
            <p className="text-sm text-muted-foreground">{report.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Signalé par</h4>
            <p className="text-sm text-muted-foreground">{report.reportedBy}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Raison</h4>
            <p className="text-sm text-muted-foreground">{report.reason}</p>
          </div>
          {report.details && (
            <div>
              <h4 className="text-sm font-medium">Détails</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {report.details}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 