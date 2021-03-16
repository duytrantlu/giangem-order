export function roundNumber(num: number, range: number = 2) {
  return +`${Math.round(`${num}e+${range}` as any)}e-${range}`;
}