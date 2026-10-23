import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import { loadProfile } from '../utils/profileStore';
import FallbackSpinner from './FallbackSpinner';
import '../css/about.css';

function About(props) {
  const { header } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    loadProfile(endpoints.about)
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <>
      <Header title={header} />
      <div className="section-content-container">
        {data ? (
          <Fade triggerOnce>
            <div className="bento">
              <div className="tile about-bio-tile span-4 rspan-2">
                <ReactMarkdown>{data.about}</ReactMarkdown>
              </div>
              {data?.imageSource && (
                <div className="tile about-image-tile span-2 rspan-2">
                  <img src={data.imageSource} alt="profile" />
                </div>
              )}
            </div>
          </Fade>
        ) : <FallbackSpinner />}
      </div>
    </>
  );
}

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
