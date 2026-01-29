import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useProperties(filters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (filters?.city) query = query.ilike('city', `%${filters.city}%`);
      if (filters?.property_type) query = query.eq('property_type', filters.property_type);
      if (filters?.minPrice) query = query.gte('monthly_rent', filters.minPrice);
      if (filters?.maxPrice) query = query.lte('monthly_rent', filters.maxPrice);
      if (filters?.is_available !== undefined) query = query.eq('is_available', filters.is_available);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useProperty(id) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useMyProperties(userId) {
  return useQuery({
    queryKey: ['my-properties', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useAllProperties() {
  return useQuery({
    queryKey: ['all-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (property) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      toast({
        title: 'Property Listed',
        description: 'Your property has been submitted for review.',
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

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['all-properties'] });
      toast({
        title: 'Property Updated',
        description: 'Your changes have been saved.',
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

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['all-properties'] });
      toast({
        title: 'Property Deleted',
        description: 'The property has been removed.',
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
