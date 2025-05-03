import React from 'react';
import Hero from '../components/Hero';
import LastestCollection from '../components/LastestCollection';
import BestSeller from '../components/BestSeller';
import Collections from '../components/Collections';
import WhatWeDo from '../components/WhatWeDo';
import BrandCategories from '../components/BrandCategories';

const Home = () => {
    return (
        <div>
            <Hero />
            <Collections />
            <LastestCollection />
            <BestSeller />
            <BrandCategories />
            <WhatWeDo />
        </div>
    )
}

export default Home;