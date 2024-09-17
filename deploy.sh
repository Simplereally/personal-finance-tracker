#!/bin/bash
set -e

# Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
    npm install -g supabase
fi

# Authenticate Supabase CLI
supabase login --access-token "$SUPABASE_ACCESS_TOKEN"

# Link to the Supabase project
supabase link --project-ref "$SUPABASE_PROJECT_ID"

# Run database migrations
supabase db push

# Build the Next.js app
npm run build