import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import {
  Package,
  Edit3,
  Trash2,
  Search,
  Filter,
  Star,
  Image as ImageIcon,
  Upload,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  IndianRupee,
  Grid,
  List as ListIcon,
  Tag,
  DollarSign
} from 'lucide-react';

const ImageUpload = ({ id, image, currentImage, setImage, index, onRemove }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="w-20 h-20 border-2 border-dashed border-gray-300 hover:border-indigo-400 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md bg-gray-50 hover:bg-gray-100"
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-xl">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={16} />
          </div>
        </>
      ) : currentImage ? (
        <>
          <img src={currentImage} alt={`Current ${id}`} className="object-cover w-full h-full rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-xl">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={16} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Upload size={16} className="mb-1" />
          <span className="text-xs font-medium">Add</span>
        </div>
      )}
    </label>
    {(image || currentImage) && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
      >
        <Trash2 size={10} />
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
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className="relative">
      <img
        src={item.images?.[0] || 'default-image-path.jpg'}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      {item.bestseller && (
        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Star size={12} fill="white" />
          Bestseller
        </div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
        <span className="text-xs font-medium text-gray-700">#{index + 1}</span>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
      <div className="flex items-center gap-2 mb-2">
        <Tag size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">{item.category}</span>
        {item.subCategory && (
          <>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{item.subCategory}</span>
          </>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <IndianRupee size={16} className="text-green-600" />
          <span className="font-semibold text-green-600">{item.price}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                onRemove(item._id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const categoryData = {
    Men: {
      subCategories: ["", "Shirts", "Half-hand Shirts", "Vests", "Trousers", "Jackets", "Men-Blazers"],
      sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46']
    },
    Women: {
      subCategories: ["", "Kurtis", "Tops", "Blazers", "Dresses", "Corset-tops"],
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

  const getAvailableSubCategories = (category) => {
    return categoryData[category]?.subCategories || [];
  };

  const getAvailableSizes = (category) => {
    return categoryData[category]?.sizes || [];
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
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error while fetching the product list:', error);
      toast.error('Error fetching products.');
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
      toast.error('Error removing product.');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('category', editedProduct.category);
      formData.append('subCategory', editedProduct.subCategory);
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
        setIsEditing(false);
        setEditedProduct(null);
        setImages([null, null, null, null, null, null]);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product.');
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

  // Filter products based on search and category
  useEffect(() => {
    let filtered = list;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredList(filtered);
  }, [list, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-text rounded-2xl shadow-sm border border-secondary mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package className="text-indigo-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
                <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{filteredList.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-text rounded-2xl shadow-sm border border-secondary mb-8 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                >
                  <option value="">All Categories</option>
                  {Object.keys(categoryData).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid size={20} className={viewMode === 'grid' ? 'text-indigo-600' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <ListIcon size={20} className={viewMode === 'list' ? 'text-indigo-600' : 'text-gray-600'} />
              </button>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-text rounded-2xl shadow-sm border border-secondary p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg text-gray-600">Loading products...</span>
              </div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {list.length === 0 ? "Start by adding your first product" : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredList.map((item, index) => (
                    <ProductCard
                      key={item._id}
                      item={item}
                      index={index}
                      onEdit={(product) => {
                        setEditedProduct(product);
                        setIsEditing(true);
                      }}
                      onRemove={removeProduct}
                      currency={currency}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Details</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredList.map((item, index) => (
                          <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-600">#{index + 1}</td>
                            <td className="px-6 py-4">
                              <div className="relative w-16 h-16">
                                <img
                                  src={item.images?.[0] || 'default-image-path.jpg'}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                                />
                                {item.bestseller && (
                                  <Star className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" size={16} />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{item.category}</div>
                              {item.subCategory && (
                                <div className="text-sm text-gray-600">{item.subCategory}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 font-semibold text-green-600">
                                <IndianRupee size={16} />
                                {item.price}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditedProduct(item);
                                    setIsEditing(true);
                                  }}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                      removeProduct(item._id);
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            </>
          )}
        </div>

        {/* Edit Product Modal */}
        {isEditing && editedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Edit3 className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                    <p className="text-gray-600">Update product information and images</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProduct(null);
                    setImages([null, null, null, null, null, null]);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Product Images */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="text-purple-600" size={16} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                      <p className="text-sm text-gray-600">Upload new images to replace existing ones</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {Array(6).fill(null).map((_, index) => (
                      <ImageUpload
                        key={index}
                        id={`edit-image-${index}`}
                        image={images[index]}
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                          value={editedProduct.name}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                          type="text"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                        <textarea
                          value={editedProduct.description}
                          onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none"
                          rows="4"
                          placeholder="Enter product description"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category & Pricing</h3>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                        >
                          {getAvailableSubCategories(editedProduct.category).map((subCat, index) => (
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
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

                  {/* Sizes */}
                  {getAvailableSizes(editedProduct.category).length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Sizes</h3>
                      <div className="flex flex-wrap gap-3">
                        {getAvailableSizes(editedProduct.category).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200 ${editedProduct.sizes?.includes(size)
                                ? 'bg-secondary text-white border-secondary shadow-md'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-secondary hover:bg-indigo-50'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {editedProduct.sizes?.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                          <CheckCircle2 size={16} />
                          <span className="text-sm">{editedProduct.sizes.length} size{editedProduct.sizes.length !== 1 ? 's' : ''} selected</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bestseller */}
                  <div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
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
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProduct(null);
                      setImages([null, null, null, null, null, null]);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editProduct}
                    disabled={loading}
                    className="px-8 py-3 bg-secondary text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default List;