const express = require("express");
const router = express.Router();

const {
  getAllKhuVuc,
  getKhuVucById,
  // addKhuVuc,
  // getAllKhuVucOra,
} = require("../controller/khuVucController");
// router.post("/ora", addKhuVuc);
// router.get("/ora", getAllKhuVucOra);
router.get("/", getAllKhuVuc);
router.get("/:id", getKhuVucById);

module.exports = router;
