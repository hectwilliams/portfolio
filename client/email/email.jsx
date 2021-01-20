import React from 'react';
import emailCss from './email.css';
import Banner from '../shared-components/Banner/banner';
import { EvalSourceMapDevToolPlugin } from 'webpack';

export default class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgRecords: [],
      animalRecords: [],

      imgURL: "",
      selectImageBase: "http://localhost:3001/assets/images/click-hand-icon.jpg"
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clickAnimalButton = this.clickAnimalButton.bind(this);
    this.submitNewUser = this.this.submitNewUser.bind(this);
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
        console.log(retArrayList[1])
        this.setState({ animalRecords: retArrayList[1] });
      });
  }

  openModal(event) {
    let targetNode = event.currentTarget.parentElement.parentElement.parentElement.firstChild;
    targetNode.style.display = "block";
  }

  closeModal(event) {
    let targetNode = event.currentTarget.parentElement;
    targetNode.style.display = "none";
  }

  clickAnimalButton(event) {
    // let targetNode = event.currentTarget.parentElement.parentElement.nextSibling.nextSibling./*form*/children[2]/* span node*/.children[2];
    this.setState({ selectImageBase: event.currentTarget.src });
  }

  submitNewUser(event) {
    event.preventDefault();

    let data = {
      user: "paul",
      animal: "",
      visible: "",
      msg: ""
    };

    let reqObject =
    {
      mode: 'cors',
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      path: 'addRecord',
      body: JSON.stringify(data)
    };

    let reqPath = '/addRecord';

    fetch(new Request(window.location.href + reqPath, reqObject), reqObject)

      .then(() => {

      })

      .catch(err => { console.log(err.stack) })

  }

  render() {
    return (
      <div >

        {/* modal  */}
        <div className={emailCss.modal} >

          {/* modal close  */}
          <span className={emailCss.modalClose} onClick={this.closeModal}> {'\u00D7'}  </span>

          {/* selection box window */}
          <div className={emailCss.modalSelectionWindow}>

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

        <form className={emailCss.input}>

          <input placeholder={'\t\tEnter username'} type='text' />

          <textarea placeholder="Please message me. I love feedback." rows="4" cols="50" name="comment" form="usrform"></textarea>

          <span>
            <label> select spirit animal </label> <br></br>
            <img src={this.state.selectImageBase} onClick={this.openModal}></img>
          </span>

          <input type="submit" value="submit" onClick={this.submitNewUser} />

          <select>
            <option value="test"> visible </option>
            <option value="test"> invisible </option>
          </select>

        </form>

        <div className={emailCss.testimonialContainer}>
          {
            this.state.msgRecords.length == 0 ? '' :
              this.state.msgRecords.map((record) => (

                <div className={emailCss.testimonial}  >
                  <div>
                    <img src={this.state.imgURL == "" ? "http://localhost:3001/assets/images/bg.jpg" : this.state.imgURL} /> {/* image store */}
                    <span> {record[1].slice(0, 10)} </span> {/* date */}
                    <span> {`User: ${record[0]}`} </span> {/* testimonial */}
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
