# Starz Barber & Beauty — PRD

## Original Problem
Build a high-quality website for **Starz Barber & Beauty**, Horn Lake, MS.
- Address: 1731 Dancy Blvd, Horn Lake, MS 38637
- Phone: (662) 393-8902
- 4.9★ · 45 Google reviews · Open · Closes 6 PM
- Tagline themes: "Quality precision cuts, family atmosphere"

## Architecture
- **Backend**: FastAPI + Motor (MongoDB). All routes under `/api`. Auto-seeds 8 services + 3 barbers on startup. Admin auth via static password (env `ADMIN_PASSWORD`) sent in `x-admin-token` header.
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn UI. Sonner toasts. Three routes: `/` (marketing), `/book` (5-step booking), `/admin` (login + dashboard).
- **Design**: Organic & Earthy — warm sand bg, terracotta primary, espresso dark. Outfit (headings) + Work Sans (body). Sharp corners (rounded-none), generous spacing, asymmetric layouts.

## User Personas
- **Customers** — book a chair from any device without creating an account
- **Owner / Staff** — manage incoming appointments via admin dashboard

## Core Requirements (Static)
1. Marketing site with: Hero, About, Services menu, Team, Gallery, Reviews, Contact + Map
2. Online booking flow: Service → Specialist → Date/Time → Details → Review → Confirm
3. Admin dashboard: stats, filter by status, status update, delete

## Implemented (2025-12-XX — Initial Build)
- Backend: services, barbers, appointments (create / availability), admin login + list / patch / delete
- Slot collision detection (409 on duplicate barber+date+time)
- Sundays disabled + business hours 09:00–17:30 (30-min slots)
- Auto-seed of 8 services and 3 barbers on startup
- Marketing single-page with all sections + Google Maps embed + tel: links
- 5-step booking flow with stepper, calendar (shadcn), per-slot disabled state on conflict
- Admin: login persistence in localStorage, stats cards, status select per row, delete with confirm
- 100% backend test pass (15/15 pytest) — Frontend Home/Admin flows verified

## Backlog
- **P1**: Email/SMS confirmation on booking (Resend/Twilio) · Photo upload to gallery from admin
- **P2**: Block-out hours / day-off in admin · Per-barber working hours · Customer login + appointment history · Stripe deposit at booking
- **P3**: Reviews widget pulling live Google reviews · Loyalty / referral codes · Walk-in queue display

## Credentials
- Admin password: `starz-admin-2024` (in `/app/backend/.env` and `/app/memory/test_credentials.md`)

## Next Tasks
- Add email/SMS confirmation (most impactful for conversion)
- Photo gallery upload from admin
