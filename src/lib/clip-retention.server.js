const DAY_MS = 86_400_000;
export const DEFAULT_RETENTION_DAYS = 30;

const clampDays = (value) => {
  const days = Number(value);
  if (!Number.isFinite(days) || days < 1) return null;
  return Math.min(Math.round(days), 3650);
};

// The owner's saved retention window, falling back to 30 days.
export async function resolveRetentionDays(entities) {
  const page = await entities.ClipSettings.filter({}, { sort: "-created_date", limit: 1 });
  return clampDays(page.items?.[0]?.retention_days) ?? DEFAULT_RETENTION_DAYS;
}

// Removes every surround clip recorded before the cutoff, in batches, so the
// library only keeps the most recent footage.
export async function purgeOldClips(entities, days) {
  const keep = clampDays(days) ?? (await resolveRetentionDays(entities));
  const cutoff = new Date(Date.now() - keep * DAY_MS).toISOString();

  let deleted = 0;
  for (let pass = 0; pass < 20; pass += 1) {
    const result = await entities.SurroundClip.deleteMany({ recorded_at: { $lt: cutoff } });
    const removed = result?.deleted ?? 0;
    deleted += removed;
    if (!removed) break;
  }

  return { days: keep, cutoff, deleted };
}