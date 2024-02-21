export type BasicRowType = {
  [key: string]: string | null | boolean | number | Date;
};

export interface DBUser {
  id: string;
  created_at: string;
  avatar_url: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
  sign_up_order_number: number;
  display_name: string | null;
  username: string;
}

export interface DBShortPost {
  id: string;
  user_id: string;
  text: string;
  reply_count: number;
  upvote_count: number;
  save_count: number;
  track_id: string;
  time_in: number | null;
  time_out: number | null;
  created_at: string;
  username: DBUser["username"];
  display_name: DBUser["display_name"];
  avatar_url: DBUser["avatar_url"];
  artist: DBTrack["artist"];
  artwork: DBTrack["artwork"];
  spotify_id: DBTrack["spotify_id"];
  duration: DBTrack["duration"];
  name: DBTrack["name"];
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

export interface DBShortPostComment {
  id: string;
  userId: string | null;
  shortPostId: string | null;
  commentText: string;
  createdAt: Date;
  parentId: string | null;
  upvoteCount: number;
  active: boolean;
  isThreadStart: boolean;
}
