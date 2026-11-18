from routes.connect_db import get_db_connection

def lay_tat_ca_chu_de(tu_khoa=""):
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor()
    
    if tu_khoa:
        cursor.execute("""
            SELECT c.id, c.ma_chu_de, c.ten_chu_de, c.chu_de_cha_id, c.linh_vuc, c.mo_ta, c.trang_thai,
                   p.ten_chu_de AS ten_chu_de_cha
            FROM DM_ChuDe c
            LEFT JOIN DM_ChuDe p ON c.chu_de_cha_id = p.id
            WHERE c.ten_chu_de LIKE ? OR c.linh_vuc LIKE ?
        """, (f"%{tu_khoa}%", f"%{tu_khoa}%"))
    else:
        cursor.execute("""
            SELECT c.id, c.ma_chu_de, c.ten_chu_de, c.chu_de_cha_id, c.linh_vuc, c.mo_ta, c.trang_thai,
                   p.ten_chu_de AS ten_chu_de_cha
            FROM DM_ChuDe c
            LEFT JOIN DM_ChuDe p ON c.chu_de_cha_id = p.id
        """)
        
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [{
        "id": r[0],
        "ma_chu_de": r[1],
        "ten_chu_de": r[2],
        "chu_de_cha_id": r[3],
        "linh_vuc": r[4] or "",
        "mo_ta": r[5] or "",
        "trang_thai": r[6],
        "ten_chu_de_cha": r[7] or "-- Là chủ đề gốc --"
    } for r in rows]

def them_chu_de(data):
    conn = get_db_connection()
    if not conn: return False, "Lỗi kết nối CSDL!"
    cursor = conn.cursor()
    try:
        chu_de_cha_id = data.get('chu_de_cha_id')
        if chu_de_cha_id == "" or chu_de_cha_id is None:
            chu_de_cha_id = None
        else:
            chu_de_cha_id = int(chu_de_cha_id)

        cursor.execute("""
            INSERT INTO DM_ChuDe (ma_chu_de, ten_chu_de, chu_de_cha_id, linh_vuc, mo_ta, trang_thai)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data.get('ma_chu_de'),
            data.get('ten_chu_de'),
            chu_de_cha_id,
            data.get('linh_vuc'),
            data.get('mo_ta'),
            1
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return True, "Thêm chủ đề thành công!"
    except Exception as e:
        cursor.close()
        conn.close()
        return False, f"Lỗi: {str(e)}"

def xoa_chu_de(chu_de_id):
    conn = get_db_connection()
    if not conn: return
    cursor = conn.cursor()
    # Xóa các chủ đề con trước hoặc để cascade, ở đây ta xóa trực tiếp theo id
    cursor.execute("DELETE FROM DM_ChuDe WHERE id = ?", (chu_de_id,))
    conn.commit()
    cursor.close()
    conn.close()