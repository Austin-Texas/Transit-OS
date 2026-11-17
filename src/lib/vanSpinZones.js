// Which way the nose points in each turnaround frame, so the part zones can
// follow the van as it spins.
const FRONT_SIDE = ["left", "left", "right", "center", "left", "right", "right", "center"];

// The van is framed the same in every photo, roughly 8% to 92% of the stage
// width. Zones are bands of that span: the nose (engine), the roof (climate),
// the tail (cabin and tanks) and the middle floor (electrical).
export function spinZones(frame) {
  const front = FRONT_SIDE[frame] ?? "center";
  const nose = front === "left" ? [8, 27] : front === "right" ? [73, 92] : [26, 74];
  const tail = front === "left" ? [62, 92] : front === "right" ? [8, 38] : [8, 92];

  return [
    { key: "engine", label: "Engine", left: nose[0], right: nose[1], top: 44, bottom: 78 },
    { key: "cabin", label: "Cabin", left: tail[0], right: tail[1], top: 36, bottom: 68 },
    { key: "water_tank", label: "Fresh water", left: tail[0], right: tail[1], top: 68, bottom: 92 },
    { key: "battery", label: "Electrical", left: 38, right: 62, top: 66, bottom: 92 },
    { key: "climate", label: "Roof AC", left: 30, right: 70, top: 10, bottom: 34 },
  ];
}