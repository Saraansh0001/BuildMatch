// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const remove = (id) => setToasts(t => t.filter(x => x.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 w-80 max-w-[calc(100vw-2.5rem)]">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium
                ${toast.type === 'success'
                  ? 'bg-emerald-950 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950 border-rose-800 text-rose-200'
                }`}
            >
              {toast.type === 'success'
                ? <CheckCircle size={15} className="shrink-0 text-emerald-400" />
                : <AlertCircle size={15} className="shrink-0 text-rose-400" />}
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button onClick={() => remove(toast.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
