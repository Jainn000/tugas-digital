'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatRupiah } from '@/lib/format';
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState(1);
  const [formPrice, setFormPrice] = useState(100000);
  const [formCostPrice, setFormCostPrice] = useState(50000);
  const [formStock, setFormStock] = useState(10);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || 1);
    setFormPrice(15000000);
    setFormCostPrice(8000000);
    setFormStock(5);
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategoryId(p.category_id);
    setFormPrice(p.price);
    setFormCostPrice(p.cost_price);
    setFormStock(p.stock);
    setFormDescription(p.description || '');
    setFormImageUrl(p.image_url || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const payload = {
        name: formName,
        category_id: formCategoryId,
        price: formPrice,
        cost_price: formCostPrice,
        stock: formStock,
        description: formDescription,
        image_url: formImageUrl,
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan paket/tiket.');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.message || 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Hapus item "${name}" dari inventaris?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      alert('Gagal menghapus item.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-semibold text-xl sm:text-2xl text-white">
            Katalog Layanan, Tiket & Modal (HPP)
          </h2>
          <p className="font-inter text-xs text-[#bdbdbd] mt-1">
            Kelola paket event organizer, kuota tiket festival, stok sewa alat, dan modal per unit untuk kalkulasi laba kotor.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan / Tiket</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-12 text-center">
          <div className="w-7 h-7 border-2 border-[#383838] border-t-[#ff6b35] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-inter text-sm text-[#bdbdbd]">Memuat inventaris produk...</p>
        </div>
      ) : (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] overflow-hidden" data-ui="products-table">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-[#8d8d8d] border-b border-[#383838] uppercase font-semibold">
                <tr>
                  <th className="p-3">Foto</th>
                  <th className="p-3">Nama Layanan / Tiket</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3 text-right">Harga Jual</th>
                  <th className="p-3 text-right">HPP (Modal)</th>
                  <th className="p-3 text-right">Margin / Unit</th>
                  <th className="p-3 text-center">Slot / Kuota</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {products.map(p => {
                  const margin = p.price - p.cost_price;
                  const marginPct = p.price > 0 ? ((margin / p.price) * 100).toFixed(0) : 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="p-3 w-14">
                        <div className="relative w-10 h-10 rounded-[4px] border border-[#383838] bg-[#171717] overflow-hidden">
                          {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                        </div>
                      </td>
                      <td className="p-3 text-white">
                        <span className="font-semibold block">{p.name}</span>
                        <span className="text-[11px] text-[#8d8d8d] font-normal line-clamp-1">
                          {p.description}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#171717] border border-[#383838] text-[11px] text-[#bdbdbd]">
                          {p.category_name}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-white">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="p-3 text-right text-[#8d8d8d]">
                        {formatRupiah(p.cost_price)}
                      </td>
                      <td className="p-3 text-right font-semibold text-[#8cd6b0]">
                        {formatRupiah(margin)} ({marginPct}%)
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          p.stock > 5
                            ? 'bg-[#8cd6b0]/15 text-[#8cd6b0] border-[#8cd6b0]/30'
                            : 'bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30'
                        }`}>
                          {p.stock} slot
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-[4px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35] transition-colors"
                            title="Edit"
                            aria-label="Edit produk"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-[4px] bg-[#171717] border border-[#383838] text-[#8d8d8d] hover:text-red-400 hover:border-red-800 transition-colors"
                            title="Hapus"
                            aria-label="Hapus produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-lg bg-[#242424] border border-[#383838] rounded-[12px] p-6 space-y-4 text-white" data-ui="product-modal">
            <div className="flex justify-between items-center border-b border-[#383838] pb-3">
              <h3 className="font-poppins font-semibold text-base text-white">
                {editingProduct ? 'Ubah Data Layanan / Tiket' : 'Tambah Layanan / Tiket Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#8d8d8d] hover:text-white transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-xs text-red-300 rounded-[6px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#8d8d8d]">Nama Layanan / Tiket *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  placeholder="Contoh: Paket Panggung & Sound Festival 10.000 Watt"
                  className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-[#8d8d8d]">Kategori *</label>
                  <select
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(Number(e.target.value))}
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-[#8d8d8d]">Slot / Kuota *</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    required
                    min={0}
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-[#8d8d8d]">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    required
                    min={0}
                    step={1000}
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-[#8d8d8d]">HPP / Modal (Rp) *</label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={e => setFormCostPrice(Number(e.target.value))}
                    required
                    min={0}
                    step={1000}
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#8d8d8d]">URL Gambar</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#8d8d8d]">Deskripsi & Fasilitas</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Rundown, kru teknis, perlengkapan rigging..."
                  className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35] resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-[#383838]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white text-xs font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Data'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
