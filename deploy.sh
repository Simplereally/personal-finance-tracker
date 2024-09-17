#!/bin/bash
set -e

echo "Starting deployment process..."

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
    
    # Add a timeout to the Supabase commands
    timeout 60s supabase link --project-ref "$SUPABASE_PROJECT_ID" || { echo "Error: Supabase link timed out"; exit 1; }
    echo "Supabase project linked successfully."
    
    timeout 120s supabase db push || { echo "Error: Supabase db push timed out"; exit 1; }
    echo "Database migrations completed successfully."
fi

# Build the Next.js app
echo "Building the Next.js app..."
npm run build

echo "Deployment process completed."