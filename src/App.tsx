import { useState } from 'react';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import HeroReveal from './components/HeroReveal';
import MetaStrip from './components/MetaStrip';
import Philosophy from './components/Philosophy';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useReveal } from './hooks/useReveal';
import { useScrollNav } from './hooks/useScrollNav';
import { useLenis } from './hooks/useLenis';

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);

  useReveal();
  useScrollNav();
  useLenis(); // smooth scroll GPU + anchor links

  return (
    <>
      <Cursor />
      {!loaderDone && <Loader onFinish={() => setLoaderDone(true)} />}
      <Nav />
      <HeroReveal ready={loaderDone} />
      <MetaStrip />
      <Philosophy />
      <Process />
      <Contact />
      <Footer />
    </>
  );
}
