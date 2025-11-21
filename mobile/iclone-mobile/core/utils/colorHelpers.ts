export function hexToRgba(hex: string, alpha: number): string {
  // Remove leading '#' if present
  const sanitizedHex = hex.replace(/^#/, '');

  // Parse shorthand hex (#abc → #aabbcc)
  const fullHex = sanitizedHex.length === 3
    ? sanitizedHex.split('').map(c => c + c).join('')
    : sanitizedHex;

  if (fullHex.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}