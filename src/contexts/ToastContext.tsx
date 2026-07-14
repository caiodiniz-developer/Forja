import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{
  toast: (message: string, type?: ToastType) => void;
} | null>(null);

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
};
const accents = {
  success: "border-ember-500/40 text-ember-200",
  error: "border-red-500/40 text-red-200",
  info: "border-cream/20 text-cream",
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback(
    (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++counter;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`glass pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-glow ${accents[t.type]}`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1 text-sm text-cream">{t.message}</span>
                <button
                  onClick={() => remove(t.id)}
                  className="text-cream/40 hover:text-cream"
                >
                  <FiX size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return ctx.toast;
}
