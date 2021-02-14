import React, { createElement } from 'react';
import Banner from '../shared-components/Banner/banner';
import projectCss from './Projects.css';


export default class Projects extends React.Component {

  constructor(props) {
    super(props);
    this.setImage = this.setImage.bind(this);
    this.state = {
      currMode: "",
      storage: {},
      numElementPerRow: 20,
      rcvd: false,
      nodeId: -1,
      pageState: []
    }
    this.shiftLeft = this.shiftLeft.bind(this);
    this.shiftRight = this.shiftRight.bind(this);
    this.showMe = this.showMe.bind(this);
    this.hideMe = this.hideMe.bind(this);
    this.showModal = this.showModal.bind(this);

  }

  setImage(event) {
    let styleOfTarget = event.currentTarget.parentElement.lastElementChild.style;
    let file;
    var regex;

    if (styleOfTarget) {
      file = {
        0: 'icon-full_stack.png',
        1: 'icon-embedded.png',
        2: 'icon-code.png',
        3: 'icon-special_projects.jpg'
      }[event.currentTarget.dataset.id]

      regex = /(?<=-)\w+/.exec(file);

      this.setState({ currMode: regex[0] });

      if (file) {
        styleOfTarget.backgroundImage = `url('http://localhost:3001/assets/images/${file}')`;
      }
    }

    // fetch server once 
    if (!this.state.rcvd) {
      fetch(`${window.location.href}/selectTable`, { method: 'GET' })
        .then((response) => {
          return response.json()
        })
        .then((retJson) => {
          return this.setState({ storage: retJson })
        })
        .then(() => {
          this.setState({ rcvd: true });
        })
        .catch(err => {  /* console.log(err.stack) */ })
    }
  }

  shiftLeft(event) {
    let arr = [];
    let windowLength = 5;
    let parent = event.currentTarget.parentElement.firstElementChild;

    for (let i = 0; i < windowLength; i++) {
      arr.push(parent.removeChild(parent.firstElementChild));
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
  getImageFile(row, col) {
    let pos;

    if (this.state.currMode == "") {
      return;
    }

    pos = row + col;

    if (pos < this.state.storage[this.state.currMode].fileCount) {
      return `http://localhost:3001/assets/images/${this.state.currMode}/${pos}.jpg`;
    }

    return `http://localhost:3001/assets/images/${this.state.currMode}/null.png`;
  }

  /* not event  */
  getFile(index) {
    let obj = this.state.storage[this.state.currMode];

    if (index >= obj.fileCount) {
      return "";
    }
    return obj.files[index].name;
  }

  showMe(event) {
    let text = event.currentTarget.firstElementChild.firstElementChild.innerText;
    if (text.length != 0) {
      event.currentTarget.children[1].innerText = text;
      event.currentTarget.children[1].style.opacity = 1;
    }
  }

  hideMe(event) {
    event.currentTarget.children[1].innerText = "";
    event.currentTarget.children[1].style.opacity = 0;
  }

  showModal(event) {
    let node = document.getElementsByClassName(projectCss.modal)[0];
    let activeNode = (event.currentTarget.parentElement);
    let currID = 0;
    let modalPage = event.currentTarget.firstElementChild.firstElementChild.innerHTML.trim();
    let tableid;

    tableid = {
      code: 2,
      embedded: 1,
      full_stack: 0,
      special_projects: 3
    }[this.state.currMode];

    if (!tableid) {
      return;
    }

    fetch(`${window.location.href}/fieldEquals_${modalPage + '-' + this.state.currMode}`, { method: 'GET' })
      .then((response) => {
        return response.json()
      })
      .then((data) => {

        this.setState({ pageState: data })

        for (let i = 0; activeNode != activeNode.parentElement.children[i]; i++) {
          currID++;
        }
        this.setState({ nodeId: Math.floor(currID / 5) });
        node.style.visibility = "visible";
      })
      .catch((err) => {
        console.log(err);
      })
  }

  numOfLines(str) {
    let regx = str.match(/\n/g);

    if (regx) {
      return regx.length + 2;
    }
    return 0;
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
            (!this.state.rcvd) ? "" :

              (!!this.state.storage[this.state.currMode].fileCount == false) ? "" :

                Array.call(null, Array(Math.ceil(this.state.storage[this.state.currMode].fileCount / this.state.numElementPerRow))).map((notUsed, currRow) => (

                  <div className={projectCss.slideContainer}>
                    <span> {/* selection slider */}
                      {
                        Array.apply(null, Array(100)).map((ele, index) => (
                          <span >
                            { (index % 5 != 0) ? "" :
                              <button onClick={this.showModal} onMouseEnter={this.showMe} onMouseLeave={this.hideMe} >
                                <div className={projectCss.card}>
                                  <label> {this.getFile(currRow * this.state.numElementPerRow + Math.ceil((index / 100) * 20), this)} </label>
                                </div>

                                <label className={projectCss.showLabel}>  </label>
                              </button>
                            }
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

        {
          (!this.state.rcvd) ? "" :
            <div className={projectCss.modal}>

              <div>
                <span
                  onClick={(e) => {
                    e.currentTarget.parentElement.parentElement.style.visibility = "hidden";
                    this.setState({ nodeId: -1 });
                  }}
                > &times;
                </span>

                <span onClick={(e) => {

                  if (e.currentTarget.parentElement.parentElement.style.width != "99.5%") {
                    // change size 
                    e.currentTarget.parentElement.parentElement.style.width = "99.5%";
                    // update icon
                    e.currentTarget.innerHTML = '\u25A3';
                  }

                  else if (e.currentTarget.parentElement.parentElement.style.width == "99.5%") {
                    // change size 
                    e.currentTarget.parentElement.parentElement.style.width = "50%";
                    // update icon
                    e.currentTarget.innerHTML = '\u25A2';
                  }

                }}
                > &#x25A2; </span>
              </div>

              {
                (this.state.nodeId == -1) ? "" :
                  <div>
                    <h2 className={projectCss.ptitle}> {this.state.storage[this.state.currMode].files[this.state.nodeId].name}</h2>
                    <hr></hr>
                    <p> {this.state.storage[this.state.currMode].files[this.state.nodeId].description}</p>
                    <hr></hr>
                    {
                      this.state.pageState.map((arrElement) => (
                        <div>
                          {
                            arrElement[0].match(/image/) ? <img src={arrElement[1]} /> :
                              arrElement[0].match(/text/) ? <p> {arrElement[1]} </p> :
                                arrElement[0].match(/code/) ? <textarea cols={100} rows={this.numOfLines(arrElement[1])} value={arrElement[1]} spellCheck={false} readOnly>   </textarea> : ""
                          }
                        </div>
                      ))
                    }

                  </div>
              }
            </div>

        }



      </div >
    );
  }
}

let simulateServerData = [
  ["code", `#include <stdio.h>
  int main()
  {
  printf("hello world")
  }`],
  ["code", `#include <stdio.h>
  int main()
  {
  printf("hello world")
  }`],

  ["code", `#include <stdio.h>
  int main()
  {
  printf("hello world")
  }`],

  ["text", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi magni ipsa assumenda temporibus facere voluptatum cupiditate ut repellendus repudiandae, saepe reprehenderit quis debitis numquam dignissimos, dolorem incidunt, ducimus ex. Earum."],
  ["img", "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque odio eum eos, cum similique quo enim, obcaecati, officiis veniam tenetur quaerat quis culpa molestiae sunt blanditiis nihil vel adipisci deserunt."],
  ["img", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro reiciendis praesentium sequi? Debitis nostrum nesciunt corrupti nobis quos autem, explicabo necessitatibus illo, itaque blanditiis, error libero fuga atque fugit et."],

  ["code", `#include <stdio.h>
  int main()
  {
  printf("hello world")
  }`],
  ["code", `#include <stdio.h>
  int main()
  {
  printf("hello world")
  }`],
  ["code", `#include <stdio.h>
  int main()
  {
  printf("hello world")
  }`],
  ["text", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi magni ipsa assumenda temporibus facere voluptatum cupiditate ut repellendus repudiandae, saepe reprehenderit quis debitis numquam dignissimos, dolorem incidunt, ducimus ex. Earum."],
  ["img", "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque odio eum eos, cum similique quo enim, obcaecati, officiis veniam tenetur quaerat quis culpa molestiae sunt blanditiis nihil vel adipisci deserunt."],
  ["img", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro reiciendis praesentium sequi? Debitis nostrum nesciunt corrupti nobis quos autem, explicabo necessitatibus illo, itaque blanditiis, error libero fuga atque fugit et."],


  ["code", `#include <stdio.h>
  int main()
  {
  printf("hello world")
  }`],

];