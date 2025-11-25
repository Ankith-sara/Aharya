import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import OurPolicy from '../components/OurPolicy';
import Title from '../components/Title';
import { ChevronDown, ChevronUp } from "lucide-react";
import IndianMap from '../components/IndianMap';

const About = () => {
  const [showFullStory, setShowFullStory] = useState(false);

  useEffect(() => {
    document.title = 'About Aharyas | Conscious Luxury, Indian Heritage';
  }, []);

  return (
    <div className="min-h-screen text-black mt-20">
      {/* Brand Story */}
      <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-none shadow-2xl">
                <img
                  className="w-full h-[600px] object-cover filter transition-all duration-700"
                  src={assets.about_img}
                  alt="Aharyas Heritage"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -top-8 -left-8 w-16 h-16 border border-black/20"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 border border-black/20"></div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="text-3xl text-center mb-6">
                <Title text1="ABOUT" text2="AHARYAS" />
              </div>

              <div className="space-y-4 text-gray-700 text-lg leading-loose font-light">
                <p>We, at Aharyas, are driven by the potential of handcrafted narratives. We're not creating a brand — we're creating a bridge between India's storied craft heritage and the world of mindful fashion.</p>
                <p>Aharyas was born from our profound respect for artisans and our ambitious vision to bring their work the visibility and audience it rightly deserves.</p>
                <p>Through our online platform, Aharyas unites craftsmanship, technology, and meaning. We employ AI and AR to design an immersive shopping experience that enables customers to engage with each product — to view, touch, and learn the story behind it.</p>
                <p>Aharyas operates under three essential categories — authentic handmade craft from artisans, sustainable and affordable fashion for daily wear, and a luxury segment specific to high-end fashion with Indian sensibilities.</p>
                <p>Until now, Aharyas has on-boarded more than 300 artisans, many belonging to self-help groups, providing them a platform to feature their work, earn equitable income, and revive their creative identity.</p>
                <blockquote className="border-l-2 border-black pl-6 py-4 italic text-xl text-black font-light">
                  "At Aharyas, we're driven by purpose, powered by innovation, and grounded in tradition."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative py-24 bg-gradient-to-br from-stone-50 via-white to-stone-50">
        <div className="px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block">
                <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
                  Our Mission <span className="font-medium">& Vision</span>
                </h2>
              </div>
            </div>

            {/* Mission */}
            <div className="mb-24 group">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="relative bg-white p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-black">
                    <div className="mb-6">
                      <h3 className="text-3xl md:text-4xl font-medium text-black leading-tight">
                        Mission
                      </h3>
                    </div>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-black to-transparent mb-6"></div>
                    <p className="text-gray-700 text-lg md:text-xl font-light leading-relaxed">
                      To preserve dying crafts, uplift artisan voices, and create fashion that feels timeless, ethical, and soulfully elegant.
                    </p>
                    <div className="absolute -top-6 -left-6 w-16 h-16 border-2 border-black/10"></div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 border-2 border-black/10"></div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="relative w-80 h-80 md:w-96 md:h-96">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse"></div>
                      <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl border-8 border-white group-hover:scale-105 transition-transform duration-700">
                        <img
                          src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600"
                          alt="Mission - Artisan Hands"
                          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="group">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center lg:justify-start">
                  <div className="relative">
                    <div className="relative w-80 h-80 md:w-96 md:h-96">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse"></div>
                      <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl border-8 border-white group-hover:scale-105 transition-transform duration-700">
                        <img
                          src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600"
                          alt="Vision - Traditional Weaving"
                          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="relative bg-white p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-black">
                    <div className="mb-6">
                      <h3 className="text-3xl md:text-4xl font-medium text-black leading-tight">
                        Vision<br />
                      </h3>
                    </div>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-black to-transparent mb-6"></div>
                    <p className="text-gray-700 text-lg md:text-xl font-light leading-relaxed">
                      To craft India's first luxury clothing brand where heritage meets high design, rooted deeply in culture, craft, and community.
                    </p>
                    <div className="absolute -top-6 -left-6 w-16 h-16 border-2 border-black/10"></div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 border-2 border-black/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Drives Us */}
      <section className="py-20 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <div className="text-3xl text-center mb-6">
              <Title text1="WHAT" text2="DRIVES US" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-8 -left-8 text-8xl text-black/10 font-serif">"</div>
            <div className="bg-gradient-to-r from-gray-50 to-transparent p-10 border-l-4 border-black">
              <blockquote className="text-xl md:text-2xl font-light text-black leading-relaxed">
                A simple belief:
                <br /><br />
                <em className="font-light">That fashion should not just look good — it should mean something, honour hands, and carry stories forward.</em>
              </blockquote>
            </div>
            <div className="absolute -bottom-8 -right-8 text-8xl text-black/10 font-serif rotate-180">"</div>
          </div>
        </div>
      </section>

      {/* Artisan Stories */}
      <section className="py-20 px-4 sm:px-8 md:px-10 lg:px-20 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-3xl text-center mb-6">
              <Title text1="ARTISAN" text2="STORIES" />
            </div>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 font-light leading-relaxed">
              Every Aharyas piece is a living memory — crafted by hands that keep tradition alive.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2">
              <div className="relative">
                <img
                  src={assets.mallesh_img}
                  alt="Master Weaver Mallesh Anna"
                  className="w-full h-[500px] object-cover filter transition-all duration-700 shadow-2xl"
                />
                <div className="absolute -top-6 -left-6 w-12 h-12 border border-black/20"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border border-black/20"></div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white shadow-lg p-12 border-l-4 border-black hover:shadow-xl transition-all duration-500">
                <div className="mb-8">
                  <h3 className="text-2xl font-light mb-2 tracking-wider text-black">
                    Meet Mallesh Anna
                  </h3>
                  <div className="w-16 h-0.5 bg-black mb-4"></div>
                  <p className="text-lg text-gray-600 font-light italic">The Heart Behind the Loom</p>
                </div>

                {!showFullStory ? (
                  <>
                    <div className="text-gray-700 font-light leading-relaxed space-y-6">
                      <p>From the weaving town of Pochampally, Mallesh Anna has spent over 40 years breathing life into threads. He began as a young boy, watching his parents tie and dye yarn late into the night, slowly learning that every motif held a meaning and every weave, a memory.</p>
                      <p>Today, at 56, he still rises before dawn, preparing yarns with care and weaving with quiet pride. The journey hasn't been easy—rising costs, fewer buyers—but he never let go of the loom that shaped his life.</p>
                      <p><em>Now a treasured part of the Aharyas family, Mallesh Anna's work is more than craftsmanship… it's legacy. When you wear his weave, you carry a story. His story.</em></p>
                    </div>
                    <button
                      className="mt-8 group flex items-center text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-1"
                      onClick={() => setShowFullStory(true)}
                      aria-expanded={showFullStory}
                    >
                      <span className="tracking-wide">READ FULL STORY</span>
                      <ChevronDown className="ml-3 h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-gray-700 font-light leading-relaxed space-y-6 whitespace-pre-line">
                      <p>In the quiet village lanes of Pochampally, as the world still sleeps, a soft rhythm begins. It's not a song, but a sound, a tap, pull, beat—the sacred hum of a loom guided by hands that have known its music for over 40 years... Those hands belong to Mallesh Anna, a master Ikkat weaver, now 56, whose story is woven deep into the fabric of India's heritage.</p>
                      <p>He learned by watching, small feet by the loom, wide eyes on his parents' weathered fingers as they tied, dyed, and wove stories under lantern light. "Back then, I thought it was magic," he says. "Now I know... it's devotion."</p>
                      <p>Each day, before the sun graces the fields, Mallesh rises. He prepares the yarns with near-meditative precision—from boiling, dyeing, to aligning them into harmony. His eyes have seen thousands of patterns form and fade, yet he remembers each one. "Every motif means something. Some are for love, others for rain, or joy, or sorrow. It's like a language," he says, with a smile that carries both pride and pain.</p>
                      <p>But tradition has not come without its trials... There were years when buyers vanished. When cloth went unsold. When his heart broke seeing fellow weavers give up, sell their looms, and walk away from legacies centuries old. "We kept going… because the loom is not just work. It's who we are."</p>
                      <p>Today, Mallesh Anna weaves not in the shadows, but with new light, as a beloved part of the Aharyas family. His art is no longer a whisper from the past, it is a voice heard by the world. We stand by him, not just as partners, but as custodians of a culture he's spent a lifetime preserving.</p>
                      <p><em>When you wear his work, you wear his childhood, his resilience, his heartbeat. And when you feel the softness of the cloth, know this: It was once just yarn. Now, it's a living memory.</em></p>
                    </div>
                    <button
                      className="mt-8 group flex items-center text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-1"
                      onClick={() => setShowFullStory(false)}
                      aria-expanded={showFullStory}
                    >
                      <span className="tracking-wide">SHOW LESS</span>
                      <ChevronUp className="ml-3 h-4 w-4 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Crafts We Celebrate */}
      <section className="py-20 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-3xl text-center mb-6">
              <Title text1="THE CRAFTS" text2="WE CELEBRATE" />
            </div>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 font-light leading-relaxed">
              Ancient techniques with contemporary expressions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlTzt84KtIPmCvbws6ZqxkME343VJwuealkg&s",
                title: "Ikkat from Pochampally",
                description: "Where threads are dyed before they're woven, creating a beautifully blurred, rhythmic art."
              },
              {
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWwrcUvr9rX9VwZFYDGm-78n_LUjOcDLOwxg&s",
                title: "Kalamkari from Pedana",
                description: "Hand-painted and block-printed stories, each fabric a canvas of myth, memory, and meaning."
              },
              {
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb7Jr4lAecluSZlmlVml77XKR2bst9LesyeA&s",
                title: "Hand Block Printing",
                description: "Carved wooden blocks dipped in earthy dyes, echoing the warmth and detail of desert craftsmanship."
              },
              {
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87LSPNVl8KL6ockU6-Z7y6Gn36CuW2CsMw&s",
                title: "Traditional Embroideries",
                description: "From mirror-studded stitches of Gujarat to the flowing Kantha of Bengal and the vibrant Phulkari of Punjab."
              }
            ].map((craft, index) => (
              <div key={index} className="group">
                <div className="overflow-hidden hover:shadow-lg transition-all duration-500">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={craft.image}
                      alt={craft.title}
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </div>
                  <div className="p-8 bg-white">
                    <h4 className="text-xl font-light mb-4 text-black tracking-wide">{craft.title}</h4>
                    <div className="w-12 h-0.5 bg-black mb-4"></div>
                    <p className="text-gray-600 font-light leading-relaxed">{craft.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={assets.about_img}
            alt="Our Journey Across India"
            className="w-full h-full object-cover filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        </div>
        <div className="relative px-4 sm:px-8 md:px-10 lg:px-20 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-white mb-8">
                OUR <span className="font-medium">JOURNEY</span>
              </h2>
              <p className="text-xl text-white/90 font-light tracking-wide">INTO HANDLOOMS</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-16 shadow-2xl max-w-4xl mx-auto">
              <p> Our journey led us across India—from the looms of Pochampally to the painted fabrics of Pedana, the earthy blocks of Rajasthan, and the delicate embroidery houses of Delhi. We met artisans who welcomed us in, shared their craft, and showed us that every thread carries patience, pride, and generations of history. What we witnessed wasn't just technique—it was tradition kept alive by hand and heart. That journey shaped not just our purpose but the soul of Aharyas. </p>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Map Section */}
      <section className="py-32 bg-gradient-to-b from-stone-50 to-white">
        <div className="px-4 sm:px-8 md:px-10 lg:px-20">
          <IndianMap />
        </div>
      </section>

      {/* Our Policies */}
      <section className="">
        <OurPolicy />
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white to-stone-50">
        <NewsletterBox />
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default About;