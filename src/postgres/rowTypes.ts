export interface DBUser {
  id: string;
  created_at: string;
  avatar_url: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
  sign_up_order_number: number;
  display_name: string | null;
}

export interface DBShortPost {
  id: string;
  user_id: string;
  post_text: string;
  reply_count: number;
  upvote_count: number;
  save_count: number;
  track_id: string;
  time_in: number | null;
  time_out: number | null;
  created_at: string;
}

export interface DBTrack {
  id: string;
  name: string;
  artist: string;
  artwork: string | null;
  spotify_id: string | null;
  duration: number | null;
  created_at: string;
}
