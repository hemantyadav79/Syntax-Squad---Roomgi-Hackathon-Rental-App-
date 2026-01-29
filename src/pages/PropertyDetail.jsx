import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, Heart, MapPin, Users, Wifi, Car, Utensils, Wind, 
  CheckCircle, Phone, Mail, Loader2, IndianRupee, Shield 
} from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const inquirySchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
  contact_phone: z.string().optional(),
  contact_email: z.string().email('Invalid email').optional(),
});

const amenityDetails = {
  wifi: { icon: <Wifi className="w-5 h-5" />, label: 'Free WiFi' },
  parking: { icon: <Car className="w-5 h-5" />, label: 'Parking' },
  food: { icon: <Utensils className="w-5 h-5" />, label: 'Food Included' },
  ac: { icon: <Wind className="w-5 h-5" />, label: 'Air Conditioning' },
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: property, isLoading, error } = useProperty(id);
  const { data: bookmarks } = useBookmarks(user?.id);
  const toggleBookmark = useToggleBookmark();
  const createInquiry = useCreateInquiry();

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    message: '',
    contact_phone: '',
    contact_email: '',
  });
  const [inquiryError, setInquiryError] = useState(null);

  const isBookmarked = bookmarks?.some(b => b.property_id === id) || false;

  const handleBookmarkClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toggleBookmark.mutate({
      userId: user.id,
      propertyId: id,
      isBookmarked,
    });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError(null);

    if (!user) {
      navigate('/auth');
      return;
    }

    const validation = inquirySchema.safeParse(inquiryData);
    if (!validation.success) {
      setInquiryError(validation.error.errors[0].message);
      return;
    }

    await createInquiry.mutateAsync({
      user_id: user.id,
      property_id: id,
      message: inquiryData.message,
      contact_phone: inquiryData.contact_phone || null,
      contact_email: inquiryData.contact_email || null,
    });

    setIsInquiryOpen(false);
    setInquiryData({ message: '', contact_phone: '', contact_email: '' });
  };

  const formatRent = (rent) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/properties">
            <Button>Browse All Properties</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const propertyTypeLabels = {
    room: 'Private Room',
    pg: 'Paying Guest (PG)',
    hostel: 'Hostel',
  };

  const displayImages = property.images?.length > 0 
    ? property.images 
    : [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      ];

  return (
    <Layout>
      <div className="bg-background">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/properties" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[400px]">
            <div className="md:col-span-2 rounded-xl overflow-hidden">
              <img
                src={displayImages[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-4">
              {displayImages.slice(1, 3).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <img
                    src={img}
                    alt={`${property.title} ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary">
                    {propertyTypeLabels[property.property_type]}
                  </Badge>
                  {property.is_verified && (
                    <Badge className="badge-verified">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {!property.is_available && (
                    <Badge variant="destructive">Currently Unavailable</Badge>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{property.area}, {property.city}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-3">About this property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || 'No description available for this property.'}
                </p>
              </div>

              {/* Details & Amenities */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{property.capacity}</div>
                  <div className="text-sm text-muted-foreground">
                    {property.capacity === 1 ? 'Person' : 'Persons'}
                  </div>
                </div>
                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <IndianRupee className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{formatRent(property.security_deposit)}</div>
                  <div className="text-sm text-muted-foreground">Deposit</div>
                </div>
                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold capitalize">{property.gender_preference}</div>
                  <div className="text-sm text-muted-foreground">Gender Pref.</div>
                </div>
                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-3 ${property.is_available ? 'bg-success' : 'bg-destructive'}`} />
                  <div className="font-semibold">{property.is_available ? 'Available' : 'Occupied'}</div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => {
                      const detail = amenityDetails[amenity.toLowerCase()];
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                          {detail?.icon || <CheckCircle className="w-5 h-5" />}
                          <span>{detail?.label || amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {property.full_address && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Location</h2>
                  <p className="text-muted-foreground">{property.full_address}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {formatRent(property.monthly_rent)}
                  </div>
                  <div className="text-muted-foreground">per month</div>
                </div>

                <div className="space-y-3">
                  <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full btn-primary" size="lg">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Owner
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Inquiry</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleInquirySubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="message">Your Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Hi, I'm interested in this property..."
                            value={inquiryData.message}
                            onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={inquiryData.contact_phone}
                              onChange={(e) => setInquiryData({ ...inquiryData, contact_phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inquiry_email">Email (Optional)</Label>
                            <Input
                              id="inquiry_email"
                              type="email"
                              placeholder="you@example.com"
                              value={inquiryData.contact_email}
                              onChange={(e) => setInquiryData({ ...inquiryData, contact_email: e.target.value })}
                            />
                          </div>
                        </div>
                        {inquiryError && (
                          <p className="text-sm text-destructive">{inquiryError}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={createInquiry.isPending}>
                          {createInquiry.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4 mr-2" />
                          )}
                          Send Inquiry
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={handleBookmarkClick}
                    disabled={toggleBookmark.isPending}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-secondary text-secondary' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save Property'}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  Listed on {new Date(property.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
