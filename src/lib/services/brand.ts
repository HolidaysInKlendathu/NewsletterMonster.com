import { prisma } from "../prisma-client";

interface Newsletter {
  newsletter_id: number;
  date: Date | null;
  subject: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
}

interface BrandProfile {
  user_id: string;
  name: string;
  profile_photo: string | null;
  bio: string | null;
  website: string | null;
  twitter_username: string | null;
  instagram_username: string | null;
  youtube_channel: string | null;
  linkedin_profile: string | null;
  newsletters: Newsletter[];
  followers_count: number;
  following_count: number;
}

export async function getBrandProfile(username: string): Promise<BrandProfile | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      user_id: true,
      name: true,
      profile_photo: true,
      bio: true,
      website: true,
      twitter_username: true,
      instagram_username: true,
      youtube_channel: true,
      linkedin_profile: true,
      Newsletter: {
        select: {
          newsletter_id: true,
          date: true,
          subject: true,
          likes_count: true,
          you_rocks_count: true,
        },
      },
      followers: {
        select: {
          follower_id: true,
        },
        where: {
          following_id: { not: null } // Only count claimed profile follows
        }
      },
      following: {
        select: {
          following_id: true,
          following_name: true,
        }
      },
      _count: {
        select: {
          followers: true,
          following: true
        }
      }
    }
  });

  if (!user) return null;

  // Count both claimed and unclaimed follows
  const followersCount = user._count.followers;
  const followingCount = user._count.following;

  return {
    user_id: user.user_id,
    name: user.name,
    profile_photo: user.profile_photo,
    bio: user.bio,
    website: user.website,
    twitter_username: user.twitter_username,
    instagram_username: user.instagram_username,
    youtube_channel: user.youtube_channel,
    linkedin_profile: user.linkedin_profile,
    newsletters: user.Newsletter,
    followers_count: followersCount,
    following_count: followingCount
  };
}