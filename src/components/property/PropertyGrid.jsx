import { PropertyCard } from './PropertyCard';
import { Loader2 } from 'lucide-react';

export function PropertyGrid({
  properties,
  isLoading,
  emptyMessage = 'No properties found',
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <div
          key={property.id}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}
