import React from 'react';
import {StyleSheet} from 'react-native';
import {overlay, Surface, withTheme} from 'react-native-paper';
import color from 'color';

const NavRail = ({children, dark, style, theme, ...rest}) => {
  const {colors, dark: isDarkTheme, mode} = theme;
  const {backgroundColor: customBackground, elevation = 4, ...restStyle} =
    StyleSheet.flatten(style) || {};

  const backgroundColor = customBackground
    ? customBackground
    : isDarkTheme && mode === 'adaptive'
    ? overlay(elevation, colors.surface)
    : colors.primary;

  let isDark;
  if (typeof dark === 'boolean') {
    isDark = dark;
  } else {
    isDark =
      backgroundColor === 'transparent'
        ? false
        : typeof backgroundColor === 'string'
        ? !color(backgroundColor).isLight()
        : true;
  }

  return (
    <Surface
      style={[{backgroundColor}, styles.navrail, {elevation}, restStyle]}
      {...rest}>
      {React.Children.toArray(children)
        .filter((child) => child != null && typeof child !== 'boolean')
        .map((child, i) => {
          if (!React.isValidElement(child)) {
            return child;
          }
          const props = {
            color:
              typeof child.props.color !== undefined
                ? child.props.color
                : isDark
                ? 'white'
                : 'black',
          };
          return React.cloneElement(child, props);
        })}
    </Surface>
  );
};

export default withTheme(NavRail);

export const DEFAULT_RAIL_WIDTH = 72;

const styles = StyleSheet.create({
  navrail: {
    width: DEFAULT_RAIL_WIDTH,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 4,
  },
});
