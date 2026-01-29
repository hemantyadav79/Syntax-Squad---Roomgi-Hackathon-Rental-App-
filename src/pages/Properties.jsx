import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PropertyFiltersComponent } from '@/components/property/PropertyFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';

export default function PropertiesPage() {
  const [filters, setFilters] = useState({});
  const { data: properties = [], isLoading } = useProperties(filters);

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <Layout>
      <div className="bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="section-heading">Find Your Perfect Stay</h1>
            <p className="text-muted-foreground text-lg">
              Browse verified rooms, PGs, and hostels across India
            </p>
          </div>

          {/* Filters */}
          <PropertyFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onClear={handleClearFilters}
          />

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {isLoading ? 'Loading...' : `${properties.length} properties found`}
              </p>
            </div>

            <PropertyGrid
              properties={properties}
              isLoading={isLoading}
              emptyMessage="No properties match your search criteria. Try adjusting your filters."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
