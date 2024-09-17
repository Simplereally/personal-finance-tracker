#!/bin/bash
set -e

# Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
    npm install -g supabase
fi

# Authenticate Supabase CLI
echo "$SUPABASE_ACCESS_TOKEN" | supabase login

# Link to the Supabase project
supabase link --project-ref "$SUPABASE_PROJECT_ID" --password-stdin <<< "$SUPABASE_DB_PASSWORD"

# Run database migrations
supabase db push

# Build the Next.js app
npm run build