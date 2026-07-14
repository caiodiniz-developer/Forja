import type { IconType } from "react-icons";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiPrisma,
  SiDocker,
  SiGraphql,
  SiPython,
  SiFigma,
} from "react-icons/si";
import {
  FiCode,
  FiServer,
  FiSmartphone,
  FiCpu,
  FiLayers,
} from "react-icons/fi";

/** Technologies showcased in the "stack" band. */
export interface Tech {
  name: string;
  icon: IconType;
}

export const technologies: Tech[] = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Prisma", icon: SiPrisma },
  { name: "Docker", icon: SiDocker },
  { name: "GraphQL", icon: SiGraphql },
  { name: "Python", icon: SiPython },
  { name: "Figma", icon: SiFigma },
];

/** Specialization tracks — the signature "journey" of the platform. */
export interface Formation {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  courses: number;
  hours: number;
  levelRange: string;
  highlight?: boolean;
}

export const formations: Formation[] = [
  {
    id: "fullstack",
    title: "Full-stack",
    description:
      "Do primeiro componente ao deploy: front-end, APIs, banco e infraestrutura em um só caminho.",
    icon: FiLayers,
    courses: 42,
    hours: 320,
    levelRange: "Iniciante → Avançado",
    highlight: true,
  },
  {
    id: "frontend",
    title: "Front-end",
    description:
      "Interfaces performáticas e acessíveis com React, TypeScript e design systems reais.",
    icon: FiCode,
    courses: 28,
    hours: 180,
    levelRange: "Iniciante → Avançado",
  },
  {
    id: "backend",
    title: "Back-end Node",
    description:
      "APIs sólidas, filas, cache e banco sob pressão — a espinha dorsal de produtos em escala.",
    icon: FiServer,
    courses: 24,
    hours: 160,
    levelRange: "Intermediário → Avançado",
  },
  {
    id: "mobile",
    title: "Mobile",
    description:
      "Apps nativos com React Native, publicação nas lojas e integração com hardware.",
    icon: FiSmartphone,
    courses: 18,
    hours: 120,
    levelRange: "Intermediário",
  },
  {
    id: "ia",
    title: "IA para Devs",
    description:
      "LLMs, RAG e agentes aplicados a produtos reais — a habilidade mais quente do mercado.",
    icon: FiCpu,
    courses: 16,
    hours: 110,
    levelRange: "Avançado",
  },
];

/** Impact numbers band. */
export interface ImpactStat {
  value: string;
  label: string;
  sub: string;
}

export const impact: ImpactStat[] = [
  { value: "48k+", label: "devs forjados", sub: "em toda a América Latina" },
  { value: "92%", label: "concluem a trilha", sub: "acima da média do mercado" },
  { value: "37", label: "dias até a 1ª vaga", sub: "média de quem se dedica" },
  { value: "4.9", label: "nota média", sub: "de mais de 12 mil avaliações" },
];
