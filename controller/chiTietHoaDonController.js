const { sqlPool } = require("../model/connect_sqlserver");
const { mysqlConnection } = require("../model/connect_mysql");
const { checkInsert, checkUpdate } = require("../auth/checkInfomation");

const getAllCHITIETHOADON = async (req, res) => {
  try {
    const sqlQuery =
      "select hd.MaHD as MaHD, kh.TenKH as TenKH, mh.TenMH as TenMH, lh.TenLH as TenLH, nsx.TenNsx as TenNsx, ct.SoLuong as SoLuong, ct.DonGia as Gia, mh.GiamGia as GiamGia,ct.ThanhTien as ThanhTien, mh.MaGiamGia as MaGiamGia, hd.HinhThucTT as HinhThucTT, hd.NgayLap as NgayLap from chitiethoadon ct inner join hoadon hd on ct.MaHD = hd.MaHD inner join mathang mh on ct.MaMH = mh.MaMH inner join nhanvien nv on nv.MaNV = hd.MaNV inner join khachhang kh on hd.MaKH = kh.MaKH inner join loaihang lh on mh.MaLH = lh.MaLH inner join nhasanxuat nsx on mh.MaNSX = nsx.MaNsx";
    const allCHITIETHOADON = await sqlPool.request().query(sqlQuery);
    const isCHITIETHOADON = allCHITIETHOADON.recordset.length;
    if (isCHITIETHOADON > 0) {
      res.status(200).json(allCHITIETHOADON.recordset);
    } else {
      res.json({ message: "Không có " });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getCHITIETHOADONById = async (req, res) => {
  const id = req.params.id;
  try {
    const aCHITIETHOADON = await sqlPool
      .request()
      .query(`SELECT * FROM CHITIETHOADON WHERE MaHD = '${id}'`);
    const count = aCHITIETHOADON.recordset.length;
    console.log();
    if (count > 0) {
      res.status(200).json(aCHITIETHOADON.recordset);
    } else {
      res.send({ message: "Không tồn tại" });
    }
  } catch (error) {
    res.send({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const createCHITIETHOADON = async (req, res) => {
  const { reqMaHD, reqMaMH, reqSoLuong, reqDonGia, reqThanhTien } = req.body;
  const insertQuery = `INSERT INTO CHITIETHOADON VALUES ('${reqMaHD}','${reqMaMH}','${reqSoLuong}',N'${reqDonGia}','${reqThanhTien}')`;
  const checkCHITIETHOADON = `SELECT cOUNT(*) as count FROM CHITIETHOADON WHERE MaHD = '${reqMaHD}' and MaMH = '${reqMaMH}'`;

  try {
    const TKExists = await checkInsert(checkCHITIETHOADON);
    if (TKExists) {
      res.send({ message: "Đã tồn tại" });
      return;
    }

    sqlPool.request().query(insertQuery, (sqlError) => {
      if (sqlError) {
        console.error(sqlError);

        res.send({ message: "Lỗi khi thêm ở SQL Server" });
      } else {
        mysqlConnection.query(insertQuery, (mysqlError) => {
          if (mysqlError) {
            res.send({ message: "Lỗi khi thêm ở MySql" });
          } else {
            res.status(200).json({ message: "Đồng bộ thêm  thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Thêm  không thành công" });
  }
};

const updateCHITIETHOADON = async (req, res) => {
  const { reqMaHD, reqMaMH, reqSoLuong, reqDonGia, reqThanhTien } = req.body;
  const updateQuery = `UPDATE CHITIETHOADON SET MaMH = '${reqMaMH}', SoLuong = '${reqSoLuong}',DonGia = '${reqDonGia}',ThanhTien= '${reqThanhTien}' WHERE  MaHD = '${reqMaHD}'`;
  const checkCHITIETHOADON = `SELECT cOUNT(*) as count FROM CHITIETHOADON WHERE MaHD = '${reqMaHD}'`;

  try {
    const TKExists = await checkInsert(checkCHITIETHOADON);
    if (!TKExists) {
      res.send({ message: "Không tìm thấy " });
      return;
    }

    sqlPool.request().query(updateQuery, (sqlError) => {
      if (sqlError) {
        console.error(sqlError);

        res.send({
          message: "Lỗi khi cập nhật ở SQL Server",
        });
      } else {
        mysqlConnection.query(updateQuery, (mysqlError) => {
          if (mysqlError) {
            res.send({
              message: "Lỗi khi cập nhật ở MySql",
            });
          } else {
            res.status(200).json({
              message: "Đồng bộ cập nhật thành công",
            });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Cập nhật không thành công" });
  }
};

const deleteCHITIETHOADON = async (req, res) => {
  const id = req.params.id;
  const { reqMaMH } = req.body;
  const deleteteTK = `DELETE FROM CHITIETHOADON WHERE MaHD = '${id}' and MaMH = '${reqMaMH}`;
  const checkTK = `SELECT cOUNT(*) as count FROM CHITIETHOADON WHERE MaHD = '${id}'`;

  try {
    const khoExists = await checkInsert(checkTK);
    if (!khoExists) {
      res.send({ message: "Không tìm thấy " });
      return;
    }

    sqlPool.request().query(deleteteTK, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở SQL Server" });
      } else {
        mysqlConnection.query(deleteteTK, (mysqlError) => {
          if (mysqlError) {
            console.log(mysqlError);
            res.send({ message: "Lỗi khi xóa ở MySql" });
          } else {
            res.status(200).json({ message: "Đồng bộ xóa thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllCHITIETHOADON,
  getCHITIETHOADONById,
  createCHITIETHOADON,
  updateCHITIETHOADON,
  deleteCHITIETHOADON,
};
