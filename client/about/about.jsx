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

      <div className={aboutCss.main}>
        <Banner name={'About Me'} />

        < div className={aboutCss.pBox}  >
          <p>
            {this.state.yearlyStatusData[0] == null ? '' : this.state.yearlyStatusData[0][0]}
          </p>

          <img width="250" height="180" src="http://localhost:3001/assets/images/bg.jpg" /> {/* TODO CHANGE TO MY IMAGE */}

          <br></br>

          {/*  paragraphs about me  */}
          <p>
            {this.state.yearlyStatusData[0] == null ? '' : this.state.yearlyStatusData[0][1]}
          </p>

          <br></br>

          <p>
            {this.state.yearlyStatusData[0] == null ? '' : this.state.yearlyStatusData[0][2]}
          </p>

          <br></br>

          <p>
            {this.state.yearlyStatusData[0] == null ? '' : this.state.yearlyStatusData[0][3]}
          </p>

        </div>

        {/*  yearly testimonials */}

        <div className={aboutCss.yearlyTestimonial} >
          <div>
            <select onChange={this.updateYear} name={'year'} id="year-select" >
              <option value="">-- Choose year --</option>
              {
                this.range(2020, 2025).map((element, index) => (
                  <option value={element} > {element}</option>
                ))
              }
            </select>

            <div data-currYear={this.state.collection.length}>
              {
                this.state.collection.lengt ? '' : this.state.collection.map((message) => (<p> {message} </p>))
              }
            </div>

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
    let retVal = parseInt(event.currentTarget.value);
    if (this.state.yearlyStatusData.hasOwnProperty(retVal)) {
      this.setState({ collection: this.state.yearlyStatusData[retVal] });
    }
    else {
      this.setState({ collection: [] });
    }
  }

}