import React from 'react';
import aboutCss from './about.css';
import Banner  from '../shared-components/Banner/banner';
export default class About extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {

      yearInfo : undefined,

      collection: [],

      meta: {

        2020: [
          `Gained Full Stack experience because it's important to know how to create web pages. Completed boot camp at Hack Reactor.`,

          `Interviewed with big tech companies Google, Amazon, VMWare. Neither door opened, guess I will try again in the future`,

          `Historic year for the United States of America electing their first Multiracial Female Vice President.`,

          `Presently while I type this, Penn State(🔵⚪️🦁) is the worst team in the Big 10 Conference sitting at 0-3`,

          `Covid 19 shutdown forced me and my partner to spend alot of time at home. I'm a homebody but I am also an adventurous. I spent time finding some new games on my XBOX. I'm so proud of video game developers are always creating unique diverse games. I'm not sure what I would do without video games(there are board games...duh!)`


        ],

        2021: []
      }
    }


    this.updateYear = this.updateYear.bind(this);
  }

  render()
  {
    return (

      <div className= {aboutCss.main}>
        <Banner name = { 'About Me'} />

        < div className = {aboutCss.pBox}  >
          <p> Thinker, Gamer, Engineer, Runner, Basketball/Football Fan, PSU Alum, NYU-POLY Alum, BootCamp Alum, more to come</p>
        </div>

        <br/>

        <div className = {aboutCss.pBox}  >

          <img  width = "250" height= "180" src="http://localhost:3001/assets/images/me.jpg"  />

          <p>
            Hectors’s never been one to brag, which is why he hated creating this webpage. Lacking vain and more of an observer, Hector is more of a people person, not a person in need :). Welp let's get on with it, right...
          </p>

          <br/>

          <p>
           Hector has 6 years experience as an Electrical/Embedded Engineer where  he worked in different industries: research, manufacturing, and start-up. That is a lot to pack in 6 years, and for Hector he was always trying to find the best environment for growth and technical depth. Hector has always been a driver wherever he has landed and always pushed the status quo trying to get into new technologies. Who was the one who said “anyone who has never made a mistake has never friend anything new”. Hector is fierce and always learning.
          </p>

          <br/>

          <p>
            Hector currently spends time building his GitHub page improving coding skills daily because Hector understands the nature of technology, it’s always in constant flux spawning into something new every decade. One thing that is most important is the ability to code, and that is what Hector loves to do. Better stated, he loves solving problems, and solving problems by finding a programmable solver is important, is the present, and is the future.
          </p>

        </div>

        <br/>


        <div className = {aboutCss.yearlyTestimonial} >

          <div>  {/* container   */}

            <select onChange = {this.updateYear } name = {'year'} id="year-select" >
              <option value="">-- Choose year --</option>
              {
                this.range(2020, 2025).map( (element, index) => (
                  <option value = {element} > {element }</option>
                ))
              }
            </select>

            <div data-currYear = {this.state.collection.length}>
              {
                this.state.collection.map( (message) => ( <p> {message} </p>))
              }
            </div>

          </div>



        </div>

      </div>

    )
  }

  range(start, end)
  {
    var range  = [];
    for ( ; start <= end ; start++ )
    {
      range.push(start);
    }
    return range;
  }

  updateYear(event)
  {
    var position = parseInt(event.currentTarget.value);

    if (position)
    {
      if ( !!this.state.meta[position] )
      {
        this.setState( {collection: this.state.meta[position] } );
      }
      else
      {
        this.setState( {collection: [] } );
      }

    }
  }

}