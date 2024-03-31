
import React from 'react';
import { Spinner } from '@themesberg/react-bootstrap';

export default (props) => {
 
  if(props.show){
    return(
      <div className={`preloader bg-soft flex-column justify-content-center align-items-center`}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }
};
