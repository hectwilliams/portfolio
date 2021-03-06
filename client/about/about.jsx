import React from 'react';
import aboutCss from './about.css';
import Banner from '../shared-components/Banner/banner';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [],
      yearlyStatusData: {},
      msgIndex: 0,
      ref: null
    }
    this.updateYear = this.updateYear.bind(this);
    this.showMsg = this.showMsg.bind(this);
    this.getNextMsg = this.getNextMsg.bind(this);
    this.removeMsg = this.removeMsg.bind(this);
  }

  componentDidMount() {
    let newArray = {};
    let reqObject =
    {
      mode: 'cors',
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' })
    };
    let reqPathName = '/data';
    let myRequest = new Request(window.location.href + reqPathName, reqObject);

    fetch(myRequest)
      .then((resp) => {
        return resp.json();
      })
      .then((retJSON) => {
        for (let [year, msg] of retJSON) {
          if (!newArray.hasOwnProperty(year)) {
            newArray[year] = [];
          }
          newArray[year].push(msg);
        }
        this.setState({ yearlyStatusData: newArray });
      })
      .catch(err => console.log(err.stack))
  }

  componentWillUnmount() { }

  render() {
    return (

      <div >
        <Banner name={'About Me'} />

        <div className={aboutCss.container}>
          <div className={aboutCss.yearlyTestimonial} >
            <ul>
              {
                this.range(2020, 2025).map((element, index) => (
                  <li onClick={this.updateYear} data-name={element} className={aboutCss.selectYear} > {element} </li>
                ))
              }
            </ul>
          </div>
          <div data-currYear={this.state.collection.length} className={aboutCss.yearlyInfo}>
            {
              this.state.collection.length == 0 ? '' : this.state.collection.map((message) => (<p> {message} </p>))
            }
          </div>

          <buton onClick={this.getNextMsg} onMouseLeave={this.removeMsg} onMouseEnter={this.showMsg} className={aboutCss.quoteMe}>
            <span  > " </span>
          </buton>

          <div className={aboutCss.showMessage}>
            <label> NEWS! </label>
            <img src={"http://localhost:3001/assets/images/icon-newspaper.png"} />
            <p>
              {this.state.yearlyStatusData[0] == null ? '' : `${this.state.yearlyStatusData[0][this.state.msgIndex]}`}
            </p >
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </div>
    )
  }

  getNextMsg(event) {
    let arr = this.state.yearlyStatusData[0];
    if (arr) {
      if (this.state.msgIndex + 1 < arr.length) {
        this.setState({ msgIndex: this.state.msgIndex + 1 });
      }
      else {
        this.setState({ msgIndex: 0 });
      }
    }
  }
  showMsg(event) {
    let callback = (labelNode) => {
      let rgb = "#";

      for (let i = 0; i < 6; i++) {
        let number = Math.floor(Math.random() * (15 - 0 + 1) + 0);
        if (number > 9) {
          rgb += String.fromCharCode((number - 10) + 65);
        }
        else {
          rgb += number
        }
      }
      labelNode.style.color = rgb;
    };

    let node = event.currentTarget.nextElementSibling;
    node.style.visibility = "visible";
    this.setState({ ref: setInterval(callback, 700, node.firstChild) });
  }

  removeMsg(event) {
    let node = event.currentTarget.nextElementSibling;
    node.style.visibility = "collapse";
    this.setState({ msgIndex: 0, ref: clearInterval(this.state.ref) });
  }

  range(start, end) {
    var range = [];
    for (; start <= end; start++) {
      range.push(start);
    }
    return range;
  }

  updateYear(event) {
    let retVal = parseInt(event.currentTarget.dataset.name);

    if (this.state.yearlyStatusData.hasOwnProperty(retVal)) {
      this.setState({ collection: this.state.yearlyStatusData[retVal] });
    }
    else {
      this.setState({ collection: [] });
    }
  }

}