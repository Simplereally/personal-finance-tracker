#!/bin/bash
set -e

# Set the JWT secret using an environment variable
export SUPABASE_AUTH_JWT_SECRET="$SUPABASE_JWT_SECRET"

# Run database migrations
npx supabase db push

# Build the Next.js app
npm run build