"use client";

//import { Profile } from "@/types/collections";
//The Profile type represents the structure of a row in the 'profiles' table in your database
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import useSWR from "swr";
import { useSupabase } from "./supabase-provider";
import {Database} from '../../../../types/supabase'
interface ContextI {
  trainer: Database["public"]["Tables"]["trainer"]["Row"] | null | undefined;
  trainerError: any;
  trainerLoading: boolean;
  trainerMutate: any;
  user: User | null | undefined | any;
  error: any;
  isLoading: boolean;
  mutate: any;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
}
const Context = createContext<ContextI>({
  trainer: null,
  trainerError: null,
  trainerLoading: true,
  trainerMutate: null,
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => {},
  signInWithGithub: async () => {},
  signInWithEmail: async (email: string, password: string) => null,
});

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const getTrainer = async () => {
    const { data: trainer, error } = await supabase
      .from("trainer")
      .select("*")
      .eq("id", serverSession?.user?.id)
      .single();
  
    if (error) {
      console.log(error);
      return null;
    } else {
      console.log(trainer);
      return trainer as Database["public"]["Tables"]["trainer"]["Row"];
    }
  };
  
  // Get USER
  const getUser = async () => {
    console.log(serverSession?.user?.id);
    // const data =  await supabase
    // .from("users")
    // .select("*")
    // .eq("id", serverSession?.user?.id)
    // .single();
    // console.log(data);
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", serverSession?.user?.id)
      .single();
    if (error) {
      console.log(error);
      return null;
    } else {
        console.log(user);
      return user;
    }
  };
  const { data: trainer, error: trainerError, isLoading: trainerLoading, mutate: trainerMutate } = useSWR(serverSession ? "trainer-context" : null, getTrainer);

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? "profile-context" : null, getUser);

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Sign-In with Github
  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  // Sign-In with Email
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return error.message;
    }

    return null;
  };

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.access_token]);

  const exposed: ContextI = {
    user,
    trainer,
    trainerError,
    trainerLoading,
    trainerMutate,  
    error,
    isLoading,
    mutate,
    signOut,
    signInWithGithub,
    signInWithEmail,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
}

export const useAuth = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used inside SupabaseAuthProvider");
  } else {
    return context;
  }
};