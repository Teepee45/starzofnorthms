from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'starz-admin-2024')

app = FastAPI(title="Starz Barber & Beauty API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    duration_min: int
    price: float
    price_from: bool = False  # show "$X+" when True
    category: str = "Cuts"
    sort_order: int = 0


class Barber(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    bio: str
    specialties: List[str] = []
    image_url: str = ""
    sort_order: int = 0


class AppointmentCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    service_id: str
    barber_id: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM (24h)
    notes: Optional[str] = None
    hair_texture: Optional[str] = None
    communication_pref: Optional[str] = "Text"


class Appointment(AppointmentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"  # pending | confirmed | completed | cancelled
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AppointmentUpdate(BaseModel):
    status: str


class AdminLogin(BaseModel):
    password: str


# ---------- Seed Data ----------
SEED_SERVICES = [
    # Cuts
    {"name": "Adult Haircut with Shave", "description": "Full cut and finishing straight-razor shave.", "duration_min": 55, "price": 50.0, "category": "Cuts", "sort_order": 10},
    {"name": "Adult Haircut (no shave)", "description": "Consultation, precision cut, hot-towel finish.", "duration_min": 40, "price": 40.0, "category": "Cuts", "sort_order": 11},
    {"name": "Youth Haircut", "description": "Patient, friendly cut for the younger crowd.", "duration_min": 35, "price": 30.0, "category": "Cuts", "sort_order": 12},
    {"name": "Youth Haircut with Shave", "description": "Youth cut with light shave/edge-up.", "duration_min": 45, "price": 35.0, "category": "Cuts", "sort_order": 13},
    {"name": "Shaved Head", "description": "Bald with steam-towel finish.", "duration_min": 40, "price": 40.0, "category": "Cuts", "sort_order": 14},
    {"name": "Adult Line & Tape (no shave)", "description": "Not a full haircut — touch-up on sides and a detailed line-up.", "duration_min": 30, "price": 30.0, "category": "Cuts", "sort_order": 15},
    {"name": "Adult Line & Tape with Shave", "description": "Side touch-up, detailed line-up, razor shave.", "duration_min": 40, "price": 40.0, "category": "Cuts", "sort_order": 16},
    {"name": "Youth Line & Tape", "description": "Touch-up and lineup for youth.", "duration_min": 30, "price": 25.0, "price_from": True, "category": "Cuts", "sort_order": 17},

    # Beard & Shave
    {"name": "Beard Trim", "description": "Shape-up and line work.", "duration_min": 30, "price": 25.0, "category": "Beard & Shave", "sort_order": 20},
    {"name": "Razor Shave", "description": "Straight-razor shave with hot-towel finish.", "duration_min": 30, "price": 25.0, "category": "Beard & Shave", "sort_order": 21},
    {"name": "Beard Dye", "description": "Custom beard color.", "duration_min": 20, "price": 15.0, "category": "Beard & Shave", "sort_order": 22},
    {"name": "Beard Maintenance Shampoo", "description": "Deep shampoo and condition.", "duration_min": 20, "price": 15.0, "category": "Beard & Shave", "sort_order": 23},
    {"name": "Beard Trim with Color", "description": "Trim plus full color.", "duration_min": 45, "price": 35.0, "category": "Beard & Shave", "sort_order": 24},

    # Brow
    {"name": "Eyebrow Arch", "description": "Clean arch and shape.", "duration_min": 20, "price": 20.0, "category": "Brow", "sort_order": 30},
    {"name": "Eyebrow Tint", "description": "Custom tint and shape.", "duration_min": 20, "price": 15.0, "category": "Brow", "sort_order": 31},

    # Color
    {"name": "Hair Color", "description": "Hair color with conditioning.", "duration_min": 60, "price": 30.0, "price_from": True, "category": "Color", "sort_order": 40},

    # Locs
    {"name": "Loc Retwist · Shoulder & Above", "description": "Retwist, shampoo, and light condition included.", "duration_min": 150, "price": 80.0, "price_from": True, "category": "Locs", "sort_order": 50},
    {"name": "Loc Retwist · Shoulder to Mid-Back", "description": "Retwist, shampoo, and light condition included.", "duration_min": 180, "price": 100.0, "category": "Locs", "sort_order": 51},
    {"name": "Loc Retwist · Mid-Back & Longer", "description": "Retwist, shampoo, and light condition included.", "duration_min": 210, "price": 120.0, "category": "Locs", "sort_order": 52},
    {"name": "Loc Style Only", "description": "Includes shampoo and style of your choice.", "duration_min": 60, "price": 40.0, "price_from": True, "category": "Locs", "sort_order": 53},
    {"name": "Starter Locs · Medium / Large Parts (60–80 locs)", "description": "Consultation required before booking.", "duration_min": 210, "price": 130.0, "price_from": True, "category": "Locs", "sort_order": 54},
    {"name": "Starter Locs · Small Parts (100+ locs)", "description": "Consultation required before booking.", "duration_min": 240, "price": 165.0, "price_from": True, "category": "Locs", "sort_order": 55},

    # Braids & Twists
    {"name": "All Straight-Line Braid Styles", "description": "Must come shampooed and blow-dried, hair free of oils.", "duration_min": 180, "price": 80.0, "price_from": True, "category": "Braids & Twists", "sort_order": 60},
    {"name": "Braids with Designs", "description": "Must come shampooed and blow-dried, hair free of oils.", "duration_min": 270, "price": 100.0, "price_from": True, "category": "Braids & Twists", "sort_order": 61},
    {"name": "Two-Strand Twist", "description": "Must come shampooed and blow-dried, hair free of oils.", "duration_min": 150, "price": 80.0, "price_from": True, "category": "Braids & Twists", "sort_order": 62},
    {"name": "Feed-In / Stitch · 2 Braids", "description": "Feed-in stitch braid style.", "duration_min": 120, "price": 80.0, "price_from": True, "category": "Braids & Twists", "sort_order": 63},
    {"name": "Feed-In / Stitch · 4–6 Braids", "description": "Feed-in stitch braid style.", "duration_min": 180, "price": 100.0, "category": "Braids & Twists", "sort_order": 64},
    {"name": "Feed-In / Stitch · 8–10 Braids", "description": "Feed-in stitch braid style.", "duration_min": 270, "price": 125.0, "category": "Braids & Twists", "sort_order": 65},
    {"name": "Feed-In / Stitch · 12–16 Braids", "description": "Feed-in stitch braid style.", "duration_min": 330, "price": 150.0, "category": "Braids & Twists", "sort_order": 66},
    {"name": "Feed-In / Stitch · 18–20 Braids", "description": "Feed-in stitch braid style.", "duration_min": 390, "price": 180.0, "category": "Braids & Twists", "sort_order": 67},
]

SEED_BARBERS = [
    {
        "name": "Marcus 'Starz' Johnson",
        "role": "Owner · Master Barber",
        "bio": "20+ years shaping confidence. Marcus founded Starz on the belief that everyone deserves to leave looking — and feeling — their best.",
        "specialties": ["Skin Fades", "Beard Sculpts", "Classic Cuts"],
        "image_url": "https://images.unsplash.com/photo-1625241152315-4a698f74ceb7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwd2VsY29taW5nJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDB8fHx8MTc4MDA3Mzk0Nnww&ixlib=rb-4.1.0&q=85",
        "sort_order": 1,
    },
    {
        "name": "Jasmine Reed",
        "role": "Senior Stylist",
        "bio": "Specialist in textured cuts, color, and styling for every hair type. Jasmine brings warmth and editorial precision to every chair.",
        "specialties": ["Color & Style", "Texture", "Wash & Cut"],
        "image_url": "https://images.unsplash.com/photo-1484863137850-59afcfe05386?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwd2VsY29taW5nJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDB8fHx8MTc4MDA3Mzk0Nnww&ixlib=rb-4.1.0&q=85",
        "sort_order": 2,
    },
    {
        "name": "Devon Carter",
        "role": "Barber · Hot Shave Specialist",
        "bio": "Steady hands, sharp lines, and a great conversation. Devon's hot-towel shaves are a Horn Lake ritual.",
        "specialties": ["Royal Shaves", "Lineups", "Kids Cuts"],
        "image_url": "https://images.unsplash.com/photo-1662850886700-4ec19bd30d11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwzfHxkaXZlcnNlJTIwd2VsY29taW5nJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDB8fHx8MTc4MDA3Mzk0Nnww&ixlib=rb-4.1.0&q=85",
        "sort_order": 3,
    },
]


async def seed_db():
    # Re-sync services on every startup so menu changes in code apply immediately.
    await db.services.delete_many({})
    for s in SEED_SERVICES:
        await db.services.insert_one(Service(**s).model_dump())
    if await db.barbers.count_documents({}) == 0:
        for b in SEED_BARBERS:
            await db.barbers.insert_one(Barber(**b).model_dump())


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"shop": "Starz Barber & Beauty", "status": "open"}


@api_router.get("/services", response_model=List[Service])
async def list_services():
    docs = await db.services.find({}, {"_id": 0}).sort("sort_order", 1).to_list(200)
    return docs


@api_router.get("/barbers", response_model=List[Barber])
async def list_barbers():
    docs = await db.barbers.find({}, {"_id": 0}).sort("sort_order", 1).to_list(50)
    return docs


@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(payload: AppointmentCreate):
    # Verify service & barber exist
    svc = await db.services.find_one({"id": payload.service_id}, {"_id": 0})
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    brb = await db.barbers.find_one({"id": payload.barber_id}, {"_id": 0})
    if not brb:
        raise HTTPException(status_code=404, detail="Barber not found")

    # Check slot availability
    existing = await db.appointments.find_one({
        "barber_id": payload.barber_id,
        "date": payload.date,
        "time": payload.time,
        "status": {"$ne": "cancelled"},
    }, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="Slot already booked")

    appt = Appointment(**payload.model_dump())
    await db.appointments.insert_one(appt.model_dump())
    return appt


@api_router.get("/appointments/availability")
async def availability(barber_id: str, date: str):
    # Return list of booked times for a barber on a date
    cursor = db.appointments.find({
        "barber_id": barber_id,
        "date": date,
        "status": {"$ne": "cancelled"},
    }, {"_id": 0, "time": 1})
    booked = [d["time"] async for d in cursor]
    return {"booked": booked}


# ---------- Admin ----------
def check_admin(token: Optional[str]):
    if not token or token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")


@api_router.post("/admin/login")
async def admin_login(body: AdminLogin):
    if body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": ADMIN_PASSWORD}


@api_router.get("/admin/appointments", response_model=List[Appointment])
async def admin_list_appointments(x_admin_token: Optional[str] = Header(default=None)):
    check_admin(x_admin_token)
    docs = await db.appointments.find({}, {"_id": 0}).sort([("date", -1), ("time", -1)]).to_list(1000)
    return docs


@api_router.patch("/admin/appointments/{appt_id}", response_model=Appointment)
async def admin_update_appointment(appt_id: str, update: AppointmentUpdate, x_admin_token: Optional[str] = Header(default=None)):
    check_admin(x_admin_token)
    res = await db.appointments.find_one_and_update(
        {"id": appt_id},
        {"$set": {"status": update.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not res:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return res


@api_router.delete("/admin/appointments/{appt_id}")
async def admin_delete_appointment(appt_id: str, x_admin_token: Optional[str] = Header(default=None)):
    check_admin(x_admin_token)
    res = await db.appointments.delete_one({"id": appt_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"deleted": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    await seed_db()
    logger.info("Starz DB seeded.")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
