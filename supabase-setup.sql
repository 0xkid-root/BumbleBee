-- SQL script to set up Supabase tables and functions for BumbleBee application

-- Function to create users table if it doesn't exist
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'users'
  ) THEN
    -- Create the users table
    CREATE TABLE public.users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      wallet_address TEXT NOT NULL UNIQUE,
      connected_chain TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add row level security policies
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow public read access" 
      ON public.users 
      FOR SELECT 
      USING (true);

    CREATE POLICY "Allow authenticated insert" 
      ON public.users 
      FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "Allow individual update" 
      ON public.users 
      FOR UPDATE 
      USING (auth.uid() = id);

    -- Create index on wallet_address for faster lookups
    CREATE INDEX users_wallet_address_idx ON public.users (wallet_address);

    RAISE NOTICE 'Created users table';
  ELSE
    RAISE NOTICE 'Users table already exists';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create waitlist table if it doesn't exist
CREATE OR REPLACE FUNCTION create_waitlist_table()
RETURNS void AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'waitlist'
  ) THEN
    -- Create the waitlist table
    CREATE TABLE public.waitlist (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      interests TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add row level security policies
    ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow public insert" 
      ON public.waitlist 
      FOR INSERT 
      WITH CHECK (true);

    CREATE POLICY "Allow admin read access" 
      ON public.waitlist 
      FOR SELECT 
      USING (auth.role() = 'authenticated');

    -- Create index on email for faster lookups
    CREATE INDEX waitlist_email_idx ON public.waitlist (email);

    RAISE NOTICE 'Created waitlist table';
  ELSE
    RAISE NOTICE 'Waitlist table already exists';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the functions to create tables if they don't exist
SELECT create_users_table();
SELECT create_waitlist_table();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
