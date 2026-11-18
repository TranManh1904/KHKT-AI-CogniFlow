from flask import Flask, redirect, url_for, render_template, session, request, jsonify
from routes.dangnhap_routes import dangnhap_bp
from routes import qltaikhoan_bp, trangchu_bp, dangnhap_bp, phanquyen_bp, ai_bp, chu_de_bp, bo_loc_bp, quan_ly_cau_hoi_bp
import pyodbc

app = Flask(__name__)

# Khóa bí mật dùng để mã hóa session
app.secret_key = 'cogniflow_super_secret_key_2026'

# Đăng ký Blueprint cho phân hệ đăng nhập và quản lý tài khoản
app.register_blueprint(dangnhap_bp)
app.register_blueprint(qltaikhoan_bp)
app.register_blueprint(trangchu_bp)
app.register_blueprint(phanquyen_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(chu_de_bp)
app.register_blueprint(bo_loc_bp)
app.register_blueprint(quan_ly_cau_hoi_bp)
@app.route('/')
def index():
    """
    Trang gốc: Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ tương ứng.
    Nếu chưa, chuyển hướng đến trang đăng nhập.
    """
    if 'user' in session:
        return redirect(url_for('dangnhap.trang_chu_theo_vai_tro'))
    return redirect(url_for('dangnhap.dang_nhap'))

@app.route('/api/cap-nhat-tai-khoan', methods=['POST'])
def cap_nhat_tai_khoan():
    # Kiểm tra xem người dùng đã đăng nhập chưa
    if 'user' not in session:
        return jsonify({"success": False, "message": "Chưa đăng nhập!"}), 401

    data = request.json
    username = session['user'] # Lấy username hiện tại từ session
    
    display_name = data.get('displayName')
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    try:
        # Kết nối SQL Server (Nhớ thay thế thông tin cấu hình kết nối thực tế của bạn)
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=...;DATABASE=...;UID=...;PWD=...')
        cursor = conn.cursor()

        # Nếu người dùng muốn đổi mật khẩu
        if old_password and new_password:
            # Kiểm tra mật khẩu cũ trong bảng DM_Nguoi_Dung
            cursor.execute("SELECT UserPassword FROM DM_Nguoi_Dung WHERE Username = ?", (username,))
            row = cursor.fetchone()
            
            if not row or row[0] != old_password:
                return jsonify({"success": False, "message": "Mật khẩu cũ không chính xác!"}), 400

            # Cập nhật thông tin kèm mật khẩu mới
            cursor.execute("""
                UPDATE DM_Nguoi_Dung 
                SET Userdisplayname = ?, UserPassword = ? 
                WHERE Username = ?
            """, (display_name, new_password, username))
        else:
            # Chỉ cập nhật tên hiển thị mà không đổi mật khẩu
            cursor.execute("""
                UPDATE DM_Nguoi_Dung 
                SET Userdisplayname = ? 
                WHERE Username = ?
            """, (display_name, username))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Cập nhật tài khoản thành công!"})

    except Exception as e:
        return jsonify({"success": False, "message": f"Lỗi hệ thống: {str(e)}"}), 500


if __name__ == '__main__':
    # Chạy ứng dụng Flask ở chế độ Debug trên cổng 5000
    app.run(debug=True, port=5000)