import { css } from "@emotion/css";

const flipStyles = {
  /* The flip card container-set the width and height to whatever you want. */
  flipCard: css({
    display: 'block',
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: '500px',
    height: '100%',
    maxHeight: '700px',
    perspective: '1500px', /* Remove this if you don't want the 3D effect */
  }),
  /* This container is needed to position the front and back side */
  flipCardInner: css({
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 800ms',
    transformStyle: 'preserve-3d',
    /* Do an horizontal flip when the flipped class is applied */
    '&.flipped': {
      transform: 'rotateY(180deg)',
    }
  }),
  flipCardFront: css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  }),
  flipCardBack: css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
  }),
}

export default flipStyles;
