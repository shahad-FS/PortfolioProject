import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

logger = logging.getLogger(__name__)

class EmailService:

    @staticmethod
    def send_html_email(subject, to_email, text_content, html_content):
        """
        دالة عامة لإرسال ايميل HTML + Text 
        """
        try:
            email = EmailMultiAlternatives(
                subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [to_email]
            )

            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")

    # Verification Email
    @staticmethod
    def send_verification_email(user, token):

        print(f"DEBUG: FRONTEND_URL is {settings.FRONTEND_URL}")
        frontend_url = settings.FRONTEND_URL.rstrip('/')

        base = "https://rauf.live"
        link = f"{base}/verify-email/{token}"

        subject = "Welcome to Rauf App 🎉 - Verify your email"

        text_content = f"""
        Hi {user.email},

        Please verify your email:
        {link}
        """

        html_content = f"""
        <html>
        <body style="font-family: Arial; background:#f4f4f4; padding:20px;">
            <div style="background:white; padding:20px; border-radius:10px;">
                <h2>🎉 Welcome to Rauf App</h2>
                <p>Hi <b>{user.email}</b></p>
                <p>Please verify your email:</p>

                <a href="{link}"
                   style="padding:10px 20px;
                   background:#4CAF50;
                   color:white;
                   text-decoration:none;
                   border-radius:5px;">
                   Verify Email
                </a>
            </div>
        </body>
        </html>
        """

        EmailService.send_html_email(
            subject, user.email, text_content, html_content)


    # Consultation Booking Email (Pet Owner)
    @staticmethod
    def send_consultation_confirmation(user, consultation):

        subject = "Consultation Confirmed Successfully"

        vet_name = consultation.vet.profile.full_name if hasattr(
            consultation.vet, "profile") else consultation.vet.email

        pet_name = consultation.pet.name

        date = consultation.scheduled_at

        text_content = f"""
        Hi {user.email},

        Your consultation is confirmed.

        Vet: {vet_name}
        Pet: {pet_name}
        Date: {date}
        """

        html_content = f"""
        <html>
        <body style="font-family:Arial; background:#f9f9f9; padding:20px;">
            <div style="background:white; padding:20px; border-radius:10px;">

                <h2>Consultation Confirmed</h2>

                <p>Hi <b>{user.profile.full_name if hasattr(user, "profile") else user.email}</b>,</p>

                <p>Your appointment has been successfully booked 🎉</p>

                <p><b>Vet:</b> {vet_name}</p>
                <p><b>Pet:</b> {pet_name}</p>
                <p><b>Date:</b> {date}</p>

            </div>
        </body>
        </html>
        """

        EmailService.send_html_email(
            subject, user.email, text_content, html_content)


    # Consultation Notification Email (Vet)
    # @staticmethod
    # def send_vet_notification(vet, consultation):

    #     subject = "New Consultation Request"
        

    #     text_content = f"""
    #     Hi Doctor,

    #     You have a new consultation request.

    #     Pet Owner: {consultation.pet_owner.email}
    #     Pet ID: {consultation.pet.id}
    #     """

    #     html_content = f"""
    #     <html>
    #     <body style="font-family: Arial; background:#eef2f3; padding:20px;">
    #         <div style="background:white; padding:20px; border-radius:10px;">

    #             <h2>New Consultation Request</h2>

    #             <p>Hello Dr. <b>{vet.email}</b></p>

    #             <p>You have a new consultation request</p>

    #             <p><b>Pet Owner:</b> {consultation.pet_owner.email}</p>
    #             <p><b>Pet ID:</b> {consultation.pet.id}</p>

    #         </div>
    #     </body>
    #     </html>
    #     """

    #     EmailService.send_html_email(
    #         subject,
    #         vet.email,
    #         text_content,
    #         html_content
    #     )

    @staticmethod
    def send_vet_notification(vet, consultation):

        subject = "New Consultation Request"

        owner_name = consultation.pet.owner.profile.full_name if hasattr(
            consultation.pet.owner, "profile") else consultation.pet.owner.email

        pet_name = consultation.pet.name


        date = consultation.scheduled_at

        html_content = f"""
        <html>
        <body style="font-family:Arial; background:#eef2f3; padding:20px;">
            <div style="background:white; padding:20px; border-radius:10px;">

                <h2>New Consultation Request</h2>

                <p>Hello Dr. <b>{vet.profile.full_name if hasattr(vet, "profile") else vet.email}</b>,</p>

                <p>You have a new booking</p>

                <p><b>Owner:</b> {owner_name}</p>
                <p><b>Pet:</b> {pet_name}</p>
                <p><b>Date:</b> {date}</p>


            </div>
        </body>
        </html>
        """

        EmailService.send_html_email(
            subject, vet.email, html_content, html_content)
