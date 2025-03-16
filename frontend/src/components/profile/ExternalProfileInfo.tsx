"use client";
import { memo } from "react";
import {
  AtSign,
  Check,
  Mail,
  Settings,
  SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Social from "./Social";
import { toast } from "@/hooks/use-toast";
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
    <div className="flex flex-col space-x-4 w-full relative items-center lg:items-start text-center lg:text-left space-y-4">
      <div className="w-20 h-20 lg:w-24 lg:h-24 relative -mt-12 lg:ml-4">
        {user.profile?.avatar ? (
          <Image
            fill
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
        <h3 className="font-semibold text-xl">{user.fullName}</h3>
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
        {user.profile?.website && (
          <div>
            <Link href={user.profile.website} target="_blank">
              <SquareArrowOutUpRight className="inline" size={14} /> Website
            </Link>
          </div>
        )}
        <FollowDetails user={user} />
        {user.profile?.availableForHire && (
          <div className="flex space-x-2 items-center text-green-500">
            <h2 className="text-lg font-semibold">Available for hire </h2>
            <Check />
          </div>
        )}

        {authUser && user && (
          <MessageModal recepient={user} sender={authUser} />
        )}
      </div>

      <div className="!mt-8 w-[95%] p-4 lg:p-0">
        <h2 className="text-muted-foreground font-bold uppercase">About</h2>
        <p className="text-wrap">{user.profile?.bio}</p>
      </div>

      <Social socials={user.profile?.social} />
    </div>
  );
}

export default memo(ExternalProfileInfo);
