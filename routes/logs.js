import express from "express";
const router = express.Router();

// Lấy lịch sử xuất kho
router.get("/exports", async (req, res) => {
  const snap = await req.db
    .collection("export_logs")
    .orderBy("exported_at", "desc")
    .get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});

// Lấy yêu cầu nhập kho
router.get("/imports", async (req, res) => {
  const snap = await req.db
    .collection("import_requests")
    .orderBy("created_at", "desc")
    .get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});

export default router;
