import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useBookmarks(userId) {
  return useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data; // data is array of bookmarks with properties
    },
    enabled: !!userId,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, propertyId, isBookmarked }) => {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('property_id', propertyId);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: userId, property_id: propertyId });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast({
        title: data.action === 'added' ? 'Saved!' : 'Removed',
        description:
          data.action === 'added'
            ? 'Property added to your saved list.'
            : 'Property removed from your saved list.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
