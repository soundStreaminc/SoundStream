import NowPlayingView from '../assets/svgs/nowPlayingView.svg?react'
import Lyrics from '../assets/svgs/lyrics.svg?react'
import { useEffect } from 'react'

export function FactoryImages() {
    // const imagesObject = [{
    //     'Name': 'NowPlayingView',
    //     'Name': 'Lyrics'
    // }]

    // useEffect( ()=>{
    //     var test = imagesObject.map(image =>   
    //         <Factory component={image} />   
    //     )
    //     console.log('test:', test)
    // }, [])

    return (
        <>
             <NowPlayingView />
             <span> <NowPlayingView /></span>
             <Lyrics />
        </>
      );
    return ( //TODO why map not working??? why inside div not working!?!?
        imagesObject.map(image =>  <Factory component={image} key={image.Name}/>)
    )
    


    function Factory(props) {
        switch (props.component.Name) {
          case "NowPlayingView":
            return  <NowPlayingView />;
          case "Lyrics":
            return <Lyrics />;
          case "C":
            return <C />;
          default:
            return <div>Reload...</div>;
        }
      }

    return (
        
        <div>
            {imagesObject.map(image =>
                <div key={'image.Name'}> 
                    <Factory component={image} />            
                </div>
                
            )}
            {/* {imagesObject.map(image => {                     
                    <button class={image}>
                        <span aria-hidden="true" class="iconWrapper">
                            <NowPlayingView className="now-playing-view smallImage"/>
                        </span>
                     </button>
             
                    })
            } */}
       </div>
    )
}