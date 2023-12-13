/**
 * Check if a value it's a number:
 * First check typeof (for the primitive type),
 * Second check self-equality to make sure it's not NaN,
 * Third check Infinity to make sure it's not Infinity
 * @param { * } value - The value to check
 * @return { boolean } Whether that value is a number
 */
export function isNumber(value: any): boolean {
  // First: Check typeof and make sure it returns number
  if (typeof value !== 'number') return false;

  // Second: Check for NaN, as NaN is a number to typeof
  // NaN is the only JavaScript value that never equals itself
  if (value !== Number(value)) return false;

  // Third: Check for Infinity
  if (value === Infinity) return false;

  return true;
}