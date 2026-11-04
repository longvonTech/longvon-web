export type VersionedRow = {
  version: number;
  capturedAt: Date | string;
};

export function pickLatestVersion<T extends VersionedRow>(rows: T[]): T | null {
  if (rows.length === 0) return null;
  return [...rows].sort((left, right) => {
    if (left.version !== right.version) return right.version - left.version;
    return new Date(right.capturedAt).getTime() - new Date(left.capturedAt).getTime();
  })[0];
}
