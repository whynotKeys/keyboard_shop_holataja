export interface BookmarkItemData {
  _id: number;
  user_id: number;
  createdAt: string;
  product: {
    _id: number;
    name: string;
    price: number;
    quantity: number;
    buyQuantity: number;
    mainImages: {
      type: 'detail' | 'info';
      originalname: string;
      name: string;
      path: string;
    }[];
    extra: {
      isNew: boolean;
      category: string;
      option: string[];
      description: string;
      summary: string;
      'function-tag': string;
      'soundfile-path': string;
    };
  };
}

export interface BookmarkResData {
  type: string;
  user_id: number;
  target_id: number;
  user: {
    _id: number;
    name: string;
    email: string;
  };
  _id: number;
  createdAt: string;
}
