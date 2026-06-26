/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { tenants, initialOrders, initialTransactions, drivers } from './data/mockData';
import { Order, FinancialTransaction, Tenant, OrderStatus, Customer } from './types';

// Import subcomponents
import ArchitectureDoc from './components/ArchitectureDoc';
import SaaSMenuEditor from './components/SaaSMenuEditor';
import SaaSOrdersPanel from './components/SaaSOrdersPanel';
import SaaSKanban from './components/SaaSKanban';
import SaaSMotoboys from './components/SaaSMotoboys';
import SaaSFinance from './components/SaaSFinance';
import SaaSCustomerSite from './components/SaaSCustomerSite';
import SaaSCustomers from './components/SaaSCustomers';
import SaaSPizzeriaSettings from './components/SaaSPizzeriaSettings';
import ResengoAuthPortal from './components/ResengoAuthPortal';
import ResengoMasterPanel from './components/ResengoMasterPanel';

// Lucide Icons
import {
  ChefHat,
  Compass,
  LayoutDashboard,
  Utensils,
  BookOpen,
  DollarSign,
  Bike,
  Building,
  CreditCard,
  ShoppingBag,
  Bell,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Users,
  ChevronRight,
  ChevronLeft,
  LogOut
} from 'lucide-react';

export default function App() {
  // Global States
  // Global States
  const [tenantsList, setTenantsList] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('saas_tenants_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return tenants.map(t => ({
      ...t,
      email: t.email || 'contato@resenhapizzas.com.br',
      password: t.password || '123456',
      isActive: t.isActive !== false,
      plan: t.plan || 'basic',
      trialDaysLeft: t.trialDaysLeft || 3,
      representativeName: t.representativeName || 'Tiago Lutterbach'
    }));
  });

  const handleUpdateTenantsList = (updated: Tenant[]) => {
    setTenantsList(updated);
    localStorage.setItem('saas_tenants_list', JSON.stringify(updated));
    
    // Also sync current active tenant if its state changed in the master panel (e.g., got blocked or details changed)
    if (activeTenant && activeTenant.id !== 'master') {
      const currentInList = updated.find(t => t.id === activeTenant.id);
      if (currentInList) {
        setActiveTenant(currentInList);
        localStorage.setItem('saas_active_tenant', JSON.stringify(currentInList));
      }
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('saas_is_logged_in') === 'true';
  });

  const [isMaster, setIsMaster] = useState<boolean>(() => {
    return localStorage.getItem('saas_is_master') === 'true';
  });

  const [activeTenant, setActiveTenant] = useState<Tenant>(() => {
    const saved = localStorage.getItem('saas_active_tenant');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'tenant-1',
      name: 'Resenha Pizzas',
      slug: 'resenha-pizzas',
      logo: '🍕',
      type: 'pizzaria',
      deliveryFee: 8.00,
      phone: '(49) 99805-9293',
      email: 'contato@resenhapizzas.com.br',
      password: '123456',
      cnpj: '45.102.839/0001-20',
      address: 'Avenida Belizário Ramos, 3500',
      bairro: 'Copacabana',
      city: 'Lages',
      state: 'SC',
      corporateName: 'Resenha Pizzaria Ltda',
      cep: '88506-000',
      slogan: 'OPERAÇÃO ENXUTA PARA PIZZARIAS',
      isActive: true,
      plan: 'basic',
      trialDaysLeft: 3,
      representativeName: 'Tiago Lutterbach'
    };
  });

  const handleUpdateTenant = (updated: Tenant) => {
    setActiveTenant(updated);
    localStorage.setItem('saas_active_tenant', JSON.stringify(updated));
    
    // Also sync back to tenantsList
    const updatedList = tenantsList.map(t => t.id === updated.id ? updated : t);
    setTenantsList(updatedList);
    localStorage.setItem('saas_tenants_list', JSON.stringify(updatedList));
  };

  const handleSaaSLogin = (tenant: Tenant, isMasterUser: boolean) => {
    setIsLoggedIn(true);
    setIsMaster(isMasterUser);
    setActiveTenant(tenant);
    localStorage.setItem('saas_is_logged_in', 'true');
    localStorage.setItem('saas_is_master', isMasterUser ? 'true' : 'false');
    localStorage.setItem('saas_active_tenant', JSON.stringify(tenant));
  };

  const handleSaaSLogout = () => {
    setIsLoggedIn(false);
    setIsMaster(false);
    localStorage.setItem('saas_is_logged_in', 'false');
    localStorage.setItem('saas_is_master', 'false');
  };

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'kds' | 'menu' | 'finance' | 'drivers' | 'pizzeria' | 'blueprint'>('orders');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSmartphone, setShowSmartphone] = useState(true);

  // Lifted customers state shared with all tabs
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('saas_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial customer list
    const list: Customer[] = [
      { id: 'c-1', tenantId: 'tenant-1', name: 'Tiago Lutterbach', phone: '(49) 99999-5555', address: 'Av. Marechal Floriano, 150 - Apto 302', bairro: 'Centro', city: 'Lages', createdAt: '2026-06-23T19:30:00Z' },
      { id: 'c-2', tenantId: 'tenant-1', name: 'Mariana Costa', phone: '(49) 98888-7777', address: 'Rua XV de Novembro, 250', bairro: 'Coral', city: 'Lages', createdAt: '2026-06-23T19:55:00Z' },
      { id: 'c-3', tenantId: 'tenant-1', name: 'Carlos Silva', phone: '(49) 99900-1234', address: 'Rua Emiliano Ramos, 88', bairro: 'Centro', city: 'Lages', createdAt: '2026-06-23T19:10:00Z' }
    ];
    return list;
  });

  const handleUpdateCustomers = (updated: Customer[]) => {
    setCustomers(updated);
    localStorage.setItem('saas_customers', JSON.stringify(updated));
  };

  // Shared state to allow starting a pre-filled POS order from the customer database
  const [preSelectedCustomer, setPreSelectedCustomer] = useState<Customer | null>(null);
  
  // Notification alert when a client site order arrives
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Active incoming client order that requires manual acceptance (repeats beep every 4s)
  const [activeIncomingOrder, setActiveIncomingOrder] = useState<Order | null>(null);

  // Browser Notification & Sound State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Play custom synthesizer double-chime sound (extremely robust, 0 asset dependencies)
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Resume context if suspended (browser autocomplete privacy blocks audio)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // First tone (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);

      // Second tone (A5) slightly delayed
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Som de notificação bloqueado pelo navegador até interação do usuário.');
    }
  };

  // Main notification router
  const triggerNotification = (title: string, body: string) => {
    // 1. Always play clean audio chime
    playNotificationSound();

    // 2. Dispatch desktop visual banner if permission is allowed
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://cdn-icons-png.flaticon.com/512/3595/3595454.png',
          tag: 'new-order',
        } as any);
      } catch (e) {
        console.warn('Erro ao disparar notificação nativa:', e);
      }
    }
  };

  const requestNotificationPermission = () => {
    if (typeof Notification === 'undefined') {
      alert('Este navegador não suporta notificações de desktop.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
      if (permission === 'granted') {
        triggerNotification(
          '🔔 Alertas Desktops Ativos!',
          'Você receberá notificações sonoras e visuais a cada novo pedido recebido!'
        );
      }
    });
  };

  const testNotification = () => {
    triggerNotification(
      `🍕 Pedido de Teste #${Math.floor(1000 + Math.random() * 9000)}`,
      `Cliente de Teste • Total: R$ 49,90 • Alerta sonoro e visual funcionando!`
    );
  };

  // Repeating audio chime alert every 4 seconds for new incoming online orders
  React.useEffect(() => {
    if (!activeIncomingOrder) return;

    // Play once immediately
    playNotificationSound();

    const interval = setInterval(() => {
      playNotificationSound();
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIncomingOrder]);

  // Switch tenant
  const handleTenantChange = (slug: string) => {
    const found = tenants.find((t) => t.slug === slug);
    if (found) {
      setActiveTenant(found);
    }
  };

  // Add Order (from simulation storefront)
  const handleAddOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setActiveIncomingOrder(newOrder); // Keep alert persistent on screen until accepted
    setShowNotification(`🍕 Novo pedido recebido: ${newOrder.orderNumber} por ${newOrder.customerName}!`);
    
    // Trigger fully auditory and visual desktop alert
    triggerNotification(
      `🔔 Novo Pedido Recebido! (${newOrder.orderNumber})`,
      `Cliente: ${newOrder.customerName} • Total: R$ ${newOrder.total.toFixed(2)}`
    );
  };

  // Log new financial transaction
  const handleLogTransaction = (
    type: 'entrada' | 'saída',
    category: any,
    amount: number,
    desc: string,
    orderId?: string
  ) => {
    const newTx: FinancialTransaction = {
      id: `t-${Date.now()}`,
      tenantId: activeTenant.id,
      type,
      category,
      amount,
      description: desc,
      date: new Date().toISOString().split('T')[0],
      orderId,
    };
    setTransactions([newTx, ...transactions]);
  };

  // Dashboard Stats Calculations for Active Tenant
  const tenantOrders = orders.filter((o) => o.tenantId === activeTenant.id);
  const tenantTxs = transactions.filter((t) => t.tenantId === activeTenant.id);

  // Total daily revenue (today is simulated as 2026-06-23)
  const faturamentoHoje = tenantTxs
    .filter((t) => t.type === 'entrada' && t.date === '2026-06-23')
    .reduce((sum, t) => sum + t.amount, 0);

  const pedidosHoje = tenantOrders.filter((o) => o.createdAt.startsWith('2026-06-23') || o.createdAt.includes('site')).length;
  
  const ticketMedio = pedidosHoje > 0 ? faturamentoHoje / pedidosHoje : 0;

  const pedidosProducao = tenantOrders.filter((o) => ['Em Produção', 'No Forno'].includes(o.status)).length;
  const pedidosEntrega = tenantOrders.filter((o) => o.status === 'Saiu para Entrega').length;
  const pedidosConcluidos = tenantOrders.filter((o) => o.status === 'Entregue').length;

  if (!isLoggedIn) {
    return (
      <ResengoAuthPortal
        tenants={tenantsList}
        onSetTenants={handleUpdateTenantsList}
        onLoginSuccess={handleSaaSLogin}
      />
    );
  }

  if (isLoggedIn && isMaster) {
    return (
      <ResengoMasterPanel
        tenants={tenantsList}
        onUpdateTenants={handleUpdateTenantsList}
        onLogout={handleSaaSLogout}
        onImpersonate={(tenant) => {
          setIsMaster(false);
          setActiveTenant(tenant);
          localStorage.setItem('saas_is_master', 'false');
          localStorage.setItem('saas_active_tenant', JSON.stringify(tenant));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-800 flex flex-col antialiased font-sans">
      {/* PERSISTENT NEW ORDER MODAL OVERLAY */}
      {activeIncomingOrder && (
        <div className="fixed inset-0 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl border-4 border-orange-500 shadow-2xl max-w-md w-full p-6 animate-pulse-subtle relative overflow-hidden flex flex-col gap-4">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl px-4 py-3.5 flex items-center gap-2.5 shadow-sm animate-pulse">
              <Bell className="w-5 h-5 text-white animate-bounce shrink-0" />
              <div>
                <h3 className="font-display font-black text-xs uppercase tracking-wider leading-none">NOVO PEDIDO ONLINE RECEBIDO!</h3>
                <p className="text-[10px] text-orange-100 font-mono mt-0.5 font-bold">O som apitará a cada 4 segundos até ser aceito.</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-3 divide-y divide-stone-100 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Identificação</span>
                <span className="font-mono font-black text-stone-900 text-sm bg-stone-100 px-2 py-0.5 rounded">
                  {activeIncomingOrder.orderNumber}
                </span>
              </div>

              <div className="space-y-1 py-2.5">
                <p className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Cliente</p>
                <p className="font-black text-stone-900 text-xs uppercase">{activeIncomingOrder.customerName}</p>
                <p className="text-[10px] text-stone-500 font-medium">Bairro: {activeIncomingOrder.customerBairro || 'Não informado'}</p>
                <p className="text-[10px] text-stone-500 font-mono font-bold">Serviço: {activeIncomingOrder.type}</p>
              </div>

              {/* Items List */}
              <div className="py-2.5 space-y-1.5">
                <p className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Produtos Escolhidos</p>
                <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1.5 animate-fade-in">
                  {activeIncomingOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 p-2 rounded-lg border border-stone-150 text-[11px] leading-tight flex justify-between items-start">
                      <div>
                        <span className="font-black text-stone-900">
                          {item.quantity}x {item.name}
                        </span>
                        {item.notes && <p className="text-[9px] text-red-600 font-semibold">Obs: {item.notes}</p>}
                      </div>
                      <span className="font-mono text-stone-700 font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 font-mono">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Valor Total</span>
                <span className="text-lg font-black text-red-700">
                  R$ {activeIncomingOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setActiveIncomingOrder(null);
                setShowNotification(`✅ Pedido ${activeIncomingOrder.orderNumber} aceito e enviado para produção!`);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 transform active:scale-95 text-xs uppercase tracking-wider"
            >
              <CheckCircle className="w-4 h-4" />
              Aceitar Pedido
            </button>
          </div>
        </div>
      )}

      {/* Top Notification Banner */}
      {showNotification && (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 font-bold text-center text-xs flex items-center justify-center gap-2 animate-pulse sticky top-0 z-50 shadow-lg">
          <Bell className="w-4 h-4 animate-bounce" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Main SaaS Platform Header */}
      <header className="bg-white border-b border-stone-200/80 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <img src="/LOGO.png" alt="ResenGO Logo" className="w-12 h-12 object-contain rounded-xl border border-stone-200/40 bg-orange-50 p-1 shadow-3xs shrink-0" referrerPolicy="no-referrer" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-display font-black text-stone-900 tracking-tight">{activeTenant.name}</h1>
                <span className="bg-orange-100 text-orange-700 text-[9px] font-mono px-2 py-0.5 rounded border border-orange-200 font-bold">
                  SaaS OPERACIONAL
                </span>
              </div>
              <p className="text-[9px] text-stone-400 mt-0.5 uppercase tracking-widest font-mono font-bold">
                {activeTenant.slogan || 'SISTEMA OPERACIONAL ULTRA-ENXUTO'}
              </p>
            </div>
          </div>

          {/* Right section: Switcher + Notification Alerts */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Notification Center Widget */}
            <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200/80">
              <div className="text-left hidden sm:block pl-1.5">
                <p className="text-[8px] text-stone-400 uppercase tracking-wider leading-none font-bold">ALERTA GESTOR</p>
                <p className="text-xs font-bold text-stone-700">Som & Desktop</p>
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 shadow-xs">
                {notificationPermission === 'default' && (
                  <button
                    onClick={requestNotificationPermission}
                    className="px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <Bell className="w-3 h-3 animate-bounce" />
                    Ativar Alertas
                  </button>
                )}

                {notificationPermission === 'granted' && (
                  <div className="flex items-center gap-1">
                    <div className="px-2.5 py-1 text-emerald-700 text-[10px] font-bold flex items-center gap-1 bg-emerald-50 rounded border border-emerald-150">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Alertas Ativos</span>
                    </div>
                    <button
                      onClick={testNotification}
                      className="px-2 py-1 hover:bg-stone-100 text-stone-500 hover:text-stone-800 text-[9px] font-mono font-bold rounded transition-all cursor-pointer"
                      title="Simular pedido de teste para testar som e aviso visual"
                    >
                      Testar
                    </button>
                  </div>
                )}

                {notificationPermission === 'denied' && (
                  <div className="flex items-center gap-1">
                    <div className="px-2.5 py-1 text-amber-700 text-[10px] font-bold flex items-center gap-1 bg-amber-50 rounded border border-amber-150" title="Ative as notificações na barra de endereços do seu navegador.">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Som Ativo</span>
                    </div>
                    <button
                      onClick={testNotification}
                      className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[9px] font-mono font-bold rounded transition-all cursor-pointer"
                      title="Notificações de desktop bloqueadas. Clique para testar o aviso sonoro do app!"
                    >
                      Testar Som
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Toggle Smartphone Button */}
            <button
              onClick={() => setShowSmartphone(!showSmartphone)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                showSmartphone
                  ? 'bg-orange-50 text-orange-700 border-orange-200/80 shadow-3xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title={showSmartphone ? 'Ocultar canal de vendas simulado para aumentar o sistema' : 'Mostrar canal de vendas simulado'}
            >
              <Smartphone className="w-4 h-4 text-orange-600" />
              <span className="hidden sm:inline">{showSmartphone ? 'Ocultar Celular' : 'Mostrar Celular'}</span>
            </button>

            {/* SaaS Logout Button */}
            <button
              onClick={handleSaaSLogout}
              className="px-3 py-2 bg-stone-900 text-stone-100 hover:bg-red-700 hover:text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border border-stone-850 cursor-pointer shadow-3xs"
              title="Sair da conta e voltar ao Portal Resengo"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do Painel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Operational KPI Ribbon - Integrated directly below the header to save space */}
      <div className="bg-stone-50 border-b border-stone-200/60 py-3 px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 font-bold uppercase tracking-wider text-[10px] font-mono">
            <span className="animate-pulse flex h-2 w-2 rounded-full bg-orange-600"></span>
            <span>Indicadores do Dia (Clique para filtrar/abrir)</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Caixa */}
            <button
              onClick={() => setActiveTab('finance')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-3xs hover:-translate-y-0.5 active:translate-y-0"
              title="Abrir Financeiro (Caixa)"
            >
              <span className="text-sm">💵</span>
              <span>Caixa:</span>
              <span className="text-emerald-700 font-black font-mono">R$ {faturamentoHoje.toFixed(2)}</span>
            </button>

            {/* Pedidos */}
            <button
              onClick={() => setActiveTab('orders')}
              className="bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200/80 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-3xs hover:-translate-y-0.5 active:translate-y-0"
              title="Abrir Atendimento & Caixa"
            >
              <span className="text-sm">📋</span>
              <span>Pedidos:</span>
              <span className="text-orange-700 font-black font-mono">{pedidosHoje}</span>
            </button>

            {/* Ticket Médio */}
            <button
              onClick={() => setActiveTab('finance')}
              className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-3xs hover:-translate-y-0.5 active:translate-y-0"
              title="Abrir Financeiro"
            >
              <span className="text-sm">📊</span>
              <span>Ticket Médio:</span>
              <span className="text-sky-700 font-black font-mono">R$ {ticketMedio.toFixed(2)}</span>
            </button>

            {/* Na Cozinha */}
            <button
              onClick={() => setActiveTab('kds')}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-3xs hover:-translate-y-0.5 active:translate-y-0 relative"
              title="Abrir Monitor da Cozinha (KDS)"
            >
              <span className="text-sm">🍳</span>
              <span>Na Cozinha:</span>
              <span className="text-amber-700 font-black font-mono">{pedidosProducao}</span>
              {pedidosProducao > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </button>

            {/* Em Entrega */}
            <button
              onClick={() => setActiveTab('drivers')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/80 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-3xs hover:-translate-y-0.5 active:translate-y-0"
              title="Abrir Controle de Motoboys"
            >
              <span className="text-sm">🏍️</span>
              <span>Em Entrega:</span>
              <span className="text-purple-700 font-black font-mono">{pedidosEntrega}</span>
            </button>

            {/* Concluídos */}
            <button
              onClick={() => setActiveTab('orders')}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-3xs hover:-translate-y-0.5 active:translate-y-0"
              title="Abrir Atendimento & Caixa"
            >
              <span className="text-sm">✅</span>
              <span>Concluídos:</span>
              <span className="text-stone-700 font-black font-mono">{pedidosConcluidos}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Layout Grid: Platform on left, mobile preview simulation on right */}
      <main className={`flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 ${showSmartphone ? 'xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        
        {/* LEFT COLUMN: PRIMARY SAAS WORKSPACE (Takes 3 columns if phone is active, else full width) */}
        <div className={`${showSmartphone ? 'xl:col-span-3' : 'xl:col-span-4'} space-y-6`}>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Navigation Sidebar (Collapsible) */}
            <div className={`shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-56'} w-full lg:w-auto`}>
              <div className="bg-white border border-stone-200 rounded-2xl p-2.5 shadow-xs flex flex-col gap-1 w-full sticky top-24">
                {/* Sidebar Header with Collapse Toggle */}
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-stone-100 mb-1.5 gap-1">
                  {!isSidebarCollapsed && (
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider font-mono">
                      Menu SaaS
                    </span>
                  )}
                  <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 ml-auto transition-all cursor-pointer flex items-center justify-center border border-stone-200 shadow-3xs"
                    title={isSidebarCollapsed ? "Expandir Menu" : "Encurtar Menu"}
                  >
                    {isSidebarCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-stone-600" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 text-stone-600" />
                    )}
                  </button>
                </div>

                {/* Shortcuts */}
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60 shadow-3xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Atendimento & Caixa"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0 text-orange-600" />
                  {!isSidebarCollapsed && <span className="truncate">Atendimento & Caixa</span>}
                </button>

                <button
                  onClick={() => setActiveTab('customers')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer ${
                    activeTab === 'customers'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60 shadow-3xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Clientes (CRM)"
                >
                  <Users className="w-4 h-4 shrink-0 text-orange-600" />
                  {!isSidebarCollapsed && <span className="truncate">Clientes</span>}
                </button>

                <button
                  onClick={() => setActiveTab('kds')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer relative ${
                    activeTab === 'kds'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60 shadow-3xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Monitor da Cozinha"
                >
                  <ChefHat className="w-4 h-4 shrink-0 text-orange-600" />
                  {!isSidebarCollapsed && <span className="truncate">Monitor Cozinha</span>}
                  {pedidosProducao > 0 && (
                    <span className={`absolute ${isSidebarCollapsed ? 'top-1.5 right-1.5' : 'top-2.5 right-2.5'} bg-orange-600 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse shadow-3xs`}>
                      {pedidosProducao}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('menu')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer ${
                    activeTab === 'menu'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60 shadow-3xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Cardápios & Preços"
                >
                  <Utensils className="w-4 h-4 shrink-0 text-orange-600" />
                  {!isSidebarCollapsed && <span className="truncate">Cardápio</span>}
                </button>

                <button
                  onClick={() => setActiveTab('finance')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer ${
                    activeTab === 'finance'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60 shadow-3xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Financeiro"
                >
                  <DollarSign className="w-4 h-4 shrink-0 text-orange-600" />
                  {!isSidebarCollapsed && <span className="truncate">Financeiro</span>}
                </button>

                <button
                  onClick={() => setActiveTab('drivers')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer ${
                    activeTab === 'drivers'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60 shadow-3xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Controle de Motoboys"
                >
                  <Bike className="w-4 h-4 shrink-0 text-orange-600" />
                  {!isSidebarCollapsed && <span className="truncate">Motoboy</span>}
                </button>

                <button
                  onClick={() => setActiveTab('pizzeria')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2.5'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer ${
                    activeTab === 'pizzeria'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60 shadow-3xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Cadastro da Pizzaria"
                >
                  <Building className="w-4 h-4 shrink-0 text-orange-600" />
                  {!isSidebarCollapsed && <span className="truncate">Cadastro Pizzaria</span>}
                </button>

                <div className="border-t border-stone-100 my-1.5"></div>

                <button
                  onClick={() => setActiveTab('blueprint')}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-0 h-11' : 'gap-3 px-3 py-2'} rounded-xl text-xs font-bold transition-all w-full text-left cursor-pointer ${
                    activeTab === 'blueprint'
                      ? 'bg-orange-50 text-orange-700 border border-orange-250'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 border border-transparent'
                  }`}
                  title="Guia Técnico"
                >
                  <BookOpen className="w-4 h-4 shrink-0 text-stone-500" />
                  {!isSidebarCollapsed && <span className="truncate">Guia Técnico</span>}
                </button>
              </div>
            </div>

            {/* Tab Contents Container (takes full width) */}
            <div className="flex-1 w-full bg-white border border-stone-200 rounded-2xl p-4 lg:p-6 shadow-sm min-h-[500px]">
              
              {/* TAB: ORDERS / EDIT */}
              {activeTab === 'orders' && (
                <SaaSOrdersPanel
                  orders={orders}
                  onUpdateOrders={setOrders}
                  currentTenantId={activeTenant.id}
                  customers={customers}
                  onUpdateCustomers={handleUpdateCustomers}
                  preSelectedCustomer={preSelectedCustomer}
                  onClearPreSelectedCustomer={() => setPreSelectedCustomer(null)}
                />
              )}

              {/* TAB: CUSTOMERS DATABASE */}
              {activeTab === 'customers' && (
                <SaaSCustomers
                  customers={customers}
                  orders={orders}
                  onUpdateCustomers={handleUpdateCustomers}
                  onSelectCustomerForNewOrder={(cust) => {
                    setPreSelectedCustomer(cust);
                    setActiveTab('orders');
                  }}
                />
              )}

              {/* TAB: KANBAN COZINHA */}
              {activeTab === 'kds' && (
                <SaaSKanban
                  orders={orders}
                  drivers={drivers}
                  currentTenantId={activeTenant.id}
                  onUpdateOrders={setOrders}
                  onLogTransaction={handleLogTransaction}
                />
              )}

              {/* TAB: MENU & PRODUCTS */}
              {activeTab === 'menu' && (
                <SaaSMenuEditor currentTenantId={activeTenant.id} />
              )}

              {/* TAB: FINANCEIRO (SEPARATED) */}
              {activeTab === 'finance' && (
                <SaaSFinance
                  transactions={transactions}
                  currentTenantId={activeTenant.id}
                  onAddTransaction={(tx) => setTransactions([tx, ...transactions])}
                />
              )}

              {/* TAB: MOTOBOYS (SEPARATED) */}
              {activeTab === 'drivers' && (
                <SaaSMotoboys
                  orders={orders}
                  currentTenantId={activeTenant.id}
                  onLogTransaction={handleLogTransaction}
                />
              )}

              {/* TAB: CADASTRO DA PIZZARIA */}
              {activeTab === 'pizzeria' && (
                <SaaSPizzeriaSettings
                  activeTenant={activeTenant}
                  onUpdateTenant={handleUpdateTenant}
                />
              )}

              {/* TAB: BLUEPRINTS / ARCHITECTURE */}
              {activeTab === 'blueprint' && (
                <ArchitectureDoc />
              )}

            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: SITE DE PEDIDOS SMARTPHONE SIMULATOR (Takes 1 column on xl, only if active) */}
        {showSmartphone && (
          <div className="xl:col-span-1 space-y-6 flex flex-col items-center animate-fade-in">
            <div className="text-center space-y-1 mb-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono flex items-center justify-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                Canal de Venda Integrado
              </span>
              <p className="text-xs text-stone-500 font-medium">Auto-atendimento simulado</p>
            </div>

            <SaaSCustomerSite
              currentTenant={activeTenant}
              onAddOrder={handleAddOrder}
            />
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-stone-200 px-6 py-4 mt-auto text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{activeTenant.name} © 2026 • {activeTenant.slogan || 'OPERAÇÃO ENXUTA PARA PIZZARIAS'}</span>
          <span className="text-orange-600/80">Processamento proporcional de sabores e bordas ativas</span>
        </div>
      </footer>
    </div>
  );
}
