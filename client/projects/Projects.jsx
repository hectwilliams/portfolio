import React from 'react';
import Banner from '../shared-components/Banner/banner';
import projectCss from './Projects.css';


export default class Projects extends React.Component {

  constructor(props) {
    super(props);
    this.setImage = this.setImage.bind(this);
    this.state = {
      currMenu: "",
      menuMeta: {},
      numElementPerRow: 20
    }
    this.shiftLeft = this.shiftLeft.bind(this);
    this.shiftRight = this.shiftRight.bind(this);
  }

  setImage(event) {
    let styleOfTarget = event.currentTarget.parentElement.lastElementChild.style;
    let file;
    var regex;

    if (styleOfTarget) {
      file = {
        0: 'icon-fullstack.png',
        1: 'icon-embedded.png',
        2: 'icon-code.png',
        3: 'icon-project.jpg'
      }[event.currentTarget.dataset.id]

      regex = /(?<=-)\w+/.exec(file);

      this.setState({ currMenu: regex });

      if (file) {
        styleOfTarget.backgroundImage = `url('http://localhost:3001/assets/images/${file}')`;
      }
    }

    // Fetch size of mode
    fetch(`${window.location.href}/pickSize`, { method: 'GET' })
      .then((response) => {
        return response.json()
      })
      .then((retJson) => {
        this.setState({ menuMeta: retJson })
      })
      .catch(err => console.log(err.stack))
  }

  shiftLeft(event) {
    let arr = [];
    let parent = event.currentTarget.parentElement.firstElementChild;
    let windowLength = 5;
    let tmp;

    for (let i = 0; i < windowLength; i++) {
      tmp = parent.removeChild(parent.firstElementChild);
      console.log(tmp);
      arr.push(tmp);
    }

    for (let i = 0; i < windowLength; i++) {
      parent.appendChild(arr.shift());
    }

  }

  shiftRight(event) {
    let currNode;
    let parent = event.currentTarget.parentElement.firstElementChild;
    let windowLength = 5;
    let arr = [];

    currNode = parent.lastElementChild;

    for (let i = 0; i < windowLength; i++) {
      arr.unshift(parent.removeChild(parent.lastChild));
    }

    while (arr.length > 0) {
      parent.prepend(arr.pop());
    }
  }

  /* not an event */
  getImageFile(index) {
    let pos;

    if (this.state.currMenu == "") {
      return;
    }

    pos = index / 5;

    if (pos < this.state.menuMeta[this.state.currMenu]) {
      return `http://localhost:3001/assets/images/${this.state.currMenu}/${pos}.jpg`;
    }

    return `http://localhost:3001/assets/images/${this.state.currMenu}/null.png`;
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
                <div>  </div>  {/*  dummy div*/}
              </button>
            ))
          }
          {/* middle selector  */}
          <button >  </button>
        </div>

        <div className={projectCss.container2}>
          {
            !!this.state.menuMeta[this.state.currMenu] == false ? "" :   /*   this.state.menuMeta[this.state.currMenu] = length of elements to display    */

              Array.call(null, Array(Math.ceil(this.state.menuMeta[this.state.currMenu] / this.state.numElementPerRow))).map((notUsed, currRow) => (

                <div className={projectCss.slideContainer}>
                  <span> {/* selection slider */}
                    {
                      Array.apply(null, Array(100)).map((ele, index) => (
                        <span >
                          { (index % 5 == 0) ? <img src={this.getImageFile(currRow * this.state.numElementPerRow + (5 /* 5 = contigious span window length*/ * index))} className={projectCss.movieBox} /> : ""}
                        </span>
                      ))
                    }
                  </span>
                  <button onClick={this.shiftRight}  > {'>'} </button>
                  <button onClick={this.shiftLeft} > {'<'} </button>
                </div>
              ))
          }
        </div>
      </div >
    );
  }
}