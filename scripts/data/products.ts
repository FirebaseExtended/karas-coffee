interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price_usd: number;
  metadata: {
    strength: string;
    origin: string;
    description: string;
    variety: string;
  };
}

export const products: Product[] = [
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
      description:
        'A well balanced coffee that exhibits tasting notes of dark chocolate and ripe fruit with a low-toned yet vibrant acidity.',
      variety: 'Arabica',
    },
  },
];
