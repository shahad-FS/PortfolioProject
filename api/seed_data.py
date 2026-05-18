"""
أمر إدارة لتعبئة قاعدة البيانات ببيانات تجريبية.

الاستخدام:  python manage.py seed_data

يُنشئ إعدادات الموقع وأربعة أطباء معتمدين بنفس بيانات
الكروت الموجودة سابقاً في الواجهة الأمامية.
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import DoctorProfile, SiteSetting

User = get_user_model()

# سنة بداية العمل تُحسب من سنوات الخبرة القديمة المعروضة في الواجهة.
# (مثال: خبرة ١٢ سنة → بدأ العمل عام 2014 تقريباً، أي 2026 − 12)
DOCTORS = [
    {
        "email": "sara.almalki@raouf.test",
        "full_name": "د. سارة المالكي",
        "license_number": "VET-10247",
        "specialty": "أمراض القطط الداخلية",
        "work_start_year": 2014,
        "rating": "4.9",
        "reviews_count": 247,
        "consultation_price": 150,
    },
    {
        "email": "khalid.alzahrani@raouf.test",
        "full_name": "د. خالد الزهراني",
        "license_number": "VET-10185",
        "specialty": "جراحة عامة بيطرية",
        "work_start_year": 2018,
        "rating": "4.8",
        "reviews_count": 185,
        "consultation_price": 120,
    },
    {
        "email": "nouf.alotaibi@raouf.test",
        "full_name": "د. نوف العتيبي",
        "license_number": "VET-10312",
        "specialty": "أمراض الجلد والفراء",
        "work_start_year": 2016,
        "rating": "4.9",
        "reviews_count": 312,
        "consultation_price": 130,
    },
    {
        "email": "mohammed.alqahtani@raouf.test",
        "full_name": "د. محمد القحطاني",
        "license_number": "VET-10097",
        "specialty": "تغذية القطط والحميات",
        "work_start_year": 2020,
        "rating": "4.7",
        "reviews_count": 97,
        "consultation_price": 100,
    },
]


class Command(BaseCommand):
    help = "تعبئة قاعدة البيانات ببيانات تجريبية للأطباء وإعدادات الموقع."

    @transaction.atomic
    def handle(self, *args, **options):
        # ── إعدادات الموقع ───────────────────────────────────────
        settings_obj = SiteSetting.get_solo()
        settings_obj.platform_start_year = 2024
        settings_obj.doctors_count = 120
        settings_obj.consultations_count = 5000
        settings_obj.average_rating = "4.9"
        settings_obj.save()
        self.stdout.write(
            self.style.SUCCESS(
                f"✓ إعدادات الموقع — سنة بداية العمل: "
                f"{settings_obj.platform_start_year}"
            )
        )

        # ── الأطباء ──────────────────────────────────────────────
        created = 0
        for data in DOCTORS:
            if User.objects.filter(email=data["email"]).exists():
                self.stdout.write(f"  • {data['full_name']} موجود مسبقاً — تخطٍّ.")
                continue

            user = User.objects.create_user(
                email=data["email"],
                password="Raouf12345",
                user_type=User.UserType.DOCTOR,
                is_phone_verified=True,
            )
            DoctorProfile.objects.create(
                user=user,
                full_name=data["full_name"],
                license_number=data["license_number"],
                specialty=data["specialty"],
                work_start_year=data["work_start_year"],
                rating=data["rating"],
                reviews_count=data["reviews_count"],
                consultation_price=data["consultation_price"],
                is_available=True,
                status=DoctorProfile.Status.APPROVED,
            )
            created += 1
            self.stdout.write(
                self.style.SUCCESS(f"  ✓ {data['full_name']}")
            )

        self.stdout.write(
            self.style.SUCCESS(f"\nاكتمل: أُضيف {created} طبيب/أطباء.")
        )
