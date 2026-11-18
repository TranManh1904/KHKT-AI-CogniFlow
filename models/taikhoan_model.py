import pyodbc
# Import hàm get_db_connection chuẩn từ file kết nối chung của dự án (routes/connect_db.py)
from routes.connect_db import get_db_connection

def lay_danh_sach_tai_khoan(tu_khoa=""):
    conn = get_db_connection()
    if not conn:
        return []
    
    cursor = conn.cursor()
    if tu_khoa:
        cursor.execute("""
            SELECT ten_dang_nhap, ho_ten, ma_vai_tro, dang_hoat_dong 
            FROM DM_Nguoi_Dung 
            WHERE ten_dang_nhap LIKE ? OR ho_ten LIKE ?
        """, (f"%{tu_khoa}%", f"%{tu_khoa}%"))
    else:
        cursor.execute("SELECT ten_dang_nhap, ho_ten, ma_vai_tro, dang_hoat_dong FROM DM_Nguoi_Dung")
    
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # Trả về danh sách dict khớp với các cột thực tế của bảng DM_Nguoi_Dung
    return [{"username": r[0], "displayName": r[1], "role": r[2], "isLocked": (0 if r[3] == 1 else 1)} for r in rows]

def them_tai_khoan(username, password, display_name, ma_vai_tro=1):
    conn = get_db_connection()
    if not conn:
        return False, "Lỗi kết nối cơ sở dữ liệu!"
        
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM DM_Nguoi_Dung WHERE ten_dang_nhap = ?", (username,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return False, "Tên đăng nhập đã tồn tại!"

    cursor.execute("""
        INSERT INTO DM_Nguoi_Dung (ten_dang_nhap, mat_khau_bam, ho_ten, ma_vai_tro, dang_hoat_dong)
        VALUES (?, ?, ?, ?, 1)
    """, (username, password, display_name, ma_vai_tro))
    conn.commit()
    cursor.close()
    conn.close()
    return True, "Thêm tài khoản thành công!"

def cap_nhat_trang_thai_khoa(username, is_locked):
    conn = get_db_connection()
    if not conn:
        return
    cursor = conn.cursor()
    # Nếu is_locked = True thì dang_hoat_dong = 0, ngược lại = 1
    dang_hoat_dong = 0 if is_locked else 1
    cursor.execute("UPDATE DM_Nguoi_Dung SET dang_hoat_dong = ? WHERE ten_dang_nhap = ?", (dang_hoat_dong, username))
    conn.commit()
    cursor.close()
    conn.close()

def reset_mat_khau(username, new_password="123456"):
    conn = get_db_connection()
    if not conn:
        return
    cursor = conn.cursor()
    cursor.execute("UPDATE DM_Nguoi_Dung SET mat_khau_bam = ? WHERE ten_dang_nhap = ?", (new_password, username))
    conn.commit()
    cursor.close()
    conn.close()

def xoa_tai_khoan(username):
    conn = get_db_connection()
    if not conn:
        return
    cursor = conn.cursor()
    cursor.execute("DELETE FROM DM_Nguoi_Dung WHERE ten_dang_nhap = ?", (username,))
    conn.commit()
    cursor.close()
    conn.close()

def sua_tai_khoan(username_goc, username_moi, ho_ten, ma_vai_tro, dang_hoat_dong, password_moi=None):
    conn = get_db_connection()
    if not conn:
        return False, "Lỗi kết nối cơ sở dữ liệu!"
    
    cursor = conn.cursor()
    try:
        # Nếu đổi username mới, kiểm tra xem username mới đã tồn tại chưa
        if username_goc != username_moi:
            cursor.execute("SELECT * FROM DM_Nguoi_Dung WHERE ten_dang_nhap = ?", (username_moi,))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                return False, "Tên đăng nhập mới đã tồn tại!"

        # Nếu có nhập mật khẩu mới thì cập nhật cả mật khẩu, không thì giữ nguyên
        if password_moi and password_moi.strip():
            cursor.execute("""
                UPDATE DM_Nguoi_Dung 
                SET ten_dang_nhap = ?, ho_ten = ?, ma_vai_tro = ?, dang_hoat_dong = ?, mat_khau_bam = ?
                WHERE ten_dang_nhap = ?
            """, (username_moi, ho_ten, ma_vai_tro, dang_hoat_dong, password_moi, username_goc))
        else:
            cursor.execute("""
                UPDATE DM_Nguoi_Dung 
                SET ten_dang_nhap = ?, ho_ten = ?, ma_vai_tro = ?, dang_hoat_dong = ?
                WHERE ten_dang_nhap = ?
            """, (username_moi, ho_ten, ma_vai_tro, dang_hoat_dong, username_goc))
            
        conn.commit()
        cursor.close()
        conn.close()
        return True, "Cập nhật tài khoản thành công!"
    except Exception as e:
        cursor.close()
        conn.close()
        return False, f"Lỗi hệ thống: {str(e)}"