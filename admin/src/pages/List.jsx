import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Package, Edit3, Trash2, Search, Filter, Star, Image as ImageIcon, Upload, X, Save, CheckCircle2, IndianRupee, Grid, List as ListIcon, Tag, Building2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageUpload = ({ id, image, currentImage, setImage, index, onRemove }) => (
  <div className="relative group aspect-square">
    <label
      htmlFor={id}
      className="absolute inset-0 bg-white border-2 border-gray-200 hover:border-black flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300"
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
          </div>
        </>
      ) : currentImage ? (
        <>
          <img src={currentImage} alt={`Current ${id}`} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 p-1">
          <Upload size={16} className="mb-1" />
          <span className="text-xs font-light uppercase tracking-wide leading-tight text-center">Upload</span>
        </div>
      )}
    </label>
    {(image || currentImage) && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-black hover:bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <Trash2 size={11} />
      </button>
    )}
    <input type="file" id={id} hidden onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
  </div>
);

const ProductCard = ({ item, index, onEdit, onRemove, currency }) => (
  <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
    <div className="relative h-60 sm:h-80">
      <img
        src={item.images?.[0] || '/api/placeholder/300/200'}
        alt={item.name}
        className="w-full h-full object-contain"
        onError={(e) => { e.target.src = '/api/placeholder/300/200'; }}
      />
      {item.bestseller && (
        <div className="absolute top-2 left-2 bg-black text-white p-1.5 text-xs font-light uppercase tracking-wider flex items-center gap-1">
          <Star size={11} fill="white" />
        </div>
      )}
      <div className="absolute top-2 right-2 bg-black/80 px-2 py-1">
        <span className="text-xs font-light text-white">#{index + 1}</span>
      </div>
    </div>

    <div className="p-3 sm:p-4">
      <h3 className="font-medium text-gray-900 mb-1.5 line-clamp-2 text-xs sm:text-sm uppercase tracking-wide">{item.name}</h3>

      <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-600 uppercase tracking-wider flex-wrap">
        <Tag size={11} className="text-gray-400 flex-shrink-0" />
        <span className="font-light">{item.category}</span>
        {item.subCategory && (
          <>
            <span className="text-gray-400">•</span>
            <span className="font-light">{item.subCategory}</span>
          </>
        )}
      </div>

      {item.company && item.company !== 'Aharyas' && (
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 size={11} className="text-gray-500 flex-shrink-0" />
          <span className="text-xs text-gray-700 font-medium uppercase tracking-wide truncate">{item.company}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
        <div className="flex items-center gap-0.5">
          <IndianRupee size={14} className="text-black" />
          <span className="font-medium text-black text-base sm:text-lg">{item.price}</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200 transition-all duration-300"
            title="Edit Product"
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => { if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) onRemove(item._id); }}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-300"
            title="Delete Product"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [images, setImages] = useState([null, null, null, null, null, null]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const [companies, setCompanies] = useState(['Vasudhaa Vastrram Vishram', 'Anemone Vinkel']);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);

  const categoryData = {
    Women: {
      subCategories: ["", "Kurtis", "Kurta Sets", "Tops", "Blazers", "Dresses", "Women Co-ord Sets", "Corset tops", "Short-tops", "Women Shirts", "Sarees"],
      sizes: { default: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], "Sarees": [] }
    },
    Men: {
      subCategories: ["", "Men Shirts", "Sleeve Shirts", "Kurtas", "Men Co-ord Sets", "Vests", "Trousers"],
      sizes: { default: ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46'] }
    },
    "Handmade Toys": {
      subCategories: ["", "Kondapalli Bommalu", "Paintings", "Cheriyal Masks", "Bird houses"],
      sizes: { default: [] }
    },
    Stationary: { subCategories: ["", "Journals"], sizes: { default: [] } },
    "Special Product": { subCategories: ["", "Bags"], sizes: { default: [] } }
  };

  const currentCategoryData = editedProduct
    ? (categoryData[editedProduct.category] || { subCategories: [], sizes: { default: [] } })
    : { subCategories: [], sizes: { default: [] } };

  const getCurrentSizes = () => {
    if (!currentCategoryData.sizes) return [];
    if (currentCategoryData.sizes[editedProduct?.subCategory]) return currentCategoryData.sizes[editedProduct.subCategory];
    return currentCategoryData.sizes.default || [];
  };

  const getAvailableSubCategories = () => {
    if (!selectedCategory) return [];
    return categoryData[selectedCategory]?.subCategories.filter(sub => sub !== "") || [];
  };

  const handleAddNewCompany = () => {
    if (newCompanyName.trim() && !companies.includes(newCompanyName.trim())) {
      const updatedCompanies = [...companies, newCompanyName.trim()].sort();
      setCompanies(updatedCompanies);
      setEditedProduct(prev => ({ ...prev, company: newCompanyName.trim() }));
      setNewCompanyName(''); setShowAddCompany(false);
      toast.success(`Company "${newCompanyName.trim()}" added!`);
    } else if (companies.includes(newCompanyName.trim())) {
      toast.error('This company already exists!');
    } else {
      toast.error('Please enter a valid company name.');
    }
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const products = response.data.products || [];
        setList(products); setFilteredList(products);
        const productCompanies = [...new Set(products.filter(p => p.company && p.company !== 'Aharyas').map(p => p.company))];
        setCompanies(prev => [...new Set([...prev, ...productCompanies])].sort());
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(backendUrl + `/api/product/remove/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) { toast.success('Product removed.'); await fetchList(); }
      else toast.error(`Error: ${response.data.message}`);
    } catch (error) {
      toast.error('Error removing product.');
    } finally { setLoading(false); }
  };

  const editProduct = async () => {
    if (!editedProduct.name || !editedProduct.description || !editedProduct.price || !editedProduct.subCategory) {
      toast.error("Please fill in all required fields."); return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('category', editedProduct.category);
      formData.append('subCategory', editedProduct.subCategory);
      formData.append('company', editedProduct.company || 'Aharyas');
      formData.append('bestseller', editedProduct.bestseller);
      formData.append('sizes', JSON.stringify(editedProduct.sizes || []));
      images.forEach((image, index) => { if (image) formData.append(`image${index + 1}`, image); });

      const response = await axios.put(backendUrl + `/api/product/edit/${editedProduct._id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Product updated.'); await fetchList(); closeEditModal();
      } else toast.error(`Error: ${response.data.message}`);
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response) toast.error(`Server Error: ${error.response.data?.message || 'Unable to process.'}`);
      else if (error.request) toast.error('Network Error: Could not connect.');
      else toast.error(`Error: ${error.message}`);
    } finally { setLoading(false); }
  };

  const toggleSize = (size) => {
    setEditedProduct(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size) ? prev.sizes.filter(s => s !== size) : [...(prev.sizes || []), size]
    }));
  };

  const removeImage = (index) => setImages(prev => prev.map((img, i) => i === index ? null : img));

  const closeEditModal = () => {
    setIsEditing(false); setEditedProduct(null);
    setImages([null, null, null, null, null, null]);
    setShowAddCompany(false); setNewCompanyName('');
  };

  const openEditModal = (product) => {
    setEditedProduct({ ...product, company: product.company || '', sizes: product.sizes || [] });
    setImages([null, null, null, null, null, null]);
    setIsEditing(true);
  };

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList.slice(startIndex, endIndex);

  const goToPage = (page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      [1, 2, 3, 4, '...', totalPages].forEach(p => pages.push(p));
    } else if (currentPage >= totalPages - 2) {
      [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages].forEach(p => pages.push(p));
    } else {
      [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages].forEach(p => pages.push(p));
    }
    return pages;
  };

  useEffect(() => {
    let filtered = list;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s) ||
        p.subCategory?.toLowerCase().includes(s) || p.company?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s)
      );
    }
    if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
    if (selectedSubCategory) filtered = filtered.filter(p => p.subCategory === selectedSubCategory);
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [list, searchTerm, selectedCategory, selectedSubCategory]);

  useEffect(() => { fetchList(); }, [token]);

  const uploadedImagesCount = images.filter(img => img !== null).length;
  const currentSizes = getCurrentSizes();

  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-light text-black mb-2 sm:mb-3 tracking-wide uppercase">Product Inventory</h1>
          <div className="w-16 sm:w-20 h-0.5 bg-black mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-light tracking-wide">Manage your product catalog and inventory</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 mb-4 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Search size={18} className="text-gray-600" />
                <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Search & Filter</h2>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-light">{filteredList.length}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Products</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Filters: 1 col mobile, 2 cols sm, 4 cols lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text" placeholder="Search by name, category, company..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Category</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubCategory(''); }}
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none text-sm"
                  >
                    <option value="">All Categories</option>
                    {Object.keys(categoryData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Sub-Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none text-sm disabled:opacity-50"
                    disabled={!selectedCategory}
                  >
                    <option value="">All Sub-Categories</option>
                    {getAvailableSubCategories().map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-600 uppercase tracking-wider font-light">
                {filteredList.length > 0
                  ? `${startIndex + 1}–${Math.min(endIndex, filteredList.length)} of ${filteredList.length}`
                  : '0 products'}
              </div>
              <div className="flex border border-gray-300">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 transition-all duration-300 ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Grid View"><Grid size={15} /></button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 transition-all duration-300 ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="List View"><ListIcon size={15} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 sm:gap-3">
              <Package size={18} className="text-gray-600" />
              <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Product Collection</h2>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 font-light uppercase tracking-wide">Loading products...</span>
                </div>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <Package className="mx-auto text-gray-300 mb-4" size={56} />
                <h3 className="text-lg sm:text-xl font-medium text-black mb-2 uppercase tracking-wide">
                  {list.length === 0 ? "No products found" : "No matching products"}
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto font-light px-4">
                  {list.length === 0 ? "Start by adding your first product" : "Try adjusting your search or filters"}
                </p>
                {(searchTerm || selectedCategory || selectedSubCategory) && (
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSelectedSubCategory(''); }}
                    className="mt-6 px-6 sm:px-8 py-3 bg-black text-white text-sm uppercase tracking-wide font-light hover:bg-gray-800 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {currentItems.map((item, index) => (
                      <ProductCard key={item._id} item={item} index={startIndex + index}
                        onEdit={openEditModal} onRemove={removeProduct} currency={currency} />
                    ))}
                  </div>
                ) : (
                  <div className="border border-gray-200 overflow-hidden">
                    {/* Mobile list cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                      {currentItems.map((item, index) => (
                        <div key={item._id} className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img src={item.images?.[0] || '/api/placeholder/100/100'} alt={item.name}
                                className="w-14 h-14 object-cover border border-gray-200" />
                              {item.bestseller && <Star className="absolute -top-1 -right-1 text-black fill-black" size={12} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 uppercase tracking-wide truncate">{item.name}</p>
                              <p className="text-xs text-gray-500 font-light mt-0.5">{item.category} {item.subCategory ? `· ${item.subCategory}` : ''}</p>
                              <div className="flex items-center justify-between mt-1.5">
                                <div className="flex items-center gap-0.5">
                                  <IndianRupee size={13} className="text-black" />
                                  <span className="font-medium text-black text-sm">{item.price}</span>
                                </div>
                                <div className="flex gap-1.5">
                                  <button onClick={() => openEditModal(item)}
                                    className="p-1.5 border border-gray-200 hover:border-black transition-colors">
                                    <Edit3 size={12} />
                                  </button>
                                  <button onClick={() => { if (window.confirm(`Delete "${item.name}"?`)) removeProduct(item._id); }}
                                    className="p-1.5 border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            {['#', 'Image', 'Product', 'Category', 'Company', 'Price', 'Actions'].map(h => (
                              <th key={h} className={`px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentItems.map((item, index) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-light text-gray-600 text-sm">#{startIndex + index + 1}</td>
                              <td className="px-6 py-4">
                                <div className="relative w-16 h-16">
                                  <img src={item.images?.[0] || '/api/placeholder/100/100'} alt={item.name}
                                    className="w-16 h-16 object-cover border border-gray-200" />
                                  {item.bestseller && <Star className="absolute -top-1 -right-1 text-black fill-black" size={14} />}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <h3 className="font-medium text-gray-900 mb-1 uppercase tracking-wide text-sm">{item.name}</h3>
                                <p className="text-xs text-gray-600 line-clamp-2 font-light">{item.description}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900 text-sm uppercase tracking-wide">{item.category}</div>
                                {item.subCategory && <div className="text-xs text-gray-600 font-light uppercase">{item.subCategory}</div>}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                  <Building2 size={12} className="text-gray-500" />
                                  <span className="text-xs text-gray-700 font-medium uppercase tracking-wide">{item.company || 'Aharyas'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1 font-medium text-black">
                                  <IndianRupee size={14} />{item.price}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button onClick={() => openEditModal(item)}
                                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200 transition-all duration-300" title="Edit">
                                    <Edit3 size={14} />
                                  </button>
                                  <button onClick={() => { if (window.confirm(`Delete "${item.name}"?`)) removeProduct(item._id); }}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-300" title="Delete">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 pt-4 sm:pt-6">
                    <div className="text-xs sm:text-sm text-gray-600 font-light order-2 sm:order-1">
                      Page <span className="font-medium text-black">{currentPage}</span> of <span className="font-medium text-black">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                        className="p-1.5 sm:p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                        <ChevronLeft size={16} />
                      </button>
                      <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`e-${index}`} className="px-2 py-1.5 text-gray-400 text-sm">...</span>
                          ) : (
                            <button key={page} onClick={() => goToPage(page)}
                              className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm border transition-all duration-300 ${currentPage === page ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                              {page}
                            </button>
                          )
                        ))}
                      </div>
                      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                        className="p-1.5 sm:p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 font-light order-3">
                      {filteredList.length} total
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && editedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl my-2 sm:my-0">
              <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Edit3 size={18} className="text-gray-600" />
                  <div>
                    <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Edit Product</h2>
                    <p className="text-xs text-gray-600 font-light uppercase tracking-wider hidden sm:block">Update product information</p>
                  </div>
                </div>
                <button onClick={closeEditModal} className="p-2 text-gray-400 hover:text-black transition-colors" disabled={loading}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); editProduct(); }} className="p-3 sm:p-6 space-y-3 sm:space-y-4">

                {/* Images */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={16} className="text-gray-600" />
                        <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Product Images</h3>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 font-light">{uploadedImagesCount}/6 New</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="aspect-square">
                          <ImageUpload id={`edit-image-${index}`} image={image}
                            currentImage={editedProduct.images?.[index]}
                            setImage={(img) => setImages(prev => prev.map((val, i) => i === index ? img : val))}
                            index={index} onRemove={removeImage} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-600" />
                      <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Product Information</h3>
                    </div>
                  </div>
                  <div className="p-3 sm:p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Product Name *</label>
                      <input value={editedProduct.name}
                        onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Description *</label>
                      <textarea value={editedProduct.description}
                        onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 resize-none text-sm"
                        rows="3" required />
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-600" />
                      <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Brand / Company</h3>
                    </div>
                  </div>
                  <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Select Company</label>
                      <div className="flex gap-2">
                        <select onChange={(e) => setEditedProduct(prev => ({ ...prev, company: e.target.value }))}
                          value={editedProduct.company}
                          className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm">
                          <option value="">Aharyas</option>
                          {companies.map(comp => <option key={comp} value={comp}>{comp}</option>)}
                        </select>
                        <button type="button" onClick={() => setShowAddCompany(true)}
                          className="px-3 sm:px-6 py-2.5 bg-black hover:bg-gray-800 text-white transition-all duration-300 flex items-center gap-1 font-light uppercase tracking-wide text-xs sm:text-sm flex-shrink-0">
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                    {showAddCompany && (
                      <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs sm:text-sm font-medium uppercase tracking-wide text-black">Add New Company</h4>
                          <button type="button" onClick={() => { setShowAddCompany(false); setNewCompanyName(''); }} className="text-gray-400 hover:text-black">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)}
                            placeholder="Enter company name"
                            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-black text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCompany())} />
                          <button type="button" onClick={handleAddNewCompany}
                            className="px-3 sm:px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-light uppercase tracking-wide text-xs sm:text-sm flex-shrink-0">Add</button>
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 border border-gray-100 p-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 size={13} />
                        <span className="text-xs sm:text-sm font-light">Selected: <span className="font-medium">{editedProduct.company || 'Aharyas'}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category & Price */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-600" />
                      <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Category & Pricing</h3>
                    </div>
                  </div>
                  <div className="p-3 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Category *</label>
                        <select value={editedProduct.category}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, category: e.target.value, subCategory: "", sizes: [] }))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm">
                          {Object.keys(categoryData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Sub-Category *</label>
                        <select value={editedProduct.subCategory}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, subCategory: e.target.value }))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm" required>
                          {currentCategoryData.subCategories.map((sub, i) => <option key={i} value={sub}>{sub || "Select"}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2 md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Price ({currency}) *</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                          <input value={editedProduct.price}
                            onChange={(e) => setEditedProduct(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full pl-9 pr-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm"
                            type="number" min="0" step="0.01" required />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                {currentSizes.length > 0 && (
                  <div className="bg-white border border-gray-200 overflow-hidden">
                    <div className="p-3 sm:p-6 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-600" />
                        <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Available Sizes</h3>
                      </div>
                    </div>
                    <div className="p-3 sm:p-6">
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {currentSizes.map(size => (
                          <button key={size} type="button" onClick={() => toggleSize(size)}
                            className={`px-3 sm:px-6 py-2 sm:py-3 border-2 text-xs sm:text-sm font-light uppercase tracking-wide transition-all duration-300 ${editedProduct.sizes?.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-black'}`}>
                            {size}
                          </button>
                        ))}
                      </div>
                      {editedProduct.sizes?.length > 0 && (
                        <div className="bg-green-50 border border-green-200 p-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 size={14} />
                            <span className="text-xs sm:text-sm font-light uppercase tracking-wide">
                              {editedProduct.sizes.length} size{editedProduct.sizes.length !== 1 ? 's' : ''} selected
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bestseller & Actions */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 border border-gray-200">
                      <input type="checkbox" id="edit-bestseller" checked={editedProduct.bestseller}
                        onChange={() => setEditedProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 focus:ring-black flex-shrink-0" />
                      <label htmlFor="edit-bestseller" className="cursor-pointer flex items-center gap-2 text-black font-light uppercase tracking-wide text-xs sm:text-sm">
                        <Star className="text-gray-600 flex-shrink-0" size={15} /> Mark as Bestseller
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
                      <button type="button" onClick={closeEditModal} disabled={loading}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-gray-300 text-black text-sm font-light uppercase tracking-wide hover:border-black transition-all duration-300">
                        Cancel
                      </button>
                      <button type="submit" disabled={loading}
                        className="w-full sm:w-auto sm:ml-auto px-6 sm:px-8 py-3 bg-black text-white text-sm font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                        ) : (
                          <><Save size={15} /> Save Changes</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default List;