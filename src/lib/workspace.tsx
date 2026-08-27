import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/lumina";

export type WorkspaceState = {
  userId: string | null;
  email: string | null;
  workspaceId: string | null;
  workspaceName: string;
  fullName: string;
  roles: AppRole[];
  loading: boolean;
  refresh: () => void;
};

const Ctx = createContext<WorkspaceState>({
  userId: null,
  email: null,
  workspaceId: null,
  workspaceName: "",
  fullName: "",
  roles: [],
  loading: true,
  refresh: () => {},
});

async function loadSession() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  let { data: profile } = await supabase
    .from("profiles")
    .select("workspace_id, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.workspace_id) {
    const meta = (user.user_metadata ?? {}) as Record<string, string>;
    await supabase.rpc("bootstrap_workspace", {
      _church_name: meta['church_name'] || "Minha Igreja",
      _full_name: meta['full_name'] || user.email?.split("@")[0] || "",
    });
    const again = await supabase
      .from("profiles")
      .select("workspace_id, full_name")
      .eq("id", user.id)
      .maybeSingle();
    profile = again.data;
  }

  const [{ data: ws }, { data: roleRows }] = await Promise.all([
    profile?.workspace_id
      ? supabase.from("workspaces").select("name").eq("id", profile.workspace_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  return {
    userId: user.id,
    email: user.email ?? null,
    workspaceId: profile?.workspace_id ?? null,
    workspaceName: ws?.name ?? "Minha Igreja",
    fullName: profile?.full_name || user.email?.split("@")[0] || "",
    roles: (roleRows ?? []).map((r) => r.role as AppRole),
  };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["workspace"],
    queryFn: loadSession,
    staleTime: 60_000,
  });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        queryClient.invalidateQueries({ queryKey: ["workspace"] });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  return (
    <Ctx.Provider
      value={{
        userId: data?.userId ?? null,
        email: data?.email ?? null,
        workspaceId: data?.workspaceId ?? null,
        workspaceName: data?.workspaceName ?? "",
        fullName: data?.fullName ?? "",
        roles: data?.roles ?? [],
        loading: isLoading,
        refresh: () => void refetch(),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useWorkspace = () => useContext(Ctx);
