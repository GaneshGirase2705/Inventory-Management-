"""
Synthetic Data Generator for Thermal Power Plant SMS.
Seeds PostgreSQL / CSV with realistic equipment running hours, MTBF failure events,
and annual boiler overhaul spikes for LightGBM ROP modeling and Isolation Forest anomaly detection.
"""
import os
import random
import datetime
import numpy as np
import pandas as pd
from sqlalchemy import create_engine, text

# Database connection URL (configurable via env var for GCP / local)
DB_URL = os.getenv("DB_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/sms_db")

# Authentic Thermal Power Plant Spares & Consumption Profiles
COMPONENTS = {
    "Boiler Feed Pump Mechanical Seal Cartridge Assembly": {
        "plant_unit": "UNIT_1", "mtbf_hours": 2400, "base_usage": 0.033, "spike_prob": 0.015, "spike_factor": 6
    },
    "Main Steam Safety Relief Valve Disc SA-182 F91": {
        "plant_unit": "UNIT_1", "mtbf_hours": 4000, "base_usage": 0.012, "spike_prob": 0.008, "spike_factor": 4
    },
    "Platen Superheater Tube Bend SA213-T91 (54mm OD x 8mm WT)": {
        "plant_unit": "UNIT_1", "mtbf_hours": 3200, "base_usage": 0.450, "spike_prob": 0.020, "spike_factor": 8
    },
    "HP Turbine Journal Bearing White Metal Babbit Liner": {
        "plant_unit": "UNIT_2", "mtbf_hours": 6000, "base_usage": 0.005, "spike_prob": 0.005, "spike_factor": 3
    },
    "Main Stop Valve (MSV) Electro-Hydraulic Servo Valve": {
        "plant_unit": "UNIT_2", "mtbf_hours": 2800, "base_usage": 0.025, "spike_prob": 0.010, "spike_factor": 5
    },
    "Turbine Main Lube Oil Duplex Filter Element 5-Micron": {
        "plant_unit": "UNIT_2", "mtbf_hours": 720, "base_usage": 0.160, "spike_prob": 0.040, "spike_factor": 4
    },
    "High-Temp Spiral Wound Graphite Gasket 600# DN100": {
        "plant_unit": "COMMON", "mtbf_hours": 500, "base_usage": 0.850, "spike_prob": 0.050, "spike_factor": 6
    },
    "Coal Crusher Ring Granulator Hammer Cast Manganese Steel": {
        "plant_unit": "COMMON", "mtbf_hours": 1200, "base_usage": 0.650, "spike_prob": 0.025, "spike_factor": 7
    },
    "Ash Slurry Disposal Pump Nihard Impeller & Volute Casing": {
        "plant_unit": "COMMON", "mtbf_hours": 1800, "base_usage": 0.080, "spike_prob": 0.020, "spike_factor": 5
    },
    "6.6kV Vacuum Circuit Breaker Vacuum Interrupter Bottle Pole": {
        "plant_unit": "UNIT_2", "mtbf_hours": 8760, "base_usage": 0.015, "spike_prob": 0.004, "spike_factor": 3
    },
    "Smart Differential Pressure Transmitter HART Protocol 4-20mA": {
        "plant_unit": "UNIT_1", "mtbf_hours": 4500, "base_usage": 0.040, "spike_prob": 0.008, "spike_factor": 3
    },
    "Reverse Osmosis (RO) Polyamide Spiral Wound Membrane Element 8\"": {
        "plant_unit": "COMMON", "mtbf_hours": 2000, "base_usage": 0.120, "spike_prob": 0.015, "spike_factor": 4
    }
}

def generate_consumption_data(days: int = 1095) -> pd.DataFrame:
    """Generate 3 years of daily consumption data with MTBF failures and overhaul spikes."""
    np.random.seed(42)
    random.seed(42)

    start_date = datetime.date(2023, 1, 1)
    dates = [start_date + datetime.timedelta(days=i) for i in range(days)]

    records = []

    for comp_name, profile in COMPONENTS.items():
        mtbf_days = max(15, int(profile["mtbf_hours"] / 24))
        base_usage = profile["base_usage"]
        spike_prob = profile["spike_prob"]
        spike_factor = profile["spike_factor"]
        plant_unit = profile["plant_unit"]

        # Generate MTBF failure intervals
        failure_days = set()
        current_day = random.randint(10, 45)
        while current_day < days:
            failure_days.add(current_day)
            interval = int(np.random.exponential(mtbf_days))
            current_day += max(10, interval)

        for i, date in enumerate(dates):
            usage = base_usage * random.uniform(0.7, 1.3)
            is_failure = (i in failure_days)

            if is_failure:
                usage *= spike_factor

            # Unscheduled anomaly spike
            if random.random() < spike_prob:
                usage *= random.uniform(2.0, 4.0)

            # Annual Scheduled Overhaul Spikes (April / May)
            if date.month in [4, 5] and "Boiler" in comp_name:
                usage *= 5.0
            elif date.month in [10, 11] and "Turbine" in comp_name:
                usage *= 4.0

            running_hours = 24.0 if not is_failure else round(random.uniform(8.0, 18.0), 1)

            records.append({
                "component_name": comp_name,
                "plant_unit": plant_unit,
                "consumption_date": date,
                "daily_usage": round(max(0.0, usage), 4),
                "running_hours": running_hours,
                "failure_event": is_failure
            })

    return pd.DataFrame(records)

def seed_database():
    """Generates synthetic dataset and attempts PostgreSQL insertion with CSV backup."""
    df = generate_consumption_data()

    # Always persist synthetic CSV backup
    csv_path = os.path.join(os.path.dirname(__file__), "synthetic_consumption.csv")
    df.to_csv(csv_path, index=False)
    print(f"[OK] Generated {len(df)} synthetic consumption records -> {csv_path}")

    try:
        engine = create_engine(DB_URL, connect_args={"connect_timeout": 5})
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS consumption_history (
                    id BIGSERIAL PRIMARY KEY,
                    component_name VARCHAR(100) NOT NULL,
                    plant_unit VARCHAR(50) NOT NULL,
                    consumption_date DATE NOT NULL,
                    daily_usage NUMERIC(12, 4) NOT NULL,
                    running_hours NUMERIC(6, 2) NOT NULL,
                    failure_event BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Bulk insert in batches of 500
            for i in range(0, len(df), 500):
                batch = df.iloc[i:i+500]
                rows = batch.to_dict(orient="records")
                conn.execute(text("""
                    INSERT INTO consumption_history
                    (component_name, plant_unit, consumption_date, daily_usage, running_hours, failure_event)
                    VALUES (:component_name, :plant_unit, :consumption_date, :daily_usage, :running_hours, :failure_event)
                """), rows)
            conn.commit()
        print(f"[SUCCESS] Successfully seeded {len(df)} rows into PostgreSQL consumption_history table.")
    except Exception as e:
        print(f"[NOTE] Database seeding bypassed ({e}). Synthetic CSV cache will be used for AI inference.")

if __name__ == "__main__":
    seed_database()
