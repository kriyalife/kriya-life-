const fs = require('fs');

let content = fs.readFileSync('src/components/ProductGrid.tsx', 'utf8');

const newHeading = `<div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6B8E4E] block mb-4">
            Curated Formulations
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#153323] leading-tight">
            Discover Your Ritual
          </h2>
          <p className="text-base text-[#153323]/60 mt-4 max-w-xl mx-auto font-light">
            Elegantly crafted botanical skincare designed to nurture, balance, and restore your skin's natural vitality.
          </p>
        </div>`;

content = content.replace(/<div className="text-center max-w-3xl mx-auto mb-10">[\s\S]*?<\/div>/, newHeading);

const newTabs = `<div className="flex items-center justify-center gap-4 flex-wrap mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={\`cat-filter-tab-\${cat.toLowerCase().replace(/\\s+/g, '-')}\`}
              onClick={() => setSelectedCategory(cat)}
              className={\`px-6 py-2.5 rounded-full text-xs font-medium tracking-widest transition-all uppercase \${
                selectedCategory === cat
                  ? 'bg-[#153323] text-white'
                  : 'bg-transparent text-[#153323]/60 hover:text-[#153323] hover:bg-[#153323]/5'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>`;
content = content.replace(/<div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">[\s\S]*?<\/div>/, newTabs);

fs.writeFileSync('src/components/ProductGrid.tsx', content);
console.log('Fixed ProductGrid');
