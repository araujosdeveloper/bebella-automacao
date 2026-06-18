export type MenuItem = {
  name: string;
  price: number;
  ingredients?: string;
  image?: string;
};

export const WHATSAPP_NUMBER = "5586999312177";

export const hotDogs: MenuItem[] = [
  { name: "Simples", price: 11, image: "/imagens/simples.png", ingredients: "Pão, salsicha, carne ou frango, milho verde e batata palha." },
  { name: "Tradicional", price: 13, image: "/imagens/tradicional.png", ingredients: "Pão, salsicha, carne, repolho, cenoura, vinagrete, milho verde e batata palha." },
  { name: "Frango", price: 13, image: "/imagens/frango.png", ingredients: "Pão, salsicha, frango, repolho, cenoura, vinagrete, milho verde e batata palha." },
  { name: "Misto", price: 13, image: "/imagens/misto.png", ingredients: "Pão, salsicha, carne, frango, repolho, cenoura, vinagrete, milho verde e batata palha." },
  { name: "Clássico", price: 15, image: "/imagens/classico.png", ingredients: "Pão, salsicha, carne, frango, presunto, queijo, repolho, cenoura, vinagrete, milho verde e batata palha." },
  { name: "Prato", price: 18, image: "/imagens/prato.png", ingredients: "Pão, salsicha, ovo, carne, frango, repolho, cenoura, alface, tomate, vinagrete, milho verde e batata palha." },
  { name: "Costela Desfiada", price: 19, image: "/imagens/costela-desfiada.png", ingredients: "Pão, salsicha, costela desfiada, queijo mussarela, catupiry, cheddar, cebola caramelizada, milho verde e batata palha." },
];

export const combos: MenuItem[] = [
  { name: "3 Clássicos + Guaraná 1L", price: 51.5 },
  { name: "2 Mistos + Coca-Cola lata 350ml", price: 31 },
  { name: "2 Pratos + Guaraná 1L", price: 42.5 },
  { name: "2 Pratos", price: 34.5 },
  { name: "3 Tradicionais + Guaraná 1L", price: 45.5 },
  { name: "2 Clássicos + Coca-Cola 1L", price: 39 },
];

export const additions: MenuItem[] = [
  { name: "Ovo", price: 3 },
  { name: "Queijo e Presunto", price: 4.5 },
  { name: "Salsicha", price: 2 },
  { name: "Requeijão", price: 2 },
  { name: "Cheddar", price: 2 },
  { name: "Queijo Mussarela", price: 4 },
];

export const drinks: MenuItem[] = [
  { name: "Coca-Cola 350ml", price: 6 },
  { name: "Coca-Cola Zero 350ml", price: 6 },
  { name: "Coca-Cola PET 1L", price: 10 },
  { name: "Coca-Cola PET Zero 1L", price: 10 },
  { name: "Coca-Cola retornável 1L", price: 10 },
  { name: "Coca-Cola retornável Zero 1L", price: 10 },
  { name: "Guaraná Antarctica 350ml", price: 6 },
  { name: "Fanta Laranja 350ml", price: 6 },
  { name: "Fanta Uva 350ml", price: 6 },
  { name: "Guaraná Antarctica 1L", price: 8 },
  { name: "Suco natural sob consulta", price: 6 },
];

export const deliveryFees: MenuItem[] = [
  { name: "Joia", price: 5 },
  { name: "Vila do Bec", price: 5 },
  { name: "Planalto Boa Esperança", price: 5 },
  { name: "Baixa do Coco", price: 5 },
  { name: "Miguel Arraes", price: 6 },
  { name: "Parque Alvorada", price: 6 },
  { name: "Demais bairros", price: 8 },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const generalOrderLink = whatsappLink(
  "Olá, vim pelo cardápio digital da Bebella Hot Dog e quero fazer um pedido.",
);

export const itemOrderLink = (itemName: string) =>
  whatsappLink(`Olá, quero montar um pedido com ${itemName} da Bebella Hot Dog.`);
