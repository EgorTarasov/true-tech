export namespace AuthDto {
  export interface Item {
    user_id: number;
    auth_type: string;
    role: number;
  }

  export interface Account {
    cardInfo: {
      cardNumber: number;
      cvc: number;
      expirationDate: string;
    };
    name: string;
  }

  export interface Card {
    id: number;
    name: string;
    balance: number;
    cardNumber: number;
  }
}
