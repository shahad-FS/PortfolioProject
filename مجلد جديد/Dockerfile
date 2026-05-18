# ─── صورة الباك اند (Django) ─────────────────────────────────────
FROM python:3.12-slim

# منع بايثون من كتابة ملفات pyc وتفعيل إخراج فوري للسجلات
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# تثبيت اعتمادات النظام اللازمة لـ psycopg2 و Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# تثبيت اعتمادات بايثون أولاً للاستفادة من التخزين المؤقت
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ كود المشروع
COPY backend/ .

# تجميع الملفات الثابتة
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# تطبيق الهجرات وتعبئة البيانات ثم تشغيل الخادم عبر daphne (ASGI)
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py seed_data && daphne -b 0.0.0.0 -p 8000 raouf.asgi:application"]
