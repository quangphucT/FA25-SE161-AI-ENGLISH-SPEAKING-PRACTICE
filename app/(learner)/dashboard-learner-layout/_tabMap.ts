// Map sidebar index to tab value
export const tabMap = [
  "progress", // Học
  "practice", // Phát âm
  "profile",  // Bảng xếp hạng
  "packages", // Nhiệm vụ
  "topics",   // Hồ sơ
];

export function getTabValue(idx: number) {
  return tabMap[idx] || "progress";
}