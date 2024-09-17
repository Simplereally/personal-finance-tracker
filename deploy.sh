#!/bin/bash
set -e

echo "Starting deployment script"

# Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI"
    npm install -g supabase
fi

echo "Setting up Supabase credentials"
export SUPABASE_ACCESS_TOKEN

echo "Linking to Supabase project"
supabase link --project-ref "$SUPABASE_PROJECT_ID"

echo "Running database migrations"
supabase db push

echo "Building Next.js app"
npm run build

echo "Deployment script completed"