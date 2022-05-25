import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {

  const [videoModalActive, setVideomodalactive] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  }   

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm center-screen ">
        <div className={innerClasses}>
          <div className="hero-content  ">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              WhatsApp bot for <span className="text-color-primary">VPL</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                Introducing first ever WhatsApp bot for Vancouver Public Library.
                </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                <ButtonGroup className="space-between">
                    <a href="https://wa.me/14379937017?text=start">
                      <Image
                        src={require('./../../assets/images/ctwa.png')}
                        width={189}/>
                    </a>
                    <a href="https://wa.me/14379937017?text=start">
                      <Image
                        src={require('./../../assets/images/appstore.png')}
                        width={200}/>
                    </a>
                    <a href="https://wa.me/14379937017?text=start">
                      <Image
                        src={require('./../../assets/images/googleplay.png')}
                        width={223}/>
                    </a>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;