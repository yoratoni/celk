export function strInsert(str: string, index: number, value: string) {
    return str.substring(0, index) + value + str.substring(index);
}