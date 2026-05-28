import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, X } from 'lucide-react';

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
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-[#e6e8eb] rounded-[2rem] shadow-2xl overflow-hidden p-8 text-center"
        >
          <h3 className="text-[22px] font-extrabold text-[#bc2a25] mb-2 flex justify-center items-center gap-2">
            <span className="text-2xl">⚠️</span> Your Cube is not colored correctly
          </h3>
          <p className="text-[#1d3b5e] font-bold mb-5 text-[15px]">
            You should consider the following:
          </p>
          <ul className="space-y-1.5 mb-6 text-left">
            {errors.map((err, i) => (
              <li key={i} className="bg-gradient-to-r from-[#f4f5f7] to-[#eef0f2] py-2 px-4 rounded-xl text-[#1d3b5e] text-sm font-semibold border-l-[3px] border-[#bc2a25] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                {err}
              </li>
            ))}
          </ul>
          <p className="text-[13px] italic text-[#5a6a80] mb-6 font-medium">
            After fixing the coloring issues press "Solve!" again.
          </p>
          <button onClick={onClose} className="bg-[#f8f9fa] text-[#1d3b5e] font-extrabold py-3 px-12 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)] hover:bg-white transition-all active:scale-95">
            OK
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
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
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-[#e6e8eb] rounded-[2rem] shadow-2xl overflow-hidden p-8 text-center"
        >
          <h3 className="text-[22px] font-extrabold text-[#bc2a25] mb-2 flex justify-center items-center gap-2">
            <span className="text-2xl">🔄</span> Reset Coloring?
          </h3>
          <p className="text-[#1d3b5e] font-bold mb-8 text-[15px]">
            If you continue your current coloring will be lost.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={onClose} className="flex-1 bg-[#f8f9fa] text-[#1d3b5e] font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:bg-white transition-all active:scale-95">
              Cancel
            </button>
            <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 bg-[#f3cece] border border-[#eabfbf] text-[#bc2a25] font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:bg-[#eabfbf] transition-all active:scale-95">
              Reset
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
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
