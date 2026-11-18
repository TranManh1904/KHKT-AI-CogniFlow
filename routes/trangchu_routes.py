from flask import Blueprint, render_template, session, redirect, url_for

trangchu_bp = Blueprint('trangchu', __name__, template_folder='../templates')

@trangchu_bp.route('/trang-chu')
def trang_chu():
    if 'user' not in session:
        return redirect(url_for('dangnhap.dang_nhap'))
    
    return render_template(
        'trangchu/index.html', 
        role=session.get('role'), 
        id_vai_tro=session.get('ma_vai_tro')
    )