// app/page.tsx
'use client'
import React from 'react';

import Script from 'next/script';
import { useState, useEffect } from 'react';
import MasterSword from '../../public/images/TotK_Master_Sword_Fused_Icon_2.png'
import Image from 'next/image';
import { NextResponse } from 'next/server';
import FastLane from './components/fastlane';
import { Suspense } from 'react';
import Loading from './components/loading';






export default function Home() {

  return (
    <>

      <FastLane />


    </>
  )

}
