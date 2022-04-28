export type Seller = {
  id: string;
  name: string;
  products: number;
  selled: number;
};

export type Contest = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  prizes: { name: string; image: string }[];
  selled: number;
};

export type Code = {
  subscription: string;
  serial: string;
  seller?: string;
  selled: boolean;
};
