"""
FoodWise - Synthetic Restaurant Surplus Dataset Generator
Simulates realistic commercial kitchen surplus patterns for Chennai food providers
(banquet halls, biryani restaurants, bakeries, supermarkets).
"""

import csv
import random
from datetime import datetime, timedelta

PROVIDERS = [
    {"id": "prov-1", "name": "Taj Coromandel", "type": "HOTEL_BANQUET"},
    {"id": "prov-2", "name": "Anjappar Chettinad", "type": "RESTAURANT"},
    {"id": "prov-3", "name": "The French Loaf", "type": "BAKERY"},
    {"id": "prov-4", "name": "Sangeetha Veg", "type": "VEG_RESTAURANT"},
    {"id": "prov-5", "name": "Nilgiris Supermarket", "type": "SUPERMARKET"},
]

CATEGORIES = ["MEALS", "BAKERY", "FRESH_PRODUCE", "DAIRY", "SNACKS"]
DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def generate_dataset(num_samples=2000, output_file="ml/chennai_food_surplus_data.csv"):
    start_date = datetime(2026, 1, 1)
    
    with open(output_file, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            "date",
            "provider_id",
            "provider_type",
            "category",
            "day_of_week",
            "is_weekend",
            "rain_probability",
            "temperature_celsius",
            "banquet_event_index",
            "portions_prepared",
            "portions_sold_regular",
            "surplus_portions",
            "clearance_rate_pct"
        ])
        
        for i in range(num_samples):
            current_date = start_date + timedelta(days=i % 180)
            day_name = current_date.strftime("%A")
            is_weekend = 1 if day_name in ["Saturday", "Sunday"] else 0
            provider = random.choice(PROVIDERS)
            category = random.choice(CATEGORIES)
            
            # Weather simulation (Chennai tropical)
            rain_prob = round(random.uniform(0.05, 0.70 if current_date.month in [10, 11, 12] else 0.20), 2)
            temp = round(random.uniform(28.0, 38.0), 1)
            
            # Banquet and catering event intensity
            banquet_index = round(random.uniform(0.1, 0.95) if (is_weekend or day_name == "Friday") else random.uniform(0.0, 0.4), 2)
            
            # Preparation volume
            if provider["type"] == "HOTEL_BANQUET":
                prepared = random.randint(80, 250)
            elif provider["type"] == "BAKERY":
                prepared = random.randint(40, 120)
            else:
                prepared = random.randint(50, 160)
                
            # Regular sales influenced by rain and day
            rain_drop_factor = (1 - (rain_prob * 0.25))
            weekend_boost = 1.2 if is_weekend else 1.0
            
            sales_ratio = min(0.95, random.uniform(0.68, 0.88) * rain_drop_factor * (1.0 if not is_weekend else 1.05))
            sold = int(prepared * sales_ratio)
            surplus = max(0, prepared - sold)
            clearance_rate = round((sold / prepared) * 100, 1)
            
            writer.writerow([
                current_date.strftime("%Y-%m-%d"),
                provider["id"],
                provider["type"],
                category,
                day_name,
                is_weekend,
                rain_prob,
                temp,
                banquet_index,
                prepared,
                sold,
                surplus,
                clearance_rate
            ])
            
    print(f"[SUCCESS] Generated {num_samples} samples saved to {output_file}")

if __name__ == "__main__":
    generate_dataset()
