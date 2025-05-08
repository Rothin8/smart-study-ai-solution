
-- This SQL file is for reference only, but should be run in Supabase SQL editor
-- Create a database function to get orders with user emails

CREATE OR REPLACE FUNCTION public.get_orders_with_emails()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_email text,
  order_id text,
  payment_id text,
  amount integer,
  subscription_type text,
  status text,
  created_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.id,
    o.user_id,
    au.email as user_email,
    o.order_id,
    o.payment_id,
    o.amount,
    o.subscription_type,
    o.status,
    o.created_at
  FROM
    public.orders o
  JOIN
    auth.users au ON o.user_id = au.id
  ORDER BY
    o.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_orders_with_emails IS 'Get all orders with associated user emails for admin dashboard';

-- Note: This function needs to be run in the Supabase SQL editor
