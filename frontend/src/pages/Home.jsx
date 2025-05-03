import React from 'react';
import Hero from '../components/Hero';
import LastestCollection from '../components/LastestCollection';
import BestSeller from '../components/BestSeller';
import Collections from '../components/Collections';
import WhatWeDo from '../components/WhatWeDo';
import LuxEco from '../components/luxeco';

const Home = () => {
    return (
        <div>
            <Hero />
            <Collections />
            <LastestCollection />
            <BestSeller />
            <LuxEco/>
            <WhatWeDo />
        </div>
    )
}

export default Home;