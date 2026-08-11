import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  return (
    <div id="toast-notifications-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="pointer-events-auto bg-[#153323] text-[#FAFCFA] p-4 rounded-xl shadow-2xl border border-[#8BAA91]/30 flex items-start gap-3 relative overflow-hidden"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-sky-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-[#8BAA91]" />
              )}
            </div>
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm tracking-wide text-white">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-[#D1E0D4] mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#D1E0D4] hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2C523B] via-[#8BAA91] to-[#3A5A40]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
