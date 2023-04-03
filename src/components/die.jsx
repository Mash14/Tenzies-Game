import React, { useEffect } from 'react';

function Die(props) {
    const [news,changeNew] = React.useState(0)
    
    useEffect(()=> {
        changeNew(props.die.value)  
    },[props.die.value])


    return ( 
    <>
        <div className={props.die.isHeld ? 'scene backy' :"scene"} onClick={()=> props.hold(props.die.id)}>
            <div className={props.isHeld ? `cube backy show_${news}` : `cube show_${news}`}>
                <div className="cube_face face_1">1</div>
                <div className="cube_face face_2">2</div>
                <div className="cube_face face_3">3</div>
                <div className="cube_face face_4">4</div>
                <div className="cube_face face_5">5</div>
                <div className="cube_face face_6">6</div>
            </div>
        </div>
    </> 
    );
}

export default Die;