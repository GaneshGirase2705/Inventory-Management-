-- =============================================================================
-- THERMAL POWER PLANT STORE & CRITICAL SPARES MANAGEMENT SYSTEM (SMS)
-- Production Seed Data: 30 Realistic Power Plant Spares, RBAC Users & Workflows
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SEED USERS (Password for all demo users is 'password123')
-- BCrypt: $2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG
-- -----------------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash, full_name, role, department, employee_id, phone) VALUES
('a0000000-0000-0000-0000-000000000001', 'storekeeper', 'storekeeper@thermalpower.gov.in', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG', 'Rajesh Sharma', 'STOREKEEPER', 'GENERAL', 'EMP-ST-101', '+91 9876543210'),
('a0000000-0000-0000-0000-000000000002', 'maint_boiler', 'boiler.eng@thermalpower.gov.in', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG', 'Vikramaditya Roy', 'MAINTENANCE_ENGINEER', 'BOILER', 'EMP-ME-204', '+91 9876543211'),
('a0000000-0000-0000-0000-000000000003', 'shift_charge', 'sce.unit1@thermalpower.gov.in', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG', 'K. Venkatraman', 'SHIFT_IN_CHARGE', 'TURBINE_GENERATOR', 'EMP-SC-301', '+91 9876543212'),
('a0000000-0000-0000-0000-000000000004', 'qa_qc_lead', 'qaqc@thermalpower.gov.in', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG', 'Ananya Deshmukh', 'QA_QC_ENGINEER', 'GENERAL', 'EMP-QA-401', '+91 9876543213'),
('a0000000-0000-0000-0000-000000000005', 'hod_mech', 'hod.mech@thermalpower.gov.in', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG', 'Dr. Arun K. Verma', 'HOD', 'BOILER', 'EMP-HD-501', '+91 9876543214'),
('a0000000-0000-0000-0000-000000000006', 'plant_head', 'planthead@thermalpower.gov.in', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG', 'Er. Sanjeev Mehrotra', 'PLANT_HEAD', 'GENERAL', 'EMP-PH-001', '+91 9876543215'),
('a0000000-0000-0000-0000-000000000007', 'sysadmin', 'admin@thermalpower.gov.in', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.SFxGQxtAp2QKG', 'System Administrator', 'SYSTEM_ADMIN', 'GENERAL', 'EMP-SA-000', '+91 9876543216')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. SEED VENDORS (Power Plant OEMs & Spares Vendors)
-- -----------------------------------------------------------------------------
INSERT INTO vendors (id, vendor_code, vendor_name, contact_person, email, phone, address, gst_number, vendor_rating) VALUES
('b0000000-0000-0000-0000-000000000001', 'VEND-BHEL-01', 'Bharat Heavy Electricals Limited (BHEL)', 'S. Ganesan', 'spares@bhel.in', '+91 431 2577000', 'Tiruchirappalli Boiler Plant Complex, Tamil Nadu', '33AAACB1234F1Z1', 4.95),
('b0000000-0000-0000-0000-000000000002', 'VEND-KSB-02', 'KSB Pumps and Valves Ltd', 'Mahesh Patil', 'pumps@ksb.co.in', '+91 20 27101000', 'Plot 28/1, Pimpri Industrial Area, Pune', '27AAACK5678B1Z2', 4.88),
('b0000000-0000-0000-0000-000000000003', 'VEND-LT-03', 'Larsen & Toubro Heavy Engineering', 'Deepak Sen', 'heavyeng@larsentoubro.com', '+91 22 67525656', 'Powai Works, Saki Vihar Road, Mumbai', '27AAACL9012C1Z3', 4.90),
('b0000000-0000-0000-0000-000000000004', 'VEND-EMER-04', 'Emerson Automation Solutions India', 'Priya Menon', 'process.spares@emerson.com', '+91 22 67047000', 'Chandivali Farm Road, Andheri East, Mumbai', '27AAACE3456D1Z4', 4.82),
('b0000000-0000-0000-0000-000000000005', 'VEND-SIEM-05', 'Siemens Energy India Ltd', 'Rohan Bhatia', 'turbinespares@siemens-energy.com', '+91 124 3838000', 'Gurugram Tech Park, Haryana', '06AAACS7890E1Z5', 4.92),
('b0000000-0000-0000-0000-000000000006', 'VEND-ABB-06', 'ABB India Limited Power Grids', 'Naveen Rao', 'switchgear.spares@abb.com', '+91 80 22949150', 'Peenya Industrial Area, Bengaluru', '29AAACA1122G1Z6', 4.85)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. SEED WAREHOUSE LOCATIONS (4-Level Physical Hierarchy: Zone-Bay-Rack-Bin)
-- -----------------------------------------------------------------------------
INSERT INTO warehouse_locations (id, zone, bay, rack, bin, location_code, description, capacity_level) VALUES
('c0000000-0000-0000-0000-000000000001', 'Z1', 'B01', 'R01', 'B01', 'Z1-B01-R01-B01', 'Zone 1 Boiler Main Bay - Rack 1 Bin 1 (Heavy Valves)', 90),
('c0000000-0000-0000-0000-000000000002', 'Z1', 'B01', 'R02', 'B04', 'Z1-B01-R02-B04', 'Zone 1 Boiler Spares - Mechanical Seals Locker', 75),
('c0000000-0000-0000-0000-000000000003', 'Z1', 'B02', 'R01', 'B08', 'Z1-B02-R01-B08', 'Zone 1 Boiler Tubes & Alloy Fittings', 80),
('c0000000-0000-0000-0000-000000000004', 'Z1', 'B03', 'R01', 'B12', 'Z1-B03-R01-B12', 'Zone 1 Sootblower Mechanical Assemblies', 60),
('c0000000-0000-0000-0000-000000000005', 'Z1', 'B04', 'R02', 'B12', 'Z1-B04-R02-B12', 'Zone 1 High-Temperature Gaskets & Sealants', 85),
('c0000000-0000-0000-0000-000000000006', 'Z2', 'B01', 'R01', 'B02', 'Z2-B01-R01-B02', 'Zone 2 Turbine Bay - White Metal Journal Bearings', 95),
('c0000000-0000-0000-0000-000000000007', 'Z2', 'B01', 'R02', 'B05', 'Z2-B01-R02-B05', 'Zone 2 Turbine Electro-Hydraulic Servo Actuators', 70),
('c0000000-0000-0000-0000-000000000008', 'Z2', 'B02', 'R01', 'B03', 'Z2-B02-R01-B03', 'Zone 2 Generator Hydrogen Seal Rings & Babbit Segments', 65),
('c0000000-0000-0000-0000-000000000009', 'Z2', 'B03', 'R01', 'B09', 'Z2-B03-R01-B09', 'Zone 2 Lube Oil Duplex Micron Filter Elements', 50),
('c0000000-0000-0000-0000-000000000010', 'Z2', 'B04', 'R03', 'B15', 'Z2-B04-R03-B15', 'Zone 2 Condenser Rubber Bellow Expansion Joints 48"', 40),
('c0000000-0000-0000-0000-000000000011', 'Z3', 'B01', 'R01', 'B01', 'Z3-B01-R01-B01', 'Zone 3 Coal Handling - Crusher Hammers & Liners', 85),
('c0000000-0000-0000-0000-000000000012', 'Z3', 'B02', 'R02', 'B06', 'Z3-B02-R02-B06', 'Zone 3 Conveyor Belting & Wear Rubber Skirts', 90),
('c0000000-0000-0000-0000-000000000013', 'Z4', 'B01', 'R01', 'B02', 'Z4-B01-R01-B02', 'Zone 4 Ash Handling - Nihard Slurry Impellers', 80),
('c0000000-0000-0000-0000-000000000014', 'Z4', 'B02', 'R01', 'B07', 'Z4-B02-R01-B07', 'Zone 4 ESP Rapping Hammers & Anvil Blocks', 75),
('c0000000-0000-0000-0000-000000000015', 'Z5', 'B01', 'R01', 'B03', 'Z5-B01-R01-B03', 'Zone 5 Electrical Switchgear - Vacuum Interrupters', 60),
('c0000000-0000-0000-0000-000000000016', 'Z5', 'B02', 'R02', 'B08', 'Z5-B02-R02-B08', 'Zone 5 Transformer OTI Gauges & Protection Relays', 70),
('c0000000-0000-0000-0000-000000000017', 'Z6', 'B01', 'R01', 'B04', 'Z6-B01-R01-B04', 'Zone 6 C&I - Smart HART Differential Pressure Transmitters', 85),
('c0000000-0000-0000-0000-000000000018', 'Z6', 'B02', 'R01', 'B10', 'Z6-B02-R01-B10', 'Zone 6 Zirconia Flue Gas Oxygen Analyzer Probes', 65),
('c0000000-0000-0000-0000-000000000019', 'Z7', 'B01', 'R01', 'B02', 'Z7-B01-R01-B02', 'Zone 7 Water Treatment - 8-Inch RO Membrane Elements', 55),
('c0000000-0000-0000-0000-000000000020', 'Z7', 'B02', 'R01', 'B05', 'Z7-B02-R01-B05', 'Zone 7 Ion Exchange Resins (Strong Acid Cation)', 90)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. SEED ITEMS (30 Authentic Thermal Power Plant Spares)
-- Covers: Boiler, TG, CHP, AHP, Electrical, C&I, WTP
-- Dual ABC-VED Matrix, Shelf-Life, Rotable Flags, Versioning
-- -----------------------------------------------------------------------------
INSERT INTO items (
    id, item_code, part_number, name, description, category, department,
    uom, abc_classification, ved_classification, min_stock_level, max_stock_level,
    reorder_point, safety_stock, is_rotable, requires_qa_clearance, shelf_life_days,
    qr_code_url, image_url, version
) VALUES
-- 1. Boiler - Vital / A (Stops generation immediately if failed)
('d0000000-0000-0000-0000-000000000001', 'BLR-SRV-001', 'BHEL-V-98721', 'Main Steam Safety Relief Valve Disc SA-182 F91',
 'Superheater outlet main steam safety relief valve disc assembly, 2500# class, design pressure 185 kg/cm2, 540 deg C.',
 'Valves & Trims', 'BOILER', 'EA', 'A', 'V', 2, 6, 3, 2, FALSE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/BLR-SRV-001.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/BLR-SRV-001.jpg', 0),

-- 2. Boiler - Vital / A (Rotable assembly)
('d0000000-0000-0000-0000-000000000002', 'BFP-MCH-002', 'KSB-CHTR-350-SEAL', 'Boiler Feed Pump Mechanical Seal Cartridge Assembly',
 'Multi-stage boiler feed pump drive-end cartridge mechanical seal with silicon carbide vs tungsten carbide faces, 200 bar rating.',
 'Mechanical Seals', 'BOILER', 'SET', 'A', 'V', 2, 8, 4, 2, TRUE, TRUE, 730,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/BFP-MCH-002.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/BFP-MCH-002.jpg', 0),

-- 3. Boiler - Vital / B
('d0000000-0000-0000-0000-000000000003', 'SOT-BLW-003', 'BHEL-IK-525-ELM', 'Long Retractable Sootblower Lance Tube & Element',
 'Furnace radiant heat zone sootblower heat-resistant Cr-Mo alloy lance tube element, length 8.5m, high-temp steam nozzle tip.',
 'Sootblowers', 'BOILER', 'EA', 'B', 'V', 4, 16, 6, 3, TRUE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/SOT-BLW-003.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/SOT-BLW-003.jpg', 0),

-- 4. Boiler - Vital / A
('d0000000-0000-0000-0000-000000000004', 'SPH-TUB-004', 'SA213-T91-OD54', 'Platen Superheater Tube Bend SA213-T91 (54mm OD x 8mm WT)',
 'High-temperature creep resistant Grade 91 seamless alloy tube bend for final stage superheater pendant assembly.',
 'Boiler Tubes', 'BOILER', 'MTR', 'A', 'V', 50, 300, 100, 50, FALSE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/SPH-TUB-004.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/SPH-TUB-004.jpg', 0),

-- 5. Boiler - Essential / B
('d0000000-0000-0000-0000-000000000005', 'COA-BRN-005', 'BHEL-TL-NOZ-40', 'Coal Burner Nozzle Tip Silicon Carbide Ceramic Coated',
 'Tangentially fired boiler pulverized coal burner tilt nozzle tip with erosion-resistant ceramic tiles, rating 600 deg C.',
 'Burner Assembly', 'BOILER', 'EA', 'B', 'E', 8, 32, 12, 6, FALSE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/COA-BRN-005.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/COA-BRN-005.jpg', 0),

-- 6. Boiler - Essential / B
('d0000000-0000-0000-0000-000000000006', 'DRM-GLS-006', 'KLING-B4-MICA', 'Boiler Drum Bi-Color Level Gauge Glass & Mica Shield Set',
 'Transparent toughened aluminosilicate level gauge glass strips with high-grade Indian mica protection shields, 220 bar.',
 'Instrumentation Gauges', 'BOILER', 'SET', 'B', 'E', 12, 48, 16, 8, FALSE, TRUE, 1095,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/DRM-GLS-006.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/DRM-GLS-006.jpg', 0),

-- 7. Boiler - Essential / C
('d0000000-0000-0000-0000-000000000007', 'ECN-FLG-007', 'GARF-S316-GRA', 'Economizer Header Handhole Cap Flange Gasket Set',
 'High-tensile oval spiral wound SS316L gasket with flexible graphite filler for economizer inspection handhole caps.',
 'Gaskets & Seals', 'BOILER', 'SET', 'C', 'E', 25, 100, 35, 15, FALSE, FALSE, 1825,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/ECN-FLG-007.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/ECN-FLG-007.jpg', 0),

-- 8. Boiler - Desirable / C (Consumable)
('d0000000-0000-0000-0000-000000000008', 'STM-GSK-008', 'FLEX-600-DN100', 'High-Temp Spiral Wound Graphite Gasket 600# DN100',
 'Main steam auxiliary line spiral wound SS304 inner/outer ring gasket with exfoliated graphite filler, 100mm NB.',
 'Piping Consumables', 'BOILER', 'EA', 'C', 'D', 50, 200, 75, 25, FALSE, FALSE, 1825,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/STM-GSK-008.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/STM-GSK-008.jpg', 0),

-- 9. Turbine - Vital / A (Rotable)
('d0000000-0000-0000-0000-000000000009', 'TRB-BRG-009', 'BHEL-KWU-JBR-380', 'HP Turbine Journal Bearing White Metal Babbit Liner',
 'KWU design 380mm diameter tilting-pad white metal lined hydrodynamic journal bearing shell for HP turbine rotor.',
 'Turbine Bearings', 'TURBINE_GENERATOR', 'SET', 'A', 'V', 1, 4, 2, 1, TRUE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/TRB-BRG-009.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/TRB-BRG-009.jpg', 0),

-- 10. Turbine - Vital / A (Rotable)
('d0000000-0000-0000-0000-000000000010', 'TRB-SRV-010', 'MOOG-D638-341P', 'Main Stop Valve (MSV) Electro-Hydraulic Servo Valve',
 'Moog direct-drive proportional electro-hydraulic servo control valve, 210 bar fire-resistant fluid (FRF) compatible.',
 'Hydraulics & Control', 'TURBINE_GENERATOR', 'EA', 'A', 'V', 2, 6, 3, 2, TRUE, TRUE, 730,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/TRB-SRV-010.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/TRB-SRV-010.jpg', 0),

-- 11. Turbine - Vital / A
('d0000000-0000-0000-0000-000000000011', 'GEN-H2S-011', 'SIEM-H2-SEAL-600', 'Turbine Generator Hydrogen Seal Ring Babbit Lined Segment',
 '500MW generator rotor shaft hydrogen seal ring assembly, brass-backed tin-base babbit, shaft diameter 520mm.',
 'Generator Spares', 'TURBINE_GENERATOR', 'SET', 'A', 'V', 2, 6, 3, 1, TRUE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/GEN-H2S-011.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/GEN-H2S-011.jpg', 0),

-- 12. Turbine - Essential / B
('d0000000-0000-0000-0000-000000000012', 'CND-EXP-012', 'METSO-BEL-48IN', 'Condenser CW Inlet Neoprene Rubber Expansion Joint Bellow 48"',
 'Circulating cooling water inlet duck-fabric reinforced chloroprene rubber flexible expansion arch bellow with steel retaining rings.',
 'Piping & Bellows', 'TURBINE_GENERATOR', 'EA', 'B', 'E', 2, 8, 3, 2, FALSE, TRUE, 1095,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/CND-EXP-012.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/CND-EXP-012.jpg', 0),

-- 13. Turbine - Essential / B (Rotable)
('d0000000-0000-0000-0000-000000000013', 'LUB-PUR-013', 'ALFA-MAB-103-BWL', 'Lube Oil Centrifugal Separator Purifier Bowl Assembly',
 'Turbine lubricating oil disc-stack centrifuge purifier bowl rotor assembly in duplex stainless steel, speed 8500 RPM.',
 'Auxiliary Machinery', 'TURBINE_GENERATOR', 'EA', 'B', 'E', 1, 3, 2, 1, TRUE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/LUB-PUR-013.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/LUB-PUR-013.jpg', 0),

-- 14. Turbine - Vital / B
('d0000000-0000-0000-0000-000000000014', 'GOV-SPD-014', 'WOOD-MPU-5844', 'Electro-Hydraulic Governor Speed Sensor Magnetic Pickup MPU',
 'Woodward magnetic speed sensor probe with 5/8-18 UNF thread for turbine emergency trip speed wheel monitoring (3000 RPM).',
 'Turbine Protection', 'TURBINE_GENERATOR', 'EA', 'B', 'V', 4, 12, 6, 3, FALSE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/GOV-SPD-014.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/GOV-SPD-014.jpg', 0),

-- 15. Turbine - Essential / C
('d0000000-0000-0000-0000-000000000015', 'LUB-FLT-015', 'PALL-HC9600FUP16H', 'Turbine Main Lube Oil Duplex Filter Element 5-Micron',
 'Microglass synthetic media duplex lube oil cartridge filter element with bypass valve differential pressure indicator.',
 'Filtration Spares', 'TURBINE_GENERATOR', 'EA', 'C', 'E', 16, 64, 24, 12, FALSE, FALSE, 730,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/LUB-FLT-015.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/LUB-FLT-015.jpg', 0),

-- 16. Turbine - Desirable / C
('d0000000-0000-0000-0000-000000000016', 'JCK-HSE-016', 'PARK-701-HP-10', 'Turbine Rotor Jacking Oil High-Pressure Hose Assembly 400 Bar',
 'Four-spiral wire reinforced hydraulic jacking oil flexible hose with 3/8" BSP female swivel end fittings.',
 'Hydraulics Consumables', 'TURBINE_GENERATOR', 'EA', 'C', 'D', 8, 30, 12, 6, FALSE, FALSE, 1095,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/JCK-HSE-016.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/JCK-HSE-016.jpg', 0),

-- 17. Coal Handling - Essential / B
('d0000000-0000-0000-0000-000000000017', 'CHP-HMR-017', 'ELEC-RG-HMR-MN', 'Coal Crusher Ring Granulator Hammer Cast Manganese Steel',
 'Heavy austenitic Hadfield manganese steel crusher ring hammer (14% Mn) for raw coal ring granulator crushers.',
 'Crusher Spares', 'COAL_HANDLING', 'EA', 'B', 'E', 60, 250, 90, 40, FALSE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/CHP-HMR-017.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/CHP-HMR-017.jpg', 0),

-- 18. Coal Handling - Desirable / C
('d0000000-0000-0000-0000-000000000018', 'CHP-SKT-018', 'FENN-SKT-20MM', 'Primary Belt Conveyor Skirt Board Rubber Strip 20mm x 200mm',
 'High-abrasion natural and SBR blend dual-seal conveyor skirt rubber roll for chute dust containment, 20m coil.',
 'Conveyor Belting', 'COAL_HANDLING', 'MTR', 'C', 'D', 100, 500, 150, 80, FALSE, FALSE, 1095,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/CHP-SKT-018.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/CHP-SKT-018.jpg', 0),

-- 19. Coal Handling - Essential / B
('d0000000-0000-0000-0000-000000000019', 'CHP-MAG-019', 'ERIEZ-IL-TID-88', 'Overband Magnetic Separator Tramp Iron Detector Sensor Coil',
 'Eddy-current pulsed magnetic search coil antenna assembly for coal belt conveyor iron scrap detection.',
 'Electrical CHP', 'COAL_HANDLING', 'SET', 'B', 'E', 1, 4, 2, 1, FALSE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/CHP-MAG-019.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/CHP-MAG-019.jpg', 0),

-- 20. Coal Handling - Essential / B
('d0000000-0000-0000-0000-000000000020', 'CHP-WGN-020', 'REX-TIP-CYL-160', 'Wagon Tippler Hydraulic Clamping Cylinder Polyurethane Seal Kit',
 'Complete polyurethane stepseal and chevron packing kit for wagon tippler hydraulic side clamp cylinders, 160mm bore.',
 'Hydraulics CHP', 'COAL_HANDLING', 'SET', 'B', 'E', 4, 16, 6, 3, FALSE, FALSE, 730,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/CHP-WGN-020.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/CHP-WGN-020.jpg', 0),

-- 21. Ash Handling - Vital / A (Rotable)
('d0000000-0000-0000-0000-000000000021', 'AHP-SLR-021', 'WARM-10-8-IMP', 'Ash Slurry Disposal Pump Nihard Impeller & Volute Casing',
 'Heavy duty high-chrome white iron (27% Cr) wear-resistant slurry impeller for bottom ash slurry disposal to ash dyke.',
 'Slurry Pumps', 'ASH_HANDLING', 'EA', 'A', 'V', 2, 8, 4, 2, TRUE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/AHP-SLR-021.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/AHP-SLR-021.jpg', 0),

-- 22. Ash Handling - Essential / B
('d0000000-0000-0000-0000-000000000022', 'AHP-CER-022', 'CERA-ORIF-150', 'High-Concentration Slurry Disposal Ceramic Orifice Plate DN150',
 'High-purity sintered alumina (Al2O3 95%) erosion-proof restriction orifice plate for ash line hydraulic balance.',
 'Ash Piping', 'ASH_HANDLING', 'EA', 'B', 'E', 8, 30, 12, 6, FALSE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/AHP-CER-022.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/AHP-CER-022.jpg', 0),

-- 23. Ash Handling - Desirable / C
('d0000000-0000-0000-0000-000000000023', 'AHP-ESP-023', 'BHEL-ESP-RAP-HMR', 'ESP Collecting Electrode Rapping Tumbling Hammer with Pin',
 'Drop-forged carbon steel tumbling hammer with hardened head for Electrostatic Precipitator dust collection plates.',
 'ESP Spares', 'ASH_HANDLING', 'EA', 'C', 'D', 40, 160, 60, 30, FALSE, FALSE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/AHP-ESP-023.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/AHP-ESP-023.jpg', 0),

-- 24. Electrical - Vital / A (Rotable)
('d0000000-0000-0000-0000-000000000024', 'ELE-VCB-024', 'ABB-VG4-6.6KV', '6.6kV Vacuum Circuit Breaker Vacuum Interrupter Bottle Pole',
 'High-voltage vacuum bottle interrupter assembly rated 1250A, 40kA breaking capacity for auxiliary switchgear boards.',
 'HV Switchgear', 'ELECTRICAL', 'EA', 'A', 'V', 3, 12, 5, 2, TRUE, TRUE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/ELE-VCB-024.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/ELE-VCB-024.jpg', 0),

-- 25. Electrical - Essential / B
('d0000000-0000-0000-0000-000000000025', 'ELE-OTI-025', 'QUAL-OTI-150-SW', 'Generator Transformer Oil Temperature Indicator (OTI) with Microswitches',
 'Dial thermometer with liquid expansion capillary probe, 0-150 deg C range, with alarm and trip contacts for GT monitoring.',
 'Transformers', 'ELECTRICAL', 'EA', 'B', 'E', 2, 6, 3, 1, FALSE, TRUE, 1095,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/ELE-OTI-025.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/ELE-OTI-025.jpg', 0),

-- 26. Electrical - Essential / C
('d0000000-0000-0000-0000-000000000026', 'ELE-ARC-026', 'SCHN-M-PRO-ARC', '415V LT Air Circuit Breaker De-ion Arc Chute Assembly 2000A',
 'Magnetic de-ionizing arc divider plate cassette for low tension ACB feeding Boiler Motor Control Centers.',
 'LV Switchgear', 'ELECTRICAL', 'SET', 'C', 'E', 6, 24, 10, 4, FALSE, FALSE, NULL,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/ELE-ARC-026.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/ELE-ARC-026.jpg', 0),

-- 27. Control & Instrumentation - Vital / B
('d0000000-0000-0000-0000-000000000027', 'CNI-TXM-027', 'ROSE-3051CD-HART', 'Smart Differential Pressure Transmitter HART Protocol 4-20mA',
 'Rosemount coplanar differential pressure transmitter, Hastelloy C-276 diaphragm, silicone fill, range -250 to +250 mbar.',
 'Field Transmitters', 'INSTRUMENTATION', 'EA', 'B', 'V', 4, 18, 6, 3, FALSE, TRUE, 730,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/CNI-TXM-027.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/CNI-TXM-027.jpg', 0),

-- 28. Control & Instrumentation - Vital / A
('d0000000-0000-0000-0000-000000000028', 'CNI-O2P-028', 'YOKO-ZR22G-1200', 'Flue Gas In-Situ Zirconia Oxygen Analyzer Detector Probe 1200mm',
 'High-temperature zirconia electrochemical cell probe for boiler furnace combustion flue gas O2 measurement at economizer outlet.',
 'Gas Analyzers', 'INSTRUMENTATION', 'EA', 'A', 'V', 2, 8, 3, 2, FALSE, TRUE, 730,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/CNI-O2P-028.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/CNI-O2P-028.jpg', 0),

-- 29. Water Treatment - Essential / B
('d0000000-0000-0000-0000-000000000029', 'WTP-ROM-029', 'DOW-FILM-BW30-400', 'Reverse Osmosis (RO) Polyamide Spiral Wound Membrane Element 8"',
 'High surface area brackish water RO membrane element, 400 sq.ft active area, 99.5% salt rejection for DM plant pre-treatment.',
 'RO Plant Spares', 'WATER_TREATMENT', 'EA', 'B', 'E', 12, 48, 18, 8, FALSE, TRUE, 1095,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/WTP-ROM-029.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/WTP-ROM-029.jpg', 0),

-- 30. Water Treatment - Essential / B
('d0000000-0000-0000-0000-000000000030', 'WTP-RSN-030', 'THER-T-42-H-SAC', 'Strong Acid Cation Exchange Resin High-Capacity Gel Type (H+ Form)',
 'Polystyrene divinylbenzene matrix spherical bead cation resin for high-pressure boiler makeup water demineralization.',
 'Water Chemicals', 'WATER_TREATMENT', 'LTR', 'B', 'E', 500, 2000, 800, 400, FALSE, TRUE, 730,
 'https://storage.googleapis.com/sms-powerplant-assets/qr/WTP-RSN-030.png', 'https://storage.googleapis.com/sms-powerplant-assets/parts/WTP-RSN-030.jpg', 0)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. SEED ITEM STOCK (Physical Inventory & Bin Level Quantities)
-- -----------------------------------------------------------------------------
INSERT INTO item_stock (
    id, item_id, location_id, current_stock, reserved_stock, unit_cost,
    batch_lot_number, next_calibration_due, expiry_date, version
) VALUES
-- 1. Main Steam Safety Relief Valve Disc (Z1-B01-R01-B01)
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 3, 0, 450000.00, 'LOT-BHEL-2025-01', NULL, NULL, 0),

-- 2. Boiler Feed Pump Mechanical Seal Cartridge (Z1-B01-R02-B04) - LOW STOCK WARNING
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 2, 1, 620000.00, 'LOT-KSB-2024-11', CURRENT_TIMESTAMP + INTERVAL '60 days', CURRENT_DATE + INTERVAL '500 days', 0),

-- 3. Sootblower Lance Tube (Z1-B03-R01-B12)
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 8, 2, 125000.00, 'LOT-BHEL-2025-02', NULL, NULL, 0),

-- 4. Superheater Tube SA213-T91 (Z1-B02-R01-B08)
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 140, 20, 18500.00, 'MILL-HEAT-91-443', NULL, NULL, 0),

-- 5. Coal Burner Nozzle Tip (Z1-B01-R01-B01)
('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 18, 0, 75000.00, 'LOT-BHEL-2025-03', NULL, NULL, 0),

-- 6. Drum Gauge Glass with Mica (Z1-B04-R02-B12)
('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000005', 24, 0, 32000.00, 'LOT-KLG-2024-09', NULL, CURRENT_DATE + INTERVAL '700 days', 0),

-- 7. Economizer Handhole Gaskets (Z1-B04-R02-B12)
('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', 45, 0, 4500.00, 'LOT-GARF-2025-01', NULL, CURRENT_DATE + INTERVAL '1200 days', 0),

-- 8. High-Temp Spiral Wound Graphite Gaskets (Z1-B04-R02-B12)
('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000005', 120, 10, 1850.00, 'LOT-FLX-2025-02', NULL, CURRENT_DATE + INTERVAL '1500 days', 0),

-- 9. HP Turbine Journal Bearing Liner (Z2-B01-R01-B02)
('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000006', 2, 0, 1280000.00, 'LOT-SIEM-2024-10', NULL, NULL, 0),

-- 10. MSV Hydraulic Servo Valve (Z2-B01-R02-B05) - LOW STOCK WARNING
('e0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000007', 2, 1, 580000.00, 'LOT-MOOG-2024-12', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_DATE + INTERVAL '400 days', 0),

-- 11. Generator Hydrogen Seal Ring (Z2-B02-R01-B03)
('e0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000008', 3, 0, 890000.00, 'LOT-SIEM-2024-08', NULL, NULL, 0),

-- 12. Condenser Neoprene Bellow 48" (Z2-B04-R03-B15)
('e0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000010', 4, 0, 310000.00, 'LOT-MTS-2024-05', NULL, CURRENT_DATE + INTERVAL '600 days', 0),

-- 13. Lube Oil Purifier Bowl (Z2-B01-R01-B02)
('e0000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000006', 2, 0, 240000.00, 'LOT-ALFA-2024-02', NULL, NULL, 0),

-- 14. Magnetic Pickup Speed Sensor (Z2-B01-R02-B05)
('e0000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000007', 8, 2, 48000.00, 'LOT-WDW-2025-01', CURRENT_TIMESTAMP + INTERVAL '180 days', NULL, 0),

-- 15. Turbine Main Lube Oil 5-Micron Filter (Z2-B03-R01-B09)
('e0000000-0000-0000-0000-000000000015', 'd0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000009', 35, 5, 8200.00, 'LOT-PALL-2025-01', NULL, CURRENT_DATE + INTERVAL '500 days', 0),

-- 16. Jacking Oil High-Pressure Hose (Z2-B03-R01-B09)
('e0000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000009', 14, 0, 14500.00, 'LOT-PARK-2024-11', CURRENT_TIMESTAMP + INTERVAL '90 days', CURRENT_DATE + INTERVAL '700 days', 0),

-- 17. Coal Crusher Ring Granulator Hammer (Z3-B01-R01-B01)
('e0000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000011', 110, 20, 16500.00, 'HEAT-MN-2025-04', NULL, NULL, 0),

-- 18. Conveyor Skirt Rubber 20mm (Z3-B02-R02-B06)
('e0000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000012', 240, 40, 2200.00, 'LOT-FEN-2024-12', NULL, CURRENT_DATE + INTERVAL '800 days', 0),

-- 19. Tramp Iron Detector Sensor Coil (Z3-B01-R01-B01)
('e0000000-0000-0000-0000-000000000019', 'd0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000011', 2, 0, 185000.00, 'LOT-ERZ-2024-07', CURRENT_TIMESTAMP + INTERVAL '120 days', NULL, 0),

-- 20. Wagon Tippler Seal Kit (Z3-B02-R02-B06)
('e0000000-0000-0000-0000-000000000020', 'd0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000012', 8, 2, 28000.00, 'LOT-REX-2024-10', NULL, CURRENT_DATE + INTERVAL '500 days', 0),

-- 21. Ash Slurry Pump Nihard Impeller (Z4-B01-R01-B02) - CRITICAL MINIMUM
('e0000000-0000-0000-0000-000000000021', 'd0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000013', 3, 1, 380000.00, 'CAST-CR27-991', NULL, NULL, 0),

-- 22. Ceramic Restriction Orifice Plate (Z4-B02-R01-B07)
('e0000000-0000-0000-0000-000000000022', 'd0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000014', 15, 0, 42000.00, 'LOT-CER-2024-11', NULL, NULL, 0),

-- 23. ESP Rapping Tumbling Hammer (Z4-B02-R01-B07)
('e0000000-0000-0000-0000-000000000023', 'd0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000014', 85, 0, 3500.00, 'LOT-BHEL-2025-01', NULL, NULL, 0),

-- 24. 6.6kV Vacuum Interrupter Bottle (Z5-B01-R01-B03)
('e0000000-0000-0000-0000-000000000024', 'd0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000015', 5, 0, 215000.00, 'LOT-ABB-2024-09', CURRENT_TIMESTAMP + INTERVAL '240 days', NULL, 0),

-- 25. Transformer OTI Indicator (Z5-B02-R02-B08)
('e0000000-0000-0000-0000-000000000025', 'd0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000016', 4, 1, 45000.00, 'LOT-QLT-2024-06', CURRENT_TIMESTAMP + INTERVAL '45 days', CURRENT_DATE + INTERVAL '800 days', 0),

-- 26. 415V ACB Arc Chute Assembly (Z5-B01-R01-B03)
('e0000000-0000-0000-0000-000000000026', 'd0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000015', 12, 0, 18500.00, 'LOT-SCH-2025-01', NULL, NULL, 0),

-- 27. Smart DP Transmitter (Z6-B01-R01-B04)
('e0000000-0000-0000-0000-000000000027', 'd0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000017', 8, 2, 95000.00, 'LOT-EMR-2024-11', CURRENT_TIMESTAMP + INTERVAL '90 days', CURRENT_DATE + INTERVAL '600 days', 0),

-- 28. Zirconia Flue Gas O2 Probe (Z6-B02-R01-B10)
('e0000000-0000-0000-0000-000000000028', 'd0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000018', 3, 1, 310000.00, 'LOT-YOKO-2024-10', CURRENT_TIMESTAMP + INTERVAL '60 days', CURRENT_DATE + INTERVAL '500 days', 0),

-- 29. 8-inch RO Membrane Element (Z7-B01-R01-B02)
('e0000000-0000-0000-0000-000000000029', 'd0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000019', 24, 6, 68000.00, 'LOT-DOW-2025-02', NULL, CURRENT_DATE + INTERVAL '900 days', 0),

-- 30. Cation Ion Exchange Resin Strong Acid (Z7-B02-R01-B05)
('e0000000-0000-0000-0000-000000000030', 'd0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000020', 1200, 200, 280.00, 'LOT-THRM-2024-09', NULL, CURRENT_DATE + INTERVAL '400 days', 0)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 6. SEED ROTABLE SPARES (Serialized Heavy Assemblies)
-- -----------------------------------------------------------------------------
INSERT INTO rotable_spares (
    id, item_id, serial_number, current_status, plant_unit, current_equipment_tag,
    location_id, last_overhaul_date, next_overhaul_due, accumulated_running_hours, overhaul_count, remarks
) VALUES
('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'BFP-SEAL-SN-2023-01', 'IN_STORE_READY', 'UNIT_1', 'BFP-1A', 'c0000000-0000-0000-0000-000000000002', '2025-10-15', '2027-10-15', 8500, 2, 'Serviced and dynamically tested at KSB works.'),
('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000009', 'TRB-BRG-KWU-SN-8821', 'INSTALLED_ACTIVE', 'UNIT_1', 'TG-1-HP-BEARING', NULL, '2024-05-10', '2028-05-10', 14200, 1, 'Currently fitted on Unit 1 HP turbine rotor.'),
('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000010', 'MOOG-SERVO-SN-44129', 'IN_WORKSHOP_REPAIR', 'UNIT_2', 'MSV-2-ACTUATOR', 'c0000000-0000-0000-0000-000000000007', '2023-08-20', '2026-08-20', 21000, 3, 'Spool valve seal replacement underway in C&I workshop.'),
('f0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000021', 'AHP-IMP-WARM-SN-0982', 'IN_STORE_READY', 'COMMON', 'ASH-PUMP-3', 'c0000000-0000-0000-0000-000000000013', '2025-12-01', '2026-12-01', 3200, 1, 'Balanced dynamically, stored with protective oil wrap.'),
('f0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000024', 'ABB-VCB-6.6-SN-55610', 'IN_STORE_READY', 'UNIT_2', 'SWBD-2A-IC-01', 'c0000000-0000-0000-0000-000000000015', '2025-06-18', '2029-06-18', 6400, 1, 'Contact resistance measured 22 micro-ohms; within limits.')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 7. SEED SAMPLE PURCHASE ORDERS & GATE ENTRIES
-- -----------------------------------------------------------------------------
INSERT INTO purchase_orders (id, po_number, vendor_id, po_date, delivery_due_date, total_value, status, created_by, approved_by) VALUES
('10000000-0000-0000-0000-000000000001', 'PO-2026-BHEL-0042', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '45 days', 2450000.00, 'PARTIALLY_DELIVERED', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005'),
('10000000-0000-0000-0000-000000000002', 'PO-2026-KSB-0089', 'b0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 1860000.00, 'ISSUED_TO_VENDOR', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005')
ON CONFLICT (id) DO NOTHING;

INSERT INTO gate_entries (
    id, gate_pass_number, po_id, vendor_id, vehicle_number, driver_name,
    driver_phone, challan_number, challan_date, challan_gcs_url, entry_timestamp,
    security_officer_id, status, remarks
) VALUES
('20000000-0000-0000-0000-000000000001', 'GP-2026-0391', '10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'MH-12-RN-4821', 'Ramesh Yadav', '+91 9922114433', 'CH-BHEL-TR-99812', CURRENT_DATE - INTERVAL '2 days', 'https://storage.googleapis.com/sms-powerplant-assets/challans/CH-BHEL-TR-99812.pdf', CURRENT_TIMESTAMP - INTERVAL '2 days', 'a0000000-0000-0000-0000-000000000001', 'ENTERED_GATE', 'Consignment received at Central Gate 1; paperwork intact.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO goods_receipt_notes (
    id, grn_number, gate_entry_id, po_id, qa_status, qa_engineer_id,
    qa_inspection_date, qa_remarks, test_certificate_url, received_by
) VALUES
('30000000-0000-0000-0000-000000000001', 'GRN-2026-0128', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'PASSED', 'a0000000-0000-0000-0000-000000000004', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Dimension & hydrostatic test certificate verified. Material Heat no stamped properly.', 'https://storage.googleapis.com/sms-powerplant-assets/certs/TC-SA213-T91.pdf', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 8. SEED INDENTS (Regular & Emergency Breakdown Override)
-- -----------------------------------------------------------------------------
INSERT INTO indents (
    id, indent_number, department, plant_unit, work_order_number, indent_type,
    priority, is_emergency_override, emergency_justification, post_facto_approved,
    post_facto_approved_by, post_facto_approval_time, post_facto_deadline,
    status, requested_by, current_approver_role, approver_id, approver_remarks
) VALUES
-- Indent 1: Regular Overhaul Requisition (Approved)
('40000000-0000-0000-0000-000000000001', 'IND-2026-BLR-0081', 'BOILER', 'UNIT_1', 'WO-2026-OH-041', 'REGULAR',
 'HIGH', FALSE, NULL, FALSE, NULL, NULL, NULL,
 'APPROVED', 'a0000000-0000-0000-0000-000000000002', 'STOREKEEPER', 'a0000000-0000-0000-0000-000000000005', 'Approved for Unit 1 scheduled overhaul maintenance.'),

-- Indent 2: Emergency Midnight Breakdown Override (Issued under emergency clause, awaiting post-facto HOD signoff)
('40000000-0000-0000-0000-000000000002', 'IND-2026-EMG-0012', 'TURBINE_GENERATOR', 'UNIT_2', 'WO-2026-TRIP-019', 'EMERGENCY_BREAKDOWN',
 'CRITICAL', TRUE, 'Unit 2 BFP-2B primary seal catastrophic failure at 02:15 AM causing severe deaerator level drop. Immediate spare issued to prevent 250MW generation loss.',
 FALSE, NULL, NULL, CURRENT_TIMESTAMP + INTERVAL '18 hours',
 'EMERGENCY_ISSUED', 'a0000000-0000-0000-0000-000000000003', 'HOD', NULL, 'Emergency override initiated by Shift Charge Engineer.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO indent_items (id, indent_id, item_id, requested_qty, issued_qty, remarks) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000008', 20, 20, 'For boiler reheater header flange bolt tightening.'),
('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 1, 1, 'Emergency issue to Shift Charge Engineer at 02:30 AM.')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 9. SEED STOCK LEDGER (Append-Only Audit Log)
-- -----------------------------------------------------------------------------
INSERT INTO stock_ledger (
    id, transaction_uuid, transaction_timestamp, transaction_type, item_id,
    location_id, reference_doc_number, qty_in, qty_out, balance_after, performed_by, remarks
) VALUES
('60000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '10 days', 'INWARD_GRN', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'GRN-2026-0099', 3, 0, 3, 'a0000000-0000-0000-0000-000000000001', 'Initial consignment binning post QA clearance'),
('60000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '6 hours', 'EMERGENCY_ISSUE', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'IND-2026-EMG-0012', 0, 1, 2, 'a0000000-0000-0000-0000-000000000001', 'Emergency breakdown issue for Unit 2 BFP-2B')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 10. SEED SCRAP & CONDEMNATION LEDGER
-- -----------------------------------------------------------------------------
INSERT INTO scrap_ledger (
    id, scrap_lot_number, item_id, rotable_id, condemned_date, condemnation_reason,
    estimated_salvage_value, scrap_status, auction_batch_id, approved_by_hod_id, scrap_certificate_url
) VALUES
('80000000-0000-0000-0000-000000000001', 'SCRAP-2026-LOT-04', 'd0000000-0000-0000-0000-000000000021', NULL, CURRENT_DATE - INTERVAL '30 days', 'Bottom ash slurry pump impeller eroded beyond reclamation limit; casing wall thickness below 4mm safety threshold.', 15000.00, 'CONDEMNED_PENDING_AUCTION', 'AUC-2026-Q1', 'a0000000-0000-0000-0000-000000000005', 'https://storage.googleapis.com/sms-powerplant-assets/scrap/SCRAP-CERT-04.pdf')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 11. SEED CONSUMPTION HISTORY (Sample Records for AI LightGBM / Anomaly Testing)
-- -----------------------------------------------------------------------------
INSERT INTO consumption_history (component_name, plant_unit, consumption_date, daily_usage, running_hours, failure_event) VALUES
('Boiler Feed Pump Mechanical Seal Cartridge Assembly', 'UNIT_1', CURRENT_DATE - INTERVAL '90 days', 0.0333, 24.0, FALSE),
('Boiler Feed Pump Mechanical Seal Cartridge Assembly', 'UNIT_1', CURRENT_DATE - INTERVAL '60 days', 0.0333, 24.0, FALSE),
('Boiler Feed Pump Mechanical Seal Cartridge Assembly', 'UNIT_1', CURRENT_DATE - INTERVAL '30 days', 0.0333, 24.0, FALSE),
('Boiler Feed Pump Mechanical Seal Cartridge Assembly', 'UNIT_1', CURRENT_DATE - INTERVAL '1 day', 1.0000, 24.0, TRUE), -- Failure spike event
('Turbine Main Lube Oil Duplex Filter Element 5-Micron', 'UNIT_1', CURRENT_DATE - INTERVAL '45 days', 0.1500, 24.0, FALSE),
('Turbine Main Lube Oil Duplex Filter Element 5-Micron', 'UNIT_1', CURRENT_DATE - INTERVAL '15 days', 0.1800, 24.0, FALSE),
('Coal Crusher Ring Granulator Hammer Cast Manganese Steel', 'COMMON', CURRENT_DATE - INTERVAL '30 days', 0.5000, 20.0, FALSE),
('Coal Crusher Ring Granulator Hammer Cast Manganese Steel', 'COMMON', CURRENT_DATE - INTERVAL '10 days', 0.6500, 22.0, FALSE);
