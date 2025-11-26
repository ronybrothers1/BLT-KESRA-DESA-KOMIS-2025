import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Recipient, ValidationResult } from '../types';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: Recipient | null;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose, recipient }) => {
  const [inputKK, setInputKK] = useState('');
  const [result, setResult] = useState<ValidationResult>({ status: 'idle', message: '' });

  useEffect(() => {
    if (isOpen) {
      setInputKK('');
      setResult({ status: 'idle', message: '' });
    }
  }, [isOpen]);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) return;

    if (inputKK.trim() === recipient.no_kk) {
      setResult({ status: 'valid', message: 'Data Valid! Nomor KK sesuai dengan database.' });
    } else {
      setResult({ status: 'invalid', message: 'Nomor KK tidak sesuai. Silakan periksa kembali.' });
    }
  };

  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Validasi Data Penerima</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium mb-1">Nama Penerima</p>
            <p className="text-lg font-bold text-gray-800">{recipient.nama}</p>
            <p className="text-xs text-gray-500 mt-1">{recipient.alamat}</p>
          </div>

          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label htmlFor="kk-input" className="block text-sm font-medium text-gray-700 mb-2">
                Masukkan Nomor KK Lengkap
              </label>
              <input
                id="kk-input"
                type="text"
                value={inputKK}
                onChange={(e) => {
                    // Only allow numbers
                    const val = e.target.value.replace(/\D/g, '');
                    setInputKK(val);
                    setResult({ status: 'idle', message: '' });
                }}
                maxLength={16}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-lg tracking-widest text-center font-mono placeholder-gray-300"
                placeholder="3527xxxxxxxxxxxx"
                autoFocus
              />
            </div>

            {/* Validation Result UI */}
            {result.status !== 'idle' && (
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                result.status === 'valid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {result.status === 'valid' ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                <p className="font-medium text-sm">{result.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={inputKK.length < 16}
              className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 ${
                inputKK.length < 16 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/30'
              }`}
            >
              Cek Validasi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;