
revoke all on function public.current_workspace_id() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke all on function public.bootstrap_workspace(text, text) from public, anon;
grant execute on function public.bootstrap_workspace(text, text) to authenticated;
grant execute on function public.current_workspace_id() to service_role;
grant execute on function public.has_role(uuid, public.app_role) to service_role;
