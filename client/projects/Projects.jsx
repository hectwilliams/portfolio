import React from 'react';
import Banner from '../shared-components/Banner/banner';
import projectCss from './Projects.css'

export default class Projects extends React.Component {

  constructor(props) {
    super(props);
    this.setImage = this.setImage.bind(this);
    this.state = {}
  }

  setImage(event) {
    let styleOfTarget = event.currentTarget.parentElement.lastElementChild.style;
    let file;

    if (styleOfTarget) {

      file = {
        0: 'icon-fullstack.png',
        1: 'icon-embedded.png',
        2: 'icon-code.png',
        3: 'icon-project.jpg'
      }[event.currentTarget.dataset.id]

      if (file) {
        styleOfTarget.backgroundImage = `url('http://localhost:3001/assets/images/${file}')`;
      }
    }

  }

  render() {
    return (
      <div>
        <Banner name={'Projects'} />
        <div className={projectCss.container}>
          {
            // {/* Quadrants  */}
            Array.apply(null, Array(4)).map((ret, index) => (
              <button data-id={index} onClick={this.setImage}>
                <div > </div> {/*  dummy div*/}
              </button>
            ))
          }

          {/* middle selector  */}
          <button >  </button>

        </div>

      </div >
    );
  }
}