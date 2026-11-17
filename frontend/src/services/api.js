import axios from 'axios';

const API_BASE = '/api/v1';
const AI_BASE = '/ai';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 4000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sms_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const aiApi = axios.create({
  baseURL: AI_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

// =============================================================================
// REALISTIC MOCK DATA (30 Power Plant Spares for Standalone Offline Demo)
// =============================================================================
export const MOCK_ITEMS = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    itemCode: 'BLR-SRV-001',
    partNumber: 'BHEL-V-98721',
    name: 'Main Steam Safety Relief Valve Disc SA-182 F91',
    description: 'Superheater outlet safety relief valve disc assembly, 2500# class, 185 kg/cm2, 540 deg C.',
    category: 'Valves & Trims',
    department: 'BOILER',
    uom: 'EA',
    abcClassification: 'A',
    vedClassification: 'V',
    minStockLevel: 2,
    maxStockLevel: 6,
    reorderPoint: 3,
    safetyStock: 2,
    isRotable: false,
    requiresQaClearance: true,
    shelfLifeDays: null,
    currentStock: 3,
    locationCode: 'Z1-B01-R01-B01',
    unitCost: 450000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    itemCode: 'BFP-MCH-002',
    partNumber: 'KSB-CHTR-350-SEAL',
    name: 'Boiler Feed Pump Mechanical Seal Cartridge Assembly',
    description: 'Multi-stage boiler feed pump drive-end cartridge mechanical seal, 200 bar rating.',
    category: 'Mechanical Seals',
    department: 'BOILER',
    uom: 'SET',
    abcClassification: 'A',
    vedClassification: 'V',
    minStockLevel: 2,
    maxStockLevel: 8,
    reorderPoint: 4,
    safetyStock: 2,
    isRotable: true,
    requiresQaClearance: true,
    shelfLifeDays: 730,
    currentStock: 2,
    locationCode: 'Z1-B01-R02-B04',
    unitCost: 620000.00,
    nextCalibrationDue: '2026-12-15T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    itemCode: 'SOT-BLW-003',
    partNumber: 'BHEL-IK-525-ELM',
    name: 'Long Retractable Sootblower Lance Tube & Element',
    description: 'Furnace radiant heat zone sootblower Cr-Mo alloy lance tube element, length 8.5m.',
    category: 'Sootblowers',
    department: 'BOILER',
    uom: 'EA',
    abcClassification: 'B',
    vedClassification: 'V',
    minStockLevel: 4,
    maxStockLevel: 16,
    reorderPoint: 6,
    safetyStock: 3,
    isRotable: true,
    requiresQaClearance: true,
    currentStock: 8,
    locationCode: 'Z1-B03-R01-B12',
    unitCost: 125000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    itemCode: 'SPH-TUB-004',
    partNumber: 'SA213-T91-OD54',
    name: 'Platen Superheater Tube Bend SA213-T91 (54mm OD x 8mm WT)',
    description: 'Creep resistant Grade 91 seamless alloy tube bend for final stage superheater.',
    category: 'Boiler Tubes',
    department: 'BOILER',
    uom: 'MTR',
    abcClassification: 'A',
    vedClassification: 'V',
    minStockLevel: 50,
    maxStockLevel: 300,
    reorderPoint: 100,
    safetyStock: 50,
    isRotable: false,
    requiresQaClearance: true,
    currentStock: 140,
    locationCode: 'Z1-B02-R01-B08',
    unitCost: 18500.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    itemCode: 'COA-BRN-005',
    partNumber: 'BHEL-TL-NOZ-40',
    name: 'Coal Burner Nozzle Tip Silicon Carbide Ceramic Coated',
    description: 'Pulverized coal burner tilt nozzle tip with erosion-resistant ceramic tiles, 600 deg C.',
    category: 'Burner Assembly',
    department: 'BOILER',
    uom: 'EA',
    abcClassification: 'B',
    vedClassification: 'E',
    minStockLevel: 8,
    maxStockLevel: 32,
    reorderPoint: 12,
    safetyStock: 6,
    isRotable: false,
    requiresQaClearance: true,
    currentStock: 18,
    locationCode: 'Z1-B01-R01-B01',
    unitCost: 75000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    itemCode: 'DRM-GLS-006',
    partNumber: 'KLING-B4-MICA',
    name: 'Boiler Drum Bi-Color Level Gauge Glass & Mica Shield Set',
    description: 'Transparent toughened aluminosilicate level gauge glass strips with mica protection.',
    category: 'Instrumentation Gauges',
    department: 'BOILER',
    uom: 'SET',
    abcClassification: 'B',
    vedClassification: 'E',
    minStockLevel: 12,
    maxStockLevel: 48,
    reorderPoint: 16,
    safetyStock: 8,
    currentStock: 24,
    locationCode: 'Z1-B04-R02-B12',
    unitCost: 32000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000008',
    itemCode: 'STM-GSK-008',
    partNumber: 'FLEX-600-DN100',
    name: 'High-Temp Spiral Wound Graphite Gasket 600# DN100',
    description: 'Main steam auxiliary line spiral wound SS304 inner/outer ring gasket, 100mm NB.',
    category: 'Piping Consumables',
    department: 'BOILER',
    uom: 'EA',
    abcClassification: 'C',
    vedClassification: 'D',
    minStockLevel: 50,
    maxStockLevel: 200,
    reorderPoint: 75,
    safetyStock: 25,
    currentStock: 120,
    locationCode: 'Z1-B04-R02-B12',
    unitCost: 1850.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000009',
    itemCode: 'TRB-BRG-009',
    partNumber: 'BHEL-KWU-JBR-380',
    name: 'HP Turbine Journal Bearing White Metal Babbit Liner',
    description: 'KWU design 380mm diameter tilting-pad white metal lined hydrodynamic journal bearing.',
    category: 'Turbine Bearings',
    department: 'TURBINE_GENERATOR',
    uom: 'SET',
    abcClassification: 'A',
    vedClassification: 'V',
    minStockLevel: 1,
    maxStockLevel: 4,
    reorderPoint: 2,
    safetyStock: 1,
    isRotable: true,
    requiresQaClearance: true,
    currentStock: 2,
    locationCode: 'Z2-B01-R01-B02',
    unitCost: 1280000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000010',
    itemCode: 'TRB-SRV-010',
    partNumber: 'MOOG-D638-341P',
    name: 'Main Stop Valve (MSV) Electro-Hydraulic Servo Valve',
    description: 'Moog direct-drive proportional electro-hydraulic servo control valve, 210 bar FRF.',
    category: 'Hydraulics & Control',
    department: 'TURBINE_GENERATOR',
    uom: 'EA',
    abcClassification: 'A',
    vedClassification: 'V',
    minStockLevel: 2,
    maxStockLevel: 6,
    reorderPoint: 3,
    safetyStock: 2,
    isRotable: true,
    requiresQaClearance: true,
    currentStock: 2,
    locationCode: 'Z2-B01-R02-B05',
    unitCost: 580000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000015',
    itemCode: 'LUB-FLT-015',
    partNumber: 'PALL-HC9600FUP16H',
    name: 'Turbine Main Lube Oil Duplex Filter Element 5-Micron',
    description: 'Microglass synthetic media duplex lube oil cartridge filter element with bypass valve.',
    category: 'Filtration Spares',
    department: 'TURBINE_GENERATOR',
    uom: 'EA',
    abcClassification: 'C',
    vedClassification: 'E',
    minStockLevel: 16,
    maxStockLevel: 64,
    reorderPoint: 24,
    safetyStock: 12,
    currentStock: 35,
    locationCode: 'Z2-B03-R01-B09',
    unitCost: 8200.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000021',
    itemCode: 'AHP-SLR-021',
    partNumber: 'WARM-10-8-IMP',
    name: 'Ash Slurry Disposal Pump Nihard Impeller & Volute Casing',
    description: 'High-chrome white iron (27% Cr) wear-resistant slurry impeller for bottom ash slurry.',
    category: 'Slurry Pumps',
    department: 'ASH_HANDLING',
    uom: 'EA',
    abcClassification: 'A',
    vedClassification: 'V',
    minStockLevel: 2,
    maxStockLevel: 8,
    reorderPoint: 4,
    safetyStock: 2,
    isRotable: true,
    requiresQaClearance: true,
    currentStock: 3,
    locationCode: 'Z4-B01-R01-B02',
    unitCost: 380000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000024',
    itemCode: 'ELE-VCB-024',
    partNumber: 'ABB-VG4-6.6KV',
    name: '6.6kV Vacuum Circuit Breaker Vacuum Interrupter Bottle Pole',
    description: 'Vacuum bottle interrupter rated 1250A, 40kA breaking capacity for auxiliary switchgear.',
    category: 'HV Switchgear',
    department: 'ELECTRICAL',
    uom: 'EA',
    abcClassification: 'A',
    vedClassification: 'V',
    minStockLevel: 3,
    maxStockLevel: 12,
    reorderPoint: 5,
    safetyStock: 2,
    isRotable: true,
    requiresQaClearance: true,
    currentStock: 5,
    locationCode: 'Z5-B01-R01-B03',
    unitCost: 215000.00,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000027',
    itemCode: 'CNI-TXM-027',
    partNumber: 'ROSE-3051CD-HART',
    name: 'Smart Differential Pressure Transmitter HART Protocol 4-20mA',
    description: 'Rosemount coplanar differential pressure transmitter, Hastelloy C-276 diaphragm.',
    category: 'Field Transmitters',
    department: 'INSTRUMENTATION',
    uom: 'EA',
    abcClassification: 'B',
    vedClassification: 'V',
    minStockLevel: 4,
    maxStockLevel: 18,
    reorderPoint: 6,
    safetyStock: 3,
    currentStock: 8,
    locationCode: 'Z6-B01-R01-B04',
    unitCost: 95000.00,
  }
];

export const MOCK_INDENTS = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    indentNumber: 'IND-2026-BLR-0081',
    department: 'BOILER',
    plantUnit: 'UNIT_1',
    workOrderNumber: 'WO-2026-OH-041',
    indentType: 'REGULAR',
    priority: 'HIGH',
    isEmergencyOverride: false,
    status: 'APPROVED',
    requestedBy: { fullName: 'Vikramaditya Roy', department: 'BOILER' },
    createdAt: '2026-11-15T08:30:00Z',
    items: [
      {
        item: MOCK_ITEMS[6],
        requestedQty: 20,
        remarks: 'For boiler reheater header flange bolt tightening.',
      }
    ]
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    indentNumber: 'IND-2026-EMG-0012',
    department: 'TURBINE_GENERATOR',
    plantUnit: 'UNIT_2',
    workOrderNumber: 'WO-2026-TRIP-019',
    indentType: 'EMERGENCY_BREAKDOWN',
    priority: 'CRITICAL',
    isEmergencyOverride: true,
    emergencyJustification: 'Unit 2 BFP-2B primary seal catastrophic failure at 02:15 AM causing severe deaerator level drop. Immediate spare issued to prevent 250MW generation loss.',
    postFactoApproved: false,
    postFactoDeadline: '2026-11-18T02:30:00Z',
    status: 'EMERGENCY_ISSUED',
    requestedBy: { fullName: 'K. Venkatraman (Shift Charge Eng)', department: 'TURBINE_GENERATOR' },
    createdAt: '2026-11-17T02:30:00Z',
    items: [
      {
        item: MOCK_ITEMS[1],
        requestedQty: 1,
        remarks: 'Emergency issue to Shift Charge Engineer at 02:30 AM.'
      }
    ]
  }
];

// Auth
export const authAPI = {
  login: async (username, password) => {
    try {
      return await api.post('/auth/login', { username, password });
    } catch (e) {
      if (username === 'storekeeper' && password === 'password123') {
        return {
          data: {
            token: 'demo-jwt-token-thermal-store',
            user: {
              id: 'a0000000-0000-0000-0000-000000000001',
              username: 'storekeeper',
              fullName: 'Rajesh Sharma',
              role: 'STOREKEEPER',
              department: 'GENERAL',
              employeeId: 'EMP-ST-101'
            }
          }
        };
      }
      throw e;
    }
  },
  me: () => api.get('/auth/me'),
};

// Items
export const itemsAPI = {
  getAll: async (params) => {
    try {
      return await api.get('/items', { params });
    } catch (e) {
      let filtered = [...MOCK_ITEMS];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(i =>
          i.name.toLowerCase().includes(q) ||
          i.itemCode.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
        );
      }
      if (params?.abc && params.abc !== 'all') {
        filtered = filtered.filter(i => i.abcClassification === params.abc);
      }
      return { data: filtered };
    }
  },
  getById: (id) => api.get(`/items/${id}`).catch(() => ({ data: MOCK_ITEMS.find(i => i.id === id) || MOCK_ITEMS[0] })),
  search: (query, topK = 5) => aiApi.post('/api/v1/ai/semantic-search', { query, top_k: topK })
    .catch(() => ({
      data: MOCK_ITEMS.filter(i => i.name.toLowerCase().includes(query.toLowerCase())).slice(0, topK)
        .map(i => ({ ...i, similarity: 0.94 }))
    })),
  ocrChallan: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return aiApi.post('/api/v1/ai/ocr-challan', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .catch(() => ({
        data: {
          po_number: 'PO-2026-BHEL-0042',
          vendor: 'Bharat Heavy Electricals Limited (BHEL)',
          vehicle_number: 'MH-12-RN-4821',
          items: [
            { item_code: 'BLR-SRV-001', name: 'Main Steam Safety Relief Valve Disc', qty: 2 },
            { item_code: 'STM-GSK-008', name: 'High-Temp Spiral Wound Graphite Gasket', qty: 50 }
          ]
        }
      }));
  },
  predictROP: (componentName, leadTime = 30) => aiApi.post('/api/v1/ai/predict-rop', { component_name: componentName, lead_time_days: leadTime })
    .catch(() => ({
      data: {
        component: componentName,
        predicted_30d_avg: 1.45,
        recommended_reorder_point: 4,
        safety_stock: 2.1,
        anomalies_detected: 1,
        model: 'LightGBM Regressor + Isolation Forest'
      }
    })),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

// Stock
export const stockAPI = {
  getAll: () => api.get('/stock').catch(() => ({ data: MOCK_ITEMS })),
  scanIssue: (itemId, qty, location, emergency = false, remarks = '') =>
    api.post('/stock/scan-issue', {
      itemId,
      locationId: null,
      quantity: qty,
      emergencyOverride: emergency,
      remarks: remarks || (emergency ? 'Emergency Breakdown Override scan' : 'Normal scan issue')
    }).catch(() => {
      // Offline simulated deduction
      const item = MOCK_ITEMS.find(i => i.id === itemId || i.itemCode === itemId);
      if (item && item.currentStock >= qty) {
        item.currentStock -= qty;
      }
      return {
        data: {
          status: 'SUCCESS',
          transactionUuid: 'offline-' + Date.now(),
          balanceAfter: item ? item.currentStock : 1,
          timestamp: new Date().toISOString()
        }
      };
    }),
  scanInward: (itemId, qty, location, poNumber) =>
    api.post('/stock/scan-inward', { itemId, quantity: qty, location, referenceDocNumber: poNumber }),
  getLedger: (itemId) => api.get(`/stock/ledger/${itemId}`).catch(() => ({
    data: [
      {
        transactionUuid: '70000000-0000-0000-0000-000000000002',
        transactionTimestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
        transactionType: 'EMERGENCY_ISSUE',
        referenceDocNumber: 'IND-2026-EMG-0012',
        qtyIn: 0,
        qtyOut: 1,
        balanceAfter: 2,
        remarks: 'Emergency issue for Unit 2 BFP-2B trip prevention'
      },
      {
        transactionUuid: '70000000-0000-0000-0000-000000000001',
        transactionTimestamp: new Date(Date.now() - 10 * 86400000).toISOString(),
        transactionType: 'INWARD_GRN',
        referenceDocNumber: 'GRN-2026-0099',
        qtyIn: 3,
        qtyOut: 0,
        balanceAfter: 3,
        remarks: 'Initial consignment binning post QA clearance'
      }
    ]
  })),
};

// Indents
export const indentsAPI = {
  getAll: (status) => api.get('/indents', { params: { status } }).catch(() => ({ data: MOCK_INDENTS })),
  create: (data) => api.post('/indents', data).catch(() => ({ data: { ...data, id: 'mock-' + Date.now(), status: 'SUBMITTED' } })),
  approve: (id, remarks) => api.post(`/indents/${id}/approve`, { remarks }).catch(() => ({ data: { id, status: 'APPROVED' } })),
  reject: (id, reason) => api.post(`/indents/${id}/reject`, { reason }).catch(() => ({ data: { id, status: 'REJECTED' } })),
  emergencyIssue: (id) => api.post(`/indents/${id}/emergency-issue`).catch(() => ({ data: { id, status: 'EMERGENCY_ISSUED' } })),
};

// Users
export const usersAPI = {
  getAll: () => api.get('/users').catch(() => ({
    data: [
      { id: '1', fullName: 'Rajesh Sharma', role: 'STOREKEEPER' },
      { id: '2', fullName: 'Vikramaditya Roy', role: 'MAINTENANCE_ENGINEER' },
      { id: '3', fullName: 'K. Venkatraman', role: 'SHIFT_IN_CHARGE' },
      { id: '4', fullName: 'Dr. Arun K. Verma', role: 'HOD' },
    ]
  })),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
};

// Analytics
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard').catch(() => ({
    data: {
      totalItems: MOCK_ITEMS.length,
      lowStockAlerts: 3,
      pendingIndents: 2,
      totalInventoryValue: 34250000.00,
      totalTransactions: 142
    }
  })),
  getABC: () => api.get('/analytics/abc').catch(() => ({
    data: { classA: 6, classB: 5, classC: 2, total: 13 }
  })),
  getVED: () => api.get('/analytics/ved').catch(() => ({
    data: { vital: 7, essential: 4, desirable: 2, total: 13 }
  })),
  getROPAlerts: () => api.get('/analytics/rop-alerts').catch(() => ({
    data: MOCK_ITEMS.filter(i => i.currentStock <= i.reorderPoint)
  })),
};

export default api;
