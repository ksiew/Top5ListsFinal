import * as React from 'react';
import { styled, Box } from '@mui/system';
import ModalUnstyled from '@mui/core/ModalUnstyled';
import AuthContext from '../auth';

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  p: 2,
  px: 4,
  pb: 3,
};

export default function ErrorModal(props) {
  const [open, setOpen] = React.useState(false);
  const {error, logout} = props;
  const handleOpen = () => setOpen(true);

  if(error != "" && !open){
      handleOpen();
  }

  const handleClose = () => {
    setOpen(false)
    logout();
  };

  return (
    <div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        onClick ={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
        <button
          onClick={handleClose}
          >
          &#x24E7;
          </button>
          <h2 id="unstyled-modal-title">{error}</h2>
        </Box>
      </StyledModal>
    </div>
  );
}

