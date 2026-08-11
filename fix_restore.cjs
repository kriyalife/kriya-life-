const fs = require('fs');
let broken = fs.readFileSync('src/components/CustomerAccountModal.tsx', 'utf8');

// The broken part replaced `return ( ... </div> );` with `return createPortal( ... , document.body );`
// but it matched the first `</div>` !
// Wait, the broken code looks like:
// `return createPortal(<div className="fixed inset-0 ... > \n <div ... > \n <button ... > \n ... \n </button>\n </div>\n ...`

// Let's just rewrite the entire file from my memory + what's remaining.
