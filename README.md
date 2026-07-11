# spatial-api

ส่วนหลังบ้าน (Backend API) ของ Mini Spatial Data Platform
ใช้ NestJS + TypeORM + PostgreSQL/PostGIS
เก็บข้อมูลสถานที่เป็นพิกัดใน PostGIS แล้วส่งออกมาเป็น GeoJSON (`Feature` / `FeatureCollection`)

เว็บจริง: https://spatial-api.project-hub.it.com · Swagger `/docs` · Scalar `/api-doc`

> **ระบบนี้มี 2 repo** คู่กับหน้าบ้าน:
> [`spatial-web`](https://github.com/blackenemy/spatial-web)
> ให้รัน API ตัวนี้ก่อน แล้วค่อยเปิดหน้าบ้าน (หน้าบ้านจะดึงข้อมูลจาก API นี้)
> รันครบทั้งระบบในเครื่อง = **`docker compose up`** ที่ repo นี้ (หลังบ้าน `:3000`)
> **+** `docker compose up` ที่ `spatial-web` (หน้าบ้าน `:5173`)

## วิธีที่ 1 — รันด้วย Docker (แนะนำ)

สั่งครั้งเดียวได้ทั้ง PostGIS + API ไม่ต้องลง Postgres เองในเครื่อง:

```bash
docker compose up --build          # API เปิดที่ http://localhost:3000
docker compose exec api node dist/seed.js   # (ถ้าอยากได้ข้อมูลตัวอย่าง 17 จุด)
```

ตอนเปิดขึ้นมา ระบบจะสร้างตาราง + index ให้อัตโนมัติ (migration)

## วิธีที่ 2 — รันเองไม่ใช้ Docker

**ต้องมีก่อน:**

- Node 20 ขึ้นไป
- PostgreSQL 16 ที่เปิดส่วนเสริม **PostGIS** และมีฐานข้อมูลชื่อ `spatial`

**ขั้นตอน:**

```bash
npm install
export DATABASE_URL=postgres://spatial:spatial@localhost:5432/spatial
export PORT=3000
npm run migration:run   # สร้างตาราง places + index (เปิด PostGIS)
npm run seed            # (ไม่บังคับ) ใส่ข้อมูลตัวอย่าง
```

**รัน:**

```bash
npm run dev              # โหมด dev แก้โค้ดแล้วรีโหลดเอง
# หรือ
npm run build && npm start
```

## ตัวแปรสภาพแวดล้อม (Environment variables)

| ตัวแปร | ตัวอย่าง | คำอธิบาย |
|--------|----------|----------|
| `DATABASE_URL` | `postgres://spatial:spatial@localhost:5432/spatial` | สายเชื่อมต่อฐานข้อมูล PostGIS (จำเป็น) |
| `PORT` | `3000` | พอร์ตของ API (ค่าเริ่มต้น `3000`) |

## รายการ API (Endpoints)

หลัก (REST): `GET/POST /places`, `GET/PATCH/DELETE /places/:id`,
`GET /places/nearby?lng=&lat=&radius=` — กรองรายการได้ด้วย `?bbox=`, `?type=`, `?q=`

Spatial query: `POST /places/within` — ส่ง GeoJSON Polygon → คืนสถานที่ที่อยู่ข้างใน (PostGIS `ST_Within`)

มาตรฐาน OGC API - Features: `/conformance`, `/collections`, `/collections/places/items[/:id]`

ดูรายละเอียดเต็ม: Swagger ที่ `/docs`, Scalar ที่ `/api-doc`, หรือไฟล์ `openapi.json`
(สร้างตอนเปิดเซิร์ฟเวอร์) · มีชุดทดสอบ Postman ที่ [`postman/collection.json`](./postman/collection.json)
— ตั้งค่าตัวแปร `baseUrl` เป็น `http://localhost:3000` สำหรับในเครื่อง หรือใช้ URL เว็บจริง

## ทดสอบ

```bash
npm run build            # ตรวจชนิดข้อมูล (type-check) ด้วย tsc
```

ชุดทดสอบ End-to-end (Playwright) อยู่ที่ฝั่งหน้าบ้าน `../spatial-web/e2e/api.spec.ts`
