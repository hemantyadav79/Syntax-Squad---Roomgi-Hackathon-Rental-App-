import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useInquiries(userId) {
  return useQuery({
    queryKey: ['inquiries', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          properties (title, city, area)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inquiry) => {
      // inquiry is an object with fields except id, created_at, is_read
      const { data, error } = await supabase
        .from('inquiries')
        .insert(inquiry)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast({
        title: 'Inquiry Sent!',
        description: 'The property owner will be notified.',
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
