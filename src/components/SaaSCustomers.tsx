import React, { useState } from 'react';
import { Customer, Order } from '../types';
import { 
  User, 
  Phone, 
  MapPin, 
  Plus, 
  Search, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  UserPlus
} from 'lucide-react';

interface SaaSCustomersProps {
  customers: Customer[];
  orders: Order[];
  onUpdateCustomers: (updated: Customer[]) => void;
  onSelectCustomerForNewOrder: (customer: Customer) => void;
}

export default function SaaSCustomers({ 
  customers, 
  orders, 
  onUpdateCustomers, 
  onSelectCustomerForNewOrder 
}: SaaSCustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form States for adding
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newBairro, setNewBairro] = useState('');
  const [newCity, setNewCity] = useState('Lages');

  // Form States for editing
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editBairro, setEditBairro] = useState('');
  const [editCity, setEditCity] = useState('');

  // Stats calculations
  const totalCustomers = customers.length;
  
  // Calculate total spent & orders per customer helper
  const getCustomerStats = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const customerOrders = orders.filter(o => {
      const orderPhone = o.customerPhone.replace(/\D/g, '');
      return (orderPhone && orderPhone === cleanPhone) || o.customerName.toLowerCase() === name.toLowerCase();
    });
    
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      orderCount: customerOrders.length,
      totalSpent
    };
  };

  // Total sales across all registered customers
  const totalSpentByAll = customers.reduce((sum, c) => sum + getCustomerStats(c.phone, c.name).totalSpent, 0);

  // Average ticket of registered customers
  const totalOrdersCount = customers.reduce((sum, c) => sum + getCustomerStats(c.phone, c.name).orderCount, 0);
  const averageSpent = totalOrdersCount > 0 ? totalSpentByAll / totalOrdersCount : 0;

  // Handle Add Customer
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      alert('⚠️ Por favor, informe o Nome e Telefone do cliente!');
      return;
    }

    // Format phone to match general layout
    const formattedPhone = newPhone.trim();

    const exists = customers.some(
      c => c.phone.replace(/\D/g, '') === formattedPhone.replace(/\D/g, '')
    );
    if (exists) {
      alert('⚠️ Já existe um cliente cadastrado com este telefone!');
      return;
    }

    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      tenantId: 'tenant-1',
      name: newName.trim(),
      phone: formattedPhone,
      address: newAddress.trim() || undefined,
      bairro: newBairro.trim() || undefined,
      city: newCity.trim() || 'Lages',
      createdAt: new Date().toISOString()
    };

    const updated = [...customers, newCustomer];
    onUpdateCustomers(updated);

    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setNewBairro('');
    setShowAddForm(false);
  };

  // Handle Edit Customer
  const handleStartEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditPhone(customer.phone);
    setEditAddress(customer.address || '');
    setEditBairro(customer.bairro || '');
    setEditCity(customer.city || 'Lages');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!editName || !editPhone) {
      alert('⚠️ Nome e Telefone são campos obrigatórios!');
      return;
    }

    const updated = customers.map(c => {
      if (c.id === editingCustomer.id) {
        return {
          ...c,
          name: editName.trim(),
          phone: editPhone.trim(),
          address: editAddress.trim() || undefined,
          bairro: editBairro.trim() || undefined,
          city: editCity.trim() || 'Lages'
        };
      }
      return c;
    });

    onUpdateCustomers(updated);
    setEditingCustomer(null);
  };

  // Handle Delete Customer
  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o cliente "${name}"?`)) {
      const updated = customers.filter(c => c.id !== id);
      onUpdateCustomers(updated);
    }
  };

  // Filter customers by search query
  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.bairro && c.bairro.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-display font-black text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span>Banco de Clientes (CRM)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Gerenciamento, histórico de compras e cadastro unificado de clientes.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingCustomer(null);
          }}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showAddForm ? 'Cancelar' : 'Cadastrar Cliente'}
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-orange-100 text-orange-700 p-3 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Clientes Cadastrados</p>
            <h4 className="text-2xl font-black font-mono text-stone-950 mt-0.5">{totalCustomers}</h4>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Receita Total de Clientes</p>
            <h4 className="text-2xl font-black font-mono text-stone-950 mt-0.5">R$ {totalSpentByAll.toFixed(2)}</h4>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-amber-100 text-amber-700 p-3 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Ticket Médio p/ Cliente</p>
            <h4 className="text-2xl font-black font-mono text-stone-950 mt-0.5">R$ {averageSpent.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      {/* ADD NEW CUSTOMER FORM */}
      {showAddForm && (
        <form onSubmit={handleAddCustomer} className="bg-orange-50/40 border border-orange-200/60 p-5 rounded-2xl space-y-4 text-xs animate-fadeIn">
          <h4 className="text-sm font-black text-orange-800 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Novo Cliente</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="md:col-span-1.5">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Pedro Henrique"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-semibold"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Telefone (DDD + Celular) *</label>
              <input
                type="text"
                required
                placeholder="Ex: (49) 99999-9999"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-mono font-semibold"
              />
            </div>

            <div className="md:col-span-1.5">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Endereço (Rua, Número, Apto)</label>
              <input
                type="text"
                placeholder="Ex: Rua Marechal Deodoro, 350"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Bairro</label>
              <input
                type="text"
                placeholder="Ex: Centro"
                value={newBairro}
                onChange={(e) => setNewBairro(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Cidade</label>
              <input
                type="text"
                placeholder="Lages"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-orange-200/40">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-black shadow-3xs cursor-pointer"
            >
              Salvar Cadastro
            </button>
          </div>
        </form>
      )}

      {/* EDIT CUSTOMER MODAL/DRAWER */}
      {editingCustomer && (
        <form onSubmit={handleSaveEdit} className="bg-amber-50/40 border border-amber-200 p-5 rounded-2xl space-y-4 text-xs animate-fadeIn">
          <h4 className="text-sm font-black text-amber-800 flex items-center gap-1.5">
            <Edit2 className="w-4 h-4" />
            <span>Editar Cadastro do Cliente: {editingCustomer.name}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="md:col-span-1.5">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Telefone *</label>
              <input
                type="text"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-mono font-semibold"
              />
            </div>

            <div className="md:col-span-1.5">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Endereço</label>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Bairro</label>
              <input
                type="text"
                value={editBairro}
                onChange={(e) => setEditBairro(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Cidade</label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
            <button
              type="button"
              onClick={() => setEditingCustomer(null)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-black shadow-3xs cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      )}

      {/* FILTER & SEARCH */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center shadow-3xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar cliente por nome, telefone, bairro ou endereço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* CUSTOMERS LIST CONTAINER */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-bold text-stone-600">Nenhum cliente localizado</p>
            <p className="text-xs text-stone-400">Tente buscar por termos alternativos ou cadastre um novo cliente acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-3.5 px-4">Nome do Cliente</th>
                  <th className="py-3.5 px-4">Contato</th>
                  <th className="py-3.5 px-4">Endereço de Entrega</th>
                  <th className="py-3.5 px-4 text-center">Compras</th>
                  <th className="py-3.5 px-4 text-right">Faturamento</th>
                  <th className="py-3.5 px-4 text-center">Ações Operacionais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map(c => {
                  const stats = getCustomerStats(c.phone, c.name);
                  return (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Name & ID info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center border border-stone-200">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-black text-stone-900 block leading-tight">{c.name}</span>
                            <span className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">REG: {c.id.slice(-5)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone/Contact */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-stone-700">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{c.phone}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4">
                        {c.address ? (
                          <div className="space-y-0.5 max-w-xs">
                            <span className="font-medium text-stone-800 block truncate">{c.address}</span>
                            <span className="text-[10px] text-stone-500 font-bold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-500" />
                              <span>{c.bairro} • {c.city}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Sem endereço cadastrado</span>
                        )}
                      </td>

                      {/* Number of orders */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-black font-mono text-[10px] ${
                          stats.orderCount > 5 
                            ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                            : stats.orderCount > 1 
                            ? 'bg-stone-100 text-stone-700' 
                            : 'bg-stone-50 text-stone-400'
                        }`}>
                          {stats.orderCount} {stats.orderCount === 1 ? 'pedido' : 'pedidos'}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-stone-900">
                        R$ {stats.totalSpent.toFixed(2)}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* New order button */}
                          <button
                            onClick={() => onSelectCustomerForNewOrder(c)}
                            className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer shadow-3xs"
                            title="Iniciar um novo pedido com este cliente"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Novo Pedido</span>
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-lg transition-all cursor-pointer"
                            title="Editar cadastro do cliente"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteCustomer(c.id, c.name)}
                            className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-all cursor-pointer"
                            title="Excluir cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
