import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});

export async function GET(req) {
  const twitterClient = new TwitterApi({
    appKey: process.env.DEV_API_KEY,
    appSecret: process.env.DEV_API_SECRET,
    accessToken: process.env.DEV_ACCESS_TOKEN,
    accessSecret: process.env.DEV_ACCESS_SECRET,
  });
  const queryParam = req.nextUrl.searchParams.get("q"); // Get query parameter from request
  console.log(queryParam);
  const openAIResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Please write a tweet about the following: ${queryParam} in 10-30 words`, // Use the query parameter in the prompt
      },
    ],
  });
  console.log(openAIResponse.choices);
  // return NextResponse.json({
  //   message: "Hello, world!",
  // });

  // Get a response from OpenAI

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
