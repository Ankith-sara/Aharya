import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendURl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  // Fetch the list of products
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

  // Remove a product
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

  // Edit a product
  const editProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        backendURl + `/api/product/edit/${editedProduct._id}`,
        editedProduct,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Product updated successfully.');
        await fetchList();
        setIsEditing(false); // Close the edit form
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

  // Handle form changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value
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
            <div
              key={item._id}
              className="grid grid-cols-[1fr_2fr_4fr_2fr_2fr_3fr] items-center gap-2 bg-white p-2 rounded shadow-sm"
            >
              <p>{list.indexOf(item) + 1}</p>
              <img
                className="w-16 h-full object-cover rounded"
                src={item.images?.[0] || 'default-image-path.jpg'}
                alt={item.name}
              />
              <p className="truncate">{item.name}</p>
              <p className="truncate">{item.category}</p>
              <p className="text-primary font-semibold">
                {currency} {item.price}
              </p>
              <div className="flex space-x-2 justify-center">
                <button
                  className="px-4 py-2 bg-secondary text-text rounded-md hover:bg-background hover:text-primary"
                  onClick={() => {
                    if (window.confirm(`Are you sure to delete "${item.name}"?`)) {
                      removeProduct(item._id);
                    }
                  }}
                >
                  Remove
                </button>
                <button
                  className="px-4 py-2 bg-text text-primary rounded-md hover:bg-background hover:text-secondary"
                  onClick={() => {
                    setEditedProduct(item);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold text-indigo-700">Edit Product</h2>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="category"
                value={editedProduct.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={editProduct}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
     );
};

export default List;