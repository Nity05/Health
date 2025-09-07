import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

// Simple function to get user's scan data
export async function getHistory(userId?: string, limit: number = 10, isAdmin: boolean = false) {
  const { userId: currentUserId } = await auth();
  
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }
  
  const supabase = await createSupabaseClient();
  
  // Query the scans table
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', currentUserId) // Only get current user's data
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
  
  return data || [];
}