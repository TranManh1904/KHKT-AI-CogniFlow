from routes.connect_db import get_db_connection

def lay_danh_sach_ai(tu_khoa=""):
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor()
    
    if tu_khoa:
        cursor.execute("""
            SELECT id, ma_cau_hinh, nha_cung_cap, ten_hien_thi, dia_chi_api, ten_model, so_token_toi_da, dang_su_dung, nguoi_tao, ngay_tao
            FROM DM_Cau_Hinh_AI
            WHERE ten_hien_thi LIKE ? OR nha_cung_cap LIKE ? OR ten_model LIKE ?
        """, (f"%{tu_khoa}%", f"%{tu_khoa}%", f"%{tu_khoa}%"))
    else:
        cursor.execute("""
            SELECT id, ma_cau_hinh, nha_cung_cap, ten_hien_thi, dia_chi_api, ten_model, so_token_toi_da, dang_su_dung, nguoi_tao, ngay_tao
            FROM DM_Cau_Hinh_AI
        """)
        
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [{
        "id": r[0],
        "ma_cau_hinh": r[1],
        "nha_cung_cap": r[2],
        "ten_hien_thi": r[3],
        "dia_chi_api": r[4] or "",
        "ten_model": r[5],
        "so_token_toi_da": r[6],
        "dang_su_dung": r[7],
        "nguoi_tao": r[8] or "",
        "ngay_tao": str(r[9]) if r[9] else ""
    } for r in rows]

def them_cau_hinh_ai(data):
    conn = get_db_connection()
    if not conn: return False, "Lỗi kết nối CSDL!"
    cursor = conn.cursor()
    try:
        # Nếu cấu hình này được chọn là đang sử dụng (dang_su_dung = 1), thì set các cấu hình khác về 0
        if int(data.get('dang_su_dung', 0)) == 1:
            cursor.execute("UPDATE DM_Cau_Hinh_AI SET dang_su_dung = 0")

        cursor.execute("""
            INSERT INTO DM_Cau_Hinh_AI (ma_cau_hinh, nha_cung_cap, ten_hien_thi, dia_chi_api, khoa_api_ma_hoa, ten_model, so_token_toi_da, dang_su_dung, nguoi_tao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get('ma_cau_hinh'),
            data.get('nha_cung_cap'),
            data.get('ten_hien_thi'),
            data.get('dia_chi_api'),
            data.get('khoa_api_ma_hoa'), # Thực tế nên mã hóa trước khi lưu
            data.get('ten_model'),
            data.get('so_token_toi_da', 1000),
            data.get('dang_su_dung', 0),
            data.get('nguoi_tao', 'Admin')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return True, "Thêm cấu hình AI thành công!"
    except Exception as e:
        cursor.close()
        conn.close()
        return False, f"Lỗi: {str(e)}"

def xoa_cau_hinh_ai(ai_id):
    conn = get_db_connection()
    if not conn: return
    cursor = conn.cursor()
    cursor.execute("DELETE FROM DM_Cau_Hinh_AI WHERE id = ?", (ai_id,))
    conn.commit()
    cursor.close()
    conn.close()