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
}
