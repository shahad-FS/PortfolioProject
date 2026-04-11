🐾 رؤوف  
**Your All-in-One Veterinary**  
**Project Charter · MVP Phase 1 · 2026**

---

## Section 0 — Define Project Objectives

### Project Purpose
Exists to bridge the gap between pet owners and the veterinary ecosystem in one unified digital platform. Today, pet owners in the region struggle to find trusted veterinary care, discover reputable pet stores, or connect with animals in need of adoption — all in one place.  
Raoof solves this by creating a seamless, Arabic-first platform that serves clinics, independent vets, pet stores, adopters, and animal welfare advocates equally.

### Project Objectives
- Connect pet owners with veterinary clinics and independent veterinarians — enabling easy appointment booking, profile browsing, and direct in-app messaging for consultations.  
- Facilitate animal adoption — providing a structured, searchable listing of animals available for adoption, including breed, health status, vaccination records, and contact information for shelters or rescuers.  
- Integrate pet stores and product marketplaces — allowing registered stores to showcase products and services, driving commerce and community engagement through the platform.  
- Deliver verified discounts and promotional offers — partnering with clinics and stores to provide exclusive, time-limited deals, incentivizing platform adoption and repeat engagement.  
- Build a trusted community layer — incorporating verified reviews, ratings, and community forums around animal welfare, enabling organic growth through word-of-mouth and social proof.  
- Provide smart matching for adoption — using preference-based filters (species, age, size, temperament, location) to intelligently surface compatible adoption candidates, increasing successful adoption rates.

### Why This Project Matters
- **Animal welfare:** Reduces the number of stray and abandoned animals through structured, visible adoption pathways.  
- **Market gap:** No existing platform in the region offers a fully integrated vet-adoption-store ecosystem in one product.  
- **Community impact:** Empowers independent vets and small clinics to compete digitally alongside larger chains.  
- **Scalability:** The MVP architecture is designed to scale into subscription tiers for clinics, premium store listings, and analytics dashboards in future phases.

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
| Internal | Instructors / Tutors              | Academic Supervisors          | Evaluate progress, provide guidance & feedback |
| External | Veterinary Clinics                | Primary Service Partner       | Registered on platform; offer appointments & deals |
| External | Independent Vets                  | Freelance Service Provider    | Home-visit & remote consultation services |
| External | Pet Adopters                      | End User                      | Browse & adopt animals via platform listings |
| External | Volunteers / Animal Rescue NGOs   | Welfare Partners              | Post rescue animals; coordinate adoption campaigns |
| External | Pet Store Owners                  | Commerce Partner              | List products & services; benefit from platform traffic |
| External | General Pet Owners                | Primary End User              | Book vets, buy products, explore adoption listings |

---

### 1.2 Team Roles & Responsibilities

| Role                     | Assigned To                          | Responsibilities |
|--------------------------|--------------------------------------|------------------|
| Project Manager          | Shahad Alsaneea                      | Sprint planning, timeline tracking, risk management, stakeholder communication |
| Tech Lead / Architect    | Shadan Alkharji                      | Technical decision-making, system architecture, code review, integration oversight |
| Frontend Developer       | Shadan Alkharji                      | React/Next.js UI, responsive design, API integration, accessibility compliance |
| Backend Developer        | Shahad Alsaneea                      | REST API design, database modeling, auth system, payment & notifications |
| UX/UI Designer           | Shadan Alkharji, Shahad Alsaneea     | User research, wireframes, prototype, brand identity & design system |
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
