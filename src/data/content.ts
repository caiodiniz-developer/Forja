import type { IconType } from "react-icons";
import {
  FiCode,
  FiPenTool,
  FiCpu,
  FiTrendingUp,
  FiLayers,
  FiDatabase,
} from "react-icons/fi";

export interface Course {
  id: string;
  title: string;
  track: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  hours: number;
  lessons: number;
  rating: number;
  icon: IconType;
  price: number | null; // null = free
  temperature: string; // signature: "heat" of the course
}

export const courses: Course[] = [
  {
    id: "react-forge",
    title: "React do Fundamento à Forja",
    track: "Front-end",
    level: "Intermediário",
    hours: 42,
    lessons: 128,
    rating: 4.9,
    icon: FiCode,
    price: 297,
    temperature: "1200°C",
  },
  {
    id: "design-systems",
    title: "Design Systems na Prática",
    track: "Design",
    level: "Avançado",
    hours: 28,
    lessons: 86,
    rating: 4.8,
    icon: FiPenTool,
    price: 347,
    temperature: "980°C",
  },
  {
    id: "ia-aplicada",
    title: "IA Aplicada a Produtos",
    track: "Inteligência Artificial",
    level: "Avançado",
    hours: 36,
    lessons: 104,
    rating: 5.0,
    icon: FiCpu,
    price: 497,
    temperature: "1500°C",
  },
  {
    id: "node-escala",
    title: "Node.js em Escala",
    track: "Back-end",
    level: "Intermediário",
    hours: 38,
    lessons: 112,
    rating: 4.9,
    icon: FiDatabase,
    price: 347,
    temperature: "1100°C",
  },
  {
    id: "produto-growth",
    title: "Produto & Growth",
    track: "Produto",
    level: "Iniciante",
    hours: 18,
    lessons: 54,
    rating: 4.7,
    icon: FiTrendingUp,
    price: null,
    temperature: "760°C",
  },
  {
    id: "arquitetura",
    title: "Arquitetura de Software",
    track: "Engenharia",
    level: "Avançado",
    hours: 46,
    lessons: 140,
    rating: 4.9,
    icon: FiLayers,
    price: 547,
    temperature: "1350°C",
  },
];

export interface Instructor {
  name: string;
  role: string;
  initials: string;
  focus: string;
  bio: string;
  students: string;
  courses: number;
}

export const instructors: Instructor[] = [
  {
    name: "Marina Alvez",
    role: "Staff Engineer · ex-Nubank",
    initials: "MA",
    focus: "Front-end & Performance",
    bio: "Construiu interfaces usadas por dezenas de milhões no Nubank. Ensina React de verdade — do render ao Core Web Vitals no verde.",
    students: "18.4k",
    courses: 6,
  },
  {
    name: "Rafael Diniz",
    role: "Design Lead · ex-iFood",
    initials: "RD",
    focus: "Design Systems",
    bio: "Liderou o design system do iFood. Mostra como criar tokens, componentes e handoff que escalam entre times de produto.",
    students: "11.2k",
    courses: 4,
  },
  {
    name: "Camila Torres",
    role: "ML Engineer · ex-Meta",
    initials: "CT",
    focus: "IA Aplicada",
    bio: "Colocou modelos em produção na Meta. Traduz LLMs, RAG e agentes em features reais que rodam em escala e sem susto.",
    students: "9.8k",
    courses: 5,
  },
  {
    name: "Bruno Sato",
    role: "Principal Eng · ex-Stripe",
    initials: "BS",
    focus: "Arquitetura & Escala",
    bio: "Desenhou sistemas de pagamento na Stripe. Ensina arquitetura, filas, cache e as decisões que seguram produtos sob pressão.",
    students: "14.1k",
    courses: 7,
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Saí de um bootcamp genérico direto para a Forja. Em 4 meses troquei de emprego e dobrei meu salário. A trilha de arquitetura foi decisiva.",
    name: "Lucas Prado",
    role: "Software Engineer · Mercado Livre",
    initials: "LP",
  },
  {
    quote:
      "A qualidade de produção das aulas é absurda. Parece série de streaming, mas com projetos reais e revisão de código de gente sênior.",
    name: "Ana Beatriz",
    role: "Product Designer · Gympass",
    initials: "AB",
  },
  {
    quote:
      "O player, as anotações e o assistente de IA mudaram como eu estudo. Consigo revisar um módulo inteiro em 15 minutos antes de uma sprint.",
    name: "Diego Fonseca",
    role: "Tech Lead · Loft",
    initials: "DF",
  },
  {
    quote:
      "Migrei de suporte para dev backend. A trilha de Node em escala tinha exatamente os problemas que eu enfrentaria no primeiro mês de trabalho.",
    name: "Priscila Nunes",
    role: "Backend Developer · Nubank",
    initials: "PN",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "Preciso de experiência prévia para começar?",
    a: "Não. Cada trilha tem um ponto de entrada claro — de iniciante a avançado. O diagnóstico inicial recomenda por onde forjar seu caminho.",
  },
  {
    q: "Os certificados têm validade real?",
    a: "Sim. Cada certificado tem código único, QR Code e página pública de validação. Empresas parceiras reconhecem as trilhas concluídas.",
  },
  {
    q: "Como funciona o acesso aos cursos?",
    a: "No plano anual e vitalício você acessa todo o catálogo. No gratuito, um conjunto de cursos selecionados fica liberado para sempre.",
  },
  {
    q: "Posso baixar as aulas e materiais?",
    a: "Materiais, PDFs e código-fonte ficam disponíveis para download. O player também suporta modo offline em dispositivos móveis.",
  },
  {
    q: "Existe suporte quando eu travo num projeto?",
    a: "Sim. Você tem fóruns por aula, chat da turma e um assistente de IA treinado no conteúdo para tirar dúvidas em segundos.",
  },
  {
    q: "Consigo reembolso se não gostar?",
    a: "Garantia incondicional de 15 dias. Se a Forja não for para você, devolvemos 100% sem perguntas.",
  },
];

export interface Plan {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    name: "Brasa",
    price: "R$ 0",
    period: "para sempre",
    tagline: "Comece a forjar sem cartão.",
    features: [
      "12 cursos selecionados",
      "Certificado de conclusão",
      "Comunidade e fóruns",
      "Projetos guiados",
    ],
  },
  {
    name: "Fornalha",
    price: "R$ 89",
    period: "/mês, no anual",
    tagline: "O catálogo completo, sempre quente.",
    features: [
      "Catálogo completo (200+ cursos)",
      "Assistente de IA nas aulas",
      "Trilhas de carreira guiadas",
      "Certificados verificáveis",
      "Eventos e lives ao vivo",
      "Download de materiais",
    ],
    featured: true,
  },
  {
    name: "Aço Puro",
    price: "R$ 2.970",
    period: "vitalício",
    tagline: "Pague uma vez, forje para sempre.",
    features: [
      "Tudo do plano Fornalha",
      "Acesso vitalício e futuros cursos",
      "Mentorias em grupo mensais",
      "Selo de fundador no perfil",
    ],
  },
];

export const companies = [
  "Nubank",
  "iFood",
  "Mercado Livre",
  "Stripe",
  "Loft",
  "Gympass",
  "Meta",
  "Rappi",
];

export interface Step {
  n: string;
  title: string;
  body: string;
}

export const steps: Step[] = [
  {
    n: "01",
    title: "Diagnóstico",
    body: "Um mapa inicial mede onde você está e desenha a trilha mais curta até o seu objetivo.",
  },
  {
    n: "02",
    title: "Forja diária",
    body: "Aulas curtas, projetos reais e desafios que endurecem o conhecimento com a prática.",
  },
  {
    n: "03",
    title: "Prova de fogo",
    body: "Projetos avaliados, quizzes e revisão de código por engenheiros sênior a cada módulo.",
  },
  {
    n: "04",
    title: "Têmpera",
    body: "Certificado verificável, portfólio pronto e conexão com empresas parceiras contratando.",
  },
];
