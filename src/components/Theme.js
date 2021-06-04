import {rgb} from 'color';

export const DefaultTheme = {
  image: require('../assets/bg.jpg'),
};
export const DarkTheme = {
  image: require('../assets/wallpaper.jpg'),
  colors: {
	  background: rgb(38, 51, 64).string(),  // 2633402633
    // surface: '#202020',
    surface: rgb(102, 128, 153, 0.5).string(),
    card: '#202020',
  },
};
