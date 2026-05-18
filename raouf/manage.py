#!/usr/bin/env python
import os
import sys

def main():
    # هنا قمنا بتوجيهه ليقرأ ملف settings المباشر بدون وجود مجلد فرعي
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "تعذّر استيراد Django."
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
