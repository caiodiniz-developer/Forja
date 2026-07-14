import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { API_BASE } from "@/lib/api";

interface Notif {
  id: string;
  title: string;
  body?: string | null;
  read: boolean;
  createdAt: string;
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  const call = useApi();
  const [openNotif, setOpenNotif] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>([]);

  useEffect(() => {
    call<{ items: Notif[] }>("/notifications")
      .then((r) => setNotifications(r.items))
      .catch(() => {});
  }, [call]);

  const unread = notifications.filter((n) => !n.read).length;
  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-cream/[0.07] bg-iron-950/60 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onMenu}
        aria-label="Abrir menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-cream/70 hover:bg-cream/5 lg:hidden"
      >
        <FiMenu size={20} />
      </button>

      {/* search */}
      <div className="relative flex-1 max-w-md">
        <FiSearch
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40"
        />
        <input
          placeholder="Buscar cursos, aulas, alunos…"
          className="h-10 w-full rounded-xl border border-cream/10 bg-iron-900/50 pl-10 pr-4 text-sm text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-ember-500/50"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-cream/10 bg-cream/5 px-1.5 py-0.5 font-mono text-[0.6rem] text-cream/40 md:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* notifications */}
        <div className="relative">
          <button
            onClick={() => setOpenNotif((v) => !v)}
            aria-label="Notificações"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-cream/70 transition-colors hover:bg-cream/5 hover:text-cream"
          >
            <FiBell size={19} />
            {unread > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
              </span>
            )}
          </button>

          <AnimatePresence>
            {openNotif && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenNotif(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="glass absolute right-0 z-50 mt-2 w-80 rounded-2xl p-2 shadow-glow-lg"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-display font-semibold text-cream">
                      Notificações
                    </span>
                    <span className="font-mono text-[0.65rem] text-ember-300">
                      {unread} não lidas
                    </span>
                  </div>
                  <div className="flex max-h-72 flex-col overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-3 py-6 text-center text-sm text-cream/45">
                        Nenhuma notificação.
                      </p>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          className="flex gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-cream/5"
                        >
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              !n.read ? "bg-ember-400" : "bg-cream/20"
                            }`}
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-cream">
                              {n.title}
                            </span>
                            {n.body && (
                              <span className="block truncate text-xs text-cream/50">
                                {n.body}
                              </span>
                            )}
                            <span className="font-mono text-[0.6rem] text-cream/35">
                              {new Date(n.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  {user?.role !== "ADMIN" && (
                    <Link
                      to="/painel/notificacoes"
                      onClick={() => setOpenNotif(false)}
                      className="mt-1 block rounded-xl px-3 py-2 text-center font-mono text-xs text-ember-300 hover:bg-cream/5"
                    >
                      ver todas
                    </Link>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-molten-soft font-display text-sm font-semibold text-iron-950">
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
      </div>
    </header>
  );
}
