import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiCheck } from "react-icons/fi";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginForm } from "@/lib/validators/auth";
import { ApiError } from "@/lib/api";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const state = location.state as { from?: string; registered?: boolean } | null;
  const from = state?.from;
  const justRegistered = state?.registered;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const [remember, setRemember] = useState(true);

  const onSubmit = async (data: LoginForm) => {
    setFormError(null);
    try {
      const user = await login(data.email, data.password);
      if (remember) localStorage.setItem("forja_remember", "1");
      else localStorage.removeItem("forja_remember");
      const home = user.role === "ADMIN" ? "/admin" : "/painel";
      navigate(from ?? home, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) setFormError(err.message);
      else setFormError("Não foi possível entrar. Verifique sua conexão.");
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para continuar de onde parou."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/register" className="font-semibold text-ember-400 hover:underline">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {justRegistered && !formError && (
          <div className="flex items-center gap-2 rounded-xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 text-sm text-ember-200">
            <FiCheckCircle className="shrink-0" />
            Conta criada! Faça login para começar a forjar.
          </div>
        )}
        {formError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <FiAlertCircle className="shrink-0" />
            {formError}
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          icon={<FiMail size={18} />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          icon={<FiLock size={18} />}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRemember((v) => !v)}
            className="flex items-center gap-2 text-sm text-cream/70 hover:text-cream"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                remember
                  ? "border-ember-500 bg-molten text-iron-950"
                  : "border-cream/25"
              }`}
            >
              {remember && <FiCheck size={13} strokeWidth={3} />}
            </span>
            Lembrar de mim
          </button>
          <Link
            to="/recuperar-senha"
            className="text-sm text-cream/50 transition-colors hover:text-cream"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
