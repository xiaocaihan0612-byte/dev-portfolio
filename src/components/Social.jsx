import React, { useEffect, useState, useContext } from 'react';
import { SocialIcon } from 'react-social-icons';
import { ThemeContext } from 'styled-components';
import endpoints from '../constants/endpoints';
import { loadProfile } from '../utils/profileStore';

const styles = {
  iconStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
};

// react-social-icons 没有内置电话图标，这里手绘一个同款圆形电话图标。
const PHONE_PATH =
  'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z';

function PhoneSocialIcon({ href, theme, label }) {
  return (
    <a
      href={href}
      aria-label={label || '联系电话'}
      title={label || '联系电话'}
      className="social-icon"
      style={{
        ...styles.iconStyle,
        display: 'inline-block',
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: theme.socialIconBgColor,
        position: 'relative',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{
          width: 25,
          height: 25,
          position: 'absolute',
          top: 12.5,
          left: 12.5,
        }}
        fill={theme.background}
      >
        <path d={PHONE_PATH} />
      </svg>
    </a>
  );
}

function Social() {
  const theme = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadProfile(endpoints.social)
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const copyText = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (label) {
      setToast(label);
      window.setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="social">
      {toast && (
        <span
          style={{
            alignSelf: 'center',
            marginLeft: 4,
            background: 'var(--accent)',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: 999,
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </span>
      )}
      {data ? data.social.map((social) => {
        if (social.network === 'phone') {
          return (
            <PhoneSocialIcon
              key={social.network}
              href={social.href}
              theme={theme}
              label={social.label}
            />
          );
        }
        // 打开链接 + 同时复制（邮箱：跳转 163 邮箱并复制收件人）
        if (social.copy && social.href) {
          return (
            <SocialIcon
              key={social.network}
              style={styles.iconStyle}
              url={social.href}
              network={social.network}
              bgColor={theme.socialIconBgColor}
              fgColor={theme.background}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label || social.network}
              title={social.label || social.network}
              onClick={() => copyText(social.copy, social.copyLabel)}
            />
          );
        }
        // 仅复制（微信）
        if (social.copy) {
          return (
            <SocialIcon
              key={social.network}
              style={{
                ...styles.iconStyle,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              as="button"
              network={social.network}
              bgColor={theme.socialIconBgColor}
              fgColor={theme.background}
              aria-label={social.label || social.network}
              title={social.label || social.network}
              onClick={() => copyText(social.copy, social.copyLabel)}
            />
          );
        }
        return (
          <SocialIcon
            key={social.network}
            style={styles.iconStyle}
            url={social.href}
            network={social.network}
            bgColor={theme.socialIconBgColor}
            fgColor={theme.background}
            target="_blank"
            rel="noopener"
          />
        );
      }) : null}
    </div>
  );
}

export default Social;
