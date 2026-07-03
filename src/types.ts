/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OrderStatus =
  | 'Rascunho'
  | 'Confirmado'
  | 'Em Produção'
  | 'No Forno'
  | 'Pronto'
  | 'Saiu para Entrega'
  | 'Entregue'
  | 'Cancelado';

export type OrderType = 'Delivery' | 'Retirada' | 'Balcão';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  type: 'pizzaria' | 'hamburgueria' | 'misto';
  deliveryFee: number;
  phone: string;
  cnpj?: string;
  address?: string;
  bairro?: string;
  city?: string;
  state?: string;
  corporateName?: string;
  cep?: string;
  slogan?: string;
  
  // Resengo Auth and SaaS Fields
  email?: string;
  password?: string;
  isPF?: boolean;
  cpf?: string;
  representativeName?: string;
  plan?: 'basic' | 'pro' | 'enterprise';
  createdAt?: string;
  isActive?: boolean;
  trialDaysLeft?: number;
}

export interface PizzaSapor {
  id: string;
  name: string;
  isSpecial: boolean;
  additionalPrice: number; // For special flavors (e.g., Strogonoff, File com Cheddar)
  ingredients: string;
}

export interface PizzaBorder {
  id: string;
  name: string;
  isSpecial: boolean;
  price: number;
}

export interface PizzaSize {
  id: string;
  name: string;
  diameter: string;
  slices: number;
  maxFlavors: number;
  basePrice: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Pizza' | 'Hamburguer' | 'Bebida' | 'Acompanhamento' | 'Açai' | 'Combo';
  price: number;
  description: string;
  isCombo?: boolean;
  comboItems?: { productName: string; quantity: number; removable: boolean }[];
  isPizza?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  
  // Dynamic Pizza settings
  isPizza?: boolean;
  fraction?: 1 | 2 | 3 | 4; // Whole, half, 1/3, 1/4
  flavors?: PizzaSapor[];    // Selected flavors (length matches fraction if customized)
  border?: PizzaBorder;      // Border customization
  size?: PizzaSize;          // Selected size customization
  
  // Dynamic Combo settings
  isCombo?: boolean;
  removedComboItems?: string[]; // Names of removed items from standard combo
  addedExtraItems?: { name: string; price: number }[]; // Added extras to combo
  cocaDifference?: number; // Difference added when Coca-Cola is chosen in combo
}

export interface OrderHistoryLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  
  // Customer
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerBairro?: string;
  customerCity?: string;
  
  // Items & Money
  items: OrderItem[];
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'Cartão' | 'Pix' | 'Dinheiro';
  cocaDifference?: number; // Accumulated surcharge from combo Coca-Cola selections
  
  // Timing & Driver
  createdAt: string;
  updatedAt: string;
  driverId?: string;
  driverName?: string;
  notes?: string;
  
  // Audit Logs
  history: OrderHistoryLog[];
}

export interface CustomerAddress {
  id: string;
  name: string; // Ex: Casa, Trabalho, Casa da mãe
  cep?: string;
  street: string;
  number: string;
  complement?: string;
  bairro: string;
  city: string;
  reference?: string;
  deliveryFee?: number; // Each address can have its own delivery fee
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  address?: string;
  bairro?: string;
  city?: string;
  createdAt: string;
  addresses?: CustomerAddress[];
}

export interface Driver {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  pixKey: string;
  vehicle: string;
  plate: string;
  commissionPerDelivery: number;
}

export interface DriverExpense {
  id: string;
  driverId: string;
  description: string;
  amount: number;
  date: string;
}

export type FinancialCategory =
  | 'Gás'
  | 'Queijo'
  | 'Funcionários'
  | 'Motoboy'
  | 'Energia'
  | 'Internet'
  | 'Aluguel'
  | 'Insumos'
  | 'Recebimento Pedido'
  | 'Outros';

export interface FinancialTransaction {
  id: string;
  tenantId: string;
  type: 'entrada' | 'saída';
  category: FinancialCategory;
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}
