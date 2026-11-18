from routes.connect_db import get_db_connection

def lay_danh_sach_bo_loc(tu_khoa=""):
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor()
    
    # Truy vấn kết nối với bảng DM_ChuDe để lấy tên chủ đề hiển thị trực quan
    query = """
        SELECT b.id, b.ma_bo_loc, b.ten_bo_loc, b.chu_de_id, b.doi_tuong_ap_dung, b.muc_dich_su_dung, b.trang_thai,
               c.ten_chu_de AS ten_chu_de
        FROM DM_Bo_Loc_Yeu_Cau b
        LEFT JOIN DM_ChuDe c ON b.chu_de_id = c.id
    """
    
    if tu_khoa:
        query += " WHERE b.ten_bo_loc LIKE ? OR b.ma_bo_loc LIKE ? OR b.muc_dich_su_dung LIKE ? OR c.ten_chu_de LIKE ?"
        cursor.execute(query, (f"%{tu_khoa}%", f"%{tu_khoa}%", f"%{tu_khoa}%", f"%{tu_khoa}%"))
    else:
        cursor.execute(query)
        
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [{
        "id": r[0],
        "ma_bo_loc": r[1],
        "ten_bo_loc": r[2],
        "chu_de_id": r[3] or "",
        "doi_tuong_ap_dung": r[4] or "",
        "muc_dich_su_dung": r[5] or "",
        "trang_thai": r[6],
        "ten_chu_de": r[7] or "-- Không chọn chủ đề --"
    } for r in rows]

def them_bo_loc(data):
    conn = get_db_connection()
    if not conn: return False, "Lỗi kết nối CSDL!"
    cursor = conn.cursor()
    try:
        ma_bo_loc = data.get('ma_bo_loc')
        if not ma_bo_loc:
            import random
            ma_bo_loc = f"BL{random.randint(10000, 99999)}"

        chu_de_id = data.get('chu_de_id')
        if chu_de_id == "" or chu_de_id is None:
            chu_de_id = None
        else:
            chu_de_id = int(chu_de_id)

        cursor.execute("""
            INSERT INTO DM_Bo_Loc_Yeu_Cau (ma_bo_loc, ten_bo_loc, chu_de_id, doi_tuong_ap_dung, muc_dich_su_dung, trang_thai)
            VALUES (?, ?, ?, ?, ?, 1)
        """, (
            ma_bo_loc,
            data.get('ten_bo_loc'),
            chu_de_id,
            data.get('doi_tuong_ap_dung'),
            data.get('muc_dich_su_dung')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return True, "Thêm bộ lọc thành công!"
    except Exception as e:
        cursor.close()
        conn.close()
        return False, f"Lỗi: {str(e)}"

def sua_bo_loc(data):
    conn = get_db_connection()
    if not conn: return False, "Lỗi kết nối CSDL!"
    cursor = conn.cursor()
    try:
        chu_de_id = data.get('chu_de_id')
        if chu_de_id == "" or chu_de_id is None:
            chu_de_id = None
        else:
            chu_de_id = int(chu_de_id)

        cursor.execute("""
            UPDATE DM_Bo_Loc_Yeu_Cau 
            SET ten_bo_loc = ?, chu_de_id = ?, doi_tuong_ap_dung = ?, muc_dich_su_dung = ?
            WHERE id = ?
        """, (
            data.get('ten_bo_loc'),
            chu_de_id,
            data.get('doi_tuong_ap_dung'),
            data.get('muc_dich_su_dung'),
            data.get('id')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return True, "Cập nhật bộ lọc thành công!"
    except Exception as e:
        cursor.close()
        conn.close()
        return False, f"Lỗi: {str(e)}"

def xoa_bo_loc(bo_loc_id):
    conn = get_db_connection()
    if not conn: return
    cursor = conn.cursor()
    cursor.execute("DELETE FROM DM_Bo_Loc_Yeu_Cau WHERE id = ?", (bo_loc_id,))
    conn.commit()
    cursor.close()
    conn.close()