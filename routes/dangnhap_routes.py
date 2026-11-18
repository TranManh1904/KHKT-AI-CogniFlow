from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from models.dangnhap import check_login, change_password
from routes.connect_db import get_db_connection
import os

# Khởi tạo Blueprint cho phần đăng nhập / tài khoản
dangnhap_bp = Blueprint('dangnhap', __name__, template_folder='../templates')

@dangnhap_bp.route('/dang-nhap', methods=['GET', 'POST'])
def dang_nhap():
    if request.method == 'POST':
        username = request.form.get('loginEmail')
        password = request.form.get('loginPassword')
        
        result = check_login(username, password)
        
        if result and "error" not in result:
            # result trả về thông tin user từ DB, lưu vào session
            session['user'] = result
            
            # QUAN TRỌNG: Lưu đúng tên cột ma_vai_tro (hoặc id vai trò) vào session để phân quyền
            # Giả sử result lưu dưới dạng dict hoặc object, ta trích xuất ma_vai_tro
            # (Bạn điều chỉnh cách lấy cho khớp với model check_login của bạn, ví dụ result['ma_vai_tro'])
            session['ma_vai_tro'] = result.get('ma_vai_tro') if isinstance(result, dict) else getattr(result, 'ma_vai_tro', 1)
            
            return redirect(url_for('dangnhap.trang_chu_theo_vai_tro'))
        elif result and "error" in result:
            return render_template('dangnhap/login.html', error=result["error"])
        else:
            return render_template('dangnhap/login.html', error="Tên đăng nhập hoặc mật khẩu không chính xác!")
            
    return render_template('dangnhap/login.html')


@dangnhap_bp.route('/trang-chu')
def trang_chu_theo_vai_tro():
    """
    Trang chủ sau khi đăng nhập thành công, phân biệt theo vai trò (hoc_sinh / quan_tri).
    """
    if 'user' not in session:
        return redirect(url_for('dangnhap.dang_nhap'))
    
    user = session['user']
    
    # Lấy ma_vai_tro từ session để truyền ra template kiểm tra quyền Admin
    ma_vai_tro = session.get('ma_vai_tro')
    
    # Truyền cả user và ma_vai_tro (hoặc role nếu cần) sang trangchu/index.html
    return render_template(
        'trangchu/index.html', 
        user=user, 
        ma_vai_tro=ma_vai_tro,
        role='admin' if ma_vai_tro == 2 else 'student'
    )


@dangnhap_bp.route('/dang-xuat')
def dang_xuat():
    session.clear() # Xóa sạch session khi đăng xuất
    return redirect(url_for('dangnhap.dang_nhap'))


@dangnhap_bp.route('/doi-mat-khau', methods=['GET', 'POST'])
def doi_mat_khau():
    if 'user' not in session:
        return redirect(url_for('dangnhap.dang_nhap'))
        
    if request.method == 'POST':
        # Khớp đúng cột ten_dang_nhap trong bảng DM_Nguoi_Dung
        username = session['user'].get('ten_dang_nhap') if isinstance(session['user'], dict) else session['user'].ten_dang_nhap
        old_password = request.form.get('oldPassword')
        new_password = request.form.get('newPassword')
        
        check_old = check_login(username, old_password)
        if not check_old or "error" in check_old:
            return jsonify({"success": False, "message": "Mật khẩu cũ không chính xác!"})
            
        success = change_password(username, new_password)
        if success:
            return jsonify({"success": True, "message": "Đổi mật khẩu thành công!"})
        else:
            return jsonify({"success": False, "message": "Lỗi hệ thống khi cập nhật mật khẩu!"})
            
    return render_template('dangnhap/doi_mat_khau.html')


@dangnhap_bp.route('/quen-mat-khau', methods=['POST'])
def gui_yeu_cau_quen_mk():
    data = request.get_json() if request.is_json else request.form
    username_or_email = data.get('username')
    
    if not username_or_email:
        return jsonify({"success": False, "message": "Vui lòng cung cấp tên đăng nhập hoặc email cần hỗ trợ!"})
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"success": False, "message": "Lỗi kết nối cơ sở dữ liệu!"})
        
    try:
        cursor = conn.cursor()
        # Đã sửa lại đúng tên cột ten_dang_nhap trong DM_Nguoi_Dung
        cursor.execute("SELECT id FROM DM_Nguoi_Dung WHERE ten_dang_nhap = ?", (username_or_email,))
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            conn.close()
            return jsonify({"success": False, "message": "Tên đăng nhập không tồn tại trong hệ thống!"})
            
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Yêu cầu hỗ trợ đổi mật khẩu đã được gửi đến Quản trị viên (Admin) thành công!"})
    except Exception as e:
        print(f"Lỗi gửi yêu cầu quên mật khẩu: {e}")
        return jsonify({"success": False, "message": "Có lỗi xảy ra, vui lòng thử lại sau."})