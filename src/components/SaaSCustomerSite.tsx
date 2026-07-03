/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Order, OrderItem, PizzaSapor, PizzaBorder, PizzaSize, Product, Tenant } from '../types';
import { pizzaFlavors, pizzaBorders, products, pizzaSizes } from '../data/mockData';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle, Smartphone, Info, RefreshCw, Search, Gift } from 'lucide-react';
import { Promotion } from './SaaSMenuEditor';

interface SaaSCustomerSiteProps {
  currentTenant: Tenant;
  onAddOrder: (order: Order) => void;
  fullscreenMode?: boolean;
}

interface Bairro {
  name: string;
  fee: number;
}

const initialBairros: Bairro[] = [
  { name: 'Centro', fee: 5.00 },
  { name: 'Consolação', fee: 6.00 },
  { name: 'Bela Vista', fee: 7.00 },
  { name: 'Pinheiros', fee: 8.00 },
  { name: 'Vila Madalena', fee: 9.00 },
  { name: 'Jardins', fee: 10.00 },
  { name: 'Moema', fee: 11.00 },
  { name: 'Butantã', fee: 12.00 },
  { name: 'Araucária', fee: 8.00 },
  { name: 'Bates', fee: 12.00 },
  { name: 'Bom Jesus', fee: 6.00 },
  { name: 'Boqueirão', fee: 8.00 },
  { name: 'Brusque', fee: 9.00 },
  { name: 'Centenário', fee: 6.00 }
];

export default function SaaSCustomerSite({ currentTenant, onAddOrder, fullscreenMode = false }: SaaSCustomerSiteProps) {
  // Navigation inside site
  const [siteTab, setSiteTab] = useState<'menu' | 'pizza' | 'cart' | 'success'>('menu');

  const getRealDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  // Simulated Day of Week for testing promotions
  const [simulatedDay, setSimulatedDay] = useState<string>(() => {
    return fullscreenMode ? getRealDayOfWeek() : 'Tuesday';
  });

  // Promotions State
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    // Load promotions from localStorage
    const saved = localStorage.getItem('saas_promotions');
    if (saved) {
      try {
        setPromotions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setPromotions([
        {
          id: 'promo-1',
          name: 'Terça do Brotinho 🍕',
          description: 'Toda terça-feira, comprando uma Pizza Gigante de 45cm (16 Fatias), você ganha uma Pizza Brotinho (20cm) inteiramente grátis!',
          dayOfWeek: 'Tuesday',
          active: true,
          rulesText: 'Comprar 1 Pizza de 45cm -> Ganhar 1 Pizza Brotinho Grátis'
        },
        {
          id: 'promo-2',
          name: 'Quarta da Borda pela Metade 🏷️',
          description: 'Toda quarta-feira, a borda recheada da sua pizza (tanto tradicional quanto especial) sai com 50% de desconto!',
          dayOfWeek: 'Wednesday',
          active: true,
          rulesText: 'Todas as Bordas Recheadas com 50% de Desconto'
        }
      ]);
    }
  }, [siteTab]);

  // Check which promotion is active today
  const isTuesdayPromoActive = simulatedDay === 'Tuesday' && promotions.find(p => p.id === 'promo-1')?.active;
  const isWednesdayPromoActive = simulatedDay === 'Wednesday' && promotions.find(p => p.id === 'promo-2')?.active;

  // Customer selections
  const [cart, setCart] = useState<{ product: Product; quantity: number; pizzaCustom?: any }[]>([]);
  const [deliveryType, setDeliveryType] = useState<'Delivery' | 'Retirada'>('Delivery');
  
  // Custom pizza builder selections
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(pizzaSizes[4]); // Gigante (45cm) by default
  const [fraction, setFraction] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFlavors, setSelectedFlavors] = useState<PizzaSapor[]>([pizzaFlavors[0]]);
  const [selectedBorder, setSelectedBorder] = useState<PizzaBorder | undefined>(pizzaBorders[0]);

  // Checkout inputs
  const [custName, setCustName] = useState('Mariana Linhares');
  const [custPhone, setCustPhone] = useState('(49) 98765-4321');
  
  // Split Address fields
  const [custRua, setCustRua] = useState('Avenida Marechal Floriano');
  const [custNumero, setCustNumero] = useState('1250');
  const [custComplemento, setCustComplemento] = useState('Ap 401 - Bloco B');

  // Searchable Neighborhood (Bairro) Selector
  const [custBairro, setCustBairro] = useState('Consolação');
  const [bairroSearch, setBairroSearch] = useState('');
  const [showBairroDropdown, setShowBairroDropdown] = useState(false);
  const [selectedBairroFee, setSelectedBairroFee] = useState<number>(6.00);

  const [custCity, setCustCity] = useState('Lages');
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
  const [changeForAmount, setChangeForAmount] = useState(''); // Troco para quanto

  // FREE BROTINHO POPUP / OVERLAY STATE (Terça do Brotinho)
  const [showFreeBrotoModal, setShowFreeBrotoModal] = useState(false);
  const [freeBrotoSearch, setFreeBrotoSearch] = useState('');
  const [selectedFreeBrotoFlavor, setSelectedFreeBrotoFlavor] = useState<PizzaSapor>(pizzaFlavors[44]); // Default Brigadeiro

  // Filter products for active tenant
  const tenantProducts = products.filter(
    (p) =>
      (currentTenant.id === 'tenant-1' && p.id.startsWith('p-1')) ||
      (currentTenant.id === 'tenant-2' && p.id.startsWith('p-2'))
  );

  // Pizza price calculator helper
  const getPizzaPrice = (f: number, flvs: PizzaSapor[], b?: PizzaBorder, sz = selectedSize) => {
    const base = sz ? sz.basePrice : 49.90;
    let specAdd = 0;
    
    // Multiplicador baseado na divisão e capacidade máxima de sabores do tamanho
    const maxFlavors = sz ? sz.maxFlavors : 4;
    const multiplier = maxFlavors / f;

    flvs.forEach((item) => {
      if (item.isSpecial) {
        specAdd += (item.additionalPrice * multiplier);
      }
    });

    // Quarta da Borda 50% discount rule
    const originalBorderPrice = b ? b.price : 0;
    const borderPrice = isWednesdayPromoActive ? originalBorderPrice / 2 : originalBorderPrice;

    return base + specAdd + borderPrice;
  };

  const handleAddSimpleProduct = (prod: Product) => {
    const existing = cart.find((item) => item.product.id === prod.id && !item.pizzaCustom);
    if (existing) {
      setCart(cart.map((item) => item.product.id === prod.id && !item.pizzaCustom ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product: prod, quantity: 1 }]);
    }
  };

  const handleAddCustomPizzaToCart = () => {
    const finalFlavors = selectedFlavors.slice(0, fraction);
    while (finalFlavors.length < fraction) {
      finalFlavors.push(pizzaFlavors[0]);
    }
    
    const price = getPizzaPrice(fraction, finalFlavors, selectedBorder);
    
    let label = 'Inteira';
    if (fraction === 2) label = '2 Sabores';
    if (fraction === 3) label = '3 Sabores';
    if (fraction === 4) label = '4 Sabores';

    const fNames = finalFlavors.map((fl) => fl.name).join(' / ');

    const customPizzaProduct: Product = {
      id: `custom-piz-${Date.now()}`,
      name: `Pizza ${selectedSize.name} (${label}: ${fNames})`,
      category: 'Pizza',
      price: price,
      description: `Borda: ${selectedBorder ? selectedBorder.name : 'Sem Borda'} ${isWednesdayPromoActive ? '(🏷️ 50% desc Borda)' : ''}`,
    };

    const newCart = [...cart, {
      product: customPizzaProduct,
      quantity: 1,
      pizzaCustom: {
        fraction,
        flavors: finalFlavors,
        border: selectedBorder,
        size: selectedSize
      }
    }];

    setCart(newCart);

    // TRIGGER TERÇA DO BROTINHO PROMO OVERLAY!
    // Rule: Buying a Giant Pizza (45cm) on Tuesday triggers 1 free Brotinho (20cm)
    if (isTuesdayPromoActive && selectedSize.id === 'sz-45') {
      setShowFreeBrotoModal(true);
    } else {
      setSiteTab('cart');
    }
  };

  // Add the free brotinho to cart as a separate item with 0.00 price
  const handleConfirmFreeBrotinho = () => {
    const freeBrotinhoProduct: Product = {
      id: `free-broto-${Date.now()}`,
      name: `🍕 Brotinho Grátis (Sabor: ${selectedFreeBrotoFlavor.name})`,
      category: 'Pizza',
      price: 0.00,
      description: '🎉 Brinde da Campanha Terça do Brotinho!'
    };

    setCart([...cart, {
      product: freeBrotinhoProduct,
      quantity: 1
    }]);

    setShowFreeBrotoModal(false);
    setSiteTab('cart');
  };

  // Get total
  const getSubtotal = () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const getDeliveryFee = () => (deliveryType === 'Delivery' ? selectedBairroFee : 0);
  const getTotal = () => getSubtotal() + getDeliveryFee();

  // Submit Simulated Order to Kitchen
  const handleCheckout = () => {
    if (!custName || !custPhone) {
      alert('Favor preencher Nome e Telefone para envio.');
      return;
    }
    if (deliveryType === 'Delivery' && (!custRua || !custNumero || !custBairro)) {
      alert('Favor preencher todos os campos de endereço de entrega.');
      return;
    }

    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const items: OrderItem[] = cart.map((item, idx) => ({
      id: `oi-site-${idx}-${Date.now()}`,
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      isPizza: !!item.pizzaCustom,
      fraction: item.pizzaCustom?.fraction,
      flavors: item.pizzaCustom?.flavors,
      border: item.pizzaCustom?.border,
      size: item.pizzaCustom?.size,
    }));

    // Assemble unified address string from separate fields
    const fullAddress = deliveryType === 'Delivery' 
      ? `${custRua}, nº ${custNumero}${custComplemento ? ` - ${custComplemento}` : ''}`
      : undefined;

    // Build notes incorporating change request
    let generalNotes = '';
    if (paymentMethod === 'Dinheiro' && changeForAmount.trim()) {
      generalNotes = `Troco para R$ ${changeForAmount}.`;
    }

    const newOrder: Order = {
      id: `ord-site-${Date.now()}`,
      tenantId: currentTenant.id,
      orderNumber,
      status: 'Confirmado', // Arrives directly confirmed to the kitchen
      type: deliveryType === 'Delivery' ? 'Delivery' : 'Retirada',
      customerName: custName,
      customerPhone: custPhone,
      customerAddress: fullAddress,
      customerBairro: deliveryType === 'Delivery' ? custBairro : undefined,
      customerCity: deliveryType === 'Delivery' ? custCity : undefined,
      items,
      deliveryFee: getDeliveryFee(),
      discount: 0,
      total: getTotal(),
      paymentMethod,
      notes: generalNotes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: `h-init-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Pedido Criado',
          user: 'Cliente (Site)',
          details: `Enviado online pelo site ${currentTenant.slug}.resengo.app`,
        },
      ],
    };

    onAddOrder(newOrder);
    setCart([]);
    setChangeForAmount('');
    setSiteTab('success');
  };

  // Neighborhood search suggestions
  const filteredBairros = initialBairros.filter(b => 
    b.name.toLowerCase().includes(bairroSearch.toLowerCase())
  );

  return (
    <div className={fullscreenMode ? "w-full min-h-screen bg-stone-50" : "flex flex-col items-center justify-center p-2"}>
      {/* Simulation Controller Header outside the phone */}
      {!fullscreenMode && (
        <div className="w-[330px] bg-stone-800 text-white p-3 rounded-2xl border border-stone-700 shadow-md mb-2.5 text-center">
          <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400">📅 Dia Comercial Simulado</span>
          <div className="flex justify-between gap-1 mt-1.5 overflow-x-auto pb-0.5">
            {[
              { key: 'Sunday', label: 'Dom' },
              { key: 'Monday', label: 'Seg' },
              { key: 'Tuesday', label: 'Ter' },
              { key: 'Wednesday', label: 'Qua' },
              { key: 'Thursday', label: 'Qui' },
              { key: 'Friday', label: 'Sex' },
              { key: 'Saturday', label: 'Sáb' }
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => {
                  setSimulatedDay(d.key);
                  setCart([]); // Reset cart to prevent mixed promo rules
                }}
                className={`flex-1 text-[10px] font-bold py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  simulatedDay === d.key
                    ? 'bg-orange-600 text-white shadow-3xs'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          {/* Active Promos description helper */}
          <div className="text-[9px] text-stone-300 mt-1.5 flex items-center justify-center gap-1">
            {simulatedDay === 'Tuesday' ? (
              <span className="text-orange-400 font-bold">🍕 Terça do Brotinho: Ganhe 1 broto grátis na Pizza Gigante!</span>
            ) : simulatedDay === 'Wednesday' ? (
              <span className="text-emerald-400 font-bold">🏷️ Quarta da Borda: 50% de desconto em todas as bordas!</span>
            ) : (
              <span>Nenhuma promoção comercial padrão hoje.</span>
            )}
          </div>
        </div>
      )}

      {/* Conditional container based on fullscreenMode */}
      <div className={fullscreenMode ? "w-full max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-xl border-x border-stone-200 relative" : "w-[330px] h-[640px] bg-stone-900 border-[8px] border-stone-850 rounded-[38px] overflow-hidden shadow-2xl relative flex flex-col"}>
        {/* Speaker & camera bar */}
        {!fullscreenMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-850 rounded-full z-20 flex items-center justify-center">
            <div className="w-8 h-1 bg-stone-900 rounded-full"></div>
          </div>
        )}

        {/* Browser URL bar representation */}
        {!fullscreenMode && (
          <div className="bg-stone-100 pt-8 pb-2.5 px-4 border-b border-stone-200 flex items-center gap-1.5 text-stone-500 text-[10px]">
            <span className="bg-white border border-stone-200 px-2.5 py-1 rounded-full text-[9px] text-orange-700 font-bold font-mono flex items-center gap-1 shadow-3xs">
              🔒 {currentTenant.slug}.resengo.app
            </span>
            <span className="ml-auto font-mono text-[9px] text-emerald-600 font-bold animate-pulse">● LIVE</span>
          </div>
        )}

        {/* Simulated Site Body */}
        <div className="flex-1 bg-white overflow-y-auto text-stone-750 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-orange-50/40 border-b border-stone-150 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {currentTenant.logo && (currentTenant.logo.startsWith('http') || currentTenant.logo.startsWith('/') || currentTenant.logo.includes('.')) ? (
                <img
                  src={currentTenant.logo}
                  alt={currentTenant.name}
                  className="w-10 h-10 object-contain rounded-xl border border-stone-200 bg-white p-1 shadow-3xs shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.logo-fallback')) {
                      const img = document.createElement('img');
                      img.src = '/logo_do_sistema.png';
                      img.className = 'logo-fallback w-10 h-10 object-contain rounded-xl border border-stone-200 bg-white p-1 shadow-3xs shrink-0';
                      parent.insertBefore(img, parent.firstChild);
                    }
                  }}
                />
              ) : (
                <img
                  src="/logo_do_sistema.png"
                  alt={currentTenant.name}
                  className="w-10 h-10 object-contain rounded-xl border border-stone-200 bg-white p-1 shadow-3xs shrink-0"
                />
              )}
              <div>
                <h4 className="text-xs font-bold text-stone-800 leading-none">{currentTenant.name}</h4>
                <p className="text-[9px] text-stone-500 mt-1 font-medium">Tempo de Entrega: 30-45 min • Taxa: R$ {currentTenant.deliveryFee.toFixed(2)}</p>
              </div>
            </div>

            {/* Fullscreen Info badge or Back to admin link */}
            {fullscreenMode && (
              <div className="flex items-center gap-1.5">
                <a
                  href="#"
                  className="bg-stone-150 hover:bg-stone-200 text-stone-700 border border-stone-250 text-[9px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer font-mono text-center flex items-center"
                  title="Voltar para o Painel Administrativo"
                >
                  PAINEL ADMIN ⚙️
                </a>
              </div>
            )}
          </div>

          {/* ACTIVE DAY PROMO CALLOUTS */}
          {siteTab === 'menu' && (
            <>
              {isTuesdayPromoActive && (
                <div className="mx-3 mt-3 bg-orange-600 text-white p-2.5 rounded-xl border border-orange-500 flex items-start gap-2 animate-pulse shadow-3xs">
                  <Gift className="w-4 h-4 shrink-0 mt-0.5 text-yellow-300" />
                  <div className="text-[9px] leading-tight">
                    <p className="font-bold text-[10px] text-yellow-200">TERÇA DO BROTINHO ATIVA! 🍕</p>
                    <p className="opacity-95 font-medium">Compre uma Pizza Gigante de 45cm e ganhe uma Brotinho Grátis!</p>
                  </div>
                </div>
              )}
              {isWednesdayPromoActive && (
                <div className="mx-3 mt-3 bg-emerald-600 text-white p-2.5 rounded-xl border border-emerald-500 flex items-start gap-2 shadow-3xs">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-yellow-300" />
                  <div className="text-[9px] leading-tight">
                    <p className="font-bold text-[10px] text-yellow-200">QUARTA DA BORDA MEIO PREÇO! 🏷️</p>
                    <p className="opacity-95 font-medium">Todas as bordas recheadas hoje saem com 50% de desconto!</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Site Pages switcher */}
          {siteTab === 'menu' && (
            <div className="flex-1 p-3.5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Cardápio de Hoje</span>
                {cart.length > 0 && (
                  <button
                    onClick={() => setSiteTab('cart')}
                    className="bg-orange-600 text-white font-bold text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 transition-all animate-bounce cursor-pointer shadow-3xs"
                  >
                    <ShoppingBag className="w-2.5 h-2.5" />
                    {cart.reduce((s, c) => s + c.quantity, 0)} Itens
                  </button>
                )}
              </div>

              {/* Fractional Pizza Constructor Shortcut (only for Pizzaria) */}
              {currentTenant.type === 'pizzaria' && (
                <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100 space-y-2 shadow-3xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700 flex items-center gap-1 font-display">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      Monte sua Pizza Fracionada
                    </span>
                  </div>
                  <p className="text-[9px] text-stone-500 leading-normal font-medium">
                    Selecione o tamanho, a quantidade de sabores e escolha bordas especiais de forma simples.
                  </p>
                  <button
                    onClick={() => setSiteTab('pizza')}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] py-2 rounded-xl flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer"
                  >
                    Montar Pizza Agora
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Products list */}
              <div className="space-y-2.5">
                {tenantProducts.map((p) => (
                  <div key={p.id} className="p-2.5 bg-stone-50/50 border border-stone-200/85 rounded-xl flex items-start justify-between gap-2 hover:border-stone-300 transition-all shadow-3xs">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-[11px] font-bold text-stone-800">{p.name}</p>
                        {p.isCombo && (
                          <span className="bg-blue-50 border border-blue-200 text-[8px] px-1 rounded font-black text-blue-700">COMBO</span>
                        )}
                      </div>
                      <p className="text-[9px] text-stone-500 line-clamp-2 leading-tight font-medium">{p.description}</p>
                      <p className="text-[10px] font-mono text-stone-700 font-bold mt-1">R$ {p.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleAddSimpleProduct(p)}
                      className="bg-white hover:bg-orange-600 hover:text-white text-orange-700 border border-stone-200 px-2.5 py-1 rounded-lg text-[10px] transition-all font-bold cursor-pointer shrink-0 shadow-3xs"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOM PIZZA BUILDER PAGE */}
          {siteTab === 'pizza' && (
            <div className="flex-1 p-3.5 space-y-3 pb-6 text-xs overflow-y-auto max-h-[480px]">
              <div className="flex items-center justify-between border-b border-stone-150 pb-1.5">
                <span className="font-bold text-stone-800 font-display">Personalize sua Pizza</span>
                <button onClick={() => setSiteTab('menu')} className="text-stone-400 text-[10px] hover:underline font-bold cursor-pointer">Voltar</button>
              </div>

              {/* Size selector */}
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1.5">1. Escolha o Tamanho</p>
                <div className="grid grid-cols-2 gap-1">
                  {pizzaSizes.map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        if (fraction > sz.maxFlavors) {
                          setFraction(sz.maxFlavors as any);
                        }
                      }}
                      className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedSize.id === sz.id
                          ? 'bg-orange-50 border-orange-350 text-orange-700 font-bold shadow-3xs'
                          : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-[10px] font-bold">{sz.name}</div>
                      <div className="text-[8px] opacity-75 font-medium leading-tight">{sz.diameter} • {sz.slices} fatias • Máx {sz.maxFlavors} {sz.maxFlavors === 1 ? 'sabor' : 'sabores'}</div>
                      <div className="text-[10px] font-mono font-black mt-1 text-stone-800">R$ {sz.basePrice.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Division selector */}
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1.5">2. Como deseja dividir?</p>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((f) => {
                    const isDisabled = f > selectedSize.maxFlavors;
                    return (
                      <button
                        key={f}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setFraction(f as any)}
                        className={`py-1 text-[9px] font-bold rounded-lg border transition-all ${
                          isDisabled
                            ? 'opacity-30 cursor-not-allowed bg-stone-100 border-stone-150 text-stone-300'
                            : fraction === f
                            ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100 cursor-pointer'
                        }`}
                      >
                        {f === 1 ? '1 Sabor' : f === 2 ? '2 Sabores' : f === 3 ? '3 Sabores' : '4 Sabores'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Flavor dropdown selectors */}
              <div className="space-y-1.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">3. Escolha os Sabores</p>
                {Array.from({ length: fraction }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[9px] text-stone-500 font-bold font-mono">Sabor {i + 1}:</span>
                    <select
                      value={selectedFlavors[i]?.id || ''}
                      onChange={(e) => {
                        const f = pizzaFlavors.find((x) => x.id === e.target.value);
                        const copy = [...selectedFlavors];
                        if (f) copy[i] = f;
                        setSelectedFlavors(copy);
                      }}
                      className="bg-white text-[10px] border border-stone-200 rounded-lg px-2 py-1 text-stone-700 font-medium focus:outline-none focus:border-orange-500"
                    >
                      {pizzaFlavors.map((f) => {
                        const maxFlavors = selectedSize ? selectedSize.maxFlavors : 4;
                        const multiplier = maxFlavors / fraction;
                        const realAdd = f.additionalPrice * multiplier;
                        return (
                          <option key={f.id} value={f.id}>
                            {f.name} {f.isSpecial ? `(+R$ ${realAdd.toFixed(2)})` : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ))}
              </div>

              {/* Border selection */}
              <div className="space-y-1">
                <p className="text-[10px] text-stone-400 font-bold uppercase flex items-center justify-between">
                  <span>4. Selecione a Borda</span>
                  {isWednesdayPromoActive && <span className="text-emerald-600 font-black text-[8px] animate-pulse">🏷️ 50% OFF HOJE!</span>}
                </p>
                <select
                  value={selectedBorder?.id || ''}
                  onChange={(e) => {
                    const b = pizzaBorders.find((x) => x.id === e.target.value);
                    setSelectedBorder(b);
                  }}
                  className="w-full bg-white text-[10px] border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 font-medium focus:outline-none"
                >
                  <option value="">Sem Borda (+ R$ 0,00)</option>
                  {pizzaBorders.map((b) => {
                    const price = isWednesdayPromoActive ? b.price / 2 : b.price;
                    return (
                      <option key={b.id} value={b.id}>
                        {b.name} (+R$ {price.toFixed(2)}) {isWednesdayPromoActive ? ' [Promo Meio Preço!]' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Interactive instant pricing feedback */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-250 text-center shadow-3xs">
                <span className="text-[9px] text-stone-400 uppercase font-mono font-bold">Preço calculado</span>
                <p className="text-base font-bold text-emerald-600 font-mono mt-0.5">
                  R$ {getPizzaPrice(fraction, selectedFlavors.slice(0, fraction), selectedBorder).toFixed(2)}
                </p>
                <p className="text-[8px] text-stone-400 leading-none mt-1 font-medium">
                  Tamanho: {selectedSize.name} (R$ {selectedSize.basePrice.toFixed(2)})
                  {selectedBorder && ` + Borda (R$ ${(isWednesdayPromoActive ? selectedBorder.price / 2 : selectedBorder.price).toFixed(2)})`}
                </p>
              </div>

              <button
                onClick={handleAddCustomPizzaToCart}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-3xs cursor-pointer"
              >
                Adicionar à Sacola
              </button>
            </div>
          )}

          {/* CHECKOUT CART PAGE */}
          {siteTab === 'cart' && (
            <div className="flex-1 p-3.5 space-y-3.5 text-xs overflow-y-auto max-h-[500px]">
              <div className="flex items-center justify-between border-b border-stone-150 pb-1.5">
                <span className="font-bold text-stone-850 font-display">Sua Sacola</span>
                <button onClick={() => setSiteTab('menu')} className="text-stone-400 text-[10px] hover:underline font-bold cursor-pointer">Adicionar Itens</button>
              </div>

              {/* Items in Cart */}
              {cart.length === 0 ? (
                <div className="text-center py-12 text-stone-450 text-[11px] italic">Sacola vazia</div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="p-2 bg-stone-50 border border-stone-200 rounded-xl flex justify-between gap-2 text-[10px] shadow-3xs">
                      <div className="flex-1">
                        <p className="font-bold text-stone-800">{item.quantity}x {item.product.name}</p>
                        <p className="text-stone-500 text-[9px] font-medium leading-snug">{item.product.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 self-start mt-0.5">
                        <span className="font-mono text-stone-700 font-bold">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            setCart(cart.filter((_, i) => i !== idx));
                          }}
                          className="text-stone-400 hover:text-red-500 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery or Pickup switcher */}
              <div className="space-y-1">
                <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Como quer receber?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Delivery', 'Retirada'].map((dt) => (
                    <button
                      key={dt}
                      type="button"
                      onClick={() => setDeliveryType(dt as any)}
                      className={`py-1 text-[9px] font-bold rounded-lg border cursor-pointer ${
                        deliveryType === dt
                          ? 'bg-orange-50 border-orange-200 text-orange-700'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      {dt === 'Delivery' ? `Entrega (+ R$ ${selectedBairroFee.toFixed(2)})` : 'Retirar (Grátis)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Customer & Address Fields */}
              <div className="space-y-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <p className="text-[10px] text-stone-450 font-bold uppercase tracking-wider">Seus Dados de Cadastro</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={custName}
                    placeholder="Nome Completo *"
                    onChange={(e) => setCustName(e.target.value)}
                    className="bg-white border border-stone-200 text-[10px] rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={custPhone}
                    placeholder="WhatsApp *"
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="bg-white border border-stone-200 text-[10px] rounded px-2 py-1.5 text-stone-900 focus:outline-none font-mono"
                  />
                </div>

                {deliveryType === 'Delivery' && (
                  <div className="space-y-1.5">
                    {/* Separate street name */}
                    <input
                      type="text"
                      value={custRua}
                      placeholder="Nome da Rua *"
                      onChange={(e) => setCustRua(e.target.value)}
                      className="w-full bg-white border border-stone-200 text-[10px] rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                    />
                    
                    {/* Number & complement split */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={custNumero}
                        placeholder="Número *"
                        onChange={(e) => setCustNumero(e.target.value)}
                        className="bg-white border border-stone-200 text-[10px] rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={custComplemento}
                        placeholder="Comp (Ex: Ap 302)"
                        onChange={(e) => setCustComplemento(e.target.value)}
                        className="bg-white border border-stone-200 text-[10px] rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>

                    {/* Searchable neighborhood (bairro) container */}
                    <div className="relative">
                      <div className="flex items-center gap-1 bg-white border border-stone-200 rounded px-2">
                        <Search className="w-3 h-3 text-stone-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Pesquisar Bairro..."
                          value={bairroSearch || custBairro}
                          onFocus={() => {
                            setBairroSearch('');
                            setShowBairroDropdown(true);
                          }}
                          onChange={(e) => {
                            setBairroSearch(e.target.value);
                            setCustBairro(e.target.value);
                            setShowBairroDropdown(true);
                          }}
                          className="w-full text-[10px] py-1.5 text-stone-900 focus:outline-none font-bold"
                        />
                      </div>
                      
                      {showBairroDropdown && (
                        <div className="absolute left-0 right-0 mt-1 max-h-[110px] overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-lg z-50 p-1 space-y-0.5">
                          {filteredBairros.length === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setShowBairroDropdown(false);
                                setBairroSearch(custBairro);
                              }}
                              className="w-full text-left p-1.5 text-[9px] hover:bg-stone-50 font-bold text-orange-600 block"
                            >
                              + Adicionar Bairro Manual: "{custBairro}"
                            </button>
                          ) : (
                            filteredBairros.map((b, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setCustBairro(b.name);
                                  setBairroSearch(b.name);
                                  setSelectedBairroFee(b.fee);
                                  setShowBairroDropdown(false);
                                }}
                                className="w-full text-left p-1.5 text-[9px] hover:bg-orange-50 rounded font-medium text-stone-800 flex items-center justify-between"
                              >
                                <span>{b.name}</span>
                                <span className="font-mono text-emerald-600 font-bold">R$ {b.fee.toFixed(2)}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method selection */}
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Forma de Pagamento</p>
                <div className="grid grid-cols-3 gap-1">
                  {['Pix', 'Cartão', 'Dinheiro'].map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm as any)}
                      className={`py-1 text-[9px] font-bold rounded-lg border cursor-pointer ${
                        paymentMethod === pm
                          ? 'bg-orange-50 border-orange-200 text-orange-700'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change For Amount Cash option */}
              {paymentMethod === 'Dinheiro' && (
                <div className="p-2 bg-orange-50 rounded-xl border border-orange-200 text-[10px] space-y-1">
                  <label className="block text-stone-700 font-bold">Precisa de troco para quanto? (R$)</label>
                  <input
                    type="number"
                    step="5"
                    placeholder="Ex: 50 ou 100"
                    value={changeForAmount}
                    onChange={(e) => setChangeForAmount(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-stone-900 font-mono font-bold focus:outline-none"
                  />
                </div>
              )}

              {/* Money Totals */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal:</span>
                  <span>R$ {getSubtotal().toFixed(2)}</span>
                </div>
                {deliveryType === 'Delivery' && (
                  <div className="flex justify-between text-stone-500">
                    <span>Taxa de Entrega ({custBairro}):</span>
                    <span>R$ {getDeliveryFee().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-850 font-bold border-t border-stone-200 pt-1.5 font-display text-xs">
                  <span>TOTAL GERAL:</span>
                  <span className="text-emerald-600 font-bold font-mono">R$ {getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-3xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Finalizar Pedido Rápido
              </button>
            </div>
          )}

          {/* SIMULATED SUCCESS SCREEN */}
          {siteTab === 'success' && (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-250 animate-bounce">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-800">Pedido Enviado!</h4>
                <p className="text-[10px] text-stone-500 mt-1 max-w-[200px] mx-auto font-medium">
                  Seu pedido foi integrado diretamente à cozinha do <strong>ResenGO</strong> e já está sendo preparado!
                </p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-left text-[10px] w-full font-mono space-y-1">
                <p className="text-stone-400 font-bold">// Status em Tempo Real</p>
                <p className="text-emerald-600 font-bold">✓ Recebido pelo KDS</p>
                <p className="text-stone-500 font-medium">⌛ Entrando em Produção...</p>
              </div>

              <button
                onClick={() => setSiteTab('menu')}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold px-4 py-2 rounded-xl border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-orange-600" />
                Comprar Novamente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FREE BROTINHO MODAL SECTOR (Terça do Brotinho) */}
      {showFreeBrotoModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-5 w-[310px] border border-stone-200 text-stone-900 space-y-3.5 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="text-3xl">🎉🎁</span>
              <h4 className="text-xs font-black uppercase text-orange-600 tracking-wider">Terça do Brotinho!</h4>
              <p className="text-[10px] text-stone-500 font-bold">Você ganhou uma pizza brotinho grátis! Escolha o sabor abaixo:</p>
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="🔍 Filtrar sabor..."
                value={freeBrotoSearch}
                onChange={(e) => setFreeBrotoSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none"
              />
              
              <select
                value={selectedFreeBrotoFlavor.id}
                onChange={(e) => {
                  const f = pizzaFlavors.find(x => x.id === e.target.value);
                  if (f) setSelectedFreeBrotoFlavor(f);
                }}
                className="w-full bg-white border border-stone-200 rounded px-2 py-1.5 text-[10px] font-bold text-stone-900 focus:outline-none"
              >
                {pizzaFlavors
                  .filter(f => f.name.toLowerCase().includes(freeBrotoSearch.toLowerCase()))
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.isSpecial ? '(Especial)' : '(Tradicional)'}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleConfirmFreeBrotinho}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-2 rounded-xl text-[10px] transition-all shadow-3xs cursor-pointer text-center block"
            >
              Resgatar Brotinho Grátis!
            </button>
          </div>
        </div>
      )}

      {!fullscreenMode && (
        <div className="mt-3 flex items-start gap-1.5 max-w-[290px] text-[10px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200 shadow-3xs">
          <Info className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
          <p className="leading-normal font-medium">
            Mude o <strong>Dia Comercial Simulado</strong> para testar a injeção automática de promoções (Terça ou Quarta) na sacola do cliente!
          </p>
        </div>
      )}
    </div>
  );
}
