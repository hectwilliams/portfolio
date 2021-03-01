import React from 'react';
import Banner from '../../shared-components/Banner/banner';
import homeCss from './home.css';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      /* REQUEST STORIES FROM DATABASE */
      storiesPosition: 0,
      storiesListLength: 9,
      shifterInUse: false,
      movieSelected: false,
      collection: [],
      linkNames: ['home', 'email', 'projects', 'links', 'about'],
      selectedVideo: {}
    };

    this.onClickShifter = this.onClickShifter.bind(this);
    this.gotoNextPage = this.gotoNextPage.bind(this);
    this.showVideo = this.showVideo.bind(this);
    this.closeVideo = this.closeVideo.bind(this);
  }


  render() {
    return (

      <div>

        <Banner name={'Home'} />

        <div className={homeCss.container}>

          <div className={homeCss.imgContainer}>

            {/* Image */}
            <img src="http://localhost:3001/assets/images/icon-aboutme.png" />

            {/*  Social Media */}
            <div>
              {/* public social media icons  */}
              <a href={'https://www.linkedin.com/in/hectwilliams'}  >
                <button title={"linkedin-icon"}></button>
              </a>
              <a>
                <button title={"facebook-icon"}></button>
              </a>
              <a>
                <button title={"twitter-icon"}></button>
              </a>
              <a href={'https://hectwilliams.medium.com/'}  >
                <button title={"medium-icon"}> </button>
              </a>
            </div>

          </div>

          {/* Story */}
          <div className={homeCss.storyContainer} >

            <div data-shrink={this.state.movieSelected} >
              {
                this.state.collection.map((vidObj) => (
                  <span data-date={vidObj.date} data-vid={vidObj.fileName} onClick={this.showVideo}>  </span>
                ))
              }
            </div>

          </div>

          {/* Page - Links */}
          <div className={homeCss.linksContainer}>

            <span></span>
            <span> <a onClick={() => { this.gotoNextPage(this.state.linkNames[0]) }} > </a> </span>

            <span></span>
            <span> <a onClick={() => { this.gotoNextPage(this.state.linkNames[1]) }} > </a> </span>

            <span></span>
            <span> <a onClick={() => { this.gotoNextPage(this.state.linkNames[2]) }} > </a> </span>

            <span></span>
            <span> <a onClick={() => { this.gotoNextPage(this.state.linkNames[3]) }} > </a> </span>

            <span></span>
            <span> <a onClick={() => { this.gotoNextPage(this.state.linkNames[4]) }} > </a> </span>

            <span></span>


          </div>

          {/* vid */}

          {
            this.state.movieSelected != true ? "" :

              <div className={homeCss.playModule}>

                {/* exit */}
                <button onClick={this.closeVideo}> {'\u274E'} </button>

                {/* player  */}
                <div>
                  <video loop controls controlsList={['nodownload', 'disablePictureInPicture'].toString()} autoPlay={true} src={`http://localhost:3001/assets/videos/${this.state.selectedVideo}`} />
                </div>

              </div>
          }

          <p className={homeCss.message2} >
            "It has become appallingly obvious that our technology has exceeded our humanity" - Albert Einstien
          </p>

        </div>

      </div>
    )
  }

  componentDidMount() {
    this.init();
  }

  init() {
    fetch(window.location.href + 'home.html/readVideos', { method: 'GET' })
      .then(resp => {
        return (resp.json());
      })
      .then(json => {
        this.setState({ collection: json });
      })
      .catch()
  }

  onClickShifter(event) {
    event.preventDefault();

    var toggleAnimateAttribute = (node, msg) => {
      let tmp = node;
      while (node) {
        if (node.title == "storyToolTip") {
          node.dataset.animate = msg;
        }
        node = node.nextSibling;
      }

      return tmp;
    };

    if (this.state.storiesPosition == 0 && event.currentTarget.title == 'leftShift') {
      return;
    }

    if (!this.state.shifterInUse) {
      let k = -(event.currentTarget.title == 'leftShift') + (event.currentTarget.title == 'rightShift');

      if (k) {
        new Promise((resolve) => {

          // ENABLE IN USE FLAG
          this.setState({ shifterInUse: true });

          // TOGGLE ANIMATION
          toggleAnimateAttribute(event.currentTarget, 'on');

          // PASS EVENT
          resolve(event.currentTarget);

        })


          .then((currNode) => {

            (this.setState({
              // UPDATE STORIES ARRAY
              storiesPosition: this.state.storiesPosition + k
            }));
            return Promise.resolve(currNode);
          })

          .then((currNode) => {
            return new Promise((resolve) => {
              // ALLOW ANIMATION TO COMPLETE
              setTimeout(() => {
                resolve(toggleAnimateAttribute(currNode, 'off'));
              }, 1000);

            });

          })


          .then((node) => {
            (this.setState({
              // DISABLE IN USE FLAG
              shifterInUse: false,
            }))
            return Promise.resolve(1)
          })

          .catch((err) => console.log(err));
      }
    }

    else {
      /* UPDATING STORIES (IN USE) */
    }
  }


  gotoNextPage(name) {
    if (location.href.indexOf('\\') && name === 'home') {
      return;
    }
    location.href = `${location.origin}/${name}.html`;
  }

  showVideo(event) {

    Promise.resolve(event.currentTarget.dataset.vid)
      .then(videoFilename => {
        console.log(videoFilename)
        Promise.resolve(this.setState({ selectedVideo: videoFilename }))
      })
      .then(() => {
        Promise.resolve(this.setState({ movieSelected: true }))
      })
  }

  closeVideo(event) {
    this.setState({ movieSelected: false });
  }

}