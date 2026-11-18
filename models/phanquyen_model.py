from routes.connect_db import get_db_connection

def lay_danh_sach_vai_tro():
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor()
    cursor.execute("SELECT id, ma_vai_tro, ten_vai_tro, mo_ta FROM DM_Vai_Tro")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [{"id": r[0], "ma_vai_tro": r[1], "ten_vai_tro": r[2], "mo_ta": r[3]} for r in rows]

def lay_danh_sach_chuc_nang():
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor()
    # Giả định bảng DM_ChucNang có các cột: id, ma_chuc_nang, ten_chuc_nang
    cursor.execute("SELECT id, ma_chuc_nang, ten_chuc_nang FROM DM_ChucNang")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [{"id": r[0], "ma_chuc_nang": r[1], "ten_chuc_nang": r[2]} for r in rows]