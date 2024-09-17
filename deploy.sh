#!/bin/bash
set -e

# Check if Supabase CLI is installed, if not, install it
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found, installing..."
    npm install -g supabase
fi

# Check if required environment variables are set
if [ -z "$SUPABASE_ACCESS_TOKEN" ] || [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_ID not set. Skipping migrations."
else
    echo "Running database migrations..."
    supabase link --project-ref "$SUPABASE_PROJECT_ID"
    supabase db push
fi

# Build the Next.js app
echo "Building the Next.js app..."
npm run build