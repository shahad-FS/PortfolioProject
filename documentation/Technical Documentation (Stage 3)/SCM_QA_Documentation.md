# SCM & QA Strategy Documentation

## 1. SCM Strategy (Source Code Management)

### Overview

Source Code Management (SCM) is used to manage and track changes in the project codebase using Git. It ensures collaboration, version control, and organized development workflow.

---

### Branching Strategy

We use a structured Git branching model:

* **main branch**: Contains the stable and production-ready version of the project.
* **develop branch**: Main integration branch where all features are combined and tested.
* **feature branches**: Created for each new feature or task (e.g., feature-login, feature-api).

#### Workflow:

1. Create a feature branch from `develop`.
2. Develop the feature independently.
3. Commit changes regularly with clear messages.
4. Open a Pull Request (PR) to merge into `develop`.
5. After review and approval, merge into `develop`.
6. Final tested version is merged into `main` for release.

---

### Code Reviews

Code reviews are required before merging any feature:

* Ensures code quality and consistency.
* Detects bugs early.
* Improves collaboration between team members.
* Every Pull Request must be reviewed before approval.

---

## 2. QA Strategy (Quality Assurance)

### Overview

Quality Assurance (QA) ensures that the software is reliable, functional, and free of critical bugs before release.

---

### Testing Types

We use multiple levels of testing:

* **Unit Testing**: Tests individual functions or components.
* **Integration Testing**: Tests interaction between different modules.
* **Manual Testing**: Checks user interface and user experience manually.
* **Regression Testing**: Ensures new updates do not break existing functionality.

---

### Testing Tools

We use the following tools:

* Postman for API testing.
* Jest or similar frameworks for unit testing.
* Browser-based testing tools for UI validation.

---

### QA Workflow

1. Developer writes code.
2. Unit tests are executed.
3. Code is reviewed.
4. Integration tests are performed.
5. Code is deployed to staging.
6. Manual testing is performed.
7. Final release to production.

---

## Conclusion

This document defines the SCM and QA strategies used in the project to ensure structured development, high code quality, and reliable software delivery.
