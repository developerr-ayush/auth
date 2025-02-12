import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});

export async function GET(req) {
  const twitterClient = new TwitterApi({
    appKey: process.env.DEV_API_KEY, // Changed from apiKey to appKey
    appSecret: process.env.DEV_API_SECRET, // Changed from apiSecret to appSecret
    accessToken: process.env.DEV_ACCESS_TOKEN,
    accessSecret: process.env.DEV_ACCESS_SECRET,
  });

  // Get a response from OpenAI
  const openAIResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          "How many percentage of 2025 is completed today? today its " +
          new Date() +
          "reply in 1 sentense with 10 words",
      },
    ],
  });
  console.log(openAIResponse.choices[0].message.content);
  const tweetContent = openAIResponse.choices[0].message.content;

  // Publish the tweet
  if (tweetContent) {
    await twitterClient.v2.tweet(tweetContent);
  }

  return NextResponse.json({
    message: "Tweet published successfully!",
    content: tweetContent,
  });
}
