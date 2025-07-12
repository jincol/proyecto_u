export interface ProductItem {
  product_id: number;
  name?: string;
  quantity: number;
  unit_price: number;
}

export interface Invoice {
  id: number;
  folio: string;
  client_id: number;
  client_name: string;
  date: string;
  due_date: string;
  subtotal: number;
  taxes: number;
  total: number;
  notes?: string;
  payment_method?: string;
  accounts_receivable?: number;
  status: string;
  products: ProductItem[];
}