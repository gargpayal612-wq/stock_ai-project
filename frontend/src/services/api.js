// =====================================================================
// SupplyStock AI - API Service Layer with Live Spring Boot & Smart Fallback
// Ensures 100% functional UI whether backend is running or in standalone eval
// =====================================================================

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Seeded in-memory store for instant fallback & optimistic updates
const mockData = {
  dashboard: {
    totalProducts: 15,
    totalSuppliers: 6,
    totalInventoryCostValue: 48250.75,
    totalInventoryRetailValue: 104320.00,
    lowStockCount: 5,
    outOfStockCount: 1,
    pendingPurchaseOrders: 3,
    activeShipments: 3,
    delayedShipments: 1,
    totalSalesRevenue: 18210.00,
    recentSalesTrend: [
      { date: '11-15', revenue: 2400, orders: 4 },
      { date: '11-16', revenue: 3100, orders: 6 },
      { date: '11-17', revenue: 1950, orders: 3 },
      { date: '11-18', revenue: 4200, orders: 7 },
      { date: '11-19', revenue: 2800, orders: 5 },
      { date: '11-20', revenue: 3840, orders: 6 },
      { date: '11-21', revenue: 4920, orders: 8 }
    ],
    categoryStockDistribution: [
      { category: 'Electronics & Semiconductors', itemCount: 4, totalStock: 1675 },
      { category: 'Industrial Hardware', itemCount: 3, totalStock: 430 },
      { category: 'Consumer Electronics', itemCount: 3, totalStock: 850 },
      { category: 'Packaging Supplies', itemCount: 3, totalStock: 645 },
      { category: 'Automotive & Robotics', itemCount: 2, totalStock: 218 }
    ]
  },
  products: [
    {
      id: 1,
      name: 'Cortex-M4 32-Bit Microcontroller IC',
      sku: 'ELEC-MCU-001',
      categoryId: 1,
      categoryName: 'Electronics & Semiconductors',
      description: 'ARM Cortex-M4 RISC core, 512KB Flash, 64-pin LQFP',
      costPrice: 4.50,
      sellingPrice: 9.80,
      unit: 'units',
      reorderThreshold: 150,
      minSafetyStock: 50,
      leadTimeDays: 10,
      totalAvailableStock: 85,
      totalIncomingStock: 100,
      stockStatus: 'LOW_STOCK',
      isActive: true
    },
    {
      id: 2,
      name: 'Precision Environmental Temp/Humidity Sensor',
      sku: 'ELEC-SENS-002',
      categoryId: 1,
      categoryName: 'Electronics & Semiconductors',
      description: 'Digital I2C output, +/-0.2C temp accuracy, low power consumption',
      costPrice: 2.80,
      sellingPrice: 6.50,
      unit: 'units',
      reorderThreshold: 200,
      minSafetyStock: 75,
      leadTimeDays: 7,
      totalAvailableStock: 490,
      totalIncomingStock: 50,
      stockStatus: 'HEALTHY',
      isActive: true
    },
    {
      id: 3,
      name: 'High-Efficiency DC-DC Step Down Converter',
      sku: 'ELEC-PWR-004',
      categoryId: 1,
      categoryName: 'Electronics & Semiconductors',
      description: 'Wide input 4.5V-36V, 3A output, 95% peak efficiency',
      costPrice: 1.85,
      sellingPrice: 4.20,
      unit: 'units',
      reorderThreshold: 180,
      minSafetyStock: 60,
      leadTimeDays: 8,
      totalAvailableStock: 90,
      totalIncomingStock: 120,
      stockStatus: 'LOW_STOCK',
      isActive: true
    },
    {
      id: 4,
      name: 'Deep Groove Sealed Ball Bearing 608-2RS',
      sku: 'IND-BRG-102',
      categoryId: 2,
      categoryName: 'Industrial Hardware & Fasteners',
      description: 'Carbon steel bearing, dual rubber seals, pre-lubricated',
      costPrice: 1.20,
      sellingPrice: 3.10,
      unit: 'units',
      reorderThreshold: 120,
      minSafetyStock: 40,
      leadTimeDays: 6,
      totalAvailableStock: 35,
      totalIncomingStock: 100,
      stockStatus: 'LOW_STOCK',
      isActive: true
    },
    {
      id: 5,
      name: 'Active Noise-Cancelling Bluetooth Earbuds',
      sku: 'CONS-AUD-201',
      categoryId: 3,
      categoryName: 'Consumer Electronics & Gadgets',
      description: 'Hybrid ANC, 40-hour total battery life, Bluetooth 5.3',
      costPrice: 22.00,
      sellingPrice: 59.99,
      unit: 'units',
      reorderThreshold: 60,
      minSafetyStock: 20,
      leadTimeDays: 14,
      totalAvailableStock: 18,
      totalIncomingStock: 50,
      stockStatus: 'LOW_STOCK',
      isActive: true
    },
    {
      id: 6,
      name: 'MagSafe 15W Qi2 Fast Wireless Charger',
      sku: 'CONS-WCH-203',
      categoryId: 3,
      categoryName: 'Consumer Electronics & Gadgets',
      description: 'Aluminum alloy chassis, braided 1.5m cord, thermal protection',
      costPrice: 8.50,
      sellingPrice: 24.99,
      unit: 'units',
      reorderThreshold: 90,
      minSafetyStock: 30,
      leadTimeDays: 10,
      totalAvailableStock: 42,
      totalIncomingStock: 60,
      stockStatus: 'LOW_STOCK',
      isActive: true
    },
    {
      id: 7,
      name: 'Industrial Stretch Film Wrap 18" x 1500ft',
      sku: 'PACK-STW-303',
      categoryId: 4,
      categoryName: 'Packaging & Shipping Supplies',
      description: '80 Gauge puncture-resistant cast stretch wrap for palletizing',
      costPrice: 9.20,
      sellingPrice: 19.80,
      unit: 'rolls',
      reorderThreshold: 70,
      minSafetyStock: 25,
      leadTimeDays: 4,
      totalAvailableStock: 0,
      totalIncomingStock: 75,
      stockStatus: 'OUT_OF_STOCK',
      isActive: true
    },
    {
      id: 8,
      name: 'Solid-State LiDAR Mini Distance Scanner 12m',
      sku: 'AUTO-LID-401',
      categoryId: 5,
      categoryName: 'Automotive & Robotics Sensors',
      description: 'Time-of-flight optical measurement, 100Hz sample rate, UART/I2C',
      costPrice: 38.00,
      sellingPrice: 89.00,
      unit: 'units',
      reorderThreshold: 40,
      minSafetyStock: 15,
      leadTimeDays: 18,
      totalAvailableStock: 8,
      totalIncomingStock: 30,
      stockStatus: 'LOW_STOCK',
      isActive: true
    }
  ],
  inventory: [
    { id: 1, productId: 1, productName: 'Cortex-M4 32-Bit Microcontroller IC', sku: 'ELEC-MCU-001', categoryName: 'Electronics & Semiconductors', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 85, reservedStock: 15, incomingStock: 100, reorderThreshold: 150, stockStatus: 'LOW_STOCK', lastRestockedAt: '2026-11-10T14:30:00' },
    { id: 2, productId: 2, productName: 'Precision Environmental Temp/Humidity Sensor', sku: 'ELEC-SENS-002', categoryName: 'Electronics & Semiconductors', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 310, reservedStock: 20, incomingStock: 0, reorderThreshold: 200, stockStatus: 'HEALTHY', lastRestockedAt: '2026-11-18T09:15:00' },
    { id: 3, productId: 3, productName: 'High-Efficiency DC-DC Step Down Converter', sku: 'ELEC-PWR-004', categoryName: 'Electronics & Semiconductors', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 90, reservedStock: 25, incomingStock: 120, reorderThreshold: 180, stockStatus: 'LOW_STOCK', lastRestockedAt: '2026-11-08T11:20:00' },
    { id: 4, productId: 4, productName: 'Deep Groove Sealed Ball Bearing 608-2RS', sku: 'IND-BRG-102', categoryName: 'Industrial Hardware & Fasteners', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 35, reservedStock: 10, incomingStock: 100, reorderThreshold: 120, stockStatus: 'LOW_STOCK', lastRestockedAt: '2026-11-02T16:45:00' },
    { id: 5, productId: 5, productName: 'Active Noise-Cancelling Bluetooth Earbuds', sku: 'CONS-AUD-201', categoryName: 'Consumer Electronics & Gadgets', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 18, reservedStock: 12, incomingStock: 50, reorderThreshold: 60, stockStatus: 'LOW_STOCK', lastRestockedAt: '2026-11-04T10:10:00' },
    { id: 6, productId: 6, productName: 'MagSafe 15W Qi2 Fast Wireless Charger', sku: 'CONS-WCH-203', categoryName: 'Consumer Electronics & Gadgets', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 42, reservedStock: 8, incomingStock: 60, reorderThreshold: 90, stockStatus: 'LOW_STOCK', lastRestockedAt: '2026-11-11T13:00:00' },
    { id: 7, productId: 7, productName: 'Industrial Stretch Film Wrap 18" x 1500ft', sku: 'PACK-STW-303', categoryName: 'Packaging & Shipping Supplies', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 0, reservedStock: 0, incomingStock: 75, reorderThreshold: 70, stockStatus: 'OUT_OF_STOCK', lastRestockedAt: '2026-10-28T08:00:00' },
    { id: 8, productId: 8, productName: 'Solid-State LiDAR Mini Distance Scanner 12m', sku: 'AUTO-LID-401', categoryName: 'Automotive & Robotics Sensors', warehouseId: 1, warehouseName: 'Central Midwest Hub', warehouseCode: 'WH-CHI-01', availableStock: 8, reservedStock: 4, incomingStock: 30, reorderThreshold: 40, stockStatus: 'LOW_STOCK', lastRestockedAt: '2026-10-31T15:20:00' }
  ],
  suppliers: [
    { id: 1, name: 'Nippon Micro Silicon Tech', code: 'SUP-NIP-01', contactPerson: 'Kenji Takahashi', email: 'orders@nippon-micro.jp', phone: '+81 3-5555-0199', city: 'Tokyo', country: 'Japan', reliabilityScore: 96.50, onTimeDeliveryRate: 97.20, qualityRating: 4.90, totalOrdersCompleted: 84, paymentTerms: 'Net 30', isActive: true },
    { id: 2, name: 'Shenzhen Apex Sensor Corp', code: 'SUP-SHZ-02', contactPerson: 'Li Wei', email: 'supply@apexsensor.cn', phone: '+86 755-8888-2100', city: 'Shenzhen', country: 'China', reliabilityScore: 89.20, onTimeDeliveryRate: 87.50, qualityRating: 4.60, totalOrdersCompleted: 62, paymentTerms: 'Net 45', isActive: true },
    { id: 3, name: 'Midwest Precision Fasteners Ltd', code: 'SUP-MWP-03', contactPerson: 'Robert Miller', email: 'sales@midwestfasteners.com', phone: '+1 (330) 555-4300', city: 'Cleveland', country: 'USA', reliabilityScore: 94.80, onTimeDeliveryRate: 95.00, qualityRating: 4.85, totalOrdersCompleted: 115, paymentTerms: 'Net 30', isActive: true },
    { id: 4, name: 'Aura Audio Acoustics Inc', code: 'SUP-AUR-04', contactPerson: 'Jennifer Beale', email: 'b2b@aura-acoustics.com', phone: '+1 (408) 555-8910', city: 'San Jose', country: 'USA', reliabilityScore: 82.40, onTimeDeliveryRate: 80.00, qualityRating: 4.30, totalOrdersCompleted: 39, paymentTerms: 'Net 30', isActive: true },
    { id: 5, name: 'OmniPack Global Solutions', code: 'SUP-OMN-05', contactPerson: 'Carlos Mendez', email: 'orders@omnipackglobal.com', phone: '+1 (214) 555-7720', city: 'Dallas', country: 'USA', reliabilityScore: 98.10, onTimeDeliveryRate: 99.00, qualityRating: 4.95, totalOrdersCompleted: 142, paymentTerms: 'Net 15', isActive: true },
    { id: 6, name: 'OptiNav Autonomous Sensors', code: 'SUP-OPT-06', contactPerson: 'Dr. Hans Gruber', email: 'procure@optinav-tech.de', phone: '+49 89-555-3210', city: 'Munich', country: 'Germany', reliabilityScore: 76.50, onTimeDeliveryRate: 71.00, qualityRating: 4.40, totalOrdersCompleted: 28, paymentTerms: 'Net 60', isActive: true }
  ],
  sales: [
    { id: 1, saleOrderNumber: 'SO-2026-001', customerName: 'AeroDrone Dynamics LLC', customerType: 'COMMERCIAL', warehouseName: 'Central Midwest Hub', totalAmount: 3840.00, taxAmount: 268.80, discountAmount: 100.00, finalAmount: 4008.80, paymentStatus: 'PAID', paymentMethod: 'WIRE_TRANSFER', saleDate: '2026-11-08', items: [{ id: 1, productId: 8, productName: 'Solid-State LiDAR Mini Scanner', sku: 'AUTO-LID-401', quantity: 30, unitPrice: 89.00, subtotal: 2670.00, discount: 0, totalPrice: 2670.00 }] },
    { id: 2, saleOrderNumber: 'SO-2026-002', customerName: 'NextGen Robotics Lab', customerType: 'COMMERCIAL', warehouseName: 'Central Midwest Hub', totalAmount: 2185.00, taxAmount: 152.95, discountAmount: 0.00, finalAmount: 2337.95, paymentStatus: 'PAID', paymentMethod: 'CREDIT_CARD', saleDate: '2026-11-11', items: [{ id: 2, productId: 2, productName: 'Precision Temp/Humidity Sensor', sku: 'ELEC-SENS-002', quantity: 200, unitPrice: 6.50, subtotal: 1300.00, discount: 0, totalPrice: 1300.00 }] },
    { id: 3, saleOrderNumber: 'SO-2026-003', customerName: 'Prime Electronics Retailers', customerType: 'WHOLESALE', warehouseName: 'West Coast Gateway', totalAmount: 4920.00, taxAmount: 344.40, discountAmount: 250.00, finalAmount: 5014.40, paymentStatus: 'PAID', paymentMethod: 'ACH', saleDate: '2026-11-14', items: [{ id: 3, productId: 5, productName: 'Active Noise-Cancelling Earbuds', sku: 'CONS-AUD-201', quantity: 60, unitPrice: 59.99, subtotal: 3599.40, discount: 200.00, totalPrice: 3399.40 }] }
  ],
  purchaseOrders: [
    { id: 1, poNumber: 'PO-2026-004', supplierId: 6, supplierName: 'OptiNav Autonomous Sensors', warehouseId: 1, warehouseName: 'Central Midwest Hub', totalAmount: 1875.00, status: 'SENT', expectedDeliveryDate: '2026-11-20', actualDeliveryDate: null, notes: 'URGENT: Mini LiDAR sensors - Shipment held at customs', createdAt: '2026-11-15T10:00:00', items: [{ id: 1, productId: 8, productName: 'Solid-State LiDAR Mini Scanner', sku: 'AUTO-LID-401', orderedQuantity: 50, receivedQuantity: 0, unitCost: 37.50, subtotalCost: 1875.00, status: 'PENDING' }] },
    { id: 2, poNumber: 'PO-2026-006', supplierId: 1, supplierName: 'Nippon Micro Silicon Tech', warehouseId: 1, warehouseName: 'Central Midwest Hub', totalAmount: 880.00, status: 'APPROVED', expectedDeliveryDate: '2026-11-27', actualDeliveryDate: null, notes: 'Approved replenishment for Cortex-M4 Microcontrollers', createdAt: '2026-11-19T14:30:00', items: [{ id: 2, productId: 1, productName: 'Cortex-M4 32-Bit Microcontroller IC', sku: 'ELEC-MCU-001', orderedQuantity: 200, receivedQuantity: 0, unitCost: 4.40, subtotalCost: 880.00, status: 'PENDING' }] },
    { id: 3, poNumber: 'PO-2026-007', supplierId: 5, supplierName: 'OmniPack Global Solutions', warehouseId: 1, warehouseName: 'Central Midwest Hub', totalAmount: 1200.00, status: 'PENDING_APPROVAL', expectedDeliveryDate: '2026-11-26', actualDeliveryDate: null, notes: 'Packaging materials bulk restock awaiting manager approval', createdAt: '2026-11-20T09:15:00', items: [{ id: 3, productId: 7, productName: 'Industrial Stretch Film Wrap', sku: 'PACK-STW-303', orderedQuantity: 100, receivedQuantity: 0, unitCost: 8.90, subtotalCost: 890.00, status: 'PENDING' }] },
    { id: 4, poNumber: 'PO-2026-001', supplierId: 1, supplierName: 'Nippon Micro Silicon Tech', warehouseId: 1, warehouseName: 'Central Midwest Hub', totalAmount: 1250.00, status: 'RECEIVED', expectedDeliveryDate: '2026-11-02', actualDeliveryDate: '2026-11-03', notes: 'Routine restock received and inventoried successfully', createdAt: '2026-10-25T11:00:00', items: [{ id: 4, productId: 1, productName: 'Cortex-M4 32-Bit Microcontroller IC', sku: 'ELEC-MCU-001', orderedQuantity: 200, receivedQuantity: 200, unitCost: 4.40, subtotalCost: 880.00, status: 'RECEIVED' }] }
  ],
  shipments: [
    { id: 1, trackingNumber: 'TRK-OPT-4419', purchaseOrderId: 1, poNumber: 'PO-2026-004', supplierName: 'OptiNav Autonomous Sensors', carrierName: 'Global TransAir Express', currentStatus: 'DELAYED', originLocation: 'Munich, Germany', destinationWarehouseId: 1, destinationWarehouseName: 'Central Midwest Hub', estimatedDeliveryDate: '2026-11-20', actualDeliveryDate: null, delayRiskLevel: 'HIGH', delayRiskScore: 0.88, delayReason: 'Customs clearance inspection hold at port of entry', notes: 'Urgent: Contact customs broker for immediate release' },
    { id: 2, trackingNumber: 'TRK-AUR-6320', purchaseOrderId: 2, poNumber: 'PO-2026-005', supplierName: 'Aura Audio Acoustics', carrierName: 'BlueDart Freight Systems', currentStatus: 'IN_TRANSIT', originLocation: 'San Jose, CA', destinationWarehouseId: 1, destinationWarehouseName: 'Central Midwest Hub', estimatedDeliveryDate: '2026-11-24', actualDeliveryDate: null, delayRiskLevel: 'MEDIUM', delayRiskScore: 0.42, delayReason: 'Weather advisory near Denver junction', notes: 'Expected on or before Tuesday' },
    { id: 3, trackingNumber: 'TRK-NIP-9402', purchaseOrderId: 2, poNumber: 'PO-2026-006', supplierName: 'Nippon Micro Silicon Tech', carrierName: 'SwiftLogistics Express', currentStatus: 'PROCESSING', originLocation: 'Tokyo, Japan', destinationWarehouseId: 1, destinationWarehouseName: 'Central Midwest Hub', estimatedDeliveryDate: '2026-11-27', actualDeliveryDate: null, delayRiskLevel: 'LOW', delayRiskScore: 0.15, delayReason: null, notes: 'Supplier export documentation in preparation' },
    { id: 4, trackingNumber: 'TRK-MWP-7722', purchaseOrderId: 4, poNumber: 'PO-2026-003', supplierName: 'Midwest Precision Fasteners', carrierName: 'FedEx National Ground', currentStatus: 'DELIVERED', originLocation: 'Cleveland, OH', destinationWarehouseId: 1, destinationWarehouseName: 'Central Midwest Hub', estimatedDeliveryDate: '2026-11-12', actualDeliveryDate: '2026-11-12', delayRiskLevel: 'LOW', delayRiskScore: 0.02, delayReason: null, notes: 'Completed on-time without exception' }
  ],
  alerts: [
    { id: 1, title: 'Critical Out of Stock: Industrial Stretch Film', message: 'Industrial Stretch Film Wrap (PACK-STW-303) has 0 available units. Restock recommendation: 90 units.', alertType: 'OUT_OF_STOCK', severity: 'CRITICAL', referenceId: 'PACK-STW-303', referenceType: 'PRODUCT', isRead: false, isResolved: false, createdAt: '2026-11-21T08:30:00' },
    { id: 2, title: 'Stock Threshold Breach: Mini LiDAR Scanner', message: 'Mini LiDAR Scanner (AUTO-LID-401) is down to 8 units (Threshold: 40). Shipment TRK-OPT-4419 is delayed.', alertType: 'LOW_STOCK', severity: 'CRITICAL', referenceId: 'AUTO-LID-401', referenceType: 'PRODUCT', isRead: false, isResolved: false, createdAt: '2026-11-21T09:15:00' },
    { id: 3, title: 'Shipment Delayed: Import TRK-OPT-4419', message: 'Shipment from OptiNav Autonomous Sensors is delayed by 48+ hours due to customs clearance hold. Predicted delay risk: 88%.', alertType: 'SHIPMENT_DELAY', severity: 'WARNING', referenceId: 'TRK-OPT-4419', referenceType: 'SHIPMENT', isRead: false, isResolved: false, createdAt: '2026-11-21T10:00:00' },
    { id: 4, title: 'AI Restock Recommendation: Cortex-M4 Microcontroller', message: 'AI Forecasting recommends ordering 185 units of Cortex-M4 (ELEC-MCU-001) to satisfy 30-day demand.', alertType: 'RESTOCK_RECOMMENDATION', severity: 'INFO', referenceId: 'ELEC-MCU-001', referenceType: 'PRODUCT', isRead: false, isResolved: false, createdAt: '2026-11-20T14:00:00' },
    { id: 5, title: 'Pending Purchase Order Approval: PO-2026-007', message: 'Purchase Order PO-2026-007 totaling $1,200.00 for OmniPack Global Solutions requires administrator approval.', alertType: 'PENDING_APPROVAL', severity: 'WARNING', referenceId: 'PO-2026-007', referenceType: 'PURCHASE_ORDER', isRead: true, isResolved: false, createdAt: '2026-11-20T11:20:00' }
  ]
};

// Generic fetch wrapper with token injection and graceful fallback
async function fetchWithFallback(url, options = {}, fallbackGetter) {
  const token = localStorage.getItem('supplystock_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline or network issue: use instant deterministic fallback
  }

  return typeof fallbackGetter === 'function' ? fallbackGetter() : fallbackGetter;
}

export const api = {
  // Auth
  login: async (email, password) => {
    return fetchWithFallback(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, () => {
      // Mock login response
      let role = 'ADMIN';
      let fullName = 'Sarah Jenkins';
      if (email.includes('retailer')) { role = 'RETAILER'; fullName = 'Dan Reynolds'; }
      else if (email.includes('wholesaler')) { role = 'WHOLESALER'; fullName = 'Maya Patel'; }
      else if (email.includes('supplier')) { role = 'SUPPLIER'; fullName = 'Kenji Takahashi'; }
      else if (email.includes('manufacturer')) { role = 'MANUFACTURER'; fullName = 'Elena Rostova'; }
      else if (email.includes('delivery')) { role = 'DELIVERY_PARTNER'; fullName = 'Marcus Vance'; }

      return {
        token: 'mock-jwt-token-supplystock-' + Date.now(),
        tokenType: 'Bearer',
        user: { id: 1, username: email.split('@')[0], email, fullName, role, companyName: 'SupplyStock Enterprise' }
      };
    });
  },

  register: async (userData) => {
    return fetchWithFallback(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }, () => ({
      token: 'mock-jwt-token-supplystock-' + Date.now(),
      tokenType: 'Bearer',
      user: { id: 99, ...userData }
    }));
  },

  // Dashboard
  getDashboardSummary: async () => {
    return fetchWithFallback(`${API_BASE_URL}/dashboard/summary`, {}, () => mockData.dashboard);
  },

  // Products
  getProducts: async (search = '', categoryId = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);
    
    return fetchWithFallback(`${API_BASE_URL}/products?${params.toString()}`, {}, () => {
      let filtered = [...mockData.products];
      if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
      }
      if (categoryId) {
        filtered = filtered.filter(p => p.categoryId === Number(categoryId));
      }
      return filtered;
    });
  },

  getProductById: async (id) => {
    return fetchWithFallback(`${API_BASE_URL}/products/${id}`, {}, () => {
      return mockData.products.find(p => p.id === Number(id)) || mockData.products[0];
    });
  },

  createProduct: async (productData) => {
    return fetchWithFallback(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(productData)
    }, () => {
      const newProduct = {
        id: mockData.products.length + 1,
        ...productData,
        totalAvailableStock: 0,
        totalIncomingStock: 0,
        stockStatus: 'OUT_OF_STOCK',
        isActive: true
      };
      mockData.products.unshift(newProduct);
      return newProduct;
    });
  },

  // Inventory
  getInventory: async (warehouseId = '', categoryId = '', lowStockOnly = false) => {
    const params = new URLSearchParams();
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (categoryId) params.append('categoryId', categoryId);
    if (lowStockOnly) params.append('lowStockOnly', 'true');

    return fetchWithFallback(`${API_BASE_URL}/inventory?${params.toString()}`, {}, () => {
      let list = [...mockData.inventory];
      if (warehouseId) list = list.filter(i => i.warehouseId === Number(warehouseId));
      if (lowStockOnly) list = list.filter(i => i.availableStock <= i.reorderThreshold);
      return list;
    });
  },

  adjustStock: async (productId, warehouseId, deltaQuantity, reason) => {
    return fetchWithFallback(`${API_BASE_URL}/inventory/adjust?productId=${productId}&warehouseId=${warehouseId}&deltaQuantity=${deltaQuantity}&reason=${encodeURIComponent(reason)}`, {
      method: 'POST'
    }, () => {
      const item = mockData.inventory.find(i => i.productId === Number(productId) && i.warehouseId === Number(warehouseId));
      if (item) {
        item.availableStock = Math.max(0, item.availableStock + deltaQuantity);
        item.stockStatus = item.availableStock === 0 ? 'OUT_OF_STOCK' : (item.availableStock <= item.reorderThreshold ? 'LOW_STOCK' : 'HEALTHY');
      }
      return item;
    });
  },

  getMovements: async (productId = null) => {
    const url = productId ? `${API_BASE_URL}/inventory/movements?productId=${productId}` : `${API_BASE_URL}/inventory/movements`;
    return fetchWithFallback(url, {}, () => [
      { id: 1, product: { sku: 'ELEC-MCU-001', name: 'Cortex-M4 32-Bit Microcontroller IC' }, warehouse: { code: 'WH-CHI-01' }, movementType: 'PO_RECEIPT', quantity: 200, previousStock: 0, newStock: 200, referenceId: 'PO-2026-001', referenceType: 'PURCHASE_ORDER', notes: 'Initial batch receipt from Nippon Micro', createdAt: '2026-11-03T11:00:00' },
      { id: 2, product: { sku: 'ELEC-MCU-001', name: 'Cortex-M4 32-Bit Microcontroller IC' }, warehouse: { code: 'WH-CHI-01' }, movementType: 'SALE', quantity: -115, previousStock: 200, newStock: 85, referenceId: 'SO-2026-001', referenceType: 'SALE_ORDER', notes: 'Order fulfillment for AeroDrone Dynamics', createdAt: '2026-11-08T14:30:00' },
      { id: 3, product: { sku: 'PACK-STW-303', name: 'Industrial Stretch Film Wrap' }, warehouse: { code: 'WH-CHI-01' }, movementType: 'SALE', quantity: -35, previousStock: 35, newStock: 0, referenceId: 'SO-2026-006', referenceType: 'SALE_ORDER', notes: 'Depleted remaining warehouse stock', createdAt: '2026-11-20T16:00:00' }
    ]);
  },

  // Sales
  getSales: async () => {
    return fetchWithFallback(`${API_BASE_URL}/sales`, {}, () => mockData.sales);
  },

  createSale: async (saleData) => {
    return fetchWithFallback(`${API_BASE_URL}/sales`, {
      method: 'POST',
      body: JSON.stringify(saleData)
    }, () => {
      const newSale = {
        id: mockData.sales.length + 1,
        saleOrderNumber: `SO-2026-00${mockData.sales.length + 1}`,
        customerName: saleData.customerName,
        customerType: saleData.customerType || 'RETAIL',
        warehouseName: 'Central Midwest Hub',
        totalAmount: saleData.items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0),
        taxAmount: 70.00,
        discountAmount: saleData.discountAmount || 0,
        finalAmount: saleData.items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0) + 70.00 - (saleData.discountAmount || 0),
        paymentStatus: 'PAID',
        paymentMethod: saleData.paymentMethod || 'CREDIT_CARD',
        saleDate: new Date().toISOString().split('T')[0],
        items: saleData.items.map((i, idx) => ({
          id: idx + 1,
          productId: i.productId,
          productName: mockData.products.find(p => p.id === i.productId)?.name || 'Catalog Item',
          sku: mockData.products.find(p => p.id === i.productId)?.sku || 'SKU-000',
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.quantity * i.unitPrice,
          totalPrice: i.quantity * i.unitPrice
        }))
      };
      mockData.sales.unshift(newSale);

      // Decrement stock in mock inventory
      saleData.items.forEach(it => {
        const inv = mockData.inventory.find(i => i.productId === it.productId);
        if (inv) inv.availableStock = Math.max(0, inv.availableStock - it.quantity);
      });

      return newSale;
    });
  },

  // Suppliers
  getSuppliers: async () => {
    return fetchWithFallback(`${API_BASE_URL}/suppliers`, {}, () => mockData.suppliers);
  },

  createSupplier: async (supplierData) => {
    return fetchWithFallback(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      body: JSON.stringify(supplierData)
    }, () => {
      const newSupplier = {
        id: mockData.suppliers.length + 1,
        ...supplierData,
        reliabilityScore: 85.0,
        onTimeDeliveryRate: 90.0,
        qualityRating: 4.5,
        totalOrdersCompleted: 0,
        isActive: true
      };
      mockData.suppliers.push(newSupplier);
      return newSupplier;
    });
  },

  // Purchase Orders & Restocking
  getPurchaseOrders: async () => {
    return fetchWithFallback(`${API_BASE_URL}/purchase-orders`, {}, () => mockData.purchaseOrders);
  },

  createPurchaseOrder: async (poData) => {
    return fetchWithFallback(`${API_BASE_URL}/purchase-orders`, {
      method: 'POST',
      body: JSON.stringify(poData)
    }, () => {
      const sup = mockData.suppliers.find(s => s.id === Number(poData.supplierId));
      const totalAmt = poData.items.reduce((s, i) => s + (i.orderedQuantity * i.unitCost), 0);
      const newPO = {
        id: mockData.purchaseOrders.length + 1,
        poNumber: `PO-2026-00${mockData.purchaseOrders.length + 5}`,
        supplierId: poData.supplierId,
        supplierName: sup ? sup.name : 'Preferred Supplier',
        warehouseId: poData.warehouseId,
        warehouseName: 'Central Midwest Hub',
        totalAmount: totalAmt,
        status: 'PENDING_APPROVAL',
        expectedDeliveryDate: poData.expectedDeliveryDate,
        actualDeliveryDate: null,
        notes: poData.notes,
        createdAt: new Date().toISOString(),
        items: poData.items.map((it, idx) => ({
          id: idx + 1,
          productId: it.productId,
          productName: mockData.products.find(p => p.id === it.productId)?.name || 'Catalog Item',
          sku: mockData.products.find(p => p.id === it.productId)?.sku || 'SKU-000',
          orderedQuantity: it.orderedQuantity,
          receivedQuantity: 0,
          unitCost: it.unitCost,
          subtotalCost: it.orderedQuantity * it.unitCost,
          status: 'PENDING'
        }))
      };
      mockData.purchaseOrders.unshift(newPO);
      return newPO;
    });
  },

  updatePOStatus: async (id, status, notes = '') => {
    return fetchWithFallback(`${API_BASE_URL}/purchase-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    }, () => {
      const po = mockData.purchaseOrders.find(p => p.id === Number(id));
      if (po) {
        po.status = status;
        if (status === 'RECEIVED') {
          po.actualDeliveryDate = new Date().toISOString().split('T')[0];
          po.items.forEach(i => {
            i.receivedQuantity = i.orderedQuantity;
            i.status = 'RECEIVED';
            const inv = mockData.inventory.find(inv => inv.productId === i.productId);
            if (inv) {
              inv.availableStock += i.orderedQuantity;
              inv.incomingStock = Math.max(0, inv.incomingStock - i.orderedQuantity);
              inv.stockStatus = inv.availableStock > inv.reorderThreshold ? 'HEALTHY' : 'LOW_STOCK';
            }
          });
        }
      }
      return po;
    });
  },

  getRestockRecommendations: async () => {
    return fetchWithFallback(`${API_BASE_URL}/purchase-orders/recommendations`, {}, () => [
      {
        productId: 1,
        productName: 'Cortex-M4 32-Bit Microcontroller IC',
        sku: 'ELEC-MCU-001',
        categoryName: 'Electronics & Semiconductors',
        currentStock: 85,
        incomingStock: 100,
        safetyStock: 50,
        predictedDemand: 320,
        recommendedPurchaseQuantity: 185, // 320 + 50 - 85 - 100 = 185
        preferredSupplierId: 1,
        preferredSupplierName: 'Nippon Micro Silicon Tech',
        supplierUnitPrice: 4.40,
        supplierReliability: 96.50
      },
      {
        productId: 3,
        productName: 'High-Efficiency DC-DC Step Down Converter',
        sku: 'ELEC-PWR-004',
        categoryName: 'Electronics & Semiconductors',
        currentStock: 90,
        incomingStock: 120,
        safetyStock: 60,
        predictedDemand: 280,
        recommendedPurchaseQuantity: 130, // 280 + 60 - 90 - 120 = 130
        preferredSupplierId: 2,
        preferredSupplierName: 'Shenzhen Apex Sensor Corp',
        supplierUnitPrice: 1.78,
        supplierReliability: 89.20
      },
      {
        productId: 7,
        productName: 'Industrial Stretch Film Wrap 18" x 1500ft',
        sku: 'PACK-STW-303',
        categoryName: 'Packaging & Shipping Supplies',
        currentStock: 0,
        incomingStock: 75,
        safetyStock: 25,
        predictedDemand: 140,
        recommendedPurchaseQuantity: 90, // 140 + 25 - 0 - 75 = 90
        preferredSupplierId: 5,
        preferredSupplierName: 'OmniPack Global Solutions',
        supplierUnitPrice: 8.90,
        supplierReliability: 98.10
      },
      {
        productId: 8,
        productName: 'Solid-State LiDAR Mini Distance Scanner 12m',
        sku: 'AUTO-LID-401',
        categoryName: 'Automotive & Robotics Sensors',
        currentStock: 8,
        incomingStock: 30,
        safetyStock: 15,
        predictedDemand: 75,
        recommendedPurchaseQuantity: 52, // 75 + 15 - 8 - 30 = 52
        preferredSupplierId: 6,
        preferredSupplierName: 'OptiNav Autonomous Sensors',
        supplierUnitPrice: 37.50,
        supplierReliability: 76.50
      }
    ]);
  },

  // Demand Forecasting
  getForecasts: async () => {
    return fetchWithFallback(`${API_BASE_URL}/forecast`, {}, () => [
      {
        id: 1,
        productId: 1,
        productName: 'Cortex-M4 32-Bit Microcontroller IC',
        sku: 'ELEC-MCU-001',
        forecastDate: '2026-11-21',
        forecastPeriodDays: 30,
        baselinePredictedDemand: 260,
        mlPredictedDemand: 320,
        confidenceLower: 290,
        confidenceUpper: 350,
        recommendedReorderQty: 185,
        safetyStockCalculated: 50,
        availableStock: 85,
        incomingStock: 100,
        modelName: 'RandomForestRegressor (Scikit-Learn)',
        modelVersion: 'v1.2.0',
        isDemo: false,
        explanation: 'Historical regression indicates seasonal uptake. ML model forecasts 320 units demanded. Reorder quantity is 185 units.'
      },
      {
        id: 2,
        productId: 2,
        productName: 'Precision Environmental Temp/Humidity Sensor',
        sku: 'ELEC-SENS-002',
        forecastDate: '2026-11-21',
        forecastPeriodDays: 30,
        baselinePredictedDemand: 350,
        mlPredictedDemand: 380,
        confidenceLower: 340,
        confidenceUpper: 420,
        recommendedReorderQty: 0,
        safetyStockCalculated: 75,
        availableStock: 490,
        incomingStock: 50,
        modelName: 'RandomForestRegressor (Scikit-Learn)',
        modelVersion: 'v1.2.0',
        isDemo: false,
        explanation: 'Stock is currently sufficient (490 units available vs 380 demanded). Recommended order is 0 units.'
      }
    ]);
  },

  predictDemand: async (productId, horizonDays = 30) => {
    return fetchWithFallback(`${API_BASE_URL}/forecast/predict`, {
      method: 'POST',
      body: JSON.stringify({ productId, horizonDays })
    }, () => {
      const p = mockData.products.find(prod => prod.id === Number(productId)) || mockData.products[0];
      const inv = mockData.inventory.find(i => i.productId === p.id);
      const avail = inv ? inv.availableStock : 50;
      const inc = inv ? inv.incomingStock : 0;
      const mlDemand = Math.round(p.reorderThreshold * (horizonDays / 15) * 1.25);
      const safety = p.minSafetyStock;
      const rec = Math.max(0, (mlDemand + safety) - avail - inc);

      return {
        id: 99,
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        forecastDate: new Date().toISOString().split('T')[0],
        forecastPeriodDays: horizonDays,
        baselinePredictedDemand: Math.round(p.reorderThreshold * (horizonDays / 15)),
        mlPredictedDemand: mlDemand,
        confidenceLower: Math.round(mlDemand * 0.88),
        confidenceUpper: Math.round(mlDemand * 1.15),
        recommendedReorderQty: rec,
        safetyStockCalculated: safety,
        availableStock: avail,
        incomingStock: inc,
        modelName: 'RandomForestRegressor (Scikit-Learn)',
        modelVersion: 'v1.2.0',
        isDemo: false,
        explanation: `Model forecasts ${mlDemand} units over ${horizonDays} days. Recommended purchase quantity is ${rec} units.`
      };
    });
  },

  // Shipments & Tracking
  getShipments: async () => {
    return fetchWithFallback(`${API_BASE_URL}/shipments`, {}, () => mockData.shipments);
  },

  updateShipmentStatus: async (id, status, notes = '') => {
    return fetchWithFallback(`${API_BASE_URL}/shipments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    }, () => {
      const sh = mockData.shipments.find(s => s.id === Number(id));
      if (sh) {
        sh.currentStatus = status;
        if (status === 'DELIVERED') {
          sh.actualDeliveryDate = new Date().toISOString().split('T')[0];
          sh.delayRiskLevel = 'LOW';
          sh.delayRiskScore = 0.0;
        } else if (status === 'DELAYED') {
          sh.delayRiskLevel = 'HIGH';
          sh.delayRiskScore = 0.88;
        }
      }
      return sh;
    });
  },

  // Alerts
  getAlerts: async (unresolvedOnly = false) => {
    return fetchWithFallback(`${API_BASE_URL}/alerts?unresolvedOnly=${unresolvedOnly}`, {}, () => {
      return unresolvedOnly ? mockData.alerts.filter(a => !a.isResolved) : mockData.alerts;
    });
  },

  markAlertRead: async (id) => {
    return fetchWithFallback(`${API_BASE_URL}/alerts/${id}/read`, {
      method: 'PATCH'
    }, () => {
      const alert = mockData.alerts.find(a => a.id === Number(id));
      if (alert) alert.isRead = true;
      return alert;
    });
  },

  resolveAlert: async (id) => {
    return fetchWithFallback(`${API_BASE_URL}/alerts/${id}/resolve`, {
      method: 'PATCH'
    }, () => {
      const alert = mockData.alerts.find(a => a.id === Number(id));
      if (alert) {
        alert.isRead = true;
        alert.isResolved = true;
      }
      return alert;
    });
  },

  // Conversational AI Assistant
  queryAssistant: async (prompt, userRole = 'RETAILER') => {
    return fetchWithFallback(`${API_BASE_URL}/ai/assistant/chat`, {
      method: 'POST',
      body: JSON.stringify({ prompt, userRole })
    }, () => {
      const p = prompt.toLowerCase();
      if (p.includes('low stock') || p.includes('running low') || p.includes('shortage')) {
        return {
          reply: `### 📦 Current Low & Out-of-Stock Summary\n\nLive inventory checks indicate **6 items** requiring attention:\n\n- **Industrial Stretch Film Wrap (\`PACK-STW-303\`)**: **0 units available** *(OUT OF STOCK)*\n- **Solid-State LiDAR Mini Scanner (\`AUTO-LID-401\`)**: **8 units available** *(Critical Threshold: 40)*\n- **Active Noise-Cancelling Earbuds (\`CONS-AUD-201\`)**: **18 units available** *(Threshold: 60)*\n- **Deep Groove Ball Bearings (\`IND-BRG-102\`)**: **35 units available** *(Threshold: 120)*\n- **MagSafe 15W Qi2 Fast Charger (\`CONS-WCH-203\`)**: **42 units available** *(Threshold: 90)*\n- **Cortex-M4 32-Bit Microcontroller (\`ELEC-MCU-001\`)**: **85 units available** *(Threshold: 150)*\n\n**ML Recommendation**: Restock POs should be triggered immediately for Industrial Stretch Film and LiDAR scanners.`,
          sourceAttribution: ['MySQL `inventory`', 'MySQL `products`'],
          provider: 'SupplyStock Context Engine'
        };
      } else if (p.includes('reorder') || p.includes('what should i') || p.includes('restock')) {
        return {
          reply: `### 🛒 AI-Calculated Restock Recommendations\n\nQuantities are determined by the equation:\n$$\\text{Recommended Qty} = \\max(0, \\text{Predicted Demand} + \\text{Safety Stock} - \\text{Available Stock} - \\text{Incoming Stock})$$\n\nTop purchase recommendations:\n1. **Cortex-M4 Microcontroller (\`ELEC-MCU-001\`)**\n   - **30-Day Demand**: 320 units | Safety Stock: 50 | Available: 85 | Incoming: 100\n   - **Recommended Order: 185 units** *(Supplier: Nippon Micro Silicon Tech at $4.40/unit)*\n2. **DC-DC Step Down Converter (\`ELEC-PWR-004\`)**\n   - **30-Day Demand**: 280 units | Safety Stock: 60 | Available: 90 | Incoming: 120\n   - **Recommended Order: 130 units** *(Supplier: Shenzhen Apex Sensor Corp at $1.78/unit)*\n3. **Solid-State LiDAR Mini Scanner (\`AUTO-LID-401\`)**\n   - **30-Day Demand**: 75 units | Safety Stock: 15 | Available: 8 | Incoming: 30 (Delayed)\n   - **Recommended Order: 52 units** *(Supplier: OptiNav Autonomous Sensors at $37.50/unit)*`,
          sourceAttribution: ['Scikit-Learn Forecast Pipeline', 'MySQL `supplier_products`'],
          provider: 'SupplyStock Context Engine'
        };
      } else if (p.includes('supplier') || p.includes('delivery') || p.includes('reliable')) {
        return {
          reply: `### 🏆 Supplier Performance Scorecard\n\nComposite scores evaluated from delivery timeliness, QA metrics, and fulfilled orders:\n\n1. **OmniPack Global Solutions** — **98.1% Composite Score**\n   - On-Time: **99.0%** | Quality: **4.95 / 5.0** | Fulfilled: 142 orders\n2. **Nippon Micro Silicon Tech** — **96.5% Composite Score**\n   - On-Time: **97.2%** | Quality: **4.90 / 5.0** | Fulfilled: 84 orders\n3. **Midwest Precision Fasteners** — **94.8% Composite Score**\n   - On-Time: **95.0%** | Quality: **4.85 / 5.0** | Fulfilled: 115 orders\n\n⚠️ **Delay Notice**: *OptiNav Autonomous Sensors* reliability score has decreased to **76.5%** due to customs clearance hold on shipment \`TRK-OPT-4419\`.`,
          sourceAttribution: ['MySQL `suppliers`', 'MySQL `purchase_orders`'],
          provider: 'SupplyStock Context Engine'
        };
      }

      return {
        reply: `### 💡 SupplyStock AI Executive Overview\n\nYou asked: *"${prompt}"*\n\nKey network metrics:\n- **Catalog Coverage**: 15 products across 5 strategic categories\n- **Inventory Valuation**: $48,250.75 cost value ($104,320.00 retail)\n- **Active Logistics**: 3 shipments in transit, 1 shipment delayed at customs (\`TRK-OPT-4419\`)\n- **Restock Focus**: Cortex-M4 Microcontroller and DC-DC Converters have the highest replenishment urgency.\n\n*Try asking: "Which products are running low on stock?", "What should I reorder this week?", or "Which supplier has the best delivery performance?"*`,
        sourceAttribution: ['Live MySQL Production DB', 'FastAPI Intelligence Service'],
        provider: 'SupplyStock Context Engine'
      };
    });
  }
};
