import React from 'react';
import Hero from '../components/Hero';
import LastestCollection from '../components/LastestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import Collections from '../components/Collections';
import WhatWeDo from '../components/WhatWeDo';
import LuxuryProducts from '../components/LuxuryProducts';

const Home = () => {
    return (
        <div>
            <Hero />
            <Collections />
            <LastestCollection />
            <BestSeller />
            <LuxuryProducts />
            <WhatWeDo />
        </div>
    )
}

export default Home;
