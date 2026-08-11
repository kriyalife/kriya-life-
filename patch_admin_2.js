const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Insert useNavigate hook
content = content.replace('const { showToast } = useShop();', 'const { showToast, setCurrentView } = useShop();\n  const navigate = useNavigate();');

// Add the back button to the login form
const targetHtml = `<div className="min-h-screen bg-[#FAFCFA] flex items-center justify-center p-4">`;
const replacementHtml = `<div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center p-4">
        <button 
          onClick={() => { setCurrentView('home'); navigate('/'); }}
          className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-stone-500 hover:text-[#153323] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Store</span>
        </button>`;

content = content.replace(targetHtml, replacementHtml);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
