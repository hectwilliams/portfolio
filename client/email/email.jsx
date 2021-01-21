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
      wrLock: false
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clickAnimalButton = this.clickAnimalButton.bind(this);
    this.submitNewUser = this.submitNewUser.bind(this);
    this.visibleClick = this.visibleClick.bind(this);
  }

  componentDidMount() {
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
        this.setState({ msgRecords: retArrayList[0] });
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
    console.log(event.currentTarget.classList);
  }

  submitNewUser(event) {
    event.preventDefault();

    let parentNode = (event.currentTarget.parentElement);
    let reqPath;
    let reqObject;
    let record = {};

    if (!parentNode) {
      return;
    }

    record = {
      user: parentNode.children[0].value,
      image: parentNode.children[2].children[2].src.indexOf('click-hand-icon') != -1 ? "https://static.thenounproject.com/png/409659-200.png" : parentNode.children[2].children[2].src,
      visible: parentNode.children[parentNode.children.length - 1].children[1].classList.contains(emailCss.colorButtonClass),
      msg: parentNode.children[1].value,
      date: new Date(Date.now()).toISOString().slice(0, 10)
    };

    reqObject = {
      method: 'PUT',
      mode: 'cors',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(record)
    };

    reqPath = '/addRecord';

    // fetch(new Request(window.location.href + reqPath), reqObject)
    //   .then(() => {
    //     this.setState({ wrLock: true })
    //   })
    //   .catch(err => { console.log(err.stack) })

    this.setState({ wrLock: true });

  }

  render() {
    return (
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

        {
          // this.state.wrLock ? <div className={emailCss.lockClass}> </div> :

          <form className={emailCss.input} data-lock={this.state.wrLock}>

            <input placeholder={'\t\tEnter username'} type='text' />

            <textarea wrap={'hard'} placeholder="Please message me. I love feedback." rows="4" cols="50" name="comment" form="usrform"></textarea>

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
        }


        <div className={emailCss.testimonialContainer}>
          {
            this.state.msgRecords.length == 0 ? '' :
              this.state.msgRecords.map((record) => (

                <div className={emailCss.testimonial}  >
                  <div>
                    <img src={this.state.imgURL == "" ? record[2] : this.state.imgURL} /> {/* image store */}
                    <span> {record[1].slice(0, 10)} </span> {/* date */}
                    <span> {`${record[0]}`} </span> {/* testimonial */}
                  </div>

                  <div>
                    <p>
                      {record[3]}
                    </p>
                  </div>
                </div>

              ))
          }
        </div>

      </div>
    )
  }
}
