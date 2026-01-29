-- Create enum types
CREATE TYPE public.property_type AS ENUM ('room', 'pg', 'hostel');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.property_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL DEFAULT 'room',
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  full_address TEXT,
  monthly_rent INTEGER NOT NULL CHECK (monthly_rent > 0),
  security_deposit INTEGER DEFAULT 0,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  status property_status DEFAULT 'pending',
  capacity INTEGER DEFAULT 1,
  gender_preference TEXT DEFAULT 'any',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, property_id)
);

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Properties policies
CREATE POLICY "Anyone can view approved properties"
  ON public.properties FOR SELECT
  USING (status = 'approved' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can delete own properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add bookmarks"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove own bookmarks"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Inquiries policies
CREATE POLICY "Users can view own inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR property_id IN (SELECT id FROM public.properties WHERE owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create inquiries"
  ON public.inquiries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Property owners can update inquiry read status"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (property_id IN (SELECT id FROM public.properties WHERE owner_id = auth.uid()));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_monthly_rent ON public.properties(monthly_rent);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_owner ON public.properties(owner_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_inquiries_property ON public.inquiries(property_id);