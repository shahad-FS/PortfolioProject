#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import platform

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
# ========================================================
# 🎨 كود تحويل مخرجات الفحص إلى إيموجيز وحركات (Global)
# ========================================================
if 'test' in sys.argv:
    if platform.system() == 'Windows':
    # تفعيل ميزة الألوان والأكواد الخاصة بالتيرمنال في ويندوز
        os.system('color')
    
    if '--force-color' not in sys.argv:
        sys.argv.append('--force-color')

    try:
        from unittest.runner import TextTestResult
        
        # 1. عند نجاح التست: طباعة علامة الصح الخضراء
        def amped_addSuccess(self, test):
            self.stream.write(" ✅ ")
            self.stream.flush()

        # 2. عند فشل التست (Failure): طباعة علامة الخطأ الحمراء
        def amped_addFailure(self, test, err):
            self.stream.write(" ❌ ")
            self.stream.flush()
            self.failures.append((test, self._exc_info_to_string(err, test)))

        # 3. عند حدوث خطأ برمي (Error): طباعة علامة التحذير الصفراء
        def amped_addError(self, test, err):
            self.stream.write(" ⚠️ ")
            self.stream.flush()
            self.errors.append((test, self._exc_info_to_string(err, test)))

        # تطبيق التعديل السحري عالمياً
        TextTestResult.addSuccess = amped_addSuccess
        TextTestResult.addFailure = amped_addFailure
        TextTestResult.addError = amped_addError
        
    except Exception:
        pass

    # طباعة بانر البداية المطور لمشروع Rauf
    print("\033[94m" + "==================================================" + "\033[0m")
    print("\033[92m" + "🚀 Rauf Virtual Clinic😺: Running Automated Tests... 🚀" + "\033[0m")
    print("\033[94m" + "==================================================" + "\033[0m")
# ========================================================

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
