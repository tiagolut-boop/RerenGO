/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Order, OrderItem, OrderStatus, OrderType, Product, PizzaSapor, PizzaBorder, PizzaSize, Customer, CustomerAddress } from '../types';
import { pizzaFlavors, pizzaBorders, products, pizzaSizes } from '../data/mockData';
import { Edit, Save, Plus, Trash2, Clock, MapPin, User, Phone, CheckCircle, HelpCircle, XCircle, FileText, ArrowRight, Printer } from 'lucide-react';

interface Bairro {
  id: string;
  name: string;
  fee: number;
}

const initialBairros: Bairro[] = [
  { id: 'b-1', name: 'Araucária', fee: 8.00 },
  { id: 'b-2', name: 'Área Industrial', fee: 10.00 },
  { id: 'b-3', name: 'Bates', fee: 12.00 },
  { id: 'b-4', name: 'Beatriz', fee: 8.00 },
  { id: 'b-5', name: 'Bela Vista', fee: 7.00 },
  { id: 'b-6', name: 'Bom Jesus', fee: 6.00 },
  { id: 'b-7', name: 'Boqueirão', fee: 8.00 },
  { id: 'b-8', name: 'Brusque', fee: 9.00 },
  { id: 'b-9', name: 'Caça e Tiro', fee: 8.00 },
  { id: 'b-10', name: 'Caravágio', fee: 7.00 },
  { id: 'b-11', name: 'Caroba', fee: 9.00 },
  { id: 'b-12', name: 'CDL', fee: 5.00 },
  { id: 'b-13', name: 'Centenário', fee: 6.00 },
  { id: 'b-14', name: 'Centro', fee: 5.00 },
  { id: 'b-15', name: 'Chapada', fee: 10.00 },
  { id: 'b-16', name: 'Cidade Alta', fee: 9.00 },
  { id: 'b-17', name: 'Conta Dinheiro', fee: 7.00 },
  { id: 'b-18', name: 'Copacabana', fee: 6.00 },
  { id: 'b-19', name: 'Coral', fee: 6.00 },
  { id: 'b-20', name: 'Cruz de Malta', fee: 8.00 },
  { id: 'b-21', name: 'Dom Daniel', fee: 7.00 },
  { id: 'b-22', name: 'Ferrovia', fee: 8.00 },
  { id: 'b-23', name: 'Frei Rogério', fee: 6.00 },
  { id: 'b-24', name: 'Gethal', fee: 8.00 },
  { id: 'b-25', name: 'Guadalupe', fee: 9.00 },
  { id: 'b-26', name: 'Guarujá', fee: 8.00 },
  { id: 'b-27', name: 'Habitação', fee: 7.00 },
  { id: 'b-28', name: 'Ipiranga', fee: 8.00 },
  { id: 'b-29', name: 'Jardim Celina', fee: 9.00 },
  { id: 'b-30', name: 'Jardim das Camélias', fee: 9.00 },
  { id: 'b-31', name: 'Jardim Panorâmico', fee: 8.00 },
  { id: 'b-32', name: 'Maria Luiza', fee: 9.00 },
  { id: 'b-33', name: 'Morro do Posto', fee: 6.00 },
  { id: 'b-34', name: 'Morro Grande', fee: 7.00 },
  { id: 'b-35', name: 'Nossa Senhora Aparecida', fee: 8.00 },
  { id: 'b-36', name: 'Passo Fundo', fee: 8.00 },
  { id: 'b-37', name: 'Penha', fee: 7.00 },
  { id: 'b-38', name: 'Petrópolis', fee: 7.00 },
  { id: 'b-39', name: 'Pisani', fee: 9.00 },
  { id: 'b-40', name: 'Ponte Grande', fee: 8.00 },
  { id: 'b-41', name: 'Popular', fee: 8.00 },
  { id: 'b-42', name: 'Promorar', fee: 9.00 },
  { id: 'b-43', name: 'Restinga Seca', fee: 11.00 },
  { id: 'b-44', name: 'Sagrado Coração de Jesus', fee: 7.00 },
  { id: 'b-45', name: 'Santa Cândida', fee: 8.00 },
  { id: 'b-46', name: 'Santa Catarina', fee: 7.00 },
  { id: 'b-47', name: 'Santa Clara', fee: 8.00 },
  { id: 'b-48', name: 'Santa Helena', fee: 6.00 },
  { id: 'b-49', name: 'Santa Maria', fee: 8.00 },
  { id: 'b-50', name: 'Santa Mônica', fee: 9.00 },
  { id: 'b-51', name: 'Santa Rita', fee: 7.00 },
  { id: 'b-52', name: 'Santo Antônio', fee: 8.00 },
  { id: 'b-53', name: 'São Cristóvão', fee: 7.00 },
  { id: 'b-54', name: 'São Francisco', fee: 8.00 },
  { id: 'b-55', name: 'São Luiz', fee: 8.00 },
  { id: 'b-56', name: 'São Miguel', fee: 9.00 },
  { id: 'b-57', name: 'São Paulo', fee: 8.00 },
  { id: 'b-58', name: 'São Pedro', fee: 8.00 },
  { id: 'b-59', name: 'São Sebastião', fee: 8.00 },
  { id: 'b-60', name: 'Triângulo', fee: 9.00 },
  { id: 'b-61', name: 'Tributo', fee: 9.00 },
  { id: 'b-62', name: 'Universitário', fee: 7.00 },
  { id: 'b-63', name: 'Várzea', fee: 8.00 },
  { id: 'b-64', name: 'Vila Comboni', fee: 8.00 },
  { id: 'b-65', name: 'Vila Maria', fee: 7.00 },
  { id: 'b-66', name: 'Vila Mariza', fee: 9.00 },
  { id: 'b-67', name: 'Vila Nova', fee: 7.00 },
  { id: 'b-68', name: 'Vista Alegre', fee: 9.00 }
];

// Helper functions for printing formatted pizzas and other items
const getFlavorsFromItem = (item: OrderItem) => {
  if (item.flavors && item.flavors.length > 0) {
    return item.flavors.map(f => f.name);
  }
  // Try to parse from name, e.g., "Pizza Grande (40cm) (2 Sabores: Calabresa / Portuguesa)"
  try {
    const colonIndex = item.name.indexOf(':');
    if (colonIndex !== -1) {
      const rest = item.name.substring(colonIndex + 1).trim();
      const lastParen = rest.lastIndexOf(')');
      const flavorsPart = lastParen !== -1 ? rest.substring(0, lastParen) : rest;
      return flavorsPart.split('/').map(f => f.trim());
    }
  } catch (err) {
    console.error('Erro ao processar sabores do nome da pizza', err);
  }
  return [];
};

const getIngredientsForFlavor = (flavorName: string): string => {
  const match = pizzaFlavors.find(f => f.name.toLowerCase() === flavorName.toLowerCase());
  return match?.ingredients || '';
};

const getPizzaSizeText = (item: OrderItem) => {
  if (item.size) {
    let sizeName = item.size.name.toUpperCase();
    if (!sizeName.startsWith('PIZZA')) {
      sizeName = 'PIZZA ' + sizeName;
    }
    return sizeName;
  }
  // Extract size from name, e.g. "Pizza Grande (40cm)"
  const firstParen = item.name.indexOf('(');
  let baseName = firstParen !== -1 ? item.name.substring(0, firstParen).trim() : item.name;
  baseName = baseName.toUpperCase();
  if (!baseName.startsWith('PIZZA')) {
    baseName = 'PIZZA ' + baseName;
  }
  return baseName;
};

const parseComboDetails = (name: string) => {
  // Try matching format: "COMBO X - Size Name (Pizzas: F1 / F2 • Broto Doce: Sweet • Refri: Soda)"
  const partsMatch = name.match(/^([^(]+)\((.+)\)$/);
  if (!partsMatch) {
    return {
      comboTitle: name.includes('(') ? name.split('(')[0].trim() : name,
      pizzaSize: '',
      flavors: [] as string[],
      sweetFlavor: '',
      drink: ''
    };
  }

  const comboHeader = partsMatch[1].trim(); // "COMBO X - Size Name"
  const comboBody = partsMatch[2].trim(); // "Pizzas: F1 / F2 • Broto Doce: Sweet • Refri: Soda"

  let comboTitle = comboHeader;
  let pizzaSize = '';
  if (comboHeader.includes(' - ')) {
    const parts = comboHeader.split(' - ');
    comboTitle = parts[0].trim();
    pizzaSize = parts[1].trim();
  } else {
    const matchCombo = comboHeader.match(/^(combo\s+\d+)/i);
    if (matchCombo) {
      comboTitle = matchCombo[1].trim();
      pizzaSize = comboHeader.replace(matchCombo[1], '').trim();
    }
  }

  let flavors: string[] = [];
  const pizzasMatch = comboBody.match(/Pizzas:\s*([^•]+)/i);
  if (pizzasMatch) {
    flavors = pizzasMatch[1].split('/').map(f => f.trim()).filter(Boolean);
  }

  let sweetFlavor = '';
  const sweetMatch = comboBody.match(/Broto\s+Doce:\s*([^•]+)/i);
  if (sweetMatch) {
    sweetFlavor = sweetMatch[1].trim();
  }

  let drink = '';
  const drinkMatch = comboBody.match(/Refri:\s*(.+)$/i);
  if (drinkMatch) {
    drink = drinkMatch[1].trim();
  }

  return {
    comboTitle,
    pizzaSize,
    flavors,
    sweetFlavor,
    drink
  };
};

interface SaaSOrdersPanelProps {
  orders: Order[];
  onUpdateOrders: (updated: Order[]) => void;
  currentTenantId: string;
  customers: Customer[];
  onUpdateCustomers: (updated: Customer[]) => void;
  preSelectedCustomer: Customer | null;
  onClearPreSelectedCustomer: () => void;
}

// Custom visual representing: 1. Pizza normal, 2. Pizza doce (com chocolate e morango), 3. Litro de refrigerante
function ComboVisual({ className = "h-14 w-auto flex justify-center items-center gap-1.5 mx-auto py-1" }: { className?: string }) {
  return (
    <div className={className}>
      {/* 1. Savory Pizza Slice SVG */}
      <svg className="w-9 h-9 drop-shadow-xs hover:scale-110 transition-transform duration-200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Crust */}
        <path d="M50 10 C62 10 74 13 84 18 C86 19 86 21 85 23 L53 88 C52 90 48 90 47 88 L15 23 C14 21 14 19 16 18 C26 13 38 10 50 10Z" fill="#D27D2D" stroke="#8B4513" strokeWidth="2" />
        <path d="M50 15 C59 15 68 17 76 21 L50 78 L24 21 C32 17 41 15 50 15Z" fill="#F4C430" />
        {/* Cheese details & Melt */}
        <path d="M50 15 C54 15 58 15.5 62 16.5 L50 45 L38 16.5 C42 15.5 46 15 50 15Z" fill="#FFA500" opacity="0.6" />
        {/* Pepperonis */}
        <circle cx="50" cy="30" r="6" fill="#B22222" stroke="#800000" strokeWidth="1" />
        <circle cx="38" cy="42" r="5" fill="#B22222" stroke="#800000" strokeWidth="1" />
        <circle cx="62" cy="42" r="5" fill="#B22222" stroke="#800000" strokeWidth="1" />
        <circle cx="50" cy="58" r="4.5" fill="#B22222" stroke="#800000" strokeWidth="1" />
        {/* Oregano/herbs specs */}
        <circle cx="45" cy="22" r="1" fill="#228B22" />
        <circle cx="55" cy="35" r="1" fill="#228B22" />
        <circle cx="42" cy="50" r="1" fill="#228B22" />
        <circle cx="58" cy="25" r="1" fill="#228B22" />
      </svg>

      {/* 2. Sweet Pizza Slice SVG (Chocolate + Strawberry) */}
      <svg className="w-9 h-9 drop-shadow-xs hover:scale-110 transition-transform duration-200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Crust */}
        <path d="M50 10 C62 10 74 13 84 18 C86 19 86 21 85 23 L53 88 C52 90 48 90 47 88 L15 23 C14 21 14 19 16 18 C26 13 38 10 50 10Z" fill="#8B4513" stroke="#4A2711" strokeWidth="2" />
        {/* Chocolate base (dark brown) */}
        <path d="M50 15 C59 15 68 17 76 21 L50 78 L24 21 C32 17 41 15 50 15Z" fill="#4B2511" />
        
        {/* Chocolate Syrup Stripes / Drizzle */}
        <path d="M30 25 Q50 35 70 25" stroke="#2D1408" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M35 38 Q50 48 65 38" stroke="#2D1408" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M42 55 Q50 62 58 55" stroke="#2D1408" strokeWidth="2" strokeLinecap="round" />

        {/* Strawberries (Heart/V-shaped red strawberries with green leaves and yellow seeds) */}
        {/* Straw 1 */}
        <g transform="translate(50, 30)">
          <path d="M0 -6 C-3 -6 -5 -3 -5 0 C-5 4 0 8 0 8 C0 8 5 4 5 0 C5 -3 3 -6 0 -6Z" fill="#DC143C" />
          {/* Strawberry leaves */}
          <path d="M-3 -6 L0 -3 L3 -6 L0 -7 Z" fill="#228B22" />
          {/* Seeds */}
          <circle cx="-2" cy="-1" r="0.4" fill="#FFFF00" />
          <circle cx="2" cy="-1" r="0.4" fill="#FFFF00" />
          <circle cx="0" cy="2" r="0.4" fill="#FFFF00" />
        </g>

        {/* Straw 2 */}
        <g transform="translate(38, 45) rotate(-15)">
          <path d="M0 -5 C-2.5 -5 -4 -2.5 -4 0 C-4 3 0 6 0 6 C0 6 4 3 4 0 C4 -2.5 2.5 -5 0 -5Z" fill="#DC143C" />
          <path d="M-2.5 -5 L0 -2 L2.5 -5 L0 -6 Z" fill="#228B22" />
          <circle cx="-1.5" cy="-0.5" r="0.4" fill="#FFFF00" />
          <circle cx="1.5" cy="-0.5" r="0.4" fill="#FFFF00" />
          <circle cx="0" cy="2" r="0.4" fill="#FFFF00" />
        </g>

        {/* Straw 3 */}
        <g transform="translate(62, 45) rotate(15)">
          <path d="M0 -5 C-2.5 -5 -4 -2.5 -4 0 C-4 3 0 6 0 6 C0 6 4 3 4 0 C4 -2.5 2.5 -5 0 -5Z" fill="#DC143C" />
          <path d="M-2.5 -5 L0 -2 L2.5 -5 L0 -6 Z" fill="#228B22" />
          <circle cx="-1.5" cy="-0.5" r="0.4" fill="#FFFF00" />
          <circle cx="1.5" cy="-0.5" r="0.4" fill="#FFFF00" />
          <circle cx="0" cy="2" r="0.4" fill="#FFFF00" />
        </g>

        {/* White Chocolate sprinkles / granulated */}
        <rect x="44" y="20" width="3" height="1" fill="#FFFFFF" transform="rotate(12 44 20)" />
        <rect x="52" y="24" width="3" height="1" fill="#FFFFFF" transform="rotate(-35 52 24)" />
        <rect x="35" y="32" width="3" height="1" fill="#FFFFFF" transform="rotate(45 35 32)" />
        <rect x="58" y="36" width="3" height="1" fill="#FFFFFF" transform="rotate(-15 58 36)" />
        <rect x="48" y="55" width="2" height="0.8" fill="#FFFFFF" transform="rotate(30 48 55)" />
      </svg>

      {/* 3. 1L Soda Bottle SVG (with label and cap) */}
      <svg className="w-8 h-9 drop-shadow-xs hover:scale-110 transition-transform duration-200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cap */}
        <rect x="42" y="8" width="16" height="6" rx="1" fill="#FF0000" stroke="#B22222" strokeWidth="1" />
        {/* Neck of bottle */}
        <path d="M45 14 L55 14 L57 30 L43 30 Z" fill="#E2F0F9" stroke="#A4C2DB" strokeWidth="1.5" opacity="0.8" />
        <path d="M46 14 H54 V30 H46 Z" fill="#3D1D0B" /> {/* Liquid inside neck */}

        {/* Bottle body (curved soda bottle shape) */}
        <path d="M43 30 Q33 45 36 60 L38 85 C38 88 40 90 43 90 L57 90 C60 90 62 88 62 85 L64 60 Q67 45 57 30 Z" fill="#E2F0F9" stroke="#A4C2DB" strokeWidth="1.5" opacity="0.8" />
        {/* Liquid level */}
        <path d="M38 38 Q50 39 62 38 L62 85 C62 87 60 88 57 88 L43 88 C40 88 38 87 38 85 Z" fill="#2E1609" />

        {/* Soda Label */}
        <path d="M35.5 52 Q50 54 64.5 52 L63.5 68 Q50 70 36.5 68 Z" fill="#FF0000" />
        {/* White brand wave line on label */}
        <path d="M36.5 58 Q45 64 55 56 Q60 54 63.5 58" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* "1L" Text on Label */}
        <text x="50" y="65" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">1L</text>
        
        {/* Reflections */}
        <path d="M40 45 L41 80" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
}

export default function SaaSOrdersPanel({ 
  orders, 
  onUpdateOrders, 
  currentTenantId,
  customers,
  onUpdateCustomers,
  preSelectedCustomer,
  onClearPreSelectedCustomer
}: SaaSOrdersPanelProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Persisted neighborhoods
  const [bairros, setBairros] = useState<Bairro[]>(() => {
    const saved = localStorage.getItem('saas_bairros');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialBairros;
  });

  const saveBairrosToStorage = (updatedList: Bairro[]) => {
    setBairros(updatedList);
    localStorage.setItem('saas_bairros', JSON.stringify(updatedList));
  };

  const saveCustomersToStorage = (updatedList: Customer[]) => {
    onUpdateCustomers(updatedList);
  };

  // Audio Feedback for Special Flavors
  const playSpecialAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Dual-frequency beep (sweet & distinct)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc2.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.15); // B5
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio Context block or error:", e);
    }
  };

  // Safe and Robust Print Trigger function
  const printReceiptDirectly = (orderToPrint: Order, type: 'Cozinha' | 'Completo', width: '80mm' | '58mm') => {
    try {
      // First try opening a specialized clean printing window
      const widthPx = width === '58mm' ? '240px' : '320px';
      const printWindow = window.open('', '_blank', 'width=500,height=700,status=no,toolbar=no,menubar=no');
      
      if (printWindow) {
        const itemsHtml = orderToPrint.items.map(item => {
          const isCombo = item.isCombo || item.name.toLowerCase().includes('combo');
          if (isCombo) {
            const parsed = parseComboDetails(item.name);
            const isCocaDrink = parsed.drink.toLowerCase().includes('coca');

            const comboFractionLabel = parsed.flavors.length === 1 ? '1 SABOR' : `${parsed.flavors.length} SABORES`;
            const comboFractionMultiplier = parsed.flavors.length === 1 ? '' : `1/${parsed.flavors.length}`;
            const comboFlavorMarker = parsed.flavors.length === 1 ? '' : `${comboFractionMultiplier} `;

            const flavorsText = parsed.flavors.map(fl => {
              const ingredients = getIngredientsForFlavor(fl);
              return `
                <div style="margin: 2px 0 4px 6px; line-height: 1.2;">
                  • <span style="font-weight: bold;">${comboFlavorMarker}${fl.toUpperCase()}</span>
                  ${ingredients ? `<div style="font-size: 8.5px; color: #444; font-style: italic; padding-left: 10px; line-height: 1.1;">(${ingredients.toLowerCase()})</div>` : ''}
                </div>
              `;
            }).join('');

            const sweetFlavorHtml = `
              <div style="font-weight: bold; font-size: 11px; margin-top: 6px; border-left: 3px solid #000; padding-left: 6px; background: #f0f0f0; text-transform: uppercase;">
                🍓 BROTINHO: ${parsed.sweetFlavor.toUpperCase()}
              </div>
            `;

            const drinkHtml = isCocaDrink
              ? `
                <div style="font-weight: bold; font-size: 11px; margin-top: 4px; border-left: 3px solid #000; padding-left: 6px; background: #f0f0f0; text-transform: uppercase;">
                  🥤 BEBIDA: ${parsed.drink.toUpperCase()}
                </div>
              `
              : `
                <div style="font-weight: bold; font-size: 11px; margin-top: 4px; padding-left: 6px; text-transform: uppercase;">
                  • BEBIDA: ${parsed.drink.toUpperCase()}
                </div>
              `;

            const extraHtml = item.cocaDifference && item.cocaDifference > 0
              ? `<div style="font-size: 10px; font-weight: bold; padding-left: 6px; margin-top: 2px;">• DIFERENÇA COCA-COLA: + R$ ${item.cocaDifference.toFixed(2)}</div>`
              : '';

            return `
              <div style="border-bottom: 1px dashed #888; padding: 4px 0; margin-bottom: 4px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
                  <span>${item.quantity}x ${parsed.comboTitle.toUpperCase()} - ${parsed.pizzaSize.toUpperCase()}</span>
                  ${type === 'Completo' ? `<span>R$ ${(item.price * item.quantity).toFixed(2)}</span>` : ''}
                </div>
                <div style="font-size: 10px; color: #111; padding-left: 6px; margin: 3px 0;">
                  <strong style="text-transform: uppercase;">- ${comboFractionLabel}</strong>
                  ${flavorsText}
                </div>
                ${sweetFlavorHtml}
                ${drinkHtml}
                ${extraHtml}
                ${item.notes ? `<div style="font-size: 10px; font-weight: bold; margin-top: 6px; border-left: 3px solid #000; padding-left: 6px; background: #f0f0f0;">OBS: ${item.notes.toUpperCase()}</div>` : ''}
              </div>
            `;
          }

          const flavorsArray = item.flavors && item.flavors.length > 0
            ? item.flavors.map(f => ({ name: f.name, isSpecial: f.isSpecial, ingredients: f.ingredients || getIngredientsForFlavor(f.name) }))
            : getFlavorsFromItem(item).map(name => ({ name, isSpecial: false, ingredients: getIngredientsForFlavor(name) }));

          const flavorsText = flavorsArray.length > 0
            ? `<div style="font-size: 10px; color: #111; padding-left: 6px; margin: 3px 0;">
                <strong style="text-transform: uppercase;">Sabores:</strong>
                ${flavorsArray.map(f => `
                  <div style="margin: 2px 0 4px 6px; line-height: 1.2;">
                    • <span style="font-weight: bold;">${f.name.toUpperCase()}</span>${f.isSpecial ? ' <span style="font-size: 8px; color: #555;">(ESPECIAL)</span>' : ''}
                    ${f.ingredients ? `<div style="font-size: 8.5px; color: #444; font-style: italic; padding-left: 10px; line-height: 1.1;">(${f.ingredients.toLowerCase()})</div>` : ''}
                  </div>
                `).join('')}
               </div>`
            : '';
          const borderText = item.border
            ? `<div style="font-size: 10px; color: #333; padding-left: 6px; margin: 2px 0;"><strong>Borda:</strong> ${item.border.name}</div>`
            : '';
          
          // Render sweet flavor details if exist
          const comboDetailsHtml = item.productId && (item.productId.startsWith('p-113') || item.productId.startsWith('p-114') || item.productId.startsWith('p-115'))
            ? `<div style="font-size: 9px; color: #444; padding-left: 8px; margin-top: 2px; font-style: italic; border-left: 1px solid #ccc;">
                • Pizza: ${flavorsText ? 'Principal Configurada' : 'Padrão'}
               </div>`
            : '';

          return `
            <div style="border-bottom: 1px dashed #888; padding: 4px 0; margin-bottom: 4px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
                <span>${item.quantity}x ${item.name}</span>
                ${type === 'Completo' ? `<span>R$ ${(item.price * item.quantity).toFixed(2)}</span>` : ''}
              </div>
              ${flavorsText}
              ${borderText}
              ${comboDetailsHtml}
              ${item.notes ? `<div style="font-size: 9px; color: #555; padding-left: 6px; font-style: italic;">Obs: ${item.notes}</div>` : ''}
            </div>
          `;
        }).join('');

        const totalSection = type === 'Completo' ? `
          <div style="margin-top: 8px; border-top: 1px solid #000; padding-top: 6px; font-size: 11px; font-family: inherit;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Subtotal:</span>
              <span>R$ ${orderToPrint.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            ${orderToPrint.deliveryFee > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Taxa de Entrega:</span>
              <span>R$ ${orderToPrint.deliveryFee.toFixed(2)}</span>
            </div>` : ''}
            ${orderToPrint.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #d00;">
              <span>Desconto:</span>
              <span>- R$ ${orderToPrint.discount.toFixed(2)}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; margin-top: 4px; border-top: 1px dashed #000; padding-top: 6px;">
              <span>TOTAL PEDIDO:</span>
              <span>R$ ${orderToPrint.total.toFixed(2)}</span>
            </div>
          </div>
        ` : '';

        const notesHtml = orderToPrint.notes ? `
          <div style="margin-top: 8px; border: 1.5px solid #000; padding: 6px; font-size: 10px; font-family: inherit;">
            <strong>Observações do Pedido:</strong>
            <div style="font-weight: bold; margin-top: 2px; text-transform: uppercase;">${orderToPrint.notes.toUpperCase()}</div>
          </div>
        ` : '';

        const clientAddressHtml = orderToPrint.customerAddress ? `
          <p style="margin: 2px 0;"><strong>Endereço:</strong> ${orderToPrint.customerAddress}, ${orderToPrint.customerBairro || 'N/I'}, ${orderToPrint.customerCity || 'Lages'}</p>
        ` : '';

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Imprimir Cupom #${orderToPrint.orderNumber}</title>
              <style>
                body {
                  font-family: 'Courier New', Courier, monospace;
                  width: ${widthPx};
                  margin: 0 auto;
                  padding: 10px;
                  background: #fff;
                  color: #000;
                  font-size: 11px;
                  line-height: 1.25;
                }
                h2 {
                  text-align: center;
                  margin: 0 0 4px 0;
                  font-size: 14px;
                  font-weight: bold;
                }
                p {
                  margin: 2px 0;
                }
                .divider {
                  border-top: 1px dashed #000;
                  margin: 6px 0;
                }
                .text-center {
                  text-align: center;
                }
                @media print {
                  body { width: 100%; margin: 0; padding: 0; }
                  @page { margin: 0; }
                }
              </style>
            </head>
            <body>
              <h2>RESENHA PIZZARIA</h2>
              <p class="text-center" style="font-size: 9px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">
                ${type === 'Cozinha' ? '🍳 TICKET DE COZINHA (PRODUÇÃO) 🍳' : '💵 CUPOM DE PEDIDO (BALCÃO) 💵'}
              </p>
              <div class="divider"></div>
              <p><strong>Pedido:</strong> ${orderToPrint.orderNumber}</p>
              <p><strong>Data/Hora:</strong> ${new Date(orderToPrint.createdAt).toLocaleString('pt-BR')}</p>
              <p><strong>Serviço:</strong> ${orderToPrint.type === 'Delivery' ? '🏍️ ENTREGA' : orderToPrint.type === 'Retirada' ? '🥡 RETIRADA' : '🏪 BALCÃO'}</p>
              <p><strong>Cliente:</strong> ${orderToPrint.customerName}</p>
              ${type === 'Completo' ? `
                <p><strong>Telefone:</strong> ${orderToPrint.customerPhone}</p>
                ${clientAddressHtml}
                <p><strong>Pagamento:</strong> ${orderToPrint.paymentMethod || 'Pix'}</p>
              ` : ''}
              <div class="divider"></div>
              <div style="font-weight: bold; margin-bottom: 4px;">ITENS DO PEDIDO:</div>
              ${itemsHtml}
              ${totalSection}
              ${notesHtml}
              <div class="divider"></div>
              <div class="text-center" style="font-size: 9px; margin-top: 12px; color: #444;">
                <p>Obrigado pela preferência!</p>
                <p style="font-size: 8px; color: #777;">Sistemas Resenha</p>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 800);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        // Fallback directly to normal print if window.open was completely blocked
        window.print();
      }
    } catch (err) {
      console.warn("Printing via window popup failed, falling back to window.print", err);
      window.print();
    }
  };

  // Neighborhood Editor UI Toggle
  const [isBairrosActive, setIsBairrosActive] = useState(false);
  const [searchBairroQuery, setSearchBairroQuery] = useState('');
  const [newBairroName, setNewBairroName] = useState('');
  const [newBairroFee, setNewBairroFee] = useState<number>(8.00);
  const [editingBairroId, setEditingBairroId] = useState<string | null>(null);
  const [editingBairroFee, setEditingBairroFee] = useState<number>(0);

  // POS (Point of Sale) State
  const [isPOSActive, setIsPOSActive] = useState(false);
  const [posStep, setPosStep] = useState<'customer' | 'items'>('customer');
  const [selectedPOSCustomer, setSelectedPOSCustomer] = useState<Customer | null>(null);
  const [posSearchCustomer, setPosSearchCustomer] = useState('');
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  // New customer registration fields
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustStreet, setNewCustStreet] = useState('');
  const [newCustNumber, setNewCustNumber] = useState('');
  const [newCustComplement, setNewCustComplement] = useState('');
  const [newCustBairro, setNewCustBairro] = useState('');
  const [newCustCity, setNewCustCity] = useState('Lages');

  // POS Cart & Order details
  const [posCart, setPosCart] = useState<OrderItem[]>([]);
  const [posType, setPosType] = useState<OrderType>('Balcão');
  const [posDeliveryFee, setPosDeliveryFee] = useState<number>(0);
  const [posPayment, setPosPayment] = useState<'Cartão' | 'Pix' | 'Dinheiro'>('Pix');
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posNotes, setPosNotes] = useState('');

  // POS menu navigation
  const [posCategory, setPosCategory] = useState<'Pizzas' | 'Combos' | 'Bebidas' | 'Calzones'>('Pizzas');

  // Active customizers
  const [posPizzaSize, setPosPizzaSize] = useState<PizzaSize | null>(null);
  const [posIsCalzone, setPosIsCalzone] = useState(false);
  const [posCalzoneProduct, setPosCalzoneProduct] = useState<Product | null>(null);
  const [posPizzaFraction, setPosPizzaFraction] = useState<1 | 2 | 3 | 4>(1);
  const [posPizzaFlavors, setPosPizzaFlavors] = useState<PizzaSapor[]>([]);
  const [posPizzaBorder, setPosPizzaBorder] = useState<PizzaBorder | undefined>(undefined);
  const [posPizzaNotes, setPosPizzaNotes] = useState('');

  // Sabor selection search query
  const [flavorSearchQueries, setFlavorSearchQueries] = useState<string[]>(['', '', '', '']);

  // Combo customizer
  const [posComboProduct, setPosComboProduct] = useState<Product | null>(null);
  const [posComboFlavors, setPosComboFlavors] = useState<PizzaSapor[]>([]);
  const [posComboSweetFlavor, setPosComboSweetFlavor] = useState<PizzaSapor | null>(null);
  const [posComboDrink, setPosComboDrink] = useState<Product | null>(null);
  const [posComboPrice, setPosComboPrice] = useState<number>(0);
  const [posComboCocaDiff, setPosComboCocaDiff] = useState<number | ''>('');

  // Multiple address selection states for POS
  const [selectedPOSAddress, setSelectedPOSAddress] = useState<CustomerAddress | null>(null);
  const [isAddingPOSAddress, setIsAddingPOSAddress] = useState(false);
  const [posNewAddrName, setPosNewAddrName] = useState('');
  const [posNewAddrStreet, setPosNewAddrStreet] = useState('');
  const [posNewAddrNumber, setPosNewAddrNumber] = useState('');
  const [posNewAddrComplement, setPosNewAddrComplement] = useState('');
  const [posNewAddrBairro, setPosNewAddrBairro] = useState('');
  const [posNewAddrCity, setPosNewAddrCity] = useState('Lages');
  const [posNewAddrCep, setPosNewAddrCep] = useState('');
  const [posNewAddrReference, setPosNewAddrReference] = useState('');
  const [posNewAddrDeliveryFee, setPosNewAddrDeliveryFee] = useState<number | ''>('');

  const getCustomerAddresses = (customer: Customer | null): CustomerAddress[] => {
    if (!customer) return [];
    if (customer.addresses && customer.addresses.length > 0) {
      return customer.addresses;
    }
    if (customer.address) {
      return [{
        id: 'addr-principal',
        name: 'Principal',
        street: customer.address.split(',')[0] || customer.address,
        number: customer.address.split(',')[1]?.trim() || '',
        bairro: customer.bairro || 'Centro',
        city: customer.city || 'Lages'
      }];
    }
    return [];
  };

  const selectPOSCustomerAndDefaultAddress = (c: Customer, serviceType: OrderType) => {
    setSelectedPOSCustomer(c);
    const addrs = c.addresses || [];
    if (addrs.length > 0) {
      setSelectedPOSAddress(addrs[0]);
      if (serviceType === 'Delivery') {
        if (addrs[0].deliveryFee !== undefined) {
          setPosDeliveryFee(addrs[0].deliveryFee);
        } else if (addrs[0].bairro) {
          const match = bairros.find(b => b.name.toLowerCase() === addrs[0].bairro.toLowerCase());
          setPosDeliveryFee(match ? match.fee : 8.0);
        } else {
          setPosDeliveryFee(8.0);
        }
      }
    } else if (c.address) {
      const principalAddr: CustomerAddress = {
        id: 'addr-principal',
        name: 'Principal',
        street: c.address.split(',')[0] || c.address,
        number: c.address.split(',')[1]?.trim() || '',
        bairro: c.bairro || 'Centro',
        city: c.city || 'Lages'
      };
      setSelectedPOSAddress(principalAddr);
      if (serviceType === 'Delivery') {
        if (c.bairro) {
          const match = bairros.find(b => b.name.toLowerCase() === c.bairro.toLowerCase());
          setPosDeliveryFee(match ? match.fee : 8.0);
        } else {
          setPosDeliveryFee(8.0);
        }
      }
    } else {
      setSelectedPOSAddress(null);
    }
  };

  // Triggered when a customer is selected for a new order from the CRM tab
  React.useEffect(() => {
    if (preSelectedCustomer) {
      setIsPOSActive(true);
      setPosStep('customer'); // Let them confirm/select address in Step 1
      selectPOSCustomerAndDefaultAddress(preSelectedCustomer, posType);
      onClearPreSelectedCustomer();
    }
  }, [preSelectedCustomer, bairros, posType]);

  // Filter queries for combo selections
  const [comboSearchQuery1, setComboSearchQuery1] = useState('');
  const [comboSearchQuery2, setComboSearchQuery2] = useState('');
  const [comboSearchQuery3, setComboSearchQuery3] = useState('');
  const [comboSearchQuery4, setComboSearchQuery4] = useState('');
  const [comboSearchQuerySweet, setComboSearchQuerySweet] = useState('');
  const [comboSearchQueryDrink, setComboSearchQueryDrink] = useState('');

  // Auto-calculate combo price including special flavor surcharges
  React.useEffect(() => {
    if (posComboProduct) {
      const basePrice = posComboProduct.price;
      const flavorsSurcharge = posComboFlavors.reduce((sum, f) => sum + (f && f.isSpecial ? f.additionalPrice : 0), 0);
      const sweetSurcharge = posComboSweetFlavor && posComboSweetFlavor.isSpecial ? posComboSweetFlavor.additionalPrice : 0;
      setPosComboPrice(basePrice + flavorsSurcharge + sweetSurcharge);
    }
  }, [posComboProduct, posComboFlavors, posComboSweetFlavor]);

  // Print & Receipt Settings
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [printPaperWidth, setPrintPaperWidth] = useState<'80mm' | '58mm'>('80mm');
  const [printType, setPrintType] = useState<'Cozinha' | 'Completo'>('Completo');
  const [lastFinalizedOrder, setLastFinalizedOrder] = useState<Order | null>(null);

  // Filter sweet/savory flavors
  const sweetFlavorsList = pizzaFlavors.filter(f => f.id.startsWith('f-res-') && parseInt(f.id.replace('f-res-', '')) >= 44);
  const savoryFlavorsList = pizzaFlavors.filter(f => !f.id.startsWith('f-res-') || parseInt(f.id.replace('f-res-', '')) < 44);

  // Register Customer validation
  const handleRegisterCustomer = (newCust: Omit<Customer, 'id'>) => {
    const nameTrimmed = newCust.name.trim().toLowerCase();
    const phoneTrimmed = newCust.phone.replace(/\D/g, '');

    const tenantCustomers = customers.filter(c => c.tenantId === currentTenantId);
    const phoneExists = tenantCustomers.some(c => c.phone.replace(/\D/g, '') === phoneTrimmed);
    const nameExists = tenantCustomers.some(c => c.name.trim().toLowerCase() === nameTrimmed);

    if (phoneExists) {
      alert(`⚠️ ATENÇÃO: O telefone "${newCust.phone}" já pertence a outro cadastro! Não é permitido cadastrar o mesmo telefone.`);
      return false;
    }

    if (nameExists) {
      alert(`⚠️ AVISO: Já existe um cliente com o nome "${newCust.name}"!`);
    }

    const parsedAddr: CustomerAddress[] = [];
    if (newCust.address) {
      parsedAddr.push({
        id: `addr-${Date.now()}`,
        name: 'Principal',
        street: newCust.address.split(',')[0] || newCust.address,
        number: newCust.address.split(',')[1]?.trim() || '',
        bairro: newCust.bairro || 'Centro',
        city: newCust.city || 'Lages'
      });
    }

    const created: Customer = {
      id: `c-${Date.now()}`,
      ...newCust,
      addresses: parsedAddr
    };

    const updatedList = [...customers, created];
    saveCustomersToStorage(updatedList);
    selectPOSCustomerAndDefaultAddress(created, posType);
    
    return true;
  };

  // Add Bairro
  const handleAddBairro = () => {
    if (!newBairroName.trim()) {
      alert("⚠️ Digite o nome do bairro!");
      return;
    }
    const alreadyExists = bairros.some(b => b.name.toLowerCase() === newBairroName.trim().toLowerCase());
    if (alreadyExists) {
      alert("⚠️ Esse bairro já está cadastrado!");
      return;
    }
    const updated = [
      ...bairros,
      { id: `b-user-${Date.now()}`, name: newBairroName.trim(), fee: newBairroFee }
    ];
    saveBairrosToStorage(updated);
    setNewBairroName('');
    setNewBairroFee(8.00);
  };

  // Edit Bairro Fee
  const handleSaveBairroFee = (id: string, fee: number) => {
    const updated = bairros.map(b => b.id === id ? { ...b, fee } : b);
    saveBairrosToStorage(updated);
    setEditingBairroId(null);
  };

  // Delete Bairro
  const handleDeleteBairro = (id: string) => {
    if (confirm("⚠️ Deseja realmente excluir este bairro?")) {
      const updated = bairros.filter(b => b.id !== id);
      saveBairrosToStorage(updated);
    }
  };

  // Set POS Type and auto fill delivery fee
  const handleSetPosType = (type: OrderType) => {
    setPosType(type);
    if (type === 'Delivery') {
      if (selectedPOSCustomer && selectedPOSCustomer.bairro) {
        const match = bairros.find(b => b.name.toLowerCase() === selectedPOSCustomer.bairro.toLowerCase());
        setPosDeliveryFee(match ? match.fee : 8.0);
      } else {
        setPosDeliveryFee(8.0);
      }
    } else {
      setPosDeliveryFee(0);
    }
  };

  // Finalize POS Order
  const handleFinalizePOSOrder = () => {
    if (posCart.length === 0) {
      alert("⚠️ Carrinho vazio! Adicione algum item para finalizar.");
      return;
    }

    const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = Math.max(0, subtotal + posDeliveryFee - posDiscount);

    const nextNum = orders.length + 101;
    const orderNumber = `#POS-${nextNum}`;

    const custName = selectedPOSCustomer ? selectedPOSCustomer.name : 'Consumidor Geral';
    const custPhone = selectedPOSCustomer ? selectedPOSCustomer.phone : '(00) 00000-0000';

    const getFormattedAddress = (): string | undefined => {
      if (posType !== 'Delivery') return undefined;
      if (selectedPOSAddress) {
        let addrStr = `${selectedPOSAddress.street}, ${selectedPOSAddress.number}`;
        if (selectedPOSAddress.complement) {
          addrStr += ` - ${selectedPOSAddress.complement}`;
        }
        if (selectedPOSAddress.reference) {
          addrStr += ` (Ref: ${selectedPOSAddress.reference})`;
        }
        return addrStr;
      }
      return selectedPOSCustomer ? selectedPOSCustomer.address : undefined;
    };

    const getBairro = (): string | undefined => {
      if (posType !== 'Delivery') return undefined;
      return selectedPOSAddress ? selectedPOSAddress.bairro : (selectedPOSCustomer ? selectedPOSCustomer.bairro : undefined);
    };

    const getCity = (): string => {
      if (posType !== 'Delivery') return 'Lages';
      return selectedPOSAddress ? selectedPOSAddress.city : (selectedPOSCustomer ? selectedPOSCustomer.city || 'Lages' : 'Lages');
    };

    const newOrder: Order = {
      id: `ord-pos-${Date.now()}`,
      tenantId: currentTenantId,
      orderNumber,
      status: 'Confirmado', // directly confirmed for counter
      type: posType,
      customerName: custName,
      customerPhone: custPhone,
      customerAddress: getFormattedAddress(),
      customerBairro: getBairro(),
      customerCity: getCity(),
      items: posCart,
      deliveryFee: posDeliveryFee,
      discount: posDiscount,
      total: finalTotal,
      paymentMethod: posPayment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: posNotes,
      history: [
        {
          id: `h-pos-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Pedido Criado',
          user: 'Atendente de Balcão',
          details: `Iniciado diretamente na Frente de Caixa. Pagamento via ${posPayment}.`
        }
      ]
    };

    onUpdateOrders([newOrder, ...orders]);

    // Play notification sound
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn(e);
    }

    // Trigger visual notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(`🔔 Novo Pedido Balcão (${orderNumber})`, {
        body: `Cliente: ${newOrder.customerName} • Total: R$ ${finalTotal.toFixed(2)}`,
        icon: 'https://cdn-icons-png.flaticon.com/512/3595/3595454.png',
      });
    }

    // Reset fields
    setPosCart([]);
    setSelectedPOSCustomer(null);
    setSelectedPOSAddress(null);
    setIsAddingPOSAddress(false);
    setPosDiscount(0);
    setPosNotes('');
    setIsPOSActive(false);
    setLastFinalizedOrder(newOrder);
  };

  // Filter orders by Tenant
  const tenantOrders = orders.filter((o) => o.tenantId === currentTenantId);

  // Quick Filter State
  type QuickFilter = 'Todos' | 'Pendente' | 'Em Produção' | 'Saiu p/ Entrega' | 'Finalizado';
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('Todos');

  const matchesFilter = (order: Order, filter: QuickFilter) => {
    switch (filter) {
      case 'Todos':
        return true;
      case 'Pendente':
        return order.status === 'Rascunho' || order.status === 'Confirmado';
      case 'Em Produção':
        return order.status === 'Em Produção' || order.status === 'No Forno';
      case 'Saiu p/ Entrega':
        return order.status === 'Pronto' || order.status === 'Saiu para Entrega';
      case 'Finalizado':
        return order.status === 'Entregue' || order.status === 'Cancelado';
      default:
        return true;
    }
  };

  const filteredOrders = tenantOrders.filter((o) => matchesFilter(o, activeFilter));

  // Edit State
  const [editType, setEditType] = useState<OrderType>('Delivery');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerAddress, setEditCustomerAddress] = useState('');
  const [editCustomerBairro, setEditCustomerBairro] = useState('');
  const [editCustomerCity, setEditCustomerCity] = useState('');
  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editNotes, setEditNotes] = useState('');

  // Pizza builder state inside editor
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(pizzaSizes[4]); // default to Gigante 45cm
  const [selectedFraction, setSelectedFraction] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFlavors, setSelectedFlavors] = useState<PizzaSapor[]>([pizzaFlavors[0]]);
  const [selectedBorder, setSelectedBorder] = useState<PizzaBorder | undefined>(pizzaBorders[0]);

  // Handle open editor
  const startEditing = (order: Order) => {
    setSelectedOrder(order);
    setIsEditing(true);
    setEditType(order.type);
    setEditCustomerName(order.customerName);
    setEditCustomerPhone(order.customerPhone);
    setEditCustomerAddress(order.customerAddress || '');
    setEditCustomerBairro(order.customerBairro || '');
    setEditCustomerCity(order.customerCity || '');
    setEditItems([...order.items]);
    setEditDiscount(order.discount);
    setEditNotes(order.notes || '');
  };

  // Calculate customized pizza price
  const calculatePizzaPrice = (fraction: number, flavors: PizzaSapor[], border?: PizzaBorder, size = selectedSize): number => {
    const basePrice = size ? size.basePrice : 49.90; // Standard base price for custom pizzas
    let premiumAdicional = 0;

    // Multiplicador baseado na divisão e capacidade máxima de sabores do tamanho
    const maxFlavors = size ? size.maxFlavors : 4;
    const multiplier = maxFlavors / fraction;

    flavors.forEach((flv) => {
      if (flv.isSpecial) {
        // rule: add premium addition with multiplier based on fraction and pizza maxFlavors
        premiumAdicional += (flv.additionalPrice * multiplier);
      }
    });

    const borderPrice = border ? border.price : 0;
    return basePrice + premiumAdicional + borderPrice;
  };

  // Add standard product to edited order items
  const addProductToEditItems = (prod: Product) => {
    const existing = editItems.find((item) => item.productId === prod.id && !item.isPizza);
    if (existing) {
      setEditItems(
        editItems.map((item) =>
          item.productId === prod.id && !item.isPizza
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setEditItems([
        ...editItems,
        {
          id: `oi-${Date.now()}`,
          productId: prod.id,
          name: prod.name,
          quantity: 1,
          price: prod.price,
          isCombo: prod.isCombo,
        },
      ]);
    }
  };

  // Add custom Pizza to edited order items
  const addCustomPizzaToEdit = () => {
    // Trim flavors to selected fraction
    const finalFlavors = selectedFlavors.slice(0, selectedFraction);
    // Fill if missing
    while (finalFlavors.length < selectedFraction) {
      finalFlavors.push(pizzaFlavors[0]);
    }

    const price = calculatePizzaPrice(selectedFraction, finalFlavors, selectedBorder, selectedSize);
    
    // Set descriptive name
    let fractionLabel = 'Inteira';
    if (selectedFraction === 2) fractionLabel = '2 Sabores';
    if (selectedFraction === 3) fractionLabel = '3 Sabores';
    if (selectedFraction === 4) fractionLabel = '4 Sabores';

    const flavorNames = finalFlavors.map((f) => f.name).join(' / ');
    const name = `Pizza ${selectedSize.name} (${fractionLabel}: ${flavorNames})`;

    const newPizzaItem: OrderItem = {
      id: `oi-piz-${Date.now()}`,
      productId: 'p-101', // Custom pizza base product id
      name,
      quantity: 1,
      price,
      isPizza: true,
      fraction: selectedFraction,
      flavors: finalFlavors,
      border: selectedBorder,
      size: selectedSize,
    };

    setEditItems([...editItems, newPizzaItem]);
  };

  // Save changes and generate logs
  const saveOrderEdits = () => {
    if (!selectedOrder) return;

    // Recalculate values
    const subtotal = editItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = editType === 'Delivery' ? (currentTenantId === 'tenant-1' ? 8.0 : 6.0) : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - editDiscount);

    // Build changes history log
    const changeLogs: string[] = [];
    if (editType !== selectedOrder.type) {
      changeLogs.push(`Tipo alterado de ${selectedOrder.type} para ${editType}`);
    }
    if (editCustomerName !== selectedOrder.customerName) {
      changeLogs.push(`Nome do cliente corrigido para: ${editCustomerName}`);
    }
    if (editDiscount !== selectedOrder.discount) {
      changeLogs.push(`Desconto ajustado de R$ ${selectedOrder.discount} para R$ ${editDiscount}`);
    }
    if (editItems.length !== selectedOrder.items.length) {
      changeLogs.push(`Quantidade de itens alterada para ${editItems.length}`);
    }

    const logDetails = changeLogs.length > 0 ? changeLogs.join(', ') : 'Reajuste geral de itens ou observação';

    const updatedOrder: Order = {
      ...selectedOrder,
      type: editType,
      customerName: editCustomerName,
      customerPhone: editCustomerPhone,
      customerAddress: editType === 'Delivery' ? editCustomerAddress : undefined,
      customerBairro: editType === 'Delivery' ? editCustomerBairro : undefined,
      customerCity: editType === 'Delivery' ? editCustomerCity : undefined,
      items: editItems,
      deliveryFee,
      discount: editDiscount,
      total: finalTotal,
      notes: editNotes,
      updatedAt: new Date().toISOString(),
      history: [
        ...selectedOrder.history,
        {
          id: `h-edit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Pedido Editado',
          user: 'Atendimento ResenGO',
          details: logDetails,
        },
      ],
    };

    onUpdateOrders(orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
    setIsEditing(false);
  };

  if (isPOSActive) {
    return (
      <div className="space-y-6 bg-stone-50 p-4 rounded-2xl border border-stone-200">
        {/* Red Header Bar mimicking the uploaded screenshot */}
        <div className="bg-red-750 text-white rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setIsPOSActive(false)}
            className="flex items-center gap-1.5 bg-red-800 hover:bg-red-900 text-white text-xs font-black px-3.5 py-2 rounded-lg transition-all cursor-pointer border border-red-600/30"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Voltar para Vendas
          </button>
          <span className="font-display font-black text-sm tracking-wide uppercase">FRENTE DE CAIXA / VENDA BALCÃO</span>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-red-100">Operador: Fábia</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold border-b border-stone-200 pb-3">
          <button
            type="button"
            onClick={() => setPosStep('customer')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              posStep === 'customer' ? 'bg-red-700 text-white shadow-sm' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <span>👤</span>
            <span>Passo 1: Cliente & Entrega</span>
            {selectedPOSCustomer && <span className="ml-1 text-[10px] bg-emerald-700 text-white px-1 rounded">✓</span>}
          </button>
          <div className="w-10 h-0.5 bg-stone-300" />
          <button
            type="button"
            disabled={!selectedPOSCustomer && posType === 'Delivery'}
            onClick={() => {
              if (selectedPOSCustomer || posType !== 'Delivery') {
                setPosStep('items');
              } else {
                alert('⚠️ Para pedidos Delivery, é necessário selecionar ou cadastrar um cliente antes!');
              }
            }}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              posStep === 'items' ? 'bg-red-700 text-white shadow-sm' : 'bg-stone-100 text-stone-500 disabled:opacity-50'
            }`}
          >
            <span>🍕</span>
            <span>Passo 2: Escolha de Produtos</span>
          </button>
        </div>

        {posStep === 'customer' ? (
          /* STEP 1: CUSTOMER IDENTIFICATION PAGE */
          <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h4 className="font-display font-black text-stone-900 text-sm uppercase tracking-wide flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Identificação do Cliente & Tipo de Entrega
              </h4>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                Antes de iniciar o pedido, informe os dados de contato do cliente para emissão do cupom e cálculo automático da taxa de entrega por bairro.
              </p>
            </div>

            {/* Service Type Selection */}
            <div className="space-y-2">
              <label className="block text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Como será a entrega/retirada?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Balcão', 'Retirada', 'Delivery'] as const).map((t) => {
                  const desc = t === 'Balcão' ? 'Atendimento Local (Mesa / Balcão)' : t === 'Retirada' ? 'Cliente retira na pizzaria (Grátis)' : 'Entrega em domicílio (Taxa por Bairro)';
                  const icons = t === 'Balcão' ? '🏪' : t === 'Retirada' ? '🥡' : '🛵';
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleSetPosType(t)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                        posType === t
                          ? 'bg-red-50 border-red-500 text-red-700 shadow-3xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/60'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{icons}</span>
                      <div>
                        <p className="font-black text-xs uppercase tracking-tight">{t}</p>
                        <p className="text-[10px] text-stone-400 font-medium leading-tight mt-0.5">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedPOSCustomer && (
              <div className="bg-amber-50/40 border border-amber-200 p-5 rounded-2xl space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-200/60 pb-3">
                  <div>
                    <h5 className="font-display font-black text-stone-900 text-xs uppercase tracking-wide flex items-center gap-2">
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[9px] uppercase font-bold">✓ Selecionado</span>
                      <span>{selectedPOSCustomer.name}</span>
                    </h5>
                    <p className="text-xs text-stone-600 font-mono font-bold mt-1">📞 {selectedPOSCustomer.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPOSCustomer(null);
                      setSelectedPOSAddress(null);
                    }}
                    className="px-2.5 py-1 bg-stone-150 hover:bg-stone-200 text-stone-600 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    ❌ Desmarcar Cliente
                  </button>
                </div>

                {posType === 'Delivery' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h6 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                        <span>📍</span>
                        <span>Selecione o Endereço de Entrega:</span>
                      </h6>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPOSAddress(true);
                          setPosNewAddrName('');
                          setPosNewAddrCep('');
                          setPosNewAddrStreet('');
                          setPosNewAddrNumber('');
                          setPosNewAddrComplement('');
                          setPosNewAddrBairro('');
                          setPosNewAddrCity('Lages');
                          setPosNewAddrReference('');
                          setPosNewAddrDeliveryFee('');
                        }}
                        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>➕ Novo Endereço</span>
                      </button>
                    </div>

                    {/* Inline New Address Form */}
                    {isAddingPOSAddress && (
                      <div className="p-4 bg-white border border-amber-200 rounded-xl space-y-3 shadow-xs animate-fadeIn">
                        <h6 className="font-black text-stone-800 text-[11px] uppercase tracking-wide">
                          🏠 Adicionar Novo Endereço para {selectedPOSCustomer.name}
                        </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs">
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Identificação (Ex: Casa, Trabalho) *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Casa, Trabalho"
                              value={posNewAddrName}
                              onChange={(e) => setPosNewAddrName(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-bold"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">CEP</label>
                            <input
                              type="text"
                              placeholder="Ex: 88501-000"
                              value={posNewAddrCep}
                              onChange={(e) => setPosNewAddrCep(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Taxa de Entrega (R$)</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Padrão"
                              value={posNewAddrDeliveryFee}
                              onChange={(e) => setPosNewAddrDeliveryFee(e.target.value !== '' ? Number(e.target.value) : '')}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Rua / Logradouro *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Av. Brasil"
                              value={posNewAddrStreet}
                              onChange={(e) => setPosNewAddrStreet(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none font-medium"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Número *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: 123"
                              value={posNewAddrNumber}
                              onChange={(e) => setPosNewAddrNumber(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none text-center"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Complemento</label>
                            <input
                              type="text"
                              placeholder="Ex: Apto 102"
                              value={posNewAddrComplement}
                              onChange={(e) => setPosNewAddrComplement(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Bairro *</label>
                            <select
                              value={posNewAddrBairro}
                              onChange={(e) => setPosNewAddrBairro(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5 text-stone-900 focus:outline-none font-bold text-xs"
                            >
                              <option value="">Escolha...</option>
                              {bairros.map((b) => (
                                <option key={b.id} value={b.name}>{b.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Cidade *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Lages"
                              value={posNewAddrCity}
                              onChange={(e) => setPosNewAddrCity(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-6">
                            <label className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Ponto de Referência</label>
                            <input
                              type="text"
                              placeholder="Ex: Próximo ao mercado"
                              value={posNewAddrReference}
                              onChange={(e) => setPosNewAddrReference(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-1.5 pt-2 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => setIsAddingPOSAddress(false)}
                            className="px-3 py-1.5 bg-stone-150 hover:bg-stone-200 text-stone-600 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!posNewAddrName || !posNewAddrStreet || !posNewAddrNumber || !posNewAddrBairro) {
                                alert('⚠️ Identificação, Rua, Número e Bairro são obrigatórios!');
                                return;
                              }
                              const newAddressId = `addr-${Date.now()}`;
                              const newAddr: CustomerAddress = {
                                id: newAddressId,
                                name: posNewAddrName.trim(),
                                cep: posNewAddrCep.trim() || undefined,
                                street: posNewAddrStreet.trim(),
                                number: posNewAddrNumber.trim(),
                                complement: posNewAddrComplement.trim() || undefined,
                                bairro: posNewAddrBairro.trim(),
                                city: posNewAddrCity.trim(),
                                reference: posNewAddrReference.trim() || undefined,
                                deliveryFee: posNewAddrDeliveryFee !== '' ? Number(posNewAddrDeliveryFee) : undefined
                              };

                              // Save directly to the customer addresses list
                              const updatedCustomers = customers.map(c => {
                                if (c.id === selectedPOSCustomer.id) {
                                  const existingAddrs = c.addresses || [];
                                  return {
                                    ...c,
                                    addresses: [...existingAddrs, newAddr]
                                  };
                                }
                                return c;
                              });

                              saveCustomersToStorage(updatedCustomers);
                              
                              const syncedCust = updatedCustomers.find(c => c.id === selectedPOSCustomer.id);
                              if (syncedCust) {
                                setSelectedPOSCustomer(syncedCust);
                                // Select this newly added address
                                const matchedAddr = (syncedCust.addresses || []).find(a => a.id === newAddressId);
                                if (matchedAddr) {
                                  setSelectedPOSAddress(matchedAddr);
                                  // Update delivery fee
                                  if (matchedAddr.deliveryFee !== undefined) {
                                    setPosDeliveryFee(matchedAddr.deliveryFee);
                                  } else {
                                    const match = bairros.find(b => b.name.toLowerCase() === matchedAddr.bairro.toLowerCase());
                                    setPosDeliveryFee(match ? match.fee : 8.0);
                                  }
                                }
                              }
                              setIsAddingPOSAddress(false);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold cursor-pointer"
                          >
                            Salvar Endereço
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Address Selection Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getCustomerAddresses(selectedPOSCustomer).map((addr) => {
                        const isSelected = selectedPOSAddress && selectedPOSAddress.id === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedPOSAddress(addr);
                              if (addr.deliveryFee !== undefined) {
                                setPosDeliveryFee(addr.deliveryFee);
                              } else {
                                const match = bairros.find(b => b.name.toLowerCase() === addr.bairro.toLowerCase());
                                setPosDeliveryFee(match ? match.fee : 8.0);
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 relative ${
                              isSelected
                                ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500/30'
                                : 'bg-white/80 border-stone-200 hover:bg-white hover:border-stone-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pos_address_selection"
                              checked={!!isSelected}
                              readOnly
                              className="mt-1 cursor-pointer accent-orange-600"
                            />
                            <div className="space-y-0.5 text-left flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-stone-900 text-[10px] uppercase">{addr.name}</span>
                                <span className="text-[9px] text-stone-500 font-mono">
                                  Fee: R$ {addr.deliveryFee !== undefined ? addr.deliveryFee.toFixed(2) : (bairros.find(b => b.name.toLowerCase() === addr.bairro.toLowerCase())?.fee || 8.0).toFixed(2)}
                                </span>
                              </div>
                              <p className="text-stone-700 text-[10px] leading-tight font-semibold">
                                {addr.street}, {addr.number} {addr.complement ? ` - ${addr.complement}` : ''}
                              </p>
                              <p className="text-stone-500 text-[9px] font-medium">
                                {addr.bairro} • {addr.city}
                              </p>
                              {addr.reference && (
                                <p className="text-orange-600 text-[9px] italic font-medium leading-none">Ref: {addr.reference}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {getCustomerAddresses(selectedPOSCustomer).length === 0 && (
                        <p className="text-amber-800 text-[11px] font-bold italic col-span-2">
                          ⚠️ Este cliente não possui nenhum endereço cadastrado. Por favor, clique em "+ Novo Endereço" acima para cadastrar!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-2 border-t border-amber-200/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (posType === 'Delivery' && !selectedPOSAddress) {
                        alert('⚠️ Por favor, selecione ou adicione um endereço para entrega!');
                        return;
                      }
                      setPosStep('items');
                    }}
                    className="px-5 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-3xs cursor-pointer"
                  >
                    <span>Prosseguir para Escolha de Produtos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
              {/* Left Side: Search Existing Customer */}
              <div className="space-y-4 border-r border-stone-100 pr-0 xl:pr-6">
                <div className="space-y-1">
                  <h5 className="font-display font-bold text-stone-900 text-xs uppercase tracking-wider">
                    🔍 Buscar Cliente Cadastrado
                  </h5>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Pesquise pelo nome completo, sobrenome, primeiros dígitos do telefone, ou os 4 últimos dígitos!
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Digite o nome completo ou telefone..."
                    value={posSearchCustomer}
                    onChange={(e) => setPosSearchCustomer(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-stone-950 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-3xs"
                  />
                  <span className="absolute left-3.5 top-3 text-sm text-stone-400">🔍</span>
                  {posSearchCustomer && (
                    <button
                      type="button"
                      onClick={() => setPosSearchCustomer('')}
                      className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600 font-bold text-xs"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Filtered customers list */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {customers
                    .filter((c) => c.tenantId === currentTenantId)
                    .filter((c) => {
                      const query = posSearchCustomer.trim().toLowerCase();
                      if (!query) return true; // Show all by default to make selection super easy
                      const nameMatch = c.name.toLowerCase().includes(query);
                      const cleanPhone = c.phone.replace(/\D/g, '');
                      const cleanQuery = query.replace(/\D/g, '');
                      const phoneMatch = cleanQuery
                        ? cleanPhone.startsWith(cleanQuery) ||
                          cleanPhone.endsWith(cleanQuery) ||
                          cleanPhone.includes(cleanQuery)
                        : false;
                      return nameMatch || phoneMatch;
                    })
                    .map((c) => {
                      const pastOrders = orders.filter((o) => o.customerPhone === c.phone || o.customerName === c.name);
                      return (
                        <div
                          key={c.id}
                          className="bg-stone-50 hover:bg-stone-100/50 border border-stone-200 rounded-xl p-3 flex flex-col gap-2 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-stone-900 text-xs uppercase tracking-tight">{c.name}</p>
                              <p className="text-[11px] text-stone-500 font-mono font-bold mt-0.5 flex items-center gap-1">
                                📞 <span>{c.phone}</span>
                              </p>
                              {c.address && (
                                <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                                  📍 {c.address} ({c.bairro || 'Sem Bairro'})
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                selectPOSCustomerAndDefaultAddress(c, posType);
                                if (posType !== 'Delivery') {
                                  setPosStep('items'); // Proceed to products directly for counter/takeout
                                }
                              }}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-black text-[11px] transition-all cursor-pointer shadow-3xs flex items-center gap-1"
                            >
                              <span>Selecionar</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Historical past orders block */}
                          {pastOrders.length > 0 && (
                            <div className="border-t border-stone-200/50 pt-2 mt-1 bg-white/40 p-2 rounded-lg text-[10px]">
                              <p className="font-bold text-stone-500 uppercase tracking-wider text-[8px] mb-1">
                                📦 Histórico de Pedidos ({pastOrders.length} {pastOrders.length === 1 ? 'pedido' : 'pedidos'}):
                              </p>
                              <div className="space-y-1 divide-y divide-stone-100 max-h-[80px] overflow-y-auto pr-1 font-mono">
                                {pastOrders.slice(0, 3).map((o, oIdx) => (
                                  <div key={o.id || oIdx} className="flex justify-between py-1 text-[9px] text-stone-600">
                                    <span className="font-semibold truncate max-w-[140px]">
                                      {o.orderNumber}: {o.items.map(it => it.name).join(', ')}
                                    </span>
                                    <span className="font-bold text-stone-900">R$ {o.total.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {customers
                    .filter((c) => c.tenantId === currentTenantId)
                    .filter((c) => {
                      const query = posSearchCustomer.trim().toLowerCase();
                      if (!query) return true;
                      return c.name.toLowerCase().includes(query) || c.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
                    }).length === 0 && (
                    <div className="text-center py-8 text-stone-400 italic leading-snug">
                      Nenhum cliente cadastrado com esse nome ou telefone.<br />
                      Cadastre o novo cliente no formulário ao lado!
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Create New Customer Form */}
              <div className="space-y-4">
                <div className="space-y-1 border-b border-stone-100 pb-2">
                  <h5 className="font-display font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                    <User className="w-4 h-4 text-orange-600" />
                    Cadastrar Novo Cliente
                  </h5>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    O sistema impedirá cadastros com telefones idênticos e emitirá alertas para nomes duplicados.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-stone-600 font-bold mb-1 font-semibold">Nome Completo *</label>
                      <input
                        type="text"
                        placeholder="Ex: Pedro de Souza"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-950 focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-bold mb-1 font-semibold">Telefone (WhatsApp) *</label>
                      <input
                        type="text"
                        placeholder="Ex: (49) 99912-3456"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-950 focus:outline-none focus:border-red-500 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-stone-600 font-bold mb-1 font-semibold">Rua / Logradouro *</label>
                      <input
                        type="text"
                        placeholder="Ex: Avenida Belizário Ramos"
                        value={newCustStreet}
                        onChange={(e) => setNewCustStreet(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-950 focus:outline-none focus:border-red-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-bold mb-1 font-semibold">Número *</label>
                      <input
                        type="text"
                        placeholder="Ex: 1200"
                        value={newCustNumber}
                        onChange={(e) => setNewCustNumber(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-950 focus:outline-none focus:border-red-500 font-medium text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-bold mb-1 font-semibold">Complemento</label>
                      <input
                        type="text"
                        placeholder="Ex: Apto 101"
                        value={newCustComplement}
                        onChange={(e) => setNewCustComplement(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-950 focus:outline-none focus:border-red-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-stone-600 font-bold mb-1 font-semibold">Bairro de Lages SC (Dropdown)</label>
                      <select
                        value={newCustBairro}
                        onChange={(e) => {
                          setNewCustBairro(e.target.value);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-950 focus:outline-none focus:border-red-500 font-bold"
                      >
                        <option value="">Escolha o Bairro...</option>
                        {bairros.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} (Taxa: R$ {b.fee.toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 font-bold mb-1 font-semibold">Cidade</label>
                      <input
                        type="text"
                        value={newCustCity}
                        onChange={(e) => setNewCustCity(e.target.value)}
                        className="w-full bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 text-stone-500 focus:outline-none font-bold animate-pulse"
                        readOnly
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newCustName.trim() || !newCustPhone.trim()) {
                        alert("⚠️ Por favor, preencha o Nome e Telefone para cadastrar!");
                        return;
                      }
                      const addr = newCustStreet.trim()
                        ? `${newCustStreet.trim()}, ${newCustNumber.trim()}${newCustComplement.trim() ? ' - ' + newCustComplement.trim() : ''}`
                        : '';
                      const success = handleRegisterCustomer({
                        tenantId: currentTenantId,
                        name: newCustName,
                        phone: newCustPhone,
                        address: addr || undefined,
                        bairro: newCustBairro,
                        city: newCustCity,
                        createdAt: new Date().toISOString(),
                      });
                      if (success) {
                        setNewCustName('');
                        setNewCustPhone('');
                        setNewCustStreet('');
                        setNewCustNumber('');
                        setNewCustComplement('');
                        setNewCustBairro('');
                        setPosStep('items'); // Proceed to products
                      }
                    }}
                    className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-black transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                  >
                    <span>💾 Salvar Cadastro & Iniciar Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* General walk in customer skip option */}
            <div className="border-t border-stone-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-stone-400 text-[11px] font-medium leading-tight">
                💡 Caso queira fazer uma venda rápida sem associar a nenhum cliente específico, use o botão ao lado.
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedPOSCustomer(null);
                  setPosDeliveryFee(posType === 'Delivery' ? 8.0 : 0);
                  setPosStep('items');
                }}
                className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-black rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-2 border border-stone-300"
              >
                <span>👤 Prosseguir como Consumidor Geral (Sem Cadastro)</span>
                <ArrowRight className="w-4 h-4 text-stone-500" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: PRODUCTS GRID AND CART SELECTION */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Columns (Col Span 2): Customer Banner & Products Select */}
            <div className="xl:col-span-2 col-span-1 space-y-5">
              
              {/* Customer Banner in Step 2 */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs shadow-3xs">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div>
                    <p className="font-black text-emerald-900 uppercase">
                      {selectedPOSCustomer ? `Cliente: ${selectedPOSCustomer.name}` : 'Consumidor Geral'}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium leading-tight mt-0.5">
                      {selectedPOSCustomer 
                        ? `Contato: ${selectedPOSCustomer.phone} • ${posType} • Bairro: ${selectedPOSCustomer.bairro || 'Não informado'} • Frete: R$ ${posDeliveryFee.toFixed(2)}` 
                        : `Contato: (00) 00000-0000 • ${posType} • Frete: R$ ${posDeliveryFee.toFixed(2)}`
                      }
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPosStep('customer')}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-black text-[10px] transition-all cursor-pointer uppercase tracking-tight"
                >
                  ✏️ Alterar Cliente / Serviço
                </button>
              </div>

              {/* POS Category Navigation Tabs */}
              <div className="flex gap-1.5 bg-stone-200 p-1.5 rounded-xl border border-stone-300">
                {(['Pizzas', 'Combos', 'Bebidas', 'Calzones'] as const).map((cat) => {
                  const isActive = posCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setPosCategory(cat);
                        setPosPizzaSize(null);
                        setPosComboProduct(null);
                      }}
                      className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-red-700 text-white shadow-sm border border-red-800 font-black'
                          : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 font-bold'
                      }`}
                    >
                      {cat === 'Combos' ? (
                        <img src="/LOGO_COMBOS.png" alt="Combo" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-sm">
                          {cat === 'Pizzas' ? '🍕' : cat === 'Bebidas' ? '🥤' : '🥟'}
                        </span>
                      )}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Builder or Grid of Products depending on Category */}
              <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-3xs min-h-[350px]">
              
              {/* 1. CUSTOMIZER VIEW: PIZZA & CALZONE CUSTOMIZER */}
              {posPizzaSize && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div>
                      <h5 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                        <span>🍕</span>
                        <span>Configurando Pizza {posPizzaSize.name}</span>
                      </h5>
                      <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">
                        Até {posPizzaSize.maxFlavors} {posPizzaSize.maxFlavors === 1 ? 'sabor' : 'sabores'} • {posPizzaSize.slices} fatias • Preço base: R$ {posPizzaSize.basePrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPosPizzaSize(null)}
                      className="text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
                    >
                      Voltar
                    </button>
                  </div>

                  {/* Sub-selector: Fractions / division */}
                  {posPizzaSize.maxFlavors > 1 && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">Divisão de Sabores (Frações)</label>
                      <div className="grid grid-cols-4 gap-2">
                        {([1, 2, 3, 4] as const).map((fr) => {
                          const isAllowed = fr <= posPizzaSize.maxFlavors;
                          const activeFraction = posPizzaFraction === fr;
                          return (
                            <button
                              key={fr}
                              type="button"
                              disabled={!isAllowed}
                              onClick={() => {
                                setPosPizzaFraction(fr);
                                const copy = [...posPizzaFlavors];
                                while (copy.length < fr) {
                                  copy.push(pizzaFlavors[0]);
                                }
                                setPosPizzaFlavors(copy.slice(0, fr));
                              }}
                              className={`py-2 text-[10px] rounded-lg font-black border transition-all ${
                                !isAllowed
                                  ? 'opacity-30 cursor-not-allowed bg-stone-50 text-stone-300 border-stone-150'
                                  : activeFraction
                                  ? 'bg-red-50 border-red-500 text-red-700 shadow-3xs'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/50 cursor-pointer'
                              }`}
                            >
                              {fr === 1 ? '1 Sabor' : fr === 2 ? '2 Sabores' : fr === 3 ? '3 Sabores' : '4 Sabores'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Grid for selecting flavor for each fraction slot */}
                  <div className="space-y-3 bg-stone-50/50 p-4 rounded-xl border border-stone-200">
                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Selecione os sabores da pizza</p>
                    
                    <div className="space-y-3 text-xs">
                      {Array.from({ length: posPizzaFraction }).map((_, slotIdx) => {
                        const currentFlavor = posPizzaFlavors[slotIdx] || pizzaFlavors[0];
                        const searchQuery = flavorSearchQueries[slotIdx] || '';
                        
                        const maxFlavors = posPizzaSize ? posPizzaSize.maxFlavors : 4;
                        const multiplier = maxFlavors / posPizzaFraction;
                        const currentFlavorPremium = currentFlavor.additionalPrice * multiplier;

                        const filteredSavory = savoryFlavorsList.filter(f => 
                          f.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
                        );
                        const filteredSweet = sweetFlavorsList.filter(f => 
                          f.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
                        );

                        return (
                          <div key={slotIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-stone-200">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-stone-700">Sabor {slotIdx + 1}:</span>
                              {currentFlavor.isSpecial && (
                                <span className="bg-orange-100 text-orange-800 text-[9px] font-bold px-2 py-0.5 rounded border border-orange-200">
                                  Sabor Especial (+R$ {currentFlavorPremium.toFixed(2)})
                                </span>
                              )}
                            </div>
                            <select
                              value={currentFlavor.id}
                              onChange={(e) => {
                                const flv = pizzaFlavors.find(f => f.id === e.target.value);
                                if (flv) {
                                  const copy = [...posPizzaFlavors];
                                  copy[slotIdx] = flv;
                                  setPosPizzaFlavors(copy);
                                  if (flv.isSpecial) {
                                    playSpecialAlertSound();
                                  }
                                }
                              }}
                              className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5 font-bold text-stone-900 focus:outline-none focus:border-red-500"
                            >
                              <option value="">Selecione o sabor...</option>
                              {filteredSavory.filter(f => !f.isSpecial).length > 0 && (
                                <optgroup label="Salgadas Tradicionais">
                                  {filteredSavory.filter(f => !f.isSpecial).map(f => (
                                    <option key={f.id} value={f.id}>{f.name} (Tradicional)</option>
                                  ))}
                                </optgroup>
                              )}
                              {filteredSavory.filter(f => f.isSpecial).length > 0 && (
                                <optgroup label="Salgadas Especiais (Mais caras)">
                                  {filteredSavory.filter(f => f.isSpecial).map(f => {
                                    const optionPremium = f.additionalPrice * multiplier;
                                    return (
                                      <option key={f.id} value={f.id}>{f.name} (+R$ {optionPremium.toFixed(2)})</option>
                                    );
                                  })}
                                </optgroup>
                              )}
                              {filteredSweet.length > 0 && (
                                <optgroup label="Pizzas Doces">
                                  {filteredSweet.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                  ))}
                                </optgroup>
                              )}
                            </select>

                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Filtrar:</span>
                              <input
                                type="text"
                                placeholder="Digite para filtrar os sabores abaixo..."
                                value={searchQuery}
                                onChange={(e) => {
                                  const copy = [...flavorSearchQueries];
                                  copy[slotIdx] = e.target.value;
                                  setFlavorSearchQueries(copy);
                                }}
                                className="flex-1 bg-stone-50/50 border border-stone-200/80 rounded px-2 py-0.5 text-[10px] text-stone-600 font-medium focus:outline-none focus:border-red-400 placeholder:text-stone-400 h-6"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Border selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Borda Recheada</label>
                      <select
                        value={posPizzaBorder?.id || ''}
                        onChange={(e) => {
                          const b = pizzaBorders.find(border => border.id === e.target.value);
                          setPosPizzaBorder(b);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 font-bold text-stone-800 focus:outline-none focus:border-red-500"
                      >
                        <option value="">Sem Borda Recheada</option>
                        {pizzaBorders.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name} (+R$ {b.price.toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Observações do Produto</label>
                      <input
                        type="text"
                        placeholder="Ex: Sem cebola, bem assada"
                        value={posPizzaNotes}
                        onChange={(e) => setPosPizzaNotes(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-900 focus:outline-none focus:border-red-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Add pizza calculation & Action */}
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                    <div>
                      <p className="text-stone-400 font-mono uppercase text-[9px] font-bold">Preço Calculado</p>
                      <span className="text-lg font-black text-stone-900 font-mono">
                        R$ {calculatePizzaPrice(posPizzaFraction, posPizzaFlavors.slice(0, posPizzaFraction), posPizzaBorder, posPizzaSize).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPosPizzaSize(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg font-bold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const finalFlavors = posPizzaFlavors.slice(0, posPizzaFraction);
                          while (finalFlavors.length < posPizzaFraction) {
                            finalFlavors.push(pizzaFlavors[0]);
                          }
                          const price = calculatePizzaPrice(posPizzaFraction, finalFlavors, posPizzaBorder, posPizzaSize);
                          
                          let fractionLabel = 'Inteira';
                          if (posPizzaFraction === 2) fractionLabel = '2 Sabores';
                          if (posPizzaFraction === 3) fractionLabel = '3 Sabores';
                          if (posPizzaFraction === 4) fractionLabel = '4 Sabores';

                          const flavorNames = finalFlavors.map(f => f.name).join(' / ');
                          const name = `Pizza ${posPizzaSize.name} (${fractionLabel}: ${flavorNames})`;

                          const newPizzaItem: OrderItem = {
                            id: `oi-pos-piz-${Date.now()}`,
                            productId: 'p-101',
                            name,
                            quantity: 1,
                            price,
                            isPizza: true,
                            fraction: posPizzaFraction,
                            flavors: finalFlavors,
                            border: posPizzaBorder,
                            size: posPizzaSize,
                            notes: posPizzaNotes,
                          };

                          setPosCart([...posCart, newPizzaItem]);
                          setPosPizzaSize(null);
                          setPosPizzaNotes('');
                        }}
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-black shadow-3xs cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Incluir no Pedido
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CUSTOMIZER VIEW: CALZONE CUSTOMIZER */}
              {posIsCalzone && posCalzoneProduct && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div>
                      <h5 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                        <span>🥟</span>
                        <span>Configurando {posCalzoneProduct.name}</span>
                      </h5>
                      <p className="text-[10px] text-stone-400">Preço: R$ {posCalzoneProduct.price.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPosIsCalzone(false);
                        setPosCalzoneProduct(null);
                      }}
                      className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
                    >
                      Voltar
                    </button>
                  </div>

                  <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase mb-1">Selecione o Recheio do Calzone</label>
                      <select
                        value={posPizzaFlavors[0]?.id || ''}
                        onChange={(e) => {
                          const flv = pizzaFlavors.find(f => f.id === e.target.value);
                          if (flv) {
                            setPosPizzaFlavors([flv]);
                          }
                        }}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-2 font-bold text-stone-800"
                      >
                        <option value="">Escolha um sabor...</option>
                        {pizzaFlavors.filter(f => !f.id.startsWith('f-res-') || parseInt(f.id.replace('f-res-', '')) < 44).map(f => (
                          <option key={f.id} value={f.id}>
                            {f.name} {f.isSpecial ? `(+ R$ ${f.additionalPrice.toFixed(2)} - Sabor Especial)` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase mb-1">Observações do Calzone</label>
                      <input
                        type="text"
                        placeholder="Ex: Sem tomate, extra queijo"
                        value={posPizzaNotes}
                        onChange={(e) => setPosPizzaNotes(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPosIsCalzone(false);
                        setPosCalzoneProduct(null);
                      }}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const flv = posPizzaFlavors[0] || pizzaFlavors[0];
                        const finalPrice = posCalzoneProduct.price + (flv.isSpecial ? flv.additionalPrice : 0);
                        const name = `${posCalzoneProduct.name} (Sabor: ${flv.name})`;

                        const newItem: OrderItem = {
                          id: `oi-pos-cal-${Date.now()}`,
                          productId: posCalzoneProduct.id,
                          name,
                          quantity: 1,
                          price: finalPrice,
                          isPizza: false,
                          notes: posPizzaNotes,
                        };

                        setPosCart([...posCart, newItem]);
                        setPosIsCalzone(false);
                        setPosCalzoneProduct(null);
                        setPosPizzaNotes('');
                      }}
                      className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-black shadow-3xs"
                    >
                      Incluir Calzone
                    </button>
                  </div>
                </div>
              )}

              {/* 3. CUSTOMIZER VIEW: COMBO CUSTOMIZER */}
              {posComboProduct && (
                <div className="space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-2.5 gap-2">
                    <div className="flex-1">
                      <h5 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                        <ComboVisual className="h-6 w-auto flex items-center gap-1" />
                        <span>Configurando {posComboProduct.name}</span>
                      </h5>
                      <div className="flex items-center gap-2 mt-1.5 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-lg">
                        <span className="text-[10px] font-black text-orange-800 uppercase tracking-wider">Valor do Combo (R$):</span>
                        <input
                          type="number"
                          step="0.01"
                          value={posComboPrice}
                          onChange={(e) => setPosComboPrice(parseFloat(e.target.value) || 0)}
                          className="w-20 bg-white border border-stone-200 rounded px-1.5 py-0.5 font-mono font-black text-xs text-stone-900 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Combo Details: Size and Accompaniments */}
                      <div className="mt-2.5 bg-stone-100/80 p-2.5 rounded-lg border border-stone-200 space-y-1">
                        <p className="font-bold text-stone-800 text-[9px] uppercase tracking-wider">📦 COMPOSIÇÃO DESTE COMBO:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-stone-600 font-semibold pl-1">
                          <p>🍕 <strong className="text-stone-700">Tamanho da Pizza:</strong> {posComboProduct.id === 'p-113' ? 'Gigante (45 cm - 16 Fatias)' : posComboProduct.id === 'p-114' ? 'Grande (40 cm - 12 Fatias)' : 'Média (35 cm - 8 Fatias)'}</p>
                          <p>🍓 <strong className="text-stone-700">Acompanhamento Doce:</strong> 1x Pizza Broto Doce (25 cm)</p>
                          <p>🥤 <strong className="text-stone-700">Bebida Inclusa:</strong> 1x Refrigerante 1.5L (Diferente de Coca-cola)</p>
                          <p>✨ <strong className="text-stone-700">Adicionais Especiais:</strong> {posComboFlavors.some(f => f?.isSpecial) || posComboSweetFlavor?.isSpecial ? 'Sim (Valor ajustado)' : 'Não (Valor padrão)'}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPosComboProduct(null)}
                      className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer text-right self-end sm:self-center"
                    >
                      Voltar
                    </button>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                    {/* Dynamic flavors for the pizza based on combo */}
                    {(() => {
                      const maxFlavors = posComboProduct.id === 'p-113' ? 4 : (posComboProduct.id === 'p-114' || posComboProduct.id === 'p-115' ? 3 : 2);
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-stone-700 font-black">
                              🍕 Pizza Principal ({maxFlavors} Sabores permitidos) *
                            </label>
                            <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">
                              {posComboProduct.id === 'p-113' ? '45 cm • 16 Fatias' : posComboProduct.id === 'p-114' ? '40 cm • 12 Fatias' : '35 cm • 8 Fatias'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                            {Array.from({ length: maxFlavors }).map((_, slotIdx) => {
                              const searchQuery = slotIdx === 0 ? comboSearchQuery1 : slotIdx === 1 ? comboSearchQuery2 : slotIdx === 2 ? comboSearchQuery3 : comboSearchQuery4;
                              const setSearchQuery = slotIdx === 0 ? setComboSearchQuery1 : slotIdx === 1 ? setComboSearchQuery2 : slotIdx === 2 ? setComboSearchQuery3 : setComboSearchQuery4;

                              return (
                                <div key={slotIdx} className="bg-white p-2.5 rounded-lg border border-stone-200 space-y-1.5">
                                  <span className="font-bold text-stone-700 block text-[11px]">Sabor #{slotIdx + 1} {slotIdx > 0 ? '(Opcional)' : ''}:</span>
                                  <select
                                    value={posComboFlavors[slotIdx]?.id || ''}
                                    onChange={(e) => {
                                      const f = pizzaFlavors.find(fl => fl.id === e.target.value);
                                      const copy = [...posComboFlavors];
                                      if (f) {
                                        copy[slotIdx] = f;
                                        if (f.isSpecial) {
                                          playSpecialAlertSound();
                                        }
                                      } else {
                                        copy[slotIdx] = undefined as any;
                                      }
                                      setPosComboFlavors(copy.filter(Boolean));
                                    }}
                                    className="w-full bg-white border border-stone-200 rounded px-1.5 py-1 text-[11px] font-bold text-stone-900 focus:outline-none"
                                  >
                                    <option value="">Selecione o sabor...</option>
                                    {pizzaFlavors
                                      .filter(f => !f.id.startsWith('f-res-') || parseInt(f.id.replace('f-res-', '')) < 44)
                                      .filter(f => f.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                                      .map(f => (
                                        <option key={f.id} value={f.id}>
                                          {f.name} {f.isSpecial ? `(+ R$ ${f.additionalPrice.toFixed(2)} - Especial)` : ''}
                                        </option>
                                      ))}
                                  </select>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Filtrar:</span>
                                    <input
                                      type="text"
                                      placeholder="Filtrar sabores acima..."
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      className="flex-1 bg-stone-50/50 border border-stone-200/80 rounded px-2 py-0.5 text-[10px] text-stone-600 font-medium focus:outline-none focus:border-red-400 placeholder:text-stone-400 h-6"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Select sweet pizza flavor with search */}
                    <div className="bg-white p-3 rounded-lg border border-stone-200 text-[11px] space-y-1.5">
                      <label className="block text-stone-700 font-bold flex items-center gap-1">
                        <span>🍕🍓</span>
                        <span>Sabor da Pizza Broto Doce *</span>
                      </label>
                      <select
                        value={posComboSweetFlavor?.id || ''}
                        onChange={(e) => {
                          const f = pizzaFlavors.find(fl => fl.id === e.target.value);
                          if (f) {
                            setPosComboSweetFlavor(f);
                            if (f.isSpecial) {
                              playSpecialAlertSound();
                            }
                          }
                        }}
                        className="w-full bg-white border border-stone-200 rounded px-1.5 py-1 text-[11px] font-bold text-stone-900 focus:outline-none"
                      >
                        <option value="">Selecione o sabor doce...</option>
                        {pizzaFlavors
                          .filter(f => f.id.startsWith('f-res-') && parseInt(f.id.replace('f-res-', '')) >= 44)
                          .filter(f => f.name.toLowerCase().includes(comboSearchQuerySweet.trim().toLowerCase()))
                          .map(f => (
                            <option key={f.id} value={f.id}>
                              {f.name} {f.isSpecial ? `(+ R$ ${f.additionalPrice.toFixed(2)} - Especial)` : ''}
                            </option>
                          ))}
                      </select>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Filtrar:</span>
                        <input
                          type="text"
                          placeholder="Filtrar sabores doces acima..."
                          value={comboSearchQuerySweet}
                          onChange={(e) => setComboSearchQuerySweet(e.target.value)}
                          className="flex-1 bg-stone-50/50 border border-stone-200/80 rounded px-2 py-0.5 text-[10px] text-stone-600 font-medium focus:outline-none focus:border-red-400 placeholder:text-stone-400 h-6"
                        />
                      </div>
                    </div>

                    {/* Select drink choice with search & visual icons */}
                    <div className="bg-white p-3 rounded-lg border border-stone-200 text-[11px] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-stone-700 font-bold flex items-center gap-1">
                          <span>🥤</span>
                          <span>Escolha a Bebida (Refrigerante) *</span>
                        </label>
                        {posComboDrink && (
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                            Selecionado: {posComboDrink.name}
                          </span>
                        )}
                      </div>

                      {/* Quick select icons for drinks */}
                      <div className="flex flex-wrap gap-1.5">
                        {products
                          .filter(p => p.category === 'Bebida' && p.id.startsWith('p-1'))
                          .map(d => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => {
                                setPosComboDrink(d);
                                if (!d.name.toLowerCase().includes('coca')) {
                                  setPosComboCocaDiff('');
                                }
                              }}
                              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                posComboDrink?.id === d.id
                                  ? 'bg-red-50 text-red-700 border-red-400 shadow-3xs'
                                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-white hover:border-stone-300'
                              }`}
                            >
                              <span className="text-xs">🥤</span>
                              <span>{d.name.replace('Refrigerante ', '').replace('Antarctica ', '')}</span>
                            </button>
                          ))}
                      </div>

                      <select
                        value={posComboDrink?.id || ''}
                        onChange={(e) => {
                          const p = products.find(prod => prod.id === e.target.value);
                          if (p) {
                            setPosComboDrink(p);
                            if (!p.name.toLowerCase().includes('coca')) {
                              setPosComboCocaDiff('');
                            }
                          }
                        }}
                        className="w-full bg-white border border-stone-200 rounded px-1.5 py-1 text-[11px] font-bold text-stone-900 focus:outline-none"
                      >
                        <option value="">Selecione a bebida...</option>
                        {products
                          .filter(p => p.category === 'Bebida' && p.id.startsWith('p-1'))
                          .filter(p => p.name.toLowerCase().includes(comboSearchQueryDrink.trim().toLowerCase()))
                          .map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                      </select>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Filtrar:</span>
                        <input
                          type="text"
                          placeholder="Filtrar bebidas acima..."
                          value={comboSearchQueryDrink}
                          onChange={(e) => setComboSearchQueryDrink(e.target.value)}
                          className="flex-1 bg-stone-50/50 border border-stone-200/80 rounded px-2 py-0.5 text-[10px] text-stone-600 font-medium focus:outline-none focus:border-red-400 placeholder:text-stone-400 h-6"
                        />
                      </div>

                      {posComboDrink && posComboDrink.name.toLowerCase().includes('coca') && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg space-y-2 mt-2 animate-fadeIn">
                          <p className="text-[11px] font-black text-amber-900 flex items-center gap-1.5">
                            <span>⚠️ Coca-Cola possui acréscimo. Informe o valor da diferença.</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-stone-600 font-bold uppercase shrink-0">Valor da Diferença (R$):</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Ex: R$ 5,00"
                              value={posComboCocaDiff}
                              onChange={(e) => setPosComboCocaDiff(e.target.value !== '' ? Number(e.target.value) : '')}
                              className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-950 font-mono font-bold w-32 focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Real-time Combo Surcharges and Total Display */}
                  <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-pulse-subtle">
                    <div>
                      <p className="text-[10px] text-orange-700 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <span>💰 VALOR ATUALIZADO DO COMBO:</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 font-semibold text-[10px] text-stone-500">
                        <span>Base: R$ {posComboProduct.price.toFixed(2)}</span>
                        {posComboFlavors.some(f => f?.isSpecial) || posComboSweetFlavor?.isSpecial ? (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-red-600 font-bold">
                              + R$ {((posComboPrice || 0) - posComboProduct.price).toFixed(2)} (sabores especiais selecionados)
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-green-600 font-bold">Sem adicionais especiais</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-white px-3.5 py-1.5 rounded-lg border border-orange-200/60 shadow-3xs flex flex-col items-end shrink-0">
                      <span className="text-[9px] text-stone-400 font-bold uppercase leading-none">TOTAL DO COMBO</span>
                      <span className="text-lg font-black text-red-700 font-mono mt-0.5">R$ {posComboPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPosComboProduct(null)}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const mainFlavors = posComboFlavors.filter(Boolean);
                        if (mainFlavors.length === 0 || !posComboSweetFlavor || !posComboDrink) {
                          alert("⚠️ Por favor, escolha os sabores da pizza principal, a broto doce e a bebida!");
                          return;
                        }

                        const isCoca = posComboDrink.name.toLowerCase().includes('coca');
                        let cocaDiff = 0;
                        if (isCoca) {
                          if (posComboCocaDiff === '' || isNaN(Number(posComboCocaDiff)) || Number(posComboCocaDiff) < 0) {
                            alert("⚠️ O refrigerante Coca-Cola possui acréscimo. Por favor, preencha o valor da diferença!");
                            return;
                          }
                          cocaDiff = Number(posComboCocaDiff);
                        }

                        const flavorsNames = mainFlavors.map(f => f.name).join(' / ');
                        const name = `${posComboProduct.name} (Pizzas: ${flavorsNames} • Broto Doce: ${posComboSweetFlavor.name} • Refri: ${posComboDrink.name})`;

                        const newItem: OrderItem = {
                          id: `oi-pos-cmb-${Date.now()}`,
                          productId: posComboProduct.id,
                          name,
                          quantity: 1,
                          price: posComboPrice + cocaDiff,
                          isCombo: true,
                          removedComboItems: [],
                          addedExtraItems: [],
                          cocaDifference: cocaDiff > 0 ? cocaDiff : undefined
                        };

                        setPosCart([...posCart, newItem]);
                        setPosComboProduct(null);
                        setPosComboFlavors([]);
                        setPosComboSweetFlavor(null);
                        setPosComboDrink(null);
                        setPosComboCocaDiff('');

                        // Clear queries
                        setComboSearchQuery1('');
                        setComboSearchQuery2('');
                        setComboSearchQuery3('');
                        setComboSearchQuery4('');
                        setComboSearchQuerySweet('');
                        setComboSearchQueryDrink('');
                      }}
                      className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-black shadow-3xs cursor-pointer"
                    >
                      Adicionar Combo ao Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* 4. PRODUCT GRID VIEW */}
              {!posPizzaSize && !posIsCalzone && !posComboProduct && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                      {posCategory === 'Pizzas' ? 'Tamanhos de Pizza' : posCategory === 'Calzones' ? 'Calzones Recheados' : posCategory === 'Combos' ? 'Combos Especiais' : 'Produtos de Cardápio'}
                    </h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">Clique em um tamanho ou produto para incluir no pedido</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    
                    {/* Category: Pizzas */}
                    {posCategory === 'Pizzas' && (
                      <>
                        {pizzaSizes.map((sz) => (
                          <div
                            key={sz.id}
                            onClick={() => {
                              setPosPizzaSize(sz);
                              setPosPizzaFraction(1);
                              setPosPizzaFlavors([pizzaFlavors[0]]);
                              setPosPizzaBorder(undefined);
                            }}
                            className="border border-stone-200 hover:border-red-500 hover:shadow-xs p-3.5 rounded-xl text-center bg-stone-50/30 hover:bg-white cursor-pointer transition-all space-y-1 group"
                          >
                            <div className="text-2xl transition-transform group-hover:scale-110 duration-200">🍕</div>
                            <p className="text-[11px] font-black text-stone-950 uppercase tracking-tight leading-tight">{sz.name.replace(' (20cm)', '').replace(' (25cm)', '').replace(' (35cm)', '').replace(' (40cm)', '').replace(' (45cm)', '')}</p>
                            <p className="text-[9px] text-stone-400 font-mono font-bold">{sz.diameter} • {sz.slices} fatias</p>
                            <p className="text-xs font-black text-red-700 font-mono pt-1">R$ {sz.basePrice.toFixed(2)}</p>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Category: Combos */}
                    {posCategory === 'Combos' && (
                      <>
                        {products
                          .filter(p => p.category === 'Combo' && p.id.startsWith('p-1'))
                          .map((combo) => (
                            <div
                              key={combo.id}
                              onClick={() => {
                                setPosComboProduct(combo);
                                setPosComboFlavors([pizzaFlavors[0], pizzaFlavors[1]]);
                                setPosComboSweetFlavor(pizzaFlavors.find(f => f.id === 'f-res-45') || null);
                                setPosComboDrink(products.find(p => p.id === 'p-104') || null);
                                setPosComboPrice(combo.price);
                              }}
                              className="border border-stone-200 hover:border-red-500 hover:shadow-xs p-3.5 rounded-xl text-center bg-stone-50/30 hover:bg-white cursor-pointer transition-all space-y-1.5 group font-bold"
                            >
                              <ComboVisual />
                              <p className="text-[11px] font-black text-stone-950 uppercase tracking-tight leading-tight">{combo.name}</p>
                              <p className="text-[9px] text-stone-400 leading-normal font-bold">{combo.description.split(' + ')[0]}</p>
                              <p className="text-xs font-black text-red-700 font-mono pt-1">R$ {combo.price.toFixed(2)}</p>
                            </div>
                          ))}
                      </>
                    )}

                    {/* Category: Bebidas */}
                    {posCategory === 'Bebidas' && (
                      <>
                        {products
                          .filter(p => p.category === 'Bebida' && p.id.startsWith('p-1'))
                          .map((drink) => {
                            const isSoda = drink.name.includes('Coca') || drink.name.includes('Guaraná') || drink.name.includes('Laranjinha') || drink.name.includes('Framboesa');
                            return (
                              <div
                                key={drink.id}
                                onClick={() => {
                                  const existing = posCart.find((item) => item.productId === drink.id && !item.isPizza);
                                  if (existing) {
                                    setPosCart(
                                      posCart.map((item) =>
                                        item.productId === drink.id && !item.isPizza
                                          ? { ...item, quantity: item.quantity + 1 }
                                          : item
                                      )
                                    );
                                  } else {
                                    setPosCart([
                                      ...posCart,
                                      {
                                        id: `oi-pos-drk-${Date.now()}`,
                                        productId: drink.id,
                                        name: drink.name,
                                        quantity: 1,
                                        price: drink.price,
                                      },
                                    ]);
                                  }
                                }}
                                className="border border-stone-200 hover:border-red-500 hover:shadow-xs p-3.5 rounded-xl text-center bg-stone-50/30 hover:bg-white cursor-pointer transition-all space-y-1 group"
                              >
                                <div className="text-2xl transition-transform group-hover:scale-110 duration-200">
                                  {isSoda ? '🥤' : '🍺'}
                                </div>
                                <p className="text-[11px] font-black text-stone-950 uppercase tracking-tight leading-tight">{drink.name}</p>
                                <p className="text-[9px] text-stone-400 font-bold">Lata/Garrafa</p>
                                <p className="text-xs font-black text-red-700 font-mono pt-1">R$ {drink.price.toFixed(2)}</p>
                              </div>
                            );
                          })}
                      </>
                    )}

                    {/* Category: Calzones */}
                    {posCategory === 'Calzones' && (
                      <>
                        {products
                          .filter(p => p.category === 'Pizza' && p.name.includes('Calzone'))
                          .map((cal) => (
                            <div
                              key={cal.id}
                              onClick={() => {
                                setPosIsCalzone(true);
                                setPosCalzoneProduct(cal);
                                setPosPizzaFlavors([pizzaFlavors[0]]);
                              }}
                              className="border border-stone-200 hover:border-red-500 hover:shadow-xs p-3.5 rounded-xl text-center bg-stone-50/30 hover:bg-white cursor-pointer transition-all space-y-1 group"
                            >
                              <div className="text-2xl transition-transform group-hover:scale-110 duration-200">🥟</div>
                              <p className="text-[11px] font-black text-stone-950 uppercase tracking-tight leading-tight">{cal.name.replace(' (45 CM)', '').replace(' (35 CM)', '').replace(' (25 CM)', '')}</p>
                              <p className="text-[9px] text-stone-400 font-mono font-bold">Frito/Assado recheado</p>
                              <p className="text-xs font-black text-red-700 font-mono pt-1">R$ {cal.price.toFixed(2)}</p>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Cupom Fiscal / Cart / Cashier button */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between min-h-[500px]">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <h4 className="font-display font-black text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛒</span>
                  <span>Cupom do Pedido</span>
                </h4>
                <span className="text-[9px] font-mono bg-stone-100 px-2 py-0.5 rounded font-bold text-stone-500">
                  {posCart.reduce((sum, i) => sum + i.quantity, 0)} Itens
                </span>
              </div>

              {/* Display Selected Customer in Cupom */}
              {selectedPOSCustomer ? (
                <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-[11px] space-y-1">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>Cliente: {selectedPOSCustomer.name}</span>
                    <span className="text-stone-400 font-mono">{selectedPOSCustomer.phone}</span>
                  </div>
                  {posType === 'Delivery' && selectedPOSCustomer.address && (
                    <p className="text-stone-500 text-[10px] leading-tight font-medium">Entregar em: {selectedPOSCustomer.address} ({selectedPOSCustomer.bairro})</p>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[10px] text-amber-800 font-bold flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>Nenhum cliente selecionado! Pedido entrará como Balcão Geral.</span>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {posCart.length === 0 ? (
                  <div className="text-center py-14 text-stone-400 text-xs italic space-y-2">
                    <div className="text-3xl">🛒</div>
                    <p>Seu carrinho está vazio!</p>
                    <p className="text-[10px]">Clique nos produtos da esquerda para começar a montar o pedido.</p>
                  </div>
                ) : (
                  posCart.map((item, idx) => (
                    <div key={item.id || idx} className="bg-stone-50/50 hover:bg-stone-50 p-2.5 rounded-xl border border-stone-150 flex flex-col gap-1.5 transition-all text-xs">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-black text-stone-900 leading-snug">{item.name}</p>
                          {item.notes && <p className="text-[10px] text-red-600 font-semibold mt-0.5">Obs: {item.notes}</p>}
                        </div>
                        <span className="font-mono text-stone-800 font-bold shrink-0">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-stone-150/40 pt-1.5">
                        <span className="text-[10px] font-mono text-stone-400 font-bold">Unit: R$ {item.price.toFixed(2)}</span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                setPosCart(posCart.map((it, i) => i === idx ? { ...it, quantity: it.quantity - 1 } : it));
                              } else {
                                setPosCart(posCart.filter((_, i) => i !== idx));
                              }
                            }}
                            className="w-5 h-5 rounded bg-white hover:bg-stone-150 text-stone-600 border border-stone-200 flex items-center justify-center font-bold transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold font-mono px-1.5">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setPosCart(posCart.map((it, i) => i === idx ? { ...it, quantity: it.quantity + 1 } : it));
                            }}
                            className="w-5 h-5 rounded bg-white hover:bg-stone-150 text-stone-600 border border-stone-200 flex items-center justify-center font-bold transition-all cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => setPosCart(posCart.filter((_, i) => i !== idx))}
                            className="w-5 h-5 rounded bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center font-bold ml-1 transition-all cursor-pointer"
                            title="Remover item"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Service & Money details */}
              <div className="space-y-3.5 pt-2 border-t border-stone-100 text-xs font-medium">
                
                {/* Service Type Selection */}
                <div>
                  <label className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Tipo de Serviço</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Balcão', 'Retirada', 'Delivery'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPosType(t)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                          posType === t
                            ? 'bg-red-50 border-red-500 text-red-700 shadow-3xs font-black'
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Pagamento</label>
                    <select
                      value={posPayment}
                      onChange={(e) => setPosPayment(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 font-bold text-stone-800"
                    >
                      <option value="Pix">📱 Pix</option>
                      <option value="Cartão">💳 Cartão</option>
                      <option value="Dinheiro">💵 Dinheiro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Desconto (R$)</label>
                    <input
                      type="number"
                      value={posDiscount || ''}
                      placeholder="0.00"
                      onChange={(e) => setPosDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-900 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Notas Gerais do Pedido</label>
                  <input
                    type="text"
                    placeholder="Ex: Entregar sem fazer barulho"
                    value={posNotes}
                    onChange={(e) => setPosNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900"
                  />
                </div>

                {/* Delivery fee field (Only shown for Delivery, allowing manual edit override) */}
                {posType === 'Delivery' && (
                  <div>
                    <label className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                      🏍️ Taxa de Entrega (Editável)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 font-bold">R$</span>
                      <input
                        type="number"
                        step="0.10"
                        min="0"
                        value={posDeliveryFee}
                        onChange={(e) => setPosDeliveryFee(parseFloat(e.target.value) || 0)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-2.5 py-1.5 text-stone-900 font-mono font-bold focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Checkout pricing box & Action Button */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              
              <div className="space-y-1 font-mono text-[10px] text-stone-400 uppercase font-bold">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {posCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                {posType === 'Delivery' && (
                  <div className="flex justify-between text-stone-500">
                    <span>Taxa de Frete:</span>
                    <span>R$ {posDeliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {posDiscount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Desconto:</span>
                    <span>- R$ {posDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleFinalizePOSOrder}
                className="w-full bg-blue-700 hover:bg-blue-600 hover:shadow-md text-white rounded-xl py-3.5 px-4 font-black transition-all flex items-center justify-between cursor-pointer transform active:scale-95 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏪</span>
                  <span className="text-xs uppercase tracking-wider">Finalizar Pedido</span>
                </div>
                <span className="text-lg font-mono tracking-tight font-black">
                  R$ {Math.max(0, posCart.reduce((sum, item) => sum + item.price * item.quantity, 0) + (posType === 'Delivery' ? posDeliveryFee : 0) - posDiscount).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-stone-900 tracking-tight">Atendimento & Painel de Vendas</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Visualize pedidos ativos de rascunhos a concluídos. Altere produtos e dados mesmo após a aprovação com auditoria automática.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsPOSActive(true);
            setPosCart([]);
            setSelectedPOSCustomer(null);
            setShowNewCustomerForm(false);
          }}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-4.5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Novo Pedido (PDV Balcão)
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Orders List */}
        <div className="xl:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <h4 className="font-display font-bold text-stone-900 text-sm">Lista de Pedidos Ativos</h4>
            <span className="text-xs text-stone-500 font-mono font-bold text-stone-600">
              {filteredOrders.length} de {tenantOrders.length} {tenantOrders.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap gap-1 bg-stone-100/80 p-1 rounded-xl">
            {(['Todos', 'Pendente', 'Em Produção', 'Saiu p/ Entrega', 'Finalizado'] as const).map((filter) => {
              const count = tenantOrders.filter((o) => matchesFilter(o, filter)).length;
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-orange-700 shadow-3xs border border-orange-200/50 font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/40 font-semibold'
                  }`}
                >
                  <span>{filter}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-orange-100 text-orange-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                {activeFilter === 'Todos'
                  ? 'Nenhum pedido ativo no momento para esta empresa. Use o botão "+ Novo Pedido" para lançar um novo pedido!'
                  : `Nenhum pedido no estado "${activeFilter}" encontrado para esta empresa.`}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedOrder?.id === order.id
                      ? 'bg-orange-50/40 border-orange-500/80 shadow-xs'
                      : 'bg-stone-50/50 border-stone-200/80 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900 font-mono">{order.orderNumber}</span>
                      <span className="text-xs font-semibold text-stone-700">{order.customerName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status pill */}
                      <span
                        className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                          order.status === 'Rascunho'
                            ? 'bg-stone-100 text-stone-600 border-stone-200'
                            : order.status === 'Confirmado'
                            ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                            : order.status === 'Em Produção'
                            ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                            : order.status === 'No Forno'
                            ? 'bg-orange-50 text-orange-700 border-orange-200/60'
                            : order.status === 'Pronto'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                            : order.status === 'Saiu para Entrega'
                            ? 'bg-purple-50 text-purple-700 border-purple-200/60'
                            : order.status === 'Entregue'
                            ? 'bg-green-50 text-green-700 border-green-200/60'
                            : 'bg-red-50 text-red-700 border-red-200/60'
                        }`}
                      >
                        {order.status}
                      </span>

                      {/* Type badge */}
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                          order.type === 'Delivery'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200/40'
                            : order.type === 'Retirada'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200/40'
                            : 'bg-stone-200 text-stone-800 border border-stone-300/40'
                        }`}
                      >
                        {order.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center text-xs text-stone-500 gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-stone-300">•</span>
                      <span>{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span>
                    </div>
                    <span className="font-mono font-bold text-stone-800">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Order Details & Edit Screen */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          {selectedOrder ? (
            !isEditing ? (
              // DETAILS VIEW MODE
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h4 className="font-display font-bold text-stone-900 text-sm">Detalhes do Pedido {selectedOrder.orderNumber}</h4>
                    <span className="text-[10px] text-stone-400 font-mono">ID: {selectedOrder.id}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPrintOrder(selectedOrder);
                        setPrintType('Completo');
                        setShowPrintModal(true);
                      }}
                      className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all border border-stone-200 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-stone-500" />
                      Imprimir
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditing(selectedOrder)}
                      className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all shadow-3xs cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <User className="w-4 h-4 text-stone-400" />
                    <span className="font-bold text-stone-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <span className="font-mono">{selectedOrder.customerPhone}</span>
                  </div>
                  {selectedOrder.type === 'Delivery' && (
                    <div className="flex items-start gap-2 text-stone-700 mt-1">
                      <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-stone-800">{selectedOrder.customerAddress}</p>
                        <p className="text-[10px] text-stone-500">{selectedOrder.customerBairro} • {selectedOrder.customerCity}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Itens do Pedido</p>
                  <div className="space-y-2 bg-stone-50/50 p-3 rounded-xl border border-stone-200">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="text-xs py-1.5 border-b border-stone-100 last:border-0 flex justify-between gap-4">
                        <div>
                          <p className="font-bold text-stone-800">{item.quantity}x {item.name}</p>
                          {item.notes && <p className="text-[10px] text-orange-600 font-medium mt-0.5">Obs: {item.notes}</p>}
                        </div>
                        <span className="font-mono text-stone-600 shrink-0">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="bg-stone-900 text-white p-4 rounded-xl text-xs space-y-2 font-mono shadow-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>Taxa de Entrega:</span>
                    <span>R$ {selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span>Desconto:</span>
                      <span>- R$ {selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm border-t border-stone-800 pt-2">
                    <span>TOTAL:</span>
                    <span className="text-orange-400 text-base font-bold">R$ {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Logs / History */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-stone-400" />
                    Histórico de Alterações (Auditoria)
                  </p>
                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl max-h-[150px] overflow-y-auto space-y-3 text-[11px]">
                    {selectedOrder.history.map((log) => (
                      <div key={log.id} className="border-l-2 border-stone-300 pl-2.5 py-0.5 space-y-0.5">
                        <div className="flex items-center justify-between text-stone-500">
                          <span className="font-bold text-stone-700">{log.action}</span>
                          <span className="text-[10px]">{new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <p className="text-stone-600 leading-normal">{log.details}</p>
                        <p className="text-[9px] text-stone-400 font-mono">Por: {log.user}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // EDIT MODE ACTIVE
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="font-display font-bold text-stone-900 text-sm">Modo de Edição de Itens</h4>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-stone-500 hover:text-stone-800 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>

                {/* Edit Form */}
                <div className="space-y-3.5 text-xs">
                  {/* Select Order Type */}
                  <div>
                    <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Tipo de Serviço</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Delivery', 'Retirada', 'Balcão'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setEditType(t as any)}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            editType === t
                              ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-3xs'
                              : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100/50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer details edit */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase mb-0.5">Cliente</label>
                      <input
                        type="text"
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase mb-0.5">Telefone</label>
                      <input
                        type="text"
                        value={editCustomerPhone}
                        onChange={(e) => setEditCustomerPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium font-mono"
                      />
                    </div>
                  </div>

                  {editType === 'Delivery' && (
                    <div className="space-y-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <p className="text-[10px] text-stone-400 font-bold uppercase">Endereço de Entrega</p>
                      <input
                        type="text"
                        value={editCustomerAddress}
                        placeholder="Rua, número, apto"
                        onChange={(e) => setEditCustomerAddress(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editCustomerBairro}
                          placeholder="Bairro"
                          onChange={(e) => setEditCustomerBairro(e.target.value)}
                          className="bg-white border border-stone-200 rounded px-2 py-1 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                        />
                        <input
                          type="text"
                          value={editCustomerCity}
                          placeholder="Cidade"
                          onChange={(e) => setEditCustomerCity(e.target.value)}
                          className="bg-white border border-stone-200 rounded px-2 py-1 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* Items currently in cart being edited */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Itens Atuais do Pedido</p>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 divide-y divide-stone-100 max-h-[140px] overflow-y-auto">
                      {editItems.map((item, idx) => (
                        <div key={item.id || idx} className="py-2 flex items-center justify-between gap-2 text-xs">
                          <span className="text-stone-700 font-bold">{item.quantity}x {item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-stone-600 font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            <button
                              type="button"
                              onClick={() => setEditItems(editItems.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-600 p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ADD NEW PRODUCT SELECTOR */}
                  <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <p className="text-[10px] text-stone-500 font-bold uppercase">Incluir Itens do Cardápio</p>
                    <div className="flex flex-wrap gap-1 max-h-[110px] overflow-y-auto">
                      {products
                        .filter(
                          (p) =>
                            (currentTenantId === 'tenant-1' && p.id.startsWith('p-1')) ||
                            (currentTenantId === 'tenant-2' && p.id.startsWith('p-2'))
                        )
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => addProductToEditItems(p)}
                            className="bg-white hover:bg-orange-50 text-[10px] text-stone-700 px-2 py-1 rounded border border-stone-200 flex items-center gap-1 transition-all cursor-pointer font-bold"
                          >
                            <Plus className="w-2.5 h-2.5 text-orange-600" />
                            {p.name}
                          </button>
                        ))}
                    </div>

                    {/* Specialized custom pizza inclusion helper for Pizzarias */}
                    {currentTenantId === 'tenant-1' && (
                      <div className="border-t border-stone-200/60 pt-2.5 mt-2 space-y-2">
                        <p className="text-[10px] text-orange-700 font-bold uppercase flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Montador de Pizza customizada
                        </p>
                        
                        {/* Size Selection */}
                        <div className="space-y-0.5">
                          <label className="block text-[8px] text-stone-400 font-bold uppercase">Tamanho da Pizza</label>
                          <select
                            value={selectedSize.id}
                            onChange={(e) => {
                              const sz = pizzaSizes.find((s) => s.id === e.target.value);
                              if (sz) {
                                setSelectedSize(sz);
                                if (selectedFraction > sz.maxFlavors) {
                                  setSelectedFraction(sz.maxFlavors as any);
                                }
                              }
                            }}
                            className="w-full bg-white text-[10px] border border-stone-200 text-stone-700 rounded px-1.5 py-1 focus:outline-none focus:border-orange-500"
                          >
                            {pizzaSizes.map((sz) => (
                              <option key={sz.id} value={sz.id}>
                                {sz.name} ({sz.diameter}) - R$ {sz.basePrice.toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Division buttons */}
                        <div className="space-y-0.5">
                          <label className="block text-[8px] text-stone-400 font-bold uppercase">Frações Disponíveis</label>
                          <div className="grid grid-cols-4 gap-1">
                            {[1, 2, 3, 4].map((f) => {
                              const disabled = f > selectedSize.maxFlavors;
                              return (
                                <button
                                  key={f}
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => setSelectedFraction(f as any)}
                                  className={`py-1 text-[9px] rounded font-bold border transition-all ${
                                    disabled
                                      ? 'opacity-30 cursor-not-allowed bg-stone-100 border-stone-150 text-stone-300'
                                      : selectedFraction === f
                                      ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-3xs'
                                      : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 cursor-pointer'
                                  }`}
                                >
                                  {f === 1 ? '1 Sabor' : f === 2 ? '1/2 Sabor' : f === 3 ? '1/3 Sabor' : '1/4 Sabor'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Flavor dropdown simulators */}
                        <div className="space-y-0.5">
                          <label className="block text-[8px] text-stone-400 font-bold uppercase">Sabores da Pizza</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {Array.from({ length: selectedFraction }).map((_, i) => (
                              <select
                                key={i}
                                value={selectedFlavors[i]?.id || ''}
                                onChange={(e) => {
                                  const flv = pizzaFlavors.find((f) => f.id === e.target.value);
                                  if (flv) {
                                    const copy = [...selectedFlavors];
                                    copy[i] = flv;
                                    setSelectedFlavors(copy);
                                  }
                                }}
                                className="bg-white text-[10px] border border-stone-200 text-stone-700 rounded px-1.5 py-1 focus:outline-none focus:border-orange-500"
                              >
                                {pizzaFlavors.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name} {f.isSpecial ? `(+R$ ${f.additionalPrice})` : ''}
                                  </option>
                                ))}
                              </select>
                            ))}
                          </div>
                        </div>

                        {/* Border Selection */}
                        <div className="flex gap-2">
                          <select
                            value={selectedBorder?.id || ''}
                            onChange={(e) => {
                              const b = pizzaBorders.find((border) => border.id === e.target.value);
                              setSelectedBorder(b);
                            }}
                            className="w-full bg-white text-[10px] border border-stone-200 text-stone-700 rounded px-1.5 py-1 focus:outline-none focus:border-orange-500"
                          >
                            <option value="">Sem Borda</option>
                            {pizzaBorders.map((b) => (
                              <option key={b.id} value={b.id}>
                                Borda: {b.name} (+R$ {b.price})
                              </option>
                            ))}
                          </select>
                          
                          <button
                            type="button"
                            onClick={addCustomPizzaToEdit}
                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] px-2.5 py-1 rounded shrink-0 transition-all shadow-3xs cursor-pointer"
                          >
                            Incluir Pizza (R$ {calculatePizzaPrice(selectedFraction, selectedFlavors.slice(0, selectedFraction), selectedBorder, selectedSize).toFixed(2)})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Discount / Notes */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase mb-0.5">Desconto (R$)</label>
                      <input
                        type="number"
                        value={editDiscount}
                        onChange={(e) => setEditDiscount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase mb-0.5">Observações Gerais</label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Save actions */}
                  <button
                    type="button"
                    onClick={saveOrderEdits}
                    className="w-full flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Alterações & Registrar Histórico
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-24 text-stone-400 text-xs">
              Selecione um pedido da lista para ver os detalhes completos, rastreabilidade de histórico e fazer alterações operacionais rápidas.
            </div>
          )}
        </div>
      </div>

      {/* -------------------- PRINT MEDIA HIDDEN CONTENT -------------------- */}
      {printOrder && createPortal(
        <div className={`print-area-wrapper hidden print:block ${printPaperWidth === '58mm' ? 'print-width-58' : ''}`} style={{ fontFamily: "'JetBrains Mono', monospace", color: '#000', lineHeight: '1.45', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 3px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentTenantId === 'tenant-1' ? 'Resenha Pizzaria & Esfiharia' : 'Pizzaria Dona Carmem'}
            </h3>
            <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 'bold' }}>Lages - SC • Fone: (49) 99988-7766</p>
            <p style={{ margin: '4px 0', fontSize: '11px' }}>---------------------------------------------</p>
            <p style={{ fontWeight: 'black', margin: '4px 0', fontSize: '14px', textTransform: 'uppercase', background: '#000', color: '#fff', padding: '3px 0', textAlign: 'center' }}>
              {printType === 'Cozinha' ? 'TICKET DE COZINHA' : 'CUPOM DE PEDIDO (NÃO FISCAL)'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '11px' }}>---------------------------------------------</p>
          </div>

          <div style={{ marginBottom: '12px', fontSize: '12px', lineHeight: '1.5' }}>
            <p style={{ margin: '3px 0' }}><strong>CUPOM Nº:</strong> <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{printOrder.orderNumber}</span></p>
            <p style={{ margin: '3px 0' }}><strong>DATA/HORA:</strong> {new Date(printOrder.createdAt).toLocaleString('pt-BR')}</p>
            <p style={{ margin: '3px 0' }}><strong>TIPO:</strong> <span style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>{printOrder.type === 'Delivery' ? '🏍️ DELIVERY / ENTREGA' : printOrder.type === 'Retirada' ? '🥡 RETIRADA' : '🏪 BALCÃO'}</span></p>
            <p style={{ margin: '3px 0' }}><strong>CLIENTE:</strong> <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{printOrder.customerName.toUpperCase()}</span></p>
            {printType === 'Completo' && (
              <>
                <p style={{ margin: '3px 0' }}><strong>FONE:</strong> <span style={{ fontWeight: 'bold' }}>{printOrder.customerPhone}</span></p>
                {printOrder.customerAddress && (
                  <div style={{ margin: '6px 0', padding: '6px', border: '2px solid #000', borderRadius: '4px', background: '#f9f9f9' }}>
                    <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: '#000' }}>📍 ENDEREÇO DE ENTREGA:</p>
                    <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>{printOrder.customerAddress}</p>
                    <p style={{ margin: '2px 0', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>BAIRRO: {printOrder.customerBairro || 'N/I'} • {printOrder.customerCity || 'LAGES'}</p>
                  </div>
                )}
                <p style={{ margin: '3px 0' }}><strong>FORMA PAGAM.:</strong> <span style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>{printOrder.paymentMethod || 'Pix'}</span></p>
              </>
            )}
          </div>

          <p style={{ margin: '4px 0', fontSize: '11px' }}>=============================================</p>
          <p style={{ fontWeight: 'bold', margin: '6px 0', textTransform: 'uppercase', fontSize: '13px', textAlign: 'center', letterSpacing: '1px' }}>🛒 ITENS DO PEDIDO</p>
          <p style={{ margin: '4px 0', fontSize: '11px' }}>=============================================</p>

          <div style={{ margin: '8px 0' }}>
            {printOrder.items.map((item) => {
              const isCombo = item.isCombo || item.name.toLowerCase().includes('combo');
              if (isCombo) {
                const parsed = parseComboDetails(item.name);
                const isCocaDrink = parsed.drink.toLowerCase().includes('coca');

                const comboFractionLabel = parsed.flavors.length === 1 ? '1 SABOR' : `${parsed.flavors.length} SABORES`;
                const comboFractionMultiplier = parsed.flavors.length === 1 ? '' : `1/${parsed.flavors.length}`;
                const comboFlavorMarker = parsed.flavors.length === 1 ? '' : `${comboFractionMultiplier} `;

                return (
                  <div key={item.id} style={{ marginBottom: '18px', borderBottom: '2px dashed #000', paddingBottom: '12px', lineHeight: '1.5' }}>
                    {/* Line 1: Quantity and Combo Name with Pizza Size */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px' }}>
                      <span><strong>{item.quantity}x {parsed.comboTitle.toUpperCase()} - {parsed.pizzaSize.toUpperCase()}</strong></span>
                      {printType === 'Completo' && (
                        <span><strong>R$ {(item.price * item.quantity).toFixed(2)}</strong></span>
                      )}
                    </div>

                    {/* Fraction descriptor */}
                    <div style={{ fontSize: '12px', margin: '4px 0', color: '#000', fontWeight: 'bold' }}>
                      <span>- {comboFractionLabel}</span>
                    </div>

                    {/* Flavors list */}
                    {parsed.flavors.map((fl, idx) => {
                      const ingredients = getIngredientsForFlavor(fl);
                      return (
                        <div key={idx} style={{ marginLeft: '8px', marginBottom: '5px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            <strong>• {comboFlavorMarker}{fl.toUpperCase()}</strong>
                          </div>
                          {ingredients && (
                            <div style={{ fontSize: '11px', color: '#333', fontStyle: 'italic', marginLeft: '12px', lineHeight: '1.2' }}>
                              ({ingredients.toLowerCase()})
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Highlighted Brotinho doce */}
                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', marginTop: '6px', borderLeft: '4px solid #000', paddingLeft: '8px', background: '#f5f5f5', textTransform: 'uppercase' }}>
                      <strong>🍓 BROTINHO: {parsed.sweetFlavor.toUpperCase()}</strong>
                    </div>

                    {/* Drink / Refrigerante */}
                    {isCocaDrink ? (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', marginTop: '6px', borderLeft: '4px solid #000', paddingLeft: '8px', background: '#f5f5f5', textTransform: 'uppercase' }}>
                        <strong>🥤 BEBIDA: {parsed.drink.toUpperCase()}</strong>
                      </div>
                    ) : (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', marginTop: '6px', textTransform: 'uppercase' }}>
                        • BEBIDA: {parsed.drink.toUpperCase()}
                      </div>
                    )}

                    {/* Surcharges / Extras */}
                    {item.cocaDifference && item.cocaDifference > 0 && (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', marginTop: '4px', color: '#000' }}>
                        <strong>• DIFERENÇA COCA-COLA: + R$ {item.cocaDifference.toFixed(2)}</strong>
                      </div>
                    )}

                    {/* Item Notes */}
                    {item.notes && (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '6px', borderLeft: '4px solid #000', paddingLeft: '8px', background: '#f5f5f5' }}>
                        <strong>OBS: {item.notes.toUpperCase()}</strong>
                      </div>
                    )}
                  </div>
                );
              }

              const isPizza = item.isPizza || item.name.toLowerCase().includes('pizza');
              if (isPizza) {
                const flavors = getFlavorsFromItem(item);
                const sizeText = getPizzaSizeText(item);
                const fractionLabel = item.fraction === 1 ? '1 SABOR' : item.fraction === 2 ? '2 SABORES' : item.fraction === 3 ? '3 SABORES' : item.fraction === 4 ? '4 SABORES' : `${flavors.length || 1} SABOR(ES)`;
                const fractionMultiplier = item.fraction ? `1/${item.fraction}` : `1/${flavors.length || 1}`;
                const flavorMarker = item.fraction === 1 ? '' : `${fractionMultiplier} `;

                return (
                  <div key={item.id} style={{ marginBottom: '18px', borderBottom: '2px dashed #000', paddingBottom: '12px', lineHeight: '1.5' }}>
                    {/* Line 1: Quantity and Item name */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px' }}>
                      <span><strong>{item.quantity}x {sizeText.toUpperCase()}</strong></span>
                      {printType === 'Completo' && (
                        <span><strong>R$ {(item.price * item.quantity).toFixed(2)}</strong></span>
                      )}
                    </div>
                    
                    {/* Fraction descriptor */}
                    <div style={{ fontSize: '12px', margin: '4px 0', color: '#000', fontWeight: 'bold' }}>
                      <span>- {fractionLabel}</span>
                    </div>
                    
                    {/* Flavors list */}
                    {flavors.map((fl, idx) => {
                      const ingredients = getIngredientsForFlavor(fl);
                      return (
                        <div key={idx} style={{ marginLeft: '8px', marginBottom: '5px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            <strong>• {flavorMarker}{fl.toUpperCase()}</strong>
                          </div>
                          {ingredients && (
                            <div style={{ fontSize: '11px', color: '#333', fontStyle: 'italic', marginLeft: '12px', lineHeight: '1.2' }}>
                              ({ingredients.toLowerCase()})
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Border info */}
                    {item.border && (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', marginTop: '4px' }}>
                        <strong>• BORDA: {item.border.name.toUpperCase()}</strong>
                      </div>
                    )}

                    {/* Surcharges / Extras */}
                    {item.cocaDifference && item.cocaDifference > 0 && (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', marginTop: '4px', color: '#000' }}>
                        <strong>• DIFERENÇA COCA-COLA: + R$ {item.cocaDifference.toFixed(2)}</strong>
                      </div>
                    )}
                    
                    {/* Item Notes */}
                    {item.notes && (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '6px', borderLeft: '4px solid #000', paddingLeft: '8px', background: '#f5f5f5' }}>
                        <strong>OBS: {item.notes.toUpperCase()}</strong>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={item.id} style={{ marginBottom: '18px', borderBottom: '2px dashed #000', paddingBottom: '12px', lineHeight: '1.5' }}>
                    {/* Line 1: Quantity and Item name */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px' }}>
                      <span><strong>{item.quantity}x {item.name.toUpperCase()}</strong></span>
                      {printType === 'Completo' && (
                        <span><strong>R$ {(item.price * item.quantity).toFixed(2)}</strong></span>
                      )}
                    </div>

                    {/* Surcharges / Extras */}
                    {item.cocaDifference && item.cocaDifference > 0 && (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px', marginTop: '4px', color: '#000' }}>
                        <strong>• DIFERENÇA COCA-COLA: + R$ {item.cocaDifference.toFixed(2)}</strong>
                      </div>
                    )}
                    
                    {/* Item Notes */}
                    {item.notes && (
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '6px', borderLeft: '4px solid #000', paddingLeft: '8px', background: '#f5f5f5' }}>
                        <strong>OBS: {item.notes.toUpperCase()}</strong>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>

          <p style={{ margin: '4px 0', fontSize: '11px' }}>=============================================</p>

          {printType === 'Completo' ? (
            <div style={{ margin: '10px 0', fontSize: '12px', fontWeight: 'bold', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal' }}>
                <span>Subtotal dos itens:</span>
                <span>R$ {printOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              {printOrder.deliveryFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal' }}>
                  <span>Taxa de Entrega:</span>
                  <span>R$ {printOrder.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {printOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal', color: 'red' }}>
                  <span>Descontos:</span>
                  <span>- R$ {printOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold', borderTop: '2px solid #000', paddingTop: '8px', marginTop: '8px' }}>
                <span><strong>TOTAL GERAL:</strong></span>
                <span style={{ fontSize: '20px', fontWeight: '900' }}><strong>R$ {printOrder.total.toFixed(2)}</strong></span>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '10px', fontSize: '12px', textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', margin: '4px 0', textTransform: 'uppercase', background: '#000', color: '#fff', padding: '2px 0' }}>🔥 IMPRESSÃO COZINHA (PRODUÇÃO) 🔥</p>
            </div>
          )}

          {printOrder.notes && (
            <div style={{ marginTop: '10px', border: '2px solid #000', padding: '8px', fontSize: '12px', background: '#fdfdfd' }}>
              <strong style={{ fontSize: '13px' }}>OBSERVAÇÕES GERAIS DO PEDIDO:</strong>
              <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.4' }}>{printOrder.notes.toUpperCase()}</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px', fontWeight: 'bold' }}>
            <p style={{ margin: '0' }}>Obrigado pela preferência!</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '8px', color: '#666', fontWeight: 'normal' }}>Resenha Sistemas de Gestão</p>
          </div>
        </div>,
        document.body
      )}

      {/* -------------------- 1. POS ORDER FINALIZED SUCCESS MODAL -------------------- */}
      {lastFinalizedOrder && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 text-stone-900 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-3xl">🎉</div>
              <h3 className="text-lg font-black tracking-tight text-stone-900">Pedido Finalizado com Sucesso!</h3>
              <p className="text-xs text-stone-500">O pedido <strong className="text-stone-800 font-mono">{lastFinalizedOrder.orderNumber}</strong> foi salvo e registrado.</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider text-center">Configurações de Impressão</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[9px] text-stone-400 font-bold uppercase mb-1">Largura Bobina</label>
                  <div className="flex bg-stone-200 p-0.5 rounded-lg border border-stone-300">
                    <button
                      type="button"
                      onClick={() => setPrintPaperWidth('80mm')}
                      className={`flex-1 py-1 text-[10px] font-black rounded ${printPaperWidth === '80mm' ? 'bg-white shadow-3xs' : 'text-stone-600'}`}
                    >
                      80mm
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintPaperWidth('58mm')}
                      className={`flex-1 py-1 text-[10px] font-black rounded ${printPaperWidth === '58mm' ? 'bg-white shadow-3xs' : 'text-stone-600'}`}
                    >
                      58mm
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] text-stone-400 font-bold uppercase mb-1">Via do Cupom</label>
                  <div className="flex bg-stone-200 p-0.5 rounded-lg border border-stone-300">
                    <button
                      type="button"
                      onClick={() => setPrintType('Completo')}
                      className={`flex-1 py-1 text-[10px] font-black rounded ${printType === 'Completo' ? 'bg-white shadow-3xs' : 'text-stone-600'}`}
                    >
                      Completo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintType('Cozinha')}
                      className={`flex-1 py-1 text-[10px] font-black rounded ${printType === 'Cozinha' ? 'bg-white shadow-3xs' : 'text-stone-600'}`}
                    >
                      Cozinha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (lastFinalizedOrder) {
                    setPrintOrder(lastFinalizedOrder);
                    printReceiptDirectly(lastFinalizedOrder, printType, printPaperWidth);
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Printer className="w-5 h-5" />
                <span>Imprimir Cupom Agora</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (lastFinalizedOrder) {
                      setPrintOrder(lastFinalizedOrder);
                      setPrintType('Cozinha');
                      printReceiptDirectly(lastFinalizedOrder, 'Cozinha', printPaperWidth);
                    }
                  }}
                  className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold py-2 px-3 text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  ✂️ Via Cozinha
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (lastFinalizedOrder) {
                      setPrintOrder(lastFinalizedOrder);
                      setPrintType('Completo');
                      printReceiptDirectly(lastFinalizedOrder, 'Completo', printPaperWidth);
                    }
                  }}
                  className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold py-2 px-3 text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  💵 Via Balcão
                </button>
              </div>

              <button
                type="button"
                onClick={() => setLastFinalizedOrder(null)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-black py-2.5 rounded-xl transition-all cursor-pointer text-xs"
              >
                Fechar & Novo Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 2. GENERAL ORDER PRINT MODAL (WITH LIVE MOCKUP) -------------------- */}
      {showPrintModal && printOrder && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-900 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-stone-150 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-display font-black text-stone-900 text-sm">Painel de Impressão de Cupom</h3>
                  <p className="text-[10px] text-stone-400 font-mono">Pedido {printOrder.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPrintModal(false);
                  setPrintOrder(null);
                }}
                className="text-stone-400 hover:text-stone-600 font-bold text-xs bg-stone-200/50 hover:bg-stone-200 p-1.5 rounded-full transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Print Panel Controls */}
            <div className="p-4 bg-stone-100 border-b border-stone-200 grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider">Tipo de Cupom</label>
                <div className="flex bg-stone-200 p-1 rounded-xl border border-stone-300">
                  <button
                    type="button"
                    onClick={() => setPrintType('Completo')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${printType === 'Completo' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-800'}`}
                  >
                    📝 Completo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintType('Cozinha')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${printType === 'Cozinha' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-800'}`}
                  >
                    🍳 Cozinha
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider">Largura da Bobina</label>
                <div className="flex bg-stone-200 p-1 rounded-xl border border-stone-300">
                  <button
                    type="button"
                    onClick={() => setPrintPaperWidth('80mm')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${printPaperWidth === '80mm' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-800'}`}
                  >
                    80mm (Padrão)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintPaperWidth('58mm')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${printPaperWidth === '58mm' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-800'}`}
                  >
                    58mm (Estreita)
                  </button>
                </div>
              </div>
            </div>

            {/* Receipt Preview Stage */}
            <div className="p-6 bg-stone-850 flex justify-center overflow-y-auto flex-1 border-b border-stone-200">
              <div 
                className="bg-white p-5 text-black rounded shadow-2xl font-mono border border-stone-200 transition-all duration-200 text-left"
                style={{
                  width: printPaperWidth === '58mm' ? '58mm' : '80mm',
                  minHeight: '280px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                  fontSize: printPaperWidth === '58mm' ? '10px' : '11.5px',
                  lineHeight: '1.25'
                }}
              >
                {/* Header Mockup */}
                <div className="text-center mb-4 space-y-0.5">
                  <h4 className="font-black uppercase text-xs">
                    {currentTenantId === 'tenant-1' ? 'Resenha Pizzaria & Esfiharia' : 'Pizzaria Dona Carmem'}
                  </h4>
                  <p className="text-[9px] text-stone-500">Lages - SC • Fone: (49) 99988-7766</p>
                  <p className="text-[9px] text-stone-300">---------------------------------</p>
                  <p className="font-bold text-[10px] text-stone-800 uppercase">
                    {printType === 'Cozinha' ? 'TICKET DE COZINHA (PRODUÇÃO)' : 'CUPOM DE PEDIDO (BALCÃO)'}
                  </p>
                  <p className="text-[9px] text-stone-300">---------------------------------</p>
                </div>

                {/* Info block Mockup */}
                <div className="space-y-0.5 text-[10px] mb-3">
                  <p><strong>Pedido:</strong> {printOrder.orderNumber}</p>
                  <p><strong>Data/Hora:</strong> {new Date(printOrder.createdAt).toLocaleString('pt-BR')}</p>
                  <p><strong>Serviço:</strong> {printOrder.type === 'Delivery' ? '🏍️ ENTREGA' : printOrder.type === 'Retirada' ? '🥡 RETIRADA' : '🏪 BALCÃO'}</p>
                  <p><strong>Cliente:</strong> {printOrder.customerName}</p>
                  {printType === 'Completo' && (
                    <>
                      <p><strong>Telefone:</strong> {printOrder.customerPhone}</p>
                      {printOrder.customerAddress && (
                        <p className="break-words"><strong>Endereço:</strong> {printOrder.customerAddress}, {printOrder.customerBairro || 'N/I'}, {printOrder.customerCity || 'Lages'}</p>
                      )}
                      <p><strong>Pagam.:</strong> {printOrder.paymentMethod || 'Pix'}</p>
                    </>
                  )}
                </div>

                <p className="text-[9px] text-stone-300 mb-2">=================================</p>
                <p className="font-bold uppercase text-[10.5px] text-center mb-2">ITENS DO PEDIDO</p>
                <p className="text-[9px] text-stone-300 mb-2">=================================</p>

                {/* Items mockup */}
                <div className="space-y-4 mb-3 text-[11px]">
                  {printOrder.items.map((item) => {
                    const isCombo = item.isCombo || item.name.toLowerCase().includes('combo');
                    if (isCombo) {
                      const parsed = parseComboDetails(item.name);
                      const isCocaDrink = parsed.drink.toLowerCase().includes('coca');

                      const comboFractionLabel = parsed.flavors.length === 1 ? '1 SABOR' : `${parsed.flavors.length} SABORES`;
                      const comboFractionMultiplier = parsed.flavors.length === 1 ? '' : `1/${parsed.flavors.length}`;
                      const comboFlavorMarker = parsed.flavors.length === 1 ? '' : `${comboFractionMultiplier} `;

                      return (
                        <div key={item.id} className="border-b border-dashed border-stone-200 pb-3 last:border-0 last:pb-0 leading-relaxed text-black">
                          {/* Line 1: Quantity and Combo Name with Pizza Size */}
                          <div className="flex justify-between font-extrabold text-[13.5px]">
                            <span>{item.quantity}x {parsed.comboTitle.toUpperCase()} - {parsed.pizzaSize.toUpperCase()}</span>
                            {printType === 'Completo' && (
                              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            )}
                          </div>

                          {/* Fraction descriptor */}
                          <div className="text-[11px] text-black font-bold my-0.5">- {comboFractionLabel}</div>

                          {/* Flavors list */}
                          <div className="space-y-1.5 my-1 pl-1">
                            {parsed.flavors.map((fl, idx) => {
                              const ingredients = getIngredientsForFlavor(fl);
                              return (
                                <div key={idx} className="leading-tight">
                                  <div className="font-extrabold text-[12.5px] text-black">
                                    • {comboFlavorMarker}{fl.toUpperCase()}
                                  </div>
                                  {ingredients && (
                                    <div className="text-[10px] text-stone-600 font-medium italic pl-3 leading-tight">
                                      ({ingredients.toLowerCase()})
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Highlighted Brotinho doce */}
                          <div className="bg-stone-100 border-l-2 border-black p-1.5 mt-1.5 text-[12px] font-extrabold text-black uppercase">
                            🍓 BROTINHO: {parsed.sweetFlavor.toUpperCase()}
                          </div>

                          {/* Drink / Refrigerante */}
                          {isCocaDrink ? (
                            <div className="bg-stone-100 border-l-2 border-black p-1.5 mt-1 text-[12px] font-extrabold text-black uppercase">
                              🥤 BEBIDA: {parsed.drink.toUpperCase()}
                            </div>
                          ) : (
                            <div className="font-bold text-[11px] text-stone-700 mt-1 pl-1 uppercase">
                              • BEBIDA: {parsed.drink.toUpperCase()}
                            </div>
                          )}

                          {/* Surcharges / Extras */}
                          {item.cocaDifference && item.cocaDifference > 0 && (
                            <div className="font-extrabold text-[11px] text-stone-700 mt-1 pl-1">
                              - DIFERENÇA COCA-COLA: + R$ {item.cocaDifference.toFixed(2)}
                            </div>
                          )}

                          {/* Item Notes */}
                          {item.notes && (
                            <div className="bg-stone-50 border-l-2 border-black p-1.5 mt-1 text-[12px] font-extrabold text-black">
                              OBS: {item.notes.toUpperCase()}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const isPizza = item.isPizza || item.name.toLowerCase().includes('pizza');
                    if (isPizza) {
                      const flavors = getFlavorsFromItem(item);
                      const sizeText = getPizzaSizeText(item);
                      const fractionLabel = item.fraction === 1 ? '1 SABOR' : item.fraction === 2 ? '2 SABORES' : item.fraction === 3 ? '3 SABORES' : item.fraction === 4 ? '4 SABORES' : `${flavors.length || 1} SABOR(ES)`;
                      
                      return (
                        <div key={item.id} className="border-b border-dashed border-stone-200 pb-3 last:border-0 last:pb-0 leading-relaxed text-black">
                          {/* Line 1: 1x PIZZA GRANDE (40CM) in BOLD (NEGRITO) and LARGER */}
                          <div className="flex justify-between font-extrabold text-[13.5px]">
                            <span>{item.quantity}x {sizeText.toUpperCase()}</span>
                            {printType === 'Completo' && (
                              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            )}
                          </div>
                          
                          {/* Line 2: Quantos sabores */}
                          <div className="text-[11px] text-black font-bold my-0.5">- {fractionLabel}</div>
                          
                          {/* Lines 3-6: Sabores in BOLD (NEGRITO) and UPPERCASE */}
                          <div className="space-y-1.5 my-1 pl-1">
                            {flavors.map((fl, idx) => {
                              const ingredients = getIngredientsForFlavor(fl);
                              return (
                                <div key={idx} className="leading-tight">
                                  <div className="font-extrabold text-[12.5px] text-black">
                                    - SABOR {idx + 1}: {fl.toUpperCase()}
                                  </div>
                                  {ingredients && (
                                    <div className="text-[10px] text-stone-600 font-medium italic pl-3 leading-tight">
                                      ({ingredients.toLowerCase()})
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {item.border && (
                              <div className="font-extrabold text-[11px] text-stone-700">
                                - BORDA: {item.border.name.toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          {/* Line 7: OBS in BOLD (NEGRITO) and UPPERCASE */}
                          {item.notes && (
                            <div className="bg-stone-50 border-l-2 border-black p-1.5 mt-1 text-[12px] font-extrabold text-black">
                              OBS: {item.notes.toUpperCase()}
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div key={item.id} className="border-b border-dashed border-stone-200 pb-3 last:border-0 last:pb-0 leading-relaxed text-black">
                          {/* Line 1: 1x COCA COLA 2L in BOLD (NEGRITO) and LARGER */}
                          <div className="flex justify-between font-extrabold text-[13.5px]">
                            <span>{item.quantity}x {item.name.toUpperCase()}</span>
                            {printType === 'Completo' && (
                              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            )}
                          </div>
                          
                          {/* OBS in BOLD (NEGRITO) and UPPERCASE */}
                          {item.notes && (
                            <div className="bg-stone-50 border-l-2 border-black p-1.5 mt-1 text-[12px] font-extrabold text-black">
                              OBS: {item.notes.toUpperCase()}
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>

                <p className="text-[9px] text-stone-300 mb-2">=================================</p>
 
                 {/* Totals Mockup */}
                 {printType === 'Completo' ? (
                   <div className="space-y-1.5 text-[11px] font-bold text-stone-900">
                     <div className="flex justify-between font-normal text-[10px]">
                       <span>Subtotal:</span>
                       <span>R$ {printOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                     </div>
                     {printOrder.deliveryFee > 0 && (
                       <div className="flex justify-between font-normal text-[10px]">
                         <span>Taxa de Entrega:</span>
                         <span>R$ {printOrder.deliveryFee.toFixed(2)}</span>
                       </div>
                     )}
                     {printOrder.discount > 0 && (
                       <div className="flex justify-between font-normal text-[10px] text-red-600">
                         <span>Desconto:</span>
                         <span>- R$ {printOrder.discount.toFixed(2)}</span>
                       </div>
                     )}
                     <div className="flex justify-between text-xs font-extrabold border-t-2 border-stone-900 pt-2 mt-2">
                       <span className="text-[11px] font-extrabold text-black">TOTAL DO PEDIDO:</span>
                       <span className="text-[16px] font-black text-black">R$ {printOrder.total.toFixed(2)}</span>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center py-2 text-[10px] text-stone-700 font-extrabold uppercase tracking-wider">
                     🍳 IMPRESSÃO COZINHA (PRODUÇÃO) 🍳
                   </div>
                 )}
 
                 {printOrder.notes && (
                   <div className="mt-3 border border-stone-400 p-2 text-[10px]">
                     <strong>Obs. Gerais:</strong>
                     <p className="font-extrabold mt-1 text-black">{printOrder.notes.toUpperCase()}</p>
                   </div>
                 )}

                <div className="text-center mt-6 text-[8px] text-stone-400 space-y-0.5">
                  <p>Obrigado pela preferência!</p>
                  <p className="text-[7px]">Sistemas Resenha</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPrintModal(false);
                  setPrintOrder(null);
                }}
                className="bg-stone-200 hover:bg-stone-350 text-stone-700 font-black px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Voltar / Fechar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (printOrder) {
                    printReceiptDirectly(printOrder, printType, printPaperWidth);
                  }
                }}
                className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                Imprimir Cupom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
