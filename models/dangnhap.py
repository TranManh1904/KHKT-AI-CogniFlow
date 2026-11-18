from routes.connect_db import get_db_connection

def check_login(ten_dang_nhap, mat_khau):
    """
    Kiểm tra thông tin đăng nhập của người dùng từ cơ sở dữ liệu SQL Server.
    Trả về thông tin user dưới dạng dictionary nếu hợp lệ, ngược lại trả về None hoặc thông báo lỗi.
    """
    conn = get_db_connection()
    if not conn:
        return {"error": "Không thể kết nối đến cơ sở dữ liệu."}
    
    try:
        cursor = conn.cursor()
        # Truy vấn kết hợp bảng DM_Nguoi_Dung và DM_Vai_Tro để lấy thông tin vai trò
        query = """
            SELECT u.id, u.ten_dang_nhap, u.ho_ten, u.lop, v.ma_vai_tro, v.ten_vai_tro, u.dang_hoat_dong, u.mat_khau_bam
            FROM DM_Nguoi_Dung u
            JOIN DM_Vai_Tro v ON u.ma_vai_tro = v.id
            WHERE u.ten_dang_nhap = ?
        """
        cursor.execute(query, (ten_dang_nhap,))
        row = cursor.fetchone()
        
        if not row:
            return None # Không tìm thấy tên đăng nhập
            
        user_id, username, ho_ten, lop, ma_vai_tro, ten_vai_tro, dang_hoat_dong, mat_khau_bam = row
        
        # Kiểm tra xem tài khoản có đang hoạt động hay bị khóa (1 = hoạt động, 0 = bị khóa)
        if dang_hoat_dong != 1:
            return {"error": "Tài khoản của bạn đã bị khóa hoặc tạm ngưng hoạt động."}
        
        # So sánh mật khẩu (Nếu có mã hóa hash ở thực tế, thay thế bằng hàm verify tương ứng)
        if mat_khau_bam == mat_khau:
            return {
                "id": user_id,
                "ten_dang_nhap": username,
                "ho_ten": ho_ten,
                "lop": lop,
                "ma_vai_tro": ma_vai_tro,
                "ten_vai_tro": ten_vai_tro
            }
            
        return None # Mật khẩu không đúng
        
    except Exception as e:
        print(f"Lỗi truy vấn đăng nhập: {e}")
        return None
    finally:
        cursor.close()
        conn.close()


def change_password(ten_dang_nhap, mat_khau_moi):
    """
    Cập nhật mật khẩu mới cho người dùng trong cơ sở dữ liệu.
    Trả về True nếu thành công, False nếu thất bại.
    """
    conn = get_db_connection()
    if not conn:
        return False
        
    try:
        cursor = conn.cursor()
        query = "UPDATE DM_Nguoi_Dung SET mat_khau_bam = ? WHERE ten_dang_nhap = ?"
        cursor.execute(query, (mat_khau_moi, ten_dang_nhap))
        conn.commit()
        return True
    except Exception as e:
        print(f"Lỗi cập nhật mật khẩu: {e}")
        return False
    finally:
        cursor.close()
        conn.close()