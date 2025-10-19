import { ObjectId } from "mongodb";

export interface Post {
  _id: ObjectId;
  title: string;
  slug: string;
  date: string;
  body: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface Comment {
  _id?: ObjectId;
  postSlug: string;
  author: string;
  email: string;
  content: string;
  timestamp: Date;
  approved: boolean;
  ipHash: string;
}

export interface Upvote {
  _id?: ObjectId;
  postSlug: string;
  ipHash: string;
  timestamp: Date;
}

export interface RateLimit {
  _id?: ObjectId;
  ipHash: string;
  action: 'comment' | 'upvote';
  timestamp: Date;
  count: number;
}

export interface Subscriber {
  _id?: ObjectId;
  email: string;
  subscribedAt: Date;
  active: boolean;
}
