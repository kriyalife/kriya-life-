const fs = require('fs');
let content = fs.readFileSync('src/components/admin/ProductsManager.tsx', 'utf8');

// I will find the beginning of handleSubmit
const startIdx = content.indexOf('const handleSubmit = async (e: React.FormEvent) => {');

// I will find the beginning of the return statement
const endIdx = content.indexOf('  return (\n    <div className="space-y-6');

if (startIdx !== -1 && endIdx !== -1) {
    const originalPart1 = content.substring(0, startIdx);
    const originalPart2 = content.substring(endIdx);

    const handleSubmitNew = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      showToast('Validation Error', 'Product name and price are required.', 'warning');
      return;
    }

    const numericPrice = parseFloat(formData.price) || 0;
    const numericOriginalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;

    let mediaUrls: string[] = formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [];
    
    // Upload files to Supabase Storage
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const uploadedUrls = [];
        let completed = 0;
        for (let file of files) {
          const fileName = \`\${Date.now()}-\${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}\`;
          
          const { data, error } = await supabase.storage
            .from('products')
            .upload(fileName, file);

          if (!error) {
            const publicUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
            uploadedUrls.push(publicUrl);
          } else {
             console.error("Upload error: ", error);
          }
          completed++;
          setUploadProgress(Math.round((completed / files.length) * 100));
        }
        mediaUrls = uploadedUrls.length > 0 ? uploadedUrls : mediaUrls;
      } catch (err) {
        console.error("Error uploading files", err);
        showToast('Upload Failed', 'Failed to upload media files.', 'error');
      }
      setIsUploading(false);
      setUploadProgress(0);
    }

    if (mediaUrls.length === 0) {
      mediaUrls = ['https://images.unsplash.com/photo-1608248597262-83818e6981f1?auto=format&fit=crop&q=80&w=800'];
    }

    if (editingProduct) {
      const updatedFields: Partial<Product> = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: formData.category,
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        volume: formData.volume.trim() || '50 ml',
        description: formData.description.trim() || \`\${formData.name} - Botanical luxury formulation.\`,
        inStock: formData.inStock,
        isBestseller: formData.isBestseller,
        isOrganic: formData.isOrganic,
        isNew: formData.isNew,
        images: mediaUrls,
        media: mediaUrls.map(url => ({ 
          type: url.match(/\\.(mp4|webm|ogg)$/i) ? 'video' : 'image', 
          src: url 
        }))
      };

      updateProduct(editingProduct.id, updatedFields);
      
      try {
        await adminServices.updateProduct(editingProduct.id, {
          name: formData.name.trim(),
          slug: formData.name.trim().toLowerCase().replace(/\\s+/g, '-'),
          price: numericPrice,
          stock_quantity: formData.inStock ? 50 : 0,
          is_active: formData.inStock,
          description: formData.description.trim()
        }, mediaUrls);
      } catch (e) {
        console.warn("Could not sync with Supabase products table", e);
      }

    } else {
      const newProductData = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: formData.category,
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        volume: formData.volume.trim() || '50 ml',
        description: formData.description.trim() || \`\${formData.name} - Botanical luxury formulation.\`,
        inStock: formData.inStock,
        isBestseller: formData.isBestseller,
        isOrganic: formData.isOrganic,
        isNew: formData.isNew,
        images: mediaUrls,
        media: mediaUrls.map(url => ({ 
          type: url.match(/\\.(mp4|webm|ogg)$/i) ? 'video' : 'image', 
          src: url 
        })),
        ingredients: ['Kumkumadi Oil', 'Saffron Extract', 'Rose Water'],
        howToUse: 'Apply a few drops onto cleansed skin. Massage gently until fully absorbed.',
        skinTypes: ['All Skin Types'],
      };

      const added = addProduct(newProductData);
      
      try {
         await adminServices.createProduct({
           name: newProductData.name,
           slug: newProductData.name.toLowerCase().replace(/\\s+/g, '-'),
           price: newProductData.price,
           stock_quantity: newProductData.inStock ? 50 : 0,
           is_active: newProductData.inStock,
           description: newProductData.description
         }, mediaUrls);
      } catch (e) {
         console.warn("Could not sync with Supabase products table", e);
      }
    }

    setIsModalOpen(false);
  };
`;

    content = originalPart1 + handleSubmitNew + originalPart2;
    fs.writeFileSync('src/components/admin/ProductsManager.tsx', content);
    console.log('Fixed syntax error!');
} else {
    console.log('Could not find boundaries');
}

