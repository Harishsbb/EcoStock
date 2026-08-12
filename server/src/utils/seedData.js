import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}
import User from "../models/User.js";
import Shop from "../models/Shop.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Supplier, { SupplierPriceHistory } from "../models/Supplier.js";
import Sale from "../models/Sale.js";
import InventoryTransaction from "../models/InventoryTransaction.js";
import DiscountRecommendation from "../models/DiscountRecommendation.js";
import SurplusListing from "../models/SurplusListing.js";
import Notification from "../models/Notification.js";

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log("Starting SmartStock database seeding...");

    // Connect DB if not connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartstock");
    }

    // Clean existing seed collections
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await SupplierPriceHistory.deleteMany({});
    await Sale.deleteMany({});
    await InventoryTransaction.deleteMany({});
    await DiscountRecommendation.deleteMany({});
    await SurplusListing.deleteMany({});
    await Notification.deleteMany({});

    // 1. Create Shop
    const shop = await Shop.create({
      name: "FreshMart Organic Grocery",
      address: "42 Connaught Place, Inner Circle, New Delhi",
      phone: "+91 98765 43210",
      category: "Supermarket & Produce",
    });

    // 2. Create Owner and Staff Users
    const owner = await User.create({
      name: "Rajesh Sharma",
      email: "owner@smartstock.com",
      password: "password123",
      role: "OWNER",
      shopId: shop._id,
      phone: "+91 98765 43210",
    });

    const staff = await User.create({
      name: "Amit Patel",
      email: "staff@smartstock.com",
      password: "password123",
      role: "STAFF",
      shopId: shop._id,
      phone: "+91 98765 43211",
    });

    shop.ownerId = owner._id;
    await shop.save();

    // 3. Create Categories
    const categoriesData = ["Dairy & Milk", "Bakery & Bread", "Fresh Produce", "Beverages", "Packaged Snacks", "Personal Care"];
    for (const catName of categoriesData) {
      await Category.create({ name: catName, shopId: shop._id });
    }

    // 4. Create Suppliers
    const supplierA = await Supplier.create({
      name: "Amul Dairy Distributors",
      contactPerson: "Vikram Mehta",
      email: "orders@amuldairy.com",
      phone: "+91 98111 22334",
      address: "Industrial Area Phase II, Okhla",
      productsHandled: ["Dairy & Milk", "Beverages"],
      deliveryDays: 1,
      rating: 4.8,
      shopId: shop._id,
    });

    const supplierB = await Supplier.create({
      name: "Britannia Bakery Supply",
      contactPerson: "Sunil Gupta",
      email: "supply@britannia.com",
      phone: "+91 98222 33445",
      address: "Warehouse Complex, Gurgaon",
      productsHandled: ["Bakery & Bread", "Packaged Snacks"],
      deliveryDays: 2,
      rating: 4.6,
      shopId: shop._id,
    });

    const supplierC = await Supplier.create({
      name: "Nature Fresh Farms",
      contactPerson: "Anjali Rao",
      email: "fresh@naturefarms.com",
      phone: "+91 98333 44556",
      address: "Azadpur Mandi, Delhi",
      productsHandled: ["Fresh Produce"],
      deliveryDays: 1,
      rating: 4.9,
      shopId: shop._id,
    });

    // 5. Helper dates
    const today = new Date();
    const addDays = (d, days) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

    // 6. Create Realistic Products
    const productsData = [
      {
        name: "Amul Taaza Toned Milk 1L",
        sku: "DAIRY-MILK-001",
        barcode: "890126201001",
        category: "Dairy & Milk",
        purchasePrice: 35,
        sellingPrice: 42,
        quantity: 45,
        minimumStock: 20,
        expiryDate: addDays(today, 2), // Near Expiry!
        supplierId: supplierA._id,
        imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Whole Wheat Harvest Bread 400g",
        sku: "BAKERY-BREAD-002",
        barcode: "890126201002",
        category: "Bakery & Bread",
        purchasePrice: 28,
        sellingPrice: 40,
        quantity: 42,
        minimumStock: 15,
        expiryDate: addDays(today, 3), // Near Expiry!
        supplierId: supplierB._id,
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Organic Farm Fresh Eggs 12pk",
        sku: "DAIRY-EGG-003",
        barcode: "890126201003",
        category: "Dairy & Milk",
        purchasePrice: 65,
        sellingPrice: 85,
        quantity: 8, // Low Stock!
        minimumStock: 15,
        expiryDate: addDays(today, 10),
        supplierId: supplierA._id,
        imageUrl: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Greek Style Strawberry Yogurt 200g",
        sku: "DAIRY-YOG-004",
        barcode: "890126201004",
        category: "Dairy & Milk",
        purchasePrice: 45,
        sellingPrice: 65,
        quantity: 25,
        minimumStock: 10,
        expiryDate: addDays(today, 4), // Near Expiry!
        supplierId: supplierA._id,
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Fresh Hass Avocado 500g",
        sku: "PROD-AVO-005",
        barcode: "890126201005",
        category: "Fresh Produce",
        purchasePrice: 140,
        sellingPrice: 220,
        quantity: 18,
        minimumStock: 10,
        expiryDate: addDays(today, 5),
        supplierId: supplierC._id,
        imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Tropicana 100% Orange Juice 1L",
        sku: "BEV-JUICE-006",
        barcode: "890126201006",
        category: "Beverages",
        purchasePrice: 90,
        sellingPrice: 135,
        quantity: 50,
        minimumStock: 15,
        expiryDate: addDays(today, 45),
        supplierId: supplierA._id,
        imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
      },
    ];

    const createdProducts = [];
    for (const p of productsData) {
      const todayZero = new Date();
      todayZero.setHours(0, 0, 0, 0);
      const expZero = new Date(p.expiryDate);
      expZero.setHours(0, 0, 0, 0);
      const days = Math.ceil((expZero.getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24));

      let status = "Healthy";
      if (days <= 0) status = "Expired";
      else if (days <= 7) status = "Near Expiry";
      else if (p.quantity <= p.minimumStock) status = "Low Stock";

      const prod = await Product.create({
        ...p,
        shopId: shop._id,
        status,
      });
      createdProducts.push(prod);
    }

    // 7. Seed Supplier Price History
    for (const prod of createdProducts) {
      await SupplierPriceHistory.create({
        supplierId: supplierA._id,
        productName: prod.name,
        productId: prod._id,
        unitPrice: prod.purchasePrice,
        shopId: shop._id,
      });
      await SupplierPriceHistory.create({
        supplierId: supplierB._id,
        productName: prod.name,
        productId: prod._id,
        unitPrice: Math.round(prod.purchasePrice * 0.92), // Supplier B cheaper!
        shopId: shop._id,
      });
    }

    // 8. Seed Sales History over last 14 days
    for (let i = 14; i >= 0; i--) {
      const saleDate = addDays(today, -i);
      const milkProd = createdProducts[0];
      const breadProd = createdProducts[1];

      await Sale.create({
        shopId: shop._id,
        invoiceNumber: `INV-${100000 + i}`,
        items: [
          {
            productId: milkProd._id,
            name: milkProd.name,
            sku: milkProd.sku,
            quantity: 12 + (i % 5),
            price: milkProd.sellingPrice,
            discountAmount: i <= 2 ? 10 : 0,
            total: (12 + (i % 5)) * (milkProd.sellingPrice - (i <= 2 ? 10 : 0)),
          },
          {
            productId: breadProd._id,
            name: breadProd.name,
            sku: breadProd.sku,
            quantity: 8 + (i % 4),
            price: breadProd.sellingPrice,
            discountAmount: 0,
            total: (8 + (i % 4)) * breadProd.sellingPrice,
          },
        ],
        subtotal: 950 + i * 40,
        discountTotal: i <= 2 ? 120 : 0,
        taxTotal: 45,
        total: 875 + i * 40,
        paymentMethod: i % 2 === 0 ? "UPI" : "CARD",
        soldBy: owner._id,
        createdAt: saleDate,
      });
    }

    // 9. Seed Inventory Transactions & Waste Recovery
    await InventoryTransaction.create({
      shopId: shop._id,
      productId: createdProducts[0]._id,
      productName: createdProducts[0].name,
      type: "DISCOUNT_SALE",
      quantity: 15,
      costValue: 15 * createdProducts[0].purchasePrice,
      recoveredValue: 15 * 30, // ₹450
      reason: "40% Smart Discount Markdown Sale",
      createdBy: owner._id,
    });

    await InventoryTransaction.create({
      shopId: shop._id,
      productId: createdProducts[1]._id,
      productName: createdProducts[1].name,
      type: "EXCHANGE",
      quantity: 20,
      costValue: 20 * createdProducts[1].purchasePrice,
      recoveredValue: 20 * 25, // ₹500
      reason: "Surplus stock exchange with City Bakery Outlet",
      createdBy: owner._id,
    });

    await InventoryTransaction.create({
      shopId: shop._id,
      productId: createdProducts[2]._id,
      productName: createdProducts[2].name,
      type: "WASTE",
      quantity: 4,
      costValue: 4 * createdProducts[2].purchasePrice,
      recoveredValue: 0,
      reason: "Broken egg carton discarded",
      createdBy: staff._id,
    });

    // 10. Seed Smart Discount Recommendation
    await DiscountRecommendation.create({
      shopId: shop._id,
      productId: createdProducts[1]._id,
      productName: createdProducts[1].name,
      currentPrice: 40,
      currentStock: 42,
      daysRemaining: 3,
      recommendedDiscountPercent: 40,
      recommendedPrice: 24,
      expectedRecovery: 1008,
      reason: "40% discount recommended because 42 units remain and only 3 days left before expiry.",
      status: "PENDING",
    });

    // 11. Seed Surplus Listing
    await SurplusListing.create({
      shopId: shop._id,
      shopName: shop.name,
      productId: createdProducts[1]._id,
      productName: createdProducts[1].name,
      category: "Bakery & Bread",
      quantity: 30,
      unit: "packs",
      originalPrice: 40,
      surplusPrice: 20,
      expiryDate: addDays(today, 2),
      locationName: "Connaught Place Hub",
      distanceKm: 1.8,
      contactPhone: "+91 98765 43210",
      status: "ACTIVE",
    });

    // 12. Seed Notifications
    await Notification.create({
      shopId: shop._id,
      title: "Stock Alert",
      message: "Milk may run out in 2 days. Based on recent sales, we recommend ordering 50 units. Supplier B currently offers the lowest price.",
      type: "CRITICAL_LOW_STOCK",
      read: false,
      link: "/forecast",
    });

    await Notification.create({
      shopId: shop._id,
      title: "Expiry Opportunity",
      message: "42 bread units are nearing expiry. A 40% markdown could recover approximately ₹1,008.",
      type: "EXPIRY_WARNING",
      read: false,
      link: "/discounts",
    });

    await Notification.create({
      shopId: shop._id,
      title: "Revenue Recovered",
      message: "₹8,420 recovered from near-expiry inventory this month.",
      type: "REVENUE_RECOVERED",
      read: false,
      link: "/waste",
    });

    console.log("SmartStock Seed Data successfully created!");
    console.log("Credentials:");
    console.log("Owner: owner@smartstock.com / password123");
    console.log("Staff: staff@smartstock.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// If script is executed directly via `node src/utils/seedData.js`
if (process.argv[1] && process.argv[1].endsWith("seedData.js")) {
  seedDatabase().then(() => mongoose.connection.close());
}
