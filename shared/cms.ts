export type ProjectDoc = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  sector?: string;
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ContactSubmission = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  createdAt: string;
};

export type SubscriptionDoc = {
  _id: string;
  email: string;
  source: string;
  createdAt: string;
};

export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source?: string;
};
