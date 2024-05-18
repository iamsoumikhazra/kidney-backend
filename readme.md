# Kidney Hospital Management System

This project implements a Kidney Hospital Management System using Node.js with Express.js and JSON file storage. It provides RESTful APIs for managing patient records, kidney checkups, replacements, and donations.

### Features:

- **Add Patient:** Add new patients to the hospital records, specifying patient details and kidney health.
- **Record Checkup:** Record kidney checkups for existing patients to update their health status.
- **Replace Kidney:** Perform kidney replacement operations for patients with unhealthy kidneys.
- **Donate Kidney:** Manage kidney donations from patients to the hospital's kidney bank.

### Implementation:

- **Node.js and Express.js:** Utilizes Node.js and Express.js for building the server and handling HTTP requests.
- **JSON File Storage:** Patient and kidney data are stored in a JSON file (`patient.json`) using `fs/promises` for file operations.
- **Data Validation:** Includes functions to validate patient data and kidney counts to ensure data integrity.

### API Endpoints:

- `GET /`: Retrieve patient information by `id` or `name`.
- `POST /`: Add a new patient to the hospital records.
- `POST /checkup`: Record a kidney checkup for a patient.
- `PUT /replace`: Replace a patient's unhealthy kidney with a healthy one.
- `DELETE /donate`: Allow patients to donate a kidney to the hospital's kidney bank.

### Usage:

1. Clone the repository:
`https://github.com/iamsoumikhazra/kidney-backend.git`

`cd kidney-hospital-management-system`

2. Install dependencies: `npm install`

3. Start the server:
`npm run start`

The server will run at `http://localhost:8000`.

### Contributing:

Contributions are welcome! Feel free to open issues or pull requests for any improvements or bug fixes.

