import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Comment } from '@/lib/types';
import { hashIP, getClientIP, checkRateLimit, isValidEmail, sanitizeInput } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, author, email, content } = body;

    if (!postSlug || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const sanitizedAuthor = sanitizeInput(author);
    const sanitizedContent = sanitizeInput(content);
    const sanitizedEmail = sanitizeInput(email);

    if (sanitizedAuthor.length < 2 || sanitizedAuthor.length > 50) {
      return NextResponse.json(
        { error: 'Author name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (sanitizedContent.length < 10 || sanitizedContent.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const rateLimit = await checkRateLimit(ipHash, 'comment');

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before submitting another comment.' },
        { status: 429 }
      );
    }

    const client = await clientPromise;
    const db = client.db('blog');
    const commentsCollection = db.collection<Comment>('comments');

    const postsCollection = db.collection('posts');
    const postExists = await postsCollection.findOne({ slug: postSlug });
    
    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const comment: Comment = {
      postSlug,
      author: sanitizedAuthor,
      email: sanitizedEmail,
      content: sanitizedContent,
      timestamp: new Date(),
      approved: false,
      ipHash,
    };

    await commentsCollection.insertOne(comment);

    return NextResponse.json({
      success: true,
      message: 'Your comment has reached to the admin, it will appear publicly after their approval.'
    });

  } catch (error) {
    console.error('Comment submission error:', error);
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
    const commentsCollection = db.collection<Comment>('comments');

    const comments = await commentsCollection
      .find({ postSlug, approved: true })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({
      comments: comments.map(comment => ({
        _id: comment._id,
        author: comment.author,
        content: comment.content,
        timestamp: comment.timestamp,
      }))
    });

  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
