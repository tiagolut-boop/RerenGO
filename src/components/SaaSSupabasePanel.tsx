import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Settings, 
  Play, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  HelpCircle,
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  testSupabaseConnection, 
  pushLocalToSupabase, 
  pullSupabaseToLocal,
  resetSupabaseClient,
  SUPABASE_SQL_SCRIPT 
} from '../supabaseClient';
import { Tenant, Order, Customer, FinancialTransaction } from '../types';

interface SaaSSupabasePanelProps {
  tenants: Tenant[];
  customers: Customer[];
  orders: Order[];
  transactions: FinancialTransaction[];
  onUpdateAllData: (data: {
    tenants: Tenant[];
    customers: Customer[];
    orders: Order[];
    transactions: FinancialTransaction[];
  }) => void;
}

export default function SaaSSupabasePanel({
  tenants,
  customers,
  orders,
  transactions,
  onUpdateAllData
}: SaaSSupabasePanelProps) {
  // Config states
  const config = getSupabaseConfig();
  const [url, setUrl] = useState(config.url || 'https://sfyouhzzwazqclhuoxvn.supabase.co');
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [isEnabled, setIsEnabled] = useState(config.isEnabled);

  // UI status states
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'failed'>('idle');
  const [syncLog, setSyncLog] = useState('');
  const [copied, setCopied] = useState(false);

  // Check initial connection if enabled
  useEffect(() => {
    if (isEnabled && url && anonKey) {
      handleTestConnection(true);
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('saas_supabase_url', url.trim());
    localStorage.setItem('saas_supabase_anon_key', anonKey.trim());
    localStorage.setItem('saas_supabase_enabled', isEnabled ? 'true' : 'false');
    resetSupabaseClient();
    handleTestConnection(true);
  };

  const handleTestConnection = async (silent = false) => {
    if (!url.trim()) {
      setConnectionStatus('failed');
      setStatusMessage('Insira a URL do Supabase.');
      return;
    }
    if (!anonKey.trim()) {
      setConnectionStatus('failed');
      setStatusMessage('Insira a Chave Pública do Supabase.');
      return;
    }

    if (!silent) setConnectionStatus('testing');
    
    // Temp save in localStorage to let getSupabaseClient load it
    localStorage.setItem('saas_supabase_url', url.trim());
    localStorage.setItem('saas_supabase_anon_key', anonKey.trim());
    localStorage.setItem('saas_supabase_enabled', 'true'); // Temporarily enable to test
    resetSupabaseClient();

    const result = await testSupabaseConnection();

    if (result.success) {
      setConnectionStatus('connected');
      setStatusMessage(result.message);
      // Keep enabled since it worked
      if (!isEnabled) {
        setIsEnabled(true);
        localStorage.setItem('saas_supabase_enabled', 'true');
      }
    } else {
      setConnectionStatus('failed');
      setStatusMessage(result.message);
      // Restore actual enabled state if test failed
      localStorage.setItem('saas_supabase_enabled', isEnabled ? 'true' : 'false');
      resetSupabaseClient();
    }
  };

  const handleToggleEnable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsEnabled(checked);
    localStorage.setItem('saas_supabase_enabled', checked ? 'true' : 'false');
    resetSupabaseClient();
    if (checked && url && anonKey) {
      handleTestConnection(true);
    }
  };

  const handlePush = async () => {
    setSyncStatus('syncing');
    setSyncLog('Preparando dados locais...');
    
    const result = await pushLocalToSupabase(tenants, customers, orders, transactions);
    setSyncLog(result.log);
    
    if (result.success) {
      setSyncStatus('success');
    } else {
      setSyncStatus('failed');
    }
  };

  const handlePull = async () => {
    if (!window.confirm('Tem certeza de que deseja sincronizar do Supabase? Isso irá substituir todos os dados locais do seu navegador pelos dados da nuvem.')) {
      return;
    }

    setSyncStatus('syncing');
    setSyncLog('Buscando dados no Supabase...');

    const result = await pullSupabaseToLocal();
    setSyncLog(result.log);

    if (result.success && result.tenants && result.customers && result.orders && result.transactions) {
      setSyncStatus('success');
      // Update local React state in parent App.tsx
      onUpdateAllData({
        tenants: result.tenants,
        customers: result.customers,
        orders: result.orders,
        transactions: result.transactions,
      });
      
      // Update localStorage fallback backups
      localStorage.setItem('saas_tenants_list', JSON.stringify(result.tenants));
      localStorage.setItem('saas_customers', JSON.stringify(result.customers));
      // Save active tenant to the first one in the downloaded list
      if (result.tenants.length > 0) {
        localStorage.setItem('saas_active_tenant', JSON.stringify(result.tenants[0]));
      }
    } else {
      setSyncStatus('failed');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 notranslate" id="supabase-panel" translate="no">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-850 text-white rounded-2xl p-6 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Integração Externa</span>
              <h2 className="text-xl font-display font-black tracking-tight mt-0.5">Banco de Dados Supabase (PostgreSQL)</h2>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-normal max-w-2xl">
            Sincronize pedidos, clientes, caixas e motoboys em tempo real. Ideal para utilizar múltiplos painéis abertos simultaneamente, sincronizar com o site do cliente, ou usar o aplicativo no celular de forma unificada.
          </p>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 flex items-center gap-3">
          <div className={`px-4 py-3 rounded-xl border text-center ${
            isEnabled && connectionStatus === 'connected'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : isEnabled && connectionStatus === 'testing'
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-stone-800 border-stone-700 text-stone-400'
          }`}>
            <span className="block text-[8px] font-black uppercase tracking-widest text-stone-400">STATUS DA CONEXÃO</span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${
                isEnabled && connectionStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : isEnabled && connectionStatus === 'testing'
                  ? 'bg-yellow-500 animate-spin'
                  : 'bg-stone-500'
              }`}></span>
              <span className="text-xs font-black uppercase tracking-tight">
                {isEnabled && connectionStatus === 'connected' ? 'SUPABASE ATIVO' : isEnabled && connectionStatus === 'testing' ? 'TESTANDO...' : 'DESCONECTADO'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration Form & Sync Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Credentials Section */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-3xs p-5 space-y-4">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5 pb-2.5 border-b border-stone-100">
              <Settings className="w-4 h-4 text-orange-600" />
              Configuração das Chaves de API
            </h3>

            {/* Enable switch */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-150">
              <div>
                <span className="block text-xs font-black text-stone-950">Ativar Conexão com o Supabase</span>
                <span className="block text-[10px] text-stone-500 leading-normal">Ao ativar, os dados salvos serão enviados e lidos do seu banco Supabase.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={isEnabled} 
                  onChange={handleToggleEnable} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-stone-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="space-y-3 pt-1">
              {/* Supabase URL */}
              <div>
                <label className="block text-[10px] font-black text-stone-700 uppercase tracking-wider mb-1">
                  SUPABASE URL (Project URL)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 font-mono text-xs">https://</span>
                  <input
                    type="text"
                    value={url.replace(/^https?:\/\//, '')}
                    onChange={(e) => {
                      setUrl(`https://${e.target.value.trim()}`);
                    }}
                    placeholder="ex: xyz-project-id.supabase.co"
                    className="w-full text-xs pl-[72px] pr-3 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-mono font-medium"
                  />
                </div>
                <p className="text-[9px] text-stone-400 mt-0.5 font-semibold">Localizado em: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL</p>
              </div>

              {/* Publishable / Anon Key */}
              <div>
                <label className="block text-[10px] font-black text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Chave Pública Anon (Publishable Key)</span>
                  <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded font-black">SEGURA NO CLIENTE</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value.trim())}
                    placeholder="Cole a chave pública de API anon aqui"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-stone-800 font-mono font-medium"
                  />
                </div>
                <p className="text-[9px] text-stone-400 mt-0.5 font-semibold">Sua chave pública. É segura para navegadores se as políticas de RLS estiverem ativas.</p>
              </div>
            </div>

            {/* Test and Save actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => handleTestConnection()}
                disabled={connectionStatus === 'testing'}
                className="flex-1 py-2 px-3.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {connectionStatus === 'testing' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-orange-400" />
                )}
                <span>Testar Conexão</span>
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Salvar Configurações
              </button>
            </div>

            {/* Status alerts */}
            {statusMessage && (
              <div className={`p-3 rounded-lg border text-[10px] font-bold flex items-start gap-2 ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {connectionStatus === 'connected' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <div>
                  <p>{statusMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sync Operations */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-3xs p-5 space-y-4">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5 pb-2.5 border-b border-stone-100">
              <RefreshCw className="w-4 h-4 text-orange-600 animate-spin-slow" />
              Sincronização de Banco de Dados
            </h3>

            <p className="text-[11px] text-stone-500 leading-normal font-semibold">
              Sendo um sistema <strong className="text-stone-700">Offline-First</strong>, você pode mover seus dados livremente entre a memória do seu navegador atual (Local Storage) e seu banco de dados na nuvem (Supabase):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Push Local -> Supabase */}
              <button
                type="button"
                onClick={handlePush}
                disabled={!isEnabled || connectionStatus !== 'connected' || syncStatus === 'syncing'}
                className="p-3 bg-stone-50 border border-stone-200 hover:border-orange-500 rounded-xl hover:bg-orange-50/20 cursor-pointer text-left transition-all space-y-1.5 disabled:opacity-50 disabled:pointer-events-none group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <ArrowUp className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-black text-stone-900 uppercase tracking-tight">Enviar Dados Locais</span>
                </div>
                <p className="text-[9px] text-stone-500 leading-normal font-bold">
                  Envia os dados salvos neste navegador para as tabelas correspondentes no Supabase. Não exclui dados remotos, apenas atualiza/mescla.
                </p>
              </button>

              {/* Pull Supabase -> Local */}
              <button
                type="button"
                onClick={handlePull}
                disabled={!isEnabled || connectionStatus !== 'connected' || syncStatus === 'syncing'}
                className="p-3 bg-stone-50 border border-stone-200 hover:border-orange-500 rounded-xl hover:bg-orange-50/20 cursor-pointer text-left transition-all space-y-1.5 disabled:opacity-50 disabled:pointer-events-none group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 text-orange-700 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-black text-stone-900 uppercase tracking-tight">Baixar Dados Nuvem</span>
                </div>
                <p className="text-[9px] text-stone-500 leading-normal font-bold">
                  Sobrescreve a memória local deste navegador com os registros contidos no Supabase. <span className="text-red-600 font-bold">Aviso: substitui seus dados locais.</span>
                </p>
              </button>
            </div>

            {/* Sync Logger console */}
            {syncStatus !== 'idle' && (
              <div className="space-y-1.5">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-500">Log de Operações do Banco</span>
                <div className="bg-stone-950 text-stone-300 p-3.5 rounded-lg font-mono text-[9px] leading-relaxed max-h-40 overflow-y-auto border border-stone-800 whitespace-pre-wrap">
                  <span>{syncLog}</span>
                  {syncStatus === 'syncing' && <span className="inline-block animate-pulse text-orange-400"> ● processando...</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: SQL Script & Security Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Security details about Anon key */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3.5">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Segurança e Chave Pública
            </h3>
            <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
              O Supabase foi projetado para que o cliente se comunique diretamente com o banco de dados de maneira segura sem necessitar de um backend complexo intermédio. 
            </p>
            <div className="bg-white p-3 rounded-xl border border-stone-200/60 text-[10px] text-stone-700 space-y-2 leading-relaxed">
              <p className="font-bold flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Como funciona a segurança no navegador?
              </p>
              <ul className="list-disc pl-4 space-y-1 font-medium">
                <li>As políticas de <strong className="text-stone-900">Row Level Security (RLS)</strong> garantem que o usuário só consiga ver e alterar o que as políticas SQL permitem.</li>
                <li>Qualquer pessoa com acesso à chave pública anon não pode descriptografar dados ou realizar ataques se o RLS estiver ativado.</li>
                <li>As tabelas criadas abaixo já incluem as diretivas do RLS habilitadas!</li>
              </ul>
            </div>
          </div>

          {/* SQL Copy Box */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-3xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-orange-600" />
                Tabelas SQL do Banco
              </h3>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 text-[9px] px-2 py-1 border border-stone-200 hover:border-orange-500 hover:text-orange-600 rounded bg-stone-50 cursor-pointer font-bold uppercase tracking-tight transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 text-[10px] text-stone-600 leading-normal font-semibold">
              <p>Execute estes comandos no painel do seu Supabase para criar as tabelas instantaneamente:</p>
              <ol className="list-decimal pl-4 space-y-1 font-medium text-stone-500">
                <li>Abra o painel do seu projeto no <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-orange-600 underline font-black">Supabase</a></li>
                <li>No menu esquerdo, vá em <strong className="text-stone-700">SQL Editor</strong></li>
                <li>Clique em <strong className="text-stone-700">New Query</strong></li>
                <li>Cole o script copiado ao lado e clique em <strong className="text-stone-700">Run</strong></li>
              </ol>
            </div>

            {/* Minimised Code Box preview */}
            <div className="bg-stone-900 text-stone-400 p-3 rounded-lg font-mono text-[9px] h-32 overflow-y-auto border border-stone-800 leading-relaxed">
              <span className="text-[8px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Prévia do Script SQL</span>
              {SUPABASE_SQL_SCRIPT}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
