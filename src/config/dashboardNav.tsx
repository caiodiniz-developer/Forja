import {
  FiGrid,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiHeart,
  FiBell,
  FiUser,
  FiUsers,
  FiVideo,
  FiCheckSquare,
  FiBarChart2,
  FiSettings,
  FiLayers,
  FiSend,
} from "react-icons/fi";
import type { NavGroup } from "@/components/dashboard/Sidebar";

export const studentNav: NavGroup[] = [
  {
    items: [
      { label: "Início", to: "/painel", icon: FiGrid, end: true },
      { label: "Meus cursos", to: "/painel/cursos", icon: FiBookOpen },
      { label: "Certificados", to: "/painel/certificados", icon: FiAward },
    ],
  },
  {
    label: "Explorar",
    items: [
      { label: "Tarefas", to: "/painel/tarefas", icon: FiCheckSquare },
      { label: "Eventos", to: "/painel/eventos", icon: FiCalendar },
      { label: "Favoritos", to: "/painel/favoritos", icon: FiHeart },
      { label: "Notificações", to: "/painel/notificacoes", icon: FiBell, badge: 2 },
    ],
  },
  {
    label: "Conta",
    items: [{ label: "Perfil", to: "/painel/perfil", icon: FiUser }],
  },
];

export const adminNav: NavGroup[] = [
  {
    items: [
      { label: "Visão geral", to: "/admin", icon: FiGrid, end: true },
      { label: "Analytics", to: "/admin/analytics", icon: FiBarChart2 },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { label: "Cursos", to: "/admin/cursos", icon: FiLayers },
      { label: "Professores", to: "/admin/professores", icon: FiVideo },
      { label: "Eventos", to: "/admin/eventos", icon: FiCalendar },
    ],
  },
  {
    label: "Operação",
    items: [
      { label: "Usuários", to: "/admin/usuarios", icon: FiUsers },
      { label: "Notificações", to: "/admin/notificacoes", icon: FiSend },
      { label: "Tarefas", to: "/admin/tasks", icon: FiCheckSquare },
      { label: "Configurações", to: "/admin/config", icon: FiSettings },
    ],
  },
  {
    label: "Conta",
    items: [{ label: "Minha conta", to: "/admin/conta", icon: FiUser }],
  },
];
