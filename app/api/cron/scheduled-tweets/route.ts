import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTweetContent(timeOfDay: string) {
  const prompt = `Write an inspiring ${timeOfDay} tweet with a beautiful quote. Keep it under 280 characters.`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

async function postTweet(content: string) {
  const twitterApiUrl = 'https://api.twitter.com/2/tweets';
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  try {
    const response = await fetch(twitterApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content }),
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  try {
    const times = ['morning', 'afternoon', 'evening'];
    const results = [];

    for (const timeOfDay of times) {
      const tweetContent = await generateTweetContent(timeOfDay);
      
      if (tweetContent) {
        const tweetResponse = await postTweet(tweetContent);
        results.push({
          timeOfDay,
          content: tweetContent,
          tweetId: tweetResponse.data.id,
        });
        
        // Add a 5-minute delay between tweets to avoid rate limits
        if (timeOfDay !== 'evening') {
          await delay(300000); // 5 minutes in milliseconds
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "All scheduled tweets posted successfully",
      tweets: results,
    });

  } catch (error) {
    console.error('Error posting scheduled tweets:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to post scheduled tweets",
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 