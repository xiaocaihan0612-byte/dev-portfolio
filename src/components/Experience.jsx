import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import { loadProfile, saveProfile } from '../utils/profileStore';
import FallbackSpinner from './FallbackSpinner';
import PasswordModal from './PasswordModal';
import TimelineEditor from './TimelineEditor';
import '../css/timeline.css';
import '../css/inline-edit.css';

const FIELDS = [
  { key: 'title', label: '职位', type: 'text' },
  { key: 'subtitle', label: '公司 / 单位', type: 'text' },
  { key: 'workType', label: '工作类型', type: 'text' },
  { key: 'workDescription', label: '工作内容（每条一行）', type: 'list' },
  { key: 'dateText', label: '时间', type: 'text' },
];

function Experience(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [editing, setEditing] = useState(false);

  const reload = () => {
    loadProfile(endpoints.experiences)
      .then((res) => setData(res.experiences))
      .catch((err) => err);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleSave = (items) => {
    saveProfile(endpoints.experiences, { experiences: items });
    setData(items);
    setEditing(false);
  };

  return (
    <>
      <div className="section-head">
        <Header title={header} />
        <button type="button" className="btn-edit" onClick={() => setShowPwd(true)}>
          编辑
        </button>
      </div>
      {data ? (
        <div className="section-content-container">
          {editing ? (
            <TimelineEditor
              items={data}
              fields={FIELDS}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <Fade triggerOnce>
              <div className="tl tl--experience">
                {data.map((item) => (
                  <div className="tl-item" key={item.title + item.dateText}>
                    <div className="tl-node--dot" />
                    <div className="tl-card">
                      <div className="tl-date">{item.dateText}</div>
                      <h3 className="tl-title">{item.title}</h3>
                      <div className="tl-subtitle">
                        <span className="accent">{item.subtitle}</span>
                        {item.workType ? ` · ${item.workType}` : ''}
                      </div>
                      <ul className="tl-list">
                        {item.workDescription.map((point) => (
                          <li key={point}>
                            <ReactMarkdown components={{ p: 'span' }}>
                              {point}
                            </ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </Fade>
          )}
        </div>
      ) : <FallbackSpinner />}
      {showPwd && (
        <PasswordModal
          onSuccess={() => { setShowPwd(false); setEditing(true); }}
          onCancel={() => setShowPwd(false)}
        />
      )}
    </>
  );
}

Experience.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Experience;
