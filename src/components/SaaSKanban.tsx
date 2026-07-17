/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Order, OrderStatus, Driver } from '../types';
import { ChefHat, Flame, PackageCheck, Bike, ShieldCheck, CheckSquare, XCircle, ArrowRight, Undo } from 'lucide-react';

interface SaaSKanbanProps {
  orders: Order[];
  drivers: Driver[];
  currentTenantId: string;
  onUpdateOrders: (updated: Order[]) => void;
  onLogTransaction: (type: 'entrada' | 'saída', category: any, amount: number, desc: string, orderId?: string) => void;
}

export default function SaaSKanban({ orders, drivers, currentTenantId, onUpdateOrders, onLogTransaction }: SaaSKanbanProps) {
  
  // Filter for current tenant
  const tenantOrders = orders.filter((o) => o.tenantId === currentTenantId);
  const tenantDrivers = drivers.filter((d) => d.tenantId === currentTenantId);

  // Columns specification
  const columns: { status: OrderStatus; label: string; icon: any; color: string }[] = [
    { status: 'Confirmado', label: 'Novos / Aceitos', icon: CheckSquare, color: 'border-t-blue-500 text-blue-400' },
    { status: 'Em Produção', label: 'Em Produção', icon: ChefHat, color: 'border-t-amber-500 text-amber-400' },
    { status: 'No Forno', label: 'No Forno / Prep Final', icon: Flame, color: 'border-t-orange-500 text-orange-400' },
    { status: 'Pronto', label: 'Prontos (Despacho)', icon: PackageCheck, color: 'border-t-emerald-500 text-emerald-400' },
    { status: 'Saiu para Entrega', label: 'Em Rota de Entrega', icon: Bike, color: 'border-t-purple-500 text-purple-400' },
  ];

  // Helper to move status
  const moveStatus = (order: Order, nextStatus: OrderStatus, customDriverId?: string) => {
    let extraLogs = `Status alterado de ${order.status} para ${nextStatus}`;
    let assignedDriverName = order.driverName;
    let assignedDriverId = order.driverId;

    if (nextStatus === 'Saiu para Entrega' && customDriverId) {
      const drv = tenantDrivers.find((d) => d.id === customDriverId);
      if (drv) {
        assignedDriverId = drv.id;
        assignedDriverName = drv.name;
        extraLogs = `Status alterado para ${nextStatus}. Atribuído ao motoboy ${drv.name}`;
      }
    }

    if (nextStatus === 'Pronto') {
      assignedDriverId = undefined;
      assignedDriverName = undefined;
    }

    const updatedOrder: Order = {
      ...order,
      status: nextStatus,
      driverId: assignedDriverId,
      driverName: assignedDriverName,
      updatedAt: new Date().toISOString(),
      history: [
        ...order.history,
        {
          id: `h-state-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: nextStatus,
          user: 'Painel KDS / Despacho',
          details: extraLogs,
        },
      ],
    };

    // Auto trigger financial ledger inflow if state changes to 'Entregue'
    if (nextStatus === 'Entregue' && order.status !== 'Entregue') {
      onLogTransaction(
        'entrada',
        'Recebimento Pedido',
        order.total,
        `Recebimento automático Pedido ${order.orderNumber} - Canal ${order.type}`,
        order.id
      );
    }

    onUpdateOrders(orders.map((o) => (o.id === order.id ? updatedOrder : o)));
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-3xs">
        <div>
          <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-600" />
            Painel Kanban de Produção (KDS)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Acompanhe o fluxo da cozinha em tempo real. Avance pedidos, despache motoboys e encerre vendas com facilidade.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 uppercase font-mono font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          Conexão Realtime Ativa
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colOrders = tenantOrders.filter((o) => o.status === col.status);
          const Icon = col.icon;

          return (
            <div
              key={col.status}
              className="flex-1 min-w-[220px] bg-white border border-stone-200 rounded-2xl p-4 flex flex-col min-h-[480px] shadow-3xs"
            >
              {/* Column Header */}
              <div className={`border-t-4 ${col.color} pt-2 pb-3 mb-3 border-b border-stone-100 flex items-center justify-between`}>
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold text-stone-800">{col.label}</span>
                </div>
                <span className="bg-stone-50 text-stone-500 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold border border-stone-150">
                  {colOrders.length}
                </span>
              </div>

              {/* Column Body / Orders list */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-1">
                {colOrders.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-[10px] text-stone-400 italic py-12">
                    Sem pedidos nesta etapa
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-stone-50/40 border border-stone-200 rounded-xl hover:border-stone-300 transition-all text-xs space-y-2.5 shadow-3xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-600 font-mono">{order.orderNumber}</span>
                        <span className="text-[10px] bg-white border border-stone-200 text-stone-500 px-1.5 py-0.5 rounded font-bold">
                          {order.type}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-bold text-stone-800 truncate">{order.customerName}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase font-mono">Bairro: {order.customerBairro || 'N/A'}</p>
                      </div>

                      {/* Items previews */}
                      <div className="bg-white p-1.5 rounded-xl border border-stone-150 text-[11px] text-stone-600 font-medium space-y-0.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="truncate">
                            {it.quantity}x {it.name}
                          </div>
                        ))}
                      </div>

                      {/* Control buttons */}
                      <div className="pt-2 border-t border-stone-100">
                        {order.status === 'Confirmado' && (
                          <button
                            onClick={() => moveStatus(order, 'Em Produção')}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer"
                          >
                            Preparar Lanche/Pizza
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {order.status === 'Em Produção' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => moveStatus(order, 'Confirmado')}
                              className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold p-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer border border-stone-200 shrink-0"
                              title="Voltar para Novos / Aceitos"
                            >
                              <Undo className="w-3.5 h-3.5" />
                              <span>Voltar</span>
                            </button>
                            <button
                              onClick={() => moveStatus(order, 'No Forno')}
                              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer font-black"
                            >
                              Colocar Forno
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {order.status === 'No Forno' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => moveStatus(order, 'Em Produção')}
                              className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold p-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer border border-stone-200 shrink-0"
                              title="Voltar para Em Produção"
                            >
                              <Undo className="w-3.5 h-3.5" />
                              <span>Voltar</span>
                            </button>
                            <button
                              onClick={() => moveStatus(order, 'Pronto')}
                              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer font-black"
                            >
                              Pronto/Embalar
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {order.status === 'Pronto' && (
                          <div className="space-y-1.5">
                            {order.type === 'Delivery' ? (
                              <div className="flex gap-1.5 items-center">
                                <button
                                  onClick={() => moveStatus(order, 'No Forno')}
                                  className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold p-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer border border-stone-200 shrink-0"
                                  title="Voltar para No Forno"
                                >
                                  <Undo className="w-3.5 h-3.5" />
                                </button>
                                <div className="flex-1">
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        moveStatus(order, 'Saiu para Entrega', e.target.value);
                                      }
                                    }}
                                    defaultValue=""
                                    className="w-full bg-white text-[10px] border border-stone-200 text-stone-700 rounded-lg px-1.5 py-1.5 focus:outline-none focus:border-orange-500 font-medium"
                                  >
                                    <option value="" disabled>Selecionar Motoboy...</option>
                                    {tenantDrivers.map((d) => (
                                      <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => moveStatus(order, 'No Forno')}
                                  className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold p-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer border border-stone-200 shrink-0"
                                  title="Voltar para No Forno"
                                >
                                  <Undo className="w-3.5 h-3.5" />
                                  <span>Voltar</span>
                                </button>
                                <button
                                  onClick={() => moveStatus(order, 'Entregue')}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer font-black"
                                >
                                  Entregar p/ Cliente
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            {order.type === 'Delivery' && (
                              <p className="text-[9px] text-stone-400 text-center font-bold uppercase font-mono">Atribuir motoboy despacha automático</p>
                            )}
                          </div>
                        )}

                        {order.status === 'Saiu para Entrega' && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-orange-700 font-bold mb-1 text-center font-mono uppercase bg-orange-50 py-0.5 rounded border border-orange-100">
                              Motoboy: {order.driverName?.split(' ')[0]}
                            </p>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => moveStatus(order, 'Pronto')}
                                className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold p-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer border border-stone-200 shrink-0"
                                title="Voltar para Pronto"
                              >
                                <Undo className="w-3.5 h-3.5" />
                                <span>Voltar</span>
                              </button>
                              <button
                                onClick={() => moveStatus(order, 'Entregue')}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer font-black"
                              >
                                Confirmar Entrega
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cancel action */}
                      {['Confirmado', 'Em Produção', 'No Forno', 'Pronto'].includes(order.status) && (
                        <button
                          onClick={() => {
                            if (confirm('Deseja realmente cancelar este pedido?')) {
                              moveStatus(order, 'Cancelado');
                            }
                          }}
                          className="w-full text-stone-400 hover:text-red-500 text-[9px] font-bold text-center hover:underline pt-1 cursor-pointer"
                        >
                          Cancelar Pedido
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
