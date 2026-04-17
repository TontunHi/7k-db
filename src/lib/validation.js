import { z } from 'zod'

// --- Common Schemas ---

export const HeroSlugSchema = z.string().min(1).max(255).regex(/^[a-z0-9+_-]+$/i, "Invalid hero slug format")

export const PlatformSchema = z.enum(['youtube', 'tiktok', 'facebook', 'discord', 'other'])

export const TeamHeroesSchema = z.array(z.string().nullable()).length(5, "Team must have exactly 5 slots")

export const SkillRotationSchema = z.union([
  z.array(z.string()),
  z.array(z.object({
    label: z.string().max(50).optional(),
    skill: z.string().nullable()
  }))
])

// --- Feature Specific Schemas ---

export const CastleRushSetSchema = z.object({
  boss_key: z.string().min(1),
  team_name: z.string().max(100).optional().nullable(),
  formation: z.string().min(1),
  pet_file: z.string().optional().nullable(),
  heroes: TeamHeroesSchema,
  skill_rotation: SkillRotationSchema,
  video_url: z.string().url().or(z.string().length(0)).nullable(),
  note: z.string().max(1000).optional().nullable()
})

export const DungeonSetSchema = z.object({
  dungeon_key: z.string().min(1),
  set_index: z.number().int().optional(),
  formation: z.string().min(1),
  pet_file: z.string().optional().nullable(),
  aura: z.string().optional().nullable(),
  heroes: TeamHeroesSchema,
  skill_rotation: SkillRotationSchema,
  video_url: z.string().url().or(z.string().length(0)).nullable(),
  note: z.string().max(1000).optional().nullable()
})

export const RaidSetSchema = z.object({
  raid_key: z.string().min(1),
  set_index: z.number().int().optional(),
  team_name: z.string().max(100).optional().nullable(),
  formation: z.string().min(1),
  pet_file: z.string().optional().nullable(),
  heroes: TeamHeroesSchema,
  skill_rotation: SkillRotationSchema,
  video_url: z.string().url().or(z.string().length(0)).nullable(),
  note: z.string().max(1000).optional().nullable()
})

export const GlobalCreditSchema = z.object({
  platform: PlatformSchema,
  name: z.string().min(1).max(200),
  link: z.string().url("Invalid URL format")
})

export const AdventSetSchema = z.object({
  boss_key: z.string().min(1),
  phase: z.string().default('Phase 1'),
  team_name: z.string().max(100).optional().nullable(),
  formation: z.string().min(1),
  pet_file: z.string().optional().nullable(),
  heroes: TeamHeroesSchema,
  skill_rotation: SkillRotationSchema,
  video_url: z.string().url().or(z.string().length(0)).nullable(),
  note: z.string().max(1000).optional().nullable()
})

export const ArenaTeamSchema = z.object({
  team_name: z.string().max(100).optional().nullable(),
  formation: z.string().min(1),
  pet_file: z.string().optional().nullable(),
  heroes: TeamHeroesSchema,
  skill_rotation: SkillRotationSchema,
  video_url: z.string().url().or(z.string().length(0)).nullable(),
  note: z.string().max(1000).optional().nullable()
})

export const GuildWarTeamSchema = z.object({
  type: z.enum(['attacker', 'defender']),
  team_name: z.string().max(100).optional().nullable(),
  formation: z.string().min(1),
  pet_file: z.string().optional().nullable(),
  heroes: TeamHeroesSchema,
  skill_rotation: SkillRotationSchema,
  video_url: z.string().url().or(z.string().length(0)).nullable(),
  note: z.string().max(1000).optional().nullable(),
  counters: z.array(z.number()).optional().nullable()
})

export const TotalWarSetSchema = z.object({
  tier: z.string().min(1),
  set_name: z.string().max(100).optional().nullable(),
  note: z.string().max(1000).optional().nullable()
})

export const TotalWarTeamSchema = z.object({
  set_id: z.number().int(),
  team_name: z.string().max(100).optional().nullable(),
  formation: z.string().min(1),
  pet_file: z.string().optional().nullable(),
  heroes: TeamHeroesSchema,
  skill_rotation: SkillRotationSchema,
  video_url: z.string().url().or(z.string().length(0)).nullable(),
  note: z.string().max(1000).optional().nullable()
})

export const HeroSchema = z.object({
  filename: z.string().min(1), // Still use filename as input, but it's slugified internally
  name: z.string().min(1).max(200),
  grade: z.string().max(10),
  skillPriority: z.array(z.string()).optional(),
  is_new_hero: z.boolean().optional()
})

export const BuildSchema = z.object({
  cLevel: z.string().or(z.number()), // Supports "C0" or 0
  mode: z.array(z.string()),
  note: z.string().max(1000).optional().nullable(),
  weapons: z.array(z.object({
    image: z.string().optional().nullable(),
    stat: z.string().optional().nullable()
  })),
  armors: z.array(z.object({
    image: z.string().optional().nullable(),
    stat: z.string().optional().nullable()
  })),
  accessories: z.array(z.object({
    image: z.string().optional().nullable(),
    refined: z.string().optional().nullable()
  })),
  substats: z.array(z.string()),
  minStats: z.record(z.string(), z.string().or(z.number())).optional()
})

export const StageSetupSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1).max(200),
  note: z.string().max(1000).optional().nullable(),
  teams: z.array(z.object({
    index: z.number().int(),
    formation: z.string().min(1),
    pet_file: z.string().optional().nullable(),
    heroes: TeamHeroesSchema
  }))
})

/**
 * Helper to validate data and return errors in a standard format
 */
export function validateData(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessages = (result.error.issues || result.error.errors || [])
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    return { success: false, error: errorMessages || result.error.message || "Validation failed" };
  }
  return { success: true, data: result.data };
}

export const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").optional(), // Optional for updates
  role: z.enum(['admin', 'super_admin']),
  permissions: z.array(z.string()).optional()
})
