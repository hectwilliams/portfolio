import React from 'react';
import StoryInfoCss from './storyinfo.css';

export default class StoryInfo extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      dateInfo: [],
      thumpUpCount: Math.round(Math.random() * 100),
      ThumbDownCount: Math.round(Math.random() * 100),
      viewsCount: Math.round(Math.random() * 100),

      upThumpButtonSet: false,
      downThumpButtonSet: false
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseClickThumpUp = this.onMouseClickThumpUp.bind(this);
    this.onMouseClickThumpDown = this.onMouseClickThumpDown.bind(this);

  }

  onMouseEnter ()
  {
    this.setState( {
      dateInfo : (new Date(Date.now())).toDateString().split(' ')
    });
  }

  onMouseClickThumpUp ()
  {
    if (!this.state.upThumpButtonSet)
    {
      this.setState({
        thumpUpCount: this.state.thumpUpCount + 1
      });
      this.setState({upThumpButtonSet : true} );
    }
  }

  onMouseClickThumpDown ()
  {
    if (!this.state.downThumpButtonSet)
    {
      this.setState({
        ThumbDownCount: this.state.ThumbDownCount + 1
      });
      this.setState({downThumpButtonSet: true});
    }
  }

  render()
  {

    return (
      <div className={StoryInfoCss[`container`]} onMouseEnter = {this.onMouseEnter}  >

        <div className={StoryInfoCss.photo}>   </div>

        <div className ={StoryInfoCss.calendar} >
          <label> {this.props.date[0]}</label>
          <div> {this.props.date[2] } </div>
          <label> {`${this.props.date[1]} ${this.props.date[3]}`}  </label>
        </div>

        <div title="thumb-icon" className={StoryInfoCss.upThumb} onClick = {this.onMouseClickThumpUp} > </div>
        <div className={StoryInfoCss.upThumbCount}>  { this.state.thumpUpCount } </div>

        <div title="thumb-icon" className = {StoryInfoCss.downThumb} onClick = {this.onMouseClickThumpDown} > </div>
        <div className={StoryInfoCss.downThumbCount}>  { this.state.ThumbDownCount }  </div>

        <div title="view-icon"className={StoryInfoCss.views}> </div>
        <div className={StoryInfoCss.viewsCount}> { this.state.viewsCount  } </div>
      </div>
    )
  }

}
