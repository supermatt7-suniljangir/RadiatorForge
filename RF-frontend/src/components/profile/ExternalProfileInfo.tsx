"use client";
import { memo } from "react";
import {
  AtSign,
  Check,
  MapPin,
  Settings,
  SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Social from "./Social";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/user";
import { redirect, usePathname } from "next/navigation";
import ProfilePlaceholder from "@/media/user.png";
import FollowDetails from "./FollowDetails";
import MessageModal from "./MessageModal";

function ExternalProfileInfo({ user }: { user: User }) {
  const { user: authUser } = useUser();
  const pathname = usePathname();
  if (pathname === "/profile" || authUser?._id === user._id)
    redirect("/profile");

  return (
    <div className="relative flex w-full flex-col items-center space-x-4 space-y-4 text-center lg:items-start lg:text-left">
      <div className="relative -mt-12 h-20 w-20 lg:ml-4 lg:h-24 lg:w-24">
        {user.profile?.avatar ? (
          <Image
            fill
            priority
            unoptimized
            src={user.profile?.avatar}
            alt={user.fullName}
            className="rounded-full object-cover"
          />
        ) : (
          <Image
            fill
            src={ProfilePlaceholder}
            alt={user.fullName}
            className="rounded-full"
          />
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{user.fullName}</h3>
        <div>
          <Link href={`mailto:${user.email}`}>
            <AtSign size={16} className="inline" /> {user.email}
          </Link>
        </div>
        {user.profile?.profession && (
          <div>
            <Settings size={16} className="inline" /> {user.profile.profession}
          </div>
        )}
        {user.profile?.location && (
          <div className="space-y-1">
            <MapPin size={16} className="inline" /> {user.profile.location}
          </div>
        )}
        {user.profile?.website && (
          <div>
            <Link href={user.profile.website} target="_blank">
              <SquareArrowOutUpRight className="inline" size={14} /> Website
            </Link>
          </div>
        )}
        <FollowDetails user={user} />
        {user.profile?.availableForHire && (
          <div className="flex items-center space-x-2 text-green-500">
            <h2 className="text-lg font-semibold">Available for hire </h2>
            <Check />
          </div>
        )}

        {authUser && user && (
          <MessageModal recepient={user} sender={authUser} />
        )}
      </div>

      <div className="!mt-8 w-[95%] p-4 lg:p-0">
        <h2 className="font-bold uppercase text-muted-foreground">About</h2>
        <p className="text-wrap">{user.profile?.bio}</p>
      </div>

      <Social socials={user.profile?.social} />
    </div>
  );
}

export default memo(ExternalProfileInfo);
