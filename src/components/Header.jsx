'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/features/cart/hooks/useCart';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="ins-tile ins-tile--header ins-tile--left-logo-compact ins-tile--has-opacity ins-tile--full-opacity ins-tile--light-sidebar" role="banner" id="tile-header-fcHJMd">
      <style>{`
        #tile-header-fcHJMd {
          --background-color-a: 0;
          --background-color-b: 0;
          --background-color-h: 0;
          --background-color-l: 0%;
          --background-color-s: 0%;
          --menu-and-icons-font-size: 16px;
          --menu-and-icons-font-style: normal;
          --menu-and-icons-font-weight: 400;
        }
        .ins-tile {
          --header-height-desktop: 70;
          --header-height-mobile: 60;
        }
      `}</style>
      <div className="ins-tile__wrap ins-tile__animated">
        <div className="ins-header">
          <div className="ins-header__wrap">
            <div className="ins-header__inner">
              <div className="ins-header__row">
                <div className="ins-header__left">
                  <div className="ins-header__logo">
                    <Link href="/" className="ins-header__logo-inner">
                      <div className="ins-header__logo-image">
                        <div className="ins-header__logo-image-inner no-background">
                          <Image
                            src="/images/g15.png"
                            alt="Selsa Store"
                            width={40}
                            height={40}
                            priority={false}
                            style={{ objectFit: 'fill' }}
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="ins-header__menu ins-header__menu--few">
                    <nav className="main-navigation">
                      <div className="ins-header__menu ins-header__menu--few">
                        <div className="ins-header__menu-wrap">
                          <nav className="ins-header__menu-inner">
                            <div tabIndex={0} className="ins-header__menu-link">
                              <Link href="/store" className="ins-header__menu-link-title" aria-label="Store">
                                Store
                              </Link>
                            </div>
                            <div tabIndex={0} className="ins-header__menu-link">
                              <Link href="/about" className="ins-header__menu-link-title" tabIndex={-1} aria-label="About">
                                  About
                                
                              </Link>
                            </div>
                            <div tabIndex={0} className="ins-header__menu-link">
                              <Link href="/contact" className="ins-header__menu-link-title" tabIndex={-1} aria-label="Contact Us">
                                  Contact Us
                                
                              </Link>
                            </div>
                          </nav>
                          <div className="ins-header__scroller">
                            <div className="ins-header__scroller-marker" style={{ left: '0%', width: '0%' }}></div>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="ins-header__right">
                  <Link 
                    href="/products/search" 
                    className="ins-header__icon ins-header__icon--search" 
                    role="button" 
                    aria-label="Search the website" 
                    title="Search the website"
                    name="name"
                    placeholder="Search">

                      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.8333 9.83333C16.8333 5.96667 13.7 2.86667 9.86667 2.86667C6 2.86667 2.9 6 2.9 9.83333C2.9 13.7 6.03333 16.8 9.86667 16.8C13.7 16.8333 16.8333 13.7 16.8333 9.83333ZM22 21.4L21.4 22L15.0667 15.6667C13.6667 16.9 11.8667 17.6667 9.83333 17.6667C5.5 17.6667 2 14.1667 2 9.83333C2 5.5 5.5 2 9.83333 2C14.1667 2 17.6667 5.5 17.6667 9.83333C17.6667 11.8333 16.9 13.6667 15.6667 15.0667L22 21.4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                  </Link>
                  {/* ⭐️ NEW Favourite Icon */}
                  <Link href="/favourites" className="ins-header__icon ins-header__icon--favourite" role="button" aria-label="Go to favourites" title="Go to favourites">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                          2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                          C13.09 3.81 14.76 3 16.5 3 
                          19.58 3 22 5.42 22 8.5 
                          c0 3.78-3.4 6.86-8.55 11.54L12.1 21.35z" 
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                  <Link href="/profile" className="ins-header__icon ins-header__icon--account" role="button" aria-label="Go to your account">
                      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.5 12.0037C23.5012 10.0898 23.0244 8.20585 22.1129 6.52281C21.2014 4.83976 19.884 3.41084 18.2802 2.36565C16.6764 1.32047 14.8369 0.692104 12.9287 0.537549C11.0204 0.382995 9.10378 0.707143 7.35258 1.48059C5.60138 2.25404 4.07105 3.45232 2.9004 4.96672C1.72975 6.48113 0.955821 8.26374 0.64882 10.1529C0.34182 12.042 0.511461 13.9779 1.14235 15.7848C1.77325 17.5918 2.84543 19.2128 4.26165 20.5006C4.28966 20.5338 4.32226 20.5629 4.35848 20.5869C6.46141 22.4631 9.18149 23.5 12.0001 23.5C14.8188 23.5 17.5388 22.463 19.6417 20.5867C19.6778 20.5628 19.7102 20.5338 19.7381 20.5007C20.9235 19.4252 21.8705 18.1135 22.5184 16.6501C23.1663 15.1867 23.5007 13.604 23.5 12.0037ZM1.42 12.0037C1.41878 10.2648 1.84643 8.55248 2.66509 7.01827C3.48375 5.48405 4.66817 4.17528 6.11348 3.20782C7.55879 2.24035 9.22042 1.64404 10.9512 1.47168C12.6821 1.29931 14.4287 1.55621 16.0365 2.21963C17.6444 2.88305 19.0638 3.93252 20.1691 5.27513C21.2744 6.61775 22.0316 8.21209 22.3735 9.91701C22.7155 11.6219 22.6317 13.3848 22.1295 15.0496C21.6274 16.7145 20.7224 18.2298 19.4947 19.4616C18.3528 17.55 16.5208 16.1493 14.3764 15.5482C15.373 15.0182 16.1638 14.1702 16.6228 13.1392C17.0819 12.1081 17.1828 10.9532 16.9096 9.85816C16.6364 8.76314 16.0047 7.79091 15.1151 7.09614C14.2254 6.40136 13.1289 6.02395 12 6.02395C10.8711 6.02395 9.77458 6.40136 8.88494 7.09614C7.9953 7.79091 7.36363 8.76314 7.09042 9.85816C6.8172 10.9532 6.91814 12.1081 7.37717 13.1392C7.8362 14.1702 8.62696 15.0182 9.62364 15.5482C7.4792 16.1493 5.64721 17.55 4.50533 19.4616C3.52633 18.4819 2.74996 17.3191 2.22057 16.0394C1.69119 14.7598 1.41915 13.3884 1.42 12.0037ZM12 15.2226C11.1812 15.2226 10.3808 14.9799 9.69994 14.5252C9.01912 14.0704 8.48848 13.424 8.17514 12.6678C7.86179 11.9115 7.77981 11.0794 7.93955 10.2765C8.09929 9.4737 8.49359 8.73626 9.07258 8.15745C9.65157 7.57864 10.3892 7.18447 11.1923 7.02478C11.9954 6.86509 12.8278 6.94705 13.5843 7.26029C14.3408 7.57354 14.9874 8.10401 15.4423 8.78461C15.8972 9.46522 16.14 10.2654 16.14 11.084C16.1388 12.1812 15.7022 13.2332 14.9261 14.0091C14.1499 14.785 13.0976 15.2214 12 15.2226ZM5.19947 20.0991C5.88217 18.8976 6.87116 17.8985 8.06574 17.2035C9.26032 16.5084 10.6178 16.1422 12 16.1422C13.3822 16.1422 14.7397 16.5084 15.9343 17.2035C17.1288 17.8985 18.1178 18.8976 18.8005 20.0991C16.897 21.7015 14.4885 22.5803 12 22.5803C9.51148 22.5803 7.10295 21.7015 5.19947 20.0991Z" fill="currentColor"></path>
                      </svg>
                  </Link>
                  <Link href="/cart" role="button" className={`ins-header__icon ins-header__icon--cart${cartCount > 0 ? '' : ' ins-header__icon--cart-empty'}`} aria-label="Go to your shopping cart" title="Go to your shopping cart">
                      <Image src="/images/shopping.png" alt="cart" width={24} height={24} style={{ objectFit: 'cover' }} />
                      <span id="cart-count">{cartCount}</span>
                  </Link>
                  <Link className="ins-header__icon ins-header__icon--burger" href="#menu" role="button" aria-label="Website menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.5 8.5H0.5C0.2 8.5 0 8.3 0 8C0 7.7 0.2 7.5 0.5 7.5H23.5C23.8 7.5 24 7.7 24 8C24 8.3 23.8 8.5 23.5 8.5Z" fill="currentColor"></path>
                      <path d="M14.5 16.5H0.5C0.2 16.5 0 16.3 0 16C0 15.7 0.2 15.5 0.5 15.5H14.5C14.8 15.5 15 15.7 15 16C15 16.3 14.8 16.5 14.5 16.5Z" fill="currentColor"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
