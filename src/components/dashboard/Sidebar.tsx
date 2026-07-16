import type { IconType } from "react-icons";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { LogoMark } from "@/components/common/Logo";
import { API_BASE } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  to: string;
  icon: IconType;
  end?: boolean;
  badge?: number;
}
export interface NavGroup {
  label?: string;
  items: NavItem[];
}

/* ---------------------------------------------------------------- shared body */

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-8 items-center gap-2.5 px-1">
      <LogoMark className="h-9 w-9 shrink-0" />
      {!collapsed && (
        <span className="font-display text-xl font-semibold text-cream">
          Forja
        </span>
      )}
    </div>
  );
}

function NavList({
  groups,
  collapsed,
  onNavigate,
}: {
  groups: NavGroup[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto py-6">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-1">
          {group.label && !collapsed && (
            <span className="mb-1 px-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-cream/35">
              {group.label}
            </span>
          )}
          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    collapsed && "justify-center",
                    isActive
                      ? "bg-gradient-to-r from-ember-500/[0.18] to-ember-500/[0.02] text-cream"
                      : "text-cream/55 hover:bg-cream/5 hover:text-cream",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-molten"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon
                      size={19}
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-ember-400" : "group-hover:text-ember-300",
                      )}
                    />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && item.badge ? (
                      <span className="rounded-full bg-molten px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-iron-950">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function ProfileCard({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth();
  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-cream/[0.07] bg-iron-950/50 p-2.5",
        collapsed && "justify-center",
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-molten-soft font-display text-sm font-semibold text-iron-950">
        {user?.avatarUrl ? (
          <img
            src={`${API_BASE}${user.avatarUrl}`}
            alt="perfil"
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </span>
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-cream">
              {user?.name}
            </div>
            <div className="truncate font-mono text-[0.65rem] text-cream/45">
              {user?.role === "ADMIN" ? "Administrador" : "Aluno"}
            </div>
          </div>
          <button
            onClick={() => logout()}
            aria-label="Sair"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/50 transition-colors hover:bg-cream/5 hover:text-ember-300"
          >
            <FiLogOut size={16} />
          </button>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- desktop */

export function Sidebar({
  groups,
  collapsed,
  onToggle,
}: {
  groups: NavGroup[];
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-cream/[0.07] bg-gradient-to-b from-iron-900/60 to-iron-950/40 px-3 py-5 backdrop-blur-xl transition-[width] duration-300 lg:flex",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center justify-between">
        <Brand collapsed={collapsed} />
        {!collapsed && (
          <button
            onClick={onToggle}
            aria-label="Recolher menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/45 transition-colors hover:bg-cream/5 hover:text-cream"
          >
            <FiChevronsLeft size={18} />
          </button>
        )}
      </div>
      {collapsed && (
        <button
          onClick={onToggle}
          aria-label="Expandir menu"
          className="mt-4 flex h-8 items-center justify-center rounded-lg text-cream/45 transition-colors hover:bg-cream/5 hover:text-cream"
        >
          <FiChevronsRight size={18} />
        </button>
      )}

      <NavList groups={groups} collapsed={collapsed} />
      <ProfileCard collapsed={collapsed} />
    </aside>
  );
}

/* --------------------------------------------------------------------- mobile */

export function MobileSidebar({
  groups,
  open,
  onClose,
}: {
  groups: NavGroup[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-iron-950/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-cream/[0.07] bg-iron-900 px-3 py-5"
          >
            <div className="flex items-center justify-between">
              <Brand collapsed={false} />
              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/50 hover:bg-cream/5"
              >
                <FiX size={18} />
              </button>
            </div>
            <NavList groups={groups} collapsed={false} onNavigate={onClose} />
            <ProfileCard collapsed={false} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
