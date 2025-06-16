"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  ArrowRightIcon,
  UsersIcon,
  StarIcon,
  TrendingUpIcon,
  HeartIcon,
} from "lucide-react";
import { ReactNode, useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { animate } from "animejs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SearchBar } from "../features/layout/components/SearchBar";

export default function LandingPage() {
  // Para animaciones y aparición progresiva
  const [mounted, setMounted] = useState(false);

  // Referencias para animaciones
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Para el cambio de tema
  const { theme } = useTheme();

  // Para animaciones al cargar
  useEffect(() => {
    setMounted(true);

    // Solo ejecutar animaciones en el cliente
    if (typeof window === "undefined") return;

    // Animación del título principal
    if (heroRef.current) {
      animate(heroRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1200,
        easing: "easeOutQuad",
        delay: 300,
      });
    }

    // Configurar observadores para las secciones - con umbral más alto para mejor control
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animación de las tarjetas de features
            if (entry.target === featuresRef.current) {
              const featureCards = document.querySelectorAll(".feature-card");
              animate(featureCards, {
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 800,
                delay: (_, i) => i * 300, // Retraso significativo entre cada tarjeta
                easing: "easeOutQuad",
              });
            }

            // Animación de estadísticas
            if (entry.target === statsRef.current) {
              // Animar estadísticas cuando sean visibles - con mayor retardo inicial
              setTimeout(() => {
                const statElements = document.querySelectorAll(".stat-number");
                statElements.forEach((el, i) => {
                  if (el instanceof HTMLElement) {
                    const target = Number(el.getAttribute("data-target") || 0);
                    let current = 0;
                    const duration = 2000; // 2 segundos para la animación
                    const frameRate = 60; // 60fps
                    const increment = target / ((duration * frameRate) / 1000);
                    const updateCount = () => {
                      current += increment;
                      if (current < target) {
                        el.textContent = Math.round(current).toString();
                        requestAnimationFrame(updateCount);
                      } else {
                        el.textContent = target.toString();
                      }
                    };
                    setTimeout(() => {
                      requestAnimationFrame(updateCount);
                    }, i * 200);
                  }
                });
              }, 500); // Esperar medio segundo antes de iniciar las animaciones
            }

            // Animación de CTA
            if (entry.target === ctaRef.current) {
              const ctaContent = ctaRef.current.querySelector(".cta-content");
              if (ctaContent) {
                animate(ctaContent, {
                  opacity: [0, 1],
                  translateX: [-20, 0],
                  duration: 800,
                  easing: "easeOutQuad",
                });
              }

              const eventsPreview = ctaRef.current.querySelector(".events-preview");
              if (eventsPreview) {
                animate(eventsPreview, {
                  opacity: [0, 1],
                  translateX: [20, 0],
                  duration: 800,
                  delay: 200,
                  easing: "easeOutQuad",
                });
              }
            }

            // Animación de testimonios - con retardo para evitar colisión con stats
            if (entry.target === testimonialsRef.current) {
              // Retardo significativo para evitar conflicto con la animación de las estadísticas
              setTimeout(() => {
                animate(".testimonial-card", {
                  opacity: [0, 1],
                  translateY: [20, 0],
                  duration: 800,
                  delay: (_, i) => i * 200,
                  easing: "easeOutQuad",
                });
              }, 800);
            }

            // Animación del FAQ
            if (entry.target === faqRef.current) {
              animate(".faq-item", {
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: 600,
                delay: (_, i) => i * 120,
                easing: "easeOutSine",
              });
            }

            // Desconectar observador una vez activado
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    ); // Aumentar el umbral para mejor control

    // Observar elementos
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (faqRef.current) observer.observe(faqRef.current);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section con degradado moderno */}
      <section className="bg-gradient-to-br from-background via-primary/5 to-background pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        {/* Formas decorativas animadas */}
        <div
          className={`absolute -right-20 top-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl transition-all duration-1000 ${
            mounted ? "opacity-80" : "opacity-0"
          }`}></div>
        <div
          className={`absolute -left-20 bottom-20 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl transition-all duration-1000 delay-300 ${
            mounted ? "opacity-80" : "opacity-0"
          }`}></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div ref={heroRef} className="text-center mb-12 opacity-0">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Descubre y vive eventos increíbles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Tu plataforma para encontrar los mejores eventos y experiencias en tu
              ciudad
            </p>

            {/* Barra de búsqueda moderna reutilizada */}
            <SearchBar />
          </div>

          {/* Tarjetas de ventajas con animación */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="feature-card opacity-0">
              <FeatureCard
                icon={<CalendarIcon className="h-12 w-12 text-primary" />}
                title="Encuentra eventos"
                description="Descubre los mejores eventos de tu ciudad filtrados por tus preferencias."
              />
            </div>
            <div className="feature-card opacity-0">
              <FeatureCard
                icon={<UserIcon className="h-12 w-12 text-primary" />}
                title="Conecta con organizadores"
                description="Interactúa directamente con los organizadores de tus eventos favoritos."
              />
            </div>
            <div className="feature-card opacity-0">
              <FeatureCard
                icon={<MapPinIcon className="h-12 w-12 text-primary" />}
                title="Eventos cerca de ti"
                description="Localiza eventos cercanos a tu ubicación con facilidad."
              />
            </div>
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: Estadísticas */}
      <section ref={statsRef} className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
            La plataforma líder en eventos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              icon={<UsersIcon className="h-10 w-10 text-primary" />}
              value="10000"
              label="Usuarios activos"
            />
            <StatCard
              icon={<CalendarIcon className="h-10 w-10 text-primary" />}
              value="5000"
              label="Eventos creados"
            />
            <StatCard
              icon={<StarIcon className="h-10 w-10 text-primary" />}
              value="4.8"
              label="Valoración media"
            />
            <StatCard
              icon={<TrendingUpIcon className="h-10 w-10 text-primary" />}
              value="150"
              label="Crecimiento anual"
            />
          </div>

          <div className="mt-12 p-6 bg-card rounded-xl shadow-sm border flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-xl font-semibold mb-2">¿Organizas eventos?</h3>
              <p className="text-muted-foreground">
                Regístrate como organizador y comienza a crear eventos con nuestra
                plataforma.
              </p>
            </div>
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/register/organizer">Registrarse como organizador</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de CTA */}
      <section ref={ctaRef} className="py-20 bg-card">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:max-w-lg cta-content">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                ¿Listo para descubrir eventos emocionantes?
              </h2>
              <p className="text-muted-foreground mb-6">
                Accede a nuestra plataforma y comienza a descubrir eventos que
                transformarán tu experiencia.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link href="/eventos">Explorar eventos</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-medium">
                  <Link href="/app">Acceder al dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="bg-primary/10 rounded-xl p-6 md:p-8 max-w-md events-preview">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Próximos eventos destacados
              </h3>
              <div className="space-y-4">
                <EventPreview
                  title="Festival de Música"
                  location="Auditorio Principal"
                  date="25 de julio"
                />
                <EventPreview
                  title="Exposición de Arte Contemporáneo"
                  location="Galería Central"
                  date="3 de agosto"
                />
                <EventPreview
                  title="Conferencia de Tecnología"
                  location="Centro de Convenciones"
                  date="15 de agosto"
                />
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                <Link href="/eventos" className="flex items-center justify-center">
                  Ver todos los eventos
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: Testimonios */}
      <section ref={testimonialsRef} className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Las experiencias de quienes ya han usado nuestra plataforma
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card opacity-0">
              <TestimonialCard
                name="María García"
                role="Asistente habitual"
                content="Increíble plataforma para encontrar eventos. He descubierto actividades que nunca habría conocido de otra manera."
              />
            </div>
            <div className="testimonial-card opacity-0">
              <TestimonialCard
                name="Carlos Rodríguez"
                role="Organizador de eventos"
                content="Como organizador, la plataforma me ha permitido llegar a un público mucho más amplio. Las herramientas de gestión son excepcionales."
              />
            </div>
            <div className="testimonial-card opacity-0">
              <TestimonialCard
                name="Laura Martínez"
                role="Empresaria local"
                content="Hemos aumentado la asistencia a nuestros eventos en un 70% desde que empezamos a utilizarla. Totalmente recomendable."
              />
            </div>
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: Preguntas frecuentes */}
      <section ref={faqRef} className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
            Preguntas frecuentes
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Respuestas a las dudas más comunes sobre nuestra plataforma
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="faq-item opacity-0">
              <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                ¿Cómo puedo registrarme como organizador de eventos?
              </AccordionTrigger>
              <AccordionContent className="text-base">
                Para registrarte como organizador, simplemente haz clic en
                &ldquo;Registrarse como organizador&rdquo; en nuestra página
                principal. Completa el formulario con la información de tu
                organización y, una vez verificada tu cuenta, podrás comenzar a crear
                y gestionar eventos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="faq-item opacity-0">
              <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                ¿Cómo puedo comprar entradas para un evento?
              </AccordionTrigger>
              <AccordionContent className="text-base">
                Navega por los eventos disponibles y selecciona el que te interese.
                En la página del evento, encontrarás un botón &ldquo;Comprar
                entradas&rdquo;. Selecciona la cantidad de entradas que deseas y
                procede al pago seguro. Recibirás las entradas en tu correo
                electrónico.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="faq-item opacity-0">
              <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                ¿Puedo obtener un reembolso si no puedo asistir a un evento?
              </AccordionTrigger>
              <AccordionContent className="text-base">
                Las políticas de reembolso dependen de cada organizador. En la página
                de cada evento, encontrarás información específica sobre su política
                de cancelaciones y reembolsos. Generalmente, se permiten reembolsos
                hasta 48 horas antes del evento.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="faq-item opacity-0">
              <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                ¿Qué comisión cobra la plataforma por venta de entradas?
              </AccordionTrigger>
              <AccordionContent className="text-base">
                Nuestra comisión estándar es del 5% del valor de cada entrada
                vendida, más una tarifa fija de 0,30€ por transacción. Para
                organizadores con grandes volúmenes de ventas ofrecemos tarifas
                personalizadas más competitivas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="faq-item opacity-0">
              <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                ¿Cómo puedo promocionar mi evento en la plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-base">
                Todos los eventos aparecen en nuestro explorador, pero ofrecemos
                opciones de promoción destacada. Desde tu dashboard de organizador,
                puedes contratar paquetes de promoción para dar mayor visibilidad a
                tus eventos, incluyendo posicionamiento destacado y promoción en
                nuestras redes sociales.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}

// Interfaces para los props de los componentes
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface EventPreviewProps {
  title: string;
  location: string;
  date: string;
}

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
}

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
}

// Componente para las tarjetas de características
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

// Componente para la previsualización de eventos
function EventPreview({ title, location, date }: EventPreviewProps) {
  return (
    <div className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
      <h4 className="font-medium text-sm line-clamp-1">{title}</h4>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span className="flex items-center">
          <MapPinIcon className="h-3 w-3 mr-1" />
          {location}
        </span>
        <span className="flex items-center">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {date}
        </span>
      </div>
    </div>
  );
}

// Componente para las estadísticas
function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="text-center p-6 rounded-xl bg-card border transition-all duration-300 hover:shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-3xl font-bold mb-2 stat-number" data-target={value}>
        0
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// Componente para los testimonios
function TestimonialCard({ name, role, content }: TestimonialCardProps) {
  // Obtener iniciales para el avatar fallback
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-primary/10 flex items-center justify-center">
          {/* Usar iniciales en lugar de imágenes que no existen */}
          <span className="font-semibold text-lg">{initials}</span>
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-muted-foreground italic">{content}</p>
      <div className="mt-4 flex">
        <HeartIcon className="h-4 w-4 text-primary mr-1" />
      </div>
    </div>
  );
}
