import React, { useState, useRef } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Upload, Package, Tag, Star, Image as ImageIcon, CheckCircle2, Trash2, IndianRupee, Building2, Plus, X } from 'lucide-react';

const ImageUpload = ({ id, image, setImage, onRemove, index }) => (
  <div className="relative group aspect-square">
    <label
      htmlFor={id}
      className="w-full h-full bg-white border-2 border-gray-200 hover:border-black flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 absolute inset-0"
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 p-2">
          <Upload size={18} className="mb-1" />
          <span className="text-xs font-light uppercase tracking-wide text-center leading-tight">Upload</span>
        </div>
      )}
    </label>
    {image && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-black hover:bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
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
    "Handmade Toys": {
      subCategories: ["", "Kondapalli Bommalu", "Paintings", "Cheriyal Masks", "Bird houses"],
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

  const currentCategoryData = categoryData[category] || { subCategories: [], sizes: { default: [] } };

  const getCurrentSizes = () => {
    if (!currentCategoryData.sizes) return [];
    if (currentCategoryData.sizes[subCategory]) return currentCategoryData.sizes[subCategory];
    return currentCategoryData.sizes.default || [];
  };

  const handleMultipleFiles = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) { toast.error('Please select image files only'); return; }

    const newImages = [...images];
    let emptySlots = newImages.map((img, idx) => img === null ? idx : -1).filter(idx => idx !== -1);
    imageFiles.forEach((file, idx) => {
      if (idx < emptySlots.length) newImages[emptySlots[idx]] = file;
    });

    const totalImages = newImages.filter(img => img !== null).length;
    if (totalImages > 6) {
      toast.warning('Maximum 6 images allowed.');
      setImages(newImages.slice(0, 6));
    } else {
      setImages(newImages);
      if (imageFiles.length > emptySlots.length) {
        toast.warning(`Only ${emptySlots.length} images were added.`);
      } else {
        toast.success(`${imageFiles.length} image(s) added successfully`);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.length > 0) handleMultipleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length > 0) handleMultipleFiles(e.target.files);
  };

  const handleAddNewCompany = () => {
    if (newCompanyName.trim() && !companies.includes(newCompanyName.trim())) {
      const updatedCompanies = [...companies, newCompanyName.trim()].sort();
      setCompanies(updatedCompanies);
      setCompany(newCompanyName.trim());
      setNewCompanyName(''); setShowAddCompany(false);
      toast.success(`Company "${newCompanyName.trim()}" added!`);
    } else if (companies.includes(newCompanyName.trim())) {
      toast.error('This company already exists!');
    } else {
      toast.error('Please enter a valid company name.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !subCategory) { toast.error("Please fill in all required fields."); return; }
    if (!images.some(img => img !== null)) { toast.error("Please upload at least one product image."); return; }

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
      images.forEach((image, index) => { if (image) formData.append(`image${index + 1}`, image); });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success(`Success: ${response.data.message}`);
        resetForm();
      } else {
        toast.error(`Error: ${response.data.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error("Error while submitting the product:", error);
      if (error.response?.status === 401) toast.error('Session expired. Please login again.');
      else if (error.response) toast.error(`Server Error: ${error.response.data?.message || 'Unable to process request.'}`);
      else if (error.request) toast.error('Network Error: Could not connect to server.');
      else toast.error(`Unexpected Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setPrice('');
    setCategory('Women'); setSubCategory(''); setCompany('Aharyas');
    setBestseller(false); setSizes([]);
    setImages([null, null, null, null, null, null]);
    setShowAddCompany(false); setNewCompanyName('');
  };

  const toggleSize = (size) => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const removeImage = (index) => setImages(prev => prev.map((img, i) => i === index ? null : img));

  const uploadedImagesCount = images.filter(img => img !== null).length;
  const currentSizes = getCurrentSizes();

  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-light text-black mb-2 sm:mb-3 tracking-wide uppercase">Add New Product</h1>
          <div className="w-16 sm:w-20 h-0.5 bg-black mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-light tracking-wide">Fill in the details below to add a new product</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <ImageIcon size={18} className="text-gray-600" />
                  <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Product Images</h2>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-light">{uploadedImagesCount}/6 Uploaded</span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div
                className={`mb-4 sm:mb-6 border-2 border-dashed p-5 sm:p-8 text-center transition-all duration-300 ${dragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <Upload className="mx-auto mb-3 text-gray-400" size={36} />
                <h3 className="text-sm sm:text-lg font-medium text-black mb-1 sm:mb-2 uppercase tracking-wide">Drag & Drop Images</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-light mb-3 sm:mb-4">or click to browse</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white text-sm font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300"
                >
                  Select Images
                </button>
                <p className="text-xs text-gray-500 mt-3 font-light uppercase tracking-wide">Max 6 images • JPG, PNG, WEBP</p>
              </div>

              {uploadedImagesCount > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="aspect-square">
                      <ImageUpload
                        id={`image${index + 1}`}
                        image={image}
                        setImage={(img) => setImages(prev => prev.map((val, i) => i === index ? img : val))}
                        onRemove={removeImage}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 sm:gap-3">
                <Package size={18} className="text-gray-600" />
                <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Product Information</h2>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Product Name *</label>
                <input
                  onChange={(e) => setName(e.target.value)} value={name}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm"
                  type="text" placeholder="Enter product name" required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Product Description *</label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)} value={description}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 resize-none text-sm"
                  rows="4" placeholder="Describe your product in detail" required
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 sm:gap-3">
                <Building2 size={18} className="text-gray-600" />
                <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Brand / Company</h2>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Select Company</label>
                <div className="flex gap-2 sm:gap-3">
                  <select
                    onChange={(e) => setCompany(e.target.value)} value={company}
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm"
                  >
                    <option value="Aharyas">Aharyas</option>
                    {companies.map(comp => <option key={comp} value={comp}>{comp}</option>)}
                  </select>
                  <button
                    type="button" onClick={() => setShowAddCompany(true)}
                    className="px-3 sm:px-6 py-2.5 sm:py-3 bg-black hover:bg-gray-800 text-white transition-all duration-300 flex items-center gap-1 sm:gap-2 font-light uppercase tracking-wide text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Add</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>

              {showAddCompany && (
                <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs sm:text-sm font-medium uppercase tracking-wide text-black">Add New Company</h4>
                    <button type="button" onClick={() => { setShowAddCompany(false); setNewCompanyName(''); }} className="text-gray-400 hover:text-black transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Enter company name"
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCompany())}
                    />
                    <button type="button" onClick={handleAddNewCompany}
                      className="px-3 sm:px-6 py-2.5 bg-black hover:bg-gray-800 text-white transition-all duration-300 font-light uppercase tracking-wide text-xs sm:text-sm flex-shrink-0">
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-100 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 size={14} />
                  <span className="text-xs sm:text-sm font-light">Selected: <span className="font-medium">{company}</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 sm:gap-3">
                <Tag size={18} className="text-gray-600" />
                <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Category & Pricing</h2>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Category *</label>
                  <select
                    onChange={(e) => { setCategory(e.target.value); setSubCategory(""); setSizes([]); }} value={category}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm"
                  >
                    {Object.keys(categoryData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Sub-Category *</label>
                  <select
                    onChange={(e) => { setSubCategory(e.target.value); setSizes([]); }} value={subCategory}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm" required
                  >
                    {currentCategoryData.subCategories.map((subCat, index) => (
                      <option key={index} value={subCat}>{subCat || "Select Sub-Category"}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Price ({currency}) *</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      onChange={(e) => setPrice(e.target.value)} value={price}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm"
                      type="number" placeholder="0.00" min="0" step="0.01" required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentSizes.length > 0 && (
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Package size={18} className="text-gray-600" />
                  <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Available Sizes</h2>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                  {currentSizes.map(size => (
                    <button
                      key={size} type="button" onClick={() => toggleSize(size)}
                      className={`px-3 sm:px-6 py-2 sm:py-3 border-2 text-xs sm:text-sm font-light uppercase tracking-wide transition-all duration-300 ${sizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {sizes.length > 0 && (
                  <div className="bg-green-50 border border-green-200 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 size={15} />
                      <span className="text-xs sm:text-sm font-light uppercase tracking-wide">
                        {sizes.length} size{sizes.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 border border-gray-200">
                <input
                  type="checkbox" id="bestseller" checked={bestseller}
                  onChange={() => setBestseller(prev => !prev)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 focus:ring-black flex-shrink-0"
                />
                <label htmlFor="bestseller" className="cursor-pointer flex items-center gap-2 text-black font-light uppercase tracking-wide text-xs sm:text-sm">
                  <Star className="text-gray-600 flex-shrink-0" size={16} />
                  Mark as Bestseller
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
                <button
                  type="button" onClick={resetForm} disabled={loading}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-black text-sm font-light uppercase tracking-wide hover:border-black transition-all duration-300"
                >
                  Reset Form
                </button>
                <button
                  type="submit" disabled={loading}
                  className="w-full sm:w-auto sm:ml-auto px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-sm font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Package size={16} />
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