import { snakeCaseToCapitalize } from '../string';

export type Enum<E> = Record<keyof E, number | string> & { [k: number]: string };

export function enumToSelectOptions<E extends Enum<E>>(
    enumObj: E,
    hiddenValues: number[] = []
): { label: string; value: number }[] {
    return Object.entries(enumObj)
        .filter(
            ([, value]) => typeof value === 'number' && !hiddenValues.includes(value)
        )
        .map(([label, value]) => ({
            label: snakeCaseToCapitalize(label),
            value: value as unknown as number,
        }));
}

export function enumToStr(enumObj: any, val: number): string {
    let name = enumObj[val] as string;
    return snakeCaseToCapitalize(name);
}

export function enumNameList<E extends Enum<E>>(enumObj: E, value: number): string[] {
    const names: string[] = [];

    for (const key in enumObj) {
        const k = key as keyof typeof enumObj;
        if (value & (enumObj[k] as number)) {
            names.push(snakeCaseToCapitalize(k as string));
        }
    }
    return names;
}
