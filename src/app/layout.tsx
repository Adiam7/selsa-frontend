// import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Providers from '@/components/Providers'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FavouritesProvider } from '@/context/FavouritesContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Selsa Store',
  description: 'Selsa Store - Your one-stop shop for all things Selsa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title> Selsa Store </title>
        {/* Stylesheets */}

        <link rel="stylesheet" href="/stylesheets/website.css" />
        <link rel="stylesheet" href="/stylesheets/HeaderTile.css" />
        <link rel="stylesheet" href="/stylesheets/CoverTile.css" />
        <link rel="stylesheet" href="/stylesheets/TextTile.css" />
        <link rel="stylesheet" href="/stylesheets/CTATile.css" />
        <link rel="stylesheet" href="/stylesheets/LocationTile.css" />
        <link rel="stylesheet" href="/stylesheets/FooterTile.css" />
        <link rel="stylesheet" href="/stylesheets/QuestrialFont.css" />
        <link rel="stylesheet" href="/stylesheets/pagination.css" />
        <link rel="stylesheet" href="/stylesheets/swiper.css" />
        <link rel="stylesheet" href="/stylesheets/product.css" />
        <link rel="stylesheet" href="/stylesheets/product_detail_user.css" />
        <link rel="stylesheet" href="/stylesheets/sidebar.css" />


        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Handle history & reload on back/forward */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onpopstate = function(event) {
                if (event.state) {
                  window.location.reload();
                }
              };
              window.history.scrollRestoration = 'auto';
            `,
          }}
        />
      </head>
      <body className={`bg-gray-50 text-gray-800 antialiased ${inter.className}`}>
        <Providers>
          <FavouritesProvider>
            <Header />
            <div className="flex h-full pt-[70px]">
              <main className="ins-tiles--main flex-1 p-4 text-center pt-4" style={{ paddingTop: '4rem' }}>
                {children}
              </main>
            </div>
            <Footer />
          </FavouritesProvider>
        </Providers>

        {/* JS scripts moved from <head> to here via Next.js Script */}
        <div>
          <Script src="js/product.js" strategy="afterInteractive" />
          <Script src="js/form_add_rem.js" strategy="afterInteractive" />
          <Script src="js/changeImage.js" strategy="afterInteractive" />
          <Script src="js/changeImg.js" strategy="afterInteractive" />
          <Script src="js/ActionLink.js" strategy="afterInteractive" />
          <Script src="js/CoverTile.js" strategy="afterInteractive" />
          <Script src="js/CTATile.js" strategy="afterInteractive" />
          <Script src="js/HeaderTile.js" strategy="afterInteractive" />
          <Script src="js/i.min.js" strategy="afterInteractive" />
          <Script src="js/product_list.js" strategy="afterInteractive" />
          <Script src="js/website-icons.js" strategy="afterInteractive" />
          <Script src="js/website-app.js" strategy="afterInteractive" />
          <Script src="js/TextTile.js" strategy="afterInteractive" />
          <Script src="js/vendors.js" strategy="afterInteractive" />
        </div>
      </body>
    </html>
  );
}
