const { sqlPool } = require("../model/connect_sqlserver");
const { executeOracleQuery } = require("../model/connect_oracle");

const getAllKhuVuc = async (req, res) => {
  try {
    // Sử dụng sqlPool để thực hiện truy vấn trên SQL Server
    const sqlQuery = "SELECT * FROM khuvuc";
    const result = await sqlPool.request().query(sqlQuery);
    res.json(result.recordset);
  } catch (error) {
    res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getKhuVucById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM khuvuc WHERE MaKV = '${req.params.id}'`;
    const aChiNhanh = await sqlPool.request().query(sqlQuery);

    if (aChiNhanh.recordset.length > 0) {
      res.status(200).json(aChiNhanh.recordset);
    } else {
      res.send({ error: "Không tìm thấy khu vực!" });
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

// const getAllKhuVucOra = async (req, res) => {
//   try {
//     const oracleQuery = "SELECT * FROM khuvuc";
//     const result = await executeOracleQuery(oracleQuery);
//     const rows = result.rows;
//     const jsonData = rows.map((row) => {
//       return {
//         MaKV: row[0],
//         TenKV: row[1],
//         GhiChu: row[2],
//       };
//     });
//     res.json(jsonData);
//   } catch (error) {
//     console.error(error);
//     res.json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
//   }
// };
// const addKhuVuc = async (req, res) => {
//   const { MaKV, TenKV, GhiChu } = req.body;
//   const oracleQuery =
//     "INSERT INTO KHUVUC (MaKV, TenKV, GhiChu) VALUES (:1, :2, :3)";
//   try {
//     await executeOracleQuery(oracleQuery, [MaKV, TenKV, GhiChu]);
//     res.json({ message: "Thêm khu vực thành công" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Lỗi khi thêm khu vực" });
//   }
// };
module.exports = {
  getAllKhuVuc,
  getKhuVucById,
};
