/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tenant, PizzaSapor, PizzaBorder, PizzaSize, Product, Driver, Order, FinancialTransaction } from '../types';

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

  // Especiais Salgadas (+ R$ 12.00)
  { id: 'f-res-33', name: 'Strogonoff de Carne', isSpecial: true, additionalPrice: 12.00, ingredients: 'Mussarela, filé, ketchup, mostarda, creme de leite e batata palha' },
  { id: 'f-res-34', name: 'Strogonoff de Frango', isSpecial: true, additionalPrice: 10.00, ingredients: 'Mussarela, frango, ketchup, mostarda, creme de leite e batata palha' },
  { id: 'f-res-35', name: 'Coração', isSpecial: true, additionalPrice: 12.00, ingredients: 'Mussarela, coração, tomate e catupiry' },
  { id: 'f-res-36', name: 'Filé com Alho', isSpecial: true, additionalPrice: 14.00, ingredients: 'Mussarela, filé e alho' },
  { id: 'f-res-37', name: 'Filé com Cebola', isSpecial: true, additionalPrice: 14.00, ingredients: 'Mussarela, filé e cebola' },
  { id: 'f-res-38', name: 'Filé com Cheddar', isSpecial: true, additionalPrice: 15.00, ingredients: 'Mussarela, filé e cheddar' },
  { id: 'f-res-39', name: 'Filé com Palhas', isSpecial: true, additionalPrice: 14.00, ingredients: 'Mussarela, filé e batata palha' },
  { id: 'f-res-40', name: 'Filé com Catupiry', isSpecial: true, additionalPrice: 14.00, ingredients: 'Mussarela, filé e catupiry' },
  { id: 'f-res-41', name: 'Filé com 4 Queijos', isSpecial: true, additionalPrice: 15.00, ingredients: 'Mussarela, filé e catupiry 4 queijos' },
  { id: 'f-res-42', name: 'Filé com Doritos', isSpecial: true, additionalPrice: 15.00, ingredients: 'Mussarela, filé, Doritos e cheddar' },
  { id: 'f-res-43', name: 'Bacon com Doritos', isSpecial: true, additionalPrice: 12.00, ingredients: 'Mussarela, bacon, Doritos e cheddar' },

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
    category: 'Pizza',
    price: 79.90,
    description: 'Delicioso calzone recheado gigante de 45 cm.',
  },
  {
    id: 'p-111',
    name: 'Calzone Médio (35 CM)',
    category: 'Pizza',
    price: 69.90,
    description: 'Delicioso calzone recheado médio de 35 cm.',
  },
  {
    id: 'p-112',
    name: 'Calzone Broto (25 CM)',
    category: 'Pizza',
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

export const pizzaFlavors: PizzaSapor[] = loadSaved('saas_pizza_flavors', defaultPizzaFlavors);
export const pizzaBorders: PizzaBorder[] = loadSaved('saas_pizza_borders', defaultPizzaBorders);
export const products: Product[] = loadSaved('saas_products', defaultProducts);

export function saveProducts(newProducts: Product[]) {
  products.length = 0;
  products.push(...newProducts);
  if (typeof window !== 'undefined') {
    localStorage.setItem('saas_products', JSON.stringify(products));
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
