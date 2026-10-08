import os
try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-pptx"])
    from pptx import Presentation
    from pptx.util import Inches, Pt

def create_presentation():
    prs = Presentation()

    # Define all slides based on user input
    slides_data = [
        {
            "title": "FORESIGHT: Title & Vision",
            "body": "• FORESIGHT: El Niño Food Security & Sustainable Supply Chain Platform\n• Tagline: Detect → Predict → Explain → Decide → Act\n• VELSATHON Hackathon 2026 Submission\n• Problem Statement: Food Security & Sustainable Supply Chain under El Niño Shocks\n• Coverage: 665 Districts (All India 28 States & 8 UTs + 38 Tamil Nadu Districts Deep-Dive)",
            "notes": "Good morning judges! We are presenting FORESIGHT—an AI-powered food security operating system built to tackle El Niño climate shocks. When climate shocks hit, traditional tools only give passive warnings. FORESIGHT goes from detection and explainable prediction all the way to autonomous supply chain redistribution."
        },
        {
            "title": "The Problem & Vulnerability Cascade",
            "body": "• The Core Crisis: El Niño disrupts the interconnected food web (Production → Availability → Affordability → Movement → Consumption).\n• The Critical Gap in Existing Tools:\n  - Weather apps stop at rain forecasts.\n  - Agri-dashboards predict yield drop but ignore logistics bottlenecks.\n  - Market apps track price spikes after food shortages hit vulnerable families.",
            "notes": "El Niño is not just a drought—it's a systemic supply chain failure. A 28% rainfall deficit in Thanjavur leads to yield collapse, warehouse depletion, transport delays, and sudden retail price spikes. Most tools fail because they treat these in isolation. FORESIGHT connects all 6 nodes into a living digital twin."
        },
        {
            "title": "Our Solution: FORESIGHT OS",
            "body": "• Detect: Real-time integration of IMD rainfall deficit, OpenWeatherMap temperature, and reservoir storage levels.\n• Predict: Machine learning models predicting 30-day district-level food supply gaps.\n• Explain: SHAP root-cause attribution isolating the primary driver of risk.\n• Decide: Weather-aware linear programming solver recommending optimal surplus-to-deficit grain redistribution.\n• Act & Verify: Post-intervention simulation quantifying crisis score reduction.",
            "notes": "FORESIGHT operates on a 5-step closed-loop. We detect climate anomalies, predict 30-day food supply gaps, explain the root cause using SHAP, decide the optimal grain routing strategy, and measure the exact risk reduction."
        },
        {
            "title": "100% Real-World Data Baseline",
            "body": "• Zero Fake Filler Data: Built on 100% authentic Indian government data repositories.\n• Districts & Coordinates: Local Government Directory (LGD)\n• Agricultural Production: DES\n• Storage Infrastructure: FCI / SWC / NCCD\n• Strict Storage Distinction: Physical stock is explicitly tagged MISSING (Stock Unobserved) to prevent mislabeling.",
            "notes": "We built our system on 100% real Indian data across all 665 districts. Crucially, we maintain strict data integrity: we never mislabel storage capacity as physical inventory stock. If physical stock is unobserved, we explicitly mark it missing rather than fabricating numbers."
        },
        {
            "title": "Interactive Command Center & Digital Twin",
            "body": "• Interactive Google Maps Layer: Live plotting of 665 district pins color-coded by vulnerability score.\n• District Side-Panel: Instant deep-dive into crop type, area sown, yield, storage capacity, 30-day demand, and retail prices.\n• Real-Time API Integration: Live OpenWeatherMap API weather stream.",
            "notes": "Here is our live Command Center. Judges can click on any district across India—like Thanjavur or Chengalpattu—and instantly view its agricultural digital twin, storage infrastructure, live OpenWeatherMap weather feed, and vulnerability metrics."
        },
        {
            "title": "What-If El Niño Crisis Simulator",
            "body": "• Interactive Stress Testing: Allows decision-makers to simulate mild, moderate, and severe El Niño events.\n• Dynamic Risk Propagation: Calculates instantaneous impacts on crop yields, regional food gaps, and household affordability.\n• Metrics tracked: Yield Impact, 30-Day Food Deficit, Retail Price Risk, Vulnerable People Exposed.",
            "notes": "Our What-If Simulator gives decision-makers full control. By sliding El Niño rainfall deficits or temperature anomalies, the digital twin instantly re-calculates crop yield losses, food supply gaps, and price exposure before the crisis hits."
        },
        {
            "title": "SHAP Root-Cause Explainability Engine",
            "body": "• Why Explainability Matters: Black-box AI predictions are unusable for government food allocation.\n• SHAP Feature Importance Breakdown:\n  - Rainfall Deficit (%): +32.4% risk contribution\n  - Reservoir Level (%): +24.1% risk contribution\n  - Yield Vulnerability: +18.6% risk contribution\n  - Distance to Logistics Hub: +12.2% risk contribution",
            "notes": "Judges don't just want to see a 'High Risk' label—they want to know WHY. We integrated SHAP explainability into our XGBoost risk model. It breaks down the exact percentage contribution of rainfall, heat, reservoir levels, and logistics distance."
        },
        {
            "title": "AI Supply Redistribution & Routing Engine",
            "body": "• Linear Programming Optimization: Matches surplus grain hubs (V < 35.0) with critical deficit districts (V > 65.0).\n• Weather-Aware Corridor Selection: Evaluates route distance (km) against highway flood/disruption risks.\n• Pre-Computed Database: Includes 30 priority supply redistribution corridor pairs across India.",
            "notes": "This is where FORESIGHT becomes actionable. When a district hits critical risk, our AI Supply Redistribution Engine identifies nearby surplus hubs and calculates the safest, weather-aware transport corridor to move food grain before shortages occur."
        },
        {
            "title": "Vulnerability & Affordability Index",
            "body": "• V = 0.35 × Climate + 0.30 × Production + 0.20 × Storage + 0.15 × Logistics\n• Multi-Dimensional Index: Combines climate stress, crop production loss, warehousing deficits, and market price sensitivity.\n• Human-Centric Impact Metric: Directly calculates the number of vulnerable individuals exposed to food insecurity (e.g. 2.1M people).",
            "notes": "Our Vulnerability Index evaluates climate, crop loss, storage capacity, and market price sensitivity into a unified score. More importantly, it translates tonnes of food loss into human lives protected."
        },
        {
            "title": "Tech Stack & Cloud Architecture",
            "body": "• Frontend: Next.js 16, React 19, Tailwind CSS, Google Maps API, OpenWeatherMap REST API.\n• Core ML & Data: Python, Pandas, NumPy, XGBoost Regressor, SHAP, PuLP.\n• Deployment: Vercel frontend + AWS Lambda & S3 serverless infrastructure.",
            "notes": "FORESIGHT is built on Next.js 16 and React 19, integrated with Google Maps and OpenWeatherMap APIs. Our backend runs on Python ML pipelines and deploys serverlessly via AWS Lambda and Vercel."
        },
        {
            "title": "Demonstrated Results & Risk Reduction",
            "body": "• BEFORE: Vulnerability Score 74.2 (CRITICAL) → AFTER: 38.5 (STABLE)\n• BEFORE: Shortage Probability 48% → AFTER: 9%\n• BEFORE: Price Spike Exposure +18% → AFTER: +4%\n• BEFORE: Vulnerable People at Risk 1.19M → AFTER: 210K\n• Food Spoilage Reduction: 72-hour window alert system prevents spoilage.",
            "notes": "Here is our single biggest takeaway: FORESIGHT doesn't just predict a crisis—it proves how much the crisis is reduced. In our simulation, executing the recommended grain redistribution reduced district vulnerability from 74.2 down to 38.5."
        },
        {
            "title": "Conclusion & Q&A",
            "body": "• Summary Statement: \"Don't just predict food-system disruption — simulate it, explain it, execute the intervention, and protect human lives.\"\n• GitHub Repository: leelaprasath-cmd/FORESIGHT\n• Live Command Center Demo: Available on /live-map\n• Thank You & Q&A!",
            "notes": "Thank you judges! FORESIGHT delivers an operational digital twin for food security under El Niño climate shocks. All code, datasets, and reports are live on GitHub. We welcome your questions!"
        }
    ]

    for slide_data in slides_data:
        # 1 is the layout for Title and Content
        slide_layout = prs.slide_layouts[1]
        slide = prs.slides.add_slide(slide_layout)
        
        title = slide.shapes.title
        content = slide.placeholders[1]
        
        title.text = slide_data["title"]
        content.text = slide_data["body"]
        
        # Add speaker notes
        notes_slide = slide.notes_slide
        text_frame = notes_slide.notes_text_frame
        text_frame.text = slide_data["notes"]

    output_path = os.path.join(os.getcwd(), "FORESIGHT_Hackathon_Deck.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
