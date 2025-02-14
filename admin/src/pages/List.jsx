import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendURl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const ImageUpload = ({ id, image, currentImage, setImage }) => (
  <label htmlFor={id} className="w-24 h-24 border border-gray-300 flex items-center justify-center rounded-md cursor-pointer overflow-hidden">
    {image ? (
      <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full" />
    ) : currentImage ? (
      <img src={currentImage} alt={`Current ${id}`} className="object-cover w-full h-full" />
    ) : (
      <img src={assets.upload_area} alt="Upload area" className="object-contain w-full h-full" />
    )}
    <input type="file" id={id} hidden onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
  </label>
);

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [images, setImages] = useState([null, null, null, null, null, null]);

  const menSubCategories = ["", "Shirts", "Half-hand Shirts", "Vests", "Trousers"];
  const womenSubCategories = ["", "Kurtis", "Tops", "Blazers", "Dresses"];
  const homeFurnishingSubCategories = ["", "Home Décor", "Handmade Toys", "Baskets", "Bags and Pouches", "Stationery"];
  const kitchenwareSubCategories = ["", "Brass Bowls", "Wooden Spoons"];

  const menSizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46'];
  const womenSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const getAvailableSubCategories = (category) => {
    switch (category) {
      case "Men": return menSubCategories;
      case "Women": return womenSubCategories;
      case "Home Furnishing": return homeFurnishingSubCategories;
      case "Kitchenware": return kitchenwareSubCategories;
      default: return [];
    }
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendURl + '/api/product/list', {
        headers: { token }
      });
      if (response.data.success) {
        setList(response.data.products || []);
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
      const response = await axios.delete(backendURl + `/api/product/remove/${id}`, {
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
      formData.append('sizes', JSON.stringify(editedProduct.sizes));

      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.put(
        backendURl + `/api/product/edit/${editedProduct._id}`,
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
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4 bg-background rounded-lg shadow-md space-y-4">
      <h1 className="text-2xl mb-4 font-semibold text-primary">Product Inventory</h1>
      {loading ? (
        <div className="text-center text-lg text-primary">Loading...</div>
      ) : list.length === 0 ? (
        <div className="text-center text-lg text-slate-500">No products available.</div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-[1fr_2fr_4fr_2fr_2fr_3fr] items-center bg-secondary text-text p-2 rounded shadow-sm">
            <p className="font-semibold">Sl.no</p>
            <p className="font-semibold">Image</p>
            <p className="font-semibold">Name</p>
            <p className="font-semibold">Category</p>
            <p className="font-semibold">Price</p>
            <p className="text-center font-semibold">Actions</p>
          </div>
          {list.map((item) => (
            <div key={item._id} className="grid grid-cols-[1fr_2fr_4fr_2fr_2fr_3fr] items-center gap-2 bg-white p-2 rounded shadow-sm">
              <p>{list.indexOf(item) + 1}</p>
              <img className="w-16 h-full object-cover rounded" src={item.images?.[0] || 'default-image-path.jpg'} alt={item.name} />
              <p className="truncate">{item.name}</p>
              <p className="truncate">{item.category}</p>
              <p className="text-primary font-semibold">{currency} {item.price}</p>
              <div className="flex space-x-2 justify-center">
                <button
                  className="px-4 py-2 bg-secondary text-text rounded-md hover:bg-background hover:text-primary"
                  onClick={() => {
                    if (window.confirm(`Are you sure to delete "${item.name}"?`)) {
                      removeProduct(item._id);
                    }
                  }}> Remove </button>
                <button className="px-4 py-2 bg-text text-primary rounded-md hover:bg-background hover:text-secondary" onClick={() => { setEditedProduct(item); setIsEditing(true); }}> Edit </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditing && editedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-50">
          <div className="bg-text rounded-lg p-6 shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl text-primary font-semibold mb-4">Edit Product</h2>

            <div className="space-y-6">
              <div>
                <p className="mb-2 text-primary font-medium">Product Images</p>
                <div className="flex gap-4 flex-wrap">
                  {Array(6).fill(null).map((_, index) => (
                    <ImageUpload key={index} id={`edit-image-${index}`} image={images[index]} currentImage={editedProduct.images[index]} setImage={(img) => setImages(prev => prev.map((val, i) => i === index ? img : val))} />
                  ))}
                </div>
              </div>

              <div className="w-full">
                <p className="mb-2 text-primary font-medium">Product Name</p>
                <input value={editedProduct.name} onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border border-secondary text-primary rounded-md" type="text" placeholder="Enter product name" required />
              </div>
              <div className="w-full">
                <p className="mb-2 text-primary font-medium">Product Description</p>
                <textarea value={editedProduct.description} onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border border-secondary rounded-md resize-none" rows="3" placeholder="Enter product description" required />
              </div>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="mb-2 text-primary font-medium">Category</p>
                  <select value={editedProduct.category} onChange={(e) => setEditedProduct(prev => ({ ...prev, category: e.target.value, subCategory: "" }))}
                    className="px-4 py-2 border border-secondary text-primary rounded-md">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Home Furnishing">Home Furnishing</option>
                    <option value="Kitchenware">Kitchenware</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-primary font-medium">Sub-Category</p>
                  <select value={editedProduct.subCategory} onChange={(e) => setEditedProduct(prev => ({ ...prev, subCategory: e.target.value }))} className="px-4 py-2 border border-secondary rounded-md" >
                    {getAvailableSubCategories(editedProduct.category).map((subCat, index) => (
                      <option key={index} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-primary font-medium">Price {currency}</p>
                  <input value={editedProduct.price} onChange={(e) => setEditedProduct(prev => ({ ...prev, price: e.target.value }))} className="px-4 py-2 border border-secondary text-primary rounded-md" type="number" placeholder="Enter price" required />
                </div>
              </div>
              {["Men", "Women"].includes(editedProduct.category) && (
                <div>
                  <p className="mb-2 text-primary font-medium">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {(editedProduct.category === "Men" ? menSizes : womenSizes).map((size) => (
                      <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-4 py-2 rounded-md border ${editedProduct.sizes.includes(size) ? 'bg-white' : 'bg-slate-200'}`}>{size}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit-bestseller" checked={editedProduct.bestseller} onChange={() => setEditedProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))} />
                <label htmlFor="edit-bestseller" className="cursor-pointer text-primary font-medium">Mark as Bestseller</label>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => { setIsEditing(false); setEditedProduct(null); setImages([null, null, null, null, null, null]); }} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                <button onClick={editProduct} disabled={loading} className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900" >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;