const express = require("express");
const app = express();
const db = require("./database");

app.use(express.json());
app.use(express.static("public"));

// Endpoint untuk mendapatkan jumlah suara OSIS
app.get("/api/get-suara-osis", (req, res) => {
  db.query(
    "SELECT nomor_paslon, jumlah_suara FROM suara_osis ORDER BY nomor_paslon",
    (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }
      res.json(results);
    }
  );
});

// Endpoint untuk mendapatkan jumlah suara MPK
app.get("/api/get-suara-mpk", (req, res) => {
  db.query(
    "SELECT nomor_paslon, jumlah_suara FROM suara_mpk ORDER BY nomor_paslon",
    (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }
      res.json(results);
    }
  );
});

// Endpoint untuk submit vote
app.post("/api/submit-vote", (req, res) => {
  const { tipe, nomor_paslon } = req.body;
  const table = tipe === "osis" ? "suara_osis" : "suara_mpk";

  db.query(
    `UPDATE ${table} SET jumlah_suara = jumlah_suara + 1 WHERE nomor_paslon = ?`,
    [nomor_paslon],
    (err, result) => {
      if (err) {
        console.error("Error updating vote:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }
      res.json({ success: true });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
