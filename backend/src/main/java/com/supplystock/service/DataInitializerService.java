package com.supplystock.service;

import com.supplystock.entity.*;
import com.supplystock.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializerService implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final SupplierProductRepository supplierProductRepository;
    private final PurchaseOrderRepository poRepository;
    private final PurchaseOrderItemRepository poiRepository;
    private final ShipmentRepository shipmentRepository;
    private final DemandForecastRepository forecastRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializerService(RoleRepository roleRepository, UserRepository userRepository,
                                  CategoryRepository categoryRepository, ProductRepository productRepository,
                                  WarehouseRepository warehouseRepository, InventoryRepository inventoryRepository,
                                  SupplierRepository supplierRepository, SupplierProductRepository supplierProductRepository,
                                  PurchaseOrderRepository poRepository, PurchaseOrderItemRepository poiRepository,
                                  ShipmentRepository shipmentRepository, DemandForecastRepository forecastRepository,
                                  AlertRepository alertRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.supplierProductRepository = supplierProductRepository;
        this.poRepository = poRepository;
        this.poiRepository = poiRepository;
        this.shipmentRepository = shipmentRepository;
        this.forecastRepository = forecastRepository;
        this.alertRepository = alertRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0 && productRepository.count() > 0) {
            return; // Data already exists
        }

        // 1. Roles
        Role adminRole = roleRepository.save(new Role("ADMIN", "System Administrator with full access"));
        Role retailerRole = roleRepository.save(new Role("RETAILER", "Retail merchant"));
        Role wholesalerRole = roleRepository.save(new Role("WHOLESALER", "Bulk distributor"));
        Role supplierRole = roleRepository.save(new Role("SUPPLIER", "Product vendor"));
        Role mfgRole = roleRepository.save(new Role("MANUFACTURER", "Production partner"));
        Role deliveryRole = roleRepository.save(new Role("DELIVERY_PARTNER", "Logistics carrier"));

        // 2. Default Users (Password: Password@123)
        String hash = passwordEncoder.encode("Password@123");
        userRepository.save(new User("admin", "admin@supplystock.ai", hash, "Sarah Jenkins", adminRole));
        User retailerUser = userRepository.save(new User("retailer_dan", "retailer@supplystock.ai", hash, "Dan Reynolds", retailerRole));
        userRepository.save(new User("wholesaler_maya", "wholesaler@supplystock.ai", hash, "Maya Patel", wholesalerRole));
        userRepository.save(new User("supplier_ken", "supplier@supplystock.ai", hash, "Kenji Takahashi", supplierRole));
        userRepository.save(new User("mfg_elena", "manufacturer@supplystock.ai", hash, "Elena Rostova", mfgRole));
        userRepository.save(new User("carrier_marcus", "delivery@supplystock.ai", hash, "Marcus Vance", deliveryRole));

        // 3. Categories
        Category catElec = categoryRepository.save(new Category("Electronics & Semiconductors", "ELEC-SEMI", "Microcontrollers, ICs, sensors"));
        Category catHard = categoryRepository.save(new Category("Industrial Hardware & Fasteners", "IND-HARD", "Bolts, bearings, pneumatic fittings"));
        Category catCons = categoryRepository.save(new Category("Consumer Electronics & Gadgets", "CONS-ELEC", "Audio, chargers, mobile cables"));
        Category catPack = categoryRepository.save(new Category("Packaging & Shipping Supplies", "PACK-SHIP", "Cartons, stretch film, thermal labels"));
        Category catAuto = categoryRepository.save(new Category("Automotive & Robotics Sensors", "AUTO-SENS", "LiDAR, CAN-bus modules"));

        // 4. Warehouses
        Warehouse wh1 = new Warehouse();
        wh1.setName("Central Midwest Mega Fulfillment Hub");
        wh1.setCode("WH-CHI-01");
        wh1.setLocation("4500 Logistics Blvd, Joliet, IL");
        wh1.setCapacitySqft(250000);
        wh1.setManagerName("Michael Chang");
        wh1 = warehouseRepository.save(wh1);

        Warehouse wh2 = new Warehouse();
        wh2.setName("West Coast Gateway Distribution Center");
        wh2.setCode("WH-LAX-02");
        wh2.setLocation("1280 Harbor Scenic Way, Long Beach, CA");
        wh2.setCapacitySqft(180000);
        wh2.setManagerName("Brenda Morales");
        wh2 = warehouseRepository.save(wh2);

        // 5. Products
        Product p1 = createProduct("Cortex-M4 32-Bit Microcontroller IC", "ELEC-MCU-001", catElec, BigDecimal.valueOf(4.50), BigDecimal.valueOf(9.80), 150, 50, 10);
        Product p2 = createProduct("Precision Environmental Temp/Humidity Sensor", "ELEC-SENS-002", catElec, BigDecimal.valueOf(2.80), BigDecimal.valueOf(6.50), 200, 75, 7);
        Product p3 = createProduct("High-Efficiency DC-DC Step Down Converter", "ELEC-PWR-004", catElec, BigDecimal.valueOf(1.85), BigDecimal.valueOf(4.20), 180, 60, 8);
        Product p4 = createProduct("Deep Groove Sealed Ball Bearing 608-2RS", "IND-BRG-102", catHard, BigDecimal.valueOf(1.20), BigDecimal.valueOf(3.10), 120, 40, 6);
        Product p5 = createProduct("Active Noise-Cancelling Bluetooth Earbuds", "CONS-AUD-201", catCons, BigDecimal.valueOf(22.00), BigDecimal.valueOf(59.99), 60, 20, 14);
        Product p6 = createProduct("MagSafe 15W Qi2 Fast Wireless Charger", "CONS-WCH-203", catCons, BigDecimal.valueOf(8.50), BigDecimal.valueOf(24.99), 90, 30, 10);
        Product p7 = createProduct("Industrial Stretch Film Wrap 18\" x 1500ft", "PACK-STW-303", catPack, BigDecimal.valueOf(9.20), BigDecimal.valueOf(19.80), 70, 25, 4);
        Product p8 = createProduct("Solid-State LiDAR Mini Distance Scanner 12m", "AUTO-LID-401", catAuto, BigDecimal.valueOf(38.00), BigDecimal.valueOf(89.00), 40, 15, 18);

        // 6. Inventory Levels (Some low stock, some out of stock, some healthy)
        createInv(p1, wh1, 85, 15, 100);  // Low stock
        createInv(p2, wh1, 310, 20, 0);   // Healthy
        createInv(p3, wh1, 90, 25, 120);  // Low stock
        createInv(p4, wh1, 35, 10, 100);  // Critical low
        createInv(p5, wh1, 18, 12, 50);   // Critical low
        createInv(p6, wh1, 42, 8, 60);    // Low stock
        createInv(p7, wh1, 0, 0, 75);     // Out of stock
        createInv(p8, wh1, 8, 4, 30);     // Critical low

        // 7. Suppliers
        Supplier s1 = createSup("Nippon Micro Silicon Tech", "SUP-NIP-01", "Kenji Takahashi", "orders@nippon-micro.jp", "+81 3-5555-0199", "Tokyo", "Japan", BigDecimal.valueOf(96.50), BigDecimal.valueOf(97.20), BigDecimal.valueOf(4.90), 84);
        Supplier s2 = createSup("Shenzhen Apex Sensor Corp", "SUP-SHZ-02", "Li Wei", "supply@apexsensor.cn", "+86 755-8888-2100", "Shenzhen", "China", BigDecimal.valueOf(89.20), BigDecimal.valueOf(87.50), BigDecimal.valueOf(4.60), 62);
        Supplier s3 = createSup("Midwest Precision Fasteners Ltd", "SUP-MWP-03", "Robert Miller", "sales@midwestfasteners.com", "+1 (330) 555-4300", "Cleveland", "USA", BigDecimal.valueOf(94.80), BigDecimal.valueOf(95.00), BigDecimal.valueOf(4.85), 115);
        Supplier s4 = createSup("Aura Audio Acoustics Inc", "SUP-AUR-04", "Jennifer Beale", "b2b@aura-acoustics.com", "+1 (408) 555-8910", "San Jose", "USA", BigDecimal.valueOf(82.40), BigDecimal.valueOf(80.00), BigDecimal.valueOf(4.30), 39);
        Supplier s5 = createSup("OmniPack Global Solutions", "SUP-OMN-05", "Carlos Mendez", "orders@omnipackglobal.com", "+1 (214) 555-7720", "Dallas", "USA", BigDecimal.valueOf(98.10), BigDecimal.valueOf(99.00), BigDecimal.valueOf(4.95), 142);
        Supplier s6 = createSup("OptiNav Autonomous Sensors", "SUP-OPT-06", "Dr. Hans Gruber", "procure@optinav-tech.de", "+49 89-555-3210", "Munich", "Germany", BigDecimal.valueOf(76.50), BigDecimal.valueOf(71.00), BigDecimal.valueOf(4.40), 28);

        // 8. Supplier Products Mapping
        createSP(s1, p1, BigDecimal.valueOf(4.40), 10, true);
        createSP(s2, p2, BigDecimal.valueOf(2.65), 7, true);
        createSP(s2, p3, BigDecimal.valueOf(1.78), 8, true);
        createSP(s3, p4, BigDecimal.valueOf(1.15), 6, true);
        createSP(s4, p5, BigDecimal.valueOf(21.50), 14, true);
        createSP(s4, p6, BigDecimal.valueOf(8.20), 10, true);
        createSP(s5, p7, BigDecimal.valueOf(8.90), 4, true);
        createSP(s6, p8, BigDecimal.valueOf(37.50), 18, true);

        // 9. Initial Purchase Orders
        PurchaseOrder po1 = createPO("PO-2026-004", s6, wh1, "SENT", LocalDate.now().minusDays(2), BigDecimal.valueOf(1875.00), retailerUser);
        PurchaseOrder po2 = createPO("PO-2026-006", s1, wh1, "APPROVED", LocalDate.now().plusDays(5), BigDecimal.valueOf(880.00), retailerUser);
        PurchaseOrder po3 = createPO("PO-2026-007", s5, wh1, "PENDING_APPROVAL", LocalDate.now().plusDays(4), BigDecimal.valueOf(1200.00), retailerUser);

        // 10. Initial Shipments
        createShipment("TRK-OPT-4419", po1, "Global TransAir Express", "DELAYED", "Munich, Germany", wh1, LocalDate.now().minusDays(2), "HIGH", BigDecimal.valueOf(0.88), "Customs clearance inspection hold at port of entry");
        createShipment("TRK-NIP-9402", po2, "SwiftLogistics Express", "PROCESSING", "Tokyo, Japan", wh1, LocalDate.now().plusDays(5), "LOW", BigDecimal.valueOf(0.15), null);

        // 11. Initial Forecasts
        createForecast(p1, 320, 260, 185, 50);
        createForecast(p2, 380, 350, 0, 75);
        createForecast(p3, 280, 240, 130, 60);
        createForecast(p8, 75, 60, 52, 15);

        // 12. Realistic Alerts
        createAlert("Critical Out of Stock: Industrial Stretch Film", "Industrial Stretch Film Wrap (PACK-STW-303) has 0 available units. Restock recommendation: 90 units.", "OUT_OF_STOCK", "CRITICAL", "PACK-STW-303");
        createAlert("Stock Threshold Breach: Mini LiDAR Scanner", "Mini LiDAR Scanner (AUTO-LID-401) is down to 8 units (Threshold: 40). Shipment TRK-OPT-4419 is delayed.", "LOW_STOCK", "CRITICAL", "AUTO-LID-401");
        createAlert("Shipment Delayed: Import TRK-OPT-4419", "Shipment from OptiNav Autonomous Sensors is delayed by 48+ hours due to customs clearance hold.", "SHIPMENT_DELAY", "WARNING", "TRK-OPT-4419");
        createAlert("AI Restock Recommendation: Cortex-M4 Microcontroller", "AI Forecasting recommends ordering 185 units of Cortex-M4 (ELEC-MCU-001) to satisfy 30-day demand.", "RESTOCK_RECOMMENDATION", "INFO", "ELEC-MCU-001");
        createAlert("Pending Purchase Order Approval: PO-2026-007", "Purchase Order PO-2026-007 totaling $1,200.00 for OmniPack Global Solutions requires administrator approval.", "PENDING_APPROVAL", "WARNING", "PO-2026-007");
    }

    private Product createProduct(String name, String sku, Category cat, BigDecimal cost, BigDecimal sell, int thresh, int safety, int lead) {
        Product p = new Product();
        p.setName(name);
        p.setSku(sku);
        p.setCategory(cat);
        p.setCostPrice(cost);
        p.setSellingPrice(sell);
        p.setReorderThreshold(thresh);
        p.setMinSafetyStock(safety);
        p.setLeadTimeDays(lead);
        p.setIsActive(true);
        return productRepository.save(p);
    }

    private void createInv(Product p, Warehouse w, int avail, int reserved, int incoming) {
        Inventory inv = new Inventory();
        inv.setProduct(p);
        inv.setWarehouse(w);
        inv.setAvailableStock(avail);
        inv.setReservedStock(reserved);
        inv.setIncomingStock(incoming);
        inv.setLastRestockedAt(LocalDateTime.now().minusDays(10));
        inventoryRepository.save(inv);
    }

    private Supplier createSup(String name, String code, String contact, String email, String phone, String city, String country, BigDecimal rel, BigDecimal onTime, BigDecimal qual, int completed) {
        Supplier s = new Supplier();
        s.setName(name);
        s.setCode(code);
        s.setContactPerson(contact);
        s.setEmail(email);
        s.setPhone(phone);
        s.setCity(city);
        s.setCountry(country);
        s.setReliabilityScore(rel);
        s.setOnTimeDeliveryRate(onTime);
        s.setQualityRating(qual);
        s.setTotalOrdersCompleted(completed);
        s.setIsActive(true);
        return supplierRepository.save(s);
    }

    private void createSP(Supplier s, Product p, BigDecimal price, int lead, boolean pref) {
        SupplierProduct sp = new SupplierProduct();
        sp.setSupplier(s);
        sp.setProduct(p);
        sp.setUnitPrice(price);
        sp.setLeadTimeDays(lead);
        sp.setIsPreferred(pref);
        supplierProductRepository.save(sp);
    }

    private PurchaseOrder createPO(String poNum, Supplier sup, Warehouse wh, String status, LocalDate exp, BigDecimal amt, User user) {
        PurchaseOrder po = new PurchaseOrder();
        po.setPoNumber(poNum);
        po.setSupplier(sup);
        po.setWarehouse(wh);
        po.setStatus(status);
        po.setExpectedDeliveryDate(exp);
        po.setTotalAmount(amt);
        po.setCreatedByUser(user);
        return poRepository.save(po);
    }

    private void createShipment(String trk, PurchaseOrder po, String carrier, String status, String origin, Warehouse wh, LocalDate exp, String risk, BigDecimal score, String reason) {
        Shipment s = new Shipment();
        s.setTrackingNumber(trk);
        s.setPurchaseOrder(po);
        s.setCarrierName(carrier);
        s.setCurrentStatus(status);
        s.setOriginLocation(origin);
        s.setDestinationWarehouse(wh);
        s.setEstimatedDeliveryDate(exp);
        s.setDelayRiskLevel(risk);
        s.setDelayRiskScore(score);
        s.setDelayReason(reason);
        shipmentRepository.save(s);
    }

    private void createForecast(Product p, int ml, int base, int rec, int safety) {
        DemandForecast df = new DemandForecast();
        df.setProduct(p);
        df.setForecastDate(LocalDate.now());
        df.setForecastPeriodDays(30);
        df.setMlPredictedDemand(ml);
        df.setBaselinePredictedDemand(base);
        df.setRecommendedReorderQty(rec);
        df.setSafetyStockCalculated(safety);
        df.setModelName("RandomForestRegressor");
        forecastRepository.save(df);
    }

    private void createAlert(String title, String msg, String type, String sev, String refId) {
        Alert a = new Alert();
        a.setTitle(title);
        a.setMessage(msg);
        a.setAlertType(type);
        a.setSeverity(sev);
        a.setReferenceId(refId);
        a.setIsRead(false);
        a.setIsResolved(false);
        alertRepository.save(a);
    }
}
