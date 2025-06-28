import React, { useState, useEffect } from 'react';
import { assets } from '../assets/frontend_assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import OurPolicy from '../components/OurPolicy';
import Title from '../components/Title';
import { ChevronDown, ChevronUp } from "lucide-react";

const About = () => {
  const [showFullStory, setShowFullStory] = useState(false);

  useEffect(() => {
    document.title = 'About Aharyas | Conscious Luxury, Indian Heritage';
  }, []);

  // Assuming these images would be added to your assets
  const imageAssets = {
    founders: assets.about_img, // Existing founders image
    journey: "/api/placeholder/1200/500", // Journey panoramic image
    craftsmanDetail: "/api/placeholder/400/600", // Detailed craftsmanship
    artisanPortrait: "/api/placeholder/400/500", // Artisan portrait
    sustainabilityImage: "/api/placeholder/600/400", // Sustainability image
  };

  return (
    <div className="min-h-screen text-black mt-20 py-16">
      <section className="text-center">
        <Title text1="ABOUT" text2="AHARYAS" />
      </section>

      {/* Brand Story */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6 tracking-wider uppercase text-black">Our Origin</h2>
            <div className="space-y-6 text-gray-800 text-lg leading-relaxed">
              <p> Aharyas began during our college days. We wanted something elegant, something real, something that whispered of our roots but fit into today's world. The spark came when we read about the difficult lives of Indian artisans—especially weavers—whose skills were fading into obscurity. Behind every woven thread was a weaver fading into silence. We couldn't unsee it. </p>
              <p> Aharyas was born not just as a label, but as a tribute to the hands that carry India's artistry. They are not workers. Today, we work with over 300+ artisan families, empowering them through fair opportunities and long-term support. They're not just artisans—they're the soul of Aharyas. They are the keepers of legacy, the soul behind every Aharyas piece. </p>
              <p> What began as a college frustration became a movement to wear India, with pride and purpose, blending traditional craftsmanship with conscious luxury. </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-40 h-40 border-l-2 border-t-2 border-black opacity-20"></div>
            <img
              className="rounded-xl shadow-2xl w-full object-cover z-10 relative"
              src={imageAssets.founders}
              alt="Aharyas Founders"
            />
            <div className="absolute -bottom-4 -right-4 w-40 h-40 border-r-2 border-b-2 border-black opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - with background image */}
      <section className="relative py-16 overflow-hidden">
        <div className="relative px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="text-center mb-16">
            <Title text1="VISION &" text2="MISSION" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-10 border-l-4 border-black shadow-lg">
              <h3 className="text-xl font-semibold mb-4 uppercase text-black">Our Vision</h3>
              <p className="text-gray-700 text-lg">
                To craft India's first luxury clothing brand where heritage meets high design rooted deeply in culture, craft, and community.
              </p>
            </div>
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-10 border-l-4 border-black shadow-lg">
              <h3 className="text-xl font-semibold mb-4 uppercase text-black">Our Mission</h3>
              <p className="text-gray-700 text-lg">
                To preserve dying crafts, uplift artisan voices, and create fashion that feels timeless, ethical, and soulfully elegant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Drives Us */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="order-1 lg:order-2">
          <h3 className="text-2xl font-semibold mb-6 uppercase text-black">What Drives Us</h3>
          <div className="bg-gradient-to-r from-gray-100 to-transparent rounded-lg p-10 border-l-4 border-black shadow">
            <p className="text-xl text-gray-700 italic">
              A simple belief: <br /><br />
              That fashion should not just look good—it should mean something, honour hands, and carry stories forward.
            </p>
          </div>
        </div>
      </section>

      {/* Artisan Stories */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="text-center mb-16">
          <Title text1="ARTISAN" text2="STORIES" />
          <p className="max-w-xl mx-auto text-gray-600 mt-4">
            Every Aharyas piece is a living memory—crafted by hands that keep tradition alive.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-black opacity-20"></div>
              <img
                src={assets.mallesh_img}
                alt="Master Weaver Mallesh Anna"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-2 bg-white border-l-4 border-black shadow-lg rounded-lg p-8 transition-all duration-500">
            <h4 className="text-xl font-semibold mb-4 text-black">Meet Mallesh Anna - The Heart Behind the Loom</h4>
            {!showFullStory ? (
              <>
                <p className="text-gray-700">
                  From the weaving town of Pochampally, Mallesh Anna has spent over 40 years breathing life into threads. He began as a young boy, watching his parents tie and dye yarn late into the night, slowly learning that every motif held a meaning and every weave, a memory... Today, at 56, he still rises before dawn, preparing yarns with care and weaving with quiet pride. The journey hasn't been easy—rising costs, fewer buyers—but he never let go of the loom that shaped his life.
                  <br /><br />
                  Now a treasured part of the Aharyas family, Mallesh Anna's work is more than craftsmanship… it's legacy. When you wear his weave, you carry a story. His story.
                </p>
                <button className="mt-6 flex items-center text-black font-semibold hover:underline" onClick={() => setShowFullStory(true)} aria-expanded={showFullStory}>
                  Read Full Story <ChevronDown className="ml-2 h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 whitespace-pre-line">
                  In the quiet village lanes of Pochampally, as the world still sleeps, a soft rhythm begins. It's not a song, but a sound, a tap, pull, beat—the sacred hum of a loom guided by hands that have known its music for over 40 years... Those hands belong to Mallesh Anna, a master Ikkat weaver, now 56, whose story is woven deep into the fabric of India's heritage. He learned by watching, small feet by the loom, wide eyes on his parents' weathered fingers as they tied, dyed, and wove stories under lantern light. "Back then, I thought it was magic," he says. "Now I know... it's devotion."
                  <br /><br />
                  Each day, before the sun graces the fields, Mallesh rises. He prepares the yarns with near-meditative precision—from boiling, dyeing, to aligning them into harmony. His eyes have seen thousands of patterns form and fade, yet he remembers each one. "Every motif means something. Some are for love, others for rain, or joy, or sorrow. It's like a language," he says, with a smile that carries both pride and pain.
                  <br /><br />
                  But tradition has not come without its trials... There were years when buyers vanished. When cloth went unsold. When his heart broke seeing fellow weavers give up, sell their looms, and walk away from legacies centuries old. "We kept going… because the loom is not just work. It's who we are."
                  <br /><br />
                  Today, Mallesh Anna weaves not in the shadows, but with new light, as a beloved part of the Aharyas family. His art is no longer a whisper from the past, it is a voice heard by the world. We stand by him, not just as partners, but as custodians of a culture he's spent a lifetime preserving.
                  <br /><br />
                  When you wear his work, you wear his childhood, his resilience, his heartbeat.
                  <br />
                  And when you feel the softness of the cloth, know this: It was once just yarn. Now, it's a living memory.
                </p>
                <button className="mt-6 flex items-center text-black font-semibold hover:underline" onClick={() => setShowFullStory(false)} aria-expanded={showFullStory}>
                  Show Less <ChevronUp className="ml-2 h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* The Crafts We Celebrate */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="text-center mb-16">
          <Title text1="THE CRAFTS" text2="WE CELEBRATE" />
          <p className="max-w-xl mx-auto text-gray-600 mt-4">
            Ancient techniques with contemporary expressions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group overflow-hidden shadow-md">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlTzt84KtIPmCvbws6ZqxkME343VJwuealkg&s"
                alt="Ikkat from Pochampally"
                className="w-full h-full object-cover "
              />
            </div>
            <div className="p-6 bg-white">
              <h5 className="font-semibold mb-2 text-black text-lg">Ikkat from Pochampally</h5>
              <p className="text-gray-600">Where threads are dyed before they're woven, creating a beautifully blurred, rhythmic art.</p>
            </div>
          </div>

          <div className="group overflow-hidden shadow-md">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWwrcUvr9rX9VwZFYDGm-78n_LUjOcDLOwxg&s"
                alt="Kalamkari from Pedana"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 bg-white">
              <h5 className="font-semibold mb-2 text-black text-lg">Kalamkari from Pedana</h5>
              <p className="text-gray-600">Hand-painted and block-printed stories, each fabric a canvas of myth, memory, and meaning.</p>
            </div>
          </div>

          <div className="group overflow-hidden shadow-md">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb7Jr4lAecluSZlmlVml77XKR2bst9LesyeA&s"
                alt="Hand Block Printing from Rajasthan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 bg-white">
              <h5 className="font-semibold mb-2 text-black text-lg">Hand Block Printing</h5>
              <p className="text-gray-600">Carved wooden blocks dipped in earthy dyes, echoing the warmth and detail of desert craftsmanship.</p>
            </div>
          </div>

          <div className="group overflow-hidden shadow-md">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87LSPNVl8KL6ockU6-Z7y6Gn36CuW2CsMw&s"
                alt="Traditional Embroideries"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 bg-white">
              <h5 className="font-semibold mb-2 text-black text-lg">Traditional Embroideries</h5>
              <p className="text-gray-600">From mirror-studded stitches of Gujarat to the flowing Kantha of Bengal and the vibrant Phulkari of Punjab.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey - full width image */}
      <section className="relative py-16">
        <div className="absolute inset-0">
          <img
            src={assets.about_img}
            alt="Our Journey Across India"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white"></div>
        </div>
        <div className="relative px-4 sm:px-8 md:px-10 lg:px-20 text-center">
          <div className="mb-16">
            <Title text1="OUR" text2="JOURNEY INTO HANDLOOMS" />
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-10 max-w-4xl mx-auto shadow-lg">
            <p className="text-gray-800 text-lg">
              Our journey led us across India—from the looms of Pochampally to the painted fabrics of Pedana, the earthy blocks of Rajasthan, and the delicate embroidery houses of Delhi. We met artisans who welcomed us in, shared their craft, and showed us that every thread carries patience, pride, and generations of history. What we witnessed wasn't just technique—it was tradition kept alive by hand and heart. That journey shaped not just our purpose but the soul of Aharyas.
            </p>
          </div>
        </div>
      </section>

      {/* Our Policies */}
      <section>
        <OurPolicy />
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-8 md:px-16">
        <NewsletterBox />
      </section>
    </div>
  );
};

export default About;