import { NextResponse } from "next/server";
import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const twitterClient = new TwitterApi({
  appKey: process.env.DEV_API_KEY,
  appSecret: process.env.DEV_API_SECRET,
  accessToken: process.env.DEV_ACCESS_TOKEN,
  accessSecret: process.env.DEV_ACCESS_SECRET,
});

async function generateTweetContent(timeOfDay) {
  const prompt = `Write an inspiring ${timeOfDay} tweet with a beautiful quote. Keep it under 280 characters. dont use quotes or any prefix or hints`;

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

export async function GET(req) {
  try {
    const currentHour = new Date().getUTCHours();
    let timeOfDay;

    // Define time periods (in UTC)
    if (currentHour >= 4 && currentHour < 12) {
      timeOfDay = "morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      timeOfDay = "afternoon";
    } else {
      timeOfDay = "evening";
    }

    const tweetContent = await generateTweetContent(timeOfDay);

    if (tweetContent) {
      await twitterClient.v2.tweet(tweetContent);

      return NextResponse.json({
        success: true,
        message: "Scheduled tweet posted successfully",
        content: tweetContent,
      });
    }
  } catch (error) {
    console.error("Error posting scheduled tweet:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to post scheduled tweet",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
