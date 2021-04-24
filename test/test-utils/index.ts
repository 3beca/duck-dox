export const debug = (...args: unknown[]): void =>
    console.log('Test:>', ...args);

export function sel(id: string): string {
    return `[data-test="${id}"]`;
}
