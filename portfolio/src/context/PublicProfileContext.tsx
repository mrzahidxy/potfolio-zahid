"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  defaultPublicProfileData,
  type PublicProfileData,
} from "@/lib/profile-types";

interface PublicProfileApiResponse {
  success: boolean;
  data: PublicProfileData;
}

interface PublicProfileContextValue {
  profile: PublicProfileData;
  loading: boolean;
}

const PublicProfileContext = createContext<PublicProfileContextValue>({
  profile: defaultPublicProfileData,
  loading: true,
});

export function PublicProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<PublicProfileData>(
    defaultPublicProfileData
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const payload = (await response.json()) as PublicProfileApiResponse;

        if (isActive && payload.success) {
          setProfile(payload.data);
        } else if (isActive) {
          setProfile(defaultPublicProfileData);
        }
      } catch (error) {
        console.error("Error loading public profile:", error);
        if (isActive) {
          setProfile(defaultPublicProfileData);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <PublicProfileContext.Provider
      value={{
        profile,
        loading,
      }}
    >
      {children}
    </PublicProfileContext.Provider>
  );
}

export const usePublicProfile = () => useContext(PublicProfileContext);
