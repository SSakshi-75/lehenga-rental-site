import Product from "../models/product.model.js";

// @desc    Get all products (with filtering)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, size, minPrice, maxPrice, search, color } = req.query;
    
    let query = {};

    if (category) query.category = category;
    if (size) query.size = { $in: size.split(",") };
    if (color) query.color = { $regex: color, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // MOCK FALLBACK: If no products found, return mock lehengas for UI demo
    if (products.length === 0) {
      const mockLehengas = [
        {
          _id: "mock1",
          name: "Royal Maroon Bridal Lehenga",
          description: "Exquisite hand-embroidered maroon lehenga with gold zari work.",
          price: 4500,
          size: ["S", "M", "L"],
          color: ["Maroon", "Gold"],
          category: "Bridal Lehenga",
          images: ["https://images.unsplash.com/photo-1595776613215-fe04b78de7d0?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock2",
          name: "Velvet Crimson Bridal Set",
          description: "Deep crimson velvet lehenga with silver zardosi work.",
          price: 5200,
          size: ["M", "L", "XL"],
          color: ["Crimson", "Silver"],
          category: "Bridal Lehenga",
          images: ["https://images.unsplash.com/photo-1610030469915-18880696191c?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock3",
          name: "Sun-Kissed Yellow Festive Lehenga",
          description: "Bright yellow lehenga with mirrors and gota patti work.",
          price: 3200,
          size: ["S", "M", "L"],
          color: ["Yellow"],
          category: "Festive Lehenga",
          images: ["https://images.unsplash.com/photo-1583391733975-ac55106718c7?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock4",
          name: "Blush Pink Festive Lehenga",
          description: "Soft blush pink fabric with traditional Rajasthani gota patti borders.",
          price: 3500,
          size: ["S", "M"],
          color: ["Blush Pink"],
          category: "Festive Lehenga",
          images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock5",
          name: "Emerald Green Designer Piece",
          description: "Modern emerald green lehenga featuring digital printed motifs.",
          price: 5500,
          size: ["M", "L", "XL"],
          color: ["Emerald Green"],
          category: "Designer Pieces",
          images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        }
      ];

      // Filter mocks by category if requested
      if (category) {
        return res.json(mockLehengas.filter(p => p.category === category));
      }
      return res.json(mockLehengas);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // MOCK FALLBACK: Handle mock IDs for UI demo
    if (req.params.id.startsWith("mock")) {
      const mockLehengas = [
        {
          _id: "mock1",
          name: "Royal Maroon Bridal Lehenga",
          description: "Exquisite hand-embroidered maroon lehenga with gold zari work. This masterpiece features premium raw silk fabric and intricate stone detailing.",
          price: 4500,
          size: ["S", "M", "L"],
          color: ["Maroon", "Gold"],
          category: "Bridal Lehenga",
          images: ["https://images.unsplash.com/photo-1595776613215-fe04b78de7d0?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock2",
          name: "Velvet Crimson Bridal Set",
          description: "Deep crimson velvet lehenga with silver zardosi work. A regal choice for a grand wedding celebration.",
          price: 5200,
          size: ["M", "L", "XL"],
          color: ["Crimson", "Silver"],
          category: "Bridal Lehenga",
          images: ["https://images.unsplash.com/photo-1610030469915-18880696191c?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock3",
          name: "Sun-Kissed Yellow Festive Lehenga",
          description: "Bright yellow lehenga with mirrors and gota patti work. Lightweight and vibrant for festive joy.",
          price: 3200,
          size: ["S", "M", "L"],
          color: ["Yellow"],
          category: "Festive Lehenga",
          images: ["https://images.unsplash.com/photo-1583391733975-ac55106718c7?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock4",
          name: "Blush Pink Festive Lehenga",
          description: "Soft blush pink fabric with traditional Rajasthani gota patti borders. Elegant and graceful.",
          price: 3500,
          size: ["S", "M"],
          color: ["Blush Pink"],
          category: "Festive Lehenga",
          images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        },
        {
          _id: "mock5",
          name: "Emerald Green Designer Piece",
          description: "Modern emerald green lehenga featuring digital printed motifs. A contemporary take on traditional luxury.",
          price: 5500,
          size: ["M", "L", "XL"],
          color: ["Emerald Green"],
          category: "Designer Pieces",
          images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop"],
          isAvailable: true,
        }
      ];
      const product = mockLehengas.find(p => p._id === req.params.id);
      if (product) return res.json(product);
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, size, color, category, images, inventory, fabric, work, delivery, securityDeposit } = req.body;

    const product = new Product({
      name,
      description,
      price,
      size,
      color,
      category,
      images,
      inventory,
      fabric,
      work,
      delivery,
      securityDeposit,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, size, color, category, images, inventory, isAvailable, fabric, work, delivery, securityDeposit } = req.body;

    if (req.params.id.startsWith("mock")) {
      return res.status(403).json({ message: "SYSTEM NOTICE: Mock products are read-only. Please add a real product or seed the database to test editing." });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.size = size || product.size;
      product.color = color || product.color;
      product.category = category || product.category;
      product.images = images || product.images;
      product.inventory = inventory || product.inventory;
      product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;
      product.fabric = fabric || product.fabric;
      product.work = work || product.work;
      product.delivery = delivery || product.delivery;
      product.securityDeposit = securityDeposit !== undefined ? securityDeposit : product.securityDeposit;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    if (req.params.id.startsWith("mock")) {
      return res.status(403).json({ message: "SYSTEM NOTICE: Mock products are read-only. Please add a real product or seed the database to test deletion." });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedProducts = async (req, res) => {
  try {
    const lehengas = [
      {
        name: "Royal Maroon Bridal Lehenga",
        description: "Exquisite hand-embroidered maroon lehenga with gold zari work.",
        price: 4500,
        size: ["S", "M", "L"],
        color: ["Maroon", "Gold"],
        category: "Bridal Lehenga",
        images: ["https://images.unsplash.com/photo-1595776613215-fe04b78de7d0?q=80&w=1000&auto=format&fit=crop"],
        isAvailable: true,
        inventory: 2
      },
      {
        name: "Velvet Crimson Bridal Set",
        description: "Deep crimson velvet lehenga with silver zardosi work.",
        price: 5200,
        size: ["M", "L", "XL"],
        color: ["Crimson", "Silver"],
        category: "Bridal Lehenga",
        images: ["https://images.unsplash.com/photo-1610030469915-18880696191c?q=80&w=1000&auto=format&fit=crop"],
        isAvailable: true,
        inventory: 1
      },
      {
        name: "Sun-Kissed Yellow Festive Lehenga",
        description: "Bright yellow lehenga with mirrors and gota patti work.",
        price: 3200,
        size: ["S", "M", "L"],
        color: ["Yellow"],
        category: "Festive Lehenga",
        images: ["https://images.unsplash.com/photo-1583391733975-ac55106718c7?q=80&w=1000&auto=format&fit=crop"],
        isAvailable: true,
        inventory: 4
      },
      {
        name: "Blush Pink Festive Lehenga",
        description: "Soft blush pink fabric with traditional Rajasthani gota patti borders.",
        price: 3500,
        size: ["S", "M"],
        color: ["Blush Pink"],
        category: "Festive Lehenga",
        images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop"],
        isAvailable: true,
        inventory: 3
      },
      {
        name: "Emerald Green Designer Piece",
        description: "Modern emerald green lehenga featuring digital printed motifs.",
        price: 5500,
        size: ["M", "L", "XL"],
        color: ["Emerald Green"],
        category: "Designer Pieces",
        images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop"],
        isAvailable: true,
        inventory: 1
      }
    ];

    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(lehengas);
    res.status(201).json({ message: "Seeded successfully", count: createdProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};
