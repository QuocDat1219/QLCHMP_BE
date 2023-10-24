const { sqlPool } = require("../model/connect_sqlserver");
const { mysqlConnection } = require("../model/connect_mysql");

const phanTanNgang = async (req, res) => {
  const { bang, cot, dieukien, bangvitu1, cotvitu1, dieukienvitu1 } = req.body;
  let vitu = "";
  if (bangvitu1 || cotvitu1 || dieukienvitu1) {
    vitu = `SELECT nv.* into ${bangvitu1} FROM ${bang} cn inner join OPENQUERY(MYSQL, 'SELECT nv.* FROM ${bangvitu1} nv') nv on cn.MaCN=nv.MaCN Where nv.${cotvitu1} = '${dieukienvitu1}'`;
  } else {
    vitu =
      "SELECT nv.* into nhanvien FROM chinhanh cn inner join OPENQUERY(MYSQL, 'SELECT nv.* FROM nhanvien nv') nv on cn.MaCN=nv.MaCN";
  }
  if (bang || cot || dieukien) {
    try {

      res.status(200).json({ message: "success" });
    } catch (error) {
      console.error("Lỗi khi thực hiện các lệnh SQL:", error);
      res.status(300).send({ message: "error" });
    }
  } else {
    res.status(300).send({ message: "error" });
  }
};

module.exports = {
  phanTanNgang,
};
