export interface Card {
  type: 'DEBIT' | 'VIRTUAL' | 'PREPAID';
  balance: number;
}

export interface User {
  name: string;
  email: string;
  cognome: string;
  cards: Card[];
  secretQuestion?: string;
  secretAnswer?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  user: User;
}
