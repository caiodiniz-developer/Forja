import { FiGithub, FiInstagram, FiYoutube, FiLinkedin } from "react-icons/fi";

const columns = [
  {
    title: "Plataforma",
    links: ["Catálogo", "Trilhas", "Para empresas", "Certificados", "Preços"],
  },
  {
    title: "Recursos",
    links: ["Blog", "Comunidade", "Eventos ao vivo", "Central de ajuda", "Status"],
  },
  {
    title: "Empresa",
    links: ["Sobre", "Carreiras", "Contato", "Imprensa", "Parcerias"],
  },
];

const socials = [FiGithub, FiInstagram, FiYoutube, FiLinkedin];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/10 pt-20">
      {/* giant ambient wordmark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <span className="translate-y-1/3 select-none font-display text-[22vw] font-bold leading-none text-cream/[0.03]">
          FORJA
        </span>
      </div>

      <div className="container-forge relative">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#topo" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-molten font-display text-lg font-bold text-iron-950">
                F
              </span>
              <span className="font-display text-xl font-semibold text-cream">
                Forja
              </span>
            </a>
            <p className="mt-5 max-w-xs text-cream/50 leading-relaxed">
              A plataforma onde o conhecimento em tecnologia é forjado sob alta
              temperatura — prática, mentoria e projetos reais.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="rede social"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors hover:border-ember-500/50 hover:bg-ember-500/10 hover:text-ember-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-ember-400">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-cream/55 transition-colors hover:text-cream"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-8 text-sm text-cream/40 md:flex-row">
          <span className="font-mono text-xs">
            © {new Date().getFullYear()} Forja Educação. Feito no calor do Brasil.
          </span>
          <div className="flex gap-6 font-mono text-xs">
            <a href="#" className="hover:text-cream/70">
              Privacidade
            </a>
            <a href="#" className="hover:text-cream/70">
              Termos
            </a>
            <a href="#" className="hover:text-cream/70">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
