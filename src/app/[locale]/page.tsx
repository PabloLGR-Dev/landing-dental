'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image"; 
import { agendarCitaAction } from "../actions";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

// --- ICONOS MODERNOS ---
const ToothIcon = () => <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
const ShieldIcon = () => <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const ClockIcon = () => <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckIcon = () => <svg className="w-5 h-5 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const StarIcon = () => <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const LocationIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default function DentalLanding() {
  const t = useTranslations(); 
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");

  // Función para cambiar el idioma
  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (formData.get("servicio") === "otro") {
      const otroValor = formData.get("servicio_otro");
      formData.set("servicio", `Otro: ${otroValor}`);
    }

    const result = await agendarCitaAction(formData);

    if (result.error) {
      alert(result.error);
    } else if (result.success) {
      alert(t('Alerts.success'));
      (e.target as HTMLFormElement).reset(); 
      setServicioSeleccionado(""); 
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-900">
      
      {/* --- HEADER & LANGUAGE SWITCHER --- */}
      <header className="absolute top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          
          {/* Logo / Marca */}
          <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xl tracking-tight">
            <ToothIcon /> <span>{t('Header.brand')}</span>
          </div>

          {/* Botones de Idioma */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200/50">
            <button 
              onClick={() => switchLanguage('es')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all duration-200 ${
                currentLocale === 'es' 
                  ? 'bg-white shadow-sm text-blue-600 ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              ES
            </button>
            <button 
              onClick={() => switchLanguage('en')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all duration-200 ${
                currentLocale === 'en' 
                  ? 'bg-white shadow-sm text-blue-600 ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              EN
            </button>
          </div>
          
        </div>
      </header>

      {/* --- 1. HERO SECTION PREMIUM --- */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-16 px-6 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
             <Image src="/images/dentista.jpg" alt="Clínica Dental Moderna" fill className="opacity-40 object-cover object-top" priority />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          
          <div className="space-y-8 text-white">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 w-fit px-4 py-2 rounded-full">
              <div className="flex"><StarIcon/><StarIcon/><StarIcon/><StarIcon/><StarIcon/></div>
              <span className="text-sm font-medium text-slate-200">{t('Hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              {t('Hero.title1')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">{t('Hero.title2')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">
              {t('Hero.description')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3"><CheckIcon /> <span className="font-medium text-slate-200">{t('Hero.bullets.b1')}</span></div>
              <div className="flex items-center space-x-3"><CheckIcon /> <span className="font-medium text-slate-200">{t('Hero.bullets.b2')}</span></div>
              <div className="flex items-center space-x-3"><CheckIcon /> <span className="font-medium text-slate-200">{t('Hero.bullets.b3')}</span></div>
              <div className="flex items-center space-x-3"><CheckIcon /> <span className="font-medium text-slate-200">{t('Hero.bullets.b4')}</span></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-black/50 border border-white/20 w-full max-w-md mx-auto lg:ml-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-blue-600" />
            
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('Hero.form.title')}</h2>
              <p className="text-slate-500 mt-2">{t('Hero.form.subtitle')}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="direccion_postal" className="hidden" tabIndex={-1} autoComplete="off" />

              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">{t('Hero.form.name')}</label>
                <Input type="text" name="nombre" required disabled={loading} className="mt-1.5 h-14 bg-slate-50 border-slate-200 focus-visible:ring-sky-500 rounded-xl text-base" placeholder={t('Hero.form.name_ph')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">{t('Hero.form.phone')}</label>
                  <Input type="tel" name="telefono" required disabled={loading} className="mt-1.5 h-14 bg-slate-50 border-slate-200 focus-visible:ring-sky-500 rounded-xl text-base" placeholder={t('Hero.form.phone_ph')} />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">{t('Hero.form.email')}</label>
                  <Input type="email" name="email" required disabled={loading} className="mt-1.5 h-14 bg-slate-50 border-slate-200 focus-visible:ring-sky-500 rounded-xl text-base" placeholder={t('Hero.form.email_ph')} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">{t('Hero.form.service')}</label>
                <div className="relative mt-1.5">
                  <select 
                    name="servicio" 
                    required 
                    disabled={loading} 
                    defaultValue=""
                    onChange={(e) => setServicioSeleccionado(e.target.value)}
                    className="w-full h-14 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-base text-slate-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="" disabled>{t('Hero.form.service_ph')}</option>
                    {/* Los "value" se mantienen estandarizados para la base de datos */}
                    <option value="limpieza">{t('Hero.form.opt_cleaning')}</option>
                    <option value="implantes">{t('Hero.form.opt_implants')}</option>
                    <option value="ortodoncia">{t('Hero.form.opt_ortho')}</option>
                    <option value="sonrisa">{t('Hero.form.opt_smile')}</option>
                    <option value="blanqueamiento">{t('Hero.form.opt_whitening')}</option>
                    <option value="emergencia">{t('Hero.form.opt_emergency')}</option>
                    <option value="otro">{t('Hero.form.opt_other')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>

                {servicioSeleccionado === "otro" && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input 
                      type="text" 
                      name="servicio_otro" 
                      required 
                      disabled={loading} 
                      className="h-14 bg-sky-50 border-sky-200 focus-visible:ring-sky-500 rounded-xl text-base" 
                      placeholder={t('Hero.form.other_ph')} 
                    />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 mt-6 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
                {loading ? t('Hero.form.btn_loading') : t('Hero.form.btn_submit')}
              </Button>
              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <ShieldIcon /> {t('Hero.form.security')}
              </p>
            </form>
          </div>

        </div>
      </section>

      {/* --- 2. BARRA DE CONFIANZA --- */}
      <section className="bg-blue-950 py-10 relative z-20 -mt-6 border-y border-blue-900/50 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-800/50">
          <div>
            <p className="text-4xl font-extrabold text-white">{t('Trust.t1_val')}</p>
            <p className="text-blue-300 text-sm font-medium mt-2">{t('Trust.t1_lbl')}</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">{t('Trust.t2_val')}</p>
            <p className="text-blue-300 text-sm font-medium mt-2">{t('Trust.t2_lbl')}</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">{t('Trust.t3_val')}</p>
            <p className="text-blue-300 text-sm font-medium mt-2">{t('Trust.t3_lbl')}</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">{t('Trust.t4_val')}</p>
            <p className="text-blue-300 text-sm font-medium mt-2">{t('Trust.t4_lbl')}</p>
          </div>
        </div>
      </section>

      {/* --- 3. SERVICIOS PRINCIPALES --- */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">{t('Services.badge')}</h2>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t('Services.title')}</p>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('Services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[t('Services.s1_title'), t('Services.s2_title'), t('Services.s3_title'), t('Services.s4_title'), t('Services.s5_title'), t('Services.s6_title')].map((servicio, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group cursor-default">
                <div className="bg-slate-50 group-hover:bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6 transition-colors">
                  <ToothIcon />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{servicio}</h3>
                <p className="text-slate-600 leading-relaxed">{t('Services.desc')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. POR QUÉ ELEGIRNOS --- */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
            <Image src="/images/dentista.jpg" alt="Interior de la clínica" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-blue-900/10" />
          </div>
          
          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">{t('WhyUs.badge')}</h2>
              <p className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t('WhyUs.title')}</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 h-fit"><ShieldIcon /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('WhyUs.b1_title')}</h3>
                  <p className="text-slate-600">{t('WhyUs.b1_desc')}</p>
                </div>
              </div>
              
              <div className="flex gap-5">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 h-fit"><ClockIcon /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('WhyUs.b2_title')}</h3>
                  <p className="text-slate-600">{t('WhyUs.b2_desc')}</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 h-fit"><ToothIcon /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('WhyUs.b3_title')}</h3>
                  <p className="text-slate-600">{t('WhyUs.b3_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. TESTIMONIOS --- */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t('Testimonials.title')}</h2>
            <p className="text-lg text-slate-400 mt-4">{t('Testimonials.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { nombre: 'Laura M.', texto: t('Testimonials.r1_text'), imagen: '/images/paciente1.jpg' },
              { nombre: 'Carlos R.', texto: t('Testimonials.r2_text'), imagen: '/images/paciente02.jpg' },
              { nombre: 'Ana V.', texto: t('Testimonials.r3_text'), imagen: '/images/paciente3.jpg' }
            ].map((testimonio, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 flex flex-col">
                <div className="flex space-x-1 mb-6"><StarIcon/><StarIcon/><StarIcon/><StarIcon/><StarIcon/></div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8 flex-grow">{testimonio.texto}</p>
                <div className="flex items-center gap-4 mt-auto border-t border-slate-700 pt-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-700 shrink-0">
                    <Image src={testimonio.imagen} alt={`Paciente`} fill className="object-cover" />
                  </div>
                  <p className="font-bold text-lg">{testimonio.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. CTA FINAL --- */}
      <section className="py-24 px-6 bg-sky-50 overflow-hidden">
        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 text-center shadow-2xl border border-sky-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t('CTA.title')}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t('CTA.subtitle')}</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-slate-700 font-medium pb-8">
              <span className="flex items-center gap-2"><LocationIcon /> {t('CTA.location')}</span>
            </div>

            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="h-16 px-12 text-xl bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-blue-600/30">
              {t('CTA.btn')}
            </Button>
          </div>
        </div>
      </section>

      {/* --- 7. FOOTER --- */}
      <footer className="bg-slate-950 pt-16 pb-8 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <p className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
               <ToothIcon /> {t('Header.brand')}
            </p>
            <p className="text-slate-400 max-w-sm">{t('Footer.brand_desc')}</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{t('Footer.contact')}</h4>
            <ul className="space-y-2 text-slate-400">
              <li>+1 809-383-0621</li>
              <li>pablolgr.dev@gmail.com</li>
              <li>{t('Footer.location')}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{t('Footer.hours')}</h4>
            <ul className="space-y-2 text-slate-400">
              <li>{t('Footer.h_week')}</li>
              <li>{t('Footer.h_sat')}</li>
              <li>{t('Footer.h_urg')}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {t('Header.brand')}. {t('Footer.rights')}</p>
          <p>{t('Footer.dev')}</p>
        </div>
      </footer>
    </div>
  );
}