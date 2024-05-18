const fs = require("fs");

const generatePatients = (numPatients) => {
  const patients = [];
  for (let i = 1; i <= numPatients; i++) {
    patients.push({
      id: i,
      name: `Patient${i}`,
      age: Math.floor(Math.random() * 60) + 18, // Random age between 18 and 77
      weight: Math.floor(Math.random() * 50) + 50, // Random weight between 50 and 99
      kidney: [
        {
          NoOfHealthyKidney: Math.floor(Math.random() * 3), // 0, 1, or 2 healthy kidneys
          NoOfUnhealthyKidney: Math.floor(Math.random() * 3), // 0, 1, or 2 unhealthy kidneys
        }
      ]
    });
  }
  return patients;
};

// Ensure valid kidney counts (1 or 2 total kidneys per patient)
const validatePatients = (patients) => {
  return patients.map(patient => {
    let healthy = patient.kidney[0].NoOfHealthyKidney;
    let unhealthy = patient.kidney[0].NoOfUnhealthyKidney;

    // Ensure total kidneys count to 1 or 2
    while (healthy + unhealthy > 2) {
      if (healthy > 0) {
        healthy--;
      } else {
        unhealthy--;
      }
    }

    // Ensure no negative kidney counts
    if (healthy < 0) healthy = 0;
    if (unhealthy < 0) unhealthy = 0;

    patient.kidney[0].NoOfHealthyKidney = healthy;
    patient.kidney[0].NoOfUnhealthyKidney = unhealthy;
    return patient;
  });
};

const data = {
  patient: validatePatients(generatePatients(10000)),
  kidneyBank: [
    {
      NoOfHealthyKidney: 40,
      NoOfUnhealthyKidney: 9
    }
  ]
};

fs.writeFileSync("patient.json", JSON.stringify(data, null, 2));

console.log("Dummy data generated successfully!");
