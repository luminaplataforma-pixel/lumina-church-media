import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/lib/workspace";

export type TableName =
  | "team_members"
  | "events"
  | "verses"
  | "captions"
  | "assets"
  | "contents"
  | "schedules"
  | "instagram_accounts"
  | "instagram_insights"
  | "instagram_media"
  | "activities";

type Row = Record<string, unknown> & { id: string };

export function useRows<T = Row>(
  table: TableName,
  opts?: { order?: string; ascending?: boolean; limit?: number },
) {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: ["rows", table, workspaceId, opts?.order, opts?.ascending, opts?.limit],
    enabled: !!workspaceId,
    queryFn: async () => {
      let q = supabase.from(table).select("*").eq("workspace_id", workspaceId!);
      if (opts?.order) q = q.order(opts.order, { ascending: opts.ascending ?? false });
      else q = q.order("created_at", { ascending: false });
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export async function logActivity(
  workspaceId: string,
  actorName: string,
  action: string,
  entity: string,
  entityTitle?: string | null,
) {
  await supabase.from("activities").insert({
    workspace_id: workspaceId,
    actor_name: actorName,
    action,
    entity,
    entity_title: entityTitle ?? null,
  });
}

export function useSaveRow(table: TableName, entityLabel: string) {
  const { workspaceId, fullName } = useWorkspace();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown> & { id?: string }) => {
      if (!workspaceId) throw new Error("Workspace não encontrado");
      const { id, ...rest } = values;
      if (id) {
        const { data, error } = await supabase
          .from(table)
          .update(rest as never)
          .eq("id", id)
          .eq("workspace_id", workspaceId)
          .select()
          .single();
        if (error) throw error;
        await logActivity(
          workspaceId,
          fullName,
          "editou",
          entityLabel,
          String(rest['title'] ?? rest['name'] ?? ""),
        );
        return data;
      }
      const { data, error } = await supabase
        .from(table)
        .insert({ ...rest, workspace_id: workspaceId } as never)
        .select()
        .single();
      if (error) throw error;
      await logActivity(
        workspaceId,
        fullName,
        "criou",
        entityLabel,
        String(rest['title'] ?? rest['name'] ?? ""),
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rows"] });
      toast.success("Alterações salvas com sucesso.");
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível salvar."),
  });
}

export function useDeleteRow(table: TableName, entityLabel: string) {
  const { workspaceId, fullName } = useWorkspace();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id)
        .eq("workspace_id", workspaceId!);
      if (error) throw error;
      await logActivity(workspaceId!, fullName, "excluiu", entityLabel);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rows"] });
      toast.success("Registro excluído.");
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível excluir."),
  });
}

export function useBulkInsert(table: TableName, entityLabel: string) {
  const { workspaceId, fullName } = useWorkspace();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rows: Record<string, unknown>[]) => {
      const payload = rows.map((r) => ({ ...r, workspace_id: workspaceId }));
      const { error } = await supabase.from(table).insert(payload as never);
      if (error) throw error;
      await logActivity(workspaceId!, fullName, "criou", entityLabel, `${rows.length} registro(s)`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rows"] });
      toast.success("Alterações salvas com sucesso.");
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível salvar."),
  });
}

export async function uploadToStorage(workspaceId: string, file: File) {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${workspaceId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr) throw signErr;
  return { path, url: data.signedUrl };
}
