import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Navigation } from './components/Navigation'
import { ScrollVideo } from './components/ScrollVideo'
import { SectionAbout } from './components/SectionAbout'
import { SectionLocation } from './components/SectionLocation'
import { SectionUnits } from './components/SectionUnits'
import { SectionAmenities } from './components/SectionAmenities'
import { SectionBooking } from './components/SectionBooking'
import { Footer } from './components/Footer'
import { site } from './config/site'
import { scrollToSelector } from './lib/smoothScroll'
import './App.css'

export default function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${site.title} — ${site.tagline}`}</title>
        <meta name="description" content={site.description} />
        <link rel="canonical" href={site.url} />
        <meta property="og:title" content={`${site.title} — ${site.tagline}`} />
        <meta property="og:description" content={site.description} />
        <meta property="og:url" content={site.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${site.title} — ${site.tagline}`} />
        <meta name="twitter:description" content={site.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: site.title,
            description: site.description,
            url: site.url,
            email: site.email,
            telephone: site.phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: site.address,
              addressLocality: 'Tunis',
              addressRegion: 'Tunis Governorate',
              addressCountry: 'TN',
            },
          })}
        </script>
      </Helmet>

      <a
        href="#about"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          scrollToSelector('#about')
        }}
      >
        Skip to content
      </a>

      <Navigation />

      <main>
        <ScrollVideo />
        <div id="content">
          <SectionAbout />
          <SectionLocation />
          <SectionUnits />
          <SectionAmenities />
          <SectionBooking />
        </div>
      </main>

      <Footer />
    </HelmetProvider>
  )
}
