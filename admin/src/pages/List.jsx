import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Package, Edit3, Trash2, Search, Filter, Star, Image as ImageIcon, Upload, X, Save, CheckCircle2, IndianRupee, Grid, List as ListIcon, Tag, Building2, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageUpload = ({ id, image, currentImage, setImage, index, onRemove }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="w-full h-full bg-white border-2 border-gray-200 hover:border-black flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300"
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
          </div>
        </>
      ) : currentImage ? (
        <>
          <img src={currentImage} alt={`Current ${id}`} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Upload size={24} className="mb-2" />
          <span className="text-xs font-light uppercase tracking-wide">Upload</span>
        </div>
      )}
    </label>
    {(image || currentImage) && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-black hover:bg-red-600 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <Trash2 size={14} />
      </button>
    )}
    <input
      type="file"
      id={id}
      hidden
      onChange={(e) => setImage(e.target.files[0])}
      accept="image/*"
    />
  </div>
);

const ProductCard = ({ item, index, onEdit, onRemove, currency }) => (
  <div className="bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
    <div className="relative h-80">
      <img
        src={item.images?.[0] || '/api/placeholder/300/200'}
        alt={item.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.target.src = '/api/placeholder/300/200';
        }}
      />
      {item.bestseller && (
        <div className="absolute top-3 left-3 bg-black text-white p-2 text-xs font-light uppercase tracking-wider flex items-center gap-1">
          <Star size={12} fill="white" />
        </div>
      )}
      <div className="absolute top-3 right-3 bg-black/80 px-2 py-1">
        <span className="text-xs font-light text-white">#{index + 1}</span>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm uppercase tracking-wide">{item.name}</h3>

      <div className="flex items-center gap-2 mb-3 text-xs text-gray-600 uppercase tracking-wider">
        <Tag size={12} className="text-gray-400" />
        <span className="font-light">{item.category}</span>
        {item.subCategory && (
          <>
            <span className="text-gray-400">•</span>
            <span className="font-light">{item.subCategory}</span>
          </>
        )}
      </div>

      {item.company && item.company !== 'Aharyas' && (
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={12} className="text-gray-500" />
          <span className="text-xs text-gray-700 font-medium uppercase tracking-wide">{item.company}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <IndianRupee size={16} className="text-black" />
          <span className="font-medium text-black text-lg">{item.price}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200 transition-all duration-300"
            title="Edit Product"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`)) {
                onRemove(item._id);
              }
            }}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-300"
            title="Delete Product"
          >
            <Trash2 size={14} />
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const [companies, setCompanies] = useState([
    'Vasudhaa Vastrram Vishram',
    'Anemone Vinkel'
  ]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);

  const categoryData = {
    Women: {
      subCategories: ["", "Kurtis", "Kurta Sets", "Tops", "Blazers", "Dresses", "Women Co-ord Sets", "Corset tops", "Short-tops", "Women Shirts", "Sarees"],
      sizes: {
        default: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        "Sarees": []
      }
    },
    Men: {
      subCategories: ["", "Men Shirts", "Sleeve Shirts", "Kurtas", "Men Co-ord Sets", "Vests", "Trousers"],
      sizes: {
        default: ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46']
      }
    },
    "Handmade Toys": {
      subCategories: ["", "Home Décor", "Bonthapally Toys", "Baskets", "Bags and Pouches", "Wall Decor"],
      sizes: { default: [] }
    },
    Stationary: {
      subCategories: ["", "Journals"],
      sizes: { default: [] }
    },
    "Special Product": {
      subCategories: ["", "Bags"],
      sizes: { default: [] }
    }
  };

  const currentCategoryData = editedProduct ? (categoryData[editedProduct.category] || { subCategories: [], sizes: { default: [] } }) : { subCategories: [], sizes: { default: [] } };

  const getCurrentSizes = () => {
    if (!currentCategoryData.sizes) return [];
    if (currentCategoryData.sizes[editedProduct?.subCategory]) {
      return currentCategoryData.sizes[editedProduct.subCategory];
    }
    return currentCategoryData.sizes.default || [];
  };

  // Get available subcategories based on selected category
  const getAvailableSubCategories = () => {
    if (!selectedCategory) return [];
    return categoryData[selectedCategory]?.subCategories.filter(sub => sub !== "") || [];
  };

  const handleAddNewCompany = () => {
    if (newCompanyName.trim() && !companies.includes(newCompanyName.trim())) {
      const updatedCompanies = [...companies, newCompanyName.trim()].sort();
      setCompanies(updatedCompanies);
      setEditedProduct(prev => ({ ...prev, company: newCompanyName.trim() }));
      setNewCompanyName('');
      setShowAddCompany(false);
      toast.success(`Company "${newCompanyName.trim()}" added successfully!`);
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
        setList(products);
        setFilteredList(products);

        const productCompanies = [...new Set(products
          .filter(product => product.company && product.company !== 'Aharyas')
          .map(product => product.company))];

        const allCompanies = [...new Set([...companies, ...productCompanies])].sort();
        setCompanies(allCompanies);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error while fetching the product list:', error);
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
      if (response.data.success) {
        toast.success('Product removed successfully.');
        await fetchList();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Error removing product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async () => {
    if (!editedProduct.name || !editedProduct.description || !editedProduct.price || !editedProduct.subCategory) {
      toast.error("Please fill in all required fields.");
      return;
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

      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.put(
        backendUrl + `/api/product/edit/${editedProduct._id}`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Product updated successfully.');
        await fetchList();
        closeEditModal();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response) {
        toast.error(`Server Error: ${error.response.data?.message || 'Unable to process your request.'}`);
      } else if (error.request) {
        toast.error('Network Error: Could not connect to the server.');
      } else {
        toast.error(`Unexpected Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (size) => {
    setEditedProduct(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }));
  };

  const removeImage = (index) => {
    setImages(prev => prev.map((img, i) => i === index ? null : img));
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditedProduct(null);
    setImages([null, null, null, null, null, null]);
    setShowAddCompany(false);
    setNewCompanyName('');
  };

  const openEditModal = (product) => {
    setEditedProduct({
      ...product,
      company: product.company || '',
      sizes: product.sizes || []
    });
    setImages([null, null, null, null, null, null]);
    setIsEditing(true);
  };

  const uploadedImagesCount = images.filter(img => img !== null).length;
  const currentSizes = getCurrentSizes();

  // Pagination calculations
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  useEffect(() => {
    let filtered = list;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.subCategory?.toLowerCase().includes(searchLower) ||
        product.company?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedSubCategory) {
      filtered = filtered.filter(product => product.subCategory === selectedSubCategory);
    }

    setFilteredList(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [list, searchTerm, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    fetchList();
  }, [token]);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-black mb-3 tracking-wide uppercase">Product Inventory</h1>
          <div className="w-20 h-0.5 bg-black mb-4"></div>
          <p className="text-gray-600 font-light tracking-wide">
            Manage your product catalog, update listings, and track inventory
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 shadow-sm mb-1 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-gray-600" />
                <h2 className="text-lg font-medium uppercase tracking-wide text-black">Search & Filter</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-light">{filteredList.length}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Products</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name, category, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Filter by Category</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubCategory(''); // Reset subcategory when category changes
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none"
                  >
                    <option value="">All Categories</option>
                    {Object.keys(categoryData).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Filter by Sub-Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none"
                    disabled={!selectedCategory}
                  >
                    <option value="">All Sub-Categories</option>
                    {getAvailableSubCategories().map(subCat => (
                      <option key={subCat} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-600 uppercase tracking-wider font-light">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredList.length)} of {filteredList.length} products
              </div>
              <div className="flex border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <Package size={20} className="text-gray-600" />
              <h2 className="text-lg font-medium uppercase tracking-wide text-black">Product Collection</h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 font-light uppercase tracking-wide">Loading products...</span>
                </div>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="text-center py-20">
                <Package className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-medium text-black mb-2 uppercase tracking-wide">
                  {list.length === 0 ? "No products found" : "No matching products"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto font-light">
                  {list.length === 0
                    ? "Start building your product catalog by adding your first product"
                    : "Try adjusting your search terms or filters"
                  }
                </p>
                {(searchTerm || selectedCategory || selectedSubCategory) ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedSubCategory('');
                    }}
                    className="mt-6 px-8 py-3 bg-black text-white uppercase tracking-wide font-light hover:bg-gray-800 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {viewMode === 'grid' ? (
                    currentItems.map((item, index) => (
                      <ProductCard
                        key={item._id}
                        item={item}
                        index={startIndex + index}
                        onEdit={openEditModal}
                        onRemove={removeProduct}
                        currency={currency}
                      />
                    ))
                  ) : (
                    <div className="bg-white border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {currentItems.map((item, index) => (
                              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-light text-gray-600">#{startIndex + index + 1}</td>
                                <td className="px-6 py-4">
                                  <div className="relative w-16 h-16">
                                    <img
                                      src={item.images?.[0] || '/api/placeholder/100/100'}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover border border-gray-200"
                                    />
                                    {item.bestseller && (
                                      <Star className="absolute -top-1 -right-1 text-black fill-black" size={14} />
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <h3 className="font-medium text-gray-900 mb-1 uppercase tracking-wide text-sm">{item.name}</h3>
                                  <p className="text-xs text-gray-600 line-clamp-2 font-light">{item.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-medium text-gray-900 text-sm uppercase tracking-wide">{item.category}</div>
                                  {item.subCategory && (
                                    <div className="text-xs text-gray-600 font-light uppercase tracking-wide">{item.subCategory}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1">
                                    <Building2 size={12} className="text-gray-500" />
                                    <span className="text-xs text-gray-700 font-medium uppercase tracking-wide">
                                      {item.company || 'Aharyas'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1 font-medium text-black">
                                    <IndianRupee size={14} />
                                    {item.price}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => openEditModal(item)}
                                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200 transition-all duration-300"
                                      title="Edit"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Delete "${item.name}"?`)) {
                                          removeProduct(item._id);
                                        }
                                      }}
                                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-300"
                                      title="Delete"
                                    >
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
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                    <div className="text-sm text-gray-600 font-light">
                      Page <span className="font-medium text-black">{currentPage}</span> of <span className="font-medium text-black">{totalPages}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
                        title="Previous Page"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      
                      <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-4 py-2 border transition-all duration-300 ${
                                currentPage === page
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-300 hover:border-black hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        ))}
                      </div>
                      
                      <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
                        title="Next Page"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 font-light">
                      {filteredList.length} total items
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && editedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 flex items-center justify-between border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Edit3 size={20} className="text-gray-600" />
                  <div>
                    <h2 className="text-lg font-medium uppercase tracking-wide text-black">Edit Product</h2>
                    <p className="text-xs text-gray-600 font-light uppercase tracking-wider">Update product information</p>
                  </div>
                </div>
                <button
                  onClick={closeEditModal}
                  className="p-2 text-gray-400 hover:text-black transition-colors"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); editProduct(); }} className="p-6 space-y-1">
                {/* Images */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ImageIcon size={20} className="text-gray-600" />
                        <h3 className="text-lg font-medium uppercase tracking-wide text-black">Product Images</h3>
                      </div>
                      <span className="text-sm text-gray-600 font-light">
                        {uploadedImagesCount}/6 New
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {images.map((image, index) => (
                        <ImageUpload
                          key={index}
                          id={`edit-image-${index}`}
                          image={image}
                          currentImage={editedProduct.images?.[index]}
                          setImage={(img) => setImages(prev => prev.map((val, i) => i === index ? img : val))}
                          index={index}
                          onRemove={removeImage}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Package size={20} className="text-gray-600" />
                      <h3 className="text-lg font-medium uppercase tracking-wide text-black">Product Information</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Product Name *</label>
                      <input
                        value={editedProduct.name}
                        onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                        type="text"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Description *</label>
                      <textarea
                        value={editedProduct.description}
                        onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 resize-none"
                        rows="4"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Building2 size={20} className="text-gray-600" />
                      <h3 className="text-lg font-medium uppercase tracking-wide text-black">Brand/Company</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Select Company</label>
                      <div className="flex gap-3">
                        <select
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, company: e.target.value }))}
                          value={editedProduct.company}
                          className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                        >
                          <option value="">Aharyas</option>
                          {companies.map((comp) => (
                            <option key={comp} value={comp}>{comp}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddCompany(true)}
                          className="px-6 py-3 bg-black hover:bg-gray-800 text-white transition-all duration-300 flex items-center gap-2 font-light uppercase tracking-wide"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                    </div>

                    {showAddCompany && (
                      <div className="bg-gray-50 border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium uppercase tracking-wide text-black">Add New Company</h4>
                          <button
                            type="button"
                            onClick={() => { setShowAddCompany(false); setNewCompanyName(''); }}
                            className="text-gray-400 hover:text-black transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newCompanyName}
                            onChange={(e) => setNewCompanyName(e.target.value)}
                            placeholder="Enter company name"
                            className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCompany())}
                          />
                          <button
                            type="button"
                            onClick={handleAddNewCompany}
                            className="px-6 py-3 bg-black hover:bg-gray-800 text-white transition-all duration-300 font-light uppercase tracking-wide"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 border border-gray-100 p-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 size={16} />
                        <span className="text-sm font-light">
                          Selected: <span className="font-medium">{editedProduct.company || 'Aharyas'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category & Price */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Tag size={20} className="text-gray-600" />
                      <h3 className="text-lg font-medium uppercase tracking-wide text-black">Category & Pricing</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Category *</label>
                        <select
                          value={editedProduct.category}
                          onChange={(e) => setEditedProduct(prev => ({
                            ...prev,
                            category: e.target.value,
                            subCategory: "",
                            sizes: []
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                        >
                          {Object.keys(categoryData).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Sub-Category *</label>
                        <select
                          value={editedProduct.subCategory}
                          onChange={(e) => { setEditedProduct(prev => ({ ...prev, subCategory: e.target.value })); }}
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                          required
                        >
                          {currentCategoryData.subCategories.map((subCat, index) => (
                            <option key={index} value={subCat}>{subCat || "Select"}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Price ({currency}) *</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            value={editedProduct.price}
                            onChange={(e) => setEditedProduct(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                {currentSizes.length > 0 && (
                  <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-gray-600" />
                        <h3 className="text-lg font-medium uppercase tracking-wide text-black">Available Sizes</h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-3 mb-4">
                        {currentSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-6 py-3 border-2 font-light uppercase tracking-wide transition-all duration-300 ${
                              editedProduct.sizes?.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {editedProduct.sizes?.length > 0 && (
                        <div className="bg-green-50 border border-green-200 p-4">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 size={16} />
                            <span className="text-sm font-light uppercase tracking-wide">
                              {editedProduct.sizes.length} size{editedProduct.sizes.length !== 1 ? 's' : ''} selected
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bestseller & Actions */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200">
                      <input
                        type="checkbox"
                        id="edit-bestseller"
                        checked={editedProduct.bestseller}
                        onChange={() => setEditedProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))}
                        className="w-5 h-5 text-black border-gray-300 focus:ring-black"
                      />
                      <label htmlFor="edit-bestseller" className="cursor-pointer flex items-center gap-2 text-black font-light uppercase tracking-wide">
                        <Star className="text-gray-600" size={18} />
                        Mark as Bestseller
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="px-8 py-4 border-2 border-gray-300 text-black font-light uppercase tracking-wide hover:border-black transition-all duration-300"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-black text-white font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
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