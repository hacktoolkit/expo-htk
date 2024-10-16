import { snakeCaseToCapitalize } from "../string";

export function enumToStr(enumObj: any, val: number): string {
  let name = enumObj[val] as string;
  return snakeCaseToCapitalize(name);
}
