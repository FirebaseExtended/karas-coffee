interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price_usd: number;
  metadata:
    | {
        strength: string;
        origin: string;
        type: 'coffee';
        description: string;
        variety: string;
      }
    | {
        type: 'swag';
        description: string;
      };
}

export const coffees: Product[] = [
  {
    id: 'loja',
    name: 'Loja',
    images: [
      'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 12,
    description:
      'A fairly acidic coffee with a medium body and a predictable flavor typical of South American coffees.',
    metadata: {
      strength: '3',
      origin: 'Ecuador',
      type: 'coffee',
      description:
        'A fairly acidic coffee with a medium body and a predictable flavor typical of South American coffees.',
      variety: 'Caturra',
    },
  },
  {
    id: 'lizarb',
    name: 'Lizarb',
    images: [
      'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 9,
    description:
      'Lizarb Brazilian coffee has a relatively low acidity, and exhibits a nutty sweet flavor, with a chocolaty roast taste. ',
    metadata: {
      strength: '7',
      origin: 'Brazil',
      type: 'coffee',
      description:
        'Lizarb Brazilian coffee has a relatively low acidity, and exhibits a nutty sweet flavor, with a chocolaty roast taste. ',
      variety: 'Novo',
    },
  },
  {
    id: 'chipinga',
    name: 'Chipinga',
    images: [
      'https://images.unsplash.com/photo-1525088553748-01d6e210e00b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 7,
    description: 'Chipinga coffee is a medium-bodied with a medium density and lively berry-like or citrusy acidity.',
    metadata: {
      variety: 'Caltimor',
      origin: 'Zimbabwe',
      type: 'coffee',
      strength: '5',
      description: 'Chipinga coffee is a medium-bodied with a medium density and lively berry-like or citrusy acidity.',
    },
  },
  {
    id: 'kahawa',
    name: 'Kahawa',
    images: [
      'https://images.unsplash.com/photo-1552346988-bf70b50d3c98?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 10,
    description: 'Kenyan coffee beans have distinctly bright taste with complex tones of fruit and berry.',
    metadata: {
      strength: '9',
      origin: 'Kenya',
      type: 'coffee',
      description: 'Kenyan coffee beans have distinctly bright taste with complex tones of fruit and berry.',
      variety: 'Arabica',
    },
  },
  {
    id: 'sulawesi-toraja',
    name: 'Sulawesi Toraja',
    images: [
      'https://images.unsplash.com/photo-1498603536246-15572faa67a6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 17,
    description:
      'A well balanced coffee that exhibits tasting notes of dark chocolate and ripe fruit with a low-toned yet vibrant acidity.',
    metadata: {
      strength: '10',
      origin: 'Sulawesi',
      type: 'coffee',
      description:
        'A well balanced coffee that exhibits tasting notes of dark chocolate and ripe fruit with a low-toned yet vibrant acidity.',
      variety: 'Arabica',
    },
  },
];

export const merchandise: Product[] = [
  {
    id: 'amazing-mug',
    name: 'The Amazing Mug',
    images: [
      'https://images.unsplash.com/photo-1605714196241-00bf7a8fe7bb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 99,
    description:
      "Drink your coffee in style with our amazing white ceramic mug that's guranteed to turn heads when you drink from it.",
    metadata: {
      type: 'swag',
      description:
        "Drink your coffee in style with our amazing white ceramic mug that's guranteed to turn heads when you drink from it.",
    },
  },
];

export const products: Product[] = [...merchandise, ...coffees];
