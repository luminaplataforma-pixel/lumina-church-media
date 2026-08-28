import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Copy, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader } from "@/components/ui-bits";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBulkInsert, useDeleteRow, useRows, useSaveRow } from "@/lib/data";
import {
  formatDateBR,
  MEDIA_ROLE_LIST,
  MEDIA_ROLE_META,
  MONTHS,
  type MediaRole,
} from "@/lib/lumina";
import type { ScheduleRow, TeamMemberRow } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/escala")({
  head: () => ({
    meta: [
      { title: "Escala da Equipe — Lumina" },
      {
        name: "description",
        content: "Monte a escala mensal da equipe de mídia com funções, datas e alerta de conflitos.",
      },
      { property: "og:title", content: "Escala da Equipe — Lumina" },
      { property: "og:description", content: "Escala mensal reutilizável da equipe de mídia." },
    ],
  }),
  component: Escala;
});

function Escala() {
  return null;
}
