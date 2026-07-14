import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterForm } from "@/lib/validators/auth";
import { ApiError } from "@/lib/api";

export function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setFormError(null);
    try {
      await registerUser(data.name, data.email, data.password);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      if (err instanceof ApiError) setFormError(err.message);
      else setFormError("Não foi possível criar a conta. Tente novamente.");
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a forjar sua carreira hoje — sem cartão."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-ember-400 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {formError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <FiAlertCircle className="shrink-0" />
            {formError}
          </div>
        )}

        <Input
          label="Nome completo"
          autoComplete="name"
          placeholder="Seu nome"
          icon={<FiUser size={18} />}
          error={errors.name?.message}
          {...register("name")}
        />
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
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          icon={<FiLock size={18} />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta…" : "Criar conta grátis"}
        </Button>

        <p className="text-center text-xs text-cream/40">
          Ao criar a conta, você concorda com os Termos e a Política de
          Privacidade.
        </p>
      </form>
    </AuthLayout>
  );
}
