import { EnumDTO } from "./interfaces/enum-dto";

export interface Produto {
  id: string,
  name: string,
  amount: number,
  unity: EnumDTO<number>,
  situation: number
}
