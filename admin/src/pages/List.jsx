import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Package, Edit3, Trash2, Search, Filter, Star, Image as ImageIcon, Upload, X, Save, CheckCircle2, IndianRupee, Grid, List as ListIcon, Tag, Building2, Plus, AlertCircle } from 'lucide-react';
import Title from '../components/Title';

const ImageUpload = ({ id, image, currentImage, setImage, index, onRemove }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="w-28 h-28 bg-white border border-gray-200 hover:border-gray-400 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md"
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full rounded-md" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-xl">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={20} />
          </div>
        </>
      ) : currentImage ? (
        <>
          <img src={currentImage} alt={`Current ${id}`} className="object-cover w-full h-full rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-xl">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={20} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Upload size={20} className="mb-1" />
          <span className="text-xs font-medium">Add Image</span>
        </div>
      )}
    </label>
    {(image || currentImage) && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
      >
        <Trash2 size={12} />
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
  <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
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
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star size={12} fill="white" />
          BESTSELLER
        </div>
      )}
      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
        <span className="text-xs font-medium text-white">#{index + 1}</span>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-md">{item.name}</h3>
      
      <div className="flex items-center gap-2 mb-3">
        <Tag size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600 font-medium">{item.category}</span>
        {item.subCategory && (
          <>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{item.subCategory}</span>
          </>
        )}
      </div>

      {item.company && item.company !== 'Aharyas' && (
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={14} className="text-blue-500" />
          <span className="text-sm text-blue-600 font-semibold">{item.company}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <IndianRupee size={18} className="text-green-600" />
          <span className="font-bold text-green-600 text-lg">{item.price}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm hover:shadow-md"
            title="Edit Product"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`)) {
                onRemove(item._id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm hover:shadow-md"
            title="Delete Product"
          >
            <Trash2 size={16} />
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
  const [viewMode, setViewMode] = useState('grid');

  // Company-related states
  const [companies, setCompanies] = useState([
    'Biba',
    'Fabindia',
    'Vasudhaa Vastrram Vishram'
  ]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);

  const categoryData = {
    Men: {
      subCategories: ["", "Shirts", "Sleeve Shirts", "Kurtas", "Co-ord Sets", "Vests", "Trousers", "Jackets"],
      sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46']
    },
    Women: {
      subCategories: ["", "Kurtis", "Kurta Sets", "Tops", "Blazers", "Dresses", "Corset-tops"],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    "Home Furnishing": {
      subCategories: ["", "Home Décor", "Handmade Toys", "Baskets", "Bags and Pouches", "Stationery", "Wall Decor"],
      sizes: []
    },
    Kitchenware: {
      subCategories: ["", "Brass Bowls", "Wooden Spoons"],
      sizes: []
    },
    "Special Product": {
      subCategories: ["", "Bags"],
      sizes: []
    }
  };

  const currentCategoryData = editedProduct ? (categoryData[editedProduct.category] || { subCategories: [], sizes: [] }) : { subCategories: [], sizes: [] };

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
        headers: { token }
      });
      if (response.data.success) {
        const products = response.data.products || [];
        setList(products);
        setFilteredList(products);

        // Extract unique companies from products to update the companies list
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
        headers: { token }
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
        { headers: { token } }
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
        toast.error('Network Error: Could not connect to the server. Please check your internet connection.');
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

  // Filter products based on search and category
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

    setFilteredList(filtered);
  }, [list, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchList();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title text1="PRODUCT" text2="INVENTORY" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Manage your product catalog, update listings, and track inventory
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-black text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search size={24} className="text-gray-300" />
                <h2 className="text-xl font-semibold">Search & Filter Products</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{filteredList.length}</div>
                <div className="text-sm text-gray-300">Products Found</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, category, company, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors appearance-none"
                  >
                    <option value="">All Categories</option>
                    {Object.keys(categoryData).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {filteredList.length} of {list.length} products
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="List View"
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-black text-white p-6">
            <div className="flex items-center gap-3">
              <Package size={24} className="text-gray-300" />
              <h2 className="text-xl font-semibold">Product Collection</h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg text-gray-600 font-medium">Loading products...</span>
                </div>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="text-center py-20">
                <Package className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {list.length === 0 ? "No products found" : "No matching products"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {list.length === 0 
                    ? "Start building your product catalog by adding your first product" 
                    : "Try adjusting your search terms or filters to find what you're looking for"
                  }
                </p>
                {searchTerm || selectedCategory ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {viewMode === 'grid' ? (
                  filteredList.map((item, index) => (
                    <ProductCard
                      key={item._id}
                      item={item}
                      index={index}
                      onEdit={openEditModal}
                      onRemove={removeProduct}
                      currency={currency}
                    />
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black text-white">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Product Details</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredList.map((item, index) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-gray-600">#{index + 1}</td>
                              <td className="px-6 py-4">
                                <div className="relative w-16 h-16">
                                  <img
                                    src={item.images?.[0] || '/api/placeholder/100/100'}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                      e.target.src = '/api/placeholder/100/100';
                                    }}
                                  />
                                  {item.bestseller && (
                                    <Star className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" size={16} />
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900">{item.category}</div>
                                {item.subCategory && (
                                  <div className="text-sm text-gray-600">{item.subCategory}</div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                  <Building2 size={14} className="text-blue-500" />
                                  <span className="text-sm text-blue-600 font-semibold">
                                    {item.company || 'Aharyas'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1 font-bold text-green-600">
                                  <IndianRupee size={16} />
                                  {item.price}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Product"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`)) {
                                        removeProduct(item._id);
                                      }
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Product"
                                  >
                                    <Trash2 size={16} />
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
            )}
          </div>
        </div>

        {/* Edit Product Modal */}
        {isEditing && editedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-black text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit3 size={24} className="text-gray-300" />
                  <div>
                    <h2 className="text-xl font-semibold">Edit Product</h2>
                    <p className="text-gray-300">Update product information and details</p>
                  </div>
                </div>
                <button
                  onClick={closeEditModal}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => {e.preventDefault(); editProduct();}} className="p-6 space-y-6">
                {/* Product Images */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ImageIcon size={24} className="text-gray-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Update Product Images ({uploadedImagesCount}/6)</h3>
                      <p className="text-sm text-gray-600">Upload new images to replace existing ones</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-4">
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

                {/* Product Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package size={20} />
                      Product Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                          value={editedProduct.name}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                          rows="4"
                          placeholder="Enter product description"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company/Brand Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 size={20} className="text-gray-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Brand/Company</h3>
                        <p className="text-sm text-gray-600">Select or add the brand for this product</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company/Brand</label>
                        <div className="flex gap-3">
                          <select
                            onChange={(e) => setEditedProduct(prev => ({ ...prev, company: e.target.value }))}
                            value={editedProduct.company}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                          >
                            <option value="">Aharyas</option>
                            {companies.map((comp) => (
                              <option key={comp} value={comp}>{comp}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowAddCompany(true)}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
                          >
                            <Plus size={16} />
                            Add New
                          </button>
                        </div>
                      </div>

                      {/* Add New Company Form */}
                      {showAddCompany && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">Add New Company</h4>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={newCompanyName}
                              onChange={(e) => setNewCompanyName(e.target.value)}
                              placeholder="Enter company/brand name"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                              onKeyPress={(e) => e.key === 'Enter' && handleAddNewCompany()}
                            />
                            <button
                              type="button"
                              onClick={handleAddNewCompany}
                              className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {setShowAddCompany(false); setNewCompanyName('');}}
                              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Company Selection Status */}
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Building2 size={16} />
                          <span className="text-sm font-medium">
                            {editedProduct.company ? `Selected: ${editedProduct.company}` : 'Product will be listed as Aharyas by default'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category & Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag size={20} />
                      Category & Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          value={editedProduct.category}
                          onChange={(e) => setEditedProduct(prev => ({
                            ...prev,
                            category: e.target.value,
                            subCategory: "",
                            sizes: []
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                        >
                          {Object.keys(categoryData).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category *</label>
                        <select
                          value={editedProduct.subCategory}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, subCategory: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                          required
                        >
                          {currentCategoryData.subCategories.map((subCat, index) => (
                            <option key={index} value={subCat}>{subCat || "Select Sub-Category"}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ({currency}) *</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            value={editedProduct.price}
                            onChange={(e) => setEditedProduct(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sizes (if applicable) */}
                  {currentCategoryData.sizes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Package size={20} />
                        Available Sizes
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {currentCategoryData.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                              editedProduct.sizes?.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {editedProduct.sizes?.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 size={16} />
                            <span className="text-sm font-medium">{editedProduct.sizes.length} size{editedProduct.sizes.length !== 1 ? 's' : ''} selected</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bestseller */}
                  <div>
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="edit-bestseller"
                        checked={editedProduct.bestseller}
                        onChange={() => setEditedProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))}
                        className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="edit-bestseller" className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium">
                        <Star className="text-yellow-500" size={18} />
                        Mark as Bestseller
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-black text-white font-medium rounded-lg transition-all duration-200 hover:bg-gray-800 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 min-w-[140px]"
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
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;