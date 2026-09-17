import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CalendarRange,
  
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PenLine,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LuminaLogo, LuminaMark } from "@/components/lumina-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/lib/theme";
import { useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planejamento", label: "Planejamento", icon: CalendarDays },
  
  { to: "/artes", label: "Biblioteca de Artes", icon: ImageIcon },
  { to: "/versiculos", label: "Banco de Versículos", icon: BookOpen },
  { to: "/legendas", label: "Banco de Legendas", icon: PenLine },
  { to: "/eventos", label: "Eventos", icon: CalendarRange },
  { to: "/escala", label: "Escala", icon: Users },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            title={label}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98]",
              active
                ? "bg-primary text-primary-foreground shadow-[0_8px_20px_rgb(0_0_0/0.16)]"
                : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { workspaceName, fullName } = useWorkspace();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out md:flex",
          collapsed ? "w-[76px]" : "w-[260px]",
        )}
      >
        <div className={cn("flex items-center gap-2 px-5 py-5", collapsed && "justify-center px-0")}>
          {collapsed ? <LuminaMark /> : <LuminaLogo inverse />}
        </div>
        <div className={cn("px-5 pb-5", collapsed && "hidden")}>
          <p className="truncate text-xs text-sidebar-foreground/50">{workspaceName}</p>
        </div>
        <NavLinks collapsed={collapsed} />
        <div className="mt-auto space-y-1 p-3">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground", collapsed && "justify-center px-0")}
            onClick={() => setCollapsed((c) => !c)}
          >
            <Menu className="size-[18px]" />
            {!collapsed && <span>Recolher</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-primary",
              collapsed && "justify-center px-0",
            )}
            onClick={() => void signOut()}
          >
            <LogOut className="size-[18px]" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] bg-sidebar p-0 text-sidebar-foreground">
              <SheetTitle className="px-5 py-5">
                <LuminaLogo inverse />
              </SheetTitle>
              <NavLinks collapsed={false} onNavigate={() => setMobileOpen(false)} />
              <div className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-primary"
                  onClick={() => void signOut()}
                >
                  <LogOut className="size-[18px]" /> Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="md:hidden">
            <LuminaLogo />
          </Link>

          <div className="ml-auto flex items-center gap-2">
            
            <Button variant="outline" size="icon" onClick={toggle} aria-label="Alternar tema">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <div className="hidden items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 sm:flex">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {(fullName || "L").slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-[140px] truncate text-sm">{fullName || "Usuário"}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-lumyes-glow">
          <div className="mx-auto w-full max-w-[1400px] animate-rise space-y-6 p-4 pb-24 sm:p-6 md:pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
