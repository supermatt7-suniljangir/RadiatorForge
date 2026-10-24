import { cookies } from "next/headers";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/types/ApiResponse";
import { MiniProject } from "@/types/project";

export const getProfileProjectsAPI = async (
  userId?: string,
): Promise<ApiResponse<MiniProject[]>> => {
  try {
    const isPersonal = !userId;
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    const url = isPersonal
      ? `${URL}/projects/personal/user`
      : `${URL}/projects/${userId}/user`;

    const response = await fetch(url, {
      method: "GET",
      // If it's a personal feed, NEVER cache it. If public, cache safely by entity.
      cache: isPersonal ? "no-store" : "default",
      next: isPersonal
        ? undefined
        : {
            revalidate: 60,
            tags: [`user-${userId}-projects`], // Granular tag for target invalidation
          },
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
      },
    });

    const data: ApiResponse<MiniProject[]> = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch user projects",
        data: [],
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching user projects",
      data: [],
    };
  }
};
