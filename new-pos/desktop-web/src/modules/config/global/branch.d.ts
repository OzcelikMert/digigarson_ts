interface GlobalBranchDataDocument {
  categories: {
    _id: string;
    is_sub_category: boolean;
    image: string;
    title: string;
    branch: string;
    slug: string;
    parent_category: null | string;
  }[];
  products: {
    _id: string;
    active_list: number[];
    options: {
      option_id: string;
      is_forced_choice: boolean;
    }[];
    prices: {
      order_type: number[];
      _id: string;
      price_name: string;
      currency: string;
      vat_rate: number;
      amount: number;
      price: number;
      createdAt: string;
      updatedAt: string;
    }[];
    end_time: string;
    start_time: string;
    image: string;
    branch: string;
    category: string;
    description: string;
    title: string;
    sale_type: number;
    stock_code: string;
    favorite: boolean;
    opportunity: boolean;
  }[];
  sections: {
    _id: string;
    title: string;
  }[];
  tables: any[];
  options: {
    _id: string;
    items: {
      price: number;
      amount: number;
      _id: string;
      item_name: string;
    }[];
    state: number;
    choose_limit: number;
    type: number;
    special_name: string;
    name: string;
    branch: string;
  }[];
}

interface GlobalBranchDataSetDocument {
  categories?: {
    _id: string;
    is_sub_category: boolean;
    image: string;
    title: string;
    branch: string;
    slug: string;
    parent_category: null | string;
  }[];
  products?: {
    _id: string;
    active_list: number[];
    options: {
      option_id: string;
      is_forced_choice: boolean;
    }[];
    prices: {
      order_type: number[];
      _id: string;
      price_name: string;
      currency: string;
      vat_rate: number;
      amount: number;
      price: number;
      createdAt: string;
      updatedAt: string;
    }[];
    end_time: string;
    start_time: string;
    image: string;
    branch: string;
    category: string;
    description: string;
    title: string;
    sale_type: number;
    stock_code: string;
    favorite: boolean;
    opportunity: boolean;
  }[];
  sections?: {
    _id: string;
    title: string;
  }[];
  tables?: any[];
  options?: {
    _id: string;
    items: {
      price: number;
      amount: number;
      _id: string;
      item_name: string;
    }[];
    state: number;
    choose_limit: number;
    type: number;
    special_name: string;
    name: string;
    branch: string;
  }[];
}

export { GlobalBranchDataDocument, GlobalBranchDataSetDocument };
