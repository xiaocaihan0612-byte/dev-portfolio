import React, { useState } from 'react';

// 就地编辑「教育经历 / 工作经历」这类「数组 + 对象」结构的通用表单。
// items   完整的数据数组（含 icon 等不被编辑的字段，编辑时会原样保留）
// fields  需要编辑的字段配置：[{ key, label, type }]
//         type: 'text' | 'textarea' | 'list'(字符串数组)
// onSave(items)   保存回调，参数为编辑后的完整数组
// onCancel()      取消回调
function TimelineEditor({ items, fields, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(items || [])));

  const updateField = (itemIndex, key, value) => {
    setDraft((prev) => prev.map((item, i) => (i === itemIndex ? { ...item, [key]: value } : item)));
  };

  const updateListItem = (itemIndex, key, listIndex, value) => {
    setDraft((prev) => prev.map((item, i) => {
      if (i !== itemIndex) return item;
      const list = item[key] ? [...item[key]] : [];
      list[listIndex] = value;
      return { ...item, [key]: list };
    }));
  };

  const addListItem = (itemIndex, key) => {
    setDraft((prev) => prev.map((item, i) => (
      i === itemIndex ? { ...item, [key]: [...(item[key] || []), ''] } : item
    )));
  };

  const removeListItem = (itemIndex, key, listIndex) => {
    setDraft((prev) => prev.map((item, i) => (
      i === itemIndex
        ? { ...item, [key]: (item[key] || []).filter((_, li) => li !== listIndex) }
        : item
    )));
  };

  const addItem = () => {
    const tpl = {};
    fields.forEach((f) => { tpl[f.key] = f.type === 'list' ? [''] : ''; });
    setDraft((prev) => [...prev, tpl]);
  };

  const removeItem = (itemIndex) => {
    setDraft((prev) => prev.filter((_, i) => i !== itemIndex));
  };

  return (
    <div className="ie">
      {draft.map((item, i) => (
        <div className="ie-item" key={i}>
          <div className="ie-item__head">
            <span>第 {i + 1} 项</span>
            <button type="button" className="ie-del" onClick={() => removeItem(i)}>删除此项</button>
          </div>
          {fields.map((f) => (
            <div className="ie-field" key={f.key}>
              <label className="ie-label">{f.label}</label>
              {f.type === 'list' ? (
                <div className="ie-list">
                  {(item[f.key] || []).map((val, li) => (
                    <div className="ie-list__row" key={li}>
                      <textarea
                        rows={2}
                        value={val}
                        onChange={(e) => updateListItem(i, f.key, li, e.target.value)}
                      />
                      <button
                        type="button"
                        className="ie-del"
                        onClick={() => removeListItem(i, f.key, li)}
                      >
                        删
                      </button>
                    </div>
                  ))}
                  <button type="button" className="ie-add" onClick={() => addListItem(i, f.key)}>
                    + 添加一条
                  </button>
                </div>
              ) : f.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={item[f.key] || ''}
                  onChange={(e) => updateField(i, f.key, e.target.value)}
                />
              ) : (
                <input
                  value={item[f.key] || ''}
                  onChange={(e) => updateField(i, f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button type="button" className="ie-add-item" onClick={addItem}>+ 添加一项</button>
      <div className="ie-actions">
        <button type="button" className="btn-pill btn-accent" onClick={() => onSave(draft)}>保存并生效</button>
        <button type="button" className="btn-pill btn-ghost" onClick={onCancel}>取消</button>
      </div>
    </div>
  );
}

export default TimelineEditor;
