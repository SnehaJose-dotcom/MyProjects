'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddNewProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    rating: '',
    image: '',
    description: '',
    brand: '',
    company: '',
    year: '',
    expiry: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
  
    const confirmed = window.confirm('Are you sure you want to upload this image?');
    if (!confirmed) return;
  
    const formData = new FormData();
    formData.append('file', imageFile);
    setUploading(true);
  
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProduct((prev) => ({ ...prev, image: data.url }));
        alert('✅ Image uploaded successfully!');
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.image) return alert('Please upload an image');

    const res = await fetch('/api/admin/addnew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert('Product added successfully');
      router.push('/admin/products');
    } else {
      alert('Failed to add product');
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center text-[#6D4C41] mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['name', 'price', 'category', 'rating', 'brand', 'company', 'year', 'expiry'].map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold text-[#6D4C41] capitalize block mb-1">{field}</label>
              <input
                type={field === 'price' || field === 'rating' || field === 'year' ? 'number' : 'text'}
                name={field}
                value={(product as any)[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-[#6D4C41] block mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading || !imageFile}
              className="mt-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {product.image && (
              <img src={product.image} alt="Preview" className="mt-4 w-40 rounded" />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-[#6D4C41] block mb-1">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-gray-700 transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
