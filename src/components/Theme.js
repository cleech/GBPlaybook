import Color, {rgb} from 'color';

export const DefaultTheme = {
  image: require('../assets/bg.jpg'),
};
export const DarkTheme = {
  image: require('../assets/wallpaper.jpg'),
  colors: {
    background: Color('rgb(15%, 20%, 25%)').string(),
    surface: rgb(70, 90, 108).string(),
//    card: rgb(70, 90, 108).string(),
//    notification: Color('rgb(30%, 15%, 15%)').lightness(40).string(),
  },
};
