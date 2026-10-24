import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ProfilePhoto from "@/components/profileEditor/ProfilePhoto";
import { useForm } from "react-hook-form";
import { User } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
import { useUpdateUserProfile } from "@/features/profile/useUpdateProfile";
import Spinner from "@/app/loading";
import { redirect } from "next/navigation";
import { Switch } from "../ui/switch";

const BasicInfoEdit: React.FC = () => {
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const { updateProfile, loading: isUpdating } = useUpdateUserProfile();
  const { user, setUser } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  const [availableForHire, setAvailableForHire] = useState(
    user.profile?.availableForHire || false,
  );

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || undefined,
        profile: {
          profession: user?.profile?.profession || undefined,
          bio: user?.profile?.bio || undefined,
          website: user?.profile?.website || undefined,
          location: user?.profile?.location || undefined,
        },
      });
      // Ensure availableForHire state is in sync with user data
      setAvailableForHire(user.profile?.availableForHire || false);
    }
  }, [user, reset]);

  const onSubmit = async (formData: Partial<User>) => {
    // Clean up the data before sending to backend
    const cleanData: Partial<User> = {
      fullName: formData.fullName?.trim() || undefined,
      profile: {
        profession: formData.profile?.profession?.trim() || undefined,
        bio: formData.profile?.bio?.trim() || undefined,
        website: formData.profile?.website?.trim() || undefined,
        availableForHire: availableForHire,
        location: formData.profile.location,
      },
    };
    if (cleanData.profile) {
      Object.keys(cleanData.profile).forEach((key) => {
        if (
          cleanData.profile[key as keyof typeof cleanData.profile] === undefined
        ) {
          delete cleanData.profile[key as keyof typeof cleanData.profile];
        }
      });

      if (Object.keys(cleanData.profile).length === 0) {
        delete cleanData.profile;
      }
    }

    const res = await updateProfile(cleanData);

    if (res && res.success) {
      setUser(res.data);
      redirect("/profile");
    }
  };

  return isUpdating ? (
    <Spinner />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-shrink-0 self-center md:self-start">
          <ProfilePhoto />
          <div className="mt-2 flex items-center space-x-2">
            <Label htmlFor="availableForHire" className="text-base font-medium">
              Available for hire?
            </Label>
            <Switch
              id="availableForHire"
              checked={availableForHire}
              onCheckedChange={setAvailableForHire}
              className="checked:bg-primary"
            />
          </div>
        </div>

        <div className="flex-grow space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register("fullName", {
                required: "Full name is required",
              })}
            />
            {errors.fullName && (
              <span className="text-sm text-red-500">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              placeholder="Enter your Profession"
              {...register("profile.profession")}
            />
            {errors.profile?.profession && (
              <span className="text-sm text-red-500">
                {errors.profile.profession.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              maxLength={300}
              id="bio"
              placeholder="Tell us about yourself"
              className="min-h-[100px] w-full resize-none"
              {...register("profile.bio", {
                maxLength: {
                  value: 300,
                  message: "Bio must not exceed 300 characters",
                },
              })}
            />
            {errors.profile?.profession && (
              <span className="text-sm text-red-500">
                {errors.profile.profession.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Location</Label>
            <Input
              id="location"
              placeholder="Enter your location"
              {...register("profile.location")}
            />
            {errors.fullName && (
              <span className="text-sm text-red-500">
                {errors.profile.location.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              placeholder="Enter your website URL"
              {...register("profile.website", {
                pattern: {
                  value: urlPattern,
                  message:
                    "Please enter a valid URL (e.g., https://example.com)",
                },
                validate: {
                  validProtocol: (value) => {
                    if (!value) return true; // Allow empty values
                    if (
                      !value.startsWith("http://") &&
                      !value.startsWith("https://")
                    ) {
                      return "URL must start with http:// or https://";
                    }
                    return true;
                  },
                },
              })}
            />
            {errors.profile?.website && (
              <span className="text-sm text-red-500">
                {errors.profile.website.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="F relative mx-auto block rounded-md px-6 py-2 transition-colors"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BasicInfoEdit;
