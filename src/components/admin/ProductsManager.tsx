import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Check, Package, Sparkles, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, Category } from '../../types';
import { ImageWithFallback } from '../ImageWithFallback';
import { supabase } from '../../lib/supabaseClient';

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string' && reader.result.length > 0) {
        resolve(reader.result);
      } else {
        resolve('https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800');
      }
    };
    reader.onerror = () => resolve('https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800');
    reader.readAsDataURL(file);
  });
};
import { adminServices } from '../../lib/adminServices';

export const ProductsManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal State for Delete Confirmation
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'Face Cleansers' as Category,
    price: '',
    originalPrice: '',
    volume: '30g',
    description: '',
    inStock: true,
    isBestseller: false,
    isOrganic: true,
    isNew: false,
    imageUrl: 'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800',
  });

  const categories: string[] = ['All', 'Face Cleansers', 'Moisturizers & Creams', 'Combos & Kits'];

  const filteredProducts = products.filter((prod) => {
    const prodName = prod?.name || '';
    const prodId = prod?.id || '';
    const prodCat = prod?.category || '';
    const query = (searchQuery || '').toLowerCase();

    const matchesSearch =
      prodName.toLowerCase().includes(query) ||
      prodId.toLowerCase().includes(query) ||
      prodCat.toLowerCase().includes(query);

    const matchesCategory = selectedCategory === 'All' || prodCat === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      tagline: 'Handcrafted Organic Formulation',
      category: 'Face Cleansers',
      price: '',
      originalPrice: '',
      volume: '30g',
      description: '',
      inStock: true,
      isBestseller: false,
      isOrganic: true,
      isNew: true,
      imageUrl: 'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800',
    });
    setFiles([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      tagline: product.tagline || '',
      category: product.category || 'Face Cleansers',
      price: product.price !== undefined && product.price !== null ? String(product.price) : '',
      originalPrice: product.originalPrice !== undefined && product.originalPrice !== null ? String(product.originalPrice) : '',
      volume: product.volume || '30g',
      description: product.description || '',
      inStock: product.inStock !== false,
      isBestseller: Boolean(product.isBestseller),
      isOrganic: Boolean(product.isOrganic),
      isNew: Boolean(product.isNew),
      imageUrl: product.images?.[0] || 'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800',
    });
    setIsModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!deletingProduct) return;

    try {
      deleteProduct(deletingProduct.id);
      // Attempt Supabase deletion asynchronously
      adminServices.deleteProduct(deletingProduct.id).catch(() => {});
    } catch (err: any) {
      console.error('Error deleting product:', err);
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      showToast('Validation Error', 'Product name and price are required.', 'warning');
      return;
    }

    const numericPrice = parseFloat(formData.price) || 0;
    const numericOriginalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;

    let mediaUrls: string[] = formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [];
    
    // Upload files to Supabase Storage with local data URL fallback
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const uploadedUrls: string[] = [];
        let completed = 0;
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          
          let fileUrl = '';
          try {
            const name = `${Date.now()}${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(file.name);
            const bucketName = isVideo ? 'products-videos' : 'products-images';

            const { error } = await supabase.storage
              .from(bucketName)
              .upload(name, file);

            if (!error) {
              const publicUrl = supabase.storage.from(bucketName).getPublicUrl(name).data.publicUrl;
              if (publicUrl) {
                fileUrl = publicUrl;
              }
            } else {
              // Try fallback bucket 'products'
              const { error: err2 } = await supabase.storage
                .from('products')
                .upload(name, file);
              if (!err2) {
                fileUrl = supabase.storage.from('products').getPublicUrl(name).data.publicUrl;
              } else {
                console.warn(`Storage upload notice for ${bucketName} (falling back to local media URL):`, error.message || error);
              }
            }
          } catch (storageErr) {
            console.warn("Storage upload exception (falling back to local media URL):", storageErr);
          }

          if (!fileUrl) {
            fileUrl = await readFileAsDataUrl(file);
          }

          if (fileUrl) {
            uploadedUrls.push(fileUrl);
          }

          completed++;
          setUploadProgress(Math.round((completed / files.length) * 100));
        }
        mediaUrls = uploadedUrls.length > 0 ? uploadedUrls : mediaUrls;
      } catch (err) {
        console.warn("Error processing file upload, fallback active:", err);
      }
      setIsUploading(false);
      setUploadProgress(0);
    }

    if (mediaUrls.length === 0) {
      mediaUrls = ['https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800'];
    }

    if (editingProduct) {
      const updatedFields: Partial<Product> = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: formData.category,
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        volume: formData.volume.trim() || '50 ml',
        description: formData.description.trim() || `${formData.name} - Botanical luxury formulation.`,
        inStock: formData.inStock,
        isBestseller: formData.isBestseller,
        isOrganic: formData.isOrganic,
        isNew: formData.isNew,
        images: mediaUrls,
        media: mediaUrls.map(url => ({ 
          type: url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image', 
          src: url 
        }))
      };

      updateProduct(editingProduct.id, updatedFields);
      
      try {
        await adminServices.updateProduct(editingProduct.id, {
          name: formData.name.trim(),
          slug: formData.name.trim().toLowerCase().replace(/\s+/g, '-'),
          price: numericPrice,
          stock_quantity: formData.inStock ? 50 : 0,
          is_active: formData.inStock,
          description: formData.description.trim()
        }, mediaUrls);
      } catch (e) {
        console.warn("Could not sync with Supabase products table", e);
      }

    } else {
      const newProductData = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: formData.category,
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        volume: formData.volume.trim() || '50 ml',
        description: formData.description.trim() || `${formData.name} - Botanical luxury formulation.`,
        inStock: formData.inStock,
        isBestseller: formData.isBestseller,
        isOrganic: formData.isOrganic,
        isNew: formData.isNew,
        images: mediaUrls,
        media: mediaUrls.map(url => ({ 
          type: url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image', 
          src: url 
        })),
        ingredients: ['Kumkumadi Oil', 'Saffron Extract', 'Rose Water'],
        howToUse: 'Apply a few drops onto cleansed skin. Massage gently until fully absorbed.',
        skinTypes: ['All Skin Types'],
      };

      const added = addProduct(newProductData);
      
      try {
         await adminServices.createProduct({
           name: newProductData.name,
           slug: newProductData.name.toLowerCase().replace(/\s+/g, '-'),
           price: newProductData.price,
           stock_quantity: newProductData.inStock ? 50 : 0,
           is_active: newProductData.inStock,
           description: newProductData.description
         }, mediaUrls);
      } catch (e) {
         console.warn("Could not sync with Supabase products table", e);
      }
    }

    setIsModalOpen(false);
  };
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Product Catalog</h1>
          <p className="text-sm text-emerald-100/70 mt-1">
            Manage your store catalog, pricing, and stock status ({products.length} items total).
          </p>
        </div>
        <button
          id="add-product-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col text-white">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center gap-4 bg-stone-950/60">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by name, category, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-900 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-stone-900 border border-white/20 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-stone-900 text-white">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-950 border-b border-white/10 text-emerald-300 font-medium">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Volume</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-emerald-100/60">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
                    <p className="font-medium text-white">No products found</p>
                    <p className="text-xs text-emerald-100/60 mt-1">Try adjusting your search query or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={prod.image || prod.images?.[0]}
                          fallbackSrc='https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=200'
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0 bg-stone-950"
                        />
                        <div>
                          <div className="font-semibold text-white">{prod.name}</div>
                          <div className="text-xs text-emerald-300 font-mono">{prod.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {prod.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-emerald-300">₹{prod.price.toLocaleString('en-IN')}</div>
                      {prod.originalPrice && (
                        <div className="text-xs text-emerald-100/50 line-through">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-emerald-100/80">{prod.volume || '50 ml'}</td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer border ${
                          prod.inStock
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                            : 'bg-rose-950 text-rose-300 border-rose-500/40 hover:bg-rose-900'
                        }`}
                        title="Click to toggle stock status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${prod.inStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          title="Edit product"
                          className="p-2 text-emerald-100/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(prod)}
                          title="Delete product"
                          className="p-2 text-emerald-100/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/20 text-white">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2.5 bg-rose-950/80 rounded-xl border border-rose-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Delete Product</h3>
            </div>
            <p className="text-sm text-emerald-100/80 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">"{deletingProduct.name}"</span>? This action will remove it from the catalog.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Premium Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative bg-stone-900 rounded-3xl max-w-xl w-full max-h-[85vh] sm:max-h-[90vh] my-auto flex flex-col shadow-2xl border border-white/20 overflow-hidden text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-stone-950 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    KRIYA CATALOG
                  </span>
                  <h2 className="text-xl font-serif font-bold text-white leading-tight">
                    {editingProduct ? 'Edit Botanical Product' : 'Add New Product'}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-emerald-100/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form id="product-modal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-white">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayurvedic Kumkumadi Tailam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 font-medium text-white placeholder-white/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 font-medium text-white"
                  >
                    <option value="Face Cleansers" className="bg-stone-900 text-white">Face Cleansers</option>
                    <option value="Moisturizers & Creams" className="bg-stone-900 text-white">Moisturizers & Creams</option>
                    <option value="Combos & Kits" className="bg-stone-900 text-white">Combos & Kits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                    Volume / Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 ml / 100g"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white placeholder-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step="1"
                    placeholder="1299"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 font-semibold text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                    Original Price (₹) <span className="text-emerald-100/50 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="1599"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white placeholder-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% Pure Botanical Formulation"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white placeholder-white/40"
                />
              </div>

                            <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                  Product Media (Images & Videos)
                </label>
                <div 
                  className="w-full border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center bg-stone-950/60 hover:bg-stone-950 hover:border-emerald-400 transition-colors cursor-pointer group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) {
                      const droppedFiles = Array.from(e.dataTransfer.files);
                      if (files.length + droppedFiles.length > 5) {
                        showToast('Limit Reached', 'Max 5 files allowed', 'warning');
                        return;
                      }
                      setFiles(prev => [...prev, ...droppedFiles]);
                    }
                  }}
                  onClick={() => document.getElementById('media-upload')?.click()}
                >
                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const selectedFiles = Array.from(e.target.files);
                        if (files.length + selectedFiles.length > 5) {
                          showToast('Limit Reached', 'Max 5 files allowed', 'warning');
                          return;
                        }
                        setFiles(prev => [...prev, ...selectedFiles]);
                      }
                    }}
                  />
                  <div className="p-3 bg-stone-900 rounded-full border border-white/10 mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-white">Drag & drop files or click to browse</p>
                  <p className="text-[11px] text-emerald-100/60 mt-1 uppercase tracking-wider font-medium">Images & Videos (Max 5)</p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] font-bold uppercase text-emerald-200 mb-2">{files.length} File{files.length !== 1 && 's'} Selected</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {files.map((file, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 group shadow-sm">
                          {file.type.startsWith('image') ? (
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFiles(files.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-rose-400 hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-emerald-200 mb-1">
                      <span>Uploading media...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed botanical product description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none bg-stone-950 text-white placeholder-white/40"
                />
              </div>

              {/* Toggles Styled as Cards */}
              <div className="pt-2 space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/70 mb-2">
                  Product Badges & Attributes
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${formData.inStock ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-200' : 'border-white/15 bg-stone-950/50 text-emerald-100/60'}`}>
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-400 focus:ring-emerald-400 border-white/20"
                    />
                    <span className="text-xs font-bold">In Stock</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${formData.isBestseller ? 'border-amber-500/50 bg-amber-950/80 text-amber-200' : 'border-white/15 bg-stone-950/50 text-emerald-100/60'}`}>
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 border-white/20"
                    />
                    <span className="text-xs font-bold">Bestseller Badge</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${formData.isOrganic ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-200' : 'border-white/15 bg-stone-950/50 text-emerald-100/60'}`}>
                    <input
                      type="checkbox"
                      checked={formData.isOrganic}
                      onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-400 focus:ring-emerald-400 border-white/20"
                    />
                    <span className="text-xs font-bold">100% Natural</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${formData.isNew ? 'border-indigo-500/50 bg-indigo-950/80 text-indigo-200' : 'border-white/15 bg-stone-950/50 text-emerald-100/60'}`}>
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-400 focus:ring-indigo-400 border-white/20"
                    />
                    <span className="text-xs font-bold">Sale Badge</span>
                  </label>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-stone-950 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-3 border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-modal-form"
                disabled={isUploading}
                className={`px-6 py-3 ${isUploading ? 'bg-stone-700' : 'bg-emerald-500 hover:bg-emerald-400'} text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer`}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4 text-stone-950" />
                )}
                <span>{isUploading ? 'Uploading...' : (editingProduct ? 'Save Changes' : 'Create Product')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
