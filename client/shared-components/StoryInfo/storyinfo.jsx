import React from 'react';
import StoryInfoCss from './storyinfo.css';

export default class StoryInfo extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
    }
  }

  render()
  {
    return (
      <div className={StoryInfoCss[`container`]}>

        <div className={StoryInfoCss.photo}>   </div>

        <div
          title="date"
          data-date = {`${(new Date()).getMonth()} / ${(new Date()).getDate()} / ${(new Date()).getFullYear()}`}
          className ={StoryInfoCss.calendar}  //TBD
        >
        </div>

        <div title="thumb-icon" className={StoryInfoCss.upThumb}>  </div>
        <div className={StoryInfoCss.upThumbCount}>  {`${ Math.round(Math.random() * 100)}`} </div>

        <div title="thumb-icon" className={StoryInfoCss.downThumb}>  </div>
        <div className={StoryInfoCss.downThumbCount}> {`${ Math.round(Math.random() * 100)}`}  </div>

        <div title="view-icon"className={StoryInfoCss.views}> </div>
        <div className={StoryInfoCss.viewsCount}> {`${ Math.round(Math.random() * 10000)} v`} </div>
      </div>
    )
  }

}
