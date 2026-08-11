const fs = require('fs');

let content = fs.readFileSync('src/components/CustomerAccountModal.tsx', 'utf8');

if (!content.includes('createPortal')) {
  content = "import { createPortal } from 'react-dom';\n" + content;
  content = content.replace(/return \(\s*(<div className="fixed inset-0[^>]*>[\s\S]*?<\/div>)\s*\);/g, "return createPortal(\n$1,\ndocument.body\n);");
  fs.writeFileSync('src/components/CustomerAccountModal.tsx', content);
  console.log("Updated CustomerAccountModal.tsx");
}

let content2 = fs.readFileSync('src/components/BookOrderModal.tsx', 'utf8');
if (!content2.includes('createPortal')) {
  content2 = "import { createPortal } from 'react-dom';\n" + content2;
  // In BookOrderModal, it's AnimatePresence that wraps it.
  content2 = content2.replace(/return \(\s*(<AnimatePresence>[\s\S]*?<\/AnimatePresence>)\s*\);/g, "return createPortal(\n$1,\ndocument.body\n);");
  fs.writeFileSync('src/components/BookOrderModal.tsx', content2);
  console.log("Updated BookOrderModal.tsx");
}
