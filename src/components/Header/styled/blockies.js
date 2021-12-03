import Blockies from 'react-blockies';

export const CustomBlockies = ({seed}) => (
    <Blockies
      seed={seed}
      scale={3} 
      className="identicon" 
    />
  )