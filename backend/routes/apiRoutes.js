const express = require("express");
const prisma = require("../db/prisma");

const router = express.Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const valueTypes = ["COUNT", "DECIMAL", "PERCENTAGE"];

function text(value) {
    return typeof value === "string" && value.trim() !== "";
}

function uuid(value) {
    return typeof value === "string" && uuidPattern.test(value);
}

function bad(res, message) {
    return res.status(400).json({ error: message });
}

function databaseError(res, error, message) {
    if (error.code === "P2002") return res.status(409).json({ error: "That record already exists." });
    if (error.code === "P2003") return res.status(400).json({ error: "A related record was not found." });
    console.error(message, error);
    return res.status(500).json({ error: message });
}

router.get("/divisions", async (req, res) => {
    try {
        res.json(await prisma.division.findMany({ orderBy: { name: "asc" } }));
    } catch (error) {
        databaseError(res, error, "Could not fetch divisions.");
    }
});

router.post("/divisions", async (req, res) => {
    const { code, name } = req.body;
    if (!text(code) || !text(name)) return bad(res, "code and name are required.");
    try {
        const division = await prisma.division.create({
            data: { code: code.trim(), name: name.trim() }
        });
        res.status(201).json(division);
    } catch (error) {
        databaseError(res, error, "Could not create division.");
    }
});

router.get("/offices", async (req, res) => {
    try {
        res.json(await prisma.office.findMany({ orderBy: { name: "asc" } }));
    } catch (error) {
        databaseError(res, error, "Could not fetch offices.");
    }
});

router.post("/offices", async (req, res) => {
    const { divisionId, code, name } = req.body;
    if (!uuid(divisionId) || !text(code) || !text(name)) return bad(res, "divisionId, code and name are required.");
    try {
        const office = await prisma.office.create({
            data: { divisionId, code: code.trim(), name: name.trim() }
        });
        res.status(201).json(office);
    } catch (error) {
        databaseError(res, error, "Could not create office.");
    }
});

router.get("/indicators", async (req, res) => {
    try {
        res.json(await prisma.indicator.findMany({ orderBy: { name: "asc" } }));
    } catch (error) {
        databaseError(res, error, "Could not fetch indicators.");
    }
});

router.post("/indicators", async (req, res) => {
    const { code, name, description, unit, valueType } = req.body;
    if (!text(code) || !text(name) || !text(description) || !text(unit) || !valueTypes.includes(valueType)) {
        return bad(res, "code, name, description, unit and a valid valueType are required.");
    }
    try {
        const indicator = await prisma.indicator.create({
            data: {
                code: code.trim(), name: name.trim(), description: description.trim(), unit: unit.trim(), valueType
            }
        });
        res.status(201).json(indicator);
    } catch (error) {
        databaseError(res, error, "Could not create indicator.");
    }
});

router.get("/measurements", async (req, res) => {
    try {
        res.json(await prisma.measurement.findMany({
            orderBy: { periodStart: "desc" }, include: { office: true, indicator: true }
        }));
    } catch (error) {
        databaseError(res, error, "Could not fetch measurements.");
    }
});

router.post("/measurements", async (req, res) => {
    const { officeId, indicatorId, periodStart, periodEnd, value } = req.body;
    const datesAreValid = !Number.isNaN(Date.parse(periodStart)) && !Number.isNaN(Date.parse(periodEnd));
    if (!uuid(officeId) || !uuid(indicatorId) || !datesAreValid || !Number.isFinite(Number(value)) ||
        new Date(periodStart) > new Date(periodEnd)) {
        return bad(res, "Valid officeId, indicatorId, dates, and value are required.");
    }
    try {
        const measurement = await prisma.measurement.create({
            data: {
                officeId, indicatorId, periodStart: new Date(periodStart), periodEnd: new Date(periodEnd), value: Number(value)
            }
        });
        res.status(201).json(measurement);
    } catch (error) {
        databaseError(res, error, "Could not create measurement.");
    }
});

router.put("/measurements/:id", async (req, res) => {
    const { periodStart, periodEnd, value } = req.body;
    const datesAreValid = !Number.isNaN(Date.parse(periodStart)) && !Number.isNaN(Date.parse(periodEnd));
    if (!uuid(req.params.id) || !datesAreValid || !Number.isFinite(Number(value)) ||
        new Date(periodStart) > new Date(periodEnd)) {
        return bad(res, "Valid dates and a numeric value are required.");
    }
    try {
        const measurement = await prisma.measurement.update({
            where: { id: req.params.id },
            data: { periodStart: new Date(periodStart), periodEnd: new Date(periodEnd), value: Number(value) }
        });
        res.json(measurement);
    } catch (error) {
        if (error.code === "P2025") return res.status(404).json({ error: "Measurement not found." });
        databaseError(res, error, "Could not update measurement.");
    }
});

module.exports = router;
