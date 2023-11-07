const { sqlPool } = require("../model/connect_sqlserver");
const { mysqlConnection } = require("../model/connect_mysql");
const { executeOracleQuery } = require("../model/connect_oracle");
const phanTanNgang = async (req, res) => {
  const { bang, cot, phantan, bangvitu, cotvitu, dieukienvitu } = req.body;
  let vitu,
    tanchinhsql,
    vitusql,
    nhanvienvitu,
    khachhangvitu,
    khovitu,
    taikhoanvitu,
    hoadonvitu,
    phieunhapvitu,
    sanphamvitu,
    ctphieunhapvitu,
    danhmucvitu,
    nhanhangvitu,
    cthoadonvitu,
    phieuGiamGiaViTu,
    tanchinh = "";
  if (bangvitu || cotvitu || dieukienvitu) {
    vitusql = `SELECT cn.* into chinhanh FROM khuvuc kv inner join OPENQUERY(QLCHMP, 'SELECT cn.* FROM chinhanh cn') cn on kv.MaKV=cn.MaKV where cn.${cotvitu} = N'${dieukienvitu}'`;
    tanchinhsql = `SELECT * into khuvuc FROM OPENQUERY(QLCHMP, 'SELECT * FROM khuvuc Where ${cot} = N''${phantan}''')`;
  } else {
    tanchinhsql = `SELECT * into khuvuc FROM OPENQUERY(QLCHMP, 'SELECT * FROM khuvuc Where ${cot} = N''${phantan}''')`;
    vitusql = `SELECT cn.* into chinhanh FROM khuvuc kv inner join OPENQUERY(QLCHMP, 'SELECT cn.* FROM chinhanh cn') cn on kv.MaKV=cn.MaKV`;
  }
  if (bang || cot || phantan) {
    //tán bảng khu vực
    tanchinh = `select * from khuvuc EXCEPT select * from khuvuc where ${cot} = '${phantan}'`;
    vitu = `SELECT * FROM CHINHANH EXCEPT SELECT cn.* FROM chinhanh cn INNER JOIN khuvuc kv on cn.MaKV = kv.MaKV WHERE kv.${cot} = N'${phantan}'`;
    nhanvienvitu = `SELECT * FROM NHANVIEN EXCEPT SELECT nv.* from nhanvien nv INNER JOIN chinhanh cn on nv.MaCN = cn.MaCN INNER JOIN khuvuc kv ON kv.MaKV = cn.MaKV WHERE kv.${cot} = N'${phantan}'`;
    khachhangvitu = `SELECT * FROM KHACHHANG EXCEPT SELECT kh.* from khachhang kh INNER JOIN chinhanh cn on kh.MaCN = cn.MaCN INNER JOIN khuvuc kv ON kv.MaKV = cn.MaKV WHERE kv.${cot} =N'${phantan}'`;
    khovitu = `SELECT * FROM KHO EXCEPT SELECT kho.* from kho INNER JOIN chinhanh cn on kho.MaCN = cn.MaCN INNER JOIN khuvuc kv ON kv.MaKV = cn.MaKV WHERE kv.${cot} = N'${phantan}'`;
    taikhoanvitu = `SELECT * FROM TAIKHOAN EXCEPT SELECT tk.* from taikhoan tk INNER JOIN nhanvien nv on nv.MaNV = tk.MaNV INNER JOIN chinhanh cn on nv.MaCN = cn.MaCN INNER JOIN khuvuc kv ON kv.MaKV = cn.MaKV WHERE kv.${cot} = N'${phantan}'`;
    hoadonvitu = `SELECT * FROM HOADON EXCEPT SELECT hd.* FROM hoadon hd INNER JOIN khachhang kh ON kh.MaKH = hd.MaKH INNER JOIN nhanvien nv on nv.MaNV = hd.MaNV INNER join chinhanh cn on cn.MaCN = kh.MaCN INNER JOIN khuvuc kv on kv.MaKV = cn.MaKV WHERE kv.${cot} = N'${phantan}'`;
    phieunhapvitu = `SELECT * FROM PHIEUNHAP EXCEPT SELECT pn.* FROM phieunhap pn INNER JOIN kho ON pn.MaKho = kho.MaKho INNER JOIN chinhanh cn on cn.MaCN = kho.MaCN INNER JOIN khuvuc kv on cn.MaKV = kv.MaKV WHERE kv.${cot} = N'${phantan}'`;
    sanphamvitu = `SELECT * FROM SANPHAM EXCEPT select sp.* from sanpham sp inner join chitietphieunhap ctn on sp.MaMH = ctn.MaMH inner join phieunhap pn on pn.MaPhieuNhap = ctn.MaPhieuNhap INNER join kho on pn.MaKho = kho.MaKho INNER join chinhanh cn on kho.MaCN = cn.MaCN INNER JOIN khuvuc kv on kv.MaKV = cn.MaKV where kv.${cot} = N'${phantan}'`;
    ctphieunhapvitu = `SELECT * FROM CHITIETPHIEUNHAP EXCEPT SELECT ctn.* from chitietphieunhap ctn inner join phieunhap pn on ctn.MaPhieuNhap = pn.MaPhieuNhap INNER JOIN kho on kho.MaKho = pn.MaKho INNER JOIN chinhanh cn on kho.MaCN = cn.MaCN INNER JOIN khuvuc kv on kv.MaKV = cn.MaKV WHERE kv.${cot} = N'${phantan}'`;
    danhmucvitu = `SELECT * FROM DANHMUC EXCEPT SELECT dm.* from danhmuc dm INNER JOIN sanpham sp on dm.MaLH = sp.MaLH INNER JOIN chitietphieunhap ctn on sp.MaMH = ctn.MaMH INNER join phieunhap pn on ctn.MaPhieuNhap = pn.MaPhieuNhap INNER join kho ON kho.MaKho = pn.MaKho INNER JOIN chinhanh cn on kho.MaCN = cn.MaCN INNER JOIN khuvuc kv on kv.MaKV = cn.MaKV WHERE kv.${cot} = N'${phantan}'`;
    nhanhangvitu = `SELECT * FROM NHANHANG EXCEPT SELECT nh.* from nhanhang nh INNER JOIN sanpham sp on nh.MaNH = sp.MaNH INNER JOIN chitietphieunhap ctn on sp.MaMH = ctn.MaMH INNER join phieunhap pn on ctn.MaPhieuNhap = pn.MaPhieuNhap INNER join kho ON kho.MaKho = pn.MaKho INNER JOIN chinhanh cn on kho.MaCN = cn.MaCN INNER JOIN khuvuc kv on kv.MaKV = cn.MaKV WHERE kv.${cot} = N'${phantan}' GROUP BY nh.MaNH`;
    cthoadonvitu = `SELECT * FROM CHITIETHOADON EXCEPT select cth.* from chitiethoadon cth INNER JOIN hoadon hd on cth.MaHD = hd.MaHD INNER JOIN nhanvien nv on hd.MaNV = nv.MaNV INNER JOIN chinhanh cn on nv.MaCN = cn.MaCN INNER JOIN khuvuc kv ON cn.MaKV = kv.MaKV where kv.${cot}= N'${phantan}'`;
    phieuGiamGiaViTu = `SELECT * FROM PHIEUGIAMGIA EXCEPT SELECT pgg.* from phieugiamgia pgg INNER JOIN sanpham mh on pgg.MaGiamGia = mh.MaGiamGia INNER JOIN chitiethoadon cthd on mh.MaMH = cthd.MaMH INNER JOIN hoadon hd on hd.MaHD = cthd.MaHD INNER JOIN khachhang kh on kh.MaKH = hd.MaKH INNER JOIN chinhanh cn on kh.MaCN = cn.MaCN INNER JOIN khuvuc kv on kv.MaKV = cn.MaKV where kv.${cot}=N'${phantan}' GROUP BY pgg.MaGiamGia`;

    const result = await mysqlConnection.promise().query(tanchinh);
    const [results] = result;
    if (results.length > 0) {
      const checkTableQuery0 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'KHUVUC'";
      try {
        const result0 = await executeOracleQuery(checkTableQuery0);
        const tableCount0 = result0.rows[0][0];

        if (tableCount0 > 0) {
          console.log("Bảng khu vực đã tồn tại");
          return;
        } else {
          const oracleQuery0 =
            "CREATE TABLE khuvuc (MaKV varchar2(20), TenKV varchar2(50), GhiChu varchar2(50))";
          await executeOracleQuery(oracleQuery0);
        }
      } catch (oracleError0) {
        console.error("Tạo bảng không thành công:", oracleError0.message);
      }
      // Chuyển dữ liệu và thêm vào bảng Oracle
      for (const row of results) {
        const MaKV = row.MaKV;
        const TenKV = row.TenKV;
        const GhiChu = row.GhiChu;

        const insertQuery0 =
          "INSERT INTO khuvuc (MaKV, TenKV, GhiChu) VALUES (:MaKV, :TenKV, :GhiChu)";
        const insertParams0 = [MaKV, TenKV, GhiChu];

        try {
          executeOracleQuery(insertQuery0, insertParams0);
        } catch (oracleError) {
          console.error(
            "Lỗi khi chèn dữ liệu vào bảng Oracle:",
            oracleError.message
          );
        }
      }

      const alterQuery0 =
        "ALTER TABLE khuvuc ADD CONSTRAINT pk_khuvuc PRIMARY KEY (MaKV)";
      executeOracleQuery(alterQuery0);
    }

    //Tán bảng chi nhánh
    const resultcn = await mysqlConnection.promise().query(vitu);
    const [resultsCN] = resultcn;
    if (resultsCN.length > 0) {
      const checkTableQuery1 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'CHINHANH'";
      const result1 = await executeOracleQuery(checkTableQuery1);
      const tableCount1 = result1.rows[0][0];

      if (tableCount1 > 0) {
        console.log("Bảng chi nhánh đã tồn tại");
      } else {
        const oracleQuery1 =
          "CREATE TABLE chinhanh (MaCN varchar2(20), TenCN varchar2(50), DiaChi varchar2(50), Sdt varchar2(11), MaKV varchar2(20), GhiChu varchar2(50))";
        await executeOracleQuery(oracleQuery1);
      }

      for (const row of resultsCN) {
        const MaCN = row.MaCN;
        const TenCN = row.TenCN;
        const DiaChi = row.DiaChi;
        const Sdt = row.Sdt;
        const MaKV = row.MaKV;
        const GhiChu = row.GhiChu;

        const insertQuery1 =
          "INSERT INTO chinhanh (MaCN, TenCN, DiaChi, Sdt, MaKV, GhiChu) VALUES (:MaCN, :TenCN, :DiaChi, :Sdt, :MaKV, :GhiChu)";
        const insertParams1 = [MaCN, TenCN, DiaChi, Sdt, MaKV, GhiChu];
        await executeOracleQuery(insertQuery1, insertParams1);
      }

      const alterQuery1 =
        "ALTER TABLE chinhanh ADD CONSTRAINT pk_chinhanh PRIMARY KEY (MaCN)";
      await executeOracleQuery(alterQuery1);

      const alterQuery11 =
        "ALTER TABLE chinhanh ADD CONSTRAINT fk_chinhanh_khuvuc FOREIGN KEY (MaKV) REFERENCES KHUVUC(MaKV)";
      await executeOracleQuery(alterQuery11);
    }

    //Phân tán bảng nhân viên
    const resultnv = await mysqlConnection.promise().query(nhanvienvitu);
    const [resultnvs] = resultnv;

    if (resultnvs.length > 0) {
      const checkTableQuery2 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'NHANVIEN'";
      const result2 = await executeOracleQuery(checkTableQuery2);
      const tableCount2 = result2.rows[0][0];

      if (tableCount2 > 0) {
        console.log("Bảng nhân viên đã tồn tại");
      } else {
        const oracleQuery2 =
          "CREATE TABLE nhanvien (MaNV varchar2(20), MaCN varchar2(20), TenNV varchar2(50), NgaySinh date, GioiTinh varchar2(50), Diachi varchar2(50), Sdt varchar2(50))";
        await executeOracleQuery(oracleQuery2);
      }

      for (const row of resultnvs) {
        const MaNV = row.MaNV;
        const MaCN = row.MaCN;
        const TenNV = row.TenNV;
        const NgaySinh = row.NgaySinh;
        const GioiTinh = row.GioiTinh;
        const Diachi = row.Diachi;
        const Sdt = row.Sdt;

        const insertQuery2 =
          "INSERT INTO nhanvien (MaNV, MaCN, TenNV, NgaySinh, GioiTinh, Diachi, Sdt) VALUES (:MaNV, :MaCN, :TenNV, :NgaySinh, :GioiTinh, :Diachi, :Sdt)";
        const insertParams2 = [
          MaNV,
          MaCN,
          TenNV,
          NgaySinh,
          GioiTinh,
          Diachi,
          Sdt,
        ];
        await executeOracleQuery(insertQuery2, insertParams2);
      }

      const alterQuery3 =
        "ALTER TABLE nhanvien ADD CONSTRAINT pk_nhanvien PRIMARY KEY (MaNV)";
      await executeOracleQuery(alterQuery3);

      const alterQuery4 =
        "ALTER TABLE nhanvien ADD CONSTRAINT fk_nhanvien_CN FOREIGN KEY (MaCN) REFERENCES chinhanh(MaCN)";
      await executeOracleQuery(alterQuery4);
    }

    //Phân tán khách hàng
    const resultKH = await mysqlConnection.promise().query(khachhangvitu);
    const [reusltkhs] = resultKH;
    if (reusltkhs.length > 0) {
      const checkTableQuery3 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'KHACHHANG'";
      const result3 = await executeOracleQuery(checkTableQuery3);
      const tableCount3 = result3.rows[0][0];

      if (tableCount3 > 0) {
        console.log("Bảng khách hàng đã tồn tại");
      } else {
        const oracleQuery3 =
          "CREATE TABLE khachhang (MaKH varchar2(20), MaCN varchar2(20), TenKH varchar2(50), NgaySinh date, GioiTinh varchar2(50), Diachi varchar2(50), Sdt varchar2(50))";
        await executeOracleQuery(oracleQuery3);
      }

      for (const row of reusltkhs) {
        const MaKH = row.MaKH;
        const MaCN = row.MaCN;
        const TenKH = row.TenKH;
        const NgaySinh = row.NgaySinh;
        const GioiTinh = row.GioiTinh;
        const Diachi = row.Diachi;
        const Sdt = row.Sdt;

        const insertQuery3 =
          "INSERT INTO khachhang VALUES (:MaKH, :MaCN, :TenKH, :NgaySinh, :GioiTinh, :Diachi, :Sdt)";
        const insertParams3 = [
          MaKH,
          MaCN,
          TenKH,
          NgaySinh,
          GioiTinh,
          Diachi,
          Sdt,
        ];
        await executeOracleQuery(insertQuery3, insertParams3);
      }

      const alterPKKhachHang =
        "ALTER TABLE khachhang ADD CONSTRAINT pk_khachhang PRIMARY KEY (MaKH)";
      await executeOracleQuery(alterPKKhachHang);

      const alterFKkh =
        "ALTER TABLE khachhang ADD CONSTRAINT fk_khachhang_CN FOREIGN KEY (MaCN) REFERENCES chinhanh(MaCN) DEFERRABLE INITIALLY DEFERRED";
      await executeOracleQuery(alterFKkh);
    }

    //Phân tán bảng kho
    const resultKho = await mysqlConnection.promise().query(khovitu);
    const [khoResults] = resultKho;
    if (khoResults.length > 0) {
      const checkTableQuery4 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'KHO'";
      const result4 = await executeOracleQuery(checkTableQuery4);
      const tableCount4 = result4.rows[0][0];

      if (tableCount4 > 0) {
        console.log("Bảng kho đã tồn tại");
      } else {
        const oracleQuery4 =
          "CREATE TABLE kho (MaKho varchar2(20), MaCN varchar2(20), TenKho varchar2(50), DiaChi varchar2(50), GhiChu varchar2(50))";
        await executeOracleQuery(oracleQuery4);
      }

      for (const row of khoResults) {
        const MaKho = row.MaKho;
        const MaCN = row.MaCN;
        const TenKho = row.TenKho;
        const DiaChi = row.DiaChi;
        const GhiChu = row.GhiChu;

        const insertQuery4 =
          "INSERT INTO kho VALUES (:MaKho, :MaCN, :TenKho, :DiaChi, :GhiChu)";
        const insertParams4 = [MaKho, MaCN, TenKho, DiaChi, GhiChu];
        await executeOracleQuery(insertQuery4, insertParams4);
      }

      const alterQuery441 =
        "ALTER TABLE kho ADD CONSTRAINT pk_kho PRIMARY KEY (MaKho)";
      await executeOracleQuery(alterQuery441);

      const alterQuery442 =
        "ALTER TABLE kho ADD CONSTRAINT fk_kho_CN FOREIGN KEY (MaCN) REFERENCES chinhanh(MaCN) DEFERRABLE INITIALLY DEFERRED";
      await executeOracleQuery(alterQuery442);
    }

    //Phân tán tài khoản
    const taiKhoanResult = await mysqlConnection.promise().query(taikhoanvitu);
    const [taiKhoanResults] = taiKhoanResult;
    if (taiKhoanResults.length > 0) {
      const checkTableQuery5 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'TAIKHOAN'";
      const result5 = await executeOracleQuery(checkTableQuery5);
      const tableCount5 = result5.rows[0][0];

      if (tableCount5 > 0) {
        console.log("Bảng tài khoản đã tồn tại");
      } else {
        const oracleQuery5 =
          "CREATE TABLE taikhoan (TenTK varchar2(50), MaNV varchar2(20), Matkhau varchar2(50), Quyen number)";
        await executeOracleQuery(oracleQuery5);
      }

      for (const row of taiKhoanResults) {
        const TenTK = row.TenTK;
        const MaNV = row.MaNV;
        const Matkhau = row.Matkhau;
        const Quyen = row.Quyen;

        const insertQuery5 =
          "INSERT INTO taikhoan VALUES (:TenTK, :MaNV, :Matkhau, :Quyen)";
        const insertParams5 = [TenTK, MaNV, Matkhau, Quyen];
        await executeOracleQuery(insertQuery5, insertParams5);
      }

      const alterQuery551 =
        "ALTER TABLE taikhoan ADD CONSTRAINT pk_taikhoan PRIMARY KEY (TenTK)";
      await executeOracleQuery(alterQuery551);

      const alterQuery552 =
        "ALTER TABLE taikhoan ADD CONSTRAINT fk_TK_Nv FOREIGN KEY (MaNV) REFERENCES nhanvien(MaNV) DEFERRABLE INITIALLY DEFERRED";
      await executeOracleQuery(alterQuery552);
    }

    //Phân tán bảng hóa đơn
    const hoaDonResult = await mysqlConnection.promise().query(hoadonvitu);
    const [hoaDonResults] = hoaDonResult;
    if (hoaDonResults.length > 0) {
      const checkTableQuery8 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'HOADON'";
      const result8 = await executeOracleQuery(checkTableQuery8);
      const tableCount8 = result8.rows[0][0];

      if (tableCount8 > 0) {
        console.log("Bảng hóa đơn đã tồn tại");
      } else {
        const oracleQuery8 =
          "CREATE TABLE hoadon (MaHD varchar2(20), MaNV varchar2(20), MaKH varchar2(20), HinhThucTT varchar2(50), NgayLap date, GhiChu varchar2(50))";
        await executeOracleQuery(oracleQuery8);
      }

      for (const row of hoaDonResults) {
        const MaHD = row.MaHD;
        const MaNV = row.MaNV;
        const MaKH = row.MaKH;
        const HinhThucTT = row.HinhThucTT;
        const NgayLap = row.NgayLap;
        const GhiChu = row.GhiChu;

        const insertQuery8 =
          "INSERT INTO hoadon VALUES (:MaHD, :MaNV, :MaKH, :HinhThucTT, :NgayLap, :GhiChu)";
        const insertParams8 = [MaHD, MaNV, MaKH, HinhThucTT, NgayLap, GhiChu];
        await executeOracleQuery(insertQuery8, insertParams8);
      }

      const alterQuery881 =
        "ALTER TABLE hoadon ADD CONSTRAINT pk_hoadon PRIMARY KEY (MaHD)";
      await executeOracleQuery(alterQuery881);

      const alterQuery882 =
        "ALTER TABLE hoadon ADD CONSTRAINT fk_KH_HD FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH) DEFERRABLE INITIALLY DEFERRED";
      await executeOracleQuery(alterQuery882);

      const alterQuery883 =
        "ALTER TABLE hoadon ADD CONSTRAINT fk_NV_HD FOREIGN KEY (MaNV) REFERENCES nhanvien(MaNV)";
      await executeOracleQuery(alterQuery883);
    }

    //Phân tán phiếu nhập
    const phieuNhapResult = await mysqlConnection
      .promise()
      .query(phieunhapvitu);
    const [phieuNhapResults] = phieuNhapResult;
    if (phieuNhapResults.length > 0) {
      const checkTableQuery9 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'PHIEUNHAP'";
      const result9 = await executeOracleQuery(checkTableQuery9);
      const tableCount9 = result9.rows[0][0];

      if (tableCount9 > 0) {
        console.log("Bảng phiếu nhập đã tồn tại");
      } else {
        const oracleQuery9 =
          "CREATE TABLE phieunhap (MaPhieuNhap varchar2(20), MaNV varchar2(20), MaKho varchar2(20), DVT varchar2(50), NgayLapPhieu date)";
        await executeOracleQuery(oracleQuery9);
      }

      for (const row of phieuNhapResults) {
        const MaPhieuNhap = row.MaPhieuNhap;
        const MaNV = row.MaNV;
        const MaKho = row.MaKho;
        const DVT = row.DVT;
        const NgayLapPhieu = row.NgayLapPhieu;

        const insertQuery9 =
          "INSERT INTO phieunhap VALUES (:MaPhieuNhap, :MaNV, :MaKho, :DVT, :NgayLapPhieu)";
        const insertParams9 = [MaPhieuNhap, MaNV, MaKho, DVT, NgayLapPhieu];
        await executeOracleQuery(insertQuery9, insertParams9);
      }

      const alterQuery991 =
        "ALTER TABLE phieunhap ADD CONSTRAINT pk_phieunhap PRIMARY KEY (MaPhieuNhap)";
      await executeOracleQuery(alterQuery991);

      const alterQuery992 =
        "ALTER TABLE phieunhap ADD CONSTRAINT fk_NV_PN FOREIGN KEY (MaNV) REFERENCES nhanvien(MaNV) DEFERRABLE INITIALLY DEFERRED";
      await executeOracleQuery(alterQuery992);

      const alterQuery993 =
        "ALTER TABLE phieunhap ADD CONSTRAINT fk_KHO_PN FOREIGN KEY (MaKho) REFERENCES kho(MaKho) DEFERRABLE INITIALLY DEFERRED";
      await executeOracleQuery(alterQuery993);
    }

    // Phân tán bảng sản phẩm
    const sanPhamResult = await mysqlConnection.promise().query(sanphamvitu);
    const [sanPhamResults] = sanPhamResult;
    if (sanPhamResults.length > 0) {
      const checkTableQuery10 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'sanpham'";
      const result10 = await executeOracleQuery(checkTableQuery10);
      const tableCount10 = result10.rows[0][0];

      if (tableCount10 > 0) {
        console.log("Bảng sản phẩm đã tồn tại");
      } else {
        const oracleQuery10 =
          "CREATE TABLE sanpham (MaMH varchar2(20), MaLH varchar2(20), MaGiamGia varchar2(20), TenMH varchar2(50), GiamGia float, MoTa varchar2(50), DVT varchar2(50), MaNH varchar2(20))";
        await executeOracleQuery(oracleQuery10);
      }

      for (const row of sanPhamResults) {
        const MaMH = row.MaMH;
        const MaLH = row.MaLH;
        const MaGiamGia = row.MaGiamGia;
        const TenMH = row.TenMH;
        const GiamGia = row.GiamGia;
        const MoTa = row.MoTa;
        const DVT = row.DVT;
        const MaNH = row.MaNH;

        const insertQuery10 =
          "INSERT INTO sanpham VALUES (:MaMH, :MaLH, :MaGiamGia, :TenMH, :GiamGia, :MoTa, :DVT, :MaNH)";
        const insertParams10 = [
          MaMH,
          MaLH,
          MaGiamGia,
          TenMH,
          GiamGia,
          MoTa,
          DVT,
          MaNH,
        ];
        await executeOracleQuery(insertQuery10, insertParams10);
      }

      const alterQuery110 =
        "ALTER TABLE sanpham ADD CONSTRAINT pk_sanpham PRIMARY KEY (MaMH)";
      await executeOracleQuery(alterQuery110);
    }

    //Phân tán chi tiết phiếu nhập
    const ctpnResult = await mysqlConnection.promise().query(ctphieunhapvitu);
    const [ctpnResults] = ctpnResult;
    if (ctpnResults.length > 0) {
      const checkTableQuery11 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'CHITIETPHIEUNHAP'";
      const result11 = await executeOracleQuery(checkTableQuery11);
      const tableCount11 = result11.rows[0][0];

      if (tableCount11 > 0) {
        console.log("Bảng chi tiết phiếu nhập đã tồn tại");
      } else {
        const oracleQuery11 =
          "CREATE TABLE chitietphieunhap (MaPhieuNhap varchar2(20), MaMH varchar2(20), GiaNhap number, GiaBan number, SoLuong number, ThanhTien number)";
        await executeOracleQuery(oracleQuery11);
      }

      for (const row of ctpnResults) {
        const MaPhieuNhap = row.MaPhieuNhap;
        const MaMH = row.MaMH;
        const GiaNhap = parseFloat(row.GiaNhap);
        const GiaBan = parseFloat(row.GiaBan);
        const SoLuong = parseInt(row.SoLuong);
        const ThanhTien = parseFloat(row.ThanhTien);

        const insertQuery11 =
          "INSERT INTO chitietphieunhap VALUES (:MaPhieuNhap, :MaMH, :GiaNhap, :GiaBan, :SoLuong, :ThanhTien)";
        const insertParams11 = [
          MaPhieuNhap,
          MaMH,
          GiaNhap,
          GiaBan,
          SoLuong,
          ThanhTien,
        ];
        await executeOracleQuery(insertQuery11, insertParams11);
      }

      const alterQuery111 =
        "ALTER TABLE chitietphieunhap ADD CONSTRAINT pk_chitietphieunhap PRIMARY KEY (MaPhieuNhap, MaMH)";
      await executeOracleQuery(alterQuery111);

      const alterQuery112 =
        "ALTER TABLE chitietphieunhap ADD CONSTRAINT fk_CTN_PN FOREIGN KEY (MaPhieuNhap) REFERENCES phieunhap(MaPhieuNhap)";
      await executeOracleQuery(alterQuery112);

      const alterQuery113 =
        "ALTER TABLE chitietphieunhap ADD CONSTRAINT fk_CTN_MH FOREIGN KEY (MaMH) REFERENCES sanpham(MaMH)";
      await executeOracleQuery(alterQuery113);
    }

    //Phân tán danh mục sản phẩm
    const danhMucResult = await mysqlConnection.promise().query(danhmucvitu);
    const [danhMucResults] = danhMucResult;
    if (danhMucResults.length > 0) {
      const checkTableQuery12 =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'DANHMUC'";
      const result12 = await executeOracleQuery(checkTableQuery12);
      const tableCount12 = result12.rows[0][0];

      if (tableCount12 > 0) {
        console.log("Bảng danh mục sản phẩm đã tồn tại");
      } else {
        const oracleQuery12 =
          "CREATE TABLE danhmuc (MaLH varchar2(20), TenLH varchar2(50))";
        await executeOracleQuery(oracleQuery12);
      }

      for (const row of danhMucResults) {
        const MaLH = row.MaLH;
        const TenLH = row.TenLH;

        const insertQuery12 = "INSERT INTO danhmuc VALUES (:MaLH, :TenLH)";
        const insertParams12 = [MaLH, TenLH];
        await executeOracleQuery(insertQuery12, insertParams12);
      }

      const alterQuery121 =
        "ALTER TABLE danhmuc ADD CONSTRAINT pk_danhmuc PRIMARY KEY (MaLH)";
      await executeOracleQuery(alterQuery121);

      const alterQuery122 =
        "ALTER TABLE sanpham ADD CONSTRAINT fk_LH_MH FOREIGN KEY (MaLH) REFERENCES danhmuc(MaLH)";
      await executeOracleQuery(alterQuery122);
    }

    //Phân tán bảng nhãn hàng
    const nhanHangResult = await mysqlConnection.promise().query(nhanhangvitu);
    const [nhanHangResults] = nhanHangResult;
    if (nhanHangResults.length > 0) {
      const checkTableQueryNH =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'NHANHANG'";
      const resultNH = await executeOracleQuery(checkTableQueryNH);
      const tableCountNH = resultNH.rows[0][0];

      if (tableCountNH > 0) {
        console.log("Bảng nhãn hàng đã tồn tại");
      } else {
        const oracleQueryNhanHang =
          "CREATE TABLE nhanhang (MaNH varchar2(20), TenNH varchar2(50), GhiChu varchar2(50))";
        await executeOracleQuery(oracleQueryNhanHang);
      }

      for (const row of nhanHangResults) {
        const MaNH = row.MaNH;
        const TenNH = row.TenNH;
        const GhiChu = row.GhiChu;

        const insertQueryNH =
          "INSERT INTO nhanhang VALUES (:MaNH, :TenNH, :GhiChu)";
        const insertParamsNH = [MaNH, TenNH, GhiChu];
        await executeOracleQuery(insertQueryNH, insertParamsNH);
      }

      const alterQueryNHPRI =
        "ALTER TABLE nhanhang ADD CONSTRAINT pk_nhanhang PRIMARY KEY (MANH)";
      await executeOracleQuery(alterQueryNHPRI);

      const alterQueryNHFK =
        "ALTER TABLE sanpham ADD CONSTRAINT fk_NH_MH FOREIGN KEY (MANH) REFERENCES nhanhang(MANH)";
      await executeOracleQuery(alterQueryNHFK);
    }

    //Phân tán chi tiết hóa đơn
    const ctHoaDonResult = await mysqlConnection.promise().query(cthoadonvitu);
    const [ctHoaDonResults] = ctHoaDonResult;
    if (ctHoaDonResults.length > 0) {
      const checkTableQueryCTHD =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'CHITIETHOADON'";
      const resultCTHD = await executeOracleQuery(checkTableQueryCTHD);
      const tableCountCTHD = resultCTHD.rows[0][0];

      if (tableCountCTHD > 0) {
        console.log("Bảng chi tiết hóa đơn đã tồn tại");
      } else {
        const oracleQueryChiTietHoaDon =
          "CREATE TABLE chitiethoadon (MaHD varchar2(20), MaMH varchar2(20), SoLuong number, DonGia number, ThanhTien number)";
        await executeOracleQuery(oracleQueryChiTietHoaDon);
      }

      for (const row of ctHoaDonResults) {
        const MaHD = row.MaHD;
        const MaMH = row.MaMH;
        const SoLuong = row.SoLuong;
        const DonGia = row.DonGia;
        const ThanhTien = row.ThanhTien;

        const insertQueryCTHD =
          "INSERT INTO chitiethoadon VALUES (:MaHD, :MaMH, :SoLuong, :DonGia, :ThanhTien)";
        const insertParamsCTHD = [MaHD, MaMH, SoLuong, DonGia, ThanhTien];
        await executeOracleQuery(insertQueryCTHD, insertParamsCTHD);
      }

      const alterQueryCTHD_PRI =
        "ALTER TABLE chitiethoadon ADD CONSTRAINT pk_chitiethoadon PRIMARY KEY (MaHD, MaMH)";
      await executeOracleQuery(alterQueryCTHD_PRI);

      const alterQueryCTHD_FK_HD =
        "ALTER TABLE chitiethoadon ADD CONSTRAINT fk_CTHD_HD FOREIGN KEY (MaHD) REFERENCES hoadon(MaHD)";
      await executeOracleQuery(alterQueryCTHD_FK_HD);

      const alterQueryCTHD_FK_MH =
        "ALTER TABLE chitiethoadon ADD CONSTRAINT fk_CTHD_MH FOREIGN KEY (MaMH) REFERENCES sanpham(MaMH)";
      await executeOracleQuery(alterQueryCTHD_FK_MH);
    }

    //Phân tán phiếu giảm giá

    const phieuGiamGiaResult = await mysqlConnection
      .promise()
      .query(phieuGiamGiaViTu);
    const [phieuGiamGiaResults] = phieuGiamGiaResult;
    if (phieuGiamGiaResults.length > 0) {
      const checkTableQueryPGG =
        "SELECT COUNT(*) FROM user_tables WHERE table_name = 'PHIEUGIAMGIA'";
      const resultPGG = await executeOracleQuery(checkTableQueryPGG);
      const tableCountPGG = resultPGG.rows[0][0];

      if (tableCountPGG > 0) {
        console.log("Bảng phiếu giảm giá đã tồn tại");
      } else {
        const oracleQueryPhieuGiamGia =
          "CREATE TABLE phieugiamgia (MaGiamGia varchar2(20), TenMaGG varchar2(50), GiaTriGiam varchar2(20), NgayApDung date, NgayHetHan date)";
        await executeOracleQuery(oracleQueryPhieuGiamGia);
      }

      for (const row of phieuGiamGiaResults) {
        const MaGiamGia = row.MaGiamGia;
        const TenMaGG = row.TenMaGG;
        const GiaTriGiam = row.GiaTriGiam;
        const NgayApDung = row.NgayApDung;
        const NgayHetHan = row.NgayHetHan;

        const insertQueryPGG =
          "INSERT INTO phieugiamgia VALUES (:MaGiamGia, :TenMaGG, :GiaTriGiam, :NgayApDung, :NgayHetHan)";
        const insertParamsPGG = [
          MaGiamGia,
          TenMaGG,
          GiaTriGiam,
          NgayApDung,
          NgayHetHan,
        ];
        await executeOracleQuery(insertQueryPGG, insertParamsPGG);
      }

      const alterQueryPGG_PRI =
        "ALTER TABLE phieugiamgia ADD CONSTRAINT pk_phieugiamgia PRIMARY KEY (MaGiamGia)";
      await executeOracleQuery(alterQueryPGG_PRI);

      const alterQueryPGG_FK_MH =
        "ALTER TABLE sanpham ADD CONSTRAINT fk_PGG_MH FOREIGN KEY (MaGiamGia) REFERENCES phieugiamgia(MaGiamGia)";
      await executeOracleQuery(alterQueryPGG_FK_MH);
    }

    try {
      console.log(tanchinh);
      const migrateSqlServer = [
        tanchinhsql,

        "alter table khuvuc add constraint pri_key_kv primary key (MaKV)",

        //Tạo bảng chi nhánh
        vitusql,

        "alter table chinhanh add constraint pri_key_cn primary key (MaCN)",
        "alter table chinhanh add constraint FK_cn_kv foreign key (MaKV) references khuvuc(MaKV)",

        //Tạo bảng nhân viên
        "SELECT nv.* into nhanvien FROM chinhanh cn inner join OPENQUERY(QLCHMP, 'SELECT nv.* FROM nhanvien nv') nv on cn.MaCN=nv.MaCN",

        "alter table nhanvien add constraint pri_key_nv primary key (MaNV)",
        "alter table nhanvien add constraint FK_cn_nv foreign key (MaCN) references chinhanh(MaCN)",

        //Tạo bảng khách hàng
        "SELECT kh.* into khachhang FROM chinhanh cn inner join OPENQUERY(QLCHMP, 'SELECT kh.* FROM khachhang kh') kh on cn.MaCN=kh.MaCN",

        "alter table khachhang add constraint pri_key_kh primary key (MaKH)",
        "alter table khachhang add constraint FK_cn_kh foreign key (MaCN) references chinhanh(MaCN)",

        //Tạo bảng kho
        "SELECT kho.* into kho FROM chinhanh cn inner join OPENQUERY(QLCHMP, 'SELECT kho.* FROM kho kho') kho on cn.MaCN=kho.MaCN",

        "alter table kho add constraint pri_key_kho primary key (MaKho)",
        "alter table kho add constraint FK_cn_kho foreign key (MaCN) references chinhanh(MaCN)",

        //Tạo bảng tài khoản
        "SELECT tk.* into taikhoan FROM nhanvien nv inner JOIN OPENQUERY(QLCHMP, 'SELECT tk.* FROM taikhoan tk') tk ON nv.MaNV = tk.MaNV",

        "alter table taikhoan add constraint pri_key_tk primary key (TenTK)",
        "alter table taikhoan add constraint fk_nv_tk foreign key (MaNV) references nhanvien(MaNV)",

        //Tạo bảng hóa đơn--
        "SELECT hd.* into hoadon FROM nhanvien nv inner JOIN OPENQUERY(QLCHMP, 'SELECT hd.* FROM hoadon hd') hd ON nv.MaNV = hd.MaNV",

        "alter table hoadon add constraint pri_key_hd primary key (MaHD)",
        "alter table hoadon add constraint fk_hd_nv foreign key (MaNV) references nhanvien(MaNV)",
        "alter table hoadon add constraint fk_hd_kh foreign key (MaKH) references khachhang(MaKH)",

        //Tạo bảng Chi tiết hóa đơn--
        "SELECT cthd.* into chitiethoadon FROM hoadon hd inner JOIN OPENQUERY(QLCHMP, 'SELECT cthd.* FROM chitiethoadon cthd') cthd ON cthd.MaHD = hd.MaHD",

        "alter table chitiethoadon add constraint pri_key_ct primary key (MaHD,MaMH)",
        "alter table chitiethoadon add constraint FK_cthd_hd foreign key (MaHD) references hoadon(MaHD)",

        //Tạo bảng phiếu nhập--
        "SELECT pn.* into phieunhap FROM nhanvien nv inner JOIN OPENQUERY(QLCHMP, 'SELECT pn.* FROM phieunhap pn') pn ON nv.MaNV = pn.MaNV",

        "alter table phieunhap add constraint pri_key_pn primary key (MaPhieuNhap)",
        "alter table phieunhap add constraint fk_pn_nv foreign key (MaNV) references nhanvien(MaNV)",
        "alter table phieunhap add constraint fk_pn_kho foreign key (MaKho) references kho(MaKho)",

        //Tạo bảng san pham--
        "SELECT mh.* into sanpham FROM chitiethoadon cthd inner JOIN OPENQUERY(QLCHMP, 'SELECT mh.* FROM sanpham mh') mh ON cthd.MaMH = mh.MaMH",

        "alter table sanpham add constraint pri_key_mh primary key (MaMH)",
        "alter table chitiethoadon add constraint FK_cthd_mh foreign key (MaMH) references sanpham(MaMH)",

        //Tạo bảng chi tiết phiếu nhập--
        "SELECT ctpn.* into chitietphieunhap FROM phieunhap pn JOIN OPENQUERY(QLCHMP, 'SELECT ctpn.* FROM chitietphieunhap ctpn') ctpn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap",

        "alter table chitietphieunhap add constraint pri_key_ctpn primary key (MaPhieuNhap,MaMH)",
        "alter table chitietphieunhap add constraint fk_ctpn_h foreign key (MaMH) references sanpham(MaMH)",
        "alter table chitietphieunhap add constraint fk_ctpn_pn foreign key (MaPhieuNhap) references phieunhap(MaPhieuNhap)",

        //Tạo bảng danh mục--
        "SELECT lh.* into danhmuc FROM sanpham mh inner JOIN OPENQUERY(QLCHMP, 'SELECT lh.* FROM danhmuc lh') lh ON mh.MaLH = lh.MaLH",

        "alter table danhmuc add constraint pri_key_lh primary key (MaLH)",
        "alter table sanpham add constraint FK_mh_lh foreign key (MaLH) references danhmuc(MaLH)",

        //Tạo bảng nhãn hàng--
        "SELECT nh.* into nhanhang FROM sanpham mh inner JOIN OPENQUERY(QLCHMP, 'SELECT nh.* FROM nhanhang nh') nh ON mh.MaNH = nh.MaNH",

        "alter table nhanhang add constraint pri_key_nh primary key (MaNH)",
        "alter table sanpham add constraint FK_mh_nh foreign key (MaNH) references nhanhang(MaNH)",

        //Tạo bảng phiếu giảm giá
        "SELECT mgg.* into phieugiamgia FROM sanpham mh inner JOIN OPENQUERY(QLCHMP, 'SELECT mgg.* FROM phieugiamgia mgg') mgg ON mh.MaGiamGia = mgg.MaGiamGia group by mgg.MaGiamGia ,mgg.TenMaGG, mgg.GiaTriGiam, mgg.NgayApDung,mgg.NgayHetHan",

        "alter table phieugiamgia add constraint pri_key_pg primary key (MaGiamGia)",
        "alter table sanpham add constraint fk_mh_pgg foreign key (MaGiamGia) references phieugiamgia(MaGiamGia)",
      ];
      for (const sqlQuery of migrateSqlServer) {
        await sqlPool.query(sqlQuery);
      }
    } catch (error) {
      console.error(error);
      res.send({ message: "Lỗi khi phân tán Sql Server: " + error.message });
    }

    res.status(200).send({ message: "Phân tán thành công" });
  } else {
    res.send({ message: "Lỗi khi phân tán dữ liệu Oracle" });
  }
};

module.exports = {
  phanTanNgang,
};
