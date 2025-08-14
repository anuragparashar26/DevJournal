import crypto from 'crypto';
import { NextRequest } from 'next/server';
import clientPromise from './mongodb';
import { RateLimit } from './types';

export function hashIP(ip: string): string {
  const salt = process.env.IP_SALT || 'default-salt-change-this';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return '127.0.0.1'; 
}


export async function checkRateLimit(
  ipHash: string, 
  action: 'comment' | 'upvote'
): Promise<{ allowed: boolean; remaining: number }> {
  const client = await clientPromise;
  const db = client.db('blog');
  const rateLimitsCollection = db.collection<RateLimit>('rateLimits');
  
  const now = new Date();
  const timeWindow = action === 'comment' ? 60 * 60 * 1000 : 5 * 60 * 1000; 
  const maxActions = action === 'comment' ? 3 : 10;
  
  const windowStart = new Date(now.getTime() - timeWindow);
  
  await rateLimitsCollection.deleteMany({
    timestamp: { $lt: windowStart }
  });
  
  const recentActions = await rateLimitsCollection.countDocuments({
    ipHash,
    action,
    timestamp: { $gte: windowStart }
  });
  
  if (recentActions >= maxActions) {
    return { allowed: false, remaining: 0 };
  }
  
  await rateLimitsCollection.insertOne({
    ipHash,
    action,
    timestamp: now,
    count: 1
  });
  
  return { allowed: true, remaining: maxActions - recentActions - 1 };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') 
    .replace(/javascript:/gi, '') 
    .replace(/on\w+=/gi, '') 
    .substring(0, 1000);
}
