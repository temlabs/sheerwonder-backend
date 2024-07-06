export interface User {
  id: number;
  bio?: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  username: string;
  avatarUrl?: string;
}
