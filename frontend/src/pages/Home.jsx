import React from 'react';
import Hero from '../components/Hero';
import LastestCollection from '../components/LastestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import Collections from '../components/Collections';
import WhatWeDo from '../components/WhatWeDo';

const Home = () => {
    return (
        <div>
            <Hero />
            <Collections />
            <LastestCollection />
            <BestSeller />
            <OurPolicy />
            <WhatWeDo />
            <NewsletterBox />
        </div>
    )
}

export default Home;
