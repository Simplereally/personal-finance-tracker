#!/bin/bash
set -e

# Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
    npm install -g supabase
fi

# Run database migrations
supabase db push

# Build the Next.js app
npm run build