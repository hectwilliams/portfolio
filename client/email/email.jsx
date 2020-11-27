import React from 'react';
import emailCss from './email.css';
import Banner from '../shared-components/Banner/banner';

export default class Email extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collection: [] // {timestampe, username, star rating, msg}
    }
  }

  render() {
    return (
      <div >

        <Banner name={'Email'} />

        <form className={emailCss.input}>
          <input placeholder={'\t\tEnter username'} type='text' />
          <textarea placeholder="Please message me. I love feedback." rows="4" cols="50" name="comment" form="usrform"></textarea>
          <div>
            <button> Insert Image </button>
          </div>
          <input type="submit" value="submit" />

        </form>

        <div data-len={this.state.collection.length} className={emailCss.testimonialContainer}>
          <div className={emailCss.testimonial}>
            <div>
              <span> </span>
              <span> 1-11-2292 </span>
              {/* username restriction */}
              {/* username hover to show full name */}
              <span>  User: dwwdwwwwf... </span>
            </div>

            <div>
              {/* <span>
                <span className={emailCss.star}></span>
                <span className={emailCss.star}></span>
                <span className={emailCss.star}></span>
                <span className={emailCss.star}></span>
                <span className={emailCss.star}></span>
              </span> */}
              <p>  {'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque similique earum fuga placeat? Quae quisquam quia tenetur pariatur ea. Quo eius doloribus ut animi modi cumque architecto, error rerum minima.'} </p>
            </div>

          </div>

        </div>

      </div>
    )
  }
}