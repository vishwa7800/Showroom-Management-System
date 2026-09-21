// Shreeji Hero Showroom ERP - Complete Inventory, Vehicle Stock & Spare Parts Data Store

export interface VehicleUnitRecord {
  id: string;
  vin: string; // Chassis No e.g. "MBLHAW14XN9001001"
  engineNumber: string; // e.g. "HA10EHN9001001"
  modelId: string;
  modelName: string;
  variantName: string;
  color: string;
  branchId: string;
  branchName?: string;
  status: 'IN_TRANSIT' | 'AVAILABLE' | 'RESERVED' | 'BOOKED' | 'SOLD';
  purchasePrice: number;
  sellingPrice: number;
  arrivalDate: string;
  bookingCode?: string;
  createdAt: string;
}

export interface SparePartRecord {
  id: string;
  partNumber: string; // e.g. "SP-ENG-001"
  name: string;
  category: 'LUBRICANT' | 'BRAKES' | 'FILTERS' | 'ELECTRICALS' | 'TRANSMISSION' | 'BODY_PANELS';
  compatibleModels: string;
  brand: string;
  unitPrice: number;
  costPrice: number;
  gstRate: number;
  minStockLevel: number;
  currentStock: number;
  reorderQuantity: number;
  branchId: string;
  vendorName: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface StockMovementRecord {
  id: string;
  movementCode: string;
  itemType: 'VEHICLE' | 'SPARE_PART';
  itemIdentifier: string; // VIN or Part Number
  itemName: string;
  movementType:
    | 'INWARD'
    | 'OUTWARD'
    | 'SERVICE_CONSUMPTION'
    | 'SALES_CONSUMPTION'
    | 'BRANCH_TRANSFER'
    | 'ADJUSTMENT'
    | 'RETURN';
  quantity: number;
  sourceBranchId?: string;
  sourceBranchName?: string;
  targetBranchId?: string;
  targetBranchName?: string;
  reason: string;
  referenceDoc?: string;
  actorId: string;
  actorName: string;
  createdAt: string;
}

export interface StockTransferRecordItem {
  id: string;
  transferCode: string;
  itemType: 'VEHICLE' | 'SPARE_PART';
  vehicleUnitId?: string;
  sparePartId?: string;
  itemDescription: string;
  quantity: number;
  sourceBranchId: string;
  sourceBranchName: string;
  targetBranchId: string;
  targetBranchName: string;
  status: 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'REJECTED';
  requestedById: string;
  requestedByName: string;
  approvedByName?: string;
  notes?: string;
  requestedAt: string;
  receivedAt?: string;
}

export interface VendorRecord {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  gstNumber: string;
  suppliedCategories: string;
  paymentTerms: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// -------------------------------------------------------------
// IN-MEMORY INVENTORY SEED REPOSITORY
// -------------------------------------------------------------

let vehiclesDb: VehicleUnitRecord[] = [
  {
    id: 'veh_01',
    vin: 'MBLHAW14XN9001001',
    engineNumber: 'HA10EHN9001001',
    modelId: 'mdl_splendor',
    modelName: 'Hero Splendor Plus',
    variantName: 'Self Cast Drum',
    color: 'Black with Silver Accent',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 62000,
    sellingPrice: 75400,
    arrivalDate: '2024-05-10',
    createdAt: '2024-05-10T10:00:00.000Z',
  },
  {
    id: 'veh_02',
    vin: 'MBLHAW14XN9001002',
    engineNumber: 'HA10EHN9001002',
    modelId: 'mdl_splendor',
    modelName: 'Hero Splendor Plus',
    variantName: 'XTEC Bluetooth',
    color: 'Canvas Black Matte',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 65500,
    sellingPrice: 79900,
    arrivalDate: '2024-05-12',
    createdAt: '2024-05-12T11:00:00.000Z',
  },
  {
    id: 'veh_03',
    vin: 'MBLHAW14XN9002001',
    engineNumber: 'HA10EHN9002001',
    modelId: 'mdl_hfdeluxe',
    modelName: 'Hero HF Deluxe',
    variantName: 'Kick Start Drum',
    color: 'Techno Blue',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 51000,
    sellingPrice: 61800,
    arrivalDate: '2024-05-14',
    createdAt: '2024-05-14T09:30:00.000Z',
  },
  {
    id: 'veh_04',
    vin: 'MBLHAW14XN9003001',
    engineNumber: 'HA10EHN9003001',
    modelId: 'mdl_xtreme',
    modelName: 'Hero Xtreme 160R 4V',
    variantName: 'Dual Disc ABS',
    color: 'Blazing Sports Red',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'BOOKED',
    purchasePrice: 104000,
    sellingPrice: 127300,
    bookingCode: 'BK-2024-002',
    arrivalDate: '2024-05-08',
    createdAt: '2024-05-08T14:00:00.000Z',
  },
  {
    id: 'veh_05',
    vin: 'MBLHAW14XN9004001',
    engineNumber: 'HA10EHN9004001',
    modelId: 'mdl_xpulse',
    modelName: 'Hero Xpulse 200 4V',
    variantName: 'Pro Edition Rally',
    color: 'Trail Blue White',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'IN_TRANSIT',
    purchasePrice: 122000,
    sellingPrice: 152000,
    arrivalDate: '2024-05-18',
    createdAt: '2024-05-15T16:00:00.000Z',
  },
  {
    id: 'veh_06',
    vin: 'MBLHAW14XN9005001',
    engineNumber: 'HA10EHN9005001',
    modelId: 'mdl_passion',
    modelName: 'Hero Passion Pro',
    variantName: 'i3S Drum Cast',
    color: 'Sports Red Black',
    branchId: 'br_dhangadhra',
    branchName: 'Dhangadhra Branch',
    status: 'AVAILABLE',
    purchasePrice: 62000,
    sellingPrice: 75500,
    arrivalDate: '2024-05-11',
    createdAt: '2024-05-11T12:00:00.000Z',
  },
];

let sparesDb: SparePartRecord[] = [
  {
    id: 'sp_01',
    partNumber: 'SP-ENG-001',
    name: 'Hero 4T Plus Genuine Engine Oil (900ml)',
    category: 'LUBRICANT',
    compatibleModels: 'Splendor+, HF Deluxe, Passion Pro',
    brand: 'Hero Genuine Parts',
    unitPrice: 380,
    costPrice: 280,
    gstRate: 18,
    minStockLevel: 20,
    currentStock: 48,
    reorderQuantity: 50,
    branchId: 'br_halvad',
    vendorName: 'Hero MotoCorp Ltd (Parts Div)',
    status: 'IN_STOCK',
  },
  {
    id: 'sp_02',
    partNumber: 'SP-BRK-102',
    name: 'Front Brake Shoe Set',
    category: 'BRAKES',
    compatibleModels: 'Splendor, HF Deluxe, Glamour, Super Splendor',
    brand: 'Hero Genuine Parts',
    unitPrice: 240,
    costPrice: 160,
    gstRate: 18,
    minStockLevel: 15,
    currentStock: 6, // LOW STOCK!
    reorderQuantity: 30,
    branchId: 'br_halvad',
    vendorName: 'Hero MotoCorp Ltd (Parts Div)',
    status: 'LOW_STOCK',
  },
  {
    id: 'sp_03',
    partNumber: 'SP-IGN-005',
    name: 'Hero Spark Plug NGK CPR7EA-9',
    category: 'ELECTRICALS',
    compatibleModels: 'All 100cc-125cc Hero Bikes',
    brand: 'NGK Spark Plugs India',
    unitPrice: 120,
    costPrice: 75,
    gstRate: 18,
    minStockLevel: 10,
    currentStock: 25,
    reorderQuantity: 40,
    branchId: 'br_halvad',
    vendorName: 'NGK Spark Plugs India Ltd',
    status: 'IN_STOCK',
  },
  {
    id: 'sp_04',
    partNumber: 'SP-CBL-011',
    name: 'Clutch Cable Assembly',
    category: 'TRANSMISSION',
    compatibleModels: 'Hero Xpulse 200 4V, Xtreme 160R',
    brand: 'Hero Genuine Parts',
    unitPrice: 180,
    costPrice: 110,
    gstRate: 18,
    minStockLevel: 5,
    currentStock: 0, // OUT OF STOCK!
    reorderQuantity: 15,
    branchId: 'br_halvad',
    vendorName: 'Hero MotoCorp Ltd (Parts Div)',
    status: 'OUT_OF_STOCK',
  },
  {
    id: 'sp_05',
    partNumber: 'SP-CHN-020',
    name: 'Drive Chain & Sprocket Replacement Kit',
    category: 'TRANSMISSION',
    compatibleModels: 'Hero Passion Pro, Splendor Plus',
    brand: 'Rolon Hero Genuine',
    unitPrice: 1250,
    costPrice: 890,
    gstRate: 18,
    minStockLevel: 8,
    currentStock: 12,
    reorderQuantity: 20,
    branchId: 'br_halvad',
    vendorName: 'Rolon Chains India Ltd',
    status: 'IN_STOCK',
  },
];

let movementsDb: StockMovementRecord[] = [
  {
    id: 'mov_01',
    movementCode: 'MOV-2024-001',
    itemType: 'VEHICLE',
    itemIdentifier: 'MBLHAW14XN9001001',
    itemName: 'Hero Splendor Plus (Black Silver)',
    movementType: 'INWARD',
    quantity: 1,
    targetBranchId: 'br_halvad',
    targetBranchName: 'Halvad Branch',
    reason: 'Factory consignment inward batch #HLV-MAY-10',
    referenceDoc: 'INVOICE-HERO-90128',
    actorId: 'usr_inv_mohit',
    actorName: 'Mohit Sharma (Inventory Manager)',
    createdAt: '2024-05-10T10:00:00.000Z',
  },
  {
    id: 'mov_02',
    movementCode: 'MOV-2024-002',
    itemType: 'SPARE_PART',
    itemIdentifier: 'SP-ENG-001',
    itemName: 'Hero 4T Plus Engine Oil (900ml)',
    movementType: 'SERVICE_CONSUMPTION',
    quantity: 1,
    sourceBranchId: 'br_halvad',
    sourceBranchName: 'Halvad Branch',
    reason: 'Installed during Periodic Service in Job Card #JC-8901',
    referenceDoc: 'JC-8901',
    actorId: 'usr_service_kiran',
    actorName: 'Kiran Solanki (Service Advisor)',
    createdAt: '2024-05-16T10:30:00.000Z',
  },
  {
    id: 'mov_03',
    movementCode: 'MOV-2024-003',
    itemType: 'SPARE_PART',
    itemIdentifier: 'SP-BRK-102',
    itemName: 'Front Brake Shoe Set',
    movementType: 'SERVICE_CONSUMPTION',
    quantity: 1,
    sourceBranchId: 'br_halvad',
    sourceBranchName: 'Halvad Branch',
    reason: 'Installed during Free Service #4 in Job Card #JC-8901',
    referenceDoc: 'JC-8901',
    actorId: 'usr_service_kiran',
    actorName: 'Kiran Solanki (Service Advisor)',
    createdAt: '2024-05-16T10:30:00.000Z',
  },
];

let transfersDb: StockTransferRecordItem[] = [
  {
    id: 'trf_01',
    transferCode: 'TRF-2024-001',
    itemType: 'VEHICLE',
    vehicleUnitId: 'veh_06',
    itemDescription: 'Hero Passion Pro (VIN: MBLHAW14XN9005001)',
    quantity: 1,
    sourceBranchId: 'br_halvad',
    sourceBranchName: 'Halvad Branch',
    targetBranchId: 'br_dhangadhra',
    targetBranchName: 'Dhangadhra Branch',
    status: 'RECEIVED',
    requestedById: 'usr_inv_mohit',
    requestedByName: 'Mohit Sharma (Inventory Mgr)',
    approvedByName: 'Rajesh Patel (Admin)',
    notes: 'Urgent customer booking transfer requirement',
    requestedAt: '2024-05-11T09:00:00.000Z',
    receivedAt: '2024-05-11T16:00:00.000Z',
  },
];

let vendorsDb: VendorRecord[] = [
  {
    id: 'vnd_01',
    code: 'VND-101',
    name: 'Hero MotoCorp Ltd (Parts Distribution Division)',
    contactPerson: 'Sunil Mehta (Regional Head)',
    phone: '+91 22 6655 4433',
    email: 'parts.support@heromotocorp.com',
    address: 'Plot 12, GIDC Industrial Estate, Halol',
    city: 'Vadodara',
    gstNumber: '24AAACH1234K1Z0',
    suppliedCategories: 'Engine Oils, Filters, Brake Shoes, Body Panels',
    paymentTerms: 'Net 30 Days',
    status: 'ACTIVE',
  },
  {
    id: 'vnd_02',
    code: 'VND-102',
    name: 'NGK Spark Plugs India Pvt Ltd',
    contactPerson: 'Anand Joshi',
    phone: '+91 20 4455 6677',
    email: 'sales@ngkntk.in',
    address: 'B-4, Industrial Area, Chakan',
    city: 'Pune',
    gstNumber: '27AAACN5678J1Z2',
    suppliedCategories: 'Spark Plugs, Ignition Coils, Sensors',
    paymentTerms: 'Net 15 Days',
    status: 'ACTIVE',
  },
  {
    id: 'vnd_03',
    code: 'VND-103',
    name: 'Rolon Chains & Sprockets Ltd',
    contactPerson: 'K. Ramanathan',
    phone: '+91 422 233 4455',
    email: 'support@lgbalab.com',
    address: '6/16/13, Trichy Road, Singanallur',
    city: 'Coimbatore',
    gstNumber: '33AAACL1290M1Z8',
    suppliedCategories: 'Drive Chains, Sprocket Kits',
    paymentTerms: 'Net 30 Days',
    status: 'ACTIVE',
  },
];

// -------------------------------------------------------------
// STORE METHODS
// -------------------------------------------------------------

export async function getVehicleInventory(filter?: {
  branchId?: string | null;
  status?: string;
  modelId?: string;
}): Promise<VehicleUnitRecord[]> {
  let result = [...vehiclesDb];
  if (filter?.branchId) result = result.filter((v) => v.branchId === filter.branchId);
  if (filter?.status && filter.status !== 'ALL') {
    result = result.filter((v) => v.status === filter.status);
  }
  if (filter?.modelId && filter.modelId !== 'ALL') {
    result = result.filter((v) => v.modelId === filter.modelId);
  }
  return result;
}

export async function inwardVehicleUnit(data: {
  vin: string;
  engineNumber: string;
  modelId: string;
  modelName: string;
  variantName: string;
  color: string;
  branchId: string;
  branchName?: string;
  purchasePrice: number;
  sellingPrice: number;
  actorId: string;
  actorName: string;
}): Promise<VehicleUnitRecord> {
  // Prevent duplicate VIN/Chassis/Engine number
  const existingVin = vehiclesDb.find(
    (v) => v.vin.toUpperCase() === data.vin.toUpperCase()
  );
  if (existingVin) {
    throw new Error(`Vehicle Unit with VIN / Chassis #${data.vin} already exists in inventory.`);
  }

  const existingEngine = vehiclesDb.find(
    (v) => v.engineNumber.toUpperCase() === data.engineNumber.toUpperCase()
  );
  if (existingEngine) {
    throw new Error(
      `Vehicle Unit with Engine Number #${data.engineNumber} already exists in inventory.`
    );
  }

  const newUnit: VehicleUnitRecord = {
    id: `veh_${Date.now()}`,
    vin: data.vin.toUpperCase(),
    engineNumber: data.engineNumber.toUpperCase(),
    modelId: data.modelId,
    modelName: data.modelName,
    variantName: data.variantName,
    color: data.color,
    branchId: data.branchId,
    branchName: data.branchName || 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: data.purchasePrice,
    sellingPrice: data.sellingPrice,
    arrivalDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };

  vehiclesDb.unshift(newUnit);

  // Record stock movement
  const movementCode = `MOV-${new Date().getFullYear()}-${100 + movementsDb.length + 1}`;
  movementsDb.unshift({
    id: `mov_${Date.now()}`,
    movementCode,
    itemType: 'VEHICLE',
    itemIdentifier: newUnit.vin,
    itemName: `${newUnit.modelName} (${newUnit.color})`,
    movementType: 'INWARD',
    quantity: 1,
    targetBranchId: newUnit.branchId,
    targetBranchName: newUnit.branchName,
    reason: 'Showroom Stock Inward Receipt',
    referenceDoc: `INWARD-${newUnit.vin.slice(-6)}`,
    actorId: data.actorId,
    actorName: data.actorName,
    createdAt: new Date().toISOString(),
  });

  return newUnit;
}

export async function getSpareParts(filter?: {
  branchId?: string | null;
  category?: string;
  status?: string;
}): Promise<SparePartRecord[]> {
  let result = [...sparesDb];
  if (filter?.branchId) result = result.filter((s) => s.branchId === filter.branchId);
  if (filter?.category && filter.category !== 'ALL') {
    result = result.filter((s) => s.category === filter.category);
  }
  if (filter?.status && filter.status !== 'ALL') {
    result = result.filter((s) => s.status === filter.status);
  }
  return result;
}

export async function adjustSpareStock(
  sparePartId: string,
  quantityDelta: number,
  reason: string,
  actorId: string,
  actorName: string
): Promise<SparePartRecord> {
  const part = sparesDb.find((s) => s.id === sparePartId || s.partNumber === sparePartId);
  if (!part) throw new Error('Spare part not found');

  part.currentStock += quantityDelta;
  if (part.currentStock < 0) part.currentStock = 0;

  if (part.currentStock === 0) {
    part.status = 'OUT_OF_STOCK';
  } else if (part.currentStock <= part.minStockLevel) {
    part.status = 'LOW_STOCK';
  } else {
    part.status = 'IN_STOCK';
  }

  // Record movement
  const movementCode = `MOV-${new Date().getFullYear()}-${100 + movementsDb.length + 1}`;
  movementsDb.unshift({
    id: `mov_${Date.now()}`,
    movementCode,
    itemType: 'SPARE_PART',
    itemIdentifier: part.partNumber,
    itemName: part.name,
    movementType: quantityDelta >= 0 ? 'ADJUSTMENT' : 'SERVICE_CONSUMPTION',
    quantity: Math.abs(quantityDelta),
    sourceBranchId: part.branchId,
    reason,
    actorId,
    actorName,
    createdAt: new Date().toISOString(),
  });

  return part;
}

export async function getStockMovements(branchId?: string | null): Promise<StockMovementRecord[]> {
  let result = [...movementsDb];
  if (branchId) {
    result = result.filter((m) => m.sourceBranchId === branchId || m.targetBranchId === branchId);
  }
  return result;
}

export async function getStockTransfers(branchId?: string | null): Promise<StockTransferRecordItem[]> {
  let result = [...transfersDb];
  if (branchId) {
    result = result.filter((t) => t.sourceBranchId === branchId || t.targetBranchId === branchId);
  }
  return result;
}

export async function requestStockTransfer(data: {
  itemType: 'VEHICLE' | 'SPARE_PART';
  vehicleUnitId?: string;
  sparePartId?: string;
  itemDescription: string;
  quantity: number;
  sourceBranchId: string;
  sourceBranchName: string;
  targetBranchId: string;
  targetBranchName: string;
  requestedById: string;
  requestedByName: string;
  notes?: string;
}): Promise<StockTransferRecordItem> {
  const transferCode = `TRF-${new Date().getFullYear()}-${100 + transfersDb.length + 1}`;
  const newTransfer: StockTransferRecordItem = {
    id: `trf_${Date.now()}`,
    transferCode,
    itemType: data.itemType,
    vehicleUnitId: data.vehicleUnitId,
    sparePartId: data.sparePartId,
    itemDescription: data.itemDescription,
    quantity: data.quantity,
    sourceBranchId: data.sourceBranchId,
    sourceBranchName: data.sourceBranchName,
    targetBranchId: data.targetBranchId,
    targetBranchName: data.targetBranchName,
    status: 'IN_TRANSIT',
    requestedById: data.requestedById,
    requestedByName: data.requestedByName,
    notes: data.notes,
    requestedAt: new Date().toISOString(),
  };

  transfersDb.unshift(newTransfer);

  // If vehicle unit, set status to IN_TRANSIT
  if (data.vehicleUnitId) {
    const unit = vehiclesDb.find((v) => v.id === data.vehicleUnitId);
    if (unit) unit.status = 'IN_TRANSIT';
  }

  return newTransfer;
}

export async function confirmTransferReceipt(
  transferId: string,
  receiverName: string
): Promise<StockTransferRecordItem> {
  const trf = transfersDb.find((t) => t.id === transferId);
  if (!trf) throw new Error('Transfer record not found');

  const now = new Date().toISOString();
  trf.status = 'RECEIVED';
  trf.receivedAt = now;
  trf.approvedByName = receiverName;

  // Move unit to destination branch
  if (trf.vehicleUnitId) {
    const unit = vehiclesDb.find((v) => v.id === trf.vehicleUnitId);
    if (unit) {
      unit.branchId = trf.targetBranchId;
      unit.branchName = trf.targetBranchName;
      unit.status = 'AVAILABLE';
    }
  }

  // Record movement
  const movementCode = `MOV-${new Date().getFullYear()}-${100 + movementsDb.length + 1}`;
  movementsDb.unshift({
    id: `mov_${Date.now()}`,
    movementCode,
    itemType: trf.itemType,
    itemIdentifier: trf.transferCode,
    itemName: trf.itemDescription,
    movementType: 'BRANCH_TRANSFER',
    quantity: trf.quantity,
    sourceBranchId: trf.sourceBranchId,
    sourceBranchName: trf.sourceBranchName,
    targetBranchId: trf.targetBranchId,
    targetBranchName: trf.targetBranchName,
    reason: `Inter-Branch Transfer Received (${trf.transferCode})`,
    referenceDoc: trf.transferCode,
    actorId: 'rcv',
    actorName: receiverName,
    createdAt: now,
  });

  return trf;
}

export async function getVendors(): Promise<VendorRecord[]> {
  return vendorsDb;
}

export async function getInventoryValuation(branchId?: string | null): Promise<{
  totalVehicles: number;
  availableVehicles: number;
  bookedVehicles: number;
  inTransitVehicles: number;
  vehicleStockValue: number;
  sparePartsCount: number;
  sparePartsStockValue: number;
  lowStockPartsCount: number;
  outOfStockPartsCount: number;
  totalValuation: number;
}> {
  let veh = [...vehiclesDb];
  let sp = [...sparesDb];

  if (branchId) {
    veh = veh.filter((v) => v.branchId === branchId);
    sp = sp.filter((s) => s.branchId === branchId);
  }

  const availableVehicles = veh.filter((v) => v.status === 'AVAILABLE').length;
  const bookedVehicles = veh.filter((v) => v.status === 'BOOKED' || v.status === 'RESERVED').length;
  const inTransitVehicles = veh.filter((v) => v.status === 'IN_TRANSIT').length;

  const vehicleStockValue = veh
    .filter((v) => v.status === 'AVAILABLE' || v.status === 'IN_TRANSIT')
    .reduce((acc, curr) => acc + curr.purchasePrice, 0);

  const sparePartsStockValue = sp.reduce((acc, curr) => acc + curr.costPrice * curr.currentStock, 0);

  const lowStockPartsCount = sp.filter((s) => s.status === 'LOW_STOCK').length;
  const outOfStockPartsCount = sp.filter((s) => s.status === 'OUT_OF_STOCK').length;

  return {
    totalVehicles: veh.length,
    availableVehicles,
    bookedVehicles,
    inTransitVehicles,
    vehicleStockValue,
    sparePartsCount: sp.length,
    sparePartsStockValue,
    lowStockPartsCount,
    outOfStockPartsCount,
    totalValuation: vehicleStockValue + sparePartsStockValue,
  };
}
