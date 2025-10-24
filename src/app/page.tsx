// src/app/Home/page.tsx
'use client';

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import IntroPage from "./intro/page";
import { ComingTile } from "./coming_soon/page";
import AboutPage from "./about/page";
import { ClothingCTA } from "./clothing/page";
import { DeliveryTile } from "./delivery/page";
import { ReturnsTile } from "./return/page";
import { NewCollectionTile } from "./new-collection/page";
import { ServicesTile } from "./service/page";


// export const metadata = {
//   title: 'Style | Selsa',
//   description: 'Step into a world of color with our carefully selected pieces',
// };

export default function Home() {
  return (
    <>
      <IntroPage />
      <AboutPage />
      <ClothingCTA />
      <ComingTile />
      <NewCollectionTile />
      <DeliveryTile />
      <ReturnsTile />
      <ServicesTile/>
    </>
  );
}

