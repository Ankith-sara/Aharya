import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Upload, Package, Tag, Star, Image as ImageIcon, AlertCircle, CheckCircle2, Trash2, IndianRupee, Building2, Plus } from 'lucide-react';

const ImageUpload = ({ id, image, setImage, onRemove, index }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="w-28 h-28 border-2 border-dashed border-gray-300 hover:border-indigo-400 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md bg-gray-50 hover:bg-gray-100"
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full rounded-xl" />
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
    {image && (
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

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('');
  const [company, setCompany] = useState('Aharyas');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState([
    'Biba',
    'Fabindia',
    'Vasudhaa Vastrram Vishram'
  ]);

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

  const currentCategoryData = categoryData[category] || { subCategories: [], sizes: [] };

  const handleAddNewCompany = () => {
    if (newCompanyName.trim() && !companies.includes(newCompanyName.trim())) {
      const updatedCompanies = [...companies, newCompanyName.trim()].sort();
      setCompanies(updatedCompanies);
      setCompany(newCompanyName.trim());
      setNewCompanyName('');
      setShowAddCompany(false);
      toast.success(`Company "${newCompanyName.trim()}" added successfully!`);
    } else if (companies.includes(newCompanyName.trim())) {
      toast.error('This company already exists!');
    } else {
      toast.error('Please enter a valid company name.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !subCategory) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const hasImages = images.some(img => img !== null);
    if (!hasImages) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('company', company || 'Aharyas');
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));

      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(`Success: ${response.data.message}`);
        resetForm();
      } else {
        toast.error(`Error: ${response.data.message || 'Something went wrong. Please try again.'}`);
      }
    } catch (error) {
      console.error("Error while submitting the product:", error);
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

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Men');
    setSubCategory('');
    setCompany('Aharyas');
    setBestseller(false);
    setSizes([]);
    setImages([null, null, null, null, null, null]);
    setShowAddCompany(false);
    setNewCompanyName('');
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const removeImage = (index) => {
    setImages(prev => prev.map((img, i) => i === index ? null : img));
  };

  const uploadedImagesCount = images.filter(img => img !== null).length;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-text rounded-2xl shadow-sm border border-secondary mb-8 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Package className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-1">Fill in the details below to add a new product to your inventory</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Images */}
          <div className="bg-text rounded-2xl shadow-sm border border-secondary p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="text-purple-600" size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                <p className="text-sm text-gray-600">Upload up to 6 high-quality images ({uploadedImagesCount}/6 uploaded)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6">
              {images.map((image, index) => (
                <ImageUpload
                  key={index}
                  id={`image${index + 1}`}
                  image={image}
                  setImage={(img) => setImages(prev => prev.map((val, i) => (i === index ? img : val)))}
                  onRemove={removeImage}
                  index={index}
                />
              ))}
            </div>

            {uploadedImagesCount === 0 && (
              <div className="mt-4 flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                <span className="text-sm">Please upload at least one product image</span>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="bg-text rounded-2xl shadow-sm border border-secondary p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                <p className="text-sm text-gray-600">Basic details about your product</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                  type="text"
                  placeholder="Enter a descriptive product name"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none"
                  rows="4"
                  placeholder="Describe your product in detail, including features, materials, and benefits"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company/Brand Section */}
          <div className="bg-text rounded-2xl shadow-sm border border-secondary p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-indigo-600" size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Brand/Company</h3>
                <p className="text-sm text-gray-600">Select the brand or company for this product</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company/Brand</label>
                <div className="flex gap-3">
                  <select
                    onChange={(e) => setCompany(e.target.value)}
                    value={company}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                  >
                    <option value="Aharyas">Aharyas</option>
                    {companies.map((comp) => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCompany(true)}
                    className="px-4 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>
              </div>

              {/* Add New Company Modal/Form */}
              {showAddCompany && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Add New Company</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Enter company/brand name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNewCompany()}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCompany}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {setShowAddCompany(false); setNewCompanyName('');}}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Company Selection Status */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${company ? 'text-blue-700 bg-blue-50' : 'text-gray-700 bg-gray-50'}`}>
                <Building2 size={16} />
                <span className="text-sm">
                  {company ? `Selected: ${company}` : 'Product will be listed as Aharyas by default'}
                </span>
              </div>
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="bg-text rounded-2xl shadow-sm border border-secondary p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Tag className="text-green-600" size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Category & Pricing</h3>
                <p className="text-sm text-gray-600">Categorize and price your product</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  onChange={(e) => { setCategory(e.target.value); setSubCategory(""); setSizes([]); }}
                  value={category}
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
                  onChange={(e) => setSubCategory(e.target.value)}
                  value={subCategory}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
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
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
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

          {/* Sizes (if applicable) */}
          {currentCategoryData.sizes.length > 0 && (
            <div className="bg-text rounded-2xl shadow-sm border border-secondary p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="text-orange-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Available Sizes</h3>
                  <p className="text-sm text-gray-600">Select all available sizes for this product</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {currentCategoryData.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200 ${sizes.includes(size)
                      ? 'bg-gray-300 text-white border-secondary shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-secondary hover:bg-indigo-50'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {sizes.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 size={16} />
                  <span className="text-sm">{sizes.length} size{sizes.length !== 1 ? 's' : ''} selected</span>
                </div>
              )}
            </div>
          )}

          {/* Bestseller */}
          <div className="bg-text rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <input
                type="checkbox"
                id="bestseller"
                checked={bestseller}
                onChange={() => setBestseller(prev => !prev)}
                className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="bestseller" className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium">
                <Star className="text-yellow-500" size={18} />
                Mark as Bestseller
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-secondary text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Reset Form
            </button>
            <button
              className="px-8 py-3 bg-secondary text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Package size={18} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;