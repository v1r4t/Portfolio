import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import {
  Anek_Devanagari,
  Baloo_Tammudu_2,
  Barlow,
  Modak,
  Space_Mono,
  Teko,
} from 'next/font/google'
import { MotifDefs } from '@/components/art/MotifDefs'
import { ogImageUrl } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'
import '../styles/theme.css'

const teko = Teko({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-teko',
  display: 'swap',
})
const modak = Modak({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-modak',
  display: 'swap',
})
const anek = Anek_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-anek',
  display: 'swap',
})
const baloo = Baloo_Tammudu_2({
  subsets: ['telugu', 'latin'],
  weight: '800',
  variable: '--font-baloo',
  display: 'swap',
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-spacemono',
  display: 'swap',
})
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const DESCRIPTION =
  'Dhruva Vura — portfolio fusing authentic Indian highway truck art and high-performance web engineering.'

const HOME_OG_IMAGE = ogImageUrl({
  title: 'Dhruva Vura',
  sub: 'Designer & Creative Engineer',
  bg: '#45107a',
  accent: '#ffd400',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dhruva Vura — Designer & Creative Engineer',
    template: '%s — Dhruva Vura',
  },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Dhruva Vura',
    locale: 'en_IN',
    description: DESCRIPTION,
    images: [
      {
        url: HOME_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Dhruva Vura — Designer & Creative Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhruva Vura — Designer & Creative Engineer',
    description: DESCRIPTION,
    images: [HOME_OG_IMAGE],
  },
}

export const viewport: Viewport = {
  themeColor: '#45107a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${teko.variable} ${modak.variable} ${anek.variable} ${baloo.variable} ${spaceMono.variable} ${barlow.variable}`}
    >
      <body>
        <style>{`.track-inner{display:flex;height:100%}`}</style>
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`(function () {
  function isExtensionAttr(name) {
    return name.indexOf('bis_') === 0 || name.indexOf('__processed_') === 0;
  }
  function cleanElement(node) {
    if (!node || node.nodeType !== 1) return;
    for (var i = node.attributes.length - 1; i >= 0; i--) {
      if (isExtensionAttr(node.attributes[i].name)) {
        node.removeAttribute(node.attributes[i].name);
      }
    }
  }
  function clean(node) {
    cleanElement(node);
    if (node && node.nodeType === 1 && node.querySelectorAll) {
      var nodes = node.querySelectorAll('*');
      for (var i = 0; i < nodes.length; i++) cleanElement(nodes[i]);
    }
  }
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      if (mutation.type === 'attributes') {
        if (isExtensionAttr(mutation.attributeName)) {
          mutation.target.removeAttribute(mutation.attributeName);
        }
      } else if (mutation.type === 'childList') {
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          clean(mutation.addedNodes[j]);
        }
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  clean(document.documentElement);
  window.addEventListener('load', function () {
    clean(document.documentElement);
    setTimeout(function () { observer.disconnect(); }, 0);
  }, { once: true });
})();`}
        </Script>
        <MotifDefs />
        {children}
      </body>
    </html>
  )
}
