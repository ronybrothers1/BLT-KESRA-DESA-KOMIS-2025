import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ShieldCheck, MapPin, Users, ArrowLeft, Building2, AlertTriangle, Info } from 'lucide-react';
import { recipientsData } from './services/data';
import { DusunFilter, Recipient } from './types';
import ValidationModal from './components/ValidationModal';

// Utility to mask KK string
const maskKK = (kk: string) => {
  if (kk.length < 10) return kk;
  const start = kk.substring(0, 6);
  const end = kk.substring(kk.length - 4);
  return `${start}******${end}`;
};

const App: React.FC = () => {
  const [selectedDusun, setSelectedDusun] = useState<DusunFilter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Recipient; direction: 'asc' | 'desc' } | null>(null);
  
  // Validation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  // --- Logic ---
  
  const handleSort = (key: keyof Recipient) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    let data = recipientsData;

    // Filter by Dusun
    if (selectedDusun) {
      data = data.filter(item => item.alamat === selectedDusun);
    }

    // Filter by Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.nama.toLowerCase().includes(lowerTerm) || 
        item.alamat.toLowerCase().includes(lowerTerm)
      );
    }

    // Sorting
    if (sortConfig) {
      data = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [selectedDusun, searchTerm, sortConfig]);

  const openValidation = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setIsModalOpen(true);
  };

  // --- Views ---

  const renderHeader = () => (
    <header className="bg-brand-900 text-white shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[length:24px_24px]"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
               <Users size={40} className="text-brand-300" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-brand-200 text-xs md:text-sm font-semibold tracking-widest uppercase mb-1">Gerakan Masyarakat Sipil</h2>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">PEMUDA PEDULI TRANSPARANSI DESA (PPTD)</h1>
              <p className="text-brand-100 text-sm md:text-base opacity-90 mb-3">Kawal Data BLT Kesra Desa Komis, Kec. Kedungdung</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-400/30 backdrop-blur-sm">
                <Info size={14} className="text-red-200" />
                <span className="text-xs font-medium text-red-100">Bukan situs resmi Pemerintah Desa atau Kabupaten</span>
              </div>
            </div>
          </div>
        </div>
    </header>
  );

  const renderImportantNotice = () => (
    <div className="container mx-auto px-4 mt-8 mb-4">
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-full shrink-0">
             <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">
              CATATAN PENTING
            </h3>
            <div className="text-amber-800 space-y-2 text-sm md:text-base leading-relaxed">
              <p>
                Transparansi data adalah prioritas kami. 
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Bagi Masyarakat:</strong> Jika Anda merasa berhak namun belum menerima haknya atau belum tercantum dalam daftar ini, silahkan melakukan konfirmasi langsung ke <strong>Pemerintah Desa Komis</strong>.
                </li>
                <li>
                  <strong>Pelaporan Pelanggaran:</strong> Jika ditemukan adanya nama fiktif atau data yang tidak sesuai, silahkan melaporkan hal tersebut kepada <strong>Pihak yang Berwajib</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDusunSelector = () => (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pilih Wilayah Dusun</h2>
        <p className="text-gray-500">Silakan pilih dusun untuk melihat daftar penerima bantuan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[DusunFilter.KOMIS, DusunFilter.TOTONGAN, DusunFilter.DUKO, DusunFilter.MALAKAH].map((dusun) => (
          <button
            key={dusun}
            onClick={() => setSelectedDusun(dusun)}
            className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-brand-200 transition-all duration-300 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
               <MapPin size={80} className="text-brand-800" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500 transition-colors duration-300">
                <Users size={24} className="text-brand-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-brand-700">{dusun}</h3>
              <p className="text-sm text-gray-500 group-hover:text-brand-600/80">Lihat Daftar Penerima →</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <button 
        onClick={() => {
            setSelectedDusun(null);
            setSearchTerm('');
        }}
        className="flex items-center text-gray-500 hover:text-brand-600 mb-6 transition-colors font-medium group"
      >
        <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Kembali ke Pilihan Dusun
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedDusun}</h2>
            <p className="text-gray-500 text-sm mt-1">Total {filteredData.length} Penerima Terdaftar</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama penerima..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">No</th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('nama')}
                >
                  <div className="flex items-center gap-2">
                    Nama Penerima
                    {sortConfig?.key === 'nama' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nomor KK (Disamarkan)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Alamat
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.nama}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono text-sm">
                        {maskKK(item.no_kk)}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.alamat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openValidation(item)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 hover:border-brand-300 transition-all shadow-sm hover:shadow active:scale-95"
                      >
                        <ShieldCheck size={16} />
                        Validasi
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Data tidak ditemukan</p>
                      <p className="text-sm">Coba kata kunci pencarian lain.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
             <span>Menampilkan {filteredData.length} data</span>
             <span>Privasi Terlindungi: Nomor KK disamarkan sesuai UU PDP</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {renderHeader()}
      
      <main className="flex-grow bg-slate-50 pb-12">
        {selectedDusun ? renderTableView() : renderDusunSelector()}
        
        {/* Important Notice displayed at the bottom of the main content area */}
        {renderImportantNotice()}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-brand-900 font-bold mb-2 tracking-wide">PEMUDA PEDULI TRANSPARANSI DESA (PPTD)</p>
          <p className="text-gray-500 text-sm mb-4 max-w-2xl mx-auto">
             Inisiatif independen untuk mewujudkan transparansi dan keadilan data bantuan sosial di Desa Komis.
             Data bersumber dari hasil investigasi dan dokumen publik.
          </p>
          <div className="text-xs text-gray-400">
            <p className="mb-1">Disclaimer: Website ini tidak dikelola oleh Pemerintah Desa Komis maupun Pemerintah Kabupaten Sampang.</p>
            <p>© {new Date().getFullYear()} PPTD. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>

      <ValidationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipient={selectedRecipient}
      />
    </div>
  );
};

export default App;