GRANT EXECUTE ON FUNCTION public.current_workspace_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_workspace(text, text) TO authenticated;