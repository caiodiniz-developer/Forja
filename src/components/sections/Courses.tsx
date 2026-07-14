import { useMemo, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CourseCard } from "@/components/ui/CourseCard";
import { Carousel } from "@/components/ui/Carousel";
import { Button } from "@/components/ui/Button";
import { courses } from "@/data/content";

const tracks = ["Todos", "Front-end", "Back-end", "Design", "Inteligência Artificial"];

export function Courses() {
  const [active, setActive] = useState("Todos");

  const filtered = useMemo(
    () =>
      active === "Todos"
        ? courses
        : courses.filter((c) => c.track === active),
    [active],
  );

  return (
    <section id="cursos" className="relative py-28 md:py-36">
      <div className="container-forge">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Catálogo"
            title="Trilhas para forjar cada habilidade"
            highlight="forjar"
          />
          <Button variant="outline" size="md" className="self-start md:self-auto">
            Ver catálogo completo
            <FiArrowUpRight />
          </Button>
        </div>

        {/* filter tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`relative rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                active === t
                  ? "text-iron-950"
                  : "text-cream/55 hover:text-cream"
              }`}
            >
              {active === t && (
                <motion.span
                  layoutId="track-pill"
                  className="absolute inset-0 rounded-full bg-molten"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>

        <div className="mt-10">
          {/* key resets the carousel position when the filter changes */}
          <Carousel
            key={active}
            slideClassName="basis-full sm:basis-1/2 lg:basis-1/3"
            ariaLabel="Cursos"
            autoPlay={false}
          >
            {filtered.map((c) => (
              <div key={c.id} className="h-full">
                <CourseCard course={c} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
