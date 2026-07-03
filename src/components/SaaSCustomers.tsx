import React, { useState } from 'react';
import { Customer, Order, CustomerAddress } from '../types';
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
  currentTenantId: string;
}

export default function SaaSCustomers({ 
  customers, 
  orders, 
  onUpdateCustomers, 
  onSelectCustomerForNewOrder,
  currentTenantId
}: SaaSCustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // States for multiple addresses management inside editing customer
  const [editedAddresses, setEditedAddresses] = useState<CustomerAddress[]>([]);
  const [addrFormName, setAddrFormName] = useState('');
  const [addrFormCep, setAddrFormCep] = useState('');
  const [addrFormStreet, setAddrFormStreet] = useState('');
  const [addrFormNumber, setAddrFormNumber] = useState('');
  const [addrFormComplement, setAddrFormComplement] = useState('');
  const [addrFormBairro, setAddrFormBairro] = useState('');
  const [addrFormCity, setAddrFormCity] = useState('Lages');
  const [addrFormReference, setAddrFormReference] = useState('');
  const [addrFormDeliveryFee, setAddrFormDeliveryFee] = useState<number | ''>('');
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [showAddrForm, setShowAddrForm] = useState(false);

  // Form States for adding
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newComplement, setNewComplement] = useState('');
  const [newBairro, setNewBairro] = useState('');
  const [newCity, setNewCity] = useState('Lages');

  // Form States for editing
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editComplement, setEditComplement] = useState('');
  const [editBairro, setEditBairro] = useState('');
  const [editCity, setEditCity] = useState('');

  // Helper to parse address strings of format "Street, Number - Complement" or similar
  const parseAddress = (fullAddress: string) => {
    if (!fullAddress) return { street: '', number: '', complement: '' };
    const parts = fullAddress.split(',');
    if (parts.length < 2) {
      return { street: fullAddress, number: '', complement: '' };
    }
    const street = parts[0].trim();
    const rest = parts.slice(1).join(',').trim();
    const compParts = rest.split(' - ');
    if (compParts.length >= 2) {
      return {
        street,
        number: compParts[0].trim(),
        complement: compParts.slice(1).join(' - ').trim()
      };
    }
    return {
      street,
      number: rest.trim(),
      complement: ''
    };
  };

  // Filter customers belonging to the current tenant
  const tenantCustomers = customers.filter(c => c.tenantId === currentTenantId);

  // Stats calculations
  const totalCustomers = tenantCustomers.length;
  
  // Calculate total spent & orders per customer helper
  const getCustomerStats = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const customerOrders = orders.filter(o => {
      if (o.tenantId !== currentTenantId) return false;
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
  const totalSpentByAll = tenantCustomers.reduce((sum, c) => sum + getCustomerStats(c.phone, c.name).totalSpent, 0);

  // Average ticket of registered customers
  const totalOrdersCount = tenantCustomers.reduce((sum, c) => sum + getCustomerStats(c.phone, c.name).orderCount, 0);
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

    const exists = tenantCustomers.some(
      c => c.phone.replace(/\D/g, '') === formattedPhone.replace(/\D/g, '')
    );
    if (exists) {
      alert('⚠️ Já existe um cliente cadastrado com este telefone nesta pizzaria!');
      return;
    }

    const addrStr = newStreet.trim() 
      ? `${newStreet.trim()}, ${newNumber.trim()}${newComplement.trim() ? ' - ' + newComplement.trim() : ''}`
      : undefined;

    const initialAddress: CustomerAddress | undefined = newStreet.trim() ? {
      id: `addr-${Date.now()}`,
      name: 'Principal',
      street: newStreet.trim(),
      number: newNumber.trim(),
      complement: newComplement.trim() || undefined,
      bairro: newBairro.trim(),
      city: newCity.trim() || 'Lages',
      reference: undefined,
      deliveryFee: undefined
    } : undefined;

    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      tenantId: currentTenantId,
      name: newName.trim(),
      phone: formattedPhone,
      address: addrStr,
      bairro: newBairro.trim() || undefined,
      city: newCity.trim() || 'Lages',
      createdAt: new Date().toISOString(),
      addresses: initialAddress ? [initialAddress] : []
    };

    const updated = [...customers, newCustomer];
    onUpdateCustomers(updated);

    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewStreet('');
    setNewNumber('');
    setNewComplement('');
    setNewBairro('');
    setShowAddForm(false);
  };

  // Handle Edit Customer
  const handleStartEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditPhone(customer.phone);
    
    const parsed = parseAddress(customer.address || '');
    setEditStreet(parsed.street);
    setEditNumber(parsed.number);
    setEditComplement(parsed.complement);
    
    setEditBairro(customer.bairro || '');
    setEditCity(customer.city || 'Lages');

    // Populate addresses list
    const initialAddresses = customer.addresses && customer.addresses.length > 0 
      ? customer.addresses 
      : (customer.address ? [{
          id: 'addr-primary',
          name: 'Principal',
          street: parsed.street,
          number: parsed.number,
          complement: parsed.complement || undefined,
          bairro: customer.bairro || '',
          city: customer.city || 'Lages',
          reference: undefined,
          deliveryFee: undefined
        }] : []);
    setEditedAddresses(initialAddresses);
    setShowAddrForm(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!editName || !editPhone) {
      alert('⚠️ Nome e Telefone são campos obrigatórios!');
      return;
    }

    // Sync root address fields with the first address of editedAddresses if present
    let addrStr = editStreet.trim()
      ? `${editStreet.trim()}, ${editNumber.trim()}${editComplement.trim() ? ' - ' + editComplement.trim() : ''}`
      : undefined;
    let bairroStr = editBairro.trim() || undefined;
    let cityStr = editCity.trim() || 'Lages';

    if (editedAddresses.length > 0) {
      const firstAddr = editedAddresses[0];
      addrStr = `${firstAddr.street}, ${firstAddr.number}${firstAddr.complement ? ' - ' + firstAddr.complement : ''}`;
      bairroStr = firstAddr.bairro;
      cityStr = firstAddr.city;
    }

    const updated = customers.map(c => {
      if (c.id === editingCustomer.id) {
        return {
          ...c,
          name: editName.trim(),
          phone: editPhone.trim(),
          address: addrStr,
          bairro: bairroStr,
          city: cityStr,
          addresses: editedAddresses
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
  const filteredCustomers = tenantCustomers.filter(c => {
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

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
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
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Telefone *</label>
              <input
                type="text"
                required
                placeholder="Ex: (49) 99999-9999"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-mono font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Rua / Logradouro *</label>
              <input
                type="text"
                required
                placeholder="Ex: Rua Marechal Deodoro"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-semibold"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Número *</label>
              <input
                type="text"
                required
                placeholder="Ex: 100"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-semibold text-center"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Complemento</label>
              <input
                type="text"
                placeholder="Ex: Apto 101"
                value={newComplement}
                onChange={(e) => setNewComplement(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Bairro</label>
              <input
                type="text"
                placeholder="Ex: Centro"
                value={newBairro}
                onChange={(e) => setNewBairro(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="md:col-span-2">
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

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Rua / Logradouro *</label>
              <input
                type="text"
                required
                value={editStreet}
                onChange={(e) => setEditStreet(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Número *</label>
              <input
                type="text"
                required
                value={editNumber}
                onChange={(e) => setEditNumber(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-semibold text-center"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Complemento</label>
              <input
                type="text"
                value={editComplement}
                onChange={(e) => setEditComplement(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Bairro</label>
              <input
                type="text"
                value={editBairro}
                onChange={(e) => setEditBairro(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-stone-500 font-bold uppercase mb-1">Cidade</label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Section: Endereços Cadastrados */}
          <div className="border-t border-amber-200/60 pt-4 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-amber-900 text-xs flex items-center gap-1">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Endereços Cadastrados ({editedAddresses.length})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  setEditingAddrId(null);
                  setAddrFormName('');
                  setAddrFormCep('');
                  setAddrFormStreet('');
                  setAddrFormNumber('');
                  setAddrFormComplement('');
                  setAddrFormBairro('');
                  setAddrFormCity('Lages');
                  setAddrFormReference('');
                  setAddrFormDeliveryFee('');
                  setShowAddrForm(true);
                }}
                className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Endereço</span>
              </button>
            </div>

            {/* List of Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editedAddresses.map((addr) => (
                <div key={addr.id} className="p-3 bg-white border border-amber-100 rounded-xl flex items-start justify-between gap-2 shadow-4xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-amber-800 text-[9px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase">{addr.name}</span>
                      {addr.deliveryFee !== undefined && addr.deliveryFee !== null && (
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Taxa: R$ {Number(addr.deliveryFee).toFixed(2)}</span>
                      )}
                    </div>
                    <p className="text-stone-700 text-[10px] leading-tight font-medium">
                      {addr.street}, {addr.number} {addr.complement ? ` - ${addr.complement}` : ''}
                    </p>
                    <p className="text-stone-500 text-[9px] font-semibold">
                      {addr.bairro} • {addr.city} {addr.cep ? `• CEP: ${addr.cep}` : ''}
                    </p>
                    {addr.reference && (
                      <p className="text-orange-600 text-[9px] font-medium italic">Ref: {addr.reference}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddrId(addr.id);
                        setAddrFormName(addr.name);
                        setAddrFormCep(addr.cep || '');
                        setAddrFormStreet(addr.street);
                        setAddrFormNumber(addr.number);
                        setAddrFormComplement(addr.complement || '');
                        setAddrFormBairro(addr.bairro);
                        setAddrFormCity(addr.city);
                        setAddrFormReference(addr.reference || '');
                        setAddrFormDeliveryFee(addr.deliveryFee !== undefined ? addr.deliveryFee : '');
                        setShowAddrForm(true);
                      }}
                      className="p-1 hover:bg-stone-100 text-stone-500 hover:text-stone-700 rounded transition-all cursor-pointer"
                      title="Editar Endereço"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Excluir o endereço "${addr.name}"?`)) {
                          setEditedAddresses(prev => prev.filter(a => a.id !== addr.id));
                        }
                      }}
                      className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-all cursor-pointer"
                      title="Excluir Endereço"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {editedAddresses.length === 0 && (
                <p className="text-stone-400 italic text-[10px] col-span-2 py-1">Nenhum endereço cadastrado para este cliente.</p>
              )}
            </div>

            {/* Subform to Add/Edit Address */}
            {showAddrForm && (
              <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-3 animate-fadeIn">
                <h6 className="font-bold text-stone-800 text-[11px] flex items-center gap-1">
                  <span>{editingAddrId ? '✏️ Editar Endereço' : '➕ Adicionar Novo Endereço'}</span>
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Identificação (Ex: Casa, Trabalho) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Casa, Trabalho, Casa da mãe"
                      value={addrFormName}
                      onChange={(e) => setAddrFormName(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">CEP</label>
                    <input
                      type="text"
                      placeholder="Ex: 88501-000"
                      value={addrFormCep}
                      onChange={(e) => setAddrFormCep(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Taxa de Entrega (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Padrão"
                      value={addrFormDeliveryFee}
                      onChange={(e) => setAddrFormDeliveryFee(e.target.value !== '' ? Number(e.target.value) : '')}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-mono font-bold"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Rua / Logradouro *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Av. Brasil"
                      value={addrFormStreet}
                      onChange={(e) => setAddrFormStreet(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Número *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 123"
                      value={addrFormNumber}
                      onChange={(e) => setAddrFormNumber(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium text-center"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Complemento</label>
                    <input
                      type="text"
                      placeholder="Ex: Apto 102"
                      value={addrFormComplement}
                      onChange={(e) => setAddrFormComplement(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Bairro *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Centro"
                      value={addrFormBairro}
                      onChange={(e) => setAddrFormBairro(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Cidade *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Lages"
                      value={addrFormCity}
                      onChange={(e) => setAddrFormCity(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Ponto de Referência</label>
                    <input
                      type="text"
                      placeholder="Ex: Próximo ao mercado central"
                      value={addrFormReference}
                      onChange={(e) => setAddrFormReference(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-1.5 pt-1.5 border-t border-amber-200/40">
                  <button
                    type="button"
                    onClick={() => setShowAddrForm(false)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded font-bold cursor-pointer text-[10px]"
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!addrFormName || !addrFormStreet || !addrFormNumber || !addrFormBairro || !addrFormCity) {
                        alert('⚠️ Identificação, Rua, Número, Bairro e Cidade são obrigatórios!');
                        return;
                      }
                      const newAddr: CustomerAddress = {
                        id: editingAddrId || `addr-${Date.now()}`,
                        name: addrFormName.trim(),
                        cep: addrFormCep.trim() || undefined,
                        street: addrFormStreet.trim(),
                        number: addrFormNumber.trim(),
                        complement: addrFormComplement.trim() || undefined,
                        bairro: addrFormBairro.trim(),
                        city: addrFormCity.trim(),
                        reference: addrFormReference.trim() || undefined,
                        deliveryFee: addrFormDeliveryFee !== '' ? Number(addrFormDeliveryFee) : undefined
                      };

                      if (editingAddrId) {
                        setEditedAddresses(prev => prev.map(a => a.id === editingAddrId ? newAddr : a));
                      } else {
                        setEditedAddresses(prev => [...prev, newAddr]);
                      }
                      setShowAddrForm(false);
                    }}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-black text-[10px] cursor-pointer"
                  >
                    {editingAddrId ? 'Salvar Alteração' : 'Adicionar'}
                  </button>
                </div>
              </div>
            )}
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
