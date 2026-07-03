/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tenant } from '../types';
import { Building, Phone, DollarSign, MapPin, ShieldCheck, Save, ClipboardList, Info, Image, Smile, Globe, Copy, Check, Link } from 'lucide-react';
import { getSupabaseConfig } from '../supabaseClient';

interface SaaSPizzeriaSettingsProps {
  activeTenant: Tenant;
  onUpdateTenant: (updated: Tenant) => void;
}

export default function SaaSPizzeriaSettings({ activeTenant, onUpdateTenant }: SaaSPizzeriaSettingsProps) {
  const [name, setName] = useState(activeTenant.name);
  const [slug, setSlug] = useState(activeTenant.slug || '');
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
  const [logo, setLogo] = useState(activeTenant.logo || '/logo_do_sistema.png');
  const [copiedLink, setCopiedLink] = useState(false);

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

  const cleanSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9-]/g, '-')     // replace non-alphanumeric with -
      .replace(/-+/g, '-')             // compress multiple hyphens
      .replace(/^-+|-+$/g, '');        // trim hyphens from ends
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('O nome comercial da pizzaria é obrigatório.');
      return;
    }

    let finalSlug = cleanSlug(slug);
    if (!finalSlug) {
      finalSlug = cleanSlug(name);
    }
    if (!finalSlug) {
      setErrorMsg('O identificador de URL (slug) é obrigatório.');
      return;
    }

    const updated: Tenant = {
      ...activeTenant,
      name,
      slug: finalSlug,
      corporateName,
      cnpj,
      slogan,
      phone,
      deliveryFee: Number(deliveryFee),
      cep,
      address,
      bairro,
      city,
      state,
      logo
    };

    setSlug(finalSlug);
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

  const { url: sUrl, anonKey: sKey, isEnabled } = getSupabaseConfig();
  const currentSlug = cleanSlug(slug) || cleanSlug(name) || 'sua-pizzaria';
  let origin = window.location.origin;
  if (origin.includes('ais-dev-')) {
    origin = origin.replace('ais-dev-', 'ais-pre-');
  }
  let previewUrl = `${origin}${window.location.pathname}#pedido?tenant=${currentSlug}`;
  
  const isDefault = sUrl === 'https://sfyouhzzwazqclhuoxvn.supabase.co' && 
    (sKey === 'sb_publishable_v_WQCv_0gE7IXaylsFJbmQ_tQ2qjLEm' || sKey.startsWith('eyJhbGci'));
  const isEnv = !!(import.meta as any).env.VITE_SUPABASE_URL && !!(import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  if (isEnabled && sUrl && sKey && !isDefault && !isEnv) {
    previewUrl += `&s_url=${encodeURIComponent(sUrl)}&s_key=${encodeURIComponent(sKey)}`;
  }

  const handleCopyPreviewLink = () => {
    navigator.clipboard.writeText(previewUrl)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      })
      .catch((err) => console.error(err));
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

            {/* LINK DO CARDÁPIO DIGITAL PERSONALIZADO */}
            <div className="md:col-span-2 bg-orange-50/50 border border-orange-200/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-black text-stone-850 uppercase tracking-wider">
                  Link do Cardápio Digital Personalizado (Slug)
                </span>
              </div>
              <p className="text-[11px] text-stone-550 leading-normal">
                Você pode personalizar o identificador único da sua pizzaria na URL. Este link é o que os clientes usam para fazer pedidos no WhatsApp ou web, e as vendas caem direto no seu painel em tempo real!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-stone-600 mb-1">SLUG DA URL (Apenas letras, números e traços)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 text-xs font-mono select-none">
                      tenant=
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(cleanSlug(e.target.value))}
                      placeholder="Ex: resenha-pizzas"
                      className="w-full text-xs font-bold pl-16 pr-3 py-2 border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-mono"
                    />
                  </div>
                </div>

                <div className="sm:w-1/3 flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      const computedSlug = cleanSlug(slug) || cleanSlug(name) || 'sua-pizzaria';
                      setSlug(computedSlug);
                    }}
                    className="w-full h-[34px] px-3 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Simplificar e limpar o slug conforme o nome comercial"
                  >
                    Simplificar Slug
                  </button>
                </div>
              </div>

              {/* LIVE PREVIEW CARD */}
              <div className="bg-white border border-stone-200/80 rounded-lg p-3 space-y-2 shadow-3xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <Link className="w-3 h-3 text-stone-400" />
                    Visualização do Link de Vendas
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopyPreviewLink}
                      className="px-2.5 py-1 text-[10px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 animate-bounce" />
                          <span className="text-emerald-600">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[10px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-md transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Abrir Cardápio Digital ↗</span>
                    </a>
                  </div>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100 font-mono text-[10px] text-stone-600 break-all select-all leading-normal max-h-16 overflow-y-auto">
                  {previewUrl}
                </div>
              </div>
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

            <div className="md:col-span-2 border-t border-stone-100 pt-4 mt-2">
              <label className="block text-[11px] font-bold text-stone-600 mb-2 uppercase tracking-wider flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-orange-600" />
                Logo / Foto de Perfil da Pizzaria
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-stone-50 p-4 rounded-xl border border-stone-200/50">
                {/* Logo Preview */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-3xl overflow-hidden p-1">
                    {logo.startsWith('http') || logo.startsWith('/') || logo.includes('.') ? (
                      <img src={logo} alt="Preview" className="w-full h-full object-contain" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.err-fallback')) {
                          const span = document.createElement('span');
                          span.innerText = '🍕';
                          span.className = 'err-fallback text-3xl';
                          parent.appendChild(span);
                        }
                      }} />
                    ) : (
                      <span>{logo || '🍕'}</span>
                    )}
                  </div>
                  <span className="text-[9px] text-stone-400 font-bold uppercase mt-1">Prévia</span>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  {/* Presets */}
                  <div>
                    <span className="block text-[10px] text-stone-500 font-bold mb-1.5 uppercase">Sugestões Rápidas:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: '🍕 Pizza', value: '🍕' },
                        { label: '🔥 Forno', value: '🔥' },
                        { label: '👑 Premium', value: '👑' },
                        { label: '📦 Delivery', value: '📦' },
                        { label: '🥤 Bebida', value: '🥤' },
                        { label: '🍔 Burguer', value: '🍔' },
                        { label: '🖼️ Logo Padrão', value: '/logo_do_sistema.png' },
                        { label: '🎁 Combos', value: '/LOGO_COMBOS.png' }
                      ].map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setLogo(preset.value)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                            logo === preset.value
                              ? 'bg-orange-600 text-white border-orange-600 shadow-3xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL or Emoji input */}
                  <div>
                    <span className="block text-[10px] text-stone-500 font-bold mb-1 uppercase">Ou insira um link de imagem / emoji customizado:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        placeholder="Insira um emoji ou URL da sua logo (ex: https://site.com/foto.png)"
                        className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-medium"
                      />
                      {logo && logo !== '🍕' && (
                        <button
                          type="button"
                          onClick={() => setLogo('🍕')}
                          className="px-3 py-2 text-xs font-bold text-stone-500 hover:text-red-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
                        >
                          Resetar
                        </button>
                      )}
                    </div>
                    <p className="text-[9px] text-stone-400 mt-1 leading-normal">
                      Dica: Para usar sua própria foto, você pode colar o link direto da imagem ou selecionar "Logo Padrão" se quiser a imagem oficial do sistema.
                    </p>
                  </div>
                </div>
              </div>
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
