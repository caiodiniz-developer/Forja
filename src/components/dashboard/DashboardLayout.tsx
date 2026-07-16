import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar, MobileSidebar, type NavGroup } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ConnectionBanner } from "./ConnectionBanner";

/** Shell for every dashboard route: sidebar + topbar. */
export function DashboardLayout({ groups }: { groups: NavGroup[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen bg-iron-950">

      <Sidebar
        groups={groups}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
      <MobileSidebar
        groups={groups}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <ConnectionBanner />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
