// src/app/contact/page.tsx
import React from 'react';

export const metadata = {
  title: 'Style | Selsa-contact',
  description: 'Contact',
};

export default function store() {
  return (
    <section
      role="region"
      aria-label="Contacts"
      id="tile-location-76LGKZ"
      className="ins-tile ins-tile--location ins-tile--full ins-tile--has-map ins-tile--has-image"
    >
      <style>
        {`
          #tile-location-76LGKZ {
              --background-gradient-color-from-a: 0;
              --background-gradient-color-to-a: 0;
              --background-solid-color-a: 1;
              --background-solid-color-b: 0.9254901960784314;
              --background-solid-color-h: 14.99999999999978;
              --background-solid-color-l: 92.54901960784314%;
              --background-solid-color-s: 0%;
              --contact-info-email-font-size: 20px;
              --contact-info-email-font-style: normal;
              --contact-info-email-font-weight: 400;
              --contact-info-phone-font-size: 20px;
              --contact-info-phone-font-style: normal;
              --contact-info-phone-font-weight: 400;
              --contact-info-subheading-font-style: normal;
              --contact-info-subheading-font-weight: 700;
              --description-font-size: 20px;
              --description-font-style: normal;
              --description-font-weight: 400;
              --hours-note-font-size: 20px;
              --hours-note-font-style: normal;
              --hours-note-font-weight: 400;
              --hours-subheading-font-style: normal;
              --hours-subheading-font-weight: 700;
              --image-aspect-ratio: 68.0794701986755%;
              --location-address-font-size: 20px;
              --location-address-font-style: normal;
              --location-address-font-weight: 400;
              --location-subheading-font-style: normal;
              --location-subheading-font-weight: 700;
              --title-font-size: 64px;
              --title-font-style: normal;
              --title-font-weight: 700;
           }  
        `}
      </style>
      <div className="ins-tile__wrap ins-tile__animated">
        <h2 className="ins-tile__title ins-tile__animated">Contacts</h2>

        <div className="ins-tile__image">
          <div
            style={{ backgroundColor: 'rgba(235, 148, 163, 1)' }}
            className="ins-tile__picture"
          >
            <picture className="ins-picture ins-picture--full">
              {/* 
              <!-- <source srcSet="/location-76LGKZ/Z7zG3FL-2000x2000.webp" media="(min-width: 900px)" type="image/webp" />
              <source srcSet="/location-76LGKZ/Z7zG3FL-1200x1200.webp" media="(min-width: 500px)" type="image/webp" />
              <source srcSet="/location-76LGKZ/Z7zG3FL-600x600.webp" type="image/webp" />
              <source srcSet="/location-76LGKZ/Z7zG3FL-2000x2000.png" media="(min-width: 900px)" />
              <source srcSet="/location-76LGKZ/Z7zG3FL-1200x1200.png" media="(min-width: 500px)" />
              <source srcSet="/location-76LGKZ/Z7zG3FL-600x600.png" />
              <img src="" alt="" loading="lazy" /> -->
              */}
            </picture>
          </div>
        </div>

        <div className="ins-tile__body ins-tile__animated">
          <div className="ins-tile__row ins-tile__row--location">
            <div
              role="heading"
              aria-level="3"
              className="ins-tile__text ins-tile__address ins-tile__format"
            >
              Street, City, Postcode, Country
            </div>
          </div>

          <div className="ins-tile__row ins-tile__row--hours">
            <div className="ins-tile__text ins-tile__hours-note ins-tile__format">
              Daily 10:00 AM — 7:00 PM
            </div>
          </div>

          <div className="ins-tile__row ins-tile__row--contacts">
            <div className="ins-tile__text">
              <a
                aria-label="Call the store’s phone number"
                href="tel:+15557771234"
                className="ins-tile__phone"
              >
                +1-555-777-1234
              </a>
            </div>
            <div className="ins-tile__text">
              <a
                aria-label="Compose an email to the store"
                href="mailto:selsa.com"
                className="ins-tile__email"
              >
                email@selsa.com
              </a>
            </div>
          </div>

          <div className="ins-tile__row ins-tile__row--social">
            <div className="ins-tile__row-inner">
              <a
                href="http://facebook.com"
                title="Facebook"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="ins-tile__icon ins-tile__icon--plain"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M32 16.0978C32 7.20722 24.8366 0 16 0C7.16344 0 0 7.20722 0 16.0978C0 24.1325 5.85094 30.7924 13.5 32V20.751H9.4375V16.0978H13.5V12.5512C13.5 8.51673 15.8888 6.2882 19.5434 6.2882C21.2934 6.2882 23.125 6.60261 23.125 6.60261V10.5642H21.1075C19.12 10.5642 18.5 11.8051 18.5 13.0794V16.0978H22.9375L22.2281 20.751H18.5V32C26.1491 30.7924 32 24.1325 32 16.0978Z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com"
                title="Instagram"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="ins-tile__icon ins-tile__icon--plain"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M16 10.3525C12.8757 10.3525 10.3429 12.881 10.3429 16C10.3429 19.119 12.8757 21.6475 16 21.6475C19.1243 21.6475 21.657 19.119 21.657 16C21.657 12.881 19.1243 10.3525 16 10.3525Z" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.89569 0.502254C12.8976 -0.167418 19.1024 -0.167418 25.1043 0.502254C28.4087 0.870949 31.0739 3.47017 31.4618 6.78058C32.1794 12.906 32.1794 19.094 31.4618 25.2194C31.0739 28.5298 28.4087 31.1291 25.1043 31.4977C19.1024 32.1674 12.8976 32.1674 6.8957 31.4977C3.59129 31.1291 0.926056 28.5298 0.538221 25.2194C-0.179407 19.094 -0.179407 12.906 0.538221 6.78058C0.926056 3.47017 3.59129 0.870949 6.89569 0.502254ZM24.7031 5.57379C23.7418 5.57379 22.9625 6.35179 22.9625 7.31149C22.9625 8.2712 23.7418 9.0492 24.7031 9.0492C25.6644 9.0492 26.4437 8.2712 26.4437 7.31149C26.4437 6.35179 25.6644 5.57379 24.7031 5.57379ZM7.732 16C7.732 11.4414 11.4337 7.74592 16 7.74592C20.5663 7.74592 24.268 11.4414 24.268 16C24.268 20.5586 20.5663 24.2541 16 24.2541C11.4337 24.2541 7.732 20.5586 7.732 16Z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}