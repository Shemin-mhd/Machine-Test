import React, { createContext, useContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md translate-y-0 opacity-100 animate-slideIn transition-all duration-300 pointer-events-auto
              ${toast.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-500/20 text-emerald-800' 
                : toast.type === 'error' 
                ? 'bg-rose-50/90 border-rose-500/20 text-rose-800' 
                : 'bg-blue-50/90 border-blue-500/20 text-blue-800'
              }
            `}
          >
            
            <div className="flex-shrink-0">
              {toast.type === 'success' && <IoCheckmarkCircle className="w-5 h-5 text-emerald-500" />}
              {toast.type === 'error' && <IoCloseCircle className="w-5 h-5 text-rose-500" />}
              {toast.type === 'info' && <IoInformationCircle className="w-5 h-5 text-blue-500" />}
            </div>

            <p className="text-[14px] font-sans font-medium flex-grow leading-relaxed">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
