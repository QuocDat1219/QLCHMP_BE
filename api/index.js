require("dotenv").config();
const { sqlPool, connectSQL } = require("../model/connect_sqlserver");
const { connectMysql } = require("../model/connect_mysql");
const { connectOracle } = require("../model/connect_oracle");
const express = require("express");

const chiNhanhRoutes = require("../routes/chinhanhRoutes");
const nhanVienRoutes = require("../routes/nhanVienRoutes");
const khachHangRoutes = require("../routes/khachHangRoutes");
const phanTanNgangHangRoutes = require("../routes/phanTanNgangRoutes");
const loginMysqlRoutes = require("../routes/loginMysqlRoutes");
const khoRoutes = require("../routes/khoRoutes");
const taiKhoanRoutes = require("../routes/taiKhoanRouters");
const phieuNhapRoutes = require("../routes/phieuNhapRoutes");
const chiTietPhieuNhapRoutes = require("../routes/chiTietPhieuNhapRoutes");
const phieuGiamGiaRoutes = require("../routes/phieuGiamGiaRoutes");
const danhMucRoutes = require("../routes/danhMucRoutes");
const hoaDonRoutes = require("../routes/hoaDonRoutes");
const chiTietHoaDonRoutes = require("../routes/chiTietHoaDonRoutes");
const sanPhamRoutes = require("../routes/sanPhamRoutes");
const khuVucRoutes = require("../routes/khuVucRoutes");
const nhanHangRoutes = require("../routes/nhanHangRoutes");
const cors = require("cors");

connectSQL();
connectMysql();
connectOracle();
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("ok api");
});

app.use("/api/chinhanh", chiNhanhRoutes);
app.use("/api/nhanvien", nhanVienRoutes);
app.use("/api/khachhang", khachHangRoutes);
app.use("/api/phantan", phanTanNgangHangRoutes);
app.use("/api/mysql", loginMysqlRoutes);
app.use("/api/kho", khoRoutes);
app.use("/api/taikhoan", taiKhoanRoutes);
app.use("/api/phieunhap", phieuNhapRoutes);
app.use("/api/chitietphieunhap", chiTietPhieuNhapRoutes);
app.use("/api/giamgia", phieuGiamGiaRoutes);
app.use("/api/danhmuc", danhMucRoutes);
app.use("/api/hoadon", hoaDonRoutes);
app.use("/api/chitiethoadon", chiTietHoaDonRoutes);
app.use("/api/sanpham", sanPhamRoutes);
app.use("/api/khuvuc", khuVucRoutes);
app.use("/api/nhanhang", nhanHangRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).send({ message: err, message });
});

const PORT = process.env.PORT || 5055;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
