"""Backend API tests for Starz Barber & Beauty."""
import os
import uuid
import pytest
import requests
from datetime import date, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://grooming-starz.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "starz-admin-2024"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def services(session):
    r = session.get(f"{API}/services", timeout=20)
    assert r.status_code == 200
    return r.json()


@pytest.fixture(scope="module")
def barbers(session):
    r = session.get(f"{API}/barbers", timeout=20)
    assert r.status_code == 200
    return r.json()


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["token"]


# ---------- Health & catalog ----------
def test_root(session):
    r = session.get(f"{API}/", timeout=20)
    assert r.status_code == 200
    assert r.json().get("shop") == "Starz Barber & Beauty"


def test_services_seeded(services):
    assert isinstance(services, list)
    assert len(services) == 8
    for s in services:
        assert "id" in s and "_id" not in s
        assert isinstance(s["price"], (int, float))
        assert isinstance(s["duration_min"], int)


def test_barbers_seeded(barbers):
    assert isinstance(barbers, list)
    assert len(barbers) == 3
    # sort_order ascending
    orders = [b.get("sort_order", 0) for b in barbers]
    assert orders == sorted(orders)
    for b in barbers:
        assert "_id" not in b
        assert b["name"]


# ---------- Appointments ----------
def _future_monday():
    d = date.today() + timedelta(days=1)
    # skip Sunday (weekday 6)
    while d.weekday() == 6:
        d += timedelta(days=1)
    return d.isoformat()


@pytest.fixture(scope="module")
def appt_payload(services, barbers):
    # unique-ish time slot to avoid collisions
    h = 9 + (uuid.uuid4().int % 8)
    m = 0 if (uuid.uuid4().int % 2) == 0 else 30
    return {
        "customer_name": "TEST_Customer",
        "customer_phone": "555-0100",
        "customer_email": "test@example.com",
        "service_id": services[0]["id"],
        "barber_id": barbers[0]["id"],
        "date": _future_monday(),
        "time": f"{h:02d}:{m:02d}",
        "notes": "TEST appt",
        "hair_texture": "Wavy",
        "communication_pref": "Text",
    }


def test_create_appointment(session, appt_payload):
    r = session.post(f"{API}/appointments", json=appt_payload, timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["id"] and "_id" not in data
    assert data["status"] == "pending"
    assert data["service_id"] == appt_payload["service_id"]
    assert data["date"] == appt_payload["date"]
    assert data["time"] == appt_payload["time"]
    pytest.created_appt_id = data["id"]


def test_create_appointment_duplicate_returns_409(session, appt_payload):
    r = session.post(f"{API}/appointments", json=appt_payload, timeout=20)
    assert r.status_code == 409


def test_create_appointment_bad_service(session, appt_payload, barbers):
    bad = dict(appt_payload)
    bad["service_id"] = "nonexistent-service-id"
    bad["time"] = "10:30"
    r = session.post(f"{API}/appointments", json=bad, timeout=20)
    assert r.status_code == 404


def test_create_appointment_bad_barber(session, appt_payload):
    bad = dict(appt_payload)
    bad["barber_id"] = "nonexistent-barber-id"
    bad["time"] = "10:30"
    r = session.post(f"{API}/appointments", json=bad, timeout=20)
    assert r.status_code == 404


def test_availability_includes_booked_slot(session, appt_payload):
    r = session.get(
        f"{API}/appointments/availability",
        params={"barber_id": appt_payload["barber_id"], "date": appt_payload["date"]},
        timeout=20,
    )
    assert r.status_code == 200
    booked = r.json().get("booked", [])
    assert appt_payload["time"] in booked


# ---------- Admin ----------
def test_admin_login_wrong_password(session):
    r = session.post(f"{API}/admin/login", json={"password": "wrong"}, timeout=20)
    assert r.status_code == 401


def test_admin_login_correct(admin_token):
    assert admin_token == ADMIN_PASSWORD


def test_admin_endpoints_require_token(session):
    r = session.get(f"{API}/admin/appointments", timeout=20)
    assert r.status_code == 401


def test_admin_list_appointments(session, admin_token):
    r = session.get(f"{API}/admin/appointments", headers={"x-admin-token": admin_token}, timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(a["id"] == pytest.created_appt_id for a in data)


def test_admin_update_appointment_status(session, admin_token):
    appt_id = pytest.created_appt_id
    r = session.patch(
        f"{API}/admin/appointments/{appt_id}",
        json={"status": "confirmed"},
        headers={"x-admin-token": admin_token},
        timeout=20,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "confirmed"

    # GET to verify persistence
    r2 = session.get(f"{API}/admin/appointments", headers={"x-admin-token": admin_token}, timeout=20)
    assert any(a["id"] == appt_id and a["status"] == "confirmed" for a in r2.json())


def test_admin_update_appointment_not_found(session, admin_token):
    r = session.patch(
        f"{API}/admin/appointments/does-not-exist",
        json={"status": "confirmed"},
        headers={"x-admin-token": admin_token},
        timeout=20,
    )
    assert r.status_code == 404


def test_admin_delete_appointment(session, admin_token):
    appt_id = pytest.created_appt_id
    r = session.delete(
        f"{API}/admin/appointments/{appt_id}",
        headers={"x-admin-token": admin_token},
        timeout=20,
    )
    assert r.status_code == 200
    # confirm gone
    r2 = session.delete(
        f"{API}/admin/appointments/{appt_id}",
        headers={"x-admin-token": admin_token},
        timeout=20,
    )
    assert r2.status_code == 404
