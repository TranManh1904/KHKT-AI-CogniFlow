from flask import Blueprint, render_template, request, jsonify, session
from models.phanquyen_model import lay_danh_sach_vai_tro, lay_danh_sach_chuc_nang

phanquyen_bp = Blueprint('phanquyen', __name__, template_folder='../templates')

def kiem_tra_admin():
    user = session.get('user')
    if not user: return False
    ma_vai_tro = user.get('ma_vai_tro') if isinstance(user, dict) else getattr(user, 'ma_vai_tro', None)
    return ma_vai_tro == 'quan_tri' or ma_vai_tro == 2 or str(ma_vai_tro) == '2'

@phanquyen_bp.route('/admin/phan-quyen', methods=['GET'])
def trang_phan_quyen():
    if not kiem_tra_admin():
        return "Bạn không có quyền truy cập!", 403
    
    vai_tro_list = lay_danh_sach_vai_tro()
    chuc_nang_list = lay_danh_sach_chuc_nang()
    
    return render_template('admin/phan_quyen.html', vai_tro_list=vai_tro_list, chuc_nang_list=chuc_nang_list)

@phanquyen_bp.route('/api/admin/phan-quyen/luu', methods=['POST'])
def api_luu_phan_quyen():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    
    data = request.json
    # Xử lý lưu ma trận phân quyền vào CSDL ở đây
    return jsonify({"success": True, "message": "Cập nhật phân quyền thành công!"})