import express from "express";
const router = express.Router();

// Lấy toàn bộ sản phẩm
router.get("/", async (req, res) => {
  try {
    const snap = await req.db
      .collection("products")
      .where("is_deleted", "==", false)
      .get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Thêm sản phẩm
router.post("/", async (req, res) => {
  try {
    const ref = await req.db.collection("products").add({
      ...req.body,
      is_deleted: false,
      created_at: req.admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true, id: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Cập nhật sản phẩm
router.put("/:id", async (req, res) => {
  try {
    await req.db.collection("products").doc(req.params.id).update(req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Xóa mềm sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    await req.db
      .collection("products")
      .doc(req.params.id)
      .update({ is_deleted: true });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
