#!/usr/bin/env python3
"""Test script to check backend functionality."""
import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.utils.config import get_settings
from backend.utils.supabase_client import get_supabase
from backend.utils.gemini_client import get_gemini_client

async def test_setup():
    print("🔍 Testing Backend Configuration...\n")
    
    # Test settings
    settings = get_settings()
    print(f"✓ Settings loaded")
    if settings.supabase_url:
        if settings.supabase_url.startswith("postgresql://"):
            print(f"  - ⚠️  Supabase URL is PostgreSQL connection string")
            print(f"     You need the HTTPS API URL: https://YOUR-PROJECT-ID.supabase.co")
        else:
            print(f"  - Supabase URL: {settings.supabase_url[:50]}...")
    else:
        print(f"  - Supabase URL: NOT SET")
    print(f"  - Gemini API Key: {'SET' if settings.gemini_api_key else 'NOT SET'}")
    print(f"  - Gemini Model: {settings.gemini_model}\n")
    
    # Test Supabase
    print("📊 Testing Supabase Connection...")
    if settings.supabase_url and settings.supabase_url.startswith("postgresql://"):
        print("⚠️  SUPABASE_URL is set to PostgreSQL connection string")
        print("   → Change it to the HTTPS API URL in your .env file:")
        print("   → SUPABASE_URL=https://lmsqigdkthgyyotamrzz.supabase.co")
        print("   → (Get the correct URL from Supabase Dashboard → Settings → API)\n")
    else:
        supabase = get_supabase()
        if supabase:
            print("✓ Supabase client created")
            try:
                # Try to query personas table
                result = supabase.table("personas").select("id").limit(1).execute()
                print(f"✓ Database connection OK (table exists)")
            except Exception as e:
                print(f"❌ Database error: {str(e)}")
                print("   → You may need to run supabase_setup.sql in your Supabase SQL Editor")
        else:
            print("⚠️  Supabase client not created")
            print("   → Check your .env file for SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY\n")
    
    # Test Gemini
    gemini = get_gemini_client()
    if gemini:
        print("✓ Gemini client created")
        try:
            response = gemini.generate_content("Say 'hello' in one word")
            print(f"✓ Gemini API working: {response.text}")
        except Exception as e:
            print(f"❌ Gemini API error: {str(e)}")
            print("   → Check your GEMINI_API_KEY in .env")
    else:
        print("❌ Gemini client not created (check .env file)\n")

if __name__ == "__main__":
    asyncio.run(test_setup())

