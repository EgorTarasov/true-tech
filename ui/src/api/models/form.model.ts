export namespace FormDto {
  export interface Item {
    id: number;
    name: string;
    imgSrc: string;
    fields: Field[];
  }

  export interface Field {
    id: number;
    type: string;
    label: string;
    placeholder?: string;
  }

  export interface Template {
    fields: number[];
    name: string;
  }

  export interface MobileTopUpTemplate {
    bankCardInfo: {
      cardNumber: number;
      cvc: number;
      expirationDate: string;
    };
    phoneData: {
      phoneNumber: number;
      amount: number;
    };
  }
}
