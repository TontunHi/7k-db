import { RowDataPacket } from 'mysql2';

// --- Database Entities ---

export interface Hero extends RowDataPacket {
  filename: string;
  name: string;
  grade: string;
  slug: string;
  skill_priority: string | any[] | null;
  is_new_hero: number;
  sort_order: number;
}

export interface TotalWarSet extends RowDataPacket {
  id: number;
  tier: string;
  set_index: number;
  set_name: string | null;
  note: string | null;
  created_at: string;
}

export interface TotalWarTeam extends RowDataPacket {
  id: number;
  set_id: number;
  team_index: number;
  team_name: string | null;
  formation: string;
  pet_file: string | null;
  heroes_json: string | any[];
  skill_rotation: string | any[];
  video_url: string | null;
  note: string | null;
  created_at: string;
}

export interface AdventSet extends RowDataPacket {
  id: number;
  boss_key: string;
  phase: string;
  set_index: number;
  team_name: string | null;
  formation: string;
  pet_file: string | null;
  heroes_json: string | any[];
  skill_rotation: string | any[];
  hero_builds_json: string | any[];
  video_url: string | null;
  note: string | null;
  created_at: string;
}

export interface ArenaTeam extends RowDataPacket {
  id: number;
  team_index: number;
  team_name: string | null;
  formation: string;
  pet_file: string | null;
  heroes_json: string | any[];
  skill_rotation: string | any[];
  video_url: string | null;
  note: string | null;
  created_at: string;
}

export interface CastleRushSet extends RowDataPacket {
  id: number;
  boss_key: string;
  set_index: number;
  team_name: string | null;
  formation: string;
  pet_file: string | null;
  heroes_json: string | any[];
  skill_rotation: string | any[];
  video_url: string | null;
  note: string | null;
  created_at: string;
}

export interface DungeonSet extends RowDataPacket {
  id: number;
  dungeon_key: string;
  set_index: number;
  team_name: string | null;
  formation: string;
  pet_file: string | null;
  aura: string | null;
  heroes_json: string | any[];
  skill_rotation: string | any[];
  video_url: string | null;
  note: string | null;
  created_at: string;
}

export interface RaidSet extends RowDataPacket {
  id: number;
  raid_key: string;
  set_index: number;
  team_name: string | null;
  formation: string;
  pet_file: string | null;
  heroes_json: string | any[];
  skill_rotation: string | any[];
  video_url: string | null;
  note: string | null;
  created_at: string;
}

export interface GuildWarTeam extends RowDataPacket {
  id: number;
  team_index: number;
  type: 'attacker' | 'defender' | 'general';
  team_name: string | null;
  formation: string;
  pet_file: string | null;
  pet_supports_json: string | any[];
  heroes_json: string | any[];
  selection_order_json: string | any[];
  skill_rotation: string | any[];
  items_json: string | any[];
  video_url: string | null;
  note: string | null;
  counters_json: string | any[];
  counter_teams_json: string | any[];
  created_at: string;
}

export interface GlobalCredit extends RowDataPacket {
  id: number;
  platform: string;
  name: string;
  link: string | null;
  created_at: string;
}

export interface ContactMessage extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'unread' | 'read' | 'archived';
  ip_address: string;
  created_at: string;
}

export interface Pet extends RowDataPacket {
  id: number;
  name: string;
  grade: string;
  atk_all: number;
  def: number;
  hp: number;
  image: string;
  created_at: string;
}

export interface Item extends RowDataPacket {
  id: number;
  name: string;
  grade: string;
  item_type: 'Weapon' | 'Armor' | 'Accessory';
  weapon_group: string | null;
  item_set: string | null;
  atk_all_perc: number;
  def_perc: number;
  hp_perc: number;
  image: string;
  created_at: string;
}

export interface User extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  role: 'admin' | 'super_admin';
  permissions: string | string[];
  created_at: string;
}

export interface StageSetup extends RowDataPacket {
  id: number;
  type: 'stage' | 'tower' | 'abyss';
  name: string;
  note: string | null;
  created_at: string;
}

export interface Team extends RowDataPacket {
  id: number;
  setup_id: number;
  team_index: number;
  formation: string;
  pet_file: string | null;
  heroes_json: string | any[];
  created_at: string;
}

export interface SiteUpdate extends RowDataPacket {
  id: number;
  content_type: string;
  target_name: string;
  action_type: 'CREATE' | 'UPDATE' | 'DELETE';
  message: string;
  admin_name: string;
  created_at: string;
  ts: number; // Unix timestamp from query
}

// --- API & State Types ---

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  id?: number | string;
}

export type SkillRotationItem = {
  label?: string;
  skill: string | null;
};

export type SkillRotation = string[] | SkillRotationItem[];
