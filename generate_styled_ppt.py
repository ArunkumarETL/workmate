import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_styled_presentation():
    prs = Presentation()
    
    # Premium Dark Theme Colors
    BG_COLOR = RGBColor(15, 23, 42)      # Deep Dark Blue/Slate
    TITLE_COLOR = RGBColor(56, 189, 248) # Neon Cyan
    TEXT_COLOR = RGBColor(241, 245, 249) # Off-White
    ACCENT_COLOR = RGBColor(251, 191, 36) # Gold/Amber

    slides_data = [
        {
            "title": "FORESIGHT",
            "body": "El Niño Food Security & Sustainable Supply Chain Platform\n\nDetect → Predict → Explain → Decide → Act\n\nVELSATHON Hackathon 2026 Submission\nCoverage: 665 Districts (All India + Tamil Nadu Deep-Dive)",
            "notes": "Good morning judges! We are presenting FORESIGHT—an AI-powered food security operating system built to tackle El Niño climate shocks. When climate shocks hit, traditional tools only give passive warnings. FORESIGHT goes from detection and explainable prediction all the way to autonomous supply chain redistribution."
        },
        {
            "title": "The Problem & Vulnerability Cascade",
            "body": "• THE CORE CRISIS: El Niño disrupts the interconnected food web (Production → Availability → Affordability → Movement → Consumption).\n\n• THE CRITICAL GAP IN EXISTING TOOLS:\n  - Weather apps stop at rain forecasts.\n  - Agri-dashboards predict yield drop but ignore logistics bottlenecks.\n  - Market apps track price spikes after food shortages hit vulnerable families.",
            "notes": "El Niño is not just a drought—it's a systemic supply chain failure. A 28% rainfall deficit in Thanjavur leads to yield collapse, warehouse depletion, transport delays, and sudden retail price spikes. Most tools fail because they treat these in isolation. FORESIGHT connects all 6 nodes into a living digital twin."
        },
        {
            "title": "Our Solution: FORESIGHT OS",
            "body": "• DETECT: Real-time integration of IMD rainfall deficit & OpenWeatherMap.\n• PREDICT: Machine learning models predicting 30-day food supply gaps.\n• EXPLAIN: SHAP root-cause attribution isolating the primary driver of risk.\n• DECIDE: Linear programming solver recommending optimal surplus-to-deficit grain redistribution.\n• ACT: Post-intervention simulation quantifying crisis score reduction.",
            "notes": "FORESIGHT operates on a 5-step closed-loop. We detect climate anomalies, predict 30-day food supply gaps, explain the root cause using SHAP, decide the optimal grain routing strategy, and measure the exact risk reduction."
        },
        {
            "title": "100% Real-World Data Baseline",
            "body": "• ZERO FAKE DATA: Built on authentic Indian government repositories.\n\n• Districts & Coordinates: Local Government Directory (LGD)\n• Agricultural Production: DES\n• Storage Infrastructure: FCI / SWC / NCCD\n\n• STRICT STORAGE DISTINCTION: Physical stock is explicitly tagged MISSING (Stock Unobserved) to prevent mislabeling structural capacity as actual food.",
            "notes": "We built our system on 100% real Indian data across all 665 districts. Crucially, we maintain strict data integrity: we never mislabel storage capacity as physical inventory stock. If physical stock is unobserved, we explicitly mark it missing rather than fabricating numbers."
        },
        {
            "title": "Interactive Digital Twin Command Center",
            "body": "• GOOGLE MAPS LAYER: Live plotting of 665 district pins color-coded by vulnerability score.\n\n• DISTRICT SIDE-PANEL: Instant deep-dive into crop type, area sown, yield, storage capacity, 30-day demand, and retail prices.\n\n• REAL-TIME API: Live OpenWeatherMap API weather stream.",
            "notes": "Here is our live Command Center. Judges can click on any district across India—like Thanjavur or Chengalpattu—and instantly view its agricultural digital twin, storage infrastructure, live OpenWeatherMap weather feed, and vulnerability metrics."
        },
        {
            "title": "What-If El Niño Crisis Simulator",
            "body": "• INTERACTIVE STRESS TESTING: Simulate mild, moderate, and severe El Niño events in real-time.\n\n• DYNAMIC RISK PROPAGATION: Calculates instantaneous impacts on crop yields, regional food gaps, and household affordability.\n\n• METRICS TRACKED:\n  - Yield Impact (%)\n  - 30-Day Food Deficit (Tonnes)\n  - Retail Price Risk Spike\n  - Vulnerable People Exposed",
            "notes": "Our What-If Simulator gives decision-makers full control. By sliding El Niño rainfall deficits or temperature anomalies, the digital twin instantly re-calculates crop yield losses, food supply gaps, and price exposure before the crisis hits."
        },
        {
            "title": "SHAP Root-Cause Explainability Engine",
            "body": "• WHY IT MATTERS: Black-box AI predictions are unusable for government food allocation.\n\n• SHAP FEATURE IMPORTANCE BREAKDOWN:\n  [+] Rainfall Deficit: 32.4% risk contribution\n  [+] Reservoir Level: 24.1% risk contribution\n  [+] Yield Vulnerability: 18.6% risk contribution\n  [+] Distance to Logistics Hub: 12.2% risk contribution",
            "notes": "Judges don't just want to see a 'High Risk' label—they want to know WHY. We integrated SHAP explainability into our XGBoost risk model. It breaks down the exact percentage contribution of rainfall, heat, reservoir levels, and logistics distance."
        },
        {
            "title": "AI Supply Redistribution Solver",
            "body": "• LINEAR PROGRAMMING OPTIMIZATION: Matches surplus grain hubs with critical deficit districts.\n\n• WEATHER-AWARE CORRIDORS: Evaluates route distance (km) against highway flood/disruption risks.\n\n• PRE-COMPUTED DATABASE: Includes 30 priority supply redistribution corridor pairs across India ready for immediate deployment.",
            "notes": "This is where FORESIGHT becomes actionable. When a district hits critical risk, our AI Supply Redistribution Engine identifies nearby surplus hubs and calculates the safest, weather-aware transport corridor to move food grain before shortages occur."
        },
        {
            "title": "Vulnerability & Affordability Index",
            "body": "• THE ALGORITHM:\n  V = 0.35(Climate) + 0.30(Production) + 0.20(Storage) + 0.15(Logistics)\n\n• MULTI-DIMENSIONAL INDEX: Combines climate stress, crop production loss, warehousing deficits, and market price sensitivity.\n\n• HUMAN-CENTRIC IMPACT METRIC: Directly calculates the number of vulnerable individuals exposed to food insecurity (e.g. 2.1M people).",
            "notes": "Our Vulnerability Index evaluates climate, crop loss, storage capacity, and market price sensitivity into a unified score. More importantly, it translates tonnes of food loss into human lives protected."
        },
        {
            "title": "Tech Stack & Cloud Architecture",
            "body": "• FRONTEND: Next.js 16, React 19, Tailwind CSS.\n\n• APIs & MAPPING: Google Maps API, OpenWeatherMap REST API.\n\n• CORE ML & DATA: Python, Pandas, NumPy, XGBoost Regressor, SHAP, PuLP Linear Programming.\n\n• DEPLOYMENT: Vercel frontend + AWS Lambda & S3 serverless infrastructure.",
            "notes": "FORESIGHT is built on Next.js 16 and React 19, integrated with Google Maps and OpenWeatherMap APIs. Our backend runs on Python ML pipelines and deploys serverlessly via AWS Lambda and Vercel."
        },
        {
            "title": "Demonstrated Risk Reduction",
            "body": "• Vulnerability Score: 74.2 (CRITICAL)  →  38.5 (STABLE)\n\n• Shortage Probability: 48%  →  9%\n\n• Price Spike Exposure: +18%  →  +4%\n\n• Vulnerable People at Risk: 1.19M  →  210K\n\n• SPOILAGE REDUCTION: 72-hour window alert system prevents spoilage of excess local harvests.",
            "notes": "Here is our single biggest takeaway: FORESIGHT doesn't just predict a crisis—it proves how much the crisis is reduced. In our simulation, executing the recommended grain redistribution reduced district vulnerability from 74.2 down to 38.5."
        },
        {
            "title": "Conclusion & Q&A",
            "body": "• SUMMARY: \"Don't just predict food-system disruption — simulate it, explain it, execute the intervention, and protect human lives.\"\n\n• GITHUB REPOSITORY: leelaprasath-cmd/FORESIGHT\n\n• LIVE COMMAND CENTER DEMO: Available on /live-map\n\nThank You & Open for Q&A!",
            "notes": "Thank you judges! FORESIGHT delivers an operational digital twin for food security under El Niño climate shocks. All code, datasets, and reports are live on GitHub. We welcome your questions!"
        }
    ]

    for idx, slide_data in enumerate(slides_data):
        # Layout 0 is Title Slide (for first slide), Layout 1 is Title and Content
        slide_layout = prs.slide_layouts[0 if idx == 0 else 1]
        slide = prs.slides.add_slide(slide_layout)
        
        # Set Dark Background
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = BG_COLOR
        
        # Title
        title = slide.shapes.title
        title.text = slide_data["title"]
        for p in title.text_frame.paragraphs:
            p.font.color.rgb = ACCENT_COLOR if idx == 0 else TITLE_COLOR
            p.font.name = "Arial"
            p.font.bold = True
            
        # Body
        body = slide.placeholders[1]
        body.text = slide_data["body"]
        for p in body.text_frame.paragraphs:
            p.font.color.rgb = TEXT_COLOR
            p.font.name = "Arial"
            if idx == 0:
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.size = Pt(20)
                
        # Speaker Notes
        notes_slide = slide.notes_slide
        text_frame = notes_slide.notes_text_frame
        text_frame.text = slide_data["notes"]

    # Save straight to Downloads
    downloads_path = os.path.join(os.environ["USERPROFILE"], "Downloads", "FORESIGHT_Premium_Deck.pptx")
    prs.save(downloads_path)
    print(f"Saved to {downloads_path}")

if __name__ == "__main__":
    create_styled_presentation()
