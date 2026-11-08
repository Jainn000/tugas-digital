'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Box, PlusCircle, Search, Edit3, Trash2, ArrowLeft, 
  CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, X 
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';
import { formatRupiah } from '@/lib/format';

export default function VendorStockPage() {
  const toast = useToast();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Lighting');
  const [totalQty, setTotalQty] = useState('');
  const [availableQty, setAvailableQty] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [status, setStatus] = useState('available');

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/vendor/stock');
      const data = await res.json();
      if (data.items) setStock(data.items);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!name.trim() || !totalQty) {
      toast.error('Nama peralatan dan jumlah total wajib diisi.', 'Input Kurang');
      return;
    }

    try {
      if (editingItem) {
        // Edit existing
        const res = await fetch('/api/vendor/stock', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            available_qty: Number(availableQty),
            status,
          }),
        });
        if (res.ok) {
          toast.success(`Stok ${name} berhasil diperbarui.`, 'Berhasil');
          setEditingItem(null);
          fetchStock();
        }
      } else {
        // Add new
        const res = await fetch('/api/vendor/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            category,
            total_qty: Number(totalQty),
            daily_rate: Number(dailyRate) || 250000,
          }),
        });
        if (res.ok) {
          toast.success(`Alat ${name} berhasil didaftarkan.`, 'Item Ditambahkan');
          setIsAddModalOpen(false);
          setName('');
          setTotalQty('');
          setDailyRate('');
          fetchStock();
        }
      }
    } catch (err) {
      toast.error('Gagal menyimpan data stok.', 'Error');
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setTotalQty(item.total_qty);
    setAvailableQty(item.available_qty);
    setDailyRate(item.daily_rate || 250000);
    setStatus(item.status);
  };

  const filteredItems = stock.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6" data-ui="vendor-stock">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/vendor" className="text-[#8d8d8d] hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-poppins font-bold text-2xl text-white">
              Stock Management
            </h1>
          </div>
          <p className="font-inter text-xs text-[#8d8d8d] mt-1 ml-6">
            Inventori peralatan sound, lighting, rigging, LED, dan genset vendor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setName('');
            setTotalQty('');
            setDailyRate('');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 rounded-[8px] bg-[#ff6b35] text-[#171717] font-semibold text-xs flex items-center gap-2 hover:bg-[#e5531e] transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Peralatan Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[10px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8d8d8d]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama alat / kategori..."
            className="w-full bg-[#121212] border border-[#333333] rounded-[6px] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#ff6b35]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Lighting', 'Audio', 'Rigging', 'Visual', 'Power'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-[#242424] text-[#bdbdbd] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#bdbdbd]">
            <thead>
              <tr className="border-b border-[#2e2e2e] bg-[#161616] text-[#8d8d8d] text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-4 font-medium">Nama Alat & Kategori</th>
                <th className="p-4 font-medium">Total Unit</th>
                <th className="p-4 font-medium">Tersedia (Ready)</th>
                <th className="p-4 font-medium">Tarif Sewa / Hari</th>
                <th className="p-4 font-medium">Status Kesiapan</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8d8d8d]">
                    Memuat inventori...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8d8d8d]">
                    Tidak ada peralatan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#202020] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[6px] bg-[#242424] border border-[#333333] flex items-center justify-center text-[#ff6b35] shrink-0">
                          <Box className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{item.name}</span>
                          <span className="text-[11px] text-[#8d8d8d]">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {item.total_qty} Unit
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        item.available_qty === 0 ? 'text-[#e53935]' : item.available_qty <= 3 ? 'text-[#e9c47d]' : 'text-[#8cd6b0]'
                      }`}>
                        {item.available_qty} Unit
                      </span>
                    </td>
                    <td className="p-4 text-white">
                      {formatRupiah(item.daily_rate || 250000)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'out_of_stock'
                          ? 'bg-red-950/60 text-red-400 border border-red-800'
                          : item.status === 'low_stock'
                          ? 'bg-[#393224] text-[#e9c47d] border border-[#e9c47d]/40'
                          : 'bg-[#23372d] text-[#8cd6b0] border border-[#8cd6b0]/40'
                      }`}>
                        {item.status === 'out_of_stock' ? 'Out of Stock' : item.status === 'low_stock' ? 'Low Stock' : 'Available'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#333333] text-[#bdbdbd] hover:text-white transition-colors text-[11px] font-medium"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT STOCK ITEM */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-md bg-[#1e1e1e] border border-[#383838] rounded-[12px] p-6 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-[#2e2e2e] pb-3">
              <h3 className="font-poppins font-semibold text-base text-white">
                {editingItem ? 'Update Stok Alat' : 'Tambah Peralatan Inventori'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-[#8d8d8d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[#8d8d8d]">Nama Peralatan</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Smoke Hazzer Machine 1500W"
                  required
                  disabled={Boolean(editingItem)}
                  className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35] disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#8d8d8d]">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={Boolean(editingItem)}
                    className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-2.5 py-2 text-white focus:outline-none focus:border-[#ff6b35] disabled:opacity-60"
                  >
                    <option value="Lighting">Lighting</option>
                    <option value="Audio">Audio</option>
                    <option value="Rigging">Rigging</option>
                    <option value="Visual">Visual & LED</option>
                    <option value="Power">Power & Genset</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#8d8d8d]">Tarif Sewa / Hari (IDR)</label>
                  <input
                    type="number"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    placeholder="350000"
                    disabled={Boolean(editingItem)}
                    className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35] disabled:opacity-60"
                  />
                </div>
              </div>

              {editingItem ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#8d8d8d]">Unit Tersedia (Ready)</label>
                    <input
                      type="number"
                      value={availableQty}
                      onChange={(e) => setAvailableQty(e.target.value)}
                      required
                      className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8d8d8d]">Status Stok</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-2.5 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="available">Available</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[#8d8d8d]">Jumlah Unit Total</label>
                  <input
                    type="number"
                    value={totalQty}
                    onChange={(e) => setTotalQty(e.target.value)}
                    placeholder="Contoh: 12"
                    required
                    className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-[#2e2e2e]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-[#242424] text-[#bdbdbd] rounded-[6px] text-xs hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff6b35] text-[#171717] font-semibold rounded-[6px] text-xs hover:bg-[#e5531e]"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Alat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
