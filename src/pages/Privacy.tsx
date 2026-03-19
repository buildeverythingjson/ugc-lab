import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Personvernerklæring</h1>
        <p className="text-muted-foreground text-sm mb-10">Sist oppdatert: 19. mars 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="font-display text-xl font-semibold mb-3">1. Behandlingsansvarlig</h2>
            <p className="text-muted-foreground leading-relaxed">
              Rendr. («vi», «oss», «vår») er behandlingsansvarlig for personopplysninger som samles inn
              gjennom nettstedet ugclab.no og tilhørende tjenester.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">2. Hvilke opplysninger vi samler inn</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li><strong className="text-foreground">Kontoinformasjon:</strong> Navn, e-postadresse og passord ved registrering.</li>
              <li><strong className="text-foreground">Betalingsinformasjon:</strong> Behandles av vår betalingsleverandør Stripe. Vi lagrer ikke kortnumre.</li>
              <li><strong className="text-foreground">Bruksdata:</strong> Anonymisert informasjon om hvordan du bruker tjenesten (sidevisninger, funksjonsbruk).</li>
              <li><strong className="text-foreground">Innhold:</strong> Produktbilder og videoer du laster opp eller genererer gjennom tjenesten.</li>
              <li><strong className="text-foreground">Kontaktskjema:</strong> Navn, e-post og melding ved henvendelser.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">3. Formål med behandlingen</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Vi behandler personopplysninger for å:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Levere og forbedre tjenesten</li>
              <li>Administrere din konto og abonnement</li>
              <li>Behandle betalinger</li>
              <li>Sende servicevarslinger og viktig informasjon</li>
              <li>Besvare henvendelser via kontaktskjema</li>
              <li>Overholde juridiske forpliktelser</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">4. Rettslig grunnlag</h2>
            <p className="text-muted-foreground leading-relaxed">
              Behandlingen er basert på avtale (GDPR art. 6(1)(b)) for levering av tjenesten,
              samtykke (art. 6(1)(a)) for markedsføring, og berettiget interesse (art. 6(1)(f))
              for analyse og forbedring.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">5. Deling av opplysninger</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Vi deler personopplysninger med:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li><strong className="text-foreground">Stripe:</strong> For betalingsbehandling</li>
              <li><strong className="text-foreground">Skytjenester:</strong> For hosting og lagring av data</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">Vi selger aldri dine personopplysninger til tredjeparter.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">6. Lagring og sletting</h2>
            <p className="text-muted-foreground leading-relaxed">
              Personopplysninger lagres så lenge du har en aktiv konto. Produktbilder slettes automatisk
              30 dager etter at videojobben er fullført. Ved sletting av konto fjernes alle dine data
              innen 30 dager, med unntak av opplysninger vi er pålagt å beholde etter lov.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">7. Dine rettigheter</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Du har rett til å:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Be om innsyn i dine personopplysninger</li>
              <li>Kreve retting av uriktige opplysninger</li>
              <li>Kreve sletting av dine opplysninger</li>
              <li>Begrense behandlingen</li>
              <li>Protestere mot behandlingen</li>
              <li>Dataportabilitet</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">8. Informasjonskapsler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi bruker nødvendige informasjonskapsler for å sikre at nettstedet fungerer korrekt,
              samt analysekapsler for å forstå hvordan tjenesten brukes. Du kan administrere
              innstillinger for informasjonskapsler i nettleseren din.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">9. Sikkerhet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi bruker bransjestandard sikkerhetstiltak for å beskytte dine personopplysninger,
              inkludert kryptering av data under overføring og lagring.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">10. Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              For spørsmål om personvern, kontakt oss via{" "}
              <Link to="/kontakt" className="text-primary hover:underline">kontaktskjemaet</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
