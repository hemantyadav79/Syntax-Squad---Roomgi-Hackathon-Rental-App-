import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [propertiesResult, usersResult, pendingResult] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('properties').select('id', { count: 'exact' }).eq('status', 'pending'),
      ]);

      return {
        totalProperties: propertiesResult.count || 0,
        totalUsers: usersResult.count || 0,
        pendingApprovals: pendingResult.count || 0,
      };
    },
  });
}
