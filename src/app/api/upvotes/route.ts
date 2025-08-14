import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Upvote } from '@/lib/types';
import { hashIP, getClientIP, checkRateLimit } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug } = body;

    if (!postSlug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const rateLimit = await checkRateLimit(ipHash, 'upvote');

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before upvoting again.' },
        { status: 429 }
      );
    }

    const client = await clientPromise;
    const db = client.db('blog');
    const upvotesCollection = db.collection<Upvote>('upvotes');

    const postsCollection = db.collection('posts');
    const postExists = await postsCollection.findOne({ slug: postSlug });
    
    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const existingUpvote = await upvotesCollection.findOne({
      postSlug,
      ipHash,
    });

    if (existingUpvote) {
      return NextResponse.json(
        { error: 'You have already upvoted this post' },
        { status: 409 }
      );
    }

    const upvote: Upvote = {
      postSlug,
      ipHash,
      timestamp: new Date(),
    };

    await upvotesCollection.insertOne(upvote);

    const upvoteCount = await upvotesCollection.countDocuments({ postSlug });

    return NextResponse.json({
      success: true,
      upvoteCount,
    });

  } catch (error) {
    console.error('Upvote submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('blog');
    const upvotesCollection = db.collection<Upvote>('upvotes');

    const upvoteCount = await upvotesCollection.countDocuments({ postSlug });

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const hasUpvoted = await upvotesCollection.findOne({
      postSlug,
      ipHash,
    });

    return NextResponse.json({
      upvoteCount,
      hasUpvoted: !!hasUpvoted,
    });

  } catch (error) {
    console.error('Upvotes fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
