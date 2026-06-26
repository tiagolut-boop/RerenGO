/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, ShieldCheck, Scale, Cpu, GitMerge, Milestone, Key, Layers, Code, HardDrive, CheckCircle2 } from 'lucide-react';

export default function ArchitectureDoc() {
  const [activeTab, setActiveTab] = useState<'saas' | 'database' | 'rules' | 'apis' | 'flows' | 'roadmaps'>('saas');

  return (
    <div id="architecture-doc" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500/20 via-blue-600/15 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-500/10 text-teal-400 text-xs font-mono px-2.5 py-1 rounded-full border border-teal-500/20">
                ResenGO core v1.0.0
              </span>
              <span className="bg-blue-500/10 text-blue-400 text-xs font-mono px-2.5 py-1 rounded-full border border-blue-500/20">
                PROJETO DE ARQUITETURA SaaS
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">SaaS Blueprint & Blueprint técnico</h2>
            <p className="text-slate-400 text-sm mt-0.5 max-w-2xl">
              Modelagem técnica de nível enterprise para SaaS Food Service Multi-Tenant, com isolamento lógico no Supabase/PostgreSQL.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <Cpu className="w-5 h-5 text-teal-400 animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-mono leading-none">STATUS DE PROJETO</p>
              <p className="text-xs font-semibold text-emerald-400">PRONTO PARA IMPLANTAÇÃO</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-1 mt-6 border-t border-slate-800/60 pt-4">
          <button
            onClick={() => setActiveTab('saas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'saas'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            1. Estrutura SaaS Multi-Tenant
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'database'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            2. Modelagem PostgreSQL (DDL)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'rules'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            3. Regras de Negócio & Precificação
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'apis'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            4. Arquitetura de APIs
          </button>
          <button
            onClick={() => setActiveTab('flows')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'flows'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            5. Fluxo da Operação
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'roadmaps'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Milestone className="w-3.5 h-3.5" />
            6. Roadmaps MVP a V3
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6 text-slate-300 leading-relaxed font-sans text-sm">
        {/* TAB 1: SAAS STRUCTURE & MULTI-TENANCY */}
        {activeTab === 'saas' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 mt-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Estratégia de Isolamento Multi-Tenant</h3>
                <p className="text-slate-400 mt-1">
                  O <strong>ResenGO</strong> utiliza isolamento de dados lógico por meio de <strong>Row-Level Security (RLS)</strong> nativo do PostgreSQL combinado com tokens JWT do Supabase Auth. Essa arquitetura garante o menor custo operacional do banco mantendo o maior nível de conformidade de segurança e escalabilidade.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-teal-400" />
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Identificador de Tenant</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Cada tabela no banco de dados possui uma coluna <code className="text-teal-400">tenant_id</code>. Não são criadas instâncias físicas distintas por cliente, o que otimiza custos e simplifica atualizações globais de schema.
                </p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">RLS ativado por Padrão</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Os administradores das lojas acessam o painel usando credenciais cujo payload JWT do Supabase contém o metadado customizado <code className="text-teal-400">tenant_id</code>. Toda query injeta implicitamente essa validação de escopo.
                </p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Subdomínios Dinâmicos</h4>
                </div>
                <p className="text-xs text-slate-400">
                  O cliente final acessa <code className="text-teal-400">empresa.resengo.app</code>. O proxy do Next.js lê o header do subdomínio, mapeia para o slug do tenant no banco e filtra o cardápio automaticamente.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 mt-6 font-mono text-xs">
              <p className="text-slate-500 mb-2">// Exemplo de RLS no PostgreSQL do Supabase para Isolamento</p>
              <pre className="text-teal-300 overflow-x-auto whitespace-pre-wrap">
{`ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolamento por Tenant nas Vendas" ON orders
  FOR ALL
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: POSTGRESQL SCHEMAS (DDL) */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 mt-1">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Modelagem PostgreSQL de Alta Performance</h3>
                <p className="text-slate-400 mt-1">
                  Schema completo pronto para produção, prevendo relações um-para-muitos, chaves estrangeiras com cascata segura, indexação de busca por status/data e constraints rígidas para garantir consistência financeira.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
              <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-slate-400">
                <span>schema_ddl.sql</span>
                <span className="text-teal-400">PostgreSQL v15+</span>
              </div>
              <div className="p-4 max-h-[450px] overflow-y-auto space-y-4">
                <pre className="text-emerald-300 whitespace-pre">
{`-- 1. CADASTRO DE EMPRESAS (TENANTS)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    logo_url TEXT,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    phone VARCHAR(20) NOT NULL,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE INDEX idx_tenants_slug ON tenants(slug);

-- 2. CADASTRO DE MOTOBOYS
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pix_key VARCHAR(100) NOT NULL,
    vehicle VARCHAR(50) NOT NULL,
    plate VARCHAR(15) NOT NULL,
    commission_per_delivery DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE INDEX idx_drivers_tenant ON drivers(tenant_id);

-- 3. CARDÁPIO E PRODUTOS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Pizza, Hambúrguer, Combo, etc.
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_pizza_base BOOLEAN DEFAULT FALSE,
    is_combo BOOLEAN DEFAULT FALSE,
    combo_items JSONB, -- [ {product_name, quantity, removable} ]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE INDEX idx_products_tenant_cat ON products(tenant_id, category);

-- 4. SABORES DE PIZZAS (PARA PIZZAS FRACIONADAS)
CREATE TABLE pizza_flavors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    is_special BOOLEAN DEFAULT FALSE,
    additional_price DECIMAL(10,2) DEFAULT 0.00,
    ingredients TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. BORDAS RECHEADAS
CREATE TABLE pizza_borders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    is_special BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. CABEÇALHO DO PEDIDO
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_number SERIAL,
    status VARCHAR(30) NOT NULL DEFAULT 'Rascunho', -- Rascunho, Confirmado, Em Produção, No Forno, Pronto, Saiu para Entrega, Entregue, Cancelado
    type VARCHAR(20) NOT NULL, -- Delivery, Retirada, Balcão
    
    -- Dados de Entrega
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    customer_bairro VARCHAR(100),
    customer_city VARCHAR(100),
    
    -- Valores
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    
    -- Vinculações
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status);

-- 7. ITENS DO PEDIDO
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    
    -- Customizações de Pizza (Fracionada)
    is_pizza BOOLEAN DEFAULT FALSE,
    fraction INTEGER DEFAULT 1, -- 1 = inteira, 2 = meio, 3 = um terço, 4 = um quarto
    flavors JSONB DEFAULT '[]', -- Armazena IDs e nomes dos sabores selecionados
    border_id UUID REFERENCES pizza_borders(id) ON DELETE SET NULL,
    
    -- Customizações de Combo
    is_combo BOOLEAN DEFAULT FALSE,
    removed_items TEXT[] DEFAULT '{}',
    added_items JSONB DEFAULT '[]'
);

-- 8. HISTÓRICO DE ALTERAÇÃO DE PEDIDO (AUDITORIA)
CREATE TABLE order_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. MOVIMENTAÇÃO FINANCEIRA (FLUXO DE CAIXA)
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('entrada', 'saída')),
    category VARCHAR(40) NOT NULL, -- Gás, Queijo, Funcionários, Motoboy, Aluguel, Outros
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE INDEX idx_fin_tenant_date ON financial_transactions(tenant_id, date);`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUSINESS RULES & PRICING */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 mt-1">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Regras de Negócio Avançadas</h3>
                <p className="text-slate-400 mt-1">
                  O core operacional do ResenGO implementa regras dinâmicas que garantem faturamento preciso em frações de sabores, customização de bordas e histórico completo de auditorias.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-semibold text-teal-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Regra de Sabores Especiais Fracionados
                </h4>
                <p className="text-xs text-slate-400">
                  Pizzarias antigas cobram sempre pela de maior valor. O <strong>ResenGO</strong> introduz a cobrança proporcional justa do adicional de sabores especiais para reter o cliente, ou permite parametrizar a regra do maior valor:
                </p>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-teal-300">
                  <p className="text-slate-500">// Fórmula de Cálculo de adicionais das frações</p>
                  <p className="mt-1">
                    Preço Pizza = Preço Base + (Soma(Adicional do Sabor_i) / Fração) + Preço Borda
                  </p>
                  <ul className="list-disc list-inside mt-2 text-slate-400 space-y-1 font-sans">
                    <li>1 Sabor Especial Inteiro: Cobrar base + 100% do especial (Ex: + R$ 18,00)</li>
                    <li>1/2 Especial + 1/2 Comum: Cobrar base + 50% do especial (Ex: + R$ 9,00)</li>
                    <li>1/4 Especial + 3/4 Comum: Cobrar base + 25% do especial (Ex: + R$ 4,50)</li>
                    <li>2/4 Especial Diferente: Cobrar base + 25% do EspA + 25% do EspB</li>
                  </ul>
                </div>
              </div>

              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-semibold text-teal-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Regra de Alteração de Pedido Confirmado
                </h4>
                <p className="text-xs text-slate-400">
                  Pedidos podem ser alterados a qualquer momento antes da entrega final.
                </p>
                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 font-mono flex items-center justify-center shrink-0">1</span>
                    <p className="text-[11px] text-slate-300"><strong>Geração de Histórico:</strong> Qualquer alteração no carrinho gera um log imutável na tabela <code className="text-amber-400">order_logs</code> com o usuário responsável.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 font-mono flex items-center justify-center shrink-0">2</span>
                    <p className="text-[11px] text-slate-300"><strong>Recálculo Financeiro:</strong> O sistema recalcula o valor total subtraindo descontos e adicionando novas taxas de entrega se houver troca de endereço.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 font-mono flex items-center justify-center shrink-0">3</span>
                    <p className="text-[11px] text-slate-300"><strong>Sincronização de Caixa:</strong> Caso o pedido já tenha sido pago e integrado ao fluxo de caixa, o sistema faz o estorno ou o lançamento de débito adicional de forma automática no caixa do dia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: API ENDPOINTS */}
        {activeTab === 'apis' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 mt-1">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Estrutura de APIs REST & Eventos Realtime</h3>
                <p className="text-slate-400 mt-1">
                  A comunicação entre os terminais de cozinha, painel de despacho e o site de pedidos opera sobre websockets para atualizações imediatas, secundada por endpoints HTTP.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div>
                <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">GET</span>
                <span className="text-white ml-2">/api/v1/menu?slug=bella-italia</span>
                <p className="text-slate-400 text-[11px] ml-12 mt-0.5">Retorna o cardápio estruturado da empresa filtrado pelo subdomínio (público).</p>
              </div>
              <hr className="border-slate-800" />
              <div>
                <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">POST</span>
                <span className="text-white ml-2">/api/v1/orders</span>
                <p className="text-slate-400 text-[11px] ml-12 mt-0.5">Criação de novos pedidos vindo do canal do cliente (Site/App) - Entra como Rascunho.</p>
              </div>
              <hr className="border-slate-800" />
              <div>
                <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">PUT</span>
                <span className="text-white ml-2">/api/v1/orders/:id</span>
                <p className="text-slate-400 text-[11px] ml-12 mt-0.5">Edita itens do pedido, recalcula o financeiro, insere registro no log de alteração.</p>
              </div>
              <hr className="border-slate-800" />
              <div>
                <span className="bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">PATCH</span>
                <span className="text-white ml-2">/api/v1/orders/:id/status</span>
                <p className="text-slate-400 text-[11px] ml-12 mt-0.5">Atualiza o estado no Kanban de produção. Dispara evento via websocket para o site de rastreio do cliente.</p>
              </div>
              <hr className="border-slate-800" />
              <div>
                <span className="bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">WS</span>
                <span className="text-teal-400 ml-2">supabase_realtime("orders:tenant_id=eq.:id")</span>
                <p className="text-slate-400 text-[11px] ml-12 mt-0.5">Canal de escuta em tempo real do painel administrativo. Garante faturamento e kitchen screen sem recarregar.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FLOWS & FLOWCHARTS */}
        {activeTab === 'flows' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 mt-1">
                <GitMerge className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Fluxos do Sistema e Jornada do Pedido</h3>
                <p className="text-slate-400 mt-1">
                  Ciclo completo de vida de um pedido no ResenGO, integrando atendimento, controle de cozinha, despacho de frota e conciliação do caixa financeiro.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Mapeamento de Estados e gatilhos automatizados</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-800 border border-slate-700 text-slate-300 w-24 text-center py-1 rounded text-xs font-mono font-bold shrink-0">Rascunho</span>
                  <div className="text-xs text-slate-400">O pedido é montado pelo cliente no site ou criado pela atendente via balcão. Sem reserva física na cozinha.</div>
                </div>
                <div className="w-0.5 h-3 bg-slate-700 ml-12"></div>
                
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 w-24 text-center py-1 rounded text-xs font-mono font-bold shrink-0">Confirmado</span>
                  <div className="text-xs text-slate-400">O estabelecimento aceita o pedido. Se for delivery, valida a taxa de frete. Notifica o cliente por WhatsApp.</div>
                </div>
                <div className="w-0.5 h-3 bg-slate-700 ml-12"></div>

                <div className="flex items-center gap-3">
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 w-24 text-center py-1 rounded text-xs font-mono font-bold shrink-0">Em Produção</span>
                  <div className="text-xs text-slate-400">Entra nas telas de preparo (KDS) da pizzaria/hamburgueria. Permite modificação ágil com aviso na tela do cozinheiro.</div>
                </div>
                <div className="w-0.5 h-3 bg-slate-700 ml-12"></div>

                <div className="flex items-center gap-3">
                  <span className="bg-orange-500/10 border border-orange-500/20 text-orange-300 w-24 text-center py-1 rounded text-xs font-mono font-bold shrink-0">No Forno / Prep</span>
                  <div className="text-xs text-slate-400">Estado customizado para pizzarias (forno) ou montagem final de lanches.</div>
                </div>
                <div className="w-0.5 h-3 bg-slate-700 ml-12"></div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 w-24 text-center py-1 rounded text-xs font-mono font-bold shrink-0">Pronto</span>
                  <div className="text-xs text-slate-400">Embalado e posicionado na mesa de expedição. Notifica o despachante para atribuição de motoboy.</div>
                </div>
                <div className="w-0.5 h-3 bg-slate-700 ml-12"></div>

                <div className="flex items-center gap-3">
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 w-24 text-center py-1 rounded text-xs font-mono font-bold shrink-0">Saiu p/ Entrega</span>
                  <div className="text-xs text-slate-400">Motoboy recebe o pedido no App. Adiciona o valor da comissão ao saldo do motoboy do dia. Rastreio habilitado.</div>
                </div>
                <div className="w-0.5 h-3 bg-slate-700 ml-12"></div>

                <div className="flex items-center gap-3">
                  <span className="bg-green-500/20 border border-green-500/30 text-green-400 w-24 text-center py-1 rounded text-xs font-mono font-bold shrink-0">Entregue</span>
                  <div className="text-xs text-slate-400">Pedido pago e finalizado. Lança automaticamente o valor correspondente no livro de entradas do Financeiro.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ROADMAPS */}
        {activeTab === 'roadmaps' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 mt-1">
                <Milestone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Cronograma Estratégico de Evolução</h3>
                <p className="text-slate-400 mt-1">
                  Passo a passo planejado de lançamentos focado em gerar caixa rápido com o MVP e consolidar diferenciais competitivos com IA e canais integrados nas versões futuras.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-5 bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-all">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-500 text-slate-950 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">MVP (Mês 1-2)</span>
                  <h4 className="text-white font-semibold text-sm">Operação de Cozinha</h4>
                </div>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li>Painel multi-tenant com isolamento RLS.</li>
                  <li>Cardápio digital customizado com subdomínio.</li>
                  <li>Módulo de Pizza Fracionada e Adicionais proporcionais.</li>
                  <li>Kanban de produção e gerenciamento de motoboys.</li>
                  <li>Financeiro básico com fluxo de caixa e fechamento do dia.</li>
                </ul>
              </div>

              <div className="p-5 bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-all">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500 text-slate-950 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">V2 (Mês 3-5)</span>
                  <h4 className="text-white font-semibold text-sm">Integrações & WhatsApp</h4>
                </div>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li>API de disparo de WhatsApp nativa (Z-API/Evolution) para envio de status.</li>
                  <li>Robô atendente para automação de pedidos de rascunho no WhatsApp.</li>
                  <li>Impressão direta em impressoras térmicas via protocolo local.</li>
                  <li>App do Motoboy para aceite de rotas e cálculo de combustível automatizado.</li>
                </ul>
              </div>

              <div className="p-5 bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-all">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-500 text-slate-950 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">V3 (Mês 6+)</span>
                  <h4 className="text-white font-semibold text-sm">Escala & Inteligência</h4>
                </div>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>IA ResenGO:</strong> Motor preditivo para estimativa de estoque (Gás, Queijo) com base no clima e feriados.</li>
                  <li>Precificação dinâmica automática para horários de pico (estilo Uber).</li>
                  <li>Mapeamento geográfico de clientes recorrentes para otimização de frotas de entrega.</li>
                  <li>Gateway de pagamento Split nativo para pagar motoboy na entrega.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
