import React, { useState, useRef } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Upload, Package, Tag, Star, Image as ImageIcon, CheckCircle2, Trash2, IndianRupee, Building2, Plus, X } from 'lucide-react';

const ImageUpload = ({ id, image, setImage, onRemove, index }) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Upload size={24} className="mb-2" />
          <span className="text-xs font-light uppercase tracking-wide">Upload</span>
        </div>
      )}
    </label>
    {image && (
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

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Women');
  const [subCategory, setSubCategory] = useState('');
  const [company, setCompany] = useState('Aharyas');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [companies, setCompanies] = useState([
    'Vasudhaa Vastrram Vishram',
    'Anemone Vinkel'
  ]);

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
    Stationary: {
      subCategories: ["", "Journals"],
      sizes: { default: [] }
    },
    "Handmade Toys": {
      subCategories: ["", "Home Décor", "Bonthapally Toys", "Baskets", "Bags and Pouches", "Wall Decor"],
      sizes: {
        default: []
      }
    },
    "Special Product": {
      subCategories: ["", "Bags"],
      sizes: {
        default: []
      }
    }
  };

  const currentCategoryData = categoryData[category] || { subCategories: [], sizes: { default: [] } };

  const getCurrentSizes = () => {
    if (!currentCategoryData.sizes) return [];
    if (currentCategoryData.sizes[subCategory]) {
      return currentCategoryData.sizes[subCategory];
    }
    return currentCategoryData.sizes.default || [];
  };

  const handleMultipleFiles = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast.error('Please select image files only');
      return;
    }

    const newImages = [...images];
    let emptySlots = newImages.map((img, idx) => img === null ? idx : -1).filter(idx => idx !== -1);

    imageFiles.forEach((file, idx) => {
      if (idx < emptySlots.length) {
        newImages[emptySlots[idx]] = file;
      }
    });

    const totalImages = newImages.filter(img => img !== null).length;
    if (totalImages > 6) {
      toast.warning('Maximum 6 images allowed. Extra images were not added.');
      setImages(newImages.slice(0, 6));
    } else {
      setImages(newImages);
      if (imageFiles.length > emptySlots.length) {
        toast.warning(`Only ${emptySlots.length} images were added. Remove existing images to add more.`);
      } else {
        toast.success(`${imageFiles.length} image(s) added successfully`);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleMultipleFiles(e.target.files);
    }
  };

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
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
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
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(`Server Error: ${error.response.data?.message || 'Unable to process your request.'}`);
        }
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
    setCategory('Women');
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
  const currentSizes = getCurrentSizes();

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-black mb-3 tracking-wide uppercase">Add New Product</h1>
          <div className="w-20 h-0.5 bg-black mb-4"></div>
          <p className="text-gray-600 font-light tracking-wide">
            Fill in the details below to add a new product to your inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Product Images */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon size={20} className="text-gray-600" />
                  <h2 className="text-lg font-medium uppercase tracking-wide text-black">Product Images</h2>
                </div>
                <span className="text-sm text-gray-600 font-light">
                  {uploadedImagesCount}/6 Uploaded
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Drag & Drop Zone */}
              <div
                className={`mb-6 border-2 border-dashed p-8 text-center transition-all duration-300 ${dragActive
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-medium text-black mb-2 uppercase tracking-wide">
                  Drag & Drop Images Here
                </h3>
                <p className="text-sm text-gray-600 font-light mb-4">
                  or click to browse and select multiple images
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-black text-white font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300"
                >
                  Select Images
                </button>
                <p className="text-xs text-gray-500 mt-4 font-light uppercase tracking-wide">
                  Maximum 6 images • JPG, PNG, WEBP
                </p>
              </div>

              {/* Image Grid - Only show if images are uploaded */}
              {uploadedImagesCount > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
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
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-gray-600" />
                <h2 className="text-lg font-medium uppercase tracking-wide text-black">Product Information</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                  type="text"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Product Description *
                </label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 resize-none"
                  rows="5"
                  placeholder="Describe your product in detail"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company/Brand Section */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-gray-600" />
                <h2 className="text-lg font-medium uppercase tracking-wide text-black">Brand/Company</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Select Company
                </label>
                <div className="flex gap-3">
                  <select
                    onChange={(e) => setCompany(e.target.value)}
                    value={company}
                    className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                  >
                    <option value="Aharyas">Aharyas</option>
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
                    Selected Brand: <span className="font-medium">{company}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <Tag size={20} className="text-gray-600" />
                <h2 className="text-lg font-medium uppercase tracking-wide text-black">Category & Pricing</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    onChange={(e) => { setCategory(e.target.value); setSubCategory(""); setSizes([]); }}
                    value={category}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                  >
                    {Object.keys(categoryData).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                    Sub-Category *
                  </label>
                  <select
                    onChange={(e) => { setSubCategory(e.target.value); setSizes([]); }}
                    value={subCategory}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                    required
                  >
                    {currentCategoryData.subCategories.map((subCat, index) => (
                      <option key={index} value={subCat}>{subCat || "Select Sub-Category"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                    Price ({currency}) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
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
          </div>

          {/* Sizes */}
          {currentSizes.length > 0 && (
            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-gray-600" />
                  <h2 className="text-lg font-medium uppercase tracking-wide text-black">Available Sizes</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-3 mb-4">
                  {currentSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-6 py-3 border-2 font-light uppercase tracking-wide transition-all duration-300 ${sizes.includes(size)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {sizes.length > 0 && (
                  <div className="bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-light uppercase tracking-wide">
                        {sizes.length} size{sizes.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bestseller & Submit */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200">
                <input
                  type="checkbox"
                  id="bestseller"
                  checked={bestseller}
                  onChange={() => setBestseller(prev => !prev)}
                  className="w-5 h-5 text-black border-gray-300 focus:ring-black"
                />
                <label htmlFor="bestseller" className="cursor-pointer flex items-center gap-2 text-black font-light uppercase tracking-wide">
                  <Star className="text-gray-600" size={18} />
                  Mark as Bestseller
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 border-2 border-gray-300 text-black font-light uppercase tracking-wide hover:border-black transition-all duration-300"
                  disabled={loading}
                >
                  Reset Form
                </button>
                <button
                  className="px-8 py-4 bg-black text-white font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;