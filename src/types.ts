export type Currency = 'ILS';

export interface Product {
	 id: string;
	 name: string;
	 imageUrl: string;
	 price: number; // in shekels
	 weightGrams?: number;
	 per100gPrice?: number;
}

export interface Category {
	 id: string;
	 name: string;
}

export interface CartItem {
	 productId: string;
	 quantity: number;
}

export interface StoreMeta {
	 title: string;
	 rating: number; // 0-10
	 closesAt: string; // e.g. "16:00"
	 deliveryEtaMin: number;
	 deliveryEtaMax: number;
	 minOrder: number;
	 fees: { processingPercent?: number; deliveryFee?: number };
}


