import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useAllProperties, useUpdateProperty, useDeleteProperty } from '@/hooks/useProperties';
import { useAdminStats } from '@/hooks/useStats';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Home, Users, Clock, Check, X, Trash2, Eye, LayoutDashboard, Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const { data: allProperties = [], isLoading: propertiesLoading } = useAllProperties();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      return data || [];
    },
    enabled: isAdmin,
  });

  if (loading) return null;

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const pendingProperties = allProperties.filter(p => p.status === 'pending');
  const approvedProperties = allProperties.filter(p => p.status === 'approved');
  const rejectedProperties = allProperties.filter(p => p.status === 'rejected');

  const handleApprove = (property) => {
    updateProperty.mutate({ id: property.id, status: 'approved' });
  };

  const handleReject = (property) => {
    updateProperty.mutate({ id: property.id, status: 'rejected' });
  };

  const handleVerify = (property) => {
    updateProperty.mutate({ id: property.id, is_verified: !property.is_verified });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty.mutate(id);
    }
  };

  const PropertyRow = ({ property }) => (
    <Card className="mb-4">
      <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=80&fit=crop'}
          alt={property.title}
          className="w-full md:w-24 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{property.title}</h3>
          <p className="text-sm text-muted-foreground">{property.area}, {property.city}</p>
          <p className="text-sm text-muted-foreground">₹{property.monthly_rent}/month</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={property.status === 'approved' ? 'default' : property.status === 'pending' ? 'secondary' : 'destructive'}>
              {property.status}
            </Badge>
            {property.is_verified && <Badge className="badge-verified">Verified</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Link to={`/property/${property.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          {property.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleApprove(property)}
                disabled={updateProperty.isPending}
              >
                <Check className="w-4 h-4 text-success" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleReject(property)}
                disabled={updateProperty.isPending}
              >
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </>
          )}
          {property.status === 'approved' && (
            <Button 
              variant={property.is_verified ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleVerify(property)}
              disabled={updateProperty.isPending}
              title={property.is_verified ? 'Remove verification' : 'Mark as verified'}
            >
              <Shield className="w-4 h-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDelete(property.id)}
            disabled={deleteProperty.isPending}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-4rem)] py-8 md:py-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary">
              <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage properties and users</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalProperties || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.pendingApprovals || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedProperties.length}</p>
                  <p className="text-sm text-muted-foreground">Approved Listings</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                Pending ({pendingProperties.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <Check className="w-4 h-4" />
                Approved ({approvedProperties.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <X className="w-4 h-4" />
                Rejected ({rejectedProperties.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Users ({allUsers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {propertiesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : pendingProperties.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No pending approvals</p>
                  </CardContent>
                </Card>
              ) : (
                pendingProperties.map(property => (
                  <PropertyRow key={property.id} property={property} />
                ))
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedProperties.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Check className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No approved properties</p>
                  </CardContent>
                </Card>
              ) : (
                approvedProperties.map(property => (
                  <PropertyRow key={property.id} property={property} />
                ))
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedProperties.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <X className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No rejected properties</p>
                  </CardContent>
                </Card>
              ) : (
                rejectedProperties.map(property => (
                  <PropertyRow key={property.id} property={property} />
                ))
              )}
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
