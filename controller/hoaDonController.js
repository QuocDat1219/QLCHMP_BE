const { sqlPool } = require("../model/connect_sqlserver");
const { mysqlConnection } = require("../model/connect_mysql");
const { checkInsert, checkUpdate } = require("../auth/checkInfomation");

const getAllHOADON = async (req, res) => {
  try {
    const sqlQuery =
      "select hd.MaHD as MaHD, nv.TenNV as TenNV, kh.TenKH as TenKH, hd.HinhThucTT as HinhThucTT, hd.NgayLap as NgayLap from hoadon hd inner join nhanvien nv on hd.MaNV = nv.MaNV inner join khachhang kh on hd.MaKH = kh.MaKH";
    const allHOADON = await sqlPool.request().query(sqlQuery);
    const isHOADON = allHOADON.recordset.length;
    if (isHOADON > 0) {
      res.status(200).json(allHOADON.recordset);
    } else {
      res.json({ message: "Không có " });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getHOADONById = async (req, res) => {
  const id = req.params.id;
  try {
    const aHOADON = await sqlPool
      .request()
      .query(`SELECT * FROM HOADON WHERE MaHD = '${id}'`);
    const count = aHOADON.recordset.length;
    console.log();
    if (count > 0) {
      res.status(200).json(aHOADON.recordset);
    } else {
      res.send({ message: "Không tồn tại" });
    }
  } catch (error) {
    res.send({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const createHOADON = async (req, res) => {
  const { reqMaHD, reqMaNV, reqMaKH, reqHinhThucTT, reqNgayLap } = req.body;
  const insertQuery = `INSERT INTO HOADON VALUES ('${reqMaHD}','${reqMaNV}','${reqMaKH}',N'${reqHinhThucTT}','${reqNgayLap}')`;
  const checkHOADON = `SELECT cOUNT(*) as count FROM HOADON WHERE MaHD = '${reqMaHD}'`;

  try {
    const THOADONxists = await checkInsert(checkHOADON);
    if (THOADONxists) {
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
            res
              .status(200)
              .json({ message: "Đồng bộ thêm thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Thêm không thành công" });
  }
};

const updateHOADON = async (req, res) => {
  const { reqMaHD, reqMaNV, reqMaKH, reqHinhThucTT, reqNgayLap } = req.body;
  const updateQuery = `UPDATE HOADON SET MaNV = N'${reqMaNV}', MaKH = '${reqMaKH}',HinhThucTT = N'${reqHinhThucTT}',NgayLap = N'${reqNgayLap}' WHERE MaHD = '${reqMaHD}'`;
  const checkHOADON = `SELECT cOUNT(*) as count FROM HOADON WHERE MaHD = '${reqMaHD}'`;

  try {
    const THOADONxists = await checkInsert(checkHOADON);
    if (!THOADONxists) {
      res.send({ message: "Không tìm thấy hóa đơn" });
      return;
    }

    sqlPool.request().query(updateQuery, (sqlError) => {
      if (sqlError) {
        console.error(sqlError);

        res.send({ message: "Lỗi khi cập nhật ở SQL Server" });
      } else {
        mysqlConnection.query(updateQuery, (mysqlError) => {
          if (mysqlError) {
            res.send({ message: "Lỗi khi cập nhật ở MySql" });
          } else {
            res
              .status(200)
              .json({ message: "Đồng bộ cập nhật thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Cập nhật không thành công" });
  }
};

const deleteHOADON = async (req, res) => {
  const id = req.params.id;
  const deleteteTK = `DELETE FROM HOADON WHERE MaHD = '${id}'`;
  const checkTK = `SELECT cOUNT(*) as count FROM HOADON WHERE MaHD = '${id}'`;

  try {
    const khoExists = await checkInsert(checkTK);
    if (!khoExists) {
      res.send({ message: "Không tìm thấy hóa đơn" });
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
  getAllHOADON,
  getHOADONById,
  createHOADON,
  updateHOADON,
  deleteHOADON,
};
