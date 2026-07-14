import { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { API_BASE } from "@/lib/api";

/**
 * Surfaces the two silent-failure causes so they're never invisible again:
 * (1) app opened on the old localhost:5173 origin (stale service worker),
 * (2) the backend API being unreachable.
 */
export function ConnectionBanner() {
  const [apiDown, setApiDown] = useState(false);
  const wrongPort =
    typeof window !== "undefined" && window.location.port === "5173";

  useEffect(() => {
    let alive = true;
    const check = () => {
      fetch(`${API_BASE}/health`, { cache: "no-store" })
        .then((r) => alive && setApiDown(!r.ok))
        .catch(() => alive && setApiDown(true));
    };
    check();
    const id = setInterval(check, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!wrongPort && !apiDown) return null;

  return (
    <div className="border-b border-red-500/30 bg-red-500/10 px-4 py-2.5 md:px-6">
      <div className="mx-auto flex max-w-7xl items-start gap-3 text-sm text-red-200">
        <FiAlertTriangle className="mt-0.5 shrink-0" size={16} />
        <div>
          {wrongPort && (
            <p>
              Você abriu <strong>localhost:5173</strong> (porta antiga, com
              service worker que quebra tudo). Abra{" "}
              <a
                href="http://localhost:5180"
                className="font-semibold underline"
              >
                http://localhost:5180
              </a>
              .
            </p>
          )}
          {apiDown && (
            <p>
              Não consigo falar com a API em <strong>{API_BASE}</strong>. Inicie
              o backend: <code>cd backend &amp;&amp; npm run dev</code>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
