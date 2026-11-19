import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function RootHtml({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover, user-scalable=no"
        />

        {/* PWA & Mobile Web Capabilities */}
        <title>PeriodFLO - Cycle Intelligence & Partner Sync</title>
        <meta
          name="description"
          content="Privacy-first menstrual cycle tracking, predictive health analytics, and partner sync."
        />
        <meta name="theme-color" content="#E07A5F" />

        {/* Apple iOS Web App Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PeriodFLO" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.ico" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then((reg) => {
                    console.log('PeriodFLO Service Worker registered:', reg.scope);
                  }).catch((err) => {
                    console.warn('Service Worker registration failed:', err);
                  });
                });
              }
            `,
          }}
        />

        <ScrollViewStyleReset />
      </head>
      <body style={{ backgroundColor: '#FDFBF7', margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
