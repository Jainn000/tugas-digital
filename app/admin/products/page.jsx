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
          <h2 className="text-2xl font-black uppercase">Paket Layanan, Tiket, & Harga Pokok (HPP)</h2>
          <p className="text-xs font-bold text-neutral-600">
            Kelola paket event organizer, kuota tiket festival, stok sewa alat, dan modal per unit untuk kalkulasi laba kotor.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="nb-btn nb-btn-yellow px-4 py-2 text-xs flex items-center gap-1.5 self-start font-bold"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Tambah Layanan / Tiket
        </button>
      </div>

      {loading ? (
        <div className="nb-card bg-white p-12 text-center">
          <p className="font-bold text-lg">Memuat inventaris produk...</p>
        </div>
      ) : (
        <div className="nb-card bg-white overflow-hidden" data-ui="products-table">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFDF0] border-b-2 border-black font-bold">
                <tr>
                  <th className="p-3 border-r-2 border-black">Foto</th>
                  <th className="p-3 border-r-2 border-black">Nama Layanan / Tiket</th>
                  <th className="p-3 border-r-2 border-black">Kategori</th>
                  <th className="p-3 border-r-2 border-black text-right">Harga Jual</th>
                  <th className="p-3 border-r-2 border-black text-right">HPP (Modal)</th>
                  <th className="p-3 border-r-2 border-black text-right">Margin / Unit</th>
                  <th className="p-3 border-r-2 border-black text-center">Slot / Stok</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-medium">
                {products.map(p => {
                  const margin = p.price - p.cost_price;
                  const marginPct = p.price > 0 ? ((margin / p.price) * 100).toFixed(0) : 0;
                  return (
                    <tr key={p.id} className="border-b-2 border-black hover:bg-neutral-50">
                      <td className="p-3 border-r-2 border-black w-14">
                        <div className="relative w-10 h-10 border-2 border-black bg-white overflow-hidden">
                          {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                        </div>
                      </td>
                      <td className="p-3 border-r-2 border-black font-bold">
                        {p.name}
                        <span className="block text-xs text-neutral-500 font-normal line-clamp-1">
                          {p.description}
                        </span>
                      </td>
                      <td className="p-3 border-r-2 border-black">
                        <span className="nb-tag bg-white text-xs">{p.category_name}</span>
                      </td>
                      <td className="p-3 border-r-2 border-black text-right font-bold">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="p-3 border-r-2 border-black text-right text-neutral-700 font-bold">
                        {formatRupiah(p.cost_price)}
                      </td>
                      <td className="p-3 border-r-2 border-black text-right font-bold text-emerald-800">
                        {formatRupiah(margin)} ({marginPct}%)
                      </td>
                      <td className="p-3 border-r-2 border-black text-center">
                        <span className={`nb-tag text-xs ${p.stock > 5 ? 'bg-[#A3E635]' : 'bg-red-300'}`}>
                          {p.stock} slot
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 border-2 border-black bg-white hover:bg-[#FFE600]"
                            title="Edit"
                            aria-label="Edit produk"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 border-2 border-black bg-white hover:bg-red-500 hover:text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-lg bg-white border-2 border-black p-6 space-y-4" data-ui="product-modal">
            <div className="flex justify-between items-center border-b-2 border-black pb-3">
              <h3 className="font-bold text-lg">
                {editingProduct ? 'Ubah Data Layanan / Tiket' : 'Tambah Layanan / Tiket Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black hover:bg-neutral-200"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-100 border-2 border-black text-xs font-bold text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold block mb-1">Nama Layanan / Tiket *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  placeholder="Contoh: Paket Panggung & Sound Festival 10.000 Watt"
                  className="nb-input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Kategori *</label>
                  <select
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(Number(e.target.value))}
                    className="nb-input w-full text-xs font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Slot / Kuota *</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    required
                    min={0}
                    className="nb-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    required
                    min={0}
                    step={1000}
                    className="nb-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">HPP / Biaya Modal (Rp) *</label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={e => setFormCostPrice(Number(e.target.value))}
                    required
                    min={0}
                    step={1000}
                    className="nb-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">URL Gambar</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="nb-input w-full text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Deskripsi & Fasilitas</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Rundown, kru teknis, perlengkapan rigging..."
                  className="nb-input w-full text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="nb-btn nb-btn-white px-4 py-2 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="nb-btn nb-btn-yellow px-5 py-2 text-xs flex items-center gap-1.5 font-bold"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  {saving ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
