#!/bin/bash
set -e

# Run database migrations
npx supabase db push

# Build the Next.js app
npm run build