import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';
import endpoints from '../constants/endpoints';
import { loadProfile } from '../utils/profileStore';
import Social from './Social';
import FallbackSpinner from './FallbackSpinner';
import '../css/home.css';

function initialsOf(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadProfile(endpoints.home)
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return data ? (
    <Fade triggerOnce className="home-fade-container">
      <section className="hero">
        <div className="bento">
          <div className="tile hero-intro span-4 rspan-2">
            {data?.status && (
              <span className="hero-eyebrow">{data.status}</span>
            )}
            <h1 className="hero-name">{data?.name}</h1>
            <div className="hero-roles">
              <span>我是&nbsp;</span>
              <Typewriter
                options={{
                  loop: true,
                  autoStart: true,
                  strings: data?.roles,
                }}
              />
            </div>
            {data?.tagline && <p className="hero-tagline">{data.tagline}</p>}
            <div className="hero-cta">
              <Link className="btn-pill btn-accent" to="/projects">
                查看我的作品
              </Link>
              <Link className="btn-pill btn-ghost" to="/about">
                关于我
              </Link>
            </div>
          </div>

          <div className="tile tile--accent monogram span-2">
            <span className="monogram-mark">{initialsOf(data?.name)}</span>
            <span className="monogram-label">{data?.name}</span>
          </div>

          <div className="tile hero-social span-2">
            <span className="tile-label">找到我</span>
            <Social />
          </div>
        </div>
      </section>
    </Fade>
  ) : <FallbackSpinner />;
}

export default Home;
