import { useState } from 'react';
import IndiaMap from '../components/IndanMap.jsx';
import HandloomModal from '../components/HandloomModel.jsx';
import { HANDLOOM_DATA } from '../data/HandloomData';


export function IndiaHandloomSection() {
const [open, setOpen] = useState(false);
const [selected, setSelected] = useState(null);


const handleSelect = (stateName) => {
setSelected(stateName);
setOpen(true);
};


const items = selected ? (HANDLOOM_DATA[selected] || []) : [];


return (
<section className="relative py-12 sm:py-16">
<div className="px-4 sm:px-8 md:px-10 lg:px-20">
<div className="text-center mb-10">
<p className="text-xs tracking-widest uppercase text-white/60">Interactive</p>
<h2 className="text-2xl sm:text-3xl font-bold text-white">India’s Handloom Map</h2>
<p className="mt-2 text-white/60">Tap a state to explore its iconic textiles and embroidery traditions.</p>
</div>


<IndiaMap onSelect={handleSelect} />
</div>


<HandloomModal
open={open}
onClose={() => setOpen(false)}
stateName={selected}
items={items}
/>
</section>
);
}