import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl prose prose-invert prose-headings:font-display">
        <h1 className="text-3xl font-bold mb-8">Personvernerklæring</h1>
        <p className="text-muted-foreground text-sm mb-8">Sist oppdatert: 19. mars 2026</p>

        <h2>1. Behandlingsansvarlig</h2>
        <p>
          UGC Lab («vi», «oss», «vår») er behandlingsansvarlig for personopplysninger som samles inn
          gjennom nettstedet ugclab.no og tilhørende tjenester.
        </p>

        <h2>2. Hvilke opplysninger vi samler inn</h2>
        <ul>
          <li><strong>Kontoinformasjon:</strong> Navn, e-postadresse og passord ved registrering.</li>
          <li><strong>Betalingsinformasjon:</strong> Behandles av vår betalingsleverandør Stripe. Vi lagrer ikke kortnumre.</li>
          <li><strong>Bruksdata:</strong> Anonymisert informasjon om hvordan du bruker tjenesten (sidevisninger, funksjonsbruk).</li>
          <li><strong>Innhold:</strong> Produktbilder og videoer du laster opp eller genererer gjennom tjenesten.</li>
          <li><strong>Kontaktskjema:</strong> Navn, e-post og melding ved henvendelser.</li>
        </ul>

        <h2>3. Formål med behandlingen</h2>
        <p>Vi behandler personopplysninger for å:</p>
        <ul>
          <li>Levere og forbedre tjenesten</li>
          <li>Administrere din konto og abonnement</li>
          <li>Behandle betalinger</li>
          <li>Sende servicevarslinger og viktig informasjon</li>
          <li>Besvare henvendelser via kontaktskjema</li>
          <li>Overholde juridiske forpliktelser</li>
        </ul>

        <h2>4. Rettslig grunnlag</h2>
        <p>
          Behandlingen er basert på avtale (GDPR art. 6(1)(b)) for levering av tjenesten,
          samtykke (art. 6(1)(a)) for markedsføring, og berettiget interesse (art. 6(1)(f))
          for analyse og forbedring.
        </p>

        <h2>5. Deling av opplysninger</h2>
        <p>Vi deler personopplysninger med:</p>
        <ul>
          <li><strong>Stripe:</strong> For betalingsbehandling</li>
          <li><strong>Skytjenester:</strong> For hosting og lagring av data</li>
        </ul>
        <p>Vi selger aldri dine personopplysninger til tredjeparter.</p>

        <h2>6. Lagring og sletting</h2>
        <p>
          Personopplysninger lagres så lenge du har en aktiv konto. Produktbilder slettes automatisk
          30 dager etter at videojobben er fullført. Ved sletting av konto fjernes alle dine data
          innen 30 dager, med unntak av opplysninger vi er pålagt å beholde etter lov.
        </p>

        <h2>7. Dine rettigheter</h2>
        <p>Du har rett til å:</p>
        <ul>
          <li>Be om innsyn i dine personopplysninger</li>
          <li>Kreve retting av uriktige opplysninger</li>
          <li>Kreve sletting av dine opplysninger</li>
          <li>Begrense behandlingen</li>
          <li>Protestere mot behandlingen</li>
          <li>Dataportabilitet</li>
        </ul>

        <h2>8. Informasjonskapsler</h2>
        <p>
          Vi bruker nødvendige informasjonskapsler for å sikre at nettstedet fungerer korrekt,
          samt analysekapsler for å forstå hvordan tjenesten brukes. Du kan administrere
          innstillinger for informasjonskapsler i nettleseren din.
        </p>

        <h2>9. Sikkerhet</h2>
        <p>
          Vi bruker bransjestandard sikkerhetstiltak for å beskytte dine personopplysninger,
          inkludert kryptering av data under overføring og lagring.
        </p>

        <h2>10. Kontakt</h2>
        <p>
          For spørsmål om personvern, kontakt oss via{" "}
          <Link to="/kontakt" className="text-primary hover:underline">kontaktskjemaet</Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
