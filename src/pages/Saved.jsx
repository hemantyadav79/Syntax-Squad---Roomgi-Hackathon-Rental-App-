import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function SavedPage() {
  const { user, loading } = useAuth();
  const { data: bookmarks, isLoading } = useBookmarks(user?.id);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const properties = bookmarks?.map(b => b.properties).filter(Boolean) || [];

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-4rem)] py-8 md:py-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="section-heading flex items-center gap-3">
              <Heart className="w-8 h-8 text-secondary fill-secondary" />
              Saved Properties
            </h1>
            <p className="text-muted-foreground text-lg">
              Properties you've saved for later
            </p>
          </div>

          {/* No Saved Properties */}
          {properties.length === 0 && !isLoading ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No saved properties yet</h2>
              <p className="text-muted-foreground mb-6">
                Start browsing and save properties you like!
              </p>
              <Link to="/properties">
                <Button className="btn-primary">Browse Properties</Button>
              </Link>
            </div>
          ) : (
            <PropertyGrid properties={properties} isLoading={isLoading} />
          )}
        </div>
      </div>
    </Layout>
  );
}
