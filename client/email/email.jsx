import React from 'react';
import emailCss from './email.css';
import Banner from '../shared-components/Banner/banner';

export default class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgRecords: [],
      animalRecords: [],
      imgURL: "",
      selectImageBase: "http://localhost:3001/assets/images/click-hand-icon.jpg",
      wrLock: false,
      authentication: false,
      genNumber: ""
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clickAnimalButton = this.clickAnimalButton.bind(this);
    this.submitNewUser = this.submitNewUser.bind(this);
    this.visibleClick = this.visibleClick.bind(this);
    this.srcollHeightCheck = this.srcollHeightCheck.bind(this);
    this.expandTestimonial = this.expandTestimonial.bind(this);
    this.sortUserName = this.sortUserName.bind(this);
    this.sortDate = this.sortDate.bind(this);
    this.sortAttrHelper = this.sortAttrHelper.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.getRecords = this.getRecords.bind(this);
  }

  componentDidMount() {
    this.generateBasicNumber()
      .then(() => {
        this.getRecords();
      })
  }

  generateBasicNumber() {
    let randomInteger;
    let min = 1;
    let max = 10000;
    randomInteger = Math.floor(Math.random() * (max - min) + min);
    this.setState({ genNumber: randomInteger })
    return Promise.resolve();
  }

  getRecords() {

    let reqObject =
    {
      mode: 'cors',
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' })
    };
    let reqPathNames = ['/userMessages', '/spiritAnimals'];
    let promiseArray = [];
    let myRequest;

    for (let i = 0; i < reqPathNames.length; i++) {

      let newArray = [];
      myRequest = new Request(window.location.href + reqPathNames[i], reqObject);

      promiseArray.push( // load async fetch into promise array 
        new Promise((resolve, reject) => {
          fetch(myRequest)
            .then((resp) => {
              return resp.json();
            })
            .then((retJSON) => {
              for (let retRecord of retJSON) {
                newArray.push(retRecord);
              }
              resolve(newArray);
            })
            .catch(err => reject(err))
        })
      );
    }

    Promise.all(promiseArray)
      .then((retArrayList) => {
        this.setState({ msgRecords: retArrayList[0].concat([["", "", "", ""]])   /*dummy load*/ });
        console.log(retArrayList)
        this.setState({ animalRecords: retArrayList[1] });
      });
  }

  handlerEscEvent(event) {

    if (event.key === "Escape") {
      // hide modal 
      document.getElementsByClassName(emailCss.modal)[0].style.display = 'none';
      // remove 'keydown' event listener 
      window.document.removeEventListener('keydown', this.handlerEscEvent);
    }
  }

  openModal(event) {
    let modalParentNode = event.currentTarget.parentElement.parentElement.parentElement.firstChild;
    modalParentNode.style.display = "block";
    // add 'keydown' event listener to modal
    window.document.addEventListener('keydown', this.handlerEscEvent);
  }

  closeModal(event) {
    let targetNode = event.currentTarget.parentElement;
    targetNode.style.display = "none";
  }

  clickModal(event) {
    if (event.target.dataset.title == "modal") {
      event.target.style.display = 'none';
    }
  }

  clickAnimalButton(event) {
    this.setState({ selectImageBase: event.currentTarget.src });
  }

  visibleClick(event) {
    event.preventDefault();
    event.currentTarget.classList.toggle(emailCss.colorButtonClass);
  }

  parseCollectionOfRecords() {
    let testimonialNodeList
    let currElement;
    let id;
    let key;
    let lineCount;

    let callback = () => {
      clearInterval(id);
      testimonialNodeList = document.getElementsByClassName(emailCss.testimonial);
      if (testimonialNodeList.length != 0) {
        for (let i = 0; i < testimonialNodeList.length; i++) {
          key = i.toString();
          currElement = testimonialNodeList[key];

          if (currElement.children) {
            if (currElement.children[1].children[1].style.visibility == "visible") {
              currElement.children[1].children[1].style.visibility = "hidden";
            }
          }

          lineCount = currElement.children[1].firstChild.value.split('\n').length + 2;

          // active compress button
          if (lineCount > 3) {
            currElement.children[1].children[1].style.visibility = "visible";
            currElement.children[1].children[0].dataset.cache = lineCount;
          }
        }
      }

      else {
        id = setTimeout(callback, 0);
      }
    }

    id = setTimeout(callback, 0);
  }

  submitNewUser(event) {
    let parentNode;
    let record;
    let reqObject;
    let reqPath;

    event.preventDefault();

    parentNode = (event.currentTarget.parentElement);
    if (!parentNode) {
      return;
    }

    record = [
      parentNode.children[0].value,
      new Date(Date.now()).toISOString().slice(0, 10),
      parentNode.children[2].children[2].src.indexOf('click-hand-icon') != -1 ? "https://static.thenounproject.com/png/409659-200.png" : parentNode.children[2].children[2].src,
      parentNode.children[1].value,
    ]; //[username, date, image, message]

    // clear user input section 
    parentNode.children[0].value = "";
    parentNode.children[1].value = ""
    parentNode.children[2].children[2].src = "";

    reqObject = {
      method: 'PUT',
      mode: 'cors',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        user: record[0], // user 
        image: record[2], // imge link
        visible: parentNode.children[parentNode.children.length - 1].children[1].classList.contains(emailCss.colorButtonClass),
        msg: record[3], //comment 
        date: record[1], // date 
        id: record[4]
      })
    };

    reqPath = '/addRecord';

    // lock entry section if previous user or recently added to list 

    if (!this.state.wrLock) {
      //TODO disable section 
      fetch(new Request(window.location.href + reqPath), reqObject)
        .then(() => {
          this.setState({ wrLock: true })
        })
        .catch(err => { console.log(err.stack) })

      // append to list 
      this.state.msgRecords.pop(); // remove dummy  

      // appen node to list 
      this.setState({ msgRecords: this.state.msgRecords.concat([record]).concat([["", "", "", ""]]) }    /* add record and dummy load */)

      // lock entry section
      this.setState({ wrLock: true });
      // 

      this.parseCollectionOfRecords();
    }
  }

  srcollHeightCheck(event) {
    let lines = event.currentTarget.children[1].firstChild.value.split('\n').length + 2;
    event.currentTarget.children[1].firstChild.dataset.cache = lines;

    if (lines > 3) {
      event.currentTarget.children[1].children[1].style.visibility = "visible";
    }
    // let node = event.currentTarget.children[1].children[1];
    // const event = new MouseEvent('click', {
    //   view: window,
    //   bubbles: true,
    //   cancelable: true
    // });
    // node.dispatchEvent(event);
  }

  expandTestimonial(event) {
    event.currentTarget.parentElement.parentElement.classList.toggle(emailCss.compressTestimonial);
    for (let retSpan of event.currentTarget.children) {
      retSpan.classList.toggle(emailCss.expanderCompressOn);
    }

    let storedLine = parseInt(JSON.parse(event.currentTarget.previousElementSibling.dataset.cache));

    if (!event.currentTarget.previousElementSibling.hasOwnProperty("rows")) {
      event.currentTarget.previousElementSibling.style.resize = 'vertical';
      event.currentTarget.previousElementSibling.rows = storedLine + 2;
      event.currentTarget.previousElementSibling.style.resize = 'none';
    }
    else {
      event.currentTarget.previousElementSibling.style.resize = 'none';
      delete event.currentTarget.previousElementSibling.rows;
    }
  }

  sortUserName(event) {
    this.sortAttrHelper('/sortUser');
  }

  sortDate(event) {
    this.sortAttrHelper('/sortDate');
  }

  sortAttrHelper(pathName) {
    let array = [];
    fetch(new Request(window.location.href + pathName), { method: 'GET', headers: new Headers({ 'Content-Type': 'application/json' }) })
      .then((response) => {
        return response.json();
      })
      .then(retJsonData => {
        for (let retRecord of retJsonData) {
          array.push(retRecord);
        }
        // add dummy node
        array = array.concat([["", "", "", ""]]);
        // update state
        this.setState({ msgRecords: array });
        // parser 
        this.parseCollectionOfRecords();
      })
  }

  authenticateUser(event) {
    event.preventDefault();
    this.setState({ authentication: true });
  }

  render() {

    return (

      !this.state.authentication ?
        ( // authenticate user
          <div className={emailCss.auth}>
            <p > {`Random number. Useless element, but it looks cool`} </p>
            <span onMouseLeave={(event) => { event.currentTarget.previousElementSibling.style.visibility = "hidden" }} onMouseOver={(event) => { { event.currentTarget.previousElementSibling.style.visibility = "visible" } }} > i </span>
            <input value={this.state.genNumber} type={'text'} ></input>
            <button onClick={this.authenticateUser}> View Comments </button>
          </div>
        )
        :
        ( // authentication complete
          <div  >
            {/* modal  */}
            <div data-title={"modal"} className={emailCss.modal} onClick={this.clickModal}  >

              {/* modal close  */}
              <span className={emailCss.modalClose} onClick={this.closeModal} > {'\u00D7'}  </span>

              {/* selection box window */}
              <div className={emailCss.modalSelectionWindow} >

                {/* images list border */}
                {
                  this.state.animalRecords.length == 0 ? '' :
                    this.state.animalRecords.map((record) => (
                      <img alt={record[0]} src={record[1]} onClick={this.clickAnimalButton} />
                    ))
                }
              </div>
            </div>

            <Banner name={'Email'} />

            {/* user entry block */}
            <form className={emailCss.input} data-lock={this.state.wrLock}>

              <input placeholder={'\t\tEnter username'} type='text' />

              <textarea wrap={'hard'} placeholder="Please message me. I love feedback." name="comment" form="usrform"></textarea>

              <span>
                <label> select spirit animal </label>
                <br></br>
                <img src={this.state.selectImageBase} onClick={this.openModal}></img>
              </span>

              <input type="submit" value="submit" onClick={this.submitNewUser} />

              <div>
                <label> visible </label>
                <button className={emailCss.colorButtonClass} onClick={this.visibleClick} />
              </div>
            </form>


            <div className={emailCss.optionMenu}>
              <span>   </span>
              <div>
                <button onClick={this.sortUserName} onMouseOver={(event) => { event.currentTarget.parentElement.previousSibling.innerText = "sort names" }} onMouseOut={(event) => { event.currentTarget.parentElement.previousSibling.innerText = "" }} > </button>
                <button onClick={this.sortDate} onMouseOver={(event) => { event.currentTarget.parentElement.previousSibling.innerText = "sort date" }} onMouseOut={(event) => { event.currentTarget.parentElement.previousSibling.innerText = "" }} > </button>
              </div>
            </div>

            <div className={emailCss.testimonialContainer} >
              {
                this.state.msgRecords.length == 0 ? '' :

                  this.state.msgRecords.map((record) => (

                    <div className={`${emailCss.testimonial} ${emailCss.compressTestimonial}`} onLoad={this.srcollHeightCheck}  >
                      <div>
                        <img src={this.state.imgURL == "" ? record[2] : this.state.imgURL} /> {/* image store */}
                        <span> {record[1].slice(0, 10)} </span>                               {/* date */}
                        <span> {`${record[0]}`} </span>                                       {/* testimonial */}
                      </div>

                      <div  >
                        <textarea data-cache={null} readOnly value={record[3]}></textarea>
                        <button onClick={this.expandTestimonial}>
                          {
                            Array.apply(null, Array(3)).map(() => (
                              <span className={emailCss.expanderCompressOn}> {'\u2B24'} </span>
                            ))
                          }
                        </button>
                      </div>
                    </div>
                  ))

              }
            </div>

          </div >
        )
    )
  }
}

/*
send email when message added TODOemai
*/