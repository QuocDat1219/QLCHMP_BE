const express = require("express");
const router = express.Router();

const {
  getNHANHANG,
  getNHANHANGById,
  craeteNHANHANG,
  updateNHANHANG,
  deleteNHANHANG,
} = require("../controller/nhanHangController");

router.get("/", getNHANHANG);
router.get("/:id", getNHANHANGById);
router.post("/", craeteNHANHANG);
router.put("/", updateNHANHANG);
router.delete("/:id", deleteNHANHANG);
module.exports = router;
