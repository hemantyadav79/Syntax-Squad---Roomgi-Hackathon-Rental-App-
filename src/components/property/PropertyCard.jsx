import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Users, Wifi, Car, Utensils, Wind } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';

const amenityIcons = {
  wifi: <Wifi className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  food: <Utensils className="w-3 h-3" />,
  ac: <Wind className="w-3 h-3" />,
};

export function PropertyCard({ property }) {
  const { user } = useAuth();
  const { data: bookmarks } = useBookmarks(user?.id);
  const toggleBookmark = useToggleBookmark();

  const isBookmarked =
    bookmarks?.some((b) => b.property_id === property.id) || false;

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    toggleBookmark.mutate({
      userId: user.id,
      propertyId: property.id,
      isBookmarked,
    });
  };

  const formatRent = (rent) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  const propertyTypeLabels = {
    room: 'Room',
    pg: 'PG',
    hostel: 'Hostel',
  };

  const displayImage =
    property.images?.[0] ||
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop';

  return (
    <Link to={`/property/${property.id}`} className="block">
      <div className="card-property group">
        
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {propertyTypeLabels[property.property_type]}
            </Badge>

            {property.is_verified && (
              <Badge className="badge-verified">Verified</Badge>
            )}

            {!property.is_available && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>

          {/* Bookmark */}
          {user && (
            <button
              onClick={handleBookmarkClick}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm transition-all duration-200 hover:scale-110"
              disabled={toggleBookmark.isPending}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isBookmarked
                    ? 'fill-secondary text-secondary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {property.area}, {property.city}
              </span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {property.amenities?.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-md"
              >
                {amenityIcons[amenity.toLowerCase()] || null}
                {amenity}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatRent(property.monthly_rent)}
              </span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {property.capacity}{' '}
                {property.capacity === 1 ? 'person' : 'persons'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
