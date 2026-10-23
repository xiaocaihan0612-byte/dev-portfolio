import React, { useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import endpoints from '../constants/endpoints';
import { loadProfile, saveProfile } from '../utils/profileStore';
import Header from './Header';
import FallbackSpinner from './FallbackSpinner';
import PasswordModal from './PasswordModal';
import TimelineEditor from './TimelineEditor';
import '../css/timeline.css';
import '../css/inline-edit.css';

const FIELDS = [
  { key: 'title', label: '时间', type: 'text' },
  { key: 'cardTitle', label: '学历 / 标题', type: 'text' },
  { key: 'cardSubtitle', label: '学校 / 副标题', type: 'text' },
  { key: 'cardDetailedText', label: '补充说明', type: 'textarea' },
];

function Education(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [editing, setEditing] = useState(false);

  const reload = () => {
    loadProfile(endpoints.education)
      .then((res) => setData(res))
      .catch((err) => err);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleSave = (items) => {
    saveProfile(endpoints.education, { education: items });
    setData({ education: items });
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
              items={data.education || []}
              fields={FIELDS}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <Fade triggerOnce>
              <div className="tl tl--education">
                {data.education?.map((item) => (
                  <div className="tl-item" key={item.cardTitle + item.title}>
                    <div className="tl-node--icon">
                      {item.icon && (
                        <img src={item.icon.src} alt={item.icon.alt} />
                      )}
                    </div>
                    <div className="tl-card">
                      <div className="tl-date">{item.title}</div>
                      <h3 className="tl-title">{item.cardTitle}</h3>
                      <div className="tl-subtitle">
                        <span className="accent">{item.cardSubtitle}</span>
                      </div>
                      {item.cardDetailedText && (
                        <div className="tl-detail">{item.cardDetailedText}</div>
                      )}
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

Education.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Education;
