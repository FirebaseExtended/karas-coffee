/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
        weight: string;
        description: string;
        variety: string;
      }
    | {
        type: 'swag';
        description: string;
      }
    | {
        type: 'subscription';
        description: string;
      };
}

export const subscriptions: Product[] = [
  {
    id: 'coffee-club',
    name: "Kara's Coffee Club",
    images: [
      'https://images.unsplash.com/photo-1618381297523-e6c0ab13a5b2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 5,
    description: "Subcribe to Kara's Coffee Club for recipies, coffees and more.",
    metadata: {
      type: 'subscription',
      description: "Subcribe to Kara's Coffee Club for recipies, coffees and more.",
    },
  },
];

export const coffeeBags: Product[] = [
  {
    id: 'loja',
    name: 'Loja',
    images: [
      'https://images.unsplash.com/photo-1562051036-e0eea191d42f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 3,
    description:
      'A fairly acidic coffee with a medium body and a predictable flavor typical of South American coffees.',
    metadata: {
      strength: '3',
      origin: 'Ecuador',
      type: 'coffee',
      weight: '500g',
      description:
        'A fairly acidic coffee with a medium body and a predictable flavor typical of South American coffees.',
      variety: 'Caturra',
    },
  },
  {
    id: 'lizarb',
    name: 'Lizarb',
    images: [
      'https://images.unsplash.com/photo-1562051036-e0eea191d42f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 5,
    description:
      'Lizarb Brazilian coffee has a relatively low acidity, and exhibits a nutty sweet flavor, with a chocolaty roast taste. ',
    metadata: {
      strength: '7',
      origin: 'Brazil',
      type: 'coffee',
      weight: '500g',
      description:
        'Lizarb Brazilian coffee has a relatively low acidity, and exhibits a nutty sweet flavor, with a chocolaty roast taste. ',
      variety: 'Novo',
    },
  },
  {
    id: 'chipinga',
    name: 'Chipinga',
    images: [
      'https://images.unsplash.com/photo-1562051036-e0eea191d42f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 2,
    description: 'Chipinga coffee is a medium-bodied with a medium density and lively berry-like or citrusy acidity.',
    metadata: {
      variety: 'Caltimor',
      origin: 'Zimbabwe',
      type: 'coffee',
      weight: '500g',
      strength: '5',
      description: 'Chipinga coffee is a medium-bodied with a medium density and lively berry-like or citrusy acidity.',
    },
  },
  {
    id: 'kahawa',
    name: 'Kahawa',
    images: [
      'https://images.unsplash.com/photo-1562051036-e0eea191d42f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 4,
    description: 'Kenyan coffee beans have distinctly bright taste with complex tones of fruit and berry.',
    metadata: {
      strength: '9',
      origin: 'Kenya',
      type: 'coffee',
      weight: '500g',
      description: 'Kenyan coffee beans have distinctly bright taste with complex tones of fruit and berry.',
      variety: 'Arabica',
    },
  },
  {
    id: 'sulawesi-toraja',
    name: 'Sulawesi Toraja',
    images: [
      'https://images.unsplash.com/photo-1562051036-e0eea191d42f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 1,
    description:
      'A well balanced coffee that exhibits tasting notes of dark chocolate and ripe fruit with a low-toned yet vibrant acidity.',
    metadata: {
      strength: '10',
      origin: 'Sulawesi',
      type: 'coffee',
      weight: '500g',
      description:
        'A well balanced coffee that exhibits tasting notes of dark chocolate and ripe fruit with a low-toned yet vibrant acidity.',
      variety: 'Arabica',
    },
  },
];

export const merchandise: Product[] = [
  {
    id: 'amazing-mug-white',
    name: 'The Amazing Mug - White',
    images: [
      'https://images.unsplash.com/photo-1605714196241-00bf7a8fe7bb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1530968831187-a937ade474cb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1422207049116-cfaf69531072?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 99,
    description:
      "Drink your coffee in style with our amazing white ceramic mug that's guranteed to turn heads when you drink from it.",
    metadata: {
      type: 'swag',
      description:
        "Drink your coffee in style with our amazing white ceramic mug that's guranteed to turn heads when you drink from it.",
    },
  },
  {
    id: 'amazing-mug-black',
    name: 'The Amazing Mug - Black',
    images: [
      'https://images.unsplash.com/photo-1608085022020-3e5ee70c4e42?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1487099174927-da3cd6408862?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1448932284983-0c7b152eba33?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ],
    price_usd: 99,
    description:
      "Drink your coffee in style with our amazing black ceramic mug that's guranteed to turn heads when you drink from it.",
    metadata: {
      type: 'swag',
      description:
        "Drink your coffee in style with our amazing black ceramic mug that's guranteed to turn heads when you drink from it.",
    },
  },
  {
    id: 'french-press',
    name: 'French Press',
    images: [
      'https://images.unsplash.com/photo-1581471995013-64d59dd04675?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1583577012061-d69d2dbc900a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1598639298075-9f62f1fc5463?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 12,
    description:
      'This iconic French press (or cafetière) is a must for your coffee making experience with heat-resistant borosilicate glass that won’t alter or impair your coffee’s natural flavor.',
    metadata: {
      type: 'swag',
      description:
        'This iconic French press (or cafetière) is a must for your coffee making experience with heat-resistant borosilicate glass that won’t alter or impair your coffee’s natural flavor.',
    },
  },
  {
    id: 'pitcher',
    name: 'Pitcher',
    images: [
      'https://images.unsplash.com/photo-1537817236549-8265e0da25d5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1620360289928-dacf4e46f604?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
      'https://images.unsplash.com/photo-1495862433577-132cf20d7902?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640',
    ], // TODO: Add image
    price_usd: 17,
    description:
      'Hard wearing and durable pitcher for busy coffee shops and caterers. Measuring lines are etched on the inside so that it is easy to add the correct amount of milk for each serving of latte, cappuccino or hot chocolate',
    metadata: {
      type: 'swag',
      description:
        'Hard wearing and durable pitcher for busy coffee shops and caterers. Measuring lines are etched on the inside so that it is easy to add the correct amount of milk for each serving of latte, cappuccino or hot chocolate',
    },
  },
];

export const products: Product[] = [...subscriptions, ...merchandise, ...coffeeBags];
