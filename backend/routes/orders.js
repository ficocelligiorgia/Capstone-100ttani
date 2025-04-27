require("./models/order"); 
const Order = require("mongoose").model("Order");

app.post("/orders", async (req, res) => {
  const { items } = req.body;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const order = await Order.create({ items, total });
    res.status(201).json({ message: "Ordine salvato!", order });
  } catch (err) {
    console.error(" Errore salvataggio ordine:", err);
    res.status(500).json({ error: "Errore salvataggio ordine" });
  }
});
