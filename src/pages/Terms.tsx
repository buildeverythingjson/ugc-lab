import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Brukervilkår</h1>
        <p className="text-muted-foreground text-sm mb-10">Sist oppdatert: 19. mars 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="font-display text-xl font-semibold mb-3">1. Aksept av vilkår</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ved å opprette en konto eller bruke Rendr. («Tjenesten») aksepterer du disse brukervilkårene.
              Dersom du ikke godtar vilkårene, skal du ikke bruke Tjenesten.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">2. Beskrivelse av tjenesten</h2>
            <p className="text-muted-foreground leading-relaxed">
              Rendr. er en AI-drevet plattform for generering av UGC-videoer (User Generated Content)
              for markedsføring. Tjenesten lar brukere laste opp produktbilder og generere videoinnhold
              basert på AI-teknologi.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">3. Konto og tilgang</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Du må være minst 18 år for å bruke Tjenesten.</li>
              <li>Du er ansvarlig for å holde påloggingsinformasjonen din konfidensiell.</li>
              <li>Du er ansvarlig for all aktivitet under din konto.</li>
              <li>Vi forbeholder oss retten til å suspendere eller avslutte kontoer som bryter vilkårene.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">4. Abonnement og betaling</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Tjenesten tilbys som månedlige abonnementer.</li>
              <li>Priser er oppgitt i NOK og inkluderer MVA der det er påkrevd.</li>
              <li>Abonnement fornyes automatisk med mindre du sier det opp.</li>
              <li>Betaling behandles av Stripe. Du godtar Stripes vilkår ved betaling.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">5. Fornøydgaranti</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi tilbyr 30 dagers fornøydgaranti. Dersom du ikke er fornøyd med Tjenesten innen de
              første 30 dagene etter kjøp, kan du kontakte oss for full refusjon.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">6. Bruk av tjenesten</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Du forplikter deg til å ikke:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Bruke Tjenesten til ulovlige formål</li>
              <li>Laste opp innhold som krenker andres rettigheter</li>
              <li>Forsøke å omgå tekniske begrensninger eller sikkerhetstiltak</li>
              <li>Videreselge eller redistribuere tilgang til Tjenesten</li>
              <li>Bruke Tjenesten til å generere ulovlig, støtende eller villedende innhold</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">7. Immaterielle rettigheter</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Du beholder rettighetene til innhold du laster opp.</li>
              <li>Videoer generert gjennom Tjenesten kan brukes fritt av deg til kommersielle formål.</li>
              <li>Rendr. beholder alle rettigheter til plattformen, teknologien og merkevaren.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">8. Begrensning av ansvar</h2>
            <p className="text-muted-foreground leading-relaxed">
              Rendr. leveres «som den er». Vi garanterer ikke at Tjenesten vil være uavbrutt eller
              feilfri. Vårt samlede ansvar er begrenset til beløpet du har betalt for Tjenesten
              de siste 12 månedene.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">9. Endringer i vilkårene</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi kan oppdatere disse vilkårene fra tid til annen. Ved vesentlige endringer
              varsler vi deg via e-post eller gjennom Tjenesten. Fortsatt bruk etter endringer
              utgjør aksept av de oppdaterte vilkårene.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">10. Oppsigelse</h2>
            <p className="text-muted-foreground leading-relaxed">
              Du kan når som helst si opp abonnementet ditt via innstillingene i dashboardet.
              Oppsigelse trer i kraft ved slutten av gjeldende faktureringsperiode.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">11. Gjeldende lov</h2>
            <p className="text-muted-foreground leading-relaxed">
              Disse vilkårene er underlagt norsk lov. Eventuelle tvister skal søkes løst i minnelighet
              før de bringes inn for norske domstoler.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">12. Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              For spørsmål om vilkårene, kontakt oss via{" "}
              <Link to="/kontakt" className="text-primary hover:underline">kontaktskjemaet</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
