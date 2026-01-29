import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useCreateProperty } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft, Home } from 'lucide-react';
import { z } from 'zod';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  property_type: z.enum(['room', 'pg', 'hostel']),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  monthly_rent: z.number().min(500, 'Rent must be at least ₹500'),
  capacity: z.number().min(1).max(20),
});

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'parking', label: 'Parking' },
  { id: 'food', label: 'Food Included' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'gym', label: 'Gym' },
  { id: 'security', label: '24/7 Security' },
  { id: 'power_backup', label: 'Power Backup' },
];

export default function ListPropertyPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const createProperty = useCreateProperty();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'room',
    city: '',
    area: '',
    full_address: '',
    monthly_rent: '',
    security_deposit: '',
    capacity: '1',
    gender_preference: 'any',
    amenities: [],
  });
  const [error, setError] = useState(null);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const propertyData = {
      title: formData.title,
      description: formData.description,
      property_type: formData.property_type,
      city: formData.city,
      area: formData.area,
      monthly_rent: parseInt(formData.monthly_rent),
      capacity: parseInt(formData.capacity),
    };

    const validation = propertySchema.safeParse(propertyData);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    try {
      await createProperty.mutateAsync({
        owner_id: user.id,
        ...formData,
        monthly_rent: parseInt(formData.monthly_rent),
        security_deposit: parseInt(formData.security_deposit) || 0,
        capacity: parseInt(formData.capacity),
        images: [],
        is_available: true,
      });
      navigate('/profile');
    } catch {
      setError('Failed to create property. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-4rem)] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-6 h-6" />
                List Your Property
              </CardTitle>
              <CardDescription>
                Fill in the details below to list your property. It will be reviewed before going live.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Spacious 2BHK near Tech Park"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property, nearby landmarks, etc."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Property Type *</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="room">Private Room</SelectItem>
                          <SelectItem value="pg">PG</SelectItem>
                          <SelectItem value="hostel">Hostel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender Preference</Label>
                      <Select
                        value={formData.gender_preference}
                        onValueChange={(value) => setFormData({ ...formData, gender_preference: value })}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="male">Male Only</SelectItem>
                          <SelectItem value="female">Female Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area *</Label>
                      <Input
                        id="area"
                        placeholder="e.g., Andheri West"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address (Optional)</Label>
                    <Input
                      id="address"
                      placeholder="Complete address with landmarks"
                      value={formData.full_address}
                      onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Pricing & Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rent">Monthly Rent (₹) *</Label>
                      <Input
                        id="rent"
                        type="number"
                        placeholder="e.g., 8000"
                        value={formData.monthly_rent}
                        onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deposit">Security Deposit (₹)</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="e.g., 16000"
                        value={formData.security_deposit}
                        onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity *</Label>
                      <Select
                        value={formData.capacity}
                        onValueChange={(value) => setFormData({ ...formData, capacity: value })}
                      >
                        <SelectTrigger id="capacity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} {n === 1 ? 'person' : 'persons'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {AMENITY_OPTIONS.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.id}
                          checked={formData.amenities.includes(amenity.id)}
                          onCheckedChange={() => handleAmenityToggle(amenity.id)}
                        />
                        <Label htmlFor={amenity.id} className="text-sm cursor-pointer">
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full btn-primary" size="lg" disabled={createProperty.isPending}>
                  {createProperty.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : 'Submit for Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
