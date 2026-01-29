import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useMyProperties, useDeleteProperty } from '@/hooks/useProperties';
import { useInquiries } from '@/hooks/useInquiries';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, MessageSquare, Plus, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { data: myProperties = [], isLoading: propertiesLoading } = useMyProperties(user?.id);
  const { data: inquiries = [], isLoading: inquiriesLoading } = useInquiries(user?.id);
  const deleteProperty = useDeleteProperty();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleDeleteProperty = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty.mutate(id);
    }
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-4rem)] py-8 md:py-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Profile Header */}
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{profile?.full_name || 'User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {profile?.phone && (
                <p className="text-muted-foreground">{profile.phone}</p>
              )}
            </div>
            <div className="md:ml-auto">
              <Link to="/list-property">
                <Button className="btn-primary gap-2">
                  <Plus className="w-4 h-4" />
                  List Property
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="properties" className="gap-2">
                <Home className="w-4 h-4" />
                My Properties
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Inquiries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4">
              {propertiesLoading ? (
                <p>Loading...</p>
              ) : myProperties.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Home className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="font-semibold mb-2">No properties listed</h3>
                    <p className="text-muted-foreground mb-4">Start by listing your first property</p>
                    <Link to="/list-property">
                      <Button>List Property</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myProperties.map((property) => (
                    <Card key={property.id}>
                      <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <img
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=80&fit=crop'}
                          alt={property.title}
                          className="w-full md:w-24 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">{property.area}, {property.city}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={property.status === 'approved' ? 'default' : property.status === 'pending' ? 'secondary' : 'destructive'}>
                              {property.status}
                            </Badge>
                            {property.is_verified && <Badge className="badge-verified">Verified</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Link to={`/property/${property.id}`} className="flex-1 md:flex-none">
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deleteProperty.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="inquiries" className="space-y-4">
              {inquiriesLoading ? (
                <p>Loading...</p>
              ) : inquiries.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="font-semibold mb-2">No inquiries yet</h3>
                    <p className="text-muted-foreground">
                      Inquiries for your properties will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{inquiry.properties?.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {inquiry.properties?.area}, {inquiry.properties?.city}
                            </p>
                          </div>
                          {!inquiry.is_read && <Badge className="badge-pending">New</Badge>}
                        </div>
                        <p className="text-muted-foreground mb-2">{inquiry.message}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {inquiry.contact_phone && <span>📞 {inquiry.contact_phone}</span>}
                          {inquiry.contact_email && <span>✉️ {inquiry.contact_email}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
