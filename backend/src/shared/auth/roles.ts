/** Application roles. Stored as String in the DB, enforced here and via Zod. */
export const ROLES = ["STUDENT", "INSTRUCTOR", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

/** Subscription plans. FREE = free courses + previews; PRO = full access. */
export const PLANS = ["FREE", "PRO"] as const;
export type Plan = (typeof PLANS)[number];
