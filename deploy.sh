#!/bin/bash
set -e

# Install Supabase CLI
npm install -g supabase

# Set the JWT secret using an environment variable
export SUPABASE_AUTH_JWT_SECRET="$SUPABASE_JWT_SECRET"

# Run database migrations
supabase db push

# Build the Next.js app
npm run build