const { sqlPool } = require("../model/connect_sqlserver");
const { mysqlConnection } = require("../model/connect_mysql");
const { checkInsert, checkUpdate } = require("../auth/checkInfomation");

const getAllLOAIHANG = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM LOAIHANG";
    const allLOAIHANG = await sqlPool.request().query(sqlQuery);
    const isLOAIHANG = allLOAIHANG.recordset.length;
    if (isLOAIHANG > 0) {
      res.status(200).json(allLOAIHANG.recordset);
    } else {
      res.json({ message: "Không có danh mục" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getLOAIHANGById = async (req, res) => {
  const id = req.params.id;
  try {
    const aLOAIHANG = await sqlPool
      .request()
      .query(`SELECT * FROM LOAIHANG WHERE MaLH = '${id}'`);
    const count = aLOAIHANG.recordset.length;
    console.log();
    if (count > 0) {
      res.status(200).json(aLOAIHANG.recordset);
    } else {
      res.send({ message: "danh mục không tồn tại" });
    }
  } catch (error) {
    res.send({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const createLOAIHANG = async (req, res) => {
  const { reqMaLH, reqTenLH } = req.body;
  const insertQuery = `INSERT INTO danhmuc VALUES ('${reqMaLH}',N'${reqTenLH}')`;
  const checkLOAIHANG = `SELECT cOUNT(*) as count FROM danhmuc WHERE MaLH = '${reqMaLH}'`;

  try {
    const TKExists = await checkInsert(checkLOAIHANG);
    if (TKExists) {
      res.send({ message: "danh mục đã tồn tại" });
      return;
    }

    sqlPool.request().query(insertQuery, (sqlError) => {
      if (sqlError) {
        console.error(sqlError);

        res.send({ message: "Lỗi khi thêm danh mục ở SQL Server" });
      } else {
        mysqlConnection.query(insertQuery, (mysqlError) => {
          if (mysqlError) {
            res.send({ message: "Lỗi khi thêm danh mục ở MySql" });
          } else {
            res
              .status(200)
              .json({ message: "Đồng bộ thêm danh mục thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Thêm danh mục không thành công" });
  }
};

const updateLOAIHANG = async (req, res) => {
  const { reqMaLH, reqTenLH } = req.body;
  const updateQuery = `UPDATE danhmuc SET TenLH = N'${reqTenLH}' WHERE MaLH = '${reqMaLH}'`;
  const checkLOAIHANG = `SELECT cOUNT(*) as count FROM danhmuc WHERE MaLH = '${reqMaLH}'`;

  try {
    const TKExists = await checkInsert(checkLOAIHANG);
    if (!TKExists) {
      res.send({ message: "Không tìm thấy danh mục" });
      return;
    }

    sqlPool.request().query(updateQuery, (sqlError) => {
      if (sqlError) {
        console.error(sqlError);

        res.send({ message: "Lỗi khi cập nhật danh mục ở SQL Server" });
      } else {
        mysqlConnection.query(updateQuery, (mysqlError) => {
          if (mysqlError) {
            res.send({ message: "Lỗi khi cập nhật danh mục ở MySql" });
          } else {
            res
              .status(200)
              .json({ message: "Đồng bộ cập nhật danh mục thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Cập nhật danh mục không thành công" });
  }
};

const deleteLOAIHANG = async (req, res) => {
  const id = req.params.id;
  const deleteteTK = `DELETE FROM danhmuc WHERE MaLH = '${id}'`;
  const checkTK = `SELECT cOUNT(*) as count FROM danhmuc WHERE MaLH = '${id}'`;

  try {
    const khoExists = await checkInsert(checkTK);
    if (!khoExists) {
      res.send({ message: "Không tìm thấy danh mục" });
      return;
    }

    sqlPool.request().query(deleteteTK, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa danh mục ở SQL Server" });
      } else {
        mysqlConnection.query(deleteteTK, (mysqlError) => {
          if (mysqlError) {
            console.log(mysqlError);
            res.send({ message: "Lỗi khi xóa danh mục ở MySql" });
          } else {
            res
              .status(200)
              .json({ message: "Đồng bộ xóa danh mục thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.send({ message: "Xóa không thành công" });
  }
};

module.exports = {
  getAllLOAIHANG,
  getLOAIHANGById,
  createLOAIHANG,
  updateLOAIHANG,
  deleteLOAIHANG,
};
