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