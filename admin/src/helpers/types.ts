export type Seller = {
  id: string;
  name: string;
  products: number;
  selled: number;
};

export type Contest = {
  id: string;
  title: string;
  titleAr: string;
  start: Date;
  end: Date;
  prizes: { name: string; image: string }[];
  selled: number;
  sellers: number;
  total: number;
};

export type Code = {
  serial: string;
  seller?: string;
  selled: boolean;
};

export type Application = {
  id: string;
  name: string;
  age: number;
};