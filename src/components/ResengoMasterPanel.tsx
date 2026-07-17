import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Activity,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  User,
  Shield,
  MapPin,
  Building,
  Check,
  AlertTriangle,
  PlayCircle,
  Settings,
  Send,
  History,
  ExternalLink
} from 'lucide-react';
import { Tenant } from '../types';
import { 
  getNotificationKey, 
  saveNotificationKey, 
  getNotificationLogs, 
  sendEmailNotification,
  NotificationLog
} from '../utils/notificationService';

interface ResengoMasterPanelProps {
  tenants: Tenant[];
  onUpdateTenants: (tenants: Tenant[]) => void;
  onLogout: () => void;
  onImpersonate: (tenant: Tenant) => void;
}

export default function ResengoMasterPanel({ tenants, onUpdateTenants, onLogout, onImpersonate }: ResengoMasterPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Email Notification States
  const [notificationKey, setNotificationKeyState] = useState(() => getNotificationKey());
  const [logs, setLogs] = useState<NotificationLog[]>(() => getNotificationLogs());
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  React.useEffect(() => {
    const handleStorageChange = () => {
      setLogs(getNotificationLogs());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveNotificationKey(notificationKey);
    alert('✅ Chave de notificação salva com sucesso!');
    // Trigger update
    setLogs(getNotificationLogs());
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    
    const subject = `🔔 Teste de Notificação - Resengo SaaS`;
    const body = `Olá Tiago!

Este é um e-mail de teste enviado diretamente do painel master do Resengo SaaS para validar suas notificações.

Se você está lendo esta mensagem, significa que o seu sistema de notificações por e-mail está configurado de forma correta e totalmente funcional!

Toda vez que uma nova pizzaria se cadastrar no site, você receberá um e-mail idêntico a este contendo a ficha completa do novo cliente (nome, WhatsApp, plano, e-mail e cidade).

Sucesso e ótimas vendas,
Equipe Resengo SaaS`;

    const res = await sendEmailNotification(subject, body, 'test_alert', notificationKey);
    setTestResult(res);
    setIsSendingTest(false);
    setLogs(getNotificationLogs());
  };

  // New tenant manual form
  const [newName, setNewName] = useState('');
  const [newRepName, setNewRepName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newIsPF, setNewIsPF] = useState(false);
  const [newDoc, setNewDoc] = useState('');
  const [newPlan, setNewPlan] = useState<'basic' | 'pro'>('basic');
  const [newCity, setNewCity] = useState('Lages');
  const [newState, setNewState] = useState('SC');

  // Toggle Tenant Status (Enable/Disable / Paid/Blocked)
  const handleToggleStatus = (id: string) => {
    const updated = tenants.map((t) => {
      if (t.id === id) {
        const currentActive = t.isActive !== false; // defaults to true
        return {
          ...t,
          isActive: !currentActive
        };
      }
      return t;
    });
    onUpdateTenants(updated);
  };

  // Delete Tenant
  const handleDeleteTenant = (id: string, name: string) => {
    if (confirm(`⚠️ Tem certeza que deseja EXCLUIR a pizzaria "${name}" do sistema de forma permanente?`)) {
      const updated = tenants.filter(t => t.id !== id);
      onUpdateTenants(updated);
    }
  };

  // Create manual tenant
  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword || !newPhone || !newDoc) {
      alert('⚠️ Preencha todos os campos obrigatórios!');
      return;
    }

    if (tenants.some(t => t.email?.trim().toLowerCase() === newEmail.trim().toLowerCase())) {
      alert('❌ Este e-mail já está em uso.');
      return;
    }

    const newSlug = newName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: newName,
      slug: newSlug || `pizzaria-${Date.now()}`,
      logo: '/logo_do_sistema.png',
      type: 'pizzaria',
      deliveryFee: 8.00,
      phone: newPhone,
      email: newEmail,
      password: newPassword,
      isPF: newIsPF,
      cpf: newIsPF ? newDoc : undefined,
      cnpj: !newIsPF ? newDoc : undefined,
      representativeName: newRepName,
      plan: newPlan,
      createdAt: new Date().toISOString(),
      isActive: true,
      trialDaysLeft: 3,
      city: newCity,
      state: newState,
      corporateName: newIsPF ? newRepName : newName,
    };

    onUpdateTenants([...tenants, newTenant]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewRepName('');
    setNewEmail('');
    setNewPassword('');
    setNewPhone('');
    setNewIsPF(false);
    setNewDoc('');
    setNewPlan('basic');
    setNewCity('Lages');
    setNewState('SC');
  };

  // Metrics
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.isActive !== false).length;
  const blockedTenants = tenants.filter(t => t.isActive === false).length;
  
  // Calculate MRR (Monthly Recurring Revenue)
  // Basic is 49.90, Pro/Multi-KDS is 89.90. Active paying ones contribute.
  const mrr = tenants.reduce((sum, t) => {
    if (t.isActive === false) return sum;
    const rate = t.plan === 'pro' ? 89.90 : 49.90;
    return sum + rate;
  }, 0);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    t.email?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    t.phone.includes(searchQuery) ||
    t.representativeName?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      
      {/* Top Owner Header */}
      <header className="bg-stone-950 border-b border-stone-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black shadow-md border border-orange-700">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-sm uppercase text-white tracking-wider">RESENGO MASTER SAAS</h1>
              <span className="bg-red-950 text-red-400 text-[8px] font-mono font-black px-2 py-0.5 rounded border border-red-900 tracking-wider">TIAGO PORTAL</span>
            </div>
            <p className="text-[10px] text-stone-400 font-medium">Controle de Mensalidades, Planos e Ativação de Pizzarias</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-stone-500 font-mono font-bold uppercase">Conectado como</p>
            <p className="text-xs text-stone-200 font-bold">tiago.lut@gmail.com</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-stone-850 hover:bg-stone-800 hover:text-red-400 text-stone-300 border border-stone-800 rounded-xl px-3.5 py-2 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair do Painel
          </button>
        </div>
      </header>

      {/* Main SaaS Monitoring Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-500 text-[9px] font-black uppercase font-mono tracking-wider">Faturamento do SaaS (MRR)</p>
              <h3 className="text-2xl font-black text-white font-mono leading-none">R$ {mrr.toFixed(2)}</h3>
              <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>Base Recorrente Estimada</span>
              </p>
            </div>
            <div className="bg-emerald-950 text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-900">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-500 text-[9px] font-black uppercase font-mono tracking-wider">Total de Pizzarias</p>
              <h3 className="text-2xl font-black text-white font-mono leading-none">{totalTenants}</h3>
              <p className="text-[9px] text-stone-400 font-semibold mt-1">Sistemas de delivery operando</p>
            </div>
            <div className="bg-stone-850 text-stone-300 w-10 h-10 rounded-xl flex items-center justify-center border border-stone-800">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-500 text-[9px] font-black uppercase font-mono tracking-wider">Clientes Ativos (Pagantes)</p>
              <h3 className="text-2xl font-black text-emerald-400 font-mono leading-none">{activeTenants}</h3>
              <p className="text-[9px] text-stone-400 font-semibold mt-1">Status operacional liberado</p>
            </div>
            <div className="bg-emerald-950/40 text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-900/45">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-500 text-[9px] font-black uppercase font-mono tracking-wider">Clientes Bloqueados</p>
              <h3 className="text-2xl font-black text-red-500 font-mono leading-none">{blockedTenants}</h3>
              <p className="text-[9px] text-stone-400 font-semibold mt-1">Sem acesso ao sistema</p>
            </div>
            <div className="bg-red-950/40 text-red-400 w-10 h-10 rounded-xl flex items-center justify-center border border-red-900/45">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* CONTROLS BAR */}
        <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md text-xs">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, e-mail, telefone, responsável..."
              className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-stone-100 rounded-xl py-2.5 pl-10 pr-4 font-semibold placeholder-stone-600 outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md self-stretch md:self-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Pizzaria Manual
          </button>
        </div>

        {/* TENANTS DATABASE TABLE */}
        <div className="bg-stone-950/40 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-stone-950 border-b border-stone-800">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">RELAÇÃO DE PARCEIROS</h3>
          </div>

          <div className="overflow-x-auto">
            {filteredTenants.length === 0 ? (
              <div className="p-12 text-center text-xs text-stone-500 space-y-2">
                <AlertTriangle className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="font-bold">Nenhum parceiro encontrado com os termos pesquisados.</p>
                <p>Verifique o termo digitado ou cadastre um novo estabelecimento.</p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-stone-950/60 text-stone-500 font-bold uppercase tracking-wider text-[9px] border-b border-stone-800">
                    <th className="p-4">Pizzaria</th>
                    <th className="p-4">Responsável</th>
                    <th className="p-4">Documento / Tipo</th>
                    <th className="p-4">Plano</th>
                    <th className="p-4">Mensalidade</th>
                    <th className="p-4">Acesso / Status</th>
                    <th className="p-4 text-right">Ações de Controle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-medium">
                  {filteredTenants.map((t) => {
                    const isActive = t.isActive !== false;
                    const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : 'Legado';
                    const planLabel = t.plan === 'pro' ? 'Multi-KDS / Pro' : 'Básico';
                    const planPrice = t.plan === 'pro' ? 89.90 : 49.90;
                    
                    return (
                      <tr key={t.id} className="hover:bg-stone-900/30 transition-all text-[11px] text-stone-300">
                        
                        {/* Pizzaria */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-red-950 text-red-400 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-red-900/50 shrink-0">
                              🍕
                            </div>
                            <div>
                              <p className="font-black text-white text-xs">{t.name}</p>
                              <p className="text-[10px] text-stone-500 font-mono">slug: /{t.slug}</p>
                              <p className="text-[9px] text-stone-500">Cadastrado em: {dateStr}</p>
                            </div>
                          </div>
                        </td>

                        {/* Responsável */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <p className="text-stone-200 font-bold">{t.representativeName || 'Consumidor Geral'}</p>
                            <p className="text-[9px] text-stone-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-600" />
                              <span>{t.email || 'Nenhum'}</span>
                            </p>
                            <p className="text-[9px] text-stone-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-stone-600" />
                              <span>{t.phone}</span>
                            </p>
                          </div>
                        </td>

                        {/* Documento */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] text-stone-200">
                              {t.isPF ? (t.cpf || 'PF') : (t.cnpj || 'PJ')}
                            </span>
                            <p className="text-[9px] text-stone-500 uppercase tracking-widest font-mono font-bold">
                              {t.isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}
                            </p>
                          </div>
                        </td>

                        {/* Plano */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                            t.plan === 'pro' 
                              ? 'bg-amber-950/60 text-amber-400 border-amber-900' 
                              : 'bg-stone-900 text-stone-400 border-stone-800'
                          }`}>
                            {planLabel}
                          </span>
                        </td>

                        {/* Mensalidade */}
                        <td className="p-4 font-mono font-black text-stone-200">
                          R$ {planPrice.toFixed(2)}
                        </td>

                        {/* Acesso / Status */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-900/55">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                                OPERANDO / ATIVO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-900/55">
                                BLOQUEADO / INATIVO
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Ações */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Impersonate */}
                            <button
                              onClick={() => onImpersonate(t)}
                              title="Visualizar Painel Operacional"
                              className="bg-stone-900 hover:bg-stone-850 hover:text-orange-400 border border-stone-850 text-stone-400 p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>

                            {/* Toggle Block/Unblock */}
                            <button
                              onClick={() => handleToggleStatus(t.id)}
                              title={isActive ? "Bloquear Acesso" : "Desbloquear Acesso"}
                              className={`p-1.5 rounded-lg border transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                                isActive
                                  ? 'bg-red-950/30 hover:bg-red-950 border-red-900 text-red-400'
                                  : 'bg-emerald-950/30 hover:bg-emerald-950 border-emerald-900 text-emerald-400'
                              }`}
                            >
                              {isActive ? 'Suspender' : 'Liberar'}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteTenant(t.id, t.name)}
                              title="Remover Permanentemente"
                              className="bg-stone-900 hover:bg-red-950 hover:text-red-400 hover:border-red-900 border border-stone-850 text-stone-500 p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* EMAIL NOTIFICATIONS CONFIGURATION FOR TIAGO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Settings Column */}
          <div className="lg:col-span-7 bg-stone-950/60 border border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-500" />
                CONEXÃO DE E-MAIL REAL (Web3Forms)
              </h3>
              <p className="text-[10px] text-stone-400 mt-1">Habilite o envio automático de novos cadastros para seu e-mail de administrador.</p>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Chave de Notificação do Sistema</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notificationKey}
                    onChange={(e) => setNotificationKeyState(e.target.value)}
                    placeholder="Cole aqui sua chave (Ex: abcde123-4567-890a-bcde-f1234567890a)"
                    className="flex-1 bg-stone-900 border border-stone-800 focus:border-orange-500 text-stone-200 rounded-xl py-2.5 px-4 font-mono text-xs outline-none transition-all placeholder-stone-600"
                  />
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-500 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Salvar Chave
                  </button>
                </div>
              </div>
            </form>

            {/* Step by step guide to get the free Web3Forms key */}
            <div className="bg-stone-900/40 border border-stone-850 rounded-xl p-4 space-y-2.5">
              <h4 className="font-bold text-xs text-stone-200 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                Como obter uma chave grátis em 30 segundos?
              </h4>
              <ol className="list-decimal pl-4 text-[11px] text-stone-400 space-y-1">
                <li>Acesse o site oficial: <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline inline-flex items-center gap-0.5">web3forms.com <ExternalLink className="w-2.5 h-2.5" /></a></li>
                <li>Na página inicial, insira o seu e-mail válido: <strong className="text-stone-300 select-all">tiago.lut@gmail.com</strong></li>
                <li>Você receberá instantaneamente um e-mail com a sua **Access Key**.</li>
                <li>Copie a chave, cole no campo acima e clique em **Salvar Chave**! Pronto!</li>
              </ol>
            </div>

            {/* Test Email Section */}
            <div className="border-t border-stone-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-stone-200">Validar e Testar Conectividade</h4>
                  <p className="text-[10px] text-stone-500">Envie um e-mail de teste real para tiago.lut@gmail.com agora mesmo.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    isSendingTest 
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white border border-stone-700/60'
                  }`}
                >
                  <Send className="w-3 h-3 text-orange-400" />
                  {isSendingTest ? 'Disparando...' : 'Testar Disparo'}
                </button>
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-xl border text-[11px] animate-fade-in ${
                  testResult.success 
                    ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' 
                    : 'bg-red-950/40 border-red-900/60 text-red-300'
                }`}>
                  <div className="flex gap-2">
                    <span className="text-sm">{testResult.success ? '✅' : '❌'}</span>
                    <div className="space-y-0.5">
                      <p className="font-bold">{testResult.success ? 'Envio Bem-sucedido!' : 'Falha no Envio'}</p>
                      <p className="text-stone-400 text-[10px]">{testResult.message}</p>
                      {testResult.success && (
                        <p className="text-[10px] text-emerald-400 font-medium mt-1">Verifique agora mesmo a caixa de entrada (ou spam) do seu e-mail tiago.lut@gmail.com!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logs Column */}
          <div className="lg:col-span-5 bg-stone-950/60 border border-stone-800 rounded-2xl p-5 flex flex-col h-[420px] overflow-hidden">
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between shrink-0">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-white flex items-center gap-2">
                <History className="w-4 h-4 text-orange-400" />
                HISTÓRICO DE DISPAROS DA SESSÃO
              </h3>
              <span className="bg-stone-900 text-stone-400 font-mono text-[9px] px-2 py-0.5 rounded font-bold">{logs.length} envios</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-2.5">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-1.5">
                  <Mail className="w-8 h-8 text-stone-700" />
                  <p className="font-bold text-xs">Nenhum disparo registrado.</p>
                  <p className="text-[10px] max-w-[200px]">Os novos registros de parceiros aparecerão listados em tempo real aqui.</p>
                </div>
              ) : (
                logs.map((log) => {
                  const date = new Date(log.timestamp).toLocaleTimeString('pt-BR');
                  return (
                    <div key={log.id} className="bg-stone-900/60 border border-stone-850 rounded-xl p-3 space-y-2 text-[10px] hover:border-stone-800 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            log.type === 'test_alert' 
                              ? 'bg-purple-950 text-purple-400 border border-purple-900/50' 
                              : 'bg-orange-950 text-orange-400 border border-orange-900/50'
                          }`}>
                            {log.type === 'test_alert' ? 'Teste de Conexão' : 'Novo Parceiro'}
                          </span>
                          <span className="text-[9px] font-mono text-stone-500 ml-1.5">{date}</span>
                        </div>
                        
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black tracking-wider ${
                          log.status === 'success' 
                            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' 
                            : 'bg-red-950/50 text-red-400 border border-red-900/40'
                        }`}>
                          {log.status === 'success' ? 'ENVIADO' : 'FALHOU'}
                        </span>
                      </div>

                      <p className="text-stone-200 font-black text-[11px] truncate">{log.subject}</p>
                      
                      {log.errorMessage && (
                        <p className="text-red-400 text-[9px] font-mono leading-relaxed bg-red-950/20 border border-red-900/30 p-2 rounded">
                          ❌ {log.errorMessage}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-800 bg-stone-950 py-4 px-6 text-center text-[10px] text-stone-500">
        Resengo SaaS • Painel Operacional de Segurança Master • Todos os dados salvos em LocalStorage na sessão atual.
      </footer>

      {/* MANUAL ADDITION MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 animate-scale-in text-xs">
            
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
              <h3 className="font-display font-black text-sm uppercase text-white tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-500" />
                Cadastrar Nova Pizzaria Manualmente
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-white font-bold cursor-pointer">Fechar</button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              
              <div className="bg-stone-900/60 p-1 rounded-xl border border-stone-850 flex gap-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setNewIsPF(false)}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${!newIsPF ? 'bg-stone-800 text-white font-black' : 'text-stone-400 hover:text-stone-200'}`}
                >
                  🏢 Pessoa Jurídica (PJ)
                </button>
                <button
                  type="button"
                  onClick={() => setNewIsPF(true)}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${newIsPF ? 'bg-stone-800 text-white font-black' : 'text-stone-400 hover:text-stone-200'}`}
                >
                  👤 Pessoa Física (PF)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Nome Comercial *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Pizzaria Forno Nobre"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Responsável *</label>
                  <input
                    type="text"
                    required
                    value={newRepName}
                    onChange={(e) => setNewRepName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">
                    {newIsPF ? 'CPF *' : 'CNPJ *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoc}
                    onChange={(e) => setNewDoc(e.target.value)}
                    placeholder={newIsPF ? '000.000.000-00' : '00.000.000/0001-00'}
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="(49) 99123-4567"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">E-mail (Login) *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="contato@pizzaria.com.br"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Senha de Acesso *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Plano SaaS *</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  >
                    <option value="basic">Plano Básico (R$ 49,90/mês)</option>
                    <option value="pro">Plano Multi-KDS / Pro (R$ 89,90/mês)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 focus:border-orange-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl font-bold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black shadow-md cursor-pointer transition-all uppercase tracking-wider"
                >
                  Cadastrar Estabelecimento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
