🐾 رؤوف  
**Your All-in-One Veterinary**  
**Project Charter · MVP Phase 1 · 2026**

---

## Section 0 — Define Project Objectives

### Project Purpose
connect cat owners with licensed veterinarians through a fully virtual consultation platform. Today, pet owners struggle to access timely and trusted veterinary advice without visiting a physical clinic. We solves this by providing an online first experience where cat owners can book and attend video consultations with qualified vets.

MVP Objectives
Enable user registration and login for two roles: Pet Owner and Veterinarian.
Allow pet owners to manage their profile and cat information.
Provide a video consultation feature connecting cat owners directly with veterinarians.
Support online payment for consultation sessions within the platform.
Deliver a simple, intuitive interface accessible to non-technical users.

Accessibility: Removes the need for in person clinic visits for routine consultations, saving time and reducing stress for both owners and animals.
Market gap: No dedicated Arabic first virtual vet consultation platform currently exists for cat owners in the region.
Veterinarian empowerment: Enables independent vets to offer remote services without the overhead of a physical clinic.
Scalability: The MVP foundation can expand in future phases to include additional features and species.
---

## Section 1 — Stakeholders & Team Roles

### 1.1 Stakeholder Registry

| Type     | Stakeholder                         | Role / Category               | Interest / Impact |
|----------|------------------------------------|-------------------------------|-------------------|
| Internal | Frontend Developer                | UI/UX Implementation          | Builds client-facing interfaces & user experience |
| Internal | Backend Developer                 | Server & API Engineering      | Develops APIs, database, business logic |
| Internal | Project Manager                   | Planning & Delivery           | Tracks milestones, manages scope & risks |
| Internal | QA / Tester                       | Quality Assurance             | Validates functionality, UX, & edge cases |
| Internal | UX/UI Designer                    | Design & Prototyping          | Creates wireframes, design system & brand identity |
| External |  Vets                             | Service Provider              | remote consultation services |
| External | General Pet Owners                | Primary End User              | Book vets, buy products |

---

### 1.2 Team Roles & Responsibilities

| Role                     | Assigned To                          | Responsibilities |
|--------------------------|--------------------------------------|------------------|
| Project Manager          | Shahad Alsaneea                      | Sprint planning, timeline tracking, risk management, stakeholder communication |
| Tech Lead / Architect    | Shadan Alkharji                      | Technical decision-making, system architecture, code review, integration oversight |
| Frontend Developer       | Shadan Alkharji                      | React/Next.js UI, responsive design, API integration, accessibility compliance |
| Backend Developer        | Shahad Alsaneea                      | REST API design, database modeling, auth system, payment & notifications |
| UX/UI Designer           | Shadan Alkharji                      | User research, wireframes, prototype, brand identity & design system |
| QA Engineer              | Lina Alduaylij, Alanoud Alharthi     | Test planning, bug reporting, regression testing, UAT coordination |
| Content / Community Lead | All Team Members                     | Adoption listing quality, partner onboarding support, awareness campaigns |

---

### 1.3 RACI Notes
The following principles govern accountability across all deliverables:

- **Responsible (R):** The team member who executes the task.  
- **Accountable (A):** The Project Manager or Tech Lead who signs off on completion.  
- **Consulted (C):** Subject-matter experts (e.g., veterinary advisor, UX researcher) whose input is required.  
- **Informed (I):** Instructors and external stakeholders kept updated on outcomes.  

---

## Section 2 — Project Scope

### Project Scope Overview
The purpose of this project is to develop a web-based platform that connects pet owners with veterinarians for online consultation.  
The scope focuses on delivering a functional MVP within the given timeframe, while identifying future enhancements for later development phases.

### In-Scope (MVP Features)
The following features are included in the MVP:

- User registration and login (Pet Owner / Veterinarian roles)  
- User profile management  
- Basic video consultation feature  
- Simple and user-friendly interface  
- Online payment system for consultations  

### Out-of-Scope (Post-MVP / Future Enhancements)
The following features are planned for future development but are excluded from the MVP to maintain focus and feasibility:

- Veterinarian search functionality (by specialization, location, etc.)  
- Real-time messaging (chat between users and veterinarians)  
- Pet adoption listings (view and post animals for adoption)  
- Appointment scheduling and calendar integration  
- Integration with veterinary clinics or external healthcare systems  
- Advanced medical records and pet health tracking  
- Mobile application (native iOS/Android)  
- E-commerce features (e.g., pet products marketplace)  

---

## Section 3 — Risks

### Purpose
This section identifies potential risks across technical, organizational, and external factors, along with mitigation strategies to ensure the successful delivery of the project.

| Risk Category     | Risk                               | Description                                           | Mitigation Strategy |
|------------------|------------------------------------|-------------------------------------------------------|---------------------|
| Technical        | Real-time communication complexity | Chat and video features may be difficult to implement | Use existing libraries/services and simplify features in MVP |
| Technical        | Bugs and system errors             | Unexpected technical issues may delay progress        | Perform regular testing, debugging, and code reviews |
| Project Management | Time constraints                 | Limited timeframe may prevent completing all features | Focus on MVP, prioritize core features, and manage time strictly |
| Project Management | Scope creep                     | Adding extra features beyond the plan                 | Clearly define scope and move extra features to post-MVP |
| User/Business    | Low user adoption                  | Users may not find the platform useful or engaging    | Focus on user-friendly design and core value features |
| User/Business    | Trust issues                       | Users may not trust online veterinary consultations   | Add clear profiles, ratings, and basic credibility indicators |


## Section 4 — High-Level Plan (Gantt Chart)

### Project Timeline Overview

```mermaid
gantt
    title Raoof Project Plan - MVP Phase 1 (2026)
    dateFormat  YYYY-MM-DD
    axisFormat  %W

    section Idea Dev
    Idea Generation & Validation       :done, s1, 2026-01-01, 14d

    section Charter
    Project Charter Creation           :active, s2, 2026-01-15, 14d

    section Tech Docs
    System Design & Documentation      :s3, 2026-01-29, 14d

    section MVP Dev
    Core Feature Development           :s4, 2026-02-12, 28d

    section Closure
    Testing, Presentation & Closure    :s5, 2026-03-12, 14d
