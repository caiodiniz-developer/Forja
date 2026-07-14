import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { label: "Trilhas", href: "#trilhas" },
  { label: "Cursos", href: "#cursos" },
  { label: "Comunidade", href: "#comunidade" },
  { label: "Planos", href: "#planos" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="container-forge">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 md:px-5",
            scrolled ? "glass shadow-ember" : "bg-transparent",
          )}
        >
          <a href="#topo" className="group flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center">
              <span className="absolute inset-0 rounded-lg bg-molten opacity-90 blur-[2px] transition-opacity group-hover:opacity-100" />
              <span className="relative font-display text-lg font-bold text-iron-950">
                F
              </span>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-cream">
              Forja
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-cream/70 transition-colors hover:bg-cream/5 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(user?.role === "ADMIN" ? "/admin" : "/painel")
                  }
                >
                  Meu painel
                </Button>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Começar grátis
                </Button>
              </>
            )}
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="container-forge mt-2 md:hidden"
          >
            <div className="glass flex flex-col gap-1 rounded-2xl p-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-cream/80 hover:bg-cream/5"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    Sair
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                    >
                      Entrar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        navigate("/register");
                      }}
                    >
                      Começar grátis
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
