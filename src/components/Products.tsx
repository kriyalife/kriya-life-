import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ImageWithFallback } from "./ImageWithFallback";

interface ProductItem {
  id: string | number;
  name?: string;
  price?: number | string;
  image_url?: string;
  image_urls?: string[];
  video_url?: string;
  [key: string]: any;
}

export default function Products() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error(error);
      } else if (data) {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((p) => {
        const displayImg = (Array.isArray(p.image_urls) && p.image_urls[0]) || p.image_url || 'https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800';
        return (
          <div key={p.id} className="border p-4 rounded shadow-sm bg-white">
            <ImageWithFallback src={displayImg} className="w-full h-48 object-cover rounded mb-2" alt={p.name || 'Product'} />
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p className="text-emerald-700 font-semibold">₹{p.price}</p>

          </div>
        );
      })}
    </div>
  );
}
