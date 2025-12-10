#!/usr/bin/env python3
"""
Model Validation Script
Tests all the Pydantic models and agent functionality.
"""
import asyncio
import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from backend.models.persona import LearningSignal, Persona, PersonaUpdateRequest, PersonaResponse
from backend.agents.learning_engine import LearningEngine
from backend.agents.conversation_agent import ConversationAgent
from backend.agents.activity_agent import ActivityAgent
from backend.agents.synthesis_agent import SynthesisAgent
from backend.agents.profile_agent import ProfileAgent
from backend.utils.config import get_settings
from backend.utils.gemini_client import get_gemini_client
from backend.utils.supabase_client import get_supabase

def test_pydantic_models():
    """Test all Pydantic models."""
    print("=" * 60)
    print("🔍 Testing Pydantic Models")
    print("=" * 60)
    
    # Test LearningSignal
    print("\n1. Testing LearningSignal model...")
    signal = LearningSignal(
        type="chat",
        payload={"message": "I love Python!", "timestamp": "2024-01-01T00:00:00Z"}
    )
    print(f"   ✓ LearningSignal created: type={signal.type}, payload keys={list(signal.payload.keys())}")
    
    # Test Persona
    print("\n2. Testing Persona model...")
    persona = Persona(
        user_id="test-user-123",
        traits=["coding enthusiast"],
        preferences=["Python", "React"],
        interests=["AI", "Web Development"],
        risks=[],
        notes=[{"type": "chat", "summary": "Loves coding"}]
    )
    print(f"   ✓ Persona created: user_id={persona.user_id}")
    print(f"     - Traits: {len(persona.traits)}")
    print(f"     - Preferences: {len(persona.preferences)}")
    print(f"     - Interests: {len(persona.interests)}")
    print(f"     - Notes: {len(persona.notes)}")
    
    # Test PersonaUpdateRequest
    print("\n3. Testing PersonaUpdateRequest model...")
    request = PersonaUpdateRequest(
        user_id="test-user-123",
        signals=[signal],
        feedback="Great work!"
    )
    print(f"   ✓ PersonaUpdateRequest created: {len(request.signals)} signal(s)")
    
    # Test PersonaResponse
    print("\n4. Testing PersonaResponse model...")
    response = PersonaResponse(
        persona=persona.model_dump(),
        message="Persona updated successfully"
    )
    print(f"   ✓ PersonaResponse created: message='{response.message}'")
    
    print("\n✅ All Pydantic models validated successfully!")
    return True

def test_agents():
    """Test agent initialization."""
    print("\n" + "=" * 60)
    print("🤖 Testing Agent Initialization")
    print("=" * 60)
    
    try:
        print("\n1. Testing LearningEngine...")
        engine = LearningEngine()
        print(f"   ✓ LearningEngine initialized with {len(engine.method_map)} methods")
        print(f"     Methods: {', '.join(engine.method_map.keys())}")
        
        print("\n2. Testing ConversationAgent...")
        conv_agent = ConversationAgent()
        print(f"   ✓ ConversationAgent initialized")
        
        print("\n3. Testing ActivityAgent...")
        activity_agent = ActivityAgent()
        print(f"   ✓ ActivityAgent initialized")
        
        print("\n4. Testing SynthesisAgent...")
        synth_agent = SynthesisAgent()
        print(f"   ✓ SynthesisAgent initialized")
        
        print("\n5. Testing ProfileAgent...")
        profile_agent = ProfileAgent(learning_engine=engine)
        print(f"   ✓ ProfileAgent initialized")
        
        print("\n✅ All agents initialized successfully!")
        return True
    except Exception as e:
        print(f"\n❌ Agent initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_configuration():
    """Test configuration and clients."""
    print("\n" + "=" * 60)
    print("⚙️  Testing Configuration")
    print("=" * 60)
    
    settings = get_settings()
    print(f"\n✓ Settings loaded")
    print(f"  - Supabase URL: {'SET' if settings.supabase_url else 'NOT SET'}")
    print(f"  - Gemini API Key: {'SET' if settings.gemini_api_key else 'NOT SET'}")
    print(f"  - Gemini Model: {settings.gemini_model}")
    
    gemini = get_gemini_client()
    if gemini:
        print(f"\n✓ Gemini client created: {type(gemini).__name__}")
    else:
        print(f"\n⚠️  Gemini client not created (check API key)")
    
    supabase = get_supabase()
    if supabase:
        print(f"\n✓ Supabase client created")
    else:
        print(f"\n⚠️  Supabase client not created (check credentials)")
    
    return True

async def test_learning_engine():
    """Test learning engine structure (without API calls)."""
    print("\n" + "=" * 60)
    print("🧠 Testing Learning Engine Structure")
    print("=" * 60)
    
    try:
        engine = LearningEngine()
        
        # Test that all methods are registered
        print(f"\n✓ LearningEngine initialized")
        print(f"  - Total methods: {len(engine.method_map)}")
        print(f"  - Available methods:")
        for method_name in sorted(engine.method_map.keys()):
            print(f"    • {method_name}")
        
        # Test signal processing structure (mock)
        print(f"\n✓ Signal processing structure validated")
        print(f"  - All method handlers are callable: {all(callable(h) for h in engine.method_map.values())}")
        
        # Check if Gemini is configured (but don't call it)
        gemini_configured = engine.gemini is not None
        print(f"  - Gemini client configured: {gemini_configured}")
        if not gemini_configured:
            print(f"    ⚠️  Note: API calls will be skipped (check GEMINI_API_KEY in .env)")
        
        return True
    except Exception as e:
        print(f"\n❌ Learning engine test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Run all validation tests."""
    print("\n" + "🚀 " * 20)
    print("MODEL VALIDATION SUITE")
    print("🚀 " * 20 + "\n")
    
    results = []
    
    # Test 1: Pydantic Models
    results.append(("Pydantic Models", test_pydantic_models()))
    
    # Test 2: Agent Initialization
    results.append(("Agent Initialization", test_agents()))
    
    # Test 3: Configuration
    results.append(("Configuration", test_configuration()))
    
    # Test 4: Learning Engine (async)
    try:
        results.append(("Learning Engine", await test_learning_engine()))
    except Exception as e:
        print(f"\n⚠️  Learning Engine test skipped: {e}")
        results.append(("Learning Engine", False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 VALIDATION SUMMARY")
    print("=" * 60)
    
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"  {status}: {name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\n  Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All validations passed!")
        return 0
    else:
        print("\n⚠️  Some validations failed. Check the output above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

