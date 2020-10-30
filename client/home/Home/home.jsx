import React from 'react';
import Banner  from '../../shared-components/Banner/banner';
import homeCss from './home.css';
import StoryInfo from '../../shared-components/StoryInfo/storyinfo';


export default class Home extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {

      /* REQUEST STORIES FROM DATABASE */
      collection :   ( ()=> {
        let array = [];
        let template = {
          valid: true,
          date : ["Wed", "Oct", "2", "2020"],
          video : "video-link",
        };
        for (let i = 0; i < 100; i++)
        {
          array.push(template);
        }
        return array;
       })(),


      storiesPosition: 0,
      storiesListLength: 9,
      shifterInUse : false
    };
    this.onHoverStory = this.onHoverStory.bind(this);
    this.onClickShifter = this.onClickShifter.bind(this);
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
            <div >

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

                <button title = {'leftShift'} onClick = {this.onClickShifter}  disabled></button>  {/* shifter  */}

                <button title = {'rightShift'} onClick = {this.onClickShifter}></button>   {/* shifter  */}

                {this.state.collection.slice(this.state.storiesPosition, this.state.storiesPosition + this.state.storiesListLength ).map( (storyData, index) => (

                  <span key = {index} data-animate = {"off"} title="storyToolTip" className = {homeCss.story} onMouseEnter = {this.onHoverStory} >

                    <span className= {homeCss.storyToolInfo}>
                      <StoryInfo  date = {storyData.date} />
                    </span>

                  </span>

                ))}

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

  onHoverStory()
  {

  }

  onClickShifter(event)
  {
    event.preventDefault();

    var toggleAnimateAttribute = (node, msg) => {
      let tmp = node;
      while (node)
      {
        if (node.title == "storyToolTip")
        {
          node.dataset.animate = msg;
        }
        node = node.nextSibling;
      }

      return tmp;

    };

    if (!this.state.shifterInUse)
    {
      let k =  -(event.currentTarget.title == 'leftShift') + (event.currentTarget.title == 'rightShift');

      if (k)
      {
        new Promise( (resolve)=>{

          // ENABLE IN USE FLAG
          this.setState({shifterInUse: true});

          // TOGGLE ANIMATION
          toggleAnimateAttribute(event.currentTarget, 'on');

          // PASS EVENT
          resolve (event.currentTarget);

        })

        .then ((currNode)=>{

          return new Promise( (resolve) => {

            // ALLOW ANIMATION TO COMPLETE
            setTimeout( () => {
              resolve (toggleAnimateAttribute(currNode, 'off'));
            }, 1000);

          });

        })

        .then((currNode)=>{

          (this.setState({

            // DISABLE IN USE FLAG
            shifterInUse: false,

            // UPDATE STORIES ARRAY
            storiesPosition: this.state.storiesPosition + k

          }));

          return Promise.resolve(currNode);
        })

        .then (( node) => {

          if (this.state.storiesPosition > 0  )
          {
            if ( node.parentNode.firstChild.disabled === true)  // REPLACE DISABLED NODE
            {
              // CREATE REPLACEMENT NODE
              let button = document.createElement('BUTTON');
              button.title = 'leftShift';
              button.onclick = this.onClickShifter;
              button.disabled = false;

              // REPLACE NODE
              node.parentNode.replaceChild(button, node.parentNode.firstChild);
            }
          }
          else
          {
            node.parentNode.firstChild.disabled = true;
          }

          if ( this.state.collection.length - this.state.storiesPosition  > this.state.storiesListLength  )
          {
            if ( node.parentNode.firstChild.nextSibling.disabled === true )  // REPLACE DISABLED NODE
            {
              // CREATE REPLACEMENT NODE
              let button = document.createElement('BUTTON');
              button.title = 'rightShift';
              button.onclick = this.onClickShifter;

              // REPLACE NODE
              node.parentNode.replaceChild(button, node.parentNode.firstChild.nextSibling);
            }
          }
          else
          {
            node.parentNode.firstChild.nextSibling.disabled = true;
          }

        })

        .catch((err) => console.log(err));
      }
    }

    else
    {
      /* UPDATING STORIES (IN USE) */
    }
  }


}