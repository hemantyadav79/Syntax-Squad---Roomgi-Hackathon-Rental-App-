// Property types
// type PropertyType = 'room' | 'pg' | 'hostel';
// type PropertyStatus = 'pending' | 'approved' | 'rejected';
// type AppRole = 'admin' | 'user';

// Property object structure
export const Property = {
  id: '',                 // string
  owner_id: '',           // string
  title: '',              // string
  description: null,      // string | null
  property_type: '',      // 'room' | 'pg' | 'hostel'
  city: '',               // string
  area: '',               // string
  full_address: null,     // string | null
  monthly_rent: 0,        // number
  security_deposit: 0,    // number
  amenities: [],          // string[]
  images: [],             // string[]
  is_available: true,     // boolean
  is_verified: false,     // boolean
  status: '',             // 'pending' | 'approved' | 'rejected'
  capacity: 0,            // number
  gender_preference: '',  // string
  created_at: '',         // string
  updated_at: '',         // string
};

// Profile object structure
export const Profile = {
  id: '',             // string
  user_id: '',        // string
  full_name: '',      // string
  email: '',          // string
  phone: null,        // string | null
  avatar_url: null,   // string | null
  created_at: '',     // string
  updated_at: '',     // string
};

// Bookmark object structure
export const Bookmark = {
  id: '',            // string
  user_id: '',       // string
  property_id: '',   // string
  created_at: '',    // string
};

// Inquiry object structure
export const Inquiry = {
  id: '',              // string
  user_id: '',         // string
  property_id: '',     // string
  message: '',         // string
  contact_phone: null, // string | null
  contact_email: null, // string | null
  is_read: false,      // boolean
  created_at: '',      // string
};

// UserRole object structure
export const UserRole = {
  id: '',         // string
  user_id: '',    // string
  role: '',       // 'admin' | 'user'
};

// PropertyFilters object structure
export const PropertyFilters = {
  city: '',            // string | undefined
  property_type: '',   // 'room' | 'pg' | 'hostel' | undefined
  minPrice: 0,         // number | undefined
  maxPrice: 0,         // number | undefined
  amenities: [],       // string[] | undefined
  is_available: true,  // boolean | undefined
};
