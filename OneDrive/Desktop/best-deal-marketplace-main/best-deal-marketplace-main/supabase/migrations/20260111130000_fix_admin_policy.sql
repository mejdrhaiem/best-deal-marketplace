-- 1. Create a secure function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;

-- 3. Re-create policies using the secure function
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert categories" ON public.categories
FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" ON public.categories
FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can insert products" ON public.products
FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products
FOR UPDATE USING (public.is_admin());

-- 4. Make the user admin (if they exist)
UPDATE public.profiles
SET is_admin = true
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@bestdeal.com');
