import { createClient } from '@supabase/supabase-js';
import { Tenant, Order, Customer, FinancialTransaction } from './types';

// Helper to get Supabase config from env or localStorage
export function getSupabaseConfig() {
  const envUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
  const envAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

  // Parse from URL query parameters or hash parameters
  const getParam = (name: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get(name)) return urlParams.get(name);
    
    // Also parse from hash (e.g. #pedido?s_url=...)
    const hash = window.location.hash;
    const hashMatch = hash.match(new RegExp(`[?&]${name}=([^&?]*)`));
    return hashMatch ? decodeURIComponent(hashMatch[1]) : null;
  };

  const urlParam = getParam('s_url');
  const keyParam = getParam('s_key');

  // Save to localStorage if passed via URL so it persists for this customer session
  if (urlParam && keyParam) {
    localStorage.setItem('saas_supabase_url', urlParam);
    localStorage.setItem('saas_supabase_anon_key', keyParam);
    localStorage.setItem('saas_supabase_enabled', 'true');
  }

  const defaultUrl = 'https://sfyouhzzwazqclhuoxvn.supabase.co';
  const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmeW91aHp6d2F6cWNsaHVveHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NzM5NTEsImV4cCI6MjA5ODQ0OTk1MX0.FXN9VFucV0e_kJGlX-yzfLF6T9XCgEmpaOXNMGG3prY';

  const localUrl = localStorage.getItem('saas_supabase_url') || defaultUrl;
  const localAnonKey = localStorage.getItem('saas_supabase_anon_key') || defaultAnonKey;
  const isEnabled = localStorage.getItem('saas_supabase_enabled') === 'true' || 
                    (!!envUrl && !!envAnonKey) || 
                    (!!urlParam && !!keyParam) ||
                    (localUrl === defaultUrl && (localAnonKey === defaultAnonKey || localAnonKey === 'sb_publishable_v_WQCv_0gE7IXaylsFJbmQ_tQ2qjLEm'));

  return {
    url: envUrl || urlParam || localUrl,
    anonKey: envAnonKey || keyParam || localAnonKey,
    isEnabled: isEnabled,
  };
}

// Create Supabase client lazily to avoid exceptions on invalid URL
let supabaseClientInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  const { url, anonKey, isEnabled } = getSupabaseConfig();
  if (!isEnabled || !url || !anonKey) return null;

  try {
    if (!supabaseClientInstance) {
      supabaseClientInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    }
    return supabaseClientInstance;
  } catch (error) {
    console.error('Erro ao inicializar o cliente do Supabase:', error);
    return null;
  }
}

// Reset instance when credentials change
export function resetSupabaseClient() {
  supabaseClientInstance = null;
}

// SQL code to be executed in Supabase SQL Editor
export const SUPABASE_SQL_SCRIPT = `-- SCRIPT DE CRIAÇÃO DE TABELAS PARA O RESENGO (PIZZARIA SAAS)
-- Copie e cole este script no painel "SQL Editor" do seu Supabase para criar a estrutura!

-- 1. TABELA DE TENANTS (PIZZARIAS)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo TEXT DEFAULT '/logo_do_sistema.png',
  type TEXT DEFAULT 'pizzaria',
  delivery_fee NUMERIC DEFAULT 0,
  phone TEXT,
  email TEXT,
  cnpj TEXT,
  address TEXT,
  bairro TEXT,
  city TEXT,
  state TEXT,
  corporate_name TEXT,
  cep TEXT,
  slogan TEXT,
  plan TEXT DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  trial_days_left INTEGER DEFAULT 3,
  representative_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para Tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso público de leitura para Tenants" ON tenants;
CREATE POLICY "Acesso público de leitura para Tenants" ON tenants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permissão total de escrita para Tenants" ON tenants;
CREATE POLICY "Permissão total de escrita para Tenants" ON tenants FOR ALL USING (true);

-- 2. TABELA DE CLIENTES (CUSTOMERS)
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  bairro TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para Clientes
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso público de leitura para Clientes" ON customers;
CREATE POLICY "Acesso público de leitura para Clientes" ON customers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permissão total de escrita para Clientes" ON customers;
CREATE POLICY "Permissão total de escrita para Clientes" ON customers FOR ALL USING (true);

-- 3. TABELA DE PEDIDOS (ORDERS)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_bairro TEXT,
  customer_city TEXT,
  delivery_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  notes TEXT,
  driver_id TEXT,
  driver_name TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para Pedidos
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso público de leitura para Pedidos" ON orders;
CREATE POLICY "Acesso público de leitura para Pedidos" ON orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permissão total de escrita para Pedidos" ON orders;
CREATE POLICY "Permissão total de escrita para Pedidos" ON orders FOR ALL USING (true);

-- 4. TABELA DE TRANSAÇÕES FINANCEIRAS (FINANCIAL TRANSACTIONS)
CREATE TABLE IF NOT EXISTS financial_transactions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'entrada' ou 'saída'
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para Transações
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso público de leitura para Transações" ON financial_transactions;
CREATE POLICY "Acesso público de leitura para Transações" ON financial_transactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permissão total de escrita para Transações" ON financial_transactions;
CREATE POLICY "Permissão total de escrita para Transações" ON financial_transactions FOR ALL USING (true);

-- Conceder permissões explícitas para os papéis (roles) do Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
`;

// Helper converters between local camelCase and DB snake_case

export function tenantToDb(t: Tenant) {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    logo: t.logo,
    type: t.type,
    delivery_fee: t.deliveryFee,
    phone: t.phone,
    email: t.email,
    cnpj: t.cnpj,
    address: t.address,
    bairro: t.bairro,
    city: t.city,
    state: t.state,
    corporate_name: t.corporateName,
    cep: t.cep,
    slogan: t.slogan,
    plan: t.plan,
    is_active: t.isActive !== false,
    trial_days_left: t.trialDaysLeft,
    representative_name: t.representativeName,
    created_at: t.createdAt || new Date().toISOString()
  };
}

export function dbToTenant(row: any): Tenant {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo,
    type: row.type || 'pizzaria',
    deliveryFee: Number(row.delivery_fee) || 0,
    phone: row.phone || '',
    email: row.email,
    cnpj: row.cnpj,
    address: row.address,
    bairro: row.bairro,
    city: row.city,
    state: row.state,
    corporateName: row.corporate_name,
    cep: row.cep,
    slogan: row.slogan,
    plan: row.plan || 'basic',
    isActive: row.is_active !== false,
    trialDaysLeft: row.trial_days_left,
    representativeName: row.representative_name,
    createdAt: row.created_at
  };
}

export function customerToDb(c: Customer) {
  return {
    id: c.id,
    tenant_id: c.tenantId,
    name: c.name,
    phone: c.phone,
    address: c.address,
    bairro: c.bairro,
    city: c.city,
    created_at: c.createdAt || new Date().toISOString()
  };
}

export function dbToCustomer(row: any): Customer {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    bairro: row.bairro,
    city: row.city,
    createdAt: row.created_at
  };
}

export function orderToDb(o: Order) {
  return {
    id: o.id,
    tenant_id: o.tenantId,
    order_number: o.orderNumber,
    status: o.status,
    type: o.type,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    customer_address: o.customerAddress,
    customer_bairro: o.customerBairro,
    customer_city: o.customerCity,
    delivery_fee: o.deliveryFee,
    discount: o.discount,
    total: o.total,
    payment_method: o.paymentMethod,
    notes: o.notes,
    driver_id: o.driverId,
    driver_name: o.driverName,
    items: o.items, // JSONB
    history: o.history, // JSONB
    created_at: o.createdAt,
    updated_at: o.updatedAt || new Date().toISOString()
  };
}

export function dbToOrder(row: any): Order {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    orderNumber: row.order_number,
    status: row.status,
    type: row.type,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    customerBairro: row.customer_bairro,
    customerCity: row.customer_city,
    deliveryFee: Number(row.delivery_fee) || 0,
    discount: Number(row.discount) || 0,
    total: Number(row.total) || 0,
    paymentMethod: row.payment_method,
    notes: row.notes,
    driverId: row.driver_id,
    driverName: row.driver_name,
    items: row.items || [],
    history: row.history || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function transactionToDb(t: FinancialTransaction) {
  return {
    id: t.id,
    tenant_id: t.tenantId,
    type: t.type,
    category: t.category,
    amount: t.amount,
    description: t.description,
    order_id: t.orderId,
    created_at: t.date || new Date().toISOString()
  };
}

export function dbToTransaction(row: any): FinancialTransaction {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    type: row.type as 'entrada' | 'saída',
    category: row.category,
    amount: Number(row.amount) || 0,
    description: row.description,
    orderId: row.order_id,
    date: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

// REAL SUPABASE API CALLS

// Test Connection
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client: any = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase não habilitado ou credenciais ausentes.' };
  }

  try {
    // Try fetching 1 row from tenants table (or any table)
    const { error } = await client.from('tenants').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('not found') || error.message.includes('relation "tenants" does not exist')) {
        return {
          success: true,
          message: 'Conectado com sucesso! Mas atenção: as tabelas ainda não foram criadas no banco de dados. Use o script SQL abaixo para criá-las.'
        };
      }
      throw error;
    }
    return { success: true, message: 'Conectado com sucesso e tabelas identificadas!' };
  } catch (error: any) {
    console.error('Erro de conexão Supabase:', error);
    return { success: false, message: error.message || 'Erro de conexão desconhecido.' };
  }
}

// Push Local Storage to Supabase
export async function pushLocalToSupabase(
  tenantsList: Tenant[],
  customersList: Customer[],
  ordersList: Order[],
  transactionsList: FinancialTransaction[]
): Promise<{ success: boolean; log: string }> {
  const client: any = getSupabaseClient();
  if (!client) return { success: false, log: 'Supabase não conectado.' };

  let log = 'Iniciando sincronização Local -> Supabase...\n';

  try {
    // 1. Sync Tenants
    if (tenantsList.length > 0) {
      log += `Enviando ${tenantsList.length} pizzarias (tenants)...\n`;
      const dbTenants = tenantsList.map(tenantToDb);
      const { error } = await client.from('tenants').upsert(dbTenants);
      if (error) throw new Error(`Erro nos Tenants: ${error.message}`);
      log += `✅ Pizzarias enviadas com sucesso!\n`;
    }

    // 2. Sync Customers
    if (customersList.length > 0) {
      log += `Enviando ${customersList.length} clientes...\n`;
      const dbCustomers = customersList.map(customerToDb);
      const { error } = await client.from('customers').upsert(dbCustomers);
      if (error) throw new Error(`Erro nos Clientes: ${error.message}`);
      log += `✅ Clientes enviados com sucesso!\n`;
    }

    // 3. Sync Orders
    if (ordersList.length > 0) {
      log += `Enviando ${ordersList.length} pedidos...\n`;
      const dbOrders = ordersList.map(orderToDb);
      const { error } = await client.from('orders').upsert(dbOrders);
      if (error) throw new Error(`Erro nos Pedidos: ${error.message}`);
      log += `✅ Pedidos enviados com sucesso!\n`;
    }

    // 4. Sync Transactions
    if (transactionsList.length > 0) {
      log += `Enviando ${transactionsList.length} transações financeiras...\n`;
      const dbTransactions = transactionsList.map(transactionToDb);
      const { error } = await client.from('financial_transactions').upsert(dbTransactions);
      if (error) throw new Error(`Erro nas Transações: ${error.message}`);
      log += `✅ Transações enviadas com sucesso!\n`;
    }

    log += '\n🎉 Sincronização concluída com sucesso! Todos os dados estão no Supabase.';
    return { success: true, log };
  } catch (err: any) {
    console.error('Erro no push:', err);
    log += `❌ ERRO: ${err.message || err}`;
    return { success: false, log };
  }
}

// Pull Supabase to Local Storage
export async function pullSupabaseToLocal(): Promise<{
  success: boolean;
  log: string;
  tenants?: Tenant[];
  customers?: Customer[];
  orders?: Order[];
  transactions?: FinancialTransaction[];
}> {
  const client: any = getSupabaseClient();
  if (!client) return { success: false, log: 'Supabase não conectado.' };

  let log = 'Iniciando download Supabase -> Local...\n';

  try {
    // 1. Pull Tenants
    log += 'Baixando pizzarias...\n';
    const { data: dbTenants, error: errT } = await client.from('tenants').select('*');
    if (errT) throw new Error(`Erro nos Tenants: ${errT.message}`);
    const tenants = (dbTenants || []).map(dbToTenant);
    log += `✅ Baixado ${tenants.length} pizzarias!\n`;

    // 2. Pull Customers
    log += 'Baixando clientes...\n';
    const { data: dbCustomers, error: errC } = await client.from('customers').select('*');
    if (errC) throw new Error(`Erro nos Clientes: ${errC.message}`);
    const customers = (dbCustomers || []).map(dbToCustomer);
    log += `✅ Baixado ${customers.length} clientes!\n`;

    // 3. Pull Orders
    log += 'Baixando pedidos...\n';
    const { data: dbOrders, error: errO } = await client.from('orders').select('*');
    if (errO) throw new Error(`Erro nos Pedidos: ${errO.message}`);
    const orders = (dbOrders || []).map(dbToOrder);
    log += `✅ Baixado ${orders.length} pedidos!\n`;

    // 4. Pull Transactions
    log += 'Baixando financeiro...\n';
    const { data: dbTx, error: errTx } = await client.from('financial_transactions').select('*');
    if (errTx) throw new Error(`Erro nas Transações: ${errTx.message}`);
    const transactions = (dbTx || []).map(dbToTransaction);
    log += `✅ Baixado ${transactions.length} transações!\n`;

    log += '\n🎉 Download concluído com sucesso! Banco de dados local atualizado.';
    return {
      success: true,
      log,
      tenants,
      customers,
      orders,
      transactions
    };
  } catch (err: any) {
    console.error('Erro no pull:', err);
    log += `❌ ERRO: ${err.message || err}`;
    return { success: false, log };
  }
}

// SINGLE RECORD SYNCS (for Real-time updates)

export async function supabaseUpsertTenant(tenant: Tenant) {
  const client: any = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('tenants').upsert(tenantToDb(tenant));
  } catch (e) {
    console.error('Erro ao enviar tenant ao Supabase:', e);
  }
}

export async function supabaseUpsertOrder(order: Order) {
  const client: any = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('orders').upsert(orderToDb(order));
  } catch (e) {
    console.error('Erro ao enviar pedido ao Supabase:', e);
  }
}

export async function supabaseUpsertCustomer(customer: Customer) {
  const client: any = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('customers').upsert(customerToDb(customer));
  } catch (e) {
    console.error('Erro ao enviar cliente ao Supabase:', e);
  }
}

export async function supabaseUpsertTransaction(tx: FinancialTransaction) {
  const client: any = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('financial_transactions').upsert(transactionToDb(tx));
  } catch (e) {
    console.error('Erro ao enviar transação ao Supabase:', e);
  }
}

export async function supabaseDeleteCustomer(customerId: string) {
  const client: any = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('customers').delete().eq('id', customerId);
  } catch (e) {
    console.error('Erro ao deletar cliente no Supabase:', e);
  }
}
