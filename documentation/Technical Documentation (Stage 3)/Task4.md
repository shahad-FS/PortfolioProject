## External and Internal APIs Reference document

```yml
openapi: 3.0.3
info:
  title: Rauf API
  version: 1.0.0

servers:
  - url: http://localhost:8000/api/v1
  - url: "https://api.moyasar.com/v1"
    description: moyasar external payment API

components:
  schemas:
    Error:
      type: object
      properties:
        message:
          type: string
        errors:
          type: object

    AuthTokens:
      type: object
      properties:
        access_token:
          type: string
          minLength: 10
        refresh_token:
          type: string
          minLength: 10

    RegisterRequest:
      type: object
      required: [name, email, password, role]
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 50
          example: "Shahad"

        email:
          type: string
          format: email
          example: "shahad@email.com"

        password:
          type: string
          minLength: 8
          maxLength: 100
          pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]+$"
          example: "StrongPass123"

        role:
          type: string
          enum: [pet_owner, vet]

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8

    PetRequest:
      type: object
      required: [name, type, age]
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 50

        type:
          type: string
          enum: [cat]
        age:
          type: integer
          minimum: 0
          maximum: 30

    ConsultationRequest:
      type: object
      required: [pet_id, vet_id]
      properties:
        pet_id:
          type: integer
          minimum: 1

        vet_id:
          type: integer
          minimum: 1

    StatusUpdateRequest:
      type: object
      required: [status]
      properties:
        status:
          type: string
          enum: [accepted, rejected, active, completed]

    PaymentRequest:
      type: object
      required: [consultation_id, amount]
      properties:
        consultation_id:
          type: integer
          minimum: 1

        amount:
          type: number
          minimum: 0

    DiagnosisRequest:
      type: object
      required: [record_id, description]
      properties:
        record_id:
          type: integer
          minimum: 1

        description:
          type: string
          minLength: 5
          maxLength: 500

    PrescriptionRequest:
      type: object
      required: [record_id, medications]
      properties:
        record_id:
          type: integer
          minimum: 1

        medications:
          type: string
          minLength: 3
          maxLength: 500

paths:
  /:
    get:
      summary: Home page (Landing)
      description: Returns basic information about the platform
      responses:
        "200":
          description: Success
          content:
            application/json:
              example:
                message: "Welcome to Rauf Platform"
                description: "Connect pet owners with veterinarians"
                services:
                  - "Book consultation"
                  - "Get diagnosis"
                  - "Receive prescriptions"
                version: "1.0.0"

  /auth/register:
    post:
      summary: Register user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RegisterRequest"
      responses:
        "201":
          description: User created
          content:
            application/json:
              example:
                message: "User created successfully"
        "400":
          description: Validation error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "409":
          description: Email already exists
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

  /auth/login:
    post:
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/LoginRequest"
      responses:
        "200":
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthTokens"
        "401":
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

  /pets:
    post:
      summary: Create pet
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PetRequest"
      responses:
        "201":
          description: Created
          content:
            application/json:
              example:
                id: 1
                name: "Kitty"
        "400":
          description: Validation error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

    get:
      summary: Get pets
      parameters:
        - name: owner_id
          in: query
          schema:
            type: integer
          description: Filter pets by owner
      responses:
        "200":
          description: Success
          content:
            application/json:
              example:
                - id: 1
                  name: "Kitty"
                  type: "cat"
                  age: 2

  /consultations:
    post:
      summary: Book consultation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ConsultationRequest"
      responses:
        "201":
          description: Created
          content:
            application/json:
              example:
                id: 10
                status: "pending"
        "404":
          description: Pet or vet not found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

  /consultations/{id}/status:
    patch:
      summary: Update consultation status
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/StatusUpdateRequest"
      responses:
        "200":
          description: Updated
          content:
            application/json:
              example:
                message: "Status updated"

  /payments:
    post:
      summary: Create payment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PaymentRequest"
      responses:
        "201":
          description: Created
          content:
            application/json:
              example:
                id: 5
                status: "pending"

  /payments/webhook:
    post:
      summary: Payment webhook
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [status]
              properties:
                status:
                  type: string
                  example: "paid"
      responses:
        "200":
          description: Payment updated
          content:
            application/json:
              example:
                message: "Payment updated"

  /medical/diagnosis:
    post:
      summary: Add diagnosis
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/DiagnosisRequest"
      responses:
        "201":
          description: Created
          content:
            application/json:
              example:
                id: 3
                description: "Infection"

  /medical/prescription:
    post:
      summary: Add prescription
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PrescriptionRequest"
      responses:
        "201":
          description: Created
          content:
            application/json:
              example:
                id: 4
                medications: "Antibiotics"

  /pets/{id}/medical-history:
    get:
      summary: Get medical history
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        "200":
          description: Success
          content:
            application/json:
              example:
                - diagnosis: "Infection"
                  prescription: "Antibiotics"
```
