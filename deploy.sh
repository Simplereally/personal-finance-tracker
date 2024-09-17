#!/bin/bash
set -e

# Install Supabase CLI
npm install supabase --save-dev

# Run database migrations
npx supabase db push

# Build the Next.js app
npm run build