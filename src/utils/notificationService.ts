import { Tenant } from '../types';

export interface NotificationLog {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  body: string;
  status: 'pending' | 'success' | 'failed';
  errorMessage?: string;
  type: 'registration_alert' | 'test_alert';
}

/**
 * Gets the current Web3Forms Access Key from localStorage, defaulting to Tiago's new key.
 */
export function getNotificationKey(): string {
  return localStorage.getItem('saas_notification_key') || '51887fe6-c259-4fcd-b3b6-f752a5fe1a65';
}

/**
 * Saves the Web3Forms Access Key to localStorage.
 */
export function saveNotificationKey(key: string) {
  localStorage.setItem('saas_notification_key', key.trim());
}

/**
 * Gets the log of sent notifications.
 */
export function getNotificationLogs(): NotificationLog[] {
  try {
    const logs = localStorage.getItem('saas_notification_logs');
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Adds an entry to the notification logs.
 */
function addNotificationLog(log: Omit<NotificationLog, 'id' | 'timestamp'>) {
  const logs = getNotificationLogs();
  const newLog: NotificationLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('saas_notification_logs', JSON.stringify([newLog, ...logs].slice(0, 100)));
  
  // Dispatch a storage event so components can update in real-time
  window.dispatchEvent(new Event('storage'));
}

/**
 * Generates the email body for a new pizzeria registration.
 */
export function generateRegistrationEmailBody(tenant: Tenant): string {
  return `Olá Tiago!

Temos um novo parceiro cadastrado no Resengo SaaS!
O cadastro foi realizado na tela de registro público e já está operando em período de testes.

🍕 DADOS DA PIZZARIA:
========================================
- Nome Comercial: ${tenant.name}
- Slug do Site: ${tenant.slug}
- Tipo de Cadastro: ${tenant.isPF ? 'Pessoa Física (PF)' : 'Pessoa Jurídica (PJ)'}
- Documento (CPF/CNPJ): ${tenant.isPF ? (tenant.cpf || 'Não informado') : (tenant.cnpj || 'Não informado')}
- Nome do Responsável: ${tenant.representativeName || 'Não Informado'}
- WhatsApp / Telefone: ${tenant.phone}
- E-mail de Acesso: ${tenant.email}
- Cidade/UF: ${tenant.city || 'Não informada'}/${tenant.state || 'SC'}
- Bairro: ${tenant.bairro || 'Não informado'}
- Endereço Completo: ${tenant.address || 'Não informado'}

⭐ PLANO & EXPERIÊNCIA:
========================================
- Plano Escolhido: ${tenant.plan === 'pro' ? 'Profissional / Multi-KDS (R$ 89,90/mês)' : 'Básico (R$ 49,90/mês)'}
- Período de Testes: 3 Dias Grátis inclusos no ato do cadastro.

--------------------------------------------------------
Você pode gerenciar este parceiro (ativar, bloquear, ver histórico de faturamento e monitorar as vendas) diretamente através do seu Painel Master Administrativo.

Sucesso,
Plataforma Resengo SaaS`;
}

/**
 * Sends a real email notification via Web3Forms API.
 * Web3Forms is a free service that forwards submissions to the email registered with the access key.
 */
export async function sendEmailNotification(
  subject: string,
  bodyText: string,
  type: 'registration_alert' | 'test_alert',
  customKey?: string
): Promise<{ success: boolean; message: string }> {
  const key = (customKey !== undefined ? customKey : getNotificationKey()).trim();
  const recipient = 'tiago.lut@gmail.com';

  if (!key) {
    // Fallback: log locally and explain how to configure
    const errorMsg = 'Chave Web3Forms ausente. A notificação foi registrada no painel local, mas para receber em seu e-mail real, configure a chave de acesso no Painel Master.';
    addNotificationLog({
      recipient,
      subject,
      body: bodyText,
      status: 'failed',
      errorMessage: errorMsg,
      type,
    });
    return { success: false, message: errorMsg };
  }

  try {
    const payload = {
      access_key: key,
      subject: subject,
      from_name: 'Resengo SaaS Notificações',
      to_email: recipient,
      message: bodyText,
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      addNotificationLog({
        recipient,
        subject,
        body: bodyText,
        status: 'success',
        type,
      });
      return { success: true, message: 'Notificação enviada com sucesso para o seu e-mail!' };
    } else {
      const apiError = data.message || 'Erro desconhecido retornado pela API.';
      addNotificationLog({
        recipient,
        subject,
        body: bodyText,
        status: 'failed',
        errorMessage: apiError,
        type,
      });
      return { success: false, message: `Erro na API Web3Forms: ${apiError}` };
    }
  } catch (error: any) {
    const catchError = error.message || 'Falha de rede ao se conectar à API.';
    addNotificationLog({
      recipient,
      subject,
      body: bodyText,
      status: 'failed',
      errorMessage: catchError,
      type,
    });
    return { success: false, message: `Falha ao enviar e-mail: ${catchError}` };
  }
}
