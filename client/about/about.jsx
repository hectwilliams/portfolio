import React from 'react';
import aboutCss from './about.css';
import Banner from '../shared-components/Banner/banner';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [],
      yearlyStatusData: {},
    }
    this.updateYear = this.updateYear.bind(this);
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


          {/* <p>
            {this.state.yearlyStatusData[0] == null ? '' : this.state.yearlyStatusData[0][0]}
          </p>

          <img width="250" height="180" src="http://localhost:3001/assets/images/bg.jpg" /> TODO CHANGE TO MY IMAGE*/}

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


        </div>
      </div>
    )
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