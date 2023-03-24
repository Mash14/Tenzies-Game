import React from 'react';

function Die(props) {
    return ( 
    <>
        <div className={props.die.isHeld ? 'one green' : 'one'} onClick={() => props.hold(props.die.id)}>{props.die.value}</div>
    </> 
    );
}

export default Die;