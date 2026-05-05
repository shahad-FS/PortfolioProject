from django.core.mail import EmailMultiAlternatives
from django.conf import settings

class EmailService:


    @staticmethod
    def send_verification_email(user, token):

        link = f"http://127.0.0.1:8000/api/v1/accounts/verify-email/{token}/"

        subject = "Welcome to Rauf App 🎉 - Verify your email"

        # النسخة النصية (fallback)
        text_content = f"""
        Welcome {user.email},

        Thank you for joining Rauf App 🎉

        Please verify your email by clicking this link:
        {link}
        """

        # النسخة HTML (الأساسية)
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">

            <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">

                <h2 style="color:#4CAF50;">🎉 Welcome to Rauf App</h2>

                <p>Hi <b>{user.email}</b>,</p>

                <p>Thank you for signing up 🙌</p>

                <p>Please verify your email to activate your account:</p>

                <a href="{link}" 
                   style="
                   display:inline-block;
                   padding:12px 25px;
                   background-color:#4CAF50;
                   color:white;
                   text-decoration:none;
                   border-radius:6px;
                   font-weight:bold;
                   margin-top:10px;
                   ">
                   Verify Email
                </a>

                <p style="margin-top:20px; font-size:12px; color:gray;">
                    If the button doesn't work, copy and paste this link:<br>
                    {link}
                </p>

            </div>

        </body>
        </html>
        """

        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [user.email]
        )

        email.attach_alternative(html_content, "text/html")
        email.send()