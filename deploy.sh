#!/bin/bash
set -e

# Replace placeholders in config.toml with actual secrets
sed -i 's/SUPABASE_JWT_SECRET/'"$SUPABASE_JWT_SECRET"'/' supabase/config.toml
    

# Run database migrations
npx supabase db push

# Build the Next.js app
npm run build