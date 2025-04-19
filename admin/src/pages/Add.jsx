import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendURl, currency } from '../App';
import { toast } from 'react-toastify';

const ImageUpload = ({ id, image, setImage }) => (
  <label htmlFor={id} className="w-24 h-24 border border-gray-300 flex items-center justify-center rounded-md cursor-pointer overflow-hidden">
    {image ? (
      <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full" />
    ) : (
      <img src={assets.upload_area} alt="Upload area" className="object-contain w-full h-full" />
    )}
    <input type="file" id={id} hidden onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
  </label>
);

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const menSubCategories = ["", "Shirts", "Half-hand Shirts", "Vests", "Trousers", "Jackets", "Men-Blazers"];
  const womenSubCategories = ["", "Kurtis", "Tops", "Blazers", "Dresses", "Corset-tops"];
  const homeFurnishingSubCategories = ["", "Home Décor", "Handmade Toys", "Baskets", "Bags and Pouches", "Stationery", "Wall Decor"];
  const kitchenwareSubCategories = ["", "Brass Bowls", "Wooden Spoons"];
  const specialSubCategories = ["", "Bags"];

  const availableSubCategories = category === "Men" ? menSubCategories : category === "Women" ? womenSubCategories : [];

  const menSizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46'];
  const womenSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !subCategory) {
      toast.error("Please fill in all required fields.");
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
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));

      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(`${backendURl}/api/product/add`, formData, {
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
        console.log("Error Response:", error.response);
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
    setBestseller(false);
    setSizes([]);
    setImages([null, null, null, null, null, null]);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-6 p-6 bg-background rounded-lg shadow-md max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl text-primary font-semibold mb-4">Add New Product</h2>
      <div>
        <p className="mb-2 text-primary font-medium">Upload Images</p>
        <div className="flex gap-4">
          {
            images.map((image, index) => (
              <ImageUpload key={index} id={`image${index + 1}`} image={image} setImage={(img) => setImages((prev) => prev.map((val, i) => (i === index ? img : val)))} />
            ))
          }
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2 text-primary font-medium">Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full px-4 py-2 border border-secondary text-primary rounded-md" type="text" placeholder="Enter product name" required />
      </div>
      <div className="w-full">
        <p className="mb-2 text-primary font-medium">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full px-4 py-2 border border-secondary rounded-md resize-none" rows="3" placeholder="Enter product description" required />
      </div>
      <div className="flex flex-wrap gap-6">
        <div>
          <p className="mb-2 text-primary font-medium">Category</p>
          <select onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }} value={category} className="px-4 py-2 border border-secondary text-primary rounded-md" >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Home Furnishing">Home Furnishing</option>
            <option value="Kitchenware">Kitchenware</option>
            <option value="Special Product">Special Product</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-primary font-medium">Sub-Category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className="px-4 py-2 border border-secondary rounded-md" >
            {
              (category === "Men" || category === "Women") && availableSubCategories.length > 0 && availableSubCategories.map((subCat, index) => (
                <option key={index} value={subCat}> {subCat} </option>
              ))
            }
            {
              category === "Home Furnishing" && homeFurnishingSubCategories.map((subCat, index) => (
                <option key={index} value={subCat}> {subCat} </option>
              ))
            }
            {
              category === "Kitchenware" && kitchenwareSubCategories.map((subCat, index) => (
                <option key={index} value={subCat}> {subCat} </option>
              ))
            }
            {
              category === "Special Product" && specialSubCategories.map((subCat, index) => (
                <option key={index} value={subCat}> {subCat} </option>
              ))
            }
          </select>
        </div>
        <div>
          <p className="mb-2 text-primary font-medium">Price {currency}</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="px-4 py-2 border border-secondary text-primary rounded-md" type="number" placeholder="Enter price" required />
        </div>
      </div>
      <div>
        {
          ["Men", "Women"].includes(category) && (
            <div>
              <p className="mb-2 text-primary font-medium">Available Sizes</p>
              {(category === "Men" ? menSizes : womenSizes).map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-4 py-2 mx-1 rounded-md border ${sizes.includes(size) ? 'bg-white' : 'bg-slate-200'}`}>
                  {size}
                </button>
              ))}
            </div>
          )
        }
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="bestseller" checked={bestseller} onChange={() => setBestseller((prev) => !prev)} />
        <label htmlFor="bestseller" className="cursor-pointer text-primary font-medium"> Mark as Bestseller </label>
      </div>
      <button className="w-32 py-2 bg-black text-text font-medium rounded-md" type="submit" disabled={loading} > {loading ? 'Adding...' : 'Add Product'} </button>
    </form>
  );
};

export default Add;