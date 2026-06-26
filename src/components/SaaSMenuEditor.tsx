/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, PizzaSapor, PizzaBorder } from '../types';
import { pizzaFlavors, pizzaBorders, products, saveProducts, savePizzaFlavors, savePizzaBorders } from '../data/mockData';
import { Plus, Trash2, Edit3, Settings, ShieldCheck, Tag, Sparkles, X, Check, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

interface SaaSMenuEditorProps {
  currentTenantId: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  dayOfWeek: 'Tuesday' | 'Wednesday' | 'Everyday' | string;
  active: boolean;
  rulesText: string;
}

export default function SaaSMenuEditor({ currentTenantId }: SaaSMenuEditorProps) {
  // Tabs: 'menu' (Cardápio e Preços) | 'promotions' (Promoções)
  const [activeTab, setActiveTab] = useState<'menu' | 'promotions'>('menu');
  const [activeCategory, setActiveCategory] = useState<'Pizza' | 'Hamburguer' | 'Bebida' | 'Acompanhamento' | 'Combo'>('Pizza');
  
  // Local state initialized with live storage references
  const [productList, setProductList] = useState<Product[]>(products);
  const [flavorsList, setFlavorsList] = useState<PizzaSapor[]>(pizzaFlavors);
  const [bordersList, setBordersList] = useState<PizzaBorder[]>(pizzaBorders);

  // Promotions local storage loading
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('saas_promotions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
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
    ];
  });

  // Save promotions back to localStorage
  const handleSavePromotions = (newPromos: Promotion[]) => {
    setPromotions(newPromos);
    localStorage.setItem('saas_promotions', JSON.stringify(newPromos));
  };

  // Add/Edit Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Pizza' | 'Hamburguer' | 'Bebida' | 'Acompanhamento' | 'Combo'>('Pizza');
  const [formPrice, setFormPrice] = useState(0);
  const [formDescription, setFormDescription] = useState('');
  const [formIsCombo, setFormIsCombo] = useState(false);
  const [formComboItems, setFormComboItems] = useState<{ productName: string; quantity: number; removable: boolean }[]>([]);

  // Promotion Form State
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoEditingId, setPromoEditingId] = useState<string | null>(null);
  const [promoName, setPromoName] = useState('');
  const [promoDescription, setPromoDescription] = useState('');
  const [promoDayOfWeek, setPromoDayOfWeek] = useState('Tuesday');
  const [promoRulesText, setPromoRulesText] = useState('');

  // Filter products by Tenant
  const tenantProducts = productList.filter(
    (p) =>
      (currentTenantId === 'tenant-1' && p.id.startsWith('p-1')) ||
      (currentTenantId === 'tenant-2' && p.id.startsWith('p-2'))
  );

  // Open modal to add product
  const handleOpenAddModal = (category: typeof activeCategory, isComboType = false) => {
    setIsEditing(false);
    setSelectedProductId(null);
    setFormName('');
    setFormCategory(isComboType ? 'Combo' : category);
    setFormPrice(isComboType ? 99.90 : 25.00);
    setFormDescription('');
    setFormIsCombo(isComboType);
    setFormComboItems(isComboType ? [
      { productName: 'Pizza Grande 40cm', quantity: 1, removable: false },
      { productName: 'Pizza Broto Doce', quantity: 1, removable: false },
      { productName: 'Coca Cola 1.5L', quantity: 1, removable: true }
    ] : []);
    setShowProductModal(true);
  };

  // Open modal to edit product
  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setSelectedProductId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormDescription(product.description || '');
    setFormIsCombo(!!product.isCombo);
    setFormComboItems(product.comboItems ? [...product.comboItems] : []);
    setShowProductModal(true);
  };

  // Save product form
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let updatedList: Product[];
    if (isEditing && selectedProductId) {
      updatedList = productList.map((p) => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            name: formName,
            category: formCategory,
            price: formPrice,
            description: formDescription,
            isCombo: formIsCombo || formCategory === 'Combo',
            comboItems: (formIsCombo || formCategory === 'Combo') ? formComboItems : undefined,
          };
        }
        return p;
      });
    } else {
      // Generate ID matching tenant prefix
      const prefix = currentTenantId === 'tenant-1' ? 'p-1' : 'p-2';
      const newProd: Product = {
        id: `${prefix}${Date.now()}`,
        name: formName,
        category: formCategory,
        price: formPrice,
        description: formDescription,
        isCombo: formIsCombo || formCategory === 'Combo',
        comboItems: (formIsCombo || formCategory === 'Combo') ? formComboItems : undefined,
      };
      updatedList = [...productList, newProd];
    }

    setProductList(updatedList);
    saveProducts(updatedList); // Writes to localStorage & references in-place!
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Deseja realmente remover este item do cardápio?')) {
      const updated = productList.filter((p) => p.id !== id);
      setProductList(updated);
      saveProducts(updated);
    }
  };

  // Combo item configuration helpers
  const handleAddComboItem = () => {
    setFormComboItems([...formComboItems, { productName: 'Novo Item', quantity: 1, removable: true }]);
  };

  const handleUpdateComboItem = (index: number, field: string, value: any) => {
    const updated = formComboItems.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormComboItems(updated);
  };

  const handleRemoveComboItem = (index: number) => {
    setFormComboItems(formComboItems.filter((_, idx) => idx !== index));
  };

  // Promotion helpers
  const handleOpenPromoModal = (promo?: Promotion) => {
    if (promo) {
      setPromoEditingId(promo.id);
      setPromoName(promo.name);
      setPromoDescription(promo.description);
      setPromoDayOfWeek(promo.dayOfWeek);
      setPromoRulesText(promo.rulesText);
    } else {
      setPromoEditingId(null);
      setPromoName('');
      setPromoDescription('');
      setPromoDayOfWeek('Tuesday');
      setPromoRulesText('');
    }
    setShowPromoModal(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName.trim()) return;

    let updatedPromos: Promotion[];
    if (promoEditingId) {
      updatedPromos = promotions.map((p) =>
        p.id === promoEditingId
          ? { ...p, name: promoName, description: promoDescription, dayOfWeek: promoDayOfWeek, rulesText: promoRulesText }
          : p
      );
    } else {
      const newPromo: Promotion = {
        id: `promo-${Date.now()}`,
        name: promoName,
        description: promoDescription,
        dayOfWeek: promoDayOfWeek,
        active: true,
        rulesText: promoRulesText
      };
      updatedPromos = [...promotions, newPromo];
    }

    handleSavePromotions(updatedPromos);
    setShowPromoModal(false);
  };

  const handleTogglePromo = (id: string) => {
    const updated = promotions.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
    handleSavePromotions(updated);
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('Remover esta promoção?')) {
      const updated = promotions.filter((p) => p.id !== id);
      handleSavePromotions(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Menu Header with tab toggle */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
        <div>
          <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-orange-600" />
            Configurações e Campanhas
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Gerencie seu cardápio operacional, monte combos inteligentes e crie campanhas de venda dinâmicas.
          </p>
        </div>
        
        {/* Tab switchers */}
        <div className="flex bg-stone-100 p-1 rounded-xl self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-white text-stone-900 shadow-3xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Cardápio & Preços
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'promotions'
                ? 'bg-white text-stone-900 shadow-3xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Promoções de Venda
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns - Standard Catalog */}
          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-2">
              <div>
                <h4 className="font-display font-bold text-stone-900 text-sm">Produtos e Combos</h4>
                <p className="text-[11px] text-stone-400 font-medium">Cadastre, edite e organize os itens oferecidos.</p>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => handleOpenAddModal(activeCategory, true)}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-3xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Novo Combo
                </button>
                <button
                  onClick={() => handleOpenAddModal(activeCategory, false)}
                  className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-3xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Novo Item
                </button>
              </div>
            </div>

            {/* Categories Tab Selector */}
            <div className="flex gap-1.5 border-b border-stone-100 pb-2.5 overflow-x-auto">
              {(currentTenantId === 'tenant-1' ? ['Pizza', 'Combo', 'Bebida', 'Acompanhamento'] : ['Hamburguer', 'Combo', 'Bebida', 'Acompanhamento']).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-3xs'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div className="space-y-2.5">
              {tenantProducts.filter((p) => p.category === activeCategory).length === 0 ? (
                <div className="text-center py-12 text-xs text-stone-400 font-medium">
                  Nenhum produto cadastrado nesta categoria para esta empresa.
                </div>
              ) : (
                tenantProducts
                  .filter((p) => p.category === activeCategory)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start justify-between p-3.5 bg-stone-50/40 border border-stone-200 rounded-2xl hover:border-stone-300 transition-all group shadow-3xs"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-800 text-xs sm:text-sm">{product.name}</span>
                          {product.isCombo && (
                            <span className="bg-blue-50 text-blue-700 text-[9px] px-1.5 py-0.5 rounded border border-blue-200 font-bold uppercase font-mono">
                              Combo
                            </span>
                          )}
                          {product.isPizza && (
                            <span className="bg-amber-50 text-amber-700 text-[9px] px-1.5 py-0.5 rounded border border-amber-200 font-bold uppercase font-mono">
                              Pizza Custom
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 leading-normal font-medium">{product.description}</p>
                        
                        {/* Combo Items visual list */}
                        {product.comboItems && (
                          <div className="bg-white p-2 rounded-lg border border-stone-150 mt-2">
                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-1">Itens Inclusos:</p>
                            <div className="flex flex-wrap gap-1">
                              {product.comboItems.map((item, idx) => (
                                <span key={idx} className="bg-stone-50 text-[9px] text-stone-600 px-2 py-0.5 rounded border border-stone-200 font-semibold">
                                  {item.quantity}x {item.productName} {item.removable ? '(Removível)' : '(Fixo)'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs font-bold text-stone-700 bg-stone-50 px-2 py-0.5 rounded border border-stone-200 shadow-3xs">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-stone-400 hover:text-stone-800 p-1 rounded-lg hover:bg-stone-100 transition-all cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Right Column - Pizza Extras */}
          {currentTenantId === 'tenant-1' ? (
            <div className="space-y-6">
              {/* Pizza Toppings */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-display font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    Sabores de Pizzas
                  </h4>
                  <button
                    onClick={() => {
                      const name = prompt('Nome do Sabor:');
                      if (!name) return;
                      const spec = confirm('É Sabor Especial (Possui Adicional)?');
                      let price = 0;
                      if (spec) {
                        price = parseFloat(prompt('Valor do Adicional (R$):', '15.00') || '0');
                      }
                      const ing = prompt('Ingredientes:') || '';
                      const updated = [...flavorsList, { id: `f-${Date.now()}`, name, isSpecial: spec, additionalPrice: price, ingredients: ing }];
                      setFlavorsList(updated);
                      savePizzaFlavors(updated);
                    }}
                    className="text-orange-600 hover:text-orange-500 text-xs font-bold cursor-pointer"
                  >
                    + Novo Sabor
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {flavorsList.map((flavor) => (
                    <div key={flavor.id} className="p-2.5 bg-stone-50/40 border border-stone-200 rounded-xl flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-800">{flavor.name}</span>
                          {flavor.isSpecial ? (
                            <span className="bg-amber-50 text-amber-700 text-[9px] px-1 py-0.2 rounded font-bold uppercase border border-amber-200">
                              Esp
                            </span>
                          ) : (
                            <span className="bg-stone-200 text-stone-600 text-[9px] px-1 py-0.2 rounded font-bold uppercase border border-stone-300">
                              Trad
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5 font-medium">{flavor.ingredients}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {flavor.isSpecial && (
                          <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 font-bold">
                            +R${flavor.additionalPrice.toFixed(2)}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Remover sabor "${flavor.name}"?`)) {
                              const updated = flavorsList.filter(f => f.id !== flavor.id);
                              setFlavorsList(updated);
                              savePizzaFlavors(updated);
                            }
                          }}
                          className="text-stone-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pizza Borders */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-display font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    Bordas Recheadas
                  </h4>
                  <button
                    onClick={() => {
                      const name = prompt('Nome da Borda:');
                      if (!name) return;
                      const price = parseFloat(prompt('Valor da Borda (R$):', '14.00') || '0');
                      const spec = confirm('É Borda Especial?');
                      const updated = [...bordersList, { id: `b-${Date.now()}`, name, isSpecial: spec, price }];
                      setBordersList(updated);
                      savePizzaBorders(updated);
                    }}
                    className="text-orange-600 hover:text-orange-500 text-xs font-bold cursor-pointer"
                  >
                    + Nova Borda
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {bordersList.map((border) => (
                    <div key={border.id} className="p-2.5 bg-stone-50/40 border border-stone-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-800">{border.name}</span>
                        <p className="text-[9px] text-stone-500 mt-0.5 font-medium">
                          {border.isSpecial ? 'Categoria Especial' : 'Categoria Tradicional'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 font-bold">
                          R$ {border.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Remover borda "${border.name}"?`)) {
                              const updated = bordersList.filter(b => b.id !== border.id);
                              setBordersList(updated);
                              savePizzaBorders(updated);
                            }
                          }}
                          className="text-stone-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* For Burgers, display active ingredients list or toppings */
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <h4 className="font-display font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Adicionais e Extras (Lanches)
              </h4>
              <p className="text-xs text-stone-500 font-medium">Personalize os adicionais comuns de hambúrgueres e porções.</p>
              
              <div className="space-y-2.5">
                {[
                  { name: 'Bacon Extra (3 fatias)', price: 5.00, category: 'Carnes' },
                  { name: 'Cheddar Cremoso Injetado', price: 6.50, category: 'Queijos' },
                  { name: 'Hambúrguer Extra (Blend 150g)', price: 10.00, category: 'Carnes' },
                  { name: 'Cebola Caramelizada', price: 4.00, category: 'Extras' },
                  { name: 'Molho Secreto Defumado', price: 3.00, category: 'Molhos' },
                ].map((extra, idx) => (
                  <div key={idx} className="p-3 bg-stone-50/40 border border-stone-200 rounded-xl flex items-center justify-between hover:border-stone-350 transition-all">
                    <div>
                      <span className="text-xs font-bold text-stone-850">{extra.name}</span>
                      <span className="block text-[9px] text-stone-400 font-bold uppercase font-mono mt-0.5">{extra.category}</span>
                    </div>
                    <span className="font-mono text-xs text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      +R$ {extra.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Promotions Tab View */
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-5 shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-2">
              <div>
                <h4 className="font-display font-bold text-stone-900 text-sm">Campanhas e Promoções Ativas</h4>
                <p className="text-[11px] text-stone-400 font-medium">Configure promoções para acionar automaticamente e impulsionar vendas no celular do cliente.</p>
              </div>
              <button
                onClick={() => handleOpenPromoModal()}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-3xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Criar Nova Promoção
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className={`border rounded-2xl p-4 transition-all shadow-3xs relative flex flex-col justify-between ${
                    promo.active
                      ? 'bg-orange-50/20 border-orange-200'
                      : 'bg-stone-50/50 border-stone-200 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-stone-800 text-sm">{promo.name}</span>
                      <button
                        onClick={() => handleTogglePromo(promo.id)}
                        className="cursor-pointer text-stone-500 hover:text-stone-800"
                        title={promo.active ? 'Desativar Promoção' : 'Ativar Promoção'}
                      >
                        {promo.active ? (
                          <ToggleRight className="w-8 h-8 text-orange-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-stone-400" />
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs text-stone-500 leading-relaxed font-medium mb-3">{promo.description}</p>
                    
                    <div className="bg-white border border-stone-200/80 rounded-xl p-2.5 mb-3 text-[10px] space-y-1">
                      <div className="flex justify-between text-stone-500">
                        <span className="font-semibold">Dia de Gatilho:</span>
                        <span className="font-black text-orange-700">
                          {promo.dayOfWeek === 'Tuesday' ? 'Terça-feira' : promo.dayOfWeek === 'Wednesday' ? 'Quarta-feira' : 'Todos os dias'}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span className="font-semibold">Regra de Venda:</span>
                        <span className="font-bold text-stone-700">{promo.rulesText}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-2.5 mt-2">
                    <button
                      onClick={() => handleOpenPromoModal(promo)}
                      className="text-stone-500 hover:text-stone-800 text-xs font-bold cursor-pointer flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border border-stone-200"
                    >
                      <Edit3 className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="text-stone-400 hover:text-red-600 text-xs font-bold cursor-pointer flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT & COMBO FORM MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-150 flex items-center justify-between bg-stone-50">
              <h3 className="font-display font-bold text-stone-900 text-sm">
                {isEditing ? `Editar: ${formName}` : formIsCombo ? 'Novo Combo Personalizado' : 'Novo Item do Cardápio'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 font-bold mb-1">Nome do Produto/Combo *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Combo 4 - Casal Feliz"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Categoria *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setFormCategory(cat);
                      if (cat === 'Combo') {
                        setFormIsCombo(true);
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Combo">Combo</option>
                    <option value="Bebida">Bebida</option>
                    <option value="Acompanhamento">Acompanhamento</option>
                    <option value="Hamburguer">Hamburguer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Preço do Produto (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Descrição</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descrição do produto ou dos itens contidos no combo..."
                  rows={2}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Combo switch */}
              <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <input
                  type="checkbox"
                  id="chk-combo"
                  checked={formIsCombo}
                  onChange={(e) => {
                    setFormIsCombo(e.target.checked);
                    if (e.target.checked) {
                      setFormCategory('Combo');
                      if (formComboItems.length === 0) {
                        setFormComboItems([
                          { productName: 'Pizza Grande 40cm', quantity: 1, removable: false },
                          { productName: 'Guaraná 1.5L', quantity: 1, removable: true }
                        ]);
                      }
                    }
                  }}
                  className="rounded border-stone-350 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="chk-combo" className="text-[11px] font-bold text-stone-700 cursor-pointer">
                  Este produto é um Combo (Contém múltiplos itens configuráveis)
                </label>
              </div>

              {/* Dynamic Combo Items Builder */}
              {formIsCombo && (
                <div className="space-y-2 border-t border-stone-150 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">Itens inclusos no Combo</span>
                    <button
                      type="button"
                      onClick={handleAddComboItem}
                      className="text-orange-600 hover:text-orange-500 font-black text-[10px] cursor-pointer"
                    >
                      + Adicionar Item
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {formComboItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            placeholder="Nome do Item inclusos"
                            value={item.productName}
                            onChange={(e) => handleUpdateComboItem(index, 'productName', e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-stone-900 focus:outline-none"
                          />
                        </div>
                        <div className="w-16">
                          <input
                            type="number"
                            min="1"
                            required
                            placeholder="Qtd"
                            value={item.quantity}
                            onChange={(e) => handleUpdateComboItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full bg-white border border-stone-200 rounded px-1.5 py-0.5 text-[10px] text-center font-mono font-bold text-stone-900 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="checkbox"
                            id={`rem-${index}`}
                            checked={item.removable}
                            onChange={(e) => handleUpdateComboItem(index, 'removable', e.target.checked)}
                            className="rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                          />
                          <label htmlFor={`rem-${index}`} className="text-[9px] font-semibold text-stone-500">
                            Removível
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveComboItem(index)}
                          className="text-stone-400 hover:text-red-500 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="border-t border-stone-150 pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl border border-stone-250 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black px-4 py-2 rounded-xl shadow-3xs cursor-pointer"
                >
                  {isEditing ? 'Atualizar Item' : 'Criar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROMOTION FORM MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-stone-150 flex items-center justify-between bg-stone-50">
              <h3 className="font-display font-bold text-stone-900 text-sm">
                {promoEditingId ? 'Editar Campanha' : 'Criar Nova Campanha de Venda'}
              </h3>
              <button
                type="button"
                onClick={() => setShowPromoModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 font-bold mb-1">Título da Promoção *</label>
                <input
                  type="text"
                  required
                  value={promoName}
                  onChange={(e) => setPromoName(e.target.value)}
                  placeholder="Ex: Quinta da Borda Grátis 🍕"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Descrição Comercial *</label>
                <textarea
                  required
                  value={promoDescription}
                  onChange={(e) => setPromoDescription(e.target.value)}
                  placeholder="Texto que aparecerá em destaque no celular do cliente..."
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Dia de Ativação *</label>
                  <select
                    value={promoDayOfWeek}
                    onChange={(e) => setPromoDayOfWeek(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900 focus:outline-none"
                  >
                    <option value="Tuesday">Terça-feira</option>
                    <option value="Wednesday">Quarta-feira</option>
                    <option value="Thursday">Quinta-feira</option>
                    <option value="Friday">Sexta-feira</option>
                    <option value="Saturday">Sábado</option>
                    <option value="Sunday">Domingo</option>
                    <option value="Everyday">Todos os dias</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-bold mb-1">Regra / Gatilho *</label>
                  <input
                    type="text"
                    required
                    value={promoRulesText}
                    onChange={(e) => setPromoRulesText(e.target.value)}
                    placeholder="Ex: Borda com 100% de desconto"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="border-t border-stone-150 pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl border border-stone-250 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black px-4 py-2 rounded-xl shadow-3xs cursor-pointer"
                >
                  {promoEditingId ? 'Atualizar Campanha' : 'Ativar Campanha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
