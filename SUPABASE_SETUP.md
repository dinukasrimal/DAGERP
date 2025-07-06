# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: Garment ERP
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"

## 2. Setup Database Schema

1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" in the sidebar
3. Copy the contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Go to your Supabase project dashboard
3. Navigate to "Settings" → "API"
4. Copy the following values to your `.env` file:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public key** → `REACT_APP_SUPABASE_ANON_KEY`

Your `.env` file should look like:
```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Test the Connection

1. Start the development server:
   ```bash
   npm start
   ```

2. Go to Order Management
3. Try creating a new order
4. Check your Supabase dashboard → "Table Editor" to see the data

## 5. Row Level Security (Optional)

The schema includes basic RLS policies. To restrict access:

1. Go to "Authentication" → "Policies"
2. Modify policies based on your security requirements
3. Set up user authentication if needed

## 6. Realtime Features (Optional)

To enable real-time updates:

1. Go to "Database" → "Replication"
2. Enable replication for tables you want real-time updates
3. Update your React components to use Supabase realtime subscriptions

## Troubleshooting

- **Connection Issues**: Check your environment variables
- **CORS Errors**: Ensure your localhost is added to allowed origins in Supabase
- **Permission Denied**: Check RLS policies and authentication status
- **Schema Errors**: Verify the SQL was executed successfully in SQL Editor

## Features Enabled

✅ Customer Management
✅ Style Management  
✅ Order Creation with Complex Configurations
✅ Pack/Color/Size Allocations
✅ Real-time Database Updates
✅ Automatic Timestamps
✅ UUID Primary Keys
✅ Foreign Key Constraints