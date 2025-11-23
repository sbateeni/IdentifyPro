
import React, { useEffect, useState } from 'react';
import { X, Clock, Trash2, FileText, ChevronRight } from 'lucide-react';
import { HistoryRecord } from '../types';
import { getHistory, deleteHistoryItem } from '../services/db';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: HistoryRecord) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, onSelectRecord }) => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      // Sort by newest first
      setRecords(data.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      await deleteHistoryItem(id);
      await loadHistory();
    }
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(ts));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            سجل العمليات
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-400">جاري التحميل...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center text-slate-400">
              <FileText className="w-10 h-10 mb-2 opacity-50" />
              <p>لا توجد سجلات محفوظة</p>
            </div>
          ) : (
            records.map((record) => (
              <div 
                key={record.id}
                onClick={() => { onSelectRecord(record); onClose(); }}
                className="group relative bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${record.result.finalResult.isMatch ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    تطابق: {record.result.finalResult.matchScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDate(record.timestamp)}
                  </span>
                </div>
                
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="truncate">📂 {record.file1Name}</div>
                  <div className="truncate">📂 {record.file2Name}</div>
                </div>

                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-5 h-5 text-indigo-400" />
                </div>

                <button 
                  onClick={(e) => handleDelete(e, record.id!)}
                  className="absolute bottom-3 left-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
