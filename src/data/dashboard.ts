import type { IconType } from "react-icons";
import {
  FiAward,
  FiBookOpen,
  FiClock,
  FiZap,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiPlayCircle,
} from "react-icons/fi";

/* ------------------------------------------------------------------ student */

export interface CourseProgress {
  id: string;
  title: string;
  track: string;
  progress: number; // 0-100
  nextLesson: string;
  remaining: string;
  accent: string; // tailwind gradient-from hint
}

export const inProgress: CourseProgress[] = [
  {
    id: "react",
    title: "React do Fundamento à Forja",
    track: "Front-end",
    progress: 67,
    nextLesson: "Escalando APIs com filas",
    remaining: "4h 20min",
    accent: "from-ember-700 to-ember-500",
  },
  {
    id: "node",
    title: "Node.js em Escala",
    track: "Back-end",
    progress: 34,
    nextLesson: "Cache distribuído com Redis",
    remaining: "9h 05min",
    accent: "from-ember-800 to-ember-600",
  },
  {
    id: "design",
    title: "Design Systems na Prática",
    track: "Design",
    progress: 88,
    nextLesson: "Tokens semânticos",
    remaining: "1h 40min",
    accent: "from-ember-500 to-ember-300",
  },
];

export interface MiniStat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: IconType;
  trend?: string;
}

export const studentStats: MiniStat[] = [
  { label: "Sequência de estudos", value: 12, suffix: " dias", icon: FiZap, trend: "+3 esta semana" },
  { label: "Horas estudadas", value: 148, suffix: "h", icon: FiClock, trend: "+6h esta semana" },
  { label: "Cursos concluídos", value: 7, icon: FiBookOpen, trend: "+1 este mês" },
  { label: "Certificados", value: 5, icon: FiAward, trend: "verificados" },
];

// weekly study minutes (Mon..Sun) — magnitude over time, single series
export const weeklyStudy = [
  { day: "Seg", value: 65 },
  { day: "Ter", value: 90 },
  { day: "Qua", value: 40 },
  { day: "Qui", value: 120 },
  { day: "Sex", value: 80 },
  { day: "Sáb", value: 150 },
  { day: "Dom", value: 55 },
];

export const weeklyGoal = { current: 600, target: 720 }; // minutes

export interface AchievementItem {
  title: string;
  desc: string;
  icon: IconType;
  unlocked: boolean;
}

export const achievements: AchievementItem[] = [
  { title: "Primeira brasa", desc: "Concluiu a 1ª aula", icon: FiZap, unlocked: true },
  { title: "Maratonista", desc: "7 dias seguidos", icon: FiTrendingUp, unlocked: true },
  { title: "Forjador", desc: "Concluiu um curso", icon: FiAward, unlocked: true },
  { title: "Mestre-ferreiro", desc: "5 cursos concluídos", icon: FiBookOpen, unlocked: false },
];

export interface RankItem {
  pos: number;
  name: string;
  initials: string;
  xp: number;
  me?: boolean;
}

export const ranking: RankItem[] = [
  { pos: 1, name: "Marina A.", initials: "MA", xp: 9820 },
  { pos: 2, name: "Diego F.", initials: "DF", xp: 8710 },
  { pos: 3, name: "Você", initials: "CR", xp: 8140, me: true },
  { pos: 4, name: "Ana B.", initials: "AB", xp: 7990 },
  { pos: 5, name: "Lucas P.", initials: "LP", xp: 7420 },
];

export interface EventItem {
  title: string;
  kind: "Live" | "Workshop" | "Mentoria";
  date: string;
  time: string;
}

export const upcomingEvents: EventItem[] = [
  { title: "Live: Arquitetura em escala", kind: "Live", date: "12 JUL", time: "19:00" },
  { title: "Workshop de Design Systems", kind: "Workshop", date: "15 JUL", time: "20:00" },
  { title: "Mentoria em grupo", kind: "Mentoria", date: "18 JUL", time: "18:30" },
];

/* -------------------------------------------------------------------- admin */

export const adminKpis: MiniStat[] = [
  { label: "Receita no mês", value: 284900, prefix: "R$ ", icon: FiDollarSign, trend: "+18,2%" },
  { label: "Alunos ativos", value: 48320, icon: FiUsers, trend: "+1.240" },
  { label: "Cursos publicados", value: 214, icon: FiBookOpen, trend: "+6" },
  { label: "Aulas assistidas", value: 92600, icon: FiPlayCircle, trend: "+8,4%" },
];

// monthly revenue (in thousands of R$) — magnitude over time, single series
export const revenueSeries = [
  { m: "Jan", value: 182 },
  { m: "Fev", value: 205 },
  { m: "Mar", value: 198 },
  { m: "Abr", value: 240 },
  { m: "Mai", value: 232 },
  { m: "Jun", value: 268 },
  { m: "Jul", value: 285 },
];

// new sign-ups per weekday — magnitude, single series
export const signupsSeries = [
  { d: "Seg", value: 320 },
  { d: "Ter", value: 410 },
  { d: "Qua", value: 380 },
  { d: "Qui", value: 520 },
  { d: "Sex", value: 470 },
  { d: "Sáb", value: 240 },
  { d: "Dom", value: 190 },
];

export interface ActivityItem {
  who: string;
  initials: string;
  action: string;
  target: string;
  when: string;
}

export const recentActivity: ActivityItem[] = [
  { who: "Marina Alvez", initials: "MA", action: "publicou", target: "React Avançado", when: "há 5 min" },
  { who: "Rafael Diniz", initials: "RD", action: "concluiu", target: "Design Systems", when: "há 22 min" },
  { who: "Ana Beatriz", initials: "AB", action: "comprou", target: "Plano Fornalha", when: "há 1 h" },
  { who: "Bruno Sato", initials: "BS", action: "avaliou", target: "Node em Escala", when: "há 2 h" },
  { who: "Lucas Prado", initials: "LP", action: "cadastrou-se", target: "conta gratuita", when: "há 3 h" },
];

export interface TopCourse {
  title: string;
  sales: number;
  revenue: string;
  rating: number;
}

export const topCourses: TopCourse[] = [
  { title: "React do Fundamento à Forja", sales: 1284, revenue: "R$ 381k", rating: 4.9 },
  { title: "IA Aplicada a Produtos", sales: 986, revenue: "R$ 490k", rating: 5.0 },
  { title: "Node.js em Escala", sales: 842, revenue: "R$ 292k", rating: 4.9 },
  { title: "Arquitetura de Software", sales: 731, revenue: "R$ 400k", rating: 4.8 },
];
