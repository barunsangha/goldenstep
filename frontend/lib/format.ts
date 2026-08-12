export const num = (x: number) => x.toLocaleString("en-US");

export const money = (x: number) => `$${x.toFixed(2)}`;

/** Whole-dollar money, for headline figures where cents are noise. */
export const money0 = (x: number) => `$${Math.round(x)}`;
