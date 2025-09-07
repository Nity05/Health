import { auth } from "@clerk/nextjs/server";
import Dashboard from "./Dashboard";
import { createSupabaseClient } from "@/lib/supabase";

export default async function Page() {
  // Get the current logged-in user
  const { userId } = await auth();
  
  if (!userId) {
    return <div>Please sign in to view the dashboard.</div>;
  }
  
  const isAdmin = false; // Replace with your real logic
  
  try {
    // Create Supabase client
    const supabase = await createSupabaseClient();
    
    // Read ONLY this user's scan results from database
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching user data:', error);
      return <div>Error loading your results: {error.message}</div>;
    }
    console.log(userId)
    // Pass the user's results to Dashboard
    return <Dashboard initialScanData={data || []} />;
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return <div>Unable to load your dashboard.</div>;
  }
}