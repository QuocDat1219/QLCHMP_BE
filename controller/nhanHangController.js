const { sqlPool } = require("../model/connect_sqlserver");
const { mysqlConnection } = require("../model/connect_mysql");
const { checkUpdate, checkInsert } = require("../auth/checkInfomation");

const getNHANHANG = async (req, res) => {
  try {
    // Sử dụng sqlPool để thực hiện truy vấn trên SQL Server
    const sqlQuery = "SELECT * FROM NHANHANG";
    const result = await sqlPool.request().query(sqlQuery);
    res.json(result.recordset);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getNHANHANGById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM NHANHANG WHERE MaNH = '${req.params.id}'`;
    const aNHANHANG = await sqlPool.request().query(sqlQuery);

    if (aNHANHANG.recordset.length > 0) {
      res.status(200).json(aNHANHANG.recordset);
    } else {
      res.send({ error: "Không tìm thấy !" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const craeteNHANHANG = async (req, res) => {
  const { reqMaNH, reqTenNH, reqGhiChu } = req.body;
  const insertQuery = `INSERT INTO NHANHANG VALUES ('${reqMaNH}',N'${reqTenNH}',N'${reqGhiChu}')`;
  const checkNHANHANG = `SELECT cOUNT(*) as count FROM NHANHANG WHERE MaNH = '${reqMaNH}'`;

  try {
    const TKExists = await checkInsert(checkNHANHANG);
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
            res.status(200).json({ message: "Đồng bộ thêm thành công" });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.send({ message: "Thêm không thành công" });
  }
};

const updateNHANHANG = async (req, res) => {
  const { reqMaNH, reqTenNH, reqGhiChu } = req.body;

  // Tạo lệnh truy vấn chung
  const updateQuery = `UPDATE NHANHANG set TenNH='${reqTenNH}',GhiChu = '${reqGhiChu}' WHERE MaNH='${reqMaNH}'`;
  const checkNHANHANG = `SELECT cOUNT(*) as count FROM NHANHANG WHERE MaNH = '${reqMaNH}'`;

  try {
    const CNExists = await checkUpdate(checkNHANHANG);
    if (!CNExists) {
      res.status(400).json({ error: "Không tìm thấy nhãn hàng" });
      return;
    }

    // Sửa ở cả 2 cơ sở dữ liệu
    sqlPool.request().query(updateQuery, (sqlError) => {
      if (sqlError) {
        res.json({ error: "Lỗi khi cập nhật trên SQL Server" });
      } else {
        mysqlConnection.query(updateQuery, (mysqlError) => {
          if (mysqlError) {
            console.error("Lỗi khi cập nhật trên MySQL:", mysqlError);
            res.json({ error: "Lỗi khi cập nhật trên MySQL" });
          } else {
            res.status(200).json({
              message: "Đồng bộ cập nhật thành công!",
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ error: "Cập nhật không thành công!" });
  }
};

const deleteNHANHANG = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM NHANHANG WHERE MaNH = '${id}'`;
  const checkNHANHANG = `SELECT cOUNT(*) as count FROM nhanhang WHERE MaNH ='${id}'`;
  console.log(checkNHANHANG);
  try {
    const CNExists = await checkInsert(checkNHANHANG);
    if (!CNExists) {
      res.status(400).json({ error: "Không tìm thấy nhãn hàng" });
      return;
    }
    // thực hiện xóa
    sqlPool.request().query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.json({ error: "Lỗi khi xóa trên SQL Server" });
      } else {
        mysqlConnection.query(deleteQuery, (mysqlError) => {
          if (mysqlError) {
            console.error("Lỗi khi xóa trên MySQL:", mysqlError);
            res.json({ error: "Lỗi khi xóa trên MySQL" });
          } else {
            res.status(200).json({
              message: "Đồng bộ xóa thành công!",
            });
          }
        });
      }
    });
  } catch (error) {
    res.json({ error: "Xóa không thành công!" });
  }
};
module.exports = {
  getNHANHANG,
  getNHANHANGById,
  updateNHANHANG,
  deleteNHANHANG,
  craeteNHANHANG,
};
