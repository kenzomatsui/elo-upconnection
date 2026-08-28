import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { Ranking } from '@/components/sections/Ranking';
import { Problema } from '@/components/sections/Problema';
import { Timeline } from '@/components/sections/Timeline';
import { ComoFunciona } from '@/components/sections/ComoFunciona';
import { Hierarquia } from '@/components/sections/Hierarquia';
import { Indicadores } from '@/components/sections/Indicadores';
import { Faq } from '@/components/sections/Faq';
import { Acesso } from '@/components/sections/Acesso';
import { Footer } from '@/components/sections/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ranking />
        <Problema />
        <Timeline />
        <ComoFunciona />
        <Hierarquia />
        <Indicadores />
        <Faq />
        <Acesso />
      </main>
      <Footer />
    </>
  );
}
