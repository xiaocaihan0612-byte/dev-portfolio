import React, { useState } from 'react';
import { verifyPassword } from '../utils/profileStore';

// 编辑前弹出的密码验证框。密码正确才允许进入编辑模式。
function PasswordModal({ onSuccess, onCancel }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (verifyPassword(pwd)) {
      onSuccess();
    } else {
      setErr('密码错误，请重试');
    }
  };

  return (
    <div className="pm-overlay" onClick={onCancel}>
      <form className="pm-card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>请输入编辑密码</h3>
        <p className="pm-tip">此操作仅限简历主人本人。</p>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="编辑密码"
          autoFocus
        />
        {err && <div className="pm-error">{err}</div>}
        <div className="pm-actions">
          <button type="submit" className="btn-pill btn-accent">确认</button>
          <button type="button" className="btn-pill btn-ghost" onClick={onCancel}>取消</button>
        </div>
      </form>
    </div>
  );
}

export default PasswordModal;
