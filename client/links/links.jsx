import React from 'react';
import Banner  from '../shared-components/Banner/banner';
import linksCss from './/links.css';


export default class Links extends React.Component
{
  render()
  {
    return (
      <div>

        <Banner name = {'Links'}/>

        <div className = {linksCss.pageTitle}> Favorite Links </div>

        < div className = {linksCss.container} >

          {
            linkData.map( (obj) => (
              <div>
                <span>
                  <label title={obj.name}>  <p> <a href = {obj.link}> {obj.msg} </a> </p> </label>
                </span>
                <span>
                  <p>
                    {obj.description}
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


var linkData = [

  {
    name: 'CodeWars',
    link: 'https://www.codewars.com/users/hectron',
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste excepturi sunt, velit iure hic maiores asperiores dignissimos minus ut eaque nulla aspernatur, nesciunt enim odio, exercitationem ad sit repellendus ab",
    msg: 'profile'

  },

  {
    name: 'TechnologyReview',
    link: 'https://www.technologyreview.com/',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum architecto sit dolor quibusdam quia voluptate, omnis eum sunt corrupti minus facere, sequi reiciendis? Quis nihil sit enim quaerat, animi accusantium.',
    msg: 'https://www.technologyreview.com/'
  },

];



