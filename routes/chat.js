import express from "express";
const router = express.Router();

// Lấy tin nhắn của 1 cuộc chat
router.get("/:chatId/messages", async (req, res) => {
  const snap = await req.db
    .collection("chats")
    .doc(req.params.chatId)
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});

// Gửi tin nhắn mới
router.post("/:chatId/send", async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  if (!senderId || !receiverId || !message)
    return res.status(400).json({ error: "Missing fields" });

  await req.db
    .collection("chats")
    .doc(req.params.chatId)
    .collection("messages")
    .add({
      senderId,
      receiverId,
      message,
      timestamp: req.admin.firestore.FieldValue.serverTimestamp(),
    });

  await req.db
    .collection("chats")
    .doc(req.params.chatId)
    .set(
      {
        users: [senderId, receiverId],
        lastMessage: message,
        lastTime: req.admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  res.json({ success: true });
});

export default router;
