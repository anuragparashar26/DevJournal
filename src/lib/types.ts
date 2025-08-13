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
