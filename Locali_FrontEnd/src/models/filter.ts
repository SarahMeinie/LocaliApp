import { category } from 'src/models/category'

export class filter {
  sort: string;
  distance: number;
  categories: category[];
  user: string;
}

export const defaults: filter = {
  sort: 'Nearest',
  distance: 5,
  categories: null,
  user: ''
}
