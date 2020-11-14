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
      collection : [],
      storiesPosition: 0,
      storiesListLength: 9,
      shifterInUse : false,

      linkNames: ['home', 'email', 'apps', 'links', 'about'],
    };

    this.onHoverStory = this.onHoverStory.bind(this);
    this.onClickShifter = this.onClickShifter.bind(this);

  }

  render()
  {
    return (

      <div>

        <Banner name = { 'Home'} />

        <div className = {homeCss.container}>

          {/* profile picture embeddded within img container */}
          <div className = {homeCss.imgContainer}>

            {/* public social media icons  */}
            <div >

              <div>

                <a href = {'https://www.linkedin.com/in/hectwilliams'}  >

                  <button title = {"linkedin-icon"}></button>
                </a>

                <a>
                  <button title = {"facebook-icon"}></button>
                </a>

                <a>
                  <button title = {"twitter-icon"}></button>
                </a>

                <a href = {'https://hectwilliams.medium.com/'}  >
                  <button title = {"medium-icon"}> </button>
                </a>

              </div>

            </div>

            {/* story */}
            <div className = {homeCss.storyContainer} >

              <div>

                <button id = {"leftShift"} title = {'leftShift'} onClick = {this.onClickShifter}  ></button>  {/* shifter  */}

                <button id = {"rightShift"} title = {'rightShift'} onClick = {this.onClickShifter}   ></button>   {/* shifter  */}

                {this.state.collection.slice(this.state.storiesPosition, this.state.storiesPosition + this.state.storiesListLength ).map( (storyData, index) => (

                  <span data-state={storyData.valid ? 'on' : 'off' } key = {index} data-animate = {"off"} title="storyToolTip" className = {homeCss.story} onMouseEnter = {this.onHoverStory} >

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
              this.state.linkNames.map((name, index) => (
                <a
                  onClick = { (event) => {event.preventDefault(), console.log(location.pathname)}  }
                  title = {name} href =  {  (location.pathname === '/' ^ location.href.indexOf(name) ) >= 0  ?  undefined : `${location.origin}/${name}.html ` }
                >

                </a>

              ))
            }
          </div>

        </div>

      </div>
    )
  }

  componentDidMount()
  {
    this.init();
  }

  init()
  {
    var  template = {
      valid: true,
      date : ["Wed", "Oct", "2", "2020"],
      video : "video-link",
    };

    for (let i = 0; i < 100; i++)
    {
      setTimeout( (id) => {

        let tmp = Object.create(template);

        // NOTE DATA ARRAY IS SHARED VARIABLE
        tmp.date = tmp.date.slice();
        tmp.date[2] = id + "";

        tmp.valid = Math.round(Math.random()) ;

        this.setState ( {collection: this.state.collection.concat(tmp) })

      } , 1000, i)

    }

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

    if (this.state.collection.length == 0 || this.state.storiesPosition == 0 && event.currentTarget.title == 'leftShift')
    {
      return;
    }

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


        .then((currNode)=>{

          (this.setState({

            // UPDATE STORIES ARRAY
            storiesPosition: this.state.storiesPosition + k

          }));

          return Promise.resolve(currNode);
        })

        .then ((currNode)=>{

          return new Promise( (resolve) => {
            // ALLOW ANIMATION TO COMPLETE
            setTimeout( () => {
              resolve (toggleAnimateAttribute(currNode, 'off'));
            }, 1000);

          });

        })


        .then (( node) => {
          (this.setState({
            // DISABLE IN USE FLAG
            shifterInUse: false,
          }))
          return Promise.resolve(1)
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