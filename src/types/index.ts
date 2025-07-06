export type OrderStatus = 'PENDING' | 'APPROVED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  supplierReference?: string;
  orderDate: Date;
  deliveryDate?: Date;
  totalAmount: number;
  status: OrderStatus;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
  purchaseOrders: PurchaseOrder[];
  styles: OrderStyle[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  salesOrderId: string;
  deliveryDate: Date;
  status: 'PENDING' | 'APPROVED' | 'DELIVERED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Style {
  id: string;
  styleCode: string;
  styleName: string;
  description: string;
  availableSizes: string[];
  availableColors: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStyle {
  id: string;
  salesOrderId: string;
  styleId: string;
  style?: Style;
  packConfiguration: number; // 3-pack, 5-pack, etc.
  unitPrice: number;
  colorAllocations: ColorAllocation[];
  sizeAllocations: SizeAllocation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorAllocation {
  id: string;
  orderStyleId: string;
  color: string;
  packQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SizeAllocation {
  id: string;
  orderStyleId: string;
  size: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BOMItem {
  id: string;
  salesOrderId: string;
  materialId: string;
  material?: Material;
  category: 'FABRIC' | 'SEWING_TRIMS' | 'PACKING_MATERIALS';
  consumptionPerUnit: number;
  planUnit: string;
  purchaseUnit: string;
  conversionFactor: number;
  sizeSpecific: boolean;
  colorSpecific: boolean;
  sizeColorSpecific: boolean;
  prefix: string;
  subMaterialName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'FABRIC' | 'SEWING_TRIMS' | 'PACKING_MATERIALS';
  planUnit: string;
  purchaseUnit: string;
  conversionFactor: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  salesOrderId: string;
  totalMaterialCost: number;
  sewingCost: number;
  sewingCostType: 'PERCENTAGE' | 'FIXED';
  otherCosts: number;
  otherCostsType: 'PERCENTAGE' | 'FIXED';
  extraPercentage: number;
  totalCost: number;
  profitLoss: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  budgetItems: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  budgetId: string;
  bomItemId: string;
  bomItem?: BOMItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  extraPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderNumber: string;
  budgetItemId: string;
  budgetItem?: BudgetItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'PENDING' | 'APPROVED' | 'RECEIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface GRN {
  id: string;
  grnNumber: string;
  purchaseOrderItemId: string;
  receivedQuantity: number;
  receivedDate: Date;
  barcodeGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  inventoryItems: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  barcode: string;
  grnId: string;
  materialId: string;
  material?: Material;
  quantity: number;
  unit: string;
  location: string;
  rollNumber?: string;
  bundleNumber?: string;
  status: 'AVAILABLE' | 'ISSUED' | 'CONSUMED' | 'RETURNED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CuttingRequisition {
  id: string;
  requisitionNumber: string;
  salesOrderId: string;
  orderStyleId: string;
  fabricRequirements: FabricRequirement[];
  status: 'PENDING' | 'APPROVED' | 'ISSUED';
  createdAt: Date;
  updatedAt: Date;
}

export interface FabricRequirement {
  id: string;
  cuttingRequisitionId: string;
  materialId: string;
  material?: Material;
  requiredQuantity: number;
  unit: string;
  sizeRatio: SizeRatio[];
  layerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SizeRatio {
  id: string;
  fabricRequirementId: string;
  size: string;
  ratio: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bundle {
  id: string;
  bundleNumber: string;
  barcode: string;
  salesOrderId: string;
  orderStyleId: string;
  color: string;
  size: string;
  quantity: number;
  cuttingDate: Date;
  currentLocation: 'CUTTING' | 'SEWING' | 'PACKING' | 'COMPLETED';
  assignedLine?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionLog {
  id: string;
  bundleId: string;
  bundle?: Bundle;
  department: 'CUTTING' | 'SEWING' | 'PACKING';
  operation: string;
  quantity: number;
  operatorId: string;
  timestamp: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  salesOrder?: SalesOrder;
  invoiceDate: Date;
  totalAmount: number;
  status: 'PENDING' | 'SENT' | 'PAID';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'OPERATOR' | 'SUPERVISOR' | 'MANAGER' | 'ADMIN';
  branchId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  inProductionOrders: number;
  completedOrders: number;
  totalValue: number;
}

export interface ProductionSummary {
  totalBundles: number;
  inCutting: number;
  inSewing: number;
  inPacking: number;
  completed: number;
}

export interface InventorySummary {
  totalItems: number;
  availableItems: number;
  issuedItems: number;
  lowStockItems: number;
}