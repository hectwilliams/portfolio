import React from 'react';
import Banner from '../shared-components/Banner/banner';
import projectCss from './Projects.css';


export default class Projects extends React.Component {

  constructor(props) {
    super(props);
    this.setImage = this.setImage.bind(this);
    this.state = {
      currMenu: "",
      menuMeta: {}
    }
    this.shiftLeft = this.shiftLeft.bind(this);
    this.shiftRight = this.shiftRight.bind(this);
    this.colorMe = this.colorMe.bind(this);
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
    let currNode, swappedNode;
    let NumOfSwappedNodes = 99;
    let parent = event.currentTarget.parentElement.firstChild;
    let windowLength = 5;

    console.log(parent.firstChild);

    for (let i = 0; i < windowLength; i++) {
      arr.push(parent.removeChild(parent.firstChild));
    }

    for (let i = 0; i < windowLength; i++) {
      parent.appendChild(arr.shift());
    }
  }

  shiftRight(event) {
    let currNode, swappedNode, prevNode;
    let NumOfSwappedNodes = 100;
    let parent = event.currentTarget.parentElement.firstChild;
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

  colorMe(event) {
    let currNode = event.currentTarget.parentElement.children[2].firstChild.firstChild;
    let genRandomColor = () => {
      let arr = [];

      for (let i = 0; i < 3; i++) {
        arr.push(Math.floor(Math.random() * 256));
      }
      return `rgb( ${arr.toString()})`;
    }

    for (let i = 0; i < 100; i++) {
      currNode.children[i].style.backgroundColor = genRandomColor();
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
                <div  >  </div>  {/*  dummy div*/}
              </button>
            ))
          }
          {/* middle selector  */}
          <button >  </button>
        </div>

        <div className={projectCss.container2}>

          <div className={projectCss.slideContainer}>
            <span>
              {
                Array.apply(null, Array(100)).map((ele, index) => (
                  this.state.currMenu == "" ? "" : <span >
                    {
                      (index % 5 == 0) ?
                        <img
                          src={`http://localhost:3001/assets/images/${this.state.currMenu}/${((index / 5) < this.state.menuMeta[this.state.currMenu]) ? (index / 5) + '.jpg' : 'null.png'}`}
                          data-index={index}
                          className={(index % 5 == 0) ? projectCss.movieBox : ""}
                        />
                        : ""
                    }
                  </span>
                ))
              }
            </span>

            <button onClick={this.shiftRight}  > {'>'} </button>
            <button onClick={this.shiftLeft} > {'<'} </button>
          </div>


        </div>


      </div >
    );
  }
}