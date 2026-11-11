const values = [
  { emoji: '🌱', title: 'Ethically Sourced', desc: 'We partner directly with small-scale farms across Ethiopia, Colombia, and Guatemala.' },
  { emoji: '🔥', title: 'Roasted In-House', desc: 'Every batch is roasted fresh on-site in our open roastery every morning.' },
  { emoji: '❤️', title: 'Community First', desc: 'A portion of every sale supports our local food bank and literacy programs.' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6 overflow-hidden" style={{ backgroundColor: '#fdf8f0' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Visual */}
          <div className="relative">
            {/* Main image card */}
            <div
              className="relative rounded-3xl h-96 overflow-hidden"
              style={{ background: '#4a2e15' }}
            >
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80&auto=format&fit=crop"
                alt="Cozy café interior with warm lighting and wooden tables"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6"
                style={{ background: 'linear-gradient(to top, rgba(44,26,10,0.9), transparent)' }}>
                <p className="text-sm font-medium" style={{ color: '#d4ae78' }}>
                  Est. 2016 · Downtown Corner
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl"
              style={{ backgroundColor: '#f59e0b' }}
            >
              <span className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}>8+</span>
              <span className="text-xs text-center leading-tight px-2" style={{ color: '#4a2e15' }}>Years of Craft</span>
            </div>

            {/* Second accent card */}
            <div
              className="absolute -top-4 -left-4 px-5 py-3 rounded-2xl shadow-lg"
              style={{ backgroundColor: '#2c1a0a', color: '#d4ae78' }}
            >
              <p className="text-xs font-medium">⭐ 4.9 · 2,400+ reviews</p>
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#a86f35' }}>
              Our Story
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
            >
              More Than Coffee —<br />
              <span style={{ color: '#a86f35' }}>It's a Ritual</span>
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#4a2e15' }}>
              Bean &amp; Bloom was born in 2016 from a simple dream: a place where great coffee and
              genuine warmth meet. What started as a tiny 10-seat corner café has grown into a
              beloved community hub.
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: '#4a2e15' }}>
              Every drink is a love letter to the craft — from the moment we select the beans to
              the final pour. We believe coffee is best when it's unhurried, personal, and shared.
            </p>

            {/* Values */}
            <div className="flex flex-col gap-5">
              {values.map((v) => (
                <div key={v.title} className="flex items-start gap-4">
                  <div
                    className="text-xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ backgroundColor: '#f5e9d3' }}
                  >
                    {v.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5" style={{ color: '#2c1a0a' }}>{v.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b4220' }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
