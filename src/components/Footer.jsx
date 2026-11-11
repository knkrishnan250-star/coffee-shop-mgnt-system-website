const links = {
  Explore: ['Menu', 'Featured', 'About', 'Reviews'],
  Visit: ['Location & Hours', 'Reserve a Table', 'Private Events', 'Catering'],
  Connect: ['Instagram', 'Facebook', 'TikTok', 'Newsletter'],
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2c1a0a', color: '#d4ae78' }}>
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">☕</span>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: '#fdf8f0' }}
              >
                Bean &amp; Bloom
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#8b5a2b' }}>
              Where every cup tells a story. Crafting moments of warmth since 2016.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {['📸', '👍', '🎵', '🐦'].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: '#4a2e15' }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4
                className="text-sm font-semibold tracking-widest uppercase mb-5"
                style={{ color: '#a86f35' }}
              >
                {section}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: '#8b5a2b' }}
                      onMouseEnter={(e) => (e.target.style.color = '#d4ae78')}
                      onMouseLeave={(e) => (e.target.style.color = '#8b5a2b')}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="mt-14 p-8 rounded-3xl"
          style={{ backgroundColor: '#4a2e15' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif", color: '#fdf8f0' }}
              >
                Get Weekly Specials
              </h3>
              <p className="text-sm" style={{ color: '#a86f35' }}>
                Seasonal menus, events & exclusive offers — straight to your inbox.
              </p>
            </div>
            <form
              className="flex gap-2 w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-56 px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ backgroundColor: '#2c1a0a', color: '#fdf8f0', border: '1px solid #6b4220' }}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#f59e0b', color: '#2c1a0a' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-6 py-5"
        style={{ borderColor: '#4a2e15' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: '#6b4220' }}>
            © 2024 Bean &amp; Bloom. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: '#6b4220' }}
                onMouseEnter={(e) => (e.target.style.color = '#a86f35')}
                onMouseLeave={(e) => (e.target.style.color = '#6b4220')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
