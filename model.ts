export interface Colors {
    product_color: string;
}

export interface Products {
    categories_name: string;
    product_name: string;
    product_color: string;
    selling_price: number;
    image_one: string;
    modified_at: string;
}

export interface ShoppingCart {
    id: number;
    user_id: string;
    product_id: string;
    product_quantity: number;
}

export interface Users {
    id: number;
    email: string;
    password: string;
}