export interface Channel {
  id: string;
  userId?: string;
  type: string;
  name: string;
  isActive: boolean;
  keys: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    accessTokenSecret?: string;
  };
  configuration?: {
    startTime?: string;
    endTime?: string;
    timeBetweenPosts?: number;
    maxPostsPerDay?: number;
    timezone?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  twitterId: string;
  username?: string;
  displayName?: string;
  profileImageUrl?: string;
  role: 'USER' | 'ADMIN';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Personality {
  id: string
  name: string
  profileImageUrl: string | null
  prompt: string
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  userId: string
  content: {
    tweetUrl?: string
    text: string
    image?: string
  }
  type: 'POST' | 'COMMENT' | 'THREAD'
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  publishPostUrl?: string
  scheduledAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}
