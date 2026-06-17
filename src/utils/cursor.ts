export function encodeCursor(value: string | number): string {
  return Buffer.from(String(value)).toString('base64url');
}

export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64url').toString('utf8');
}
