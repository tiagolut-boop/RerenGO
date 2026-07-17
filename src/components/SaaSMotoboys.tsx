/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Driver, Order, DriverExpense, Bairro } from '../types';
import { drivers as initialDrivers } from '../data/mockData';
import { Bike, Plus, Trash2, ShieldAlert, CheckCircle, Wallet, Settings, DollarSign, CalendarCheck, Search, Save, MapPin } from 'lucide-react';

interface SaaSMotoboysProps {
  orders: Order[];
  drivers: Driver[];
  onUpdateDrivers: (updated: Driver[] | ((prev: Driver[]) => Driver[])) => void;
  currentTenantId: string;
  onLogTransaction: (type: 'entrada' | 'saída', category: any, amount: number, desc: string) => void;
  bairros: Bairro[];
  onUpdateBairros: (updated: Bairro[] | ((prev: Bairro[]) => Bairro[])) => void;
}

export default function SaaSMotoboys({ 
  orders, 
  drivers, 
  onUpdateDrivers, 
  currentTenantId, 
  onLogTransaction,
  bairros,
  onUpdateBairros
}: SaaSMotoboysProps) {
  const [expenses, setExpenses] = useState<DriverExpense[]>([
    { id: 'exp-1', driverId: 'driver-101', description: 'Reembolso Combustível', amount: 25.00, date: '2026-06-23' },
  ]);

  // Subtab for Motoboys vs Bairros
  const [subTab, setSubTab] = useState<'drivers' | 'deliveryFees'>('drivers');
  const [bairroSearch, setBairroSearch] = useState('');
  const [editingFees, setEditingFees] = useState<Record<string, string>>({});
  const [bairroSaveStatus, setBairroSaveStatus] = useState<string | null>(null);

  // Filters
  const tenantDrivers = drivers.filter((d) => d.tenantId === currentTenantId);

  // New Driver Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [plate, setPlate] = useState('');
  const [commission, setCommission] = useState(6.00);

  // Expense form state
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseDriverId, setExpenseDriverId] = useState('');

  // Handle create driver
  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !pixKey) return;

    const newDriver: Driver = {
      id: `driver-${Date.now()}`,
      tenantId: currentTenantId,
      name,
      phone,
      pixKey,
      vehicle,
      plate,
      commissionPerDelivery: commission,
    };

    onUpdateDrivers([...drivers, newDriver]);
    setName('');
    setPhone('');
    setPixKey('');
    setVehicle('');
    setPlate('');
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDriverId || expenseAmount <= 0) return;

    const drv = tenantDrivers.find((d) => d.id === expenseDriverId);
    if (!drv) return;

    const newExpense: DriverExpense = {
      id: `exp-${Date.now()}`,
      driverId: expenseDriverId,
      description: expenseDesc || 'Gasto operacional motoboy',
      amount: expenseAmount,
      date: new Date().toISOString().split('T')[0],
    };

    setExpenses([...expenses, newExpense]);
    
    // Log as financial outflow
    onLogTransaction(
      'saída',
      'Motoboy',
      expenseAmount,
      `Gasto Motoboy: ${drv.name} - ${newExpense.description}`
    );

    setExpenseDesc('');
    setExpenseAmount(0);
  };

  // Driver calculations
  const getDriverStats = (driverId: string) => {
    const driverDeliveries = orders.filter(
      (o) => o.tenantId === currentTenantId && o.driverId === driverId && o.status === 'Entregue'
    );
    const drv = tenantDrivers.find((d) => d.id === driverId);
    const commPerDelivery = drv ? drv.commissionPerDelivery : 6.00;
    
    const totalCommissions = driverDeliveries.length * commPerDelivery;
    const driverExpenses = expenses
      .filter((e) => e.driverId === driverId)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      deliveriesCount: driverDeliveries.length,
      commissionTotal: totalCommissions,
      expensesTotal: driverExpenses,
      netPayable: totalCommissions + driverExpenses, // total payout
    };
  };

  // Run Daily closing settlement
  const handleSettlementPayment = (driver: Driver, stats: ReturnType<typeof getDriverStats>) => {
    if (stats.deliveriesCount === 0 && stats.expensesTotal === 0) {
      alert('Sem movimentações para este motoboy hoje.');
      return;
    }

    if (confirm(`Deseja efetuar o fechamento financeiro do motoboy ${driver.name} no valor de R$ ${stats.netPayable.toFixed(2)}?`)) {
      // Outflow log in cash ledger
      onLogTransaction(
        'saída',
        'Motoboy',
        stats.netPayable,
        `Fechamento Diário de Motoboy: ${driver.name} (${stats.deliveriesCount} entregas, Comissões + Gastos)`
      );
      
      // Clear logged expenses for this driver
      setExpenses(expenses.filter((e) => e.driverId !== driver.id));
      alert(`Fechamento concluído! Chave Pix ${driver.pixKey} copiada para transferência.`);
    }
  };

  const handleSaveFee = (id: string) => {
    const value = editingFees[id];
    if (value === undefined) return;
    const numericFee = parseFloat(value);
    if (isNaN(numericFee) || numericFee < 0) {
      alert("⚠️ Por favor, digite um valor de taxa válido!");
      return;
    }
    const updated = bairros.map(b => b.id === id ? { ...b, fee: numericFee } : b);
    onUpdateBairros(updated);
    const bName = bairros.find(b => b.id === id)?.name;
    setBairroSaveStatus(`Taxa de entrega do bairro ${bName} atualizada para R$ ${numericFee.toFixed(2)}!`);
    setTimeout(() => setBairroSaveStatus(null), 3000);
  };

  const filteredBairros = bairros
    .filter(b => b.name.toLowerCase().includes(bairroSearch.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-3xs">
        <div>
          <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
            <Bike className="w-5 h-5 text-orange-600" />
            Gestão Operacional de Entregas & Motoboys
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Gerencie comissões de motoboys, fechamento de caixa e a tabela de taxas de entrega por bairro da cidade de Lages SC.
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setSubTab('drivers')}
          className={`px-5 py-2.5 font-display font-bold text-xs border-b-2 transition-all cursor-pointer ${
            subTab === 'drivers'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          🏍️ Motoboys & Fechamento de Caixa
        </button>
        <button
          onClick={() => setSubTab('deliveryFees')}
          className={`px-5 py-2.5 font-display font-bold text-xs border-b-2 transition-all cursor-pointer ${
            subTab === 'deliveryFees'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          📍 Taxas de Entrega por Bairro (Lages SC)
        </button>
      </div>

      {subTab === 'drivers' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: active drivers and stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <h4 className="font-display font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-orange-600" />
                Entregadores Ativos e Fechamento de Caixa
              </h4>

              {tenantDrivers.length === 0 ? (
                <p className="text-xs text-stone-400 py-12 text-center font-medium">Nenhum motoboy cadastrado para esta unidade.</p>
              ) : (
                <div className="space-y-4">
                  {tenantDrivers.map((driver) => {
                    const stats = getDriverStats(driver.id);
                    return (
                      <div key={driver.id} className="p-4 bg-stone-50/40 border border-stone-200 rounded-2xl space-y-3 hover:border-stone-300 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                          <div>
                            <p className="text-sm font-bold text-stone-800">{driver.name}</p>
                            <p className="text-[10px] text-stone-500 font-medium">
                              Placa: <span className="font-mono">{driver.plate || 'S/P'}</span> • Cel: <span className="font-mono">{driver.phone}</span> • Chave Pix: <span className="text-orange-600 font-bold font-mono">{driver.pixKey}</span>
                            </p>
                          </div>
                          <span className="text-[10px] bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full font-bold border border-orange-200">
                            Comissão/Frete: R$ {driver.commissionPerDelivery.toFixed(2)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                            <p className="text-[10px] text-stone-400 font-bold uppercase">Entregas Concluídas</p>
                            <p className="text-base font-bold text-stone-800 mt-1">{stats.deliveriesCount}</p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                            <p className="text-[10px] text-stone-400 font-bold uppercase">Comissões Acumuladas</p>
                            <p className="text-base font-bold text-stone-800 mt-1 font-mono">R$ {stats.commissionTotal.toFixed(2)}</p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                            <p className="text-[10px] text-stone-400 font-bold uppercase">Gastos Reembolsados</p>
                            <p className="text-base font-bold text-rose-600 mt-1 font-mono">R$ {stats.expensesTotal.toFixed(2)}</p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                            <p className="text-[10px] text-stone-400 font-bold uppercase">Saldo Geral Diário</p>
                            <p className="text-base font-bold text-emerald-600 mt-1 font-mono">R$ {stats.netPayable.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSettlementPayment(driver, stats)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            Pagar & Fechar Caixa do Dia
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Columns: Register & Expenses */}
          <div className="space-y-6">
            {/* Driver Creation Form */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <h4 className="font-display font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <Settings className="w-4 h-4 text-orange-600" />
                Novo Motoboy
              </h4>

              <form onSubmit={handleCreateDriver} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-500 font-bold mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Douglas Rezende"
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Chave Pix</label>
                    <input
                      type="text"
                      required
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder="E-mail ou Celular"
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Modelo Veículo</label>
                    <input
                      type="text"
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      placeholder="Honda Titan 160"
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Placa Moto</label>
                    <input
                      type="text"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      placeholder="ABC-1234"
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">Taxa de Comissão Fixa (R$)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={commission}
                    onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-bold font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Cadastrar Entregador
                </button>
              </form>
            </div>

            {/* Expenses / Gas Form */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <h4 className="font-display font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <DollarSign className="w-4 h-4 text-red-500" />
                Lançar Gastos de Corrida
              </h4>

              <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-500 font-bold mb-1">Selecionar Entregador</label>
                  <select
                    required
                    value={expenseDriverId}
                    onChange={(e) => setExpenseDriverId(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-850 font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Selecione...</option>
                    {tenantDrivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-stone-500 font-bold mb-1">Descrição</label>
                    <input
                      type="text"
                      required
                      value={expenseDesc}
                      onChange={(e) => setExpenseDesc(e.target.value)}
                      placeholder="Combustível, Pneu..."
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      required
                      value={expenseAmount || ''}
                      onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                      placeholder="25.00"
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-bold font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-100 hover:bg-stone-250 text-stone-700 font-bold py-2 rounded-xl border border-stone-200 transition-all cursor-pointer"
                >
                  Registrar Gasto e Lançar Saída
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Neighborhoods Delivery Fees Config Panel */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-5 shadow-3xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h4 className="font-display font-bold text-stone-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Taxas de Entrega por Bairro de Lages SC
                </h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  Defina os valores de frete para cada bairro da cidade de Lages. Ao selecionar o bairro nos pedidos, a taxa de entrega correspondente será calculada e somada automaticamente.
                </p>
              </div>

              {/* Search Bairro */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Pesquisar bairro de Lages..."
                  value={bairroSearch}
                  onChange={(e) => setBairroSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-4 py-2 text-xs text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            {/* Notification alert */}
            {bairroSaveStatus && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl p-3 text-xs font-bold flex items-center gap-2 animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{bairroSaveStatus}</span>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-150">
              <div className="text-center md:text-left md:border-r border-stone-200 md:pr-4 py-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Total de Bairros</span>
                <span className="text-lg font-bold text-stone-800 font-mono">{bairros.length}</span>
              </div>
              <div className="text-center md:text-left md:border-r border-stone-200 md:px-4 py-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Bairros Encontrados</span>
                <span className="text-lg font-bold text-orange-600 font-mono">{filteredBairros.length}</span>
              </div>
              <div className="text-center md:text-left md:border-r border-stone-200 md:px-4 py-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Taxa Média</span>
                <span className="text-lg font-bold text-stone-800 font-mono">
                  R$ {(bairros.reduce((sum, b) => sum + b.fee, 0) / bairros.length).toFixed(2)}
                </span>
              </div>
              <div className="text-center md:text-left md:pl-4 py-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Menor / Maior Taxa</span>
                <span className="text-lg font-bold text-stone-800 font-mono">
                  R$ {Math.min(...bairros.map(b => b.fee)).toFixed(0)} - R$ {Math.max(...bairros.map(b => b.fee)).toFixed(0)}
                </span>
              </div>
            </div>

            {filteredBairros.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs font-medium">
                Nenhum bairro encontrado com o termo "{bairroSearch}".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredBairros.map((b) => {
                  const feeValue = editingFees[b.id] !== undefined ? editingFees[b.id] : b.fee.toString();
                  const isModified = editingFees[b.id] !== undefined && editingFees[b.id] !== b.fee.toString();

                  return (
                    <div
                      key={b.id}
                      className="p-3 bg-stone-50/50 border border-stone-200 hover:border-stone-300 rounded-xl flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="truncate">
                        <p className="text-xs font-bold text-stone-800 truncate" title={b.name}>{b.name}</p>
                        <p className="text-[9px] text-stone-400 font-bold uppercase mt-0.5">Lages SC</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-stone-500 font-bold">R$</span>
                        <input
                          type="number"
                          step="0.50"
                          min="0"
                          value={feeValue}
                          onChange={(e) => {
                            setEditingFees({
                              ...editingFees,
                              [b.id]: e.target.value
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveFee(b.id);
                            }
                          }}
                          onBlur={() => {
                            if (isModified) {
                              handleSaveFee(b.id);
                            }
                          }}
                          className="w-16 bg-white border border-stone-200 rounded px-1.5 py-1 text-xs text-center font-bold text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveFee(b.id)}
                          disabled={!isModified}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            isModified
                              ? 'bg-orange-600 hover:bg-orange-500 text-white'
                              : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                          }`}
                          title="Salvar alterações"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
