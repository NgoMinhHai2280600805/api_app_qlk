import express from "express";
const router = express.Router();

// Lấy danh mục
router.get("/", async (req, res) => {
  const snap = await req.db
    .collection("categories")
    .where("is_deleted", "==", false)
    .get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});

// Thêm danh mục
router.post("/", async (req, res) => {
  const ref = await req.db.collection("categories").add({
    ...req.body,
    is_deleted: false,
    created_at: req.admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ success: true, id: ref.id });
});

export default router;
