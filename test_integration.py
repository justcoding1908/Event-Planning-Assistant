#!/usr/bin/env python3
"""
Quick integration test for the Event Planning Assistant
Tests the full flow: event details → backend API → chatbot response
"""

import requests
import json

def test_event_planning_api():
    """Test the /generate-plan endpoint"""
    
    backend_url = "http://127.0.0.1:5000/generate-plan"
    
    test_cases = [
        {
            "event_type": "birthday",
            "guests": 50,
            "budget": 100000,
            "description": "Birthday Event (50 guests, ₹100k)"
        },
        {
            "event_type": "wedding",
            "guests": 200,
            "budget": 500000,
            "description": "Wedding (200 guests, ₹500k)"
        },
        {
            "event_type": "corporate",
            "guests": 150,
            "budget": 300000,
            "description": "Corporate Event (150 guests, ₹300k)"
        },
    ]
    
    print("=" * 60)
    print("Event Planning Assistant - Integration Test")
    print("=" * 60)
    
    for test_case in test_cases:
        print(f"\n🧪 Testing: {test_case['description']}")
        print("-" * 60)
        
        try:
            response = requests.post(backend_url, json={
                "event_type": test_case["event_type"],
                "guests": test_case["guests"],
                "budget": test_case["budget"],
            })
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Status: SUCCESS")
                print(f"   Event Type: {data['data']['event_type']}")
                print(f"   Guests: {data['data']['guests']}")
                print(f"   Budget: ₹{data['data']['budget']}")
                print(f"   Plan Length: {len(data['data']['generated_plan'])} characters")
                print(f"\n   Generated Plan Preview:")
                plan = data['data']['generated_plan']
                preview = plan[:300] + "..." if len(plan) > 300 else plan
                print(f"   {preview}")
            else:
                print(f"❌ Status Code: {response.status_code}")
                print(f"   Error: {response.json()}")
                
        except Exception as e:
            print(f"❌ Connection Error: {str(e)}")
            print("   Make sure the backend is running on http://127.0.0.1:5000")
    
    print("\n" + "=" * 60)
    print("Integration Test Complete!")
    print("=" * 60)

if __name__ == "__main__":
    test_event_planning_api()
