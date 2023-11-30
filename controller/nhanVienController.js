const { sqlPool } = require("../model/connect_sqlserver");
const { mysqlConnection } = require("../model/connect_mysql");
const {
  checkInsert,
  checkUpdate,
  checkLogin,
} = require("../auth/checkInfomation");

const getAllNhanVien = async (req, res) => {
  try {
    const sqlQuery =
      "SELECT nv.MaNV as MaNV, cn.TenCN as TenCN, TenKV, nv.TenNV as TenNV, nv.NgaySinh as NgaySinh, nv.GioiTinh as GioiTinh, nv.Diachi as DiaChi, nv.Sdt as Sdt FROM nhanvien nv INNER JOIN chinhanh cn ON nv.MaCN = cn.MaCN inner join khuvuc kv on cn.MaKV = kv.MaKV";
    const allNhanVien = await sqlPool.request().query(sqlQuery);
    if (allNhanVien.recordset.length > 0) {
      res.status(200).json(allNhanVien.recordset);
    } else {
      res.send({ message: "Không có " });
    }
  } catch (error) {
    console.error(error);
    res.send({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};

const getNhanVienById = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM NHANVIEN WHERE MaNV = '${req.params.id}'`;
    const aNhanVien = await sqlPool.request().query(sqlQuery);

    if (aNhanVien.recordset.length > 0) {
      res.status(200).json(aNhanVien.recordset);
    } else {
      res.send({ message: "Không tìm thấy !" });
    }
  } catch (error) {
    console.error(error);
    res.send({ message: "Lỗi truy vấn cơ sở dữ liệu!" });
  }
};

const createNhanVien = async (req, res) => {
  const {
    reqMaNV,
    reqMaCN,
    reqMaCV,
    reqTenNV,
    reqNgaySinh,
    reqGioiTinh,
    reqDiachi,
    reqSdt,
  } = req.body;
  const insertQuery = `INSERT INTO nhanvien VALUES ('${reqMaNV}','${reqMaCN}','${reqMaCV}',N'${reqTenNV}', '${reqNgaySinh}','${reqGioiTinh}',N'${reqDiachi}','${reqSdt}')`;
  const checkNhanVien = `SELECT COUNT(*) AS COUNT FROM NHANVIEN WHERE MaNV = '${reqMaNV}'`;
  try {
    const maNVExists = await checkInsert(checkNhanVien);
    if (maNVExists) {
      res.json({ message: "đã tồn tại" });
      return;
    }

    // Tiến hành thêm trên cả hai cơ sở dữ liệu
    sqlPool.request().query(insertQuery, (sqlError) => {
      if (sqlError) {
        res.json({ message: "Lỗi khi thêm vào SQL Server" });
      } else {
        mysqlConnection.query(insertQuery, (mysqlInsertError) => {
          if (mysqlInsertError) {
            console.error("Lỗi khi thêm vào MySQL:", mysqlInsertError);
            res.json({ message: "Lỗi khi thêm vào MySQL" });
          } else {
            res.status(201).json({
              message: "Đồng bộ thêm thành công!",
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Lỗi khi tạo nhân viên",
    });
  }
};

const updateNhanVien = async (req, res) => {
  const {
    reqMaNV,
    reqMaCN,
    reqMaCV,
    reqTenNV,
    reqNgaySinh,
    reqGioiTinh,
    reqDiachi,
    reqSdt,
  } = req.body;
  const updateQuery = `UPDATE nhanvien set MACN='${reqMaCN}', MACV='${reqMaCV}', TENNV=N'${reqTenNV}', NGAYSINH = '${reqNgaySinh}', GIOITINH = '${reqGioiTinh}', DIACHI = N'${reqDiachi}', SDT = '${reqSdt}' where MANV = '${reqMaNV}'`;
  const checkNhanVien = `SELECT cOUNT(*) as count FROM NHANVIEN WHERE MaNV = '${reqMaNV}'`;

  try {
    const nvExists = await checkUpdate(checkNhanVien);
    if (!nvExists) {
      res.send({ message: "Không tìm thấy nhân viên" });
      return;
    }

    sqlPool.request().query(updateQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi thêm ở SQL Server" });
      } else {
        mysqlConnection.query(updateQuery, (mySqlError) => {
          if (mySqlError) {
            res.staus(500).send({ message: "Lỗi thêm ở MySQL" });
          } else {
            res.status(200).json({ message: "Đồng bộ cập nhật thành công!" });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.send({ message: "Cập nhật không thành công!" });
  }
};

const deleteNhanVien = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM NHANVIEN WHERE MaNV = '${id}'`;
  const checkNhanVien = `SELECT cOUNT(*) as count FROM NHANVIEN WHERE MaNV = '${id}'`;
  try {
    const nvExists = await checkInsert(checkNhanVien);
    if (!nvExists) {
      res.send({ message: "Không tìm thấy nhân viên" });
      return;
    }

    sqlPool.request().query(deleteQuery, (sqlError) => {
      if (sqlError) {
        res.send({ message: "Lỗi khi xóa ở SQL Server" });
      } else {
        mysqlConnection.query(deleteQuery, (mySqlError) => {
          if (mySqlError) {
            res.staus(500).send({ message: "Lỗi khi xóa ở MySQL" });
          } else {
            res.status(200).json({ message: "Đồng bộ xóa thành công" });
          }
        });
      }
    });
  } catch (error) {
    res.staus(500).send({ message: "Lỗi khi xóa nhân viên" });
  }
};

const nhanVienLogin = async (req, res) => {
  try {
    const checkTaiKhoan = `SELECT cOUNT(*) as count FROM taikhoan WHERE TenTk = '${req.body.taikhoan}' and MatKhau = '${req.body.matkhau}'`;
    const recordExists = await checkLogin(checkTaiKhoan);
    if (!recordExists) {
      res.send({ message: "Sai tên tài khoản hoặc mật khẩu" });
    } else {
      const userInfo = `select nv.MaNV as MaNV, TenNV,SDT,Quyen from taikhoan tk inner join nhanvien nv on tk.MaNV = nv.MaNV where tk.TenTK = '${req.body.taikhoan}' and tk.MatKhau = '${req.body.matkhau}'`;
      const nhanvien = await sqlPool.request().query(userInfo);

      res.status(200).json(nhanvien.recordset);
    }
  } catch (error) {
    console.error(error);
    res.send({ message: "Lỗi trong quá trình đăng nhập" });
  }
};

module.exports = {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
  nhanVienLogin,
};
