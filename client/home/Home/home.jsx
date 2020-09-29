import React from 'react';
import Banner  from '../../shared-components/Banner/banner';
import homeCss from './home.css';
import StoryInfo from '../../shared-components/StoryInfo/storyinfo';

let object = {
  date: new Date().getDate(),
  title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit",
}

export default class Home extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      storyData: []
    };
    this.onHoverStory = this.onHoverStory.bind(this);
  }

  onHoverStory()
  {
    // TDB
  }

  render()
  {
    return (

      <div>

        <Banner/>

        <div className = {homeCss.container}>

          {/* profile picture embeddded within img container */}
          <div className = {homeCss.imgContainer}>

            {/* public social media icons  */}
            <div className = {homeCss.socialmedia}>
              <div>
                <span title = {"linkedin-icon"}> </span>
                <span disabled="disabled" title = {"facebook-icon"}> </span>
                <span title = {"twitter-icon"}> </span>
                <span title = {"medium-icon"}> </span>
              </div>

            </div>

            {/* story */}
            <div className = {homeCss.storyContainer} >

              <div>

                {/* shifter  */}
                <span> </span>

                {/*  list of stories  */}
                <span className = {homeCss.story} onMouseEnter = {this.onHoverStory} >
                    <span className= {homeCss.storyToolInfo}> <StoryInfo meta={object} />  </span>
                </span>

                <span className = {homeCss.story} onMouseEnter = {this.onHoverStory} >
                <span className= {homeCss.storyToolInfo}>  <StoryInfo meta={object} /> </span>
                </span>


                { //disabled stories
                  Array.apply(null, Array(6)).map(() => (
                    <span data-state = {"off"} className = {homeCss.story}> </span>
                  ))
                }

                <span className = {homeCss.story} onMouseEnter = {this.onHoverStory} >
                <span className= {homeCss.storyToolInfo}>  <StoryInfo meta={object} /> </span>
                </span>

                {/* shifter  */}
                <span> </span>

              </div>

              {/* video */}
              <div>
              </div>

            </div>
          </div>

          {/* porfolio page links   */}
          <div class = {homeCss.linksContainer}>
            {
              Array.apply(null, Array(5)).map((ele, index) => ( <div> </div> ))
            }
          </div>

        </div>

      </div>
    )
  }

}


