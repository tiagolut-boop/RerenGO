import React, { useState } from 'react';
import { 
  Building, 
  Lock, 
  Mail, 
  User, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Key,
  DollarSign, 
  TrendingUp, 
  Info, 
  LogOut, 
  AlertTriangle, 
  Plus, 
  Search,
  Trash2,
  Shield,
  Activity,
  Phone,
  MapPin,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Tenant } from '../types';

interface ResengoAuthPortalProps {
  tenants: Tenant[];
  onSetTenants: (tenants: Tenant[]) => void;
  onLoginSuccess: (tenant: Tenant, isMaster: boolean) => void;
}

export default function ResengoAuthPortal({ tenants, onSetTenants, onLoginSuccess }: ResengoAuthPortalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'recovery'>('login');
  
  // Recovery Form States
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'email' | 'reset'>('email');
  const [resetTenantId, setResetTenantId] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regRepName, setRegRepName] = useState('');
  const [regIsPF, setRegIsPF] = useState(false);
  const [regDoc, setRegDoc] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Lages');
  const [regState, setRegState] = useState('SC');
  const [regBairro, setRegBairro] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [regComplement, setRegComplement] = useState('');
  const [regPlan, setRegPlan] = useState<'basic' | 'pro'>('basic');
  const [regSuccess, setRegSuccess] = useState(false);

  // Simulated Email Notification Modal State
  const [simulatedEmail, setSimulatedEmail] = useState<{
    to: string;
    from: string;
    subject: string;
    body: string;
  } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const emailClean = loginEmail.trim().toLowerCase();
    const passwordClean = loginPassword.trim();

    // Check Master Admin Credentials
    if (emailClean === 'tiago.lut@gmail.com' && passwordClean === 'Lutando7*pizzaria') {
      const masterMockTenant: Tenant = {
        id: 'master',
        name: 'Master Admin',
        slug: 'master-admin',
        logo: '👑',
        type: 'pizzaria',
        deliveryFee: 0,
        phone: '(49) 99805-9293',
        email: 'tiago.lut@gmail.com',
        isActive: true
      };
      onLoginSuccess(masterMockTenant, true);
      return;
    }

    // Check Test Credentials
    if ((emailClean === 'teste@teste.com' || emailClean === 'teste@teste') && passwordClean === '123456') {
      const defaultTenant = tenants.find(t => {
        const email = t.email?.trim().toLowerCase();
        return email === 'teste@teste' || email === 'teste@teste.com' || t.id === 'tenant-test-default';
      }) || tenants.find(t => t.id === 'tenant-1') || tenants[0];
      if (defaultTenant) {
        onLoginSuccess({
          ...defaultTenant,
          isActive: true
        }, false);
        return;
      }
    }

    // Check Regular Tenant
    const found = tenants.find(t => t.email?.trim().toLowerCase() === emailClean);
    if (found) {
      if (found.password === passwordClean) {
        if (found.isActive === false) {
          setLoginError('❌ Esta conta está INATIVA/BLOQUEADA. Por favor, regularize seu pagamento entrando em contato com tiago.lut@gmail.com.');
          return;
        }
        onLoginSuccess(found, false);
      } else {
        setLoginError('❌ Senha incorreta.');
      }
    } else {
      setLoginError('❌ Usuário/E-mail não cadastrado no Resengo SaaS.');
    }
  };

  const handleRecoveryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess(false);

    const emailClean = recoveryEmail.trim().toLowerCase();

    // Check Master Admin
    if (emailClean === 'tiago.lut@gmail.com') {
      const emailBody = `Olá Tiago!
      
Você solicitou a recuperação de senha do seu e-mail de Master Admin do Resengo SaaS.

Sua senha cadastrada é: Lutando7*pizzaria

Caso queira alterá-la, edite diretamente o arquivo de configuração no código do projeto.

Atenciosamente,
Sistema de Segurança Resengo`;

      setSimulatedEmail({
        to: 'tiago.lut@gmail.com',
        from: 'seguranca@resengo.com.br',
        subject: '🔑 Recuperação de Senha - Master Admin',
        body: emailBody
      });
      setRecoverySuccess(true);
      return;
    }

    // Check default test account
    if (emailClean === 'teste@teste.com' || emailClean === 'teste@teste') {
      const emailBody = `Olá Teste!
      
Você solicitou a recuperação de senha para a conta de testes.

Sua senha de acesso é: 123456

Atenciosamente,
Sistema de Segurança Resengo`;

      setSimulatedEmail({
        to: emailClean,
        from: 'seguranca@resengo.com.br',
        subject: '🔑 Recuperação de Senha - Conta de Teste',
        body: emailBody
      });
      setRecoverySuccess(true);
      return;
    }

    // Check Regular Tenant
    const found = tenants.find(t => t.email?.trim().toLowerCase() === emailClean);
    if (found) {
      setResetTenantId(found.id);
      setRecoveryStep('reset');
      
      // We will also send a simulated email just to be helpful
      const emailBody = `Olá ${found.name}!
      
Recebemos uma solicitação de alteração de senha para a sua conta no Resengo SaaS.

Sua senha atual é: ${found.password}

Você pode usar o painel de recuperação para definir uma nova senha agora mesmo!

Atenciosamente,
Sistema de Segurança Resengo`;

      setSimulatedEmail({
        to: found.email || '',
        from: 'seguranca@resengo.com.br',
        subject: `🔑 Solicitação de Nova Senha - ${found.name}`,
        body: emailBody
      });
    } else {
      setRecoveryError('❌ E-mail não encontrado no sistema.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      alert('❌ As senhas não coincidem!');
      return;
    }
    if (newPassword.length < 6) {
      alert('❌ A senha deve conter pelo menos 6 caracteres!');
      return;
    }

    // Update the tenant's password in tenants list
    const updatedTenants = tenants.map(t => {
      if (t.id === resetTenantId) {
        return {
          ...t,
          password: newPassword
        };
      }
      return t;
    });

    onSetTenants(updatedTenants);
    
    // Show success alert
    alert('✅ Senha alterada com sucesso! Agora você pode fazer o login.');
    setActiveTab('login');
    setRecoveryEmail('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setRecoveryStep('email');
    setSimulatedEmail(null);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regPhone || !regDoc) {
      alert('⚠️ Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Check if email already registered
    if (tenants.some(t => t.email?.trim().toLowerCase() === regEmail.trim().toLowerCase()) || regEmail.trim().toLowerCase() === 'tiago.lut@gmail.com') {
      alert('❌ Este e-mail já está em uso.');
      return;
    }

    const newSlug = regName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: regName,
      slug: newSlug || `pizzaria-${Date.now()}`,
      logo: '/logo_do_sistema.png',
      type: 'pizzaria',
      deliveryFee: 8.00,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
      isPF: regIsPF,
      cpf: regIsPF ? regDoc : undefined,
      cnpj: !regIsPF ? regDoc : undefined,
      representativeName: regRepName,
      plan: regPlan,
      createdAt: new Date().toISOString(),
      isActive: true, // Registered standard starts as Active (Trial)
      trialDaysLeft: 3, // 3 Days free trial!
      city: regCity,
      state: regState,
      bairro: regBairro,
      address: `${regStreet.trim()}, ${regNumber.trim()}${regComplement.trim() ? ' - ' + regComplement.trim() : ''}`,
      corporateName: regIsPF ? regRepName : regName,
    };

    const updatedTenants = [...tenants, newTenant];
    onSetTenants(updatedTenants);

    // Setup simulated email to show the user that Tiago gets notified
    const emailBody = `Olá Tiago!
    
Temos um novo parceiro cadastrado no Resengo SaaS!
Confira os detalhes abaixo:

========================================
🍕 DADOS DA PIZZARIA:
========================================
- Nome Comercial: ${newTenant.name}
- Tipo de Cadastro: ${newTenant.isPF ? 'Pessoa Física (PF)' : 'Pessoa Jurídica (PJ)'}
- Documento: ${newTenant.isPF ? newTenant.cpf : newTenant.cnpj}
- Nome do Responsável: ${newTenant.representativeName || 'Não Informado'}
- WhatsApp: ${newTenant.phone}
- E-mail de Acesso: ${newTenant.email}
- Cidade/UF: ${newTenant.city}/${newTenant.state}
- Plano Escolhido: ${newTenant.plan === 'basic' ? 'Básico (R$ 49,90/mês)' : 'Profissional (R$ 89,90/mês)'}
- Período de Testes: 3 Dias Grátis

O cadastro foi habilitado automaticamente no modo de testes. Você pode controlar as mensalidades e o status ativo/bloqueado desta conta no seu Painel Master Resengo!

Sucesso,
Equipe de Tecnologia Resengo`;

    setSimulatedEmail({
      to: 'tiago.lut@gmail.com',
      from: 'sistema@resengo.com.br',
      subject: `🔔 Novo Parceiro Cadastrado: ${newTenant.name}`,
      body: emailBody
    });

    setRegSuccess(true);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-between relative overflow-hidden text-stone-100">
      
      {/* Background decorations */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full bg-orange-600/10 blur-[100px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="border-b border-stone-800 bg-stone-950/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo_do_sistema.png" alt="Resengo Logo" className="w-9 h-9 object-contain rounded-xl shadow-md border border-stone-800" />
          <div>
            <h1 className="font-display font-black text-sm uppercase tracking-wider text-white">RESENGO</h1>
            <p className="text-[9px] text-stone-500 font-mono font-bold tracking-widest uppercase">SaaS para Gestão de Pizzarias</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-stone-400 font-semibold hidden sm:inline">Precisa de ajuda?</span>
          <a href="mailto:tiago.lut@gmail.com" className="bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-lg px-3 py-1.5 font-bold transition-all">
            Fale Conosco
          </a>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        
        {/* Registration Success Overlay Dialog */}
        {regSuccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in text-xs leading-relaxed">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800 animate-bounce mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">Cadastro Criado com Sucesso!</h3>
                <p className="text-stone-400 text-[11px]">Você acaba de ganhar <strong>3 dias de teste inteiramente grátis</strong> para decolar sua pizzaria.</p>
              </div>

              {simulatedEmail && (
                <div className="bg-stone-900 border border-stone-850 rounded-xl p-4 space-y-3.5">
                  <div className="border-b border-stone-800 pb-2 space-y-1">
                    <p className="text-[10px] text-stone-500 font-bold uppercase font-mono">Simulação de Disparo de E-mail SaaS</p>
                    <div className="flex justify-between text-stone-300 font-mono text-[10px]">
                      <span><strong>De:</strong> {simulatedEmail.from}</span>
                      <span><strong>Para:</strong> {simulatedEmail.to}</span>
                    </div>
                    <p className="text-white font-black text-[11px] mt-1">{simulatedEmail.subject}</p>
                  </div>
                  <pre className="text-stone-300 text-[10px] leading-relaxed font-mono whitespace-pre-wrap max-h-[220px] overflow-y-auto pr-2 bg-stone-950 p-3 rounded border border-stone-850">
                    {simulatedEmail.body}
                  </pre>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setRegSuccess(false);
                    setSimulatedEmail(null);
                    // Automatically log in using the newly registered tenant
                    const justCreated = tenants[tenants.length - 1];
                    if (justCreated) {
                      onLoginSuccess(justCreated, false);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-6 rounded-lg shadow-md transition-all uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-stone-950/60 border border-stone-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          
          {/* Left Column: Branding, Value Proposition and Instructions */}
          <div className="md:col-span-5 bg-gradient-to-br from-red-950/50 via-stone-950/90 to-orange-950/30 p-6 md:p-8 flex flex-col justify-between border-r border-stone-850/80">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="bg-red-950 text-red-400 border border-red-900 rounded-full px-3 py-1 font-mono text-[9px] font-extrabold uppercase tracking-widest inline-block">
                  SaaS de Gestão Organizada
                </div>
                <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight leading-tight">
                  TUDO QUE SUA PIZZARIA PRECISA EM UM SÓ LUGAR.
                </h2>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Gerencie pedidos de balcão (PDV), controle de entregas com motoboy, painel de produção da cozinha (KDS), cardápio dinâmico e financeiro integrado.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 bg-red-950/60 rounded-lg flex items-center justify-center border border-red-900 text-sm shrink-0">🛵</div>
                  <div>
                    <h4 className="font-black text-stone-200 text-xs uppercase">Simulador de Vendas</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">Seu cliente simula o pedido e o KDS e Delivery apitam no ato na sua tela.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 bg-orange-950/60 rounded-lg flex items-center justify-center border border-orange-900 text-sm shrink-0">⚡</div>
                  <div>
                    <h4 className="font-black text-stone-200 text-xs uppercase">3 Dias Gratuitos</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">Crie sua conta agora, utilize todas as ferramentas sem compromisso.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 bg-amber-950/60 rounded-lg flex items-center justify-center border border-amber-900 text-sm shrink-0">💳</div>
                  <div>
                    <h4 className="font-black text-stone-200 text-xs uppercase">Assinatura Acessível</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">Apenas R$ 49,90 por mês após o teste, sem taxas sobre suas vendas!</p>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Right Column: Interactive Login/Register Form */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-stone-850 mb-6 bg-stone-900/30 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setLoginError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'login'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Entrar no Sistema
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setLoginError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Criar Conta (Grátis)
              </button>
            </div>

            {activeTab === 'login' && (
              /* LOGIN COMPONENT */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">Seja Bem-vindo!</h3>
                  <p className="text-stone-400 text-[10px]">Acesse seu painel administrativo para gerenciar sua pizzaria.</p>
                </div>

                {loginError && (
                  <div className="bg-red-950/60 border border-red-900/50 p-3 rounded-xl text-red-200 text-[11px] leading-relaxed flex items-start gap-2 animate-fade-in">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">E-mail de Acesso</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="nome@pizzaria.com.br"
                        className="w-full bg-stone-900/80 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-3 pl-10 pr-4 font-semibold outline-none transition-all focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Senha Secreta</label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('recovery');
                          setRecoveryError('');
                          setRecoverySuccess(false);
                          setRecoveryStep('email');
                          setRecoveryEmail('');
                        }}
                        className="text-[10px] text-stone-400 hover:text-red-400 font-bold transition-all cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Sua senha administrativa"
                        className="w-full bg-stone-900/80 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-3 pl-10 pr-10 font-semibold outline-none transition-all focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-between cursor-pointer transform active:scale-98 text-xs uppercase tracking-wider mt-2"
                >
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {activeTab === 'register' && (
              /* REGISTRATION COMPONENT */
              <form onSubmit={handleRegister} className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">Cadastre Sua Pizzaria</h3>
                  <p className="text-stone-400 text-[10px]">Rápido, simples e você já inicia em modo de testes gratuito por 3 dias!</p>
                </div>

                {/* Doc Type Selector */}
                <div className="bg-stone-900/40 p-1.5 rounded-xl border border-stone-850 flex gap-2 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => { setRegIsPF(false); setRegDoc(''); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${!regIsPF ? 'bg-stone-800 text-white font-black' : 'text-stone-400 hover:text-stone-200'}`}
                  >
                    🏢 Pessoa Jurídica (PJ)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRegIsPF(true); setRegDoc(''); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${regIsPF ? 'bg-stone-800 text-white font-black' : 'text-stone-400 hover:text-stone-200'}`}
                  >
                    👤 Pessoa Física (PF)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Nome Comercial da Pizzaria *</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ex: Resenha Pizzas"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Nome do Proprietário / Responsável *</label>
                    <input
                      type="text"
                      required
                      value={regRepName}
                      onChange={(e) => setRegRepName(e.target.value)}
                      placeholder="Ex: Tiago"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">
                      {regIsPF ? 'CPF do Responsável *' : 'CNPJ da Empresa *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regDoc}
                      onChange={(e) => setRegDoc(e.target.value)}
                      placeholder={regIsPF ? '000.000.000-00' : '00.000.000/0001-00'}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">WhatsApp / Telefone de Contato *</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="(49) 99805-9293"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">E-mail de Acesso (Login) *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="contato@pizzaria.com.br"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Criar Senha de Acesso *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 caracteres"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="space-y-1 col-span-2">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Cidade *</label>
                    <input
                      type="text"
                      required
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Estado *</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none text-center uppercase transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Rua / Logradouro *</label>
                    <input
                      type="text"
                      required
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      placeholder="Ex: Av. XV de Novembro"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Número *</label>
                      <input
                        type="text"
                        required
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        placeholder="Ex: 100"
                        className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Complemento</label>
                      <input
                        type="text"
                        value={regComplement}
                        onChange={(e) => setRegComplement(e.target.value)}
                        placeholder="Ex: Sala 2"
                        className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Bairro *</label>
                    <input
                      type="text"
                      required
                      value={regBairro}
                      onChange={(e) => setRegBairro(e.target.value)}
                      placeholder="Ex: Centro"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-2.5 px-3 font-semibold outline-none transition-all"
                    />
                  </div>
                </div>

                {/* SaaS Plan Selector with Trial Highlight */}
                <div className="space-y-2 pt-2 border-t border-stone-900">
                  <label className="block font-bold text-stone-400 uppercase text-[9.5px] tracking-wider">Escolha Seu Plano (Pague apenas se gostar!)</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div 
                      onClick={() => setRegPlan('basic')}
                      className={`border p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between space-y-1 ${
                        regPlan === 'basic' 
                          ? 'border-red-600 bg-red-950/20' 
                          : 'border-stone-800 bg-stone-900/30 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black text-xs text-white">Plano Básico</span>
                        {regPlan === 'basic' && <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[8px] text-white">✓</div>}
                      </div>
                      <p className="text-[10px] text-stone-400">Completo para 1 terminal operacional.</p>
                      <div className="pt-1.5 flex items-baseline gap-1">
                        <span className="text-sm font-black text-white font-mono">R$ 49,90</span>
                        <span className="text-[9px] text-stone-500">/mês</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/85 px-1.5 py-0.5 rounded border border-emerald-900 mt-1 self-start">Testar 3 dias grátis!</span>
                    </div>

                    <div 
                      onClick={() => setRegPlan('pro')}
                      className={`border p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between space-y-1 ${
                        regPlan === 'pro' 
                          ? 'border-red-600 bg-red-950/20' 
                          : 'border-stone-800 bg-stone-900/30 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black text-xs text-white">Plano Multi-KDS</span>
                        {regPlan === 'pro' && <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[8px] text-white">✓</div>}
                      </div>
                      <p className="text-[10px] text-stone-400">Operação avançada com KDS ilimitado.</p>
                      <div className="pt-1.5 flex items-baseline gap-1">
                        <span className="text-sm font-black text-white font-mono">R$ 89,90</span>
                        <span className="text-[9px] text-stone-500">/mês</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/85 px-1.5 py-0.5 rounded border border-emerald-900 mt-1 self-start">Testar 3 dias grátis!</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98 text-xs uppercase tracking-wider mt-3"
                >
                  <Check className="w-4 h-4" />
                  Concluir Cadastro & Iniciar Teste Grátis
                </button>
              </form>
            )}

            {activeTab === 'recovery' && (
              /* RECOVERY COMPONENT */
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="space-y-1.5">
                  <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                    {recoveryStep === 'email' ? 'Recuperar Senha' : 'Redefinir Senha'}
                  </h3>
                  <p className="text-stone-400 text-[10px]">
                    {recoveryStep === 'email' 
                      ? 'Informe seu e-mail de acesso para recuperar sua senha.' 
                      : 'Crie uma nova senha de acesso segura para a sua pizzaria.'}
                  </p>
                </div>

                {recoveryError && (
                  <div className="bg-red-950/60 border border-red-900/50 p-3 rounded-xl text-red-200 text-[11px] leading-relaxed flex items-start gap-2 animate-fade-in">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                {recoverySuccess && (
                  <div className="bg-emerald-950/60 border border-emerald-900/50 p-3 rounded-xl text-emerald-200 text-[11px] leading-relaxed flex items-start gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">E-mail de recuperação enviado!</p>
                      <p className="text-[10px] text-stone-300 mt-0.5">Um e-mail de simulação com sua senha atual foi disparado no painel.</p>
                    </div>
                  </div>
                )}

                {recoveryStep === 'email' ? (
                  <form onSubmit={handleRecoveryRequest} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">E-mail Cadastrado</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                        <input
                          type="email"
                          required
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="nome@pizzaria.com.br"
                          className="w-full bg-stone-900/80 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-3 pl-10 pr-4 font-semibold outline-none transition-all focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setRecoveryError('');
                          setRecoverySuccess(false);
                          setSimulatedEmail(null);
                        }}
                        className="flex-1 bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold py-3 px-4 rounded-xl border border-stone-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]"
                      >
                        <ArrowLeft className="w-4 h-4 text-stone-400" />
                        <span>Voltar</span>
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-red-700 hover:bg-red-600 text-white font-black py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]"
                      >
                        <span>Enviar</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Nova Senha Secreta</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 caracteres"
                            className="w-full bg-stone-900/80 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-3 pl-10 pr-10 font-semibold outline-none transition-all focus:ring-1 focus:ring-red-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-300"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-stone-400 uppercase text-[9px] tracking-wider">Confirmar Nova Senha</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            placeholder="Digite novamente a nova senha"
                            className="w-full bg-stone-900/80 border border-stone-800 focus:border-red-500 text-white placeholder-stone-600 rounded-xl py-3 pl-10 pr-10 font-semibold outline-none transition-all focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRecoveryStep('email');
                          setRecoveryError('');
                          setRecoverySuccess(false);
                          setSimulatedEmail(null);
                        }}
                        className="flex-1 bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold py-3 px-4 rounded-xl border border-stone-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]"
                      >
                        <ArrowLeft className="w-4 h-4 text-stone-400" />
                        <span>Voltar</span>
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]"
                      >
                        <Check className="w-4 h-4 text-white" />
                        <span>Salvar Senha</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer / Domain tip */}
      <footer className="border-t border-stone-850 bg-stone-950/80 px-6 py-4 text-center text-[10px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Resengo SaaS © 2026 • Plataforma de Gestão Comercial para Pizzarias</span>
        <span className="bg-stone-900 px-3 py-1 rounded-full border border-stone-850 font-medium">
          💡 Dica de Domínio: Ao contratar seu domínio (ex: www.resengo.com.br), apontamos os servidores DNS diretamente para o container da Cloud Run para habilitar seu logotipo e certificado SSL de segurança automaticamente!
        </span>
      </footer>

    </div>
  );
}
