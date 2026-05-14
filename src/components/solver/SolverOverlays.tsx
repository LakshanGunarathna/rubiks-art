import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-gray-100/50 border border-[var(--glass-border)] backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              {title && <h3 className="text-xl font-bold text-[var(--text-primary)]">{title}</h3>}
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors text-[var(--text-secondary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const ErrorModal: React.FC<{ isOpen: boolean; onClose: () => void; errors: string[] }> = ({ isOpen, onClose, errors }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Validation Errors">
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-red-500">
        <AlertCircle className="w-6 h-6" />
        <span className="font-semibold text-lg">Please check your cube</span>
      </div>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar text-[var(--text-primary)] font-medium">
        {errors.map((err, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-red-500 mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" />
            <span>{err}</span>
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="w-full py-3 mt-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg active:scale-95">
        Close
      </button>
    </div>
  </Modal>
);

export const SolvedModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Cube Solved">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mb-2">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      <h4 className="text-xl font-bold text-[var(--text-primary)]">Great news!</h4>
      <p className="text-[var(--text-primary)] font-medium">Your cube is already solved!</p>
      <button onClick={onClose} className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg active:scale-95">
        Excellent
      </button>
    </div>
  </Modal>
);

export const ResetConfirmation: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void }> = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Reset Colors?">
    <div className="flex flex-col gap-4">
      <p className="text-[var(--text-primary)] font-medium">This will clear all painted colors and reset the cube. Are you sure you want to continue?</p>
      <div className="flex gap-3 mt-4">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 text-[var(--text-primary)] font-bold transition-all">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg active:scale-95">
          Reset Now
        </button>
      </div>
    </div>
  </Modal>
);

export const LoadingOverlay: React.FC<{ isOpen: boolean; onCancel: () => void }> = ({ isOpen, onCancel }) => (
  <Modal isOpen={isOpen} onClose={onCancel} title="Finding Solution">
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Solving</span>
        </motion.div>
      </div>
      <div className="text-center">
        <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">Calculating Solution</h4>
        <p className="text-[var(--text-primary)] opacity-70 text-sm font-medium">Mapping the fastest path to solve...</p>
      </div>
      <button
        onClick={onCancel}
        className="w-full py-3 rounded-xl border border-[var(--glass-border)] bg-white bg-opacity-5 hover:bg-opacity-10 text-[var(--text-primary)] text-sm font-bold transition-all"
      >
        Cancel Solve
      </button>
    </div>
  </Modal>
);
