import type { ContentStatus, ContentType, EventStatus, MediaRole } from "@/lib/lumina";

export type TeamMemberRow = {
  id: string;
  name: string;
  photo_url: string | null;
  roles: MediaRole[];
  phone: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
};

export type EventRow = {
  id: string;
  name: string;
  event_date: string;
  event_time: string | null;
  description: string | null;
  location: string | null;
  leader: string | null;
  image_url: string | null;
  status: EventStatus;
  created_at: string;
};

export type VerseRow = {
  id: string;
  book: string;
  chapter: number;
  verse: string;
  text: string;
  theme: string | null;
  category: string | null;
  favorite: boolean;
  tags: string[];
  created_at: string;
};

export type CaptionRow = {
  id: string;
  title: string;
  text: string;
  category: string | null;
  kind: string | null;
  tags: string[];
  favorite: boolean;
  created_at: string;
};

export type AssetRow = {
  id: string;
  name: string;
  url: string;
  storage_path: string | null;
  folder: string;
  mime_type: string | null;
  size_bytes: number | null;
  tags: string[];
  created_at: string;
};

export type ContentRow = {
  id: string;
  title: string;
  theme: string | null;
  description: string | null;
  type: ContentType;
  status: ContentStatus;
  publish_date: string | null;
  owner_id: string | null;
  event_id: string | null;
  verse_id: string | null;
  caption_id: string | null;
  asset_id: string | null;
  image_url: string | null;
  caption_text: string | null;
  notes: string | null;
  checklist: Record<string, boolean>;
  created_at: string;
  updated_at: string;
};

export type ScheduleRow = {
  id: string;
  schedule_date: string;
  time_label: string;
  event_id: string | null;
  member_id: string;
  role: MediaRole;
  notes: string | null;
  created_at: string;
};

export type ActivityRow = {
  id: string;
  actor_name: string;
  action: string;
  entity: string;
  entity_title: string | null;
  created_at: string;
};

export type InstagramAccountRow = {
  id: string;
  username: string;
  ig_user_id: string | null;
  status: string;
  connected_at: string;
};

export type InsightRow = {
  id: string;
  metric_date: string;
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  profile_visits: number;
  clicks: number;
};

export type InstagramMediaRow = {
  id: string;
  caption: string;
  media_type: string;
  thumbnail_url: string | null;
  reach: number;
  engagement: number;
  views: number;
  posted_at: string | null;
};
