const express = require("express");
const fs = require("fs/promises");
const app = express();
const port = 8000;

app.use(express.json());

const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading file: ${filePath} - ${error.message}`);
  }
};

const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error writing file: ${filePath} - ${error.message}`);
  }
};

const getNoOfKidneys = (kidney) => {
  const { NoOfHealthyKidney, NoOfUnhealthyKidney } = kidney[0];
  return NoOfHealthyKidney + NoOfUnhealthyKidney;
};

const validateKidneys = (kidney) => {
  const { NoOfHealthyKidney, NoOfUnhealthyKidney } = kidney[0];
  const totalKidneys = NoOfHealthyKidney + NoOfUnhealthyKidney;
  return totalKidneys >= 1 && totalKidneys <= 2 && NoOfHealthyKidney >= 0 && NoOfUnhealthyKidney >= 0;
};

app.get("/", async (req, res) => {
  try {
    const { id, name } = req.query;

    if (!id && !name) {
      return res.status(400).send("Patient ID or name is required");
    }

    const data = await readJsonFile("./patient.json");

    let patient;
    if (id) {
      patient = data.patient.find((p) => p.id === parseInt(id));
    } else if (name) {
      patient = data.patient.find((p) => p.name === name);
    }

    if (patient) {
      return res.json(patient);
    }
    res.status(404).send("Patient not found");
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/", async (req, res) => {
  try {
    const newPatient = req.body;
    if (!newPatient.name) {
      return res.status(400).send("Patient name is required");
    }
    if (!validateKidneys(newPatient.kidney)) {
      return res.status(400).send("A patient must have 1 or 2 kidneys, and kidney counts cannot be negative");
    }

    const data = await readJsonFile("./patient.json");
    const id = data.patient.length ? data.patient[data.patient.length - 1].id + 1 : 1;
    const patientWithId = { id, ...newPatient };

    data.patient.push(patientWithId);
    await writeJsonFile("./patient.json", data);

    res.status(201).send(`Patient added successfully: ID ${id}, Name ${newPatient.name}`);
    console.log(`Patient added successfully: ID ${id}, Name ${newPatient.name}`);
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/checkup", async (req, res) => {
  try {
    const { id, name, kidney } = req.body;
    if (!id && !name) {
      return res.status(400).send("Patient ID or name is required");
    }
    if (!kidney) {
      return res.status(400).send("Kidney data is required");
    }
    if (!validateKidneys(kidney)) {
      return res.status(400).send("A patient must have 1 or 2 kidneys, and kidney counts cannot be negative");
    }

    const data = await readJsonFile("./patient.json");

    let patient;
    if (id) {
      patient = data.patient.find((p) => p.id === parseInt(id));
    } else if (name) {
      patient = data.patient.find((p) => p.name === name);
    }

    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    patient.kidney = kidney;
    await writeJsonFile("./patient.json", data);

    res.send("Checkup successfully recorded");
  } catch (error) {
    console.error("Error adding checkup:", error);
    res.status(500).send("Internal server error");
  }
});

app.put("/replace", async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id && !name) {
      return res.status(400).send("Patient ID or name is required");
    }

    const data = await readJsonFile("./patient.json");

    let patient;
    if (id) {
      patient = data.patient.find((p) => p.id === parseInt(id));
    } else if (name) {
      patient = data.patient.find((p) => p.name === name);
    }

    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    if (patient.kidney[0].NoOfUnhealthyKidney === 0) {
      return res.status(400).send("No unhealthy kidney to replace");
    }

    patient.kidney[0].NoOfUnhealthyKidney -= 1;
    patient.kidney[0].NoOfHealthyKidney += 1;

    if (!validateKidneys(patient.kidney)) {
      return res.status(400).send("A patient must have 1 or 2 kidneys after replacement, and kidney counts cannot be negative");
    }

    await writeJsonFile("./patient.json", data);
    res.send("Kidney replacement successful");
  } catch (error) {
    console.error("Error replacing kidney:", error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/donate", async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id && !name) {
      return res.status(400).send("Patient ID or name is required");
    }

    const data = await readJsonFile("./patient.json");

    let patient;
    if (id) {
      patient = data.patient.find((p) => p.id === parseInt(id));
    } else if (name) {
      patient = data.patient.find((p) => p.name === name);
    }

    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    const { NoOfHealthyKidney, NoOfUnhealthyKidney } = patient.kidney[0];

    if (NoOfHealthyKidney === 2) {
      patient.kidney[0].NoOfHealthyKidney -= 1;
      data.kidneyBank[0].NoOfHealthyKidney += 1;
    } else if (NoOfHealthyKidney === 1 && NoOfUnhealthyKidney === 1) {
      patient.kidney[0].NoOfUnhealthyKidney -= 1;
      data.kidneyBank[0].NoOfUnhealthyKidney += 1;
    } else if (NoOfHealthyKidney === 0 && NoOfUnhealthyKidney === 2) {
      patient.kidney[0].NoOfUnhealthyKidney -= 1;
      data.kidneyBank[0].NoOfUnhealthyKidney += 1;
    } else {
      return res.status(400).send("This patient cannot donate any kidney");
    }

    if (!validateKidneys(patient.kidney)) {
      return res.status(400).send("A patient must have 1 or 2 kidneys after donation, and kidney counts cannot be negative");
    }

    await writeJsonFile("./patient.json", data);
    res.send("Kidney donation successful");
    console.log(`Kidney donation successful for patient "${patient.name}"`);
  } catch (error) {
    console.error("Error donating kidney:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => console.log(`Hospital server started at port ${port}`));
