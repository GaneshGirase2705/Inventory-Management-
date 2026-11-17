package com.powerplant.sms.service;

import com.powerplant.sms.model.*;
import com.powerplant.sms.model.enums.*;
import com.powerplant.sms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class DataInitializerService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final WarehouseLocationRepository locationRepository;
    private final ItemRepository itemRepository;
    private final ItemStockRepository itemStockRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializerService(UserRepository userRepository,
                                  VendorRepository vendorRepository,
                                  WarehouseLocationRepository locationRepository,
                                  ItemRepository itemRepository,
                                  ItemStockRepository itemStockRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.locationRepository = locationRepository;
        this.itemRepository = itemRepository;
        this.itemStockRepository = itemStockRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (vendorRepository.count() == 0) {
            seedVendors();
        }
        if (locationRepository.count() == 0) {
            seedLocations();
        }
        if (itemRepository.count() == 0) {
            seedItemsAndStock();
        }
    }

    private void seedUsers() {
        String encodedPass = passwordEncoder.encode("password123");

        User storekeeper = new User();
        storekeeper.setUsername("storekeeper");
        storekeeper.setEmail("storekeeper@thermalpower.gov.in");
        storekeeper.setPasswordHash(encodedPass);
        storekeeper.setFullName("Rajesh Sharma");
        storekeeper.setRole(UserRole.STOREKEEPER);
        storekeeper.setDepartment(Department.GENERAL);
        storekeeper.setEmployeeId("EMP-ST-101");
        storekeeper.setPhone("+91 9876543210");
        userRepository.save(storekeeper);

        User maintBoiler = new User();
        maintBoiler.setUsername("maint_boiler");
        maintBoiler.setEmail("boiler.eng@thermalpower.gov.in");
        maintBoiler.setPasswordHash(encodedPass);
        maintBoiler.setFullName("Vikramaditya Roy");
        maintBoiler.setRole(UserRole.MAINTENANCE_ENGINEER);
        maintBoiler.setDepartment(Department.BOILER);
        maintBoiler.setEmployeeId("EMP-ME-204");
        maintBoiler.setPhone("+91 9876543211");
        userRepository.save(maintBoiler);

        User shiftCharge = new User();
        shiftCharge.setUsername("shift_charge");
        shiftCharge.setEmail("sce.unit1@thermalpower.gov.in");
        shiftCharge.setPasswordHash(encodedPass);
        shiftCharge.setFullName("K. Venkatraman");
        shiftCharge.setRole(UserRole.SHIFT_IN_CHARGE);
        shiftCharge.setDepartment(Department.TURBINE_GENERATOR);
        shiftCharge.setEmployeeId("EMP-SC-301");
        shiftCharge.setPhone("+91 9876543212");
        userRepository.save(shiftCharge);

        User qaQc = new User();
        qaQc.setUsername("qa_qc_lead");
        qaQc.setEmail("qaqc@thermalpower.gov.in");
        qaQc.setPasswordHash(encodedPass);
        qaQc.setFullName("Ananya Deshmukh");
        qaQc.setRole(UserRole.QA_QC_ENGINEER);
        qaQc.setDepartment(Department.GENERAL);
        qaQc.setEmployeeId("EMP-QA-401");
        qaQc.setPhone("+91 9876543213");
        userRepository.save(qaQc);

        User hod = new User();
        hod.setUsername("hod_mech");
        hod.setEmail("hod.mech@thermalpower.gov.in");
        hod.setPasswordHash(encodedPass);
        hod.setFullName("Dr. Arun K. Verma");
        hod.setRole(UserRole.HOD);
        hod.setDepartment(Department.BOILER);
        hod.setEmployeeId("EMP-HD-501");
        hod.setPhone("+91 9876543214");
        userRepository.save(hod);

        User plantHead = new User();
        plantHead.setUsername("plant_head");
        plantHead.setEmail("planthead@thermalpower.gov.in");
        plantHead.setPasswordHash(encodedPass);
        plantHead.setFullName("Er. Sanjeev Mehrotra");
        plantHead.setRole(UserRole.PLANT_HEAD);
        plantHead.setDepartment(Department.GENERAL);
        plantHead.setEmployeeId("EMP-PH-001");
        plantHead.setPhone("+91 9876543215");
        userRepository.save(plantHead);

        User admin = new User();
        admin.setUsername("sysadmin");
        admin.setEmail("admin@thermalpower.gov.in");
        admin.setPasswordHash(encodedPass);
        admin.setFullName("System Administrator");
        admin.setRole(UserRole.SYSTEM_ADMIN);
        admin.setDepartment(Department.GENERAL);
        admin.setEmployeeId("EMP-SA-000");
        admin.setPhone("+91 9876543216");
        userRepository.save(admin);
    }

    private void seedVendors() {
        createVendor("VEND-BHEL-01", "Bharat Heavy Electricals Limited (BHEL)", "S. Ganesan", "spares@bhel.in", "+91 431 2577000", "33AAACB1234F1Z1", BigDecimal.valueOf(4.95));
        createVendor("VEND-KSB-02", "KSB Pumps and Valves Ltd", "Mahesh Patil", "pumps@ksb.co.in", "+91 20 27101000", "27AAACK5678B1Z2", BigDecimal.valueOf(4.88));
        createVendor("VEND-LT-03", "Larsen & Toubro Heavy Engineering", "Deepak Sen", "heavyeng@larsentoubro.com", "+91 22 67525656", "27AAACL9012C1Z3", BigDecimal.valueOf(4.90));
        createVendor("VEND-EMER-04", "Emerson Automation Solutions India", "Priya Menon", "process.spares@emerson.com", "+91 22 67047000", "27AAACE3456D1Z4", BigDecimal.valueOf(4.82));
        createVendor("VEND-SIEM-05", "Siemens Energy India Ltd", "Rohan Bhatia", "turbinespares@siemens-energy.com", "+91 124 3838000", "06AAACS7890E1Z5", BigDecimal.valueOf(4.92));
        createVendor("VEND-ABB-06", "ABB India Limited Power Grids", "Naveen Rao", "switchgear.spares@abb.com", "+91 80 22949150", "29AAACA1122G1Z6", BigDecimal.valueOf(4.85));
    }

    private void createVendor(String code, String name, String person, String email, String phone, String gst, BigDecimal rating) {
        Vendor v = new Vendor();
        v.setVendorCode(code);
        v.setVendorName(name);
        v.setContactPerson(person);
        v.setEmail(email);
        v.setPhone(phone);
        v.setGstNumber(gst);
        v.setVendorRating(rating);
        vendorRepository.save(v);
    }

    private void seedLocations() {
        createLocation("Z1", "B01", "R01", "B01", "Z1-B01-R01-B01", "Zone 1 Boiler Heavy Valves");
        createLocation("Z1", "B01", "R02", "B04", "Z1-B01-R02-B04", "Zone 1 Boiler Mechanical Seals Locker");
        createLocation("Z1", "B02", "R01", "B08", "Z1-B02-R01-B08", "Zone 1 Boiler Tubes & Alloy Fittings");
        createLocation("Z1", "B03", "R01", "B12", "Z1-B03-R01-B12", "Zone 1 Sootblower Mechanical Assemblies");
        createLocation("Z1", "B04", "R02", "B12", "Z1-B04-R02-B12", "Zone 1 High-Temperature Gaskets & Sealants");
        createLocation("Z2", "B01", "R01", "B02", "Z2-B01-R01-B02", "Zone 2 Turbine White Metal Bearings");
        createLocation("Z2", "B01", "R02", "B05", "Z2-B01-R02-B05", "Zone 2 Turbine Electro-Hydraulic Actuators");
        createLocation("Z2", "B02", "R01", "B03", "Z2-B02-R01-B03", "Zone 2 Generator Hydrogen Seal Rings");
        createLocation("Z2", "B03", "R01", "B09", "Z2-B03-R01-B09", "Zone 2 Lube Oil Duplex Filter Elements");
        createLocation("Z2", "B04", "R03", "B15", "Z2-B04-R03-B15", "Zone 2 Condenser Rubber Bellow Expansion 48\"");
        createLocation("Z3", "B01", "R01", "B01", "Z3-B01-R01-B01", "Zone 3 Coal Handling Crusher Hammers");
        createLocation("Z3", "B02", "R02", "B06", "Z3-B02-R02-B06", "Zone 3 Conveyor Belting & Wear Rubber Skirts");
        createLocation("Z4", "B01", "R01", "B02", "Z4-B01-R01-B02", "Zone 4 Ash Handling Nihard Slurry Impellers");
        createLocation("Z4", "B02", "R01", "B07", "Z4-B02-R01-B07", "Zone 4 ESP Rapping Hammers & Anvil Blocks");
        createLocation("Z5", "B01", "R01", "B03", "Z5-B01-R01-B03", "Zone 5 Electrical Vacuum Interrupters");
        createLocation("Z5", "B02", "R02", "B08", "Z5-B02-R02-B08", "Zone 5 Transformer OTI Gauges & Relays");
        createLocation("Z6", "B01", "R01", "B04", "Z6-B01-R01-B04", "Zone 6 C&I Smart HART DP Transmitters");
        createLocation("Z6", "B02", "R01", "B10", "Z6-B02-R01-B10", "Zone 6 Zirconia Flue Gas Oxygen Probes");
        createLocation("Z7", "B01", "R01", "B02", "Z7-B01-R01-B02", "Zone 7 Water Treatment 8-Inch RO Membranes");
        createLocation("Z7", "B02", "R01", "B05", "Z7-B02-R01-B05", "Zone 7 Ion Exchange Resins (SAC)");
    }

    private void createLocation(String zone, String bay, String rack, String bin, String code, String desc) {
        WarehouseLocation loc = new WarehouseLocation();
        loc.setZone(zone);
        loc.setBay(bay);
        loc.setRack(rack);
        loc.setBin(bin);
        loc.setLocationCode(code);
        loc.setDescription(desc);
        locationRepository.save(loc);
    }

    private void seedItemsAndStock() {
        WarehouseLocation locZ1B01 = locationRepository.findByLocationCode("Z1-B01-R01-B01").orElse(null);
        WarehouseLocation locZ1B04 = locationRepository.findByLocationCode("Z1-B04-R02-B12").orElse(null);
        WarehouseLocation locZ2B01 = locationRepository.findByLocationCode("Z2-B01-R01-B02").orElse(null);
        WarehouseLocation locZ2B03 = locationRepository.findByLocationCode("Z2-B03-R01-B09").orElse(null);
        WarehouseLocation locZ6B01 = locationRepository.findByLocationCode("Z6-B01-R01-B04").orElse(null);

        // Item 1: Main Steam Safety Relief Valve Disc (A/V)
        Item item1 = createItem("BLR-SRV-001", "BHEL-V-98721", "Main Steam Safety Relief Valve Disc SA-182 F91",
                "Superheater outlet safety relief valve disc assembly, 2500# class, 185 kg/cm2, 540 deg C.",
                "Valves & Trims", Department.BOILER, "EA", AbcClass.A, VedClass.V, 2, 6, 3, 2, false, true, null);
        createStock(item1, locZ1B01, 3, BigDecimal.valueOf(450000.00), "LOT-BHEL-2025-01", null, null);

        // Item 2: Boiler Feed Pump Mechanical Seal (A/V) - Rotable
        Item item2 = createItem("BFP-MCH-002", "KSB-CHTR-350-SEAL", "Boiler Feed Pump Mechanical Seal Cartridge Assembly",
                "Multi-stage boiler feed pump drive-end cartridge mechanical seal, 200 bar rating.",
                "Mechanical Seals", Department.BOILER, "SET", AbcClass.A, VedClass.V, 2, 8, 4, 2, true, true, 730);
        createStock(item2, locationRepository.findByLocationCode("Z1-B01-R02-B04").orElse(locZ1B01), 2, BigDecimal.valueOf(620000.00), "LOT-KSB-2024-11",
                OffsetDateTime.now().plusDays(60), LocalDate.now().plusDays(500));

        // Item 3: HP Turbine Journal Bearing Liner (A/V) - Rotable
        Item item3 = createItem("TRB-BRG-009", "BHEL-KWU-JBR-380", "HP Turbine Journal Bearing White Metal Babbit Liner",
                "KWU design 380mm diameter tilting-pad white metal lined hydrodynamic journal bearing shell.",
                "Turbine Bearings", Department.TURBINE_GENERATOR, "SET", AbcClass.A, VedClass.V, 1, 4, 2, 1, true, true, null);
        createStock(item3, locZ2B01, 2, BigDecimal.valueOf(1280000.00), "LOT-SIEM-2024-10", null, null);

        // Item 4: High-Temp Spiral Wound Graphite Gaskets (C/D)
        Item item4 = createItem("STM-GSK-008", "FLEX-600-DN100", "High-Temp Spiral Wound Graphite Gasket 600# DN100",
                "Main steam auxiliary line spiral wound SS304 inner/outer ring gasket with graphite filler, 100mm NB.",
                "Piping Consumables", Department.BOILER, "EA", AbcClass.C, VedClass.D, 50, 200, 75, 25, false, false, 1825);
        createStock(item4, locZ1B04, 120, BigDecimal.valueOf(1850.00), "LOT-FLX-2025-02", null, LocalDate.now().plusDays(1500));

        // Item 5: Turbine Main Lube Oil Filter (C/E)
        Item item5 = createItem("LUB-FLT-015", "PALL-HC9600FUP16H", "Turbine Main Lube Oil Duplex Filter Element 5-Micron",
                "Microglass synthetic media duplex lube oil cartridge filter element.",
                "Filtration Spares", Department.TURBINE_GENERATOR, "EA", AbcClass.C, VedClass.E, 16, 64, 24, 12, false, false, 730);
        createStock(item5, locZ2B03, 35, BigDecimal.valueOf(8200.00), "LOT-PALL-2025-01", null, LocalDate.now().plusDays(500));

        // Item 6: Smart DP Transmitter (B/V)
        Item item6 = createItem("CNI-TXM-027", "ROSE-3051CD-HART", "Smart Differential Pressure Transmitter HART Protocol 4-20mA",
                "Rosemount coplanar differential pressure transmitter, Hastelloy C-276 diaphragm, -250 to +250 mbar.",
                "Field Transmitters", Department.INSTRUMENTATION, "EA", AbcClass.B, VedClass.V, 4, 18, 6, 3, false, true, 730);
        createStock(item6, locZ6B01, 8, BigDecimal.valueOf(95000.00), "LOT-EMR-2024-11", OffsetDateTime.now().plusDays(90), LocalDate.now().plusDays(600));
    }

    private Item createItem(String code, String partNo, String name, String desc, String cat,
                            Department dept, String uom, AbcClass abc, VedClass ved,
                            int minStock, int maxStock, int rop, int safety,
                            boolean rotable, boolean qaReq, Integer shelfLife) {
        Item item = new Item();
        item.setItemCode(code);
        item.setPartNumber(partNo);
        item.setName(name);
        item.setDescription(desc);
        item.setCategory(cat);
        item.setDepartment(dept);
        item.setUom(uom);
        item.setAbcClassification(abc);
        item.setVedClassification(ved);
        item.setMinStockLevel(minStock);
        item.setMaxStockLevel(maxStock);
        item.setReorderPoint(rop);
        item.setSafetyStock(safety);
        item.setIsRotable(rotable);
        item.setRequiresQaClearance(qaReq);
        item.setShelfLifeDays(shelfLife);
        item.setQrCodeUrl("/api/v1/qr/" + code);
        return itemRepository.save(item);
    }

    private void createStock(Item item, WarehouseLocation loc, int qty, BigDecimal cost,
                             String lot, OffsetDateTime calibration, LocalDate expiry) {
        if (loc == null) return;
        ItemStock stock = new ItemStock();
        stock.setItem(item);
        stock.setLocation(loc);
        stock.setCurrentStock(qty);
        stock.setReservedStock(0);
        stock.setUnitCost(cost);
        stock.setBatchLotNumber(lot);
        stock.setNextCalibrationDue(calibration);
        stock.setExpiryDate(expiry);
        itemStockRepository.save(stock);
    }
}
