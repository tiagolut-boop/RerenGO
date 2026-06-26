/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tenant } from '../types';
import { Building, Phone, DollarSign, MapPin, ShieldCheck, Save, ClipboardList, Info } from 'lucide-react';

interface SaaSPizzeriaSettingsProps {
  activeTenant: Tenant;
  onUpdateTenant: (updated: Tenant) => void;
}

export default function SaaSPizzeriaSettings({ activeTenant, onUpdateTenant }: SaaSPizzeriaSettingsProps) {
  const [name, setName] = useState(activeTenant.name);
  const [corporateName, setCorporateName] = useState(activeTenant.corporateName || '');
  const [cnpj, setCnpj] = useState(activeTenant.cnpj || '');
  const [slogan, setSlogan] = useState(activeTenant.slogan || '');
  const [phone, setPhone] = useState(activeTenant.phone);
  const [deliveryFee, setDeliveryFee] = useState(activeTenant.deliveryFee);
  const [cep, setCep] = useState(activeTenant.cep || '');
  const [address, setAddress] = useState(activeTenant.address || '');
  const [bairro, setBairro] = useState(activeTenant.bairro || '');
  const [city, setCity] = useState(activeTenant.city || '');
  const [state, setState] = useState(activeTenant.state || '');

  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Formatting helpers
  const formatCnpj = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 14) {
      return raw
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value.substring(0, 18);
  };

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 11) {
      if (raw.length > 10) {
        return raw.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      return raw.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value.substring(0, 15);
  };

  const formatCep = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 8) {
      return raw.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return value.substring(0, 9);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('O nome comercial da pizzaria é obrigatório.');
      return;
    }

    const updated: Tenant = {
      ...activeTenant,
      name,
      corporateName,
      cnpj,
      slogan,
      phone,
      deliveryFee: Number(deliveryFee),
      cep,
      address,
      bairro,
      city,
      state
    };

    onUpdateTenant(updated);
    setIsSaved(true);

    // Audio chime upon save
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (_) {}

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div id="pizzeria-settings-container" className="space-y-6">
      
      {/* Title Header Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 border border-stone-200/60 p-4 rounded-xl shadow-3xs">
        <div>
          <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-600 animate-pulse" />
            Cadastro da Pizzaria
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure as informações cadastrais, operacionais e endereço da sua pizzaria.
          </p>
        </div>
        <div className="text-[10px] bg-orange-100 text-orange-800 font-mono font-bold px-2.5 py-1 rounded-full border border-orange-200">
          Isolamento de Dados RLS
        </div>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 shadow-3xs animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configurações salvas com sucesso! As alterações já estão aplicadas em todo o ecossistema.</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 shadow-3xs">
          <Info className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: DADOS INSTITUCIONAIS */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-5 space-y-4 shadow-3xs">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <ClipboardList className="w-4 h-4 text-stone-500" />
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Dados Institucionais & Fiscais</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">NOME DA PIZZARIA (FANTASIA)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Resenha Pizzas"
                className="w-full text-xs font-bold px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">RAZÃO SOCIAL</label>
              <input
                type="text"
                value={corporateName}
                onChange={(e) => setCorporateName(e.target.value)}
                placeholder="Ex: Resenha Pizzaria Ltda"
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                placeholder="00.000.000/0001-00"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">SLOGAN OPERACIONAL / SUBTÍTULO</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Ex: Operação Enxuta para Pizzarias"
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTATO E LOGÍSTICA */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-5 space-y-4 shadow-3xs">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <Phone className="w-4 h-4 text-stone-500" />
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Contato & Logística de Delivery</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">WHATSAPP / TELEFONE OPERACIONAL</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(49) 99999-9999"
                className="w-full text-xs font-bold px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">TAXA PADRÃO DE ENTREGA (DELIVERY FEE)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-400 text-xs font-bold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ENDEREÇO FISCAL & COMERCIAL */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 lg:p-5 space-y-4 shadow-3xs">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <MapPin className="w-4 h-4 text-stone-500" />
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Endereço de Funcionamento</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(formatCep(e.target.value))}
                placeholder="00000-000"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-stone-600 mb-1">LOGRADOURO & NÚMERO (ENDEREÇO)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Av. Principal, 123 - Sala A"
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">BAIRRO</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">CIDADE</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Lages"
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">ESTADO (UF)</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="Ex: SC"
                maxLength={2}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-bold"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON CONTAINER */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>

      </form>
    </div>
  );
}
