# Project System Design

## 1. System Architecture Diagram
هذا المخطط يوضح بنية النظام وتدفق البيانات بين الواجهة الأمامية، الخلفية (Django)، وقاعدة البيانات.

```mermaid
graph TD
    %% Define Components
    User((End User))
    
    subgraph Client_Side [Frontend]
        React[React.js / Frontend App]
    end

    subgraph Server_Side [Backend]
        Django[Django Framework / API]
        Cloud[Azure Cloud Hosting]
    end

    subgraph Storage [Data Layer]
        DB[(PostgreSQL Database)]
    end

    %% Define Connections (Data Flow)
    User -->|Interacts| React
    React -->|REST API Calls| Django
    Django -->|ORM Queries| DB
    DB -->|Data Results| Django
    Django -->|JSON Response| React
    
    %% Styling
    style User fill:#f9f,stroke:#333,stroke-width:2px
    style DB fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Django fill:#092e20,color:#fff
```

---

## 2. Sequence Diagrams (Use Cases)
هذه المخططات توضح التتابع الزمني للعمليات الأساسية في النظام.

### A. User Login (US 01)
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend (Django)
    participant Database

    User->>Frontend: Enter credentials (email/pass)
    Frontend->>Backend (Django): POST /api/login
    Backend (Django)->>Database: Check user credentials
    Database-->>Backend (Django): User valid
    Backend (Django)-->>Frontend: JWT Token (Login success)
    Frontend-->>User: Show Success Message
```

### B. Browse Doctors (US 03)
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend (Django)
    participant Database

    User->>Frontend: Click "Browse Doctors"
    Frontend->>Backend (Django): GET /api/doctors
    Backend (Django)->>Database: Fetch doctors list
    Database-->>Backend (Django): Doctors data
    Backend (Django)-->>Frontend: Display Doctors List
    Frontend-->>User: View Doctors List
```

### C. Book Appointment (US 04)
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend (Django)
    participant Database

    User->>Frontend: Select Doctor & Time
    Frontend->>Backend (Django): POST /api/book-appointment
    Backend (Django)->>Database: Create appointment record
    Database-->>Backend (Django): Appointment Saved
    Backend (Django)-->>Frontend: Show Confirmation Message
    Frontend-->>User: View Booking Details
```
