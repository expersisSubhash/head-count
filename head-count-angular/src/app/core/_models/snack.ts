export class Snack {
  name: string;
  id: number;
  default_price: number;
  image_name: string;
  image_url: string;
}

export class TodaysSnack {
  id: number;
  snack_name: String;
  date: Date;
}

export class SnackDayMapping {
  id: Number;
  snack: Snack;
  actual_price: number;
  date: Date;
}
