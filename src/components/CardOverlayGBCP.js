import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Observer} from 'mobx-react-lite';
import GBIcon, {PB, PBIcons, GBIconGradient} from '../components/GBIcons';
// import {Guilds, CPlays, CTraits} from '../components/GuildData';
import {useData} from '../components/DataContext';

import reactStringReplace from 'react-string-replace';
import {GBIconFade} from '../components/GBIcons';
import LinearGradient from 'react-native-linear-gradient';

import {Text as RNText} from 'react-native';
import _ from 'lodash';
const Text = props => <RNText {...props} allowFontScaling={false} />;

/* just a GBIcon, unless it's a funky crosssfade for Compound and Lucky */
function GuildIcon(props) {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  const guild = Guilds.find(g => g.name === props.model.guild1);
  switch (props.model.name) {
    case 'Compound':
    case 'Lucky':
      return (
        <GBIconFade
          guild1={props.model.guild1}
          guild2={props.model.guild2}
          {...props}
        />
      );
      break;
    default:
      return (
        <GBIcon name={props.model.guild1} color={guild.color} {...props} />
      );
  }
}

/* styles that get reused multiple times */
const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'CrimsonText-Regular',
    color: 'black',
    fontSize: 20,
    letterSpacing: -1,
    includeFontPadding: false,
  },
  leftDiv: {
    flex: 1,
    borderColor: 'black',
    borderLeftWidth: 1, //StyleSheet.hairlineWidth,
  },
  backSection: {
    fontFamily: 'IM_FELL_Great_Primer_DC',
    fontSize: 35,
    letterSpacing: -1,
    // this shifts the text box down relative to the outer view, positioning
    // the view border being used as an underline divider
    marginBottom: -5,
  },
  playbookSpacer: {
    width: 44,
    height: 44,
    marginRight: 8,
    marginBottom: 8,
  },
  playbookContainer: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  playbookText: {
    width: 44,
    height: 44,
    color: 'black',
    includeFontPadding: false,
  },
});

function autoHeader(text) {
  return (
    <Text
      style={{
        // width: 232,
        color: 'black',
        fontSize: 21,
      }}>
      <Text style={{fontFamily: 'CrimsonText-BoldItalic'}}>
        {text.split('[', 1)[0]}
      </Text>
      <Text
        style={{
          fontFamily: 'CrimsonText-SemiBold',
          letterSpacing: -1,
        }}>
        {text.replace(/[^[]*(\[.*\])?/, ' $1')}
      </Text>
    </Text>
  );
}

function InlinePlaybook(props) {
  return (
    <View
      style={{
        width: 21,
        // trying to match x-height here for centering
        height: 11,
        // inline view alignment seems to be baseline for Android
        // but at the decender line for iOS ...
        paddingBottom: Platform.OS === 'ios' ? 6 : 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 21,
          height: 21,
          backgroundColor: 'white',
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 10.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <PBIcons
          size={21}
          name={props.name
            .replace(/GB/g, 'CP')
            .replace(',', '-')
            .replace(/</g, 'D')
            .replace(/>/g, 'P')}
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
          }}
        />
      </View>
    </View>
  );
}

function autoStyle(text) {
  var replacedtext = text;

  /* bullet lists with corrected indenting */
  // replacedtext = reactStringReplace(replacedtext, /•(.*)/g, (match, i, o) => (
  //   <View
  //     key={match + i + o}
  //     style={{
  //       flexDirection: 'row',
  //       alignItems: 'flex-start',
  //       flexWrap: 'wrap'
  //     }}>
  //     <Text
  //       style={{
  //         fontFamily: 'CrimsonText-Regular',
  //         fontSize: 21,
  //         color: 'black',
  //         // color: 'blue',
  //       }}>
  //       •
  //     </Text>
  //     <View
  //       style={
  //         {
  //           // flex: 1,
  //           width: 400,
  //           // paddingLeft: 5
  //         }
  //       }>
  //       <Text
  //         style={{
  //           fontFamily: 'CrimsonText-Regular',
  //           fontSize: 21,
  //           color: 'black',
  //         }}>
  //         {match.slice(1)}
  //       </Text>
  //     </View>
  //   </View>
  // ));

  /* italicised text in parens (nested descriptions of applied traits) */
  replacedtext = reactStringReplace(
    replacedtext,
    /\((.*?)\)/g,
    (match, i, o) => (
      <React.Fragment key={match + i + o}>
        {'('}
        <Text
          style={{
            fontStyle: 'italic',
            color: 'black',
          }}>
          {autoStyle(match)}
        </Text>
        {')'}
      </React.Fragment>
    ),
  );

  /* inline playbook result icon */
  replacedtext = reactStringReplace(
    replacedtext,
    /([<>TKDGB]+) playbook result/,
    (match, i, o) => (
      <React.Fragment key={match + i + o}>
        <InlinePlaybook name={match} />
        {' playbook result'}
      </React.Fragment>
    ),
  );

  /* tighter letter spacing on all caps abbreviations (ARM, DMG, etc.) */
  replacedtext = reactStringReplace(
    replacedtext,
    /\b([A-Z]+)\b/g,
    (match, i, o) => (
      <Text
        key={match + i + o}
        style={{
          letterSpacing: -2,
          color: 'black',
        }}>
        {match}
      </Text>
    ),
  );

  // /* tigher letter spacing on numbers with +/- and/or " */
  // replacedtext = reactStringReplace(
  //   replacedtext,
  //   // /([-–+]?\d\")/g,
  //   /([-+]?\d\"?)/g,
  //   (match, i, o) => (
  //     <Text
  //       key={match + i + o}
  //       style={{
  //         // letterSpacing: -0.5,
  //         // letterSpacing: -1,
  //         color: 'black',
  //         // color: 'red'
  //       }}>
  //       {match}
  //     </Text>
  //   ),
  // );

  return <Text key={text}>{replacedtext}</Text>;
}

const CardFrontOverlay = React.memo(_CardFrontOverlay);
function _CardFrontOverlay(props) {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;
  const CPlays = data['Character Plays'];

  const model = props.model;
  const guild = Guilds.find(g => g.name === model.guild1);

  return (
    <View
      style={{
        width: 500,
        height: 700,
        aspectRatio: 5 / 7,
      }}>
      {/* LOTS OF STUFF DELETED FOR NOW */}

      {/* health boxes */}
      <View
        style={{
          position: 'absolute',
          top: 585,
          left: 10,
          width: (32 + 4.5) * 10 + 40,
          flexDirection: 'row',
          flexWrap: 'wrap',
          //
          // opacity: 0.6,
          // backgroundColor: 'red',
        }}>
        <Observer>
          {() => (
            <>
              {_.chunk(
                [...Array(model.hp).keys()].map(key => (
                  <View
                    key={key}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 32 / 2,
                      marginRight: 4.5,
                      marginTop: 5.5,
                      backgroundColor:
                        'health' in model && model.health < key + 1
                          ? 'darkred'
                          : 'white',
                      borderWidth: 1,
                      borderColor: 'black',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                    <Text
                      style={{
                        color:
                          'health' in model && model.health < key + 1
                            ? 'black'
                            : guild.shadow ?? guild.color,
                        includeFontPadding: false,
                        fontFamily: 'CrimsonText-SemiBold',
                        fontSize: 22,
                        // ugly hack but it fixes text alignment
                        alignSelf: key + 1 === model.hp ? 'flex-end' : 'center',
                      }}>
                      {(key === 0 && <GBIcon name="skull" size={20} />) ||
                        (key + 1 === model.recovery && (
                          <GBIcon name="bandage" size={26} />
                        )) ||
                        (key + 1 === model.hp && key + 1)}
                    </Text>
                  </View>
                )),
                5
              ).map(chunk => (
                <View key={chunk[0].key}
                  style={{
                    flexDirection: 'row', flexWrap: 'wrap',
                    marginRight: 18,
                    // backgroundColor: '#ff000044',
                }}
                >{chunk}</View>
              ))}
            </>
          )}
        </Observer>
      </View>
    </View>
  );
}

/* THIS IS ALL WRONG */

const CardBackOverlay = React.memo(_CardBackOverlay);
function _CardBackOverlay(props) {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;
  const CTraits = data['Character Traits'];

  const model = props.model;
  const guild = Guilds.find(g => g.name === model.guild1);
  const guild2 = model.guild2
    ? Guilds.find(g => g.name === model.guild2)
    : null;

  return (
    <View
      style={{
        width: 500,
        height: 700,
        aspectRatio: 5 / 7,
        zIndex: 1,
      }}>
      <View
        style={{
          position: 'absolute',
          top: 15,
          height: 570,
          paddingLeft: 24,
          paddingRight: 20,
        }}>
        {/* nameplate */}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: -10,
          }}>
          {/* double view wrap for overflow control */}
          <View
            style={{
              width: 45,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -3,
              marginRight: 3,
              marginTop: 8,
            }}>
            <View style={{width: 60, alignItems: 'center'}}>
              <GuildIcon
                size={45}
                model={model}
                name={model.guild1}
                color={guild.color}
                style={{
                  textShadowColor: guild.shadow ?? 'transparent',
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 10,
                }}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              height: 53,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                color: 'black',
                fontFamily: 'IM_FELL_Great_Primer_DC',
                fontSize: 41,
                letterSpacing: -1,
                marginTop: -8,
                marginLeft: -6,
              }}>
              {/* this space and the above marginLeft deal with the capital J
               extending too far to the left and getting clipped if it's the
               first letter in the span */}{' '}
              {model.name}
            </Text>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: 'black',
                marginTop: -5,
              }}
            />
          </View>
        </View>

        {/* Traits */}
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: 'black',
            justifyContent: 'flex-end',
          }}>
          <Text style={styles.backSection}>Character Traits</Text>
        </View>
        {model.character_traits.map(key => {
          // need to ignore args
          const ct = CTraits.find(ct => ct.name === key.replace(/ \[.*\]/, ''));
          return (
            <View
              key={key}
              style={{
                marginBottom: 5,
              }}>
              {/* Header Row */}
              <Text>
                {ct.active && (
                  <Text
                    style={{
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 21,
                    }}>
                    {'◉ '}
                  </Text>
                )}
                {autoHeader(key)}
              </Text>

              {/* Detail Text */}
              <Text
                style={{
                  fontFamily: 'CrimsonText-Regular',
                  fontSize: 21,
                  lineHeight: 22,
                }}>
                {autoStyle(ct.text)}
              </Text>
            </View>
          );
        })}

        {/* Heroic */}
        {'heroic' in model && model.heroic && (
          <>
            <View
              style={{
                // strange spacing with this header font
                marginTop: -8,
                borderBottomWidth: 1,
                borderColor: 'black',
                justifyContent: 'flex-end',
              }}>
              <Text style={styles.backSection}>Heroic Play</Text>
            </View>

            {/* Header Row */}
            <View style={{marginTop: 0}}>
              {autoHeader(model.heroic.split('\n', 1)[0])}
              {/* Detail Text */}
              <Text
                style={{
                  fontFamily: 'CrimsonText-Regular',
                  fontSize: 21,
                  color: 'black',
                  lineHeight: 22,
                }}>
                {autoStyle(model.heroic.split('\n').slice(1).join('\n'))}
              </Text>
            </View>
          </>
        )}

        {/* Legendary */}
        {'legendary' in model && model.legendary && (
          <>
            <View
              style={{
                // strange spacing with this header font
                marginTop: -8,
                borderBottomWidth: 1,
                borderColor: 'black',
                justifyContent: 'flex-end',
              }}>
              <Text style={styles.backSection}>Legendary Play</Text>
            </View>
            <View style={{marginTop: 0}}>
              {/* Header Row */}
              {autoHeader(model.legendary.split('\n', 1)[0])}
              {/* Detail Text */}
              <Text
                style={{
                  fontFamily: 'CrimsonText-Regular',
                  color: 'black',
                  fontSize: 21,
                  lineHeight: 22,
                }}>
                {autoStyle(model.legendary.split('\n').slice(1).join('\n'))}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* bottom area */}
      <View
        style={{
          // backgroundColor: 'white',
          position: 'absolute',
          top: 595,
          left: 0,
          width: 480,
          height: 65,
          paddingLeft: 22,
          // paddingRight: 20,
          paddingTop: 2,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'CrimsonText-Regular',
              color: 'black',
              fontSize: 21,
              lineHeight: 20,
            }}>
            {model.types}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'flex-end',
            }}>
            {/* GB icon */}
            <View style={{alignItems: 'center'}}>
              <GBIcon name="GB" size={44} color="black" />
              <GBIcon
                name="blank"
                color="white"
                size={44}
                style={{
                  position: 'absolute',
                  zIndex: -1,
                }}
              />
            </View>
            {/* main guild icon */}
            <View style={{width: 44, alignItems: 'center'}}>
              <View style={{width: 60, alignItems: 'center'}}>
                <GBIcon
                  name={model.guild1}
                  color={guild.color}
                  size={44}
                  style={{
                    textAlign: 'center',
                    textShadowColor: guild.shadow ?? 'transparent',
                    textShadowOffset: {width: 0, height: 0},
                    textShadowRadius: 10,
                  }}
                />
                <GBIcon
                  name="blank"
                  color="white"
                  size={44}
                  style={{
                    position: 'absolute',
                    textAlign: 'center',
                    zIndex: -1,
                  }}
                />
              </View>
            </View>
            {/* secondary guild icon */}
            {model.guild2 && (
              <View style={{width: 44, alignItems: 'center'}}>
                <View style={{width: 60, alignItems: 'center'}}>
                  <GBIcon
                    name={model.guild2}
                    /* this is hacky, should look up 2nd guild info */
                    color={guild2.shadow ?? guild2.color}
                    size={44}
                    style={{textAlign: 'center'}}
                  />
                  <GBIcon
                    name="blank"
                    color="white"
                    size={44}
                    style={{
                      textAlign: 'center',
                      position: 'absolute',
                      zIndex: -1,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
          <Text
            style={{
              fontFamily: 'CrimsonText-Regular',
              fontSize: 21,
              lineHeight: 20,
            }}>
            Size {model.base} mm
          </Text>
        </View>
      </View>
      {/* <Text
        style={{
          position: 'absolute',
          top: 670,
          width: 500,
          fontFamily: 'CrimsonText-Regular',
          fontSize: 14,
          color: 'white',
          textAlign: 'center',
        }}>
        ™ & © Steamforged Games LTD 2018
      </Text> */}
    </View>
  );
}

export {CardFrontOverlay, CardBackOverlay};
