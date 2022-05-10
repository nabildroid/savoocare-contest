export type Seller = {
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
  selled: number;
  sellers: number;
  total: number;
  description: string;
  completed: boolean;
  countries: number[];
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
