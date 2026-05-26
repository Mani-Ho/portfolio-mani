import { useState } from 'react';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import MetaStrip from './components/MetaStrip';
import Work from './components/Work';
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
      <Hero ready={loaderDone} />
      <MetaStrip />
      <Work />
      <Philosophy />
      <Process />
      <Contact />
      <Footer />
    </>
  );
}
