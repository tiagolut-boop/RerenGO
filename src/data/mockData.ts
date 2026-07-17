/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tenant, PizzaSapor, PizzaBorder, PizzaSize, PizzaIngredient, Product, Driver, Order, FinancialTransaction, Bairro } from '../types';

export const tenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Resenha Pizzas',
    slug: 'resenha-pizzas',
    logo: '/logo_do_sistema.png',
    type: 'pizzaria',
    deliveryFee: 8.00,
    phone: '(49) 99805-9293',
  },
];

// Pizza Sizes matching the menu perfectly
export const pizzaSizes: PizzaSize[] = [
  { id: 'sz-20', name: 'Brotinho (20cm)', diameter: '20 cm', slices: 4, maxFlavors: 1, basePrice: 36.90 },
  { id: 'sz-25', name: 'Broto (25cm)', diameter: '25 cm', slices: 4, maxFlavors: 2, basePrice: 44.90 },
  { id: 'sz-35', name: 'Média (35cm)', diameter: '35 cm', slices: 8, maxFlavors: 3, basePrice: 74.90 },
  { id: 'sz-40', name: 'Grande (40cm)', diameter: '40 cm', slices: 12, maxFlavors: 3, basePrice: 84.90 },
  { id: 'sz-45', name: 'Gigante (45cm)', diameter: '45 cm', slices: 16, maxFlavors: 4, basePrice: 89.90 },
];

// Pizza Flavors from "Cardápio Resenha"
const defaultPizzaFlavors: PizzaSapor[] = [
  // Tradicionais Salgadas
  { id: 'f-res-1', name: 'A Moda da Resenha', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, calabresa, bacon, milho e catupiry' },
  { id: 'f-res-2', name: 'A Moda do Pizzaiolo', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, calabresa, milho, ervilha, azeitona sem caroço e cheddar' },
  { id: 'f-res-3', name: 'Alcapone', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, presunto, ovo, ervilha e catupiry' },
  { id: 'f-res-4', name: 'Alha D\'Avola', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, calabresa, ervilha, catupiry e alho' },
  { id: 'f-res-5', name: 'Alho e Óleo', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, alho e óleo e tomate' },
  { id: 'f-res-6', name: 'Atum', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, atum, cebola e azeitona' },
  { id: 'f-res-7', name: 'Bacon', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, bacon e tomate' },
  { id: 'f-res-8', name: 'Bacon com Milho', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, bacon e milho' },
  { id: 'f-res-9', name: 'Bacon com Barbecue', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, bacon e barbecue' },
  { id: 'f-res-10', name: 'Bahiana', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, ovos, calabresa moída, cebola e tomate' },
  { id: 'f-res-11', name: 'Bolonhesa', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, carne moída e catupiry' },
  { id: 'f-res-12', name: 'Brócolis com Bacon', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, brócolis, bacon e catupiry' },
  { id: 'f-res-13', name: 'Calabresa', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, calabresa e cebola' },
  { id: 'f-res-14', name: 'Calabresa com Milho', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, calabresa e milho' },
  { id: 'f-res-15', name: 'Catuperu', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, peito de peru, catupiry e tomate' },
  { id: 'f-res-16', name: 'Frango Catupiry', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, frango desfiado, catupiry e tomate' },
  { id: 'f-res-17', name: 'Frango com Cheddar', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, frango desfiado, tomate e cheddar' },
  { id: 'f-res-18', name: 'Frango Caipira', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, frango desfiado, milho e cebola' },
  { id: 'f-res-19', name: 'Italiana', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, bacon, tomate, palmito e cheddar' },
  { id: 'f-res-20', name: '4 Queijos', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, catupiry, parmesão e provolone' },
  { id: 'f-res-21', name: '3 Queijos', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, catupiry e cheddar' },
  { id: 'f-res-22', name: 'Lombinho', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, lombinho e cebola' },
  { id: 'f-res-23', name: 'Marguerita', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, tomate, alho, manjericão e parmesão' },
  { id: 'f-res-24', name: 'Marinara', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, frango, brócolis e catupiry' },
  { id: 'f-res-25', name: 'Mexicana', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, carne moída, pimentão e tomate' },
  { id: 'f-res-26', name: 'Milho', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela e milho' },
  { id: 'f-res-27', name: 'Mussarela', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela e rodelas de tomate' },
  { id: 'f-res-28', name: 'Napolitana', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, rodelas de tomate e azeitona sem caroço' },
  { id: 'f-res-29', name: 'Palmito', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela e palmito' },
  { id: 'f-res-30', name: 'Portuguesa', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, presunto, ovos e cebola' },
  { id: 'f-res-31', name: 'Primavera', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, palmito, tomate picado, azeitona sem caroço e brócolis' },
  { id: 'f-res-32', name: 'Romanesca', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, palmito, ervilha, bacon e catupiry' },

  // Especiais Salgadas (+ R$ 18.00)
  { id: 'f-res-33', name: 'Strogonoff de Carne', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, filé, ketchup, mostarda, creme de leite e batata palha' },
  { id: 'f-res-34', name: 'Strogonoff de Frango', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, frango, ketchup, mostarda, creme de leite e batata palha' },
  { id: 'f-res-35', name: 'Coração', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, coração, tomate e catupiry' },
  { id: 'f-res-36', name: 'Filé com Alho', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, filé e alho' },
  { id: 'f-res-37', name: 'Filé com Cebola', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, filé e cebola' },
  { id: 'f-res-38', name: 'Filé com Cheddar', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, filé e cheddar' },
  { id: 'f-res-39', name: 'Filé com Palhas', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, filé e batata palha' },
  { id: 'f-res-40', name: 'Filé com Catupiry', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, filé e catupiry' },
  { id: 'f-res-41', name: 'Filé com 4 Queijos', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, filé e catupiry 4 queijos' },
  { id: 'f-res-42', name: 'Filé com Doritos', isSpecial: true, additionalPrice: 22.00, ingredients: 'Mussarela, filé, Doritos e cheddar' },
  { id: 'f-res-43', name: 'Bacon com Doritos', isSpecial: true, additionalPrice: 18.00, ingredients: 'Mussarela, bacon, Doritos e cheddar' },

  // Tradicionais Doces
  { id: 'f-res-44', name: 'Banana Nevada', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, banana, chocolate branco, canela e açúcar' },
  { id: 'f-res-45', name: 'Brigadeiro', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate preto, granulado e leite condensado' },
  { id: 'f-res-46', name: 'Chocolate Misto', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate preto e chocolate branco' },
  { id: 'f-res-47', name: 'Chocolate Branco', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela e chocolate branco' },
  { id: 'f-res-48', name: 'Chocolate Preto', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela e chocolate preto' },
  { id: 'f-res-49', name: 'Confete', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, confete (chocolate preto e branco)' },
  { id: 'f-res-50', name: 'Prestígio', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate preto, coco ralado e leite condensado' },
  { id: 'f-res-51', name: 'Sensação', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate preto, morango e chocolate branco' },
  { id: 'f-res-52', name: 'Sonho de Valsa', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate preto, leite condensado e bombom' },
  { id: 'f-res-53', name: 'Paçoquinha', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate preto e paçoquinha' },
  { id: 'f-res-54', name: 'Negresco', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate preto, negresco e leite condensado' },
  { id: 'f-res-55', name: 'Banana Trovoada', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, banana, chocolate preto e chocolate branco' },
  { id: 'f-res-56', name: 'Bis Branco', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate branco e bis branco' },
  { id: 'f-res-57', name: 'Ouro Branco', isSpecial: false, additionalPrice: 0, ingredients: 'Mussarela, chocolate branco, ouro branco e leite condensado' },

  // Especiais Doces (+ R$ 10.00)
  { id: 'f-res-58', name: 'Kit Kat com Morango', isSpecial: true, additionalPrice: 10.00, ingredients: 'Mussarela, chocolate branco, kit Kat e morango' },
  { id: 'f-res-59', name: 'Fini de Banana', isSpecial: true, additionalPrice: 10.00, ingredients: 'Mussarela chocolate branco e fini bananas' },
  { id: 'f-res-60', name: 'Fini de Dentadura', isSpecial: true, additionalPrice: 10.00, ingredients: 'Mussarela chocolate branco e fini dentaduras' },
  { id: 'f-res-61', name: 'Tortuguita', isSpecial: true, additionalPrice: 10.00, ingredients: 'Mussarela, chocolate branco, tortuguita e granulado' },
  { id: 'f-res-62', name: 'Bis Branco com Morango', isSpecial: true, additionalPrice: 10.00, ingredients: 'Mussarela, chocolate branco, bis e morango' },
];

// Pizza Borders matching the menu exactly
const defaultPizzaBorders: PizzaBorder[] = [
  // Tradicionais (R$ 14.00)
  { id: 'b-res-1', name: 'Borda Catupiry', isSpecial: false, price: 14.00 },
  { id: 'b-res-2', name: 'Borda Cheddar', isSpecial: false, price: 14.00 },
  { id: 'b-res-3', name: 'Borda Chocolate Preto', isSpecial: false, price: 14.00 },
  { id: 'b-res-4', name: 'Borda Chocolate Branco', isSpecial: false, price: 14.00 },

  // Especiais (R$ 20.00)
  { id: 'b-res-5', name: 'Borda Catupiry com Frango', isSpecial: true, price: 20.00 },
  { id: 'b-res-6', name: 'Borda Catupiry com Bacon', isSpecial: true, price: 20.00 },
  { id: 'b-res-7', name: 'Borda Catupiry com Calabresa', isSpecial: true, price: 20.00 },
  { id: 'b-res-8', name: 'Borda Chocolate com Confete', isSpecial: true, price: 20.00 },
  { id: 'b-res-9', name: 'Borda Chocolate com Morango', isSpecial: true, price: 20.00 },
];

export const defaultPizzaIngredients: PizzaIngredient[] = [
  { id: 'ing-1', name: 'Alho', price: 3.00 },
  { id: 'ing-2', name: 'Atum', price: 6.00 },
  { id: 'ing-3', name: 'Azeitona sem caroço', price: 4.00 },
  { id: 'ing-4', name: 'Bacon', price: 5.00 },
  { id: 'ing-5', name: 'Banana', price: 4.00 },
  { id: 'ing-6', name: 'Barbecue', price: 3.00 },
  { id: 'ing-7', name: 'Batata palha', price: 3.00 },
  { id: 'ing-8', name: 'Bis', price: 5.00 },
  { id: 'ing-9', name: 'Brócolis', price: 4.00 },
  { id: 'ing-10', name: 'Calabresa', price: 5.00 },
  { id: 'ing-11', name: 'Canela', price: 2.00 },
  { id: 'ing-12', name: 'Carne moída', price: 6.00 },
  { id: 'ing-13', name: 'Catupiry', price: 5.00 },
  { id: 'ing-14', name: 'Cebola', price: 3.00 },
  { id: 'ing-15', name: 'Cheddar', price: 5.00 },
  { id: 'ing-16', name: 'Chocolate branco', price: 6.00 },
  { id: 'ing-17', name: 'Chocolate preto', price: 6.00 },
  { id: 'ing-18', name: 'Coco ralado', price: 3.00 },
  { id: 'ing-19', name: 'Confete', price: 5.00 },
  { id: 'ing-20', name: 'Coração', price: 8.00 },
  { id: 'ing-21', name: 'Creme de leite', price: 3.00 },
  { id: 'ing-22', name: 'Doritos', price: 7.00 },
  { id: 'ing-23', name: 'Ervilha', price: 3.00 },
  { id: 'ing-24', name: 'Filé', price: 10.00 },
  { id: 'ing-25', name: 'Fini', price: 6.00 },
  { id: 'ing-26', name: 'Frango desfiado', price: 5.00 },
  { id: 'ing-27', name: 'Granulado', price: 3.00 },
  { id: 'ing-28', name: 'Kit Kat', price: 7.00 },
  { id: 'ing-29', name: 'Leite condensado', price: 4.00 },
  { id: 'ing-30', name: 'Lombinho', price: 6.00 },
  { id: 'ing-31', name: 'Manjericão', price: 3.00 },
  { id: 'ing-32', name: 'Milho', price: 3.00 },
  { id: 'ing-33', name: 'Morango', price: 5.00 },
  { id: 'ing-34', name: 'Mussarela', price: 5.00 },
  { id: 'ing-35', name: 'Negresco', price: 5.00 },
  { id: 'ing-36', name: 'Ovo', price: 3.00 },
  { id: 'ing-37', name: 'Palmito', price: 6.00 },
  { id: 'ing-38', name: 'Parmesão', price: 4.00 },
  { id: 'ing-39', name: 'Peito de peru', price: 6.00 },
  { id: 'ing-40', name: 'Pimentão', price: 3.00 },
  { id: 'ing-41', name: 'Presunto', price: 4.00 },
  { id: 'ing-42', name: 'Provolone', price: 5.00 },
  { id: 'ing-43', name: 'Rodelas de tomate', price: 3.00 },
];

// Products List for Tenants
const defaultProducts: Product[] = [
  // Resenha Pizzas Products (tenant-1)
  {
    id: 'p-101',
    name: 'Pizza Customizada',
    category: 'Pizza',
    price: 36.90, // Preço base mínimo (brotinho)
    description: 'Escolha o tamanho e monte com seus sabores e bordas favoritos!',
    isPizza: true,
  },
  {
    id: 'p-102',
    name: 'Coca Cola 2L',
    category: 'Bebida',
    price: 14.00,
    description: 'Refrigerante Coca Cola Garrafa de 2 Litros trincando de gelada.',
  },
  {
    id: 'p-103',
    name: 'Coca Cola Zero 2L',
    category: 'Bebida',
    price: 14.00,
    description: 'Refrigerante Coca Cola Zero Açúcar Garrafa de 2 Litros.',
  },
  {
    id: 'p-104',
    name: 'Guaraná Kuat 2 L',
    category: 'Bebida',
    price: 12.00,
    description: 'Refrigerante Guaraná Kuat Garrafa de 2 Litros.',
  },
  {
    id: 'p-105',
    name: 'Água da Serra Laranjinha',
    category: 'Bebida',
    price: 12.00,
    description: 'Refrigerante Laranjinha regional Água da Serra.',
  },
  {
    id: 'p-106',
    name: 'Água da Serra Framboesa',
    category: 'Bebida',
    price: 12.00,
    description: 'Refrigerante Framboesa regional Água da Serra.',
  },
  {
    id: 'p-107',
    name: 'Coca Cola Lata',
    category: 'Bebida',
    price: 5.00,
    description: 'Refrigerante Coca Cola Lata gelada.',
  },
  {
    id: 'p-108',
    name: 'Cerveja Brahma Lata',
    category: 'Bebida',
    price: 5.00,
    description: 'Cerveja Brahma Lata.',
  },
  {
    id: 'p-109',
    name: 'Cerveja Original Lata',
    category: 'Bebida',
    price: 6.00,
    description: 'Cerveja Original Lata.',
  },
  
  // Calzones
  {
    id: 'p-110',
    name: 'Calzone Gigante (45 CM)',
    category: 'Calzones',
    price: 79.90,
    description: 'Delicioso calzone recheado gigante de 45 cm.',
  },
  {
    id: 'p-111',
    name: 'Calzone Médio (35 CM)',
    category: 'Calzones',
    price: 69.90,
    description: 'Delicioso calzone recheado médio de 35 cm.',
  },
  {
    id: 'p-112',
    name: 'Calzone Broto (25 CM)',
    category: 'Calzones',
    price: 49.90,
    description: 'Delicioso calzone recheado broto de 25 cm.',
  },

  // Combos
  {
    id: 'p-113',
    name: 'COMBO 1 - Gigante 45cm',
    category: 'Combo',
    price: 109.90,
    description: '1 Pizza Gigante de 45cm (16 Fatias) + 1 Pizza Broto Doce + 1 Guaraná 1.5L.',
    isCombo: true,
    comboItems: [
      { productName: 'Pizza Gigante 45cm', quantity: 1, removable: false },
      { productName: 'Pizza Broto Doce', quantity: 1, removable: false },
      { productName: 'Guaraná 1.5L', quantity: 1, removable: true },
    ],
  },
  {
    id: 'p-114',
    name: 'COMBO 2 - Grande 40cm',
    category: 'Combo',
    price: 99.90,
    description: '1 Pizza Grande de 40cm (12 Fatias) + 1 Pizza Broto Doce + 1 Guaraná 1.5L.',
    isCombo: true,
    comboItems: [
      { productName: 'Pizza Grande 40cm', quantity: 1, removable: false },
      { productName: 'Pizza Broto Doce', quantity: 1, removable: false },
      { productName: 'Guaraná 1.5L', quantity: 1, removable: true },
    ],
  },
  {
    id: 'p-115',
    name: 'COMBO 3 - Média 35cm',
    category: 'Combo',
    price: 89.90,
    description: '1 Pizza Média de 35cm (8 Fatias) + 1 Pizza Broto Doce + 1 Guaraná 1.5L.',
    isCombo: true,
    comboItems: [
      { productName: 'Pizza Média 35cm', quantity: 1, removable: false },
      { productName: 'Pizza Broto Doce', quantity: 1, removable: false },
      { productName: 'Guaraná 1.5L', quantity: 1, removable: true },
    ],
  },

  // Burger Club Products (tenant-2)
  {
    id: 'p-201',
    name: 'Burger Duplo Cheddar Burger',
    category: 'Hamburguer',
    price: 29.90,
    description: 'Dois blends bovinos de 150g grelhados, cheddar fatiado derretido, maionese defumada.',
  },
  {
    id: 'p-202',
    name: 'Smash Burger Bacon Prime',
    category: 'Hamburguer',
    price: 24.90,
    description: 'Blend de 100g prensado na chapa com cebola, american cheese, muito bacon crocante.',
  },
  {
    id: 'p-203',
    name: 'Giga Burger Gourmet',
    category: 'Hamburguer',
    price: 36.90,
    description: 'Blend Black Angus 180g, queijo coalho grelhado, cebola caramelizada e rúcula.',
  },
  {
    id: 'p-204',
    name: 'Porção Batata Palito P',
    category: 'Acompanhamento',
    price: 12.00,
    description: 'Porção individual de batata frita bem sequinha temperada com sal de páprica.',
  },
  {
    id: 'p-205',
    name: 'Refrigerante Guaraná Antarctica 350ml',
    category: 'Bebida',
    price: 6.00,
    description: 'Lata de guaraná trincando de gelada.',
  },
  {
    id: 'p-206',
    name: 'Combo Smash Duplo Turbinado',
    category: 'Combo',
    price: 44.90,
    description: '1 Smash Burger + 1 Porção de Batata + 1 Refrigerante Lata.',
    isCombo: true,
    comboItems: [
      { productName: 'Smash Burger Bacon Prime', quantity: 1, removable: false },
      { productName: 'Porção Batata Palito P', quantity: 1, removable: true },
      { productName: 'Refrigerante Guaraná Antarctica 350ml', quantity: 1, removable: true },
    ],
  },
  {
    id: 'p-207',
    name: 'Copo Açaí Supremo 500ml',
    category: 'Açai',
    price: 18.00,
    description: 'Açaí premium com morango, banana, leite condensado, leite em pó e granola.',
  },
];

const loadSaved = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return [...defaultValue];
};

export const pizzaFlavors: PizzaSapor[] = loadSaved('saas_pizza_flavors', defaultPizzaFlavors).map(f => {
  const isSweet = f.isSweet !== undefined 
    ? f.isSweet 
    : (f.id.startsWith('f-res-') && parseInt(f.id.replace('f-res-', '')) >= 44);
  
  let additionalPrice = f.additionalPrice;
  if (f.id.startsWith('f-res-')) {
    const idNum = parseInt(f.id.replace('f-res-', ''));
    if (idNum >= 33 && idNum <= 43) {
      if (idNum === 42) {
        if (additionalPrice === 15.00) additionalPrice = 22.00;
      } else {
        if ([10.00, 12.00, 14.00, 15.00].includes(additionalPrice)) {
          additionalPrice = 18.00;
        }
      }
    }
  }
  return { ...f, isSweet, additionalPrice };
});
export const pizzaBorders: PizzaBorder[] = loadSaved('saas_pizza_borders', defaultPizzaBorders);
export const pizzaIngredients: PizzaIngredient[] = loadSaved('saas_pizza_ingredients', defaultPizzaIngredients);
export const products: Product[] = loadSaved('saas_products', defaultProducts);

export function saveProducts(newProducts: Product[]) {
  products.length = 0;
  products.push(...newProducts);
  if (typeof window !== 'undefined') {
    localStorage.setItem('saas_products', JSON.stringify(products));
  }
}

export function savePizzaIngredients(newIngredients: PizzaIngredient[]) {
  pizzaIngredients.length = 0;
  pizzaIngredients.push(...newIngredients);
  if (typeof window !== 'undefined') {
    localStorage.setItem('saas_pizza_ingredients', JSON.stringify(pizzaIngredients));
  }
}

export function savePizzaFlavors(newFlavors: PizzaSapor[]) {
  pizzaFlavors.length = 0;
  pizzaFlavors.push(...newFlavors);
  if (typeof window !== 'undefined') {
    localStorage.setItem('saas_pizza_flavors', JSON.stringify(pizzaFlavors));
  }
}

export function savePizzaBorders(newBorders: PizzaBorder[]) {
  bordersListReferenceUpdate(newBorders);
}

function bordersListReferenceUpdate(newBorders: PizzaBorder[]) {
  pizzaBorders.length = 0;
  pizzaBorders.push(...newBorders);
  if (typeof window !== 'undefined') {
    localStorage.setItem('saas_pizza_borders', JSON.stringify(pizzaBorders));
  }
}

// Drivers
export const drivers: Driver[] = [
  // Resenha Pizzas Drivers
  {
    id: 'driver-101',
    tenantId: 'tenant-1',
    name: 'Douglas Silva (MOTO-01)',
    phone: '(49) 98800-1010',
    pixKey: 'douglas@pix.com',
    vehicle: 'Honda Titan 160',
    plate: 'ABC-1D23',
    commissionPerDelivery: 6.50,
  },
  {
    id: 'driver-102',
    tenantId: 'tenant-1',
    name: 'Carlos Oliveira (MOTO-02)',
    phone: '(49) 98800-1020',
    pixKey: 'carlos@pix.com',
    vehicle: 'Yamaha Fazer 250',
    plate: 'XYZ-9W87',
    commissionPerDelivery: 7.00,
  },
  
  // Burger Club Drivers
  {
    id: 'driver-201',
    tenantId: 'tenant-2',
    name: 'Marcos Rezende (MOTO-05)',
    phone: '(11) 96666-2020',
    pixKey: 'marcos@pix.com',
    vehicle: 'Honda Biz 125',
    plate: 'KML-5J34',
    commissionPerDelivery: 5.50,
  },
];

// Initial Orders (with history log for alterations)
export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    tenantId: 'tenant-1',
    orderNumber: '#0142',
    status: 'Confirmado',
    type: 'Delivery',
    customerName: 'Tiago Lutterbach',
    customerPhone: '(49) 99999-5555',
    customerAddress: 'Av. Marechal Floriano, 150 - Apto 302',
    customerBairro: 'Centro',
    customerCity: 'Lages',
    items: [
      {
        id: 'oi-1',
        productId: 'p-101',
        name: 'Pizza Grande (40cm) (Meio a Meio: A Moda da Resenha / Strogonoff de Carne)',
        quantity: 1,
        price: 90.90, // Base Grande 84.90 + (0% + 50% of 12.00) = 84.90 + 6.00 = 90.90
        isPizza: true,
        fraction: 2,
        flavors: [
          pizzaFlavors[0], // A Moda da Resenha (0)
          pizzaFlavors[32], // Strogonoff de Carne (12.00)
        ],
        border: pizzaBorders[0], // Borda Catupiry (14.00)
        notes: 'Sem cebola na parte de calabresa, por favor.',
        size: pizzaSizes[3], // Grande (40cm)
      },
      {
        id: 'oi-2',
        productId: 'p-102',
        name: 'Coca Cola 2L',
        quantity: 1,
        price: 14.00,
      }
    ],
    deliveryFee: 8.00,
    discount: 0,
    total: 126.90, // 90.90 (pizza) + 14.00 (borda) + 14.00 (coca) + 8.00 (frete) = 126.90
    paymentMethod: 'Pix',
    createdAt: '2026-06-23T19:30:00Z',
    updatedAt: '2026-06-23T19:45:00Z',
    history: [
      { id: 'h-1', timestamp: '2026-06-23T19:30:00Z', action: 'Pedido Criado', user: 'Cliente (Site)', details: 'Criado via site de pedidos' },
      { id: 'h-2', timestamp: '2026-06-23T19:32:00Z', action: 'Confirmado', user: 'Atendimento', details: 'Aprovado pelo gestor' },
      { id: 'h-3', timestamp: '2026-06-23T19:45:00Z', action: 'Pedido Editado', user: 'Gerente Tiago', details: 'Adicionada observação e trocado refrigerante de Guaraná para Coca-Cola 2L' }
    ]
  },
  {
    id: 'ord-102',
    tenantId: 'tenant-1',
    orderNumber: '#0143',
    status: 'Em Produção',
    type: 'Balcão',
    customerName: 'Mariana Costa',
    customerPhone: '(49) 98888-7777',
    items: [
      {
        id: 'oi-3',
        productId: 'p-101',
        name: 'Pizza Gigante (45cm) (Inteira: Coração)',
        quantity: 1,
        price: 101.90, // Base Gigante 89.90 + 12.00 Coração = 101.90
        isPizza: true,
        fraction: 1,
        flavors: [pizzaFlavors[34]], // Coração
        border: pizzaBorders[4], // Borda Catupiry com Frango (+20.00)
        size: pizzaSizes[4], // Gigante
      }
    ],
    deliveryFee: 0,
    discount: 5.00,
    total: 116.90, // 101.90 + 20.00 (borda) - 5.00 (desconto) = 116.90
    paymentMethod: 'Cartão',
    createdAt: '2026-06-23T19:55:00Z',
    updatedAt: '2026-06-23T20:00:00Z',
    history: [
      { id: 'lh-4', timestamp: '2026-06-23T19:55:00Z', action: 'Pedido Criado', user: 'Operador Balcão', details: 'Atendimento presencial' },
      { id: 'lh-5', timestamp: '2026-06-23T20:00:00Z', action: 'Alteração Efetuada', user: 'Operador Balcão', details: 'Aplicado desconto promocional de R$ 5,00 e enviado para a cozinha' }
    ]
  }
];

// Financial Transactions Mock Data
export const initialTransactions: FinancialTransaction[] = [
  { id: 't-1', tenantId: 'tenant-1', type: 'saída', category: 'Aluguel', amount: 3500.00, description: 'Aluguel do Salão Comercial - Junho', date: '2026-06-22' },
  { id: 't-2', tenantId: 'tenant-1', type: 'saída', category: 'Queijo', amount: 840.00, description: 'Compra de 30kg de Mussarela Scala', date: '2026-06-22' },
  { id: 't-3', tenantId: 'tenant-1', type: 'saída', category: 'Gás', amount: 280.00, description: 'Recarga de P45 para forno de pizza', date: '2026-06-22' },
  { id: 't-4', tenantId: 'tenant-1', type: 'entrada', category: 'Recebimento Pedido', amount: 1540.00, description: 'Soma de recebimentos de pedidos - 22/06', date: '2026-06-22' },
];

export const initialBairros: Bairro[] = [
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
