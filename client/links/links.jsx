import React from 'react';
import Banner from '../shared-components/Banner/banner';
import linksCss from './/links.css';

export default class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      records: []
    }
  }

  componentDidMount() {
    let newArray = [];
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
        for (let retRecord of retJSON) {
          newArray.push(retRecord);
        }
        this.setState({ records: newArray });
        console.log(newArray);
      })
      .catch(err => console.log(err.stack))
  }

  render() {
    return (
      <div>

        <Banner name={'Links'} />

        <div className={linksCss.pageTitle}> Favorite Links </div>

        < div className={linksCss.container} >

          {
            this.state.records.length == 0 ? '' :

              this.state.records.map((record) => (

                <div>

                  <span>
                    <label title={record[0]}>  <p> <a href={record[1]}> {record[1]} </a> </p> </label>
                  </span>

                  <span>
                    <p>
                      {record[2]}
                    </p>
                  </span>

                </div>

              ))
          }

        </div>

      </div>
    )
  }
};




