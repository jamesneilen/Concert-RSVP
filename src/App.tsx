import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RepertoireSection } from './components/RepertoireSection';
import { RsvpBragPassSection } from './components/RsvpBragPassSection';
import { LogisticsAndVenue } from './components/LogisticsAndVenue';
import { Footer } from './components/Footer';

export default function App() {
  return <>
    <a className="skip" href="#main">Skip to concert</a>
    <Header />
    <main id="main">
      <Hero />
      <RsvpBragPassSection />
      <RepertoireSection />
      <LogisticsAndVenue />
    </main>
    <Footer />
  </>;
}
