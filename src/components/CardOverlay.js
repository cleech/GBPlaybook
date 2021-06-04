import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Observer} from 'mobx-react-lite';
import GBIcon, {PB, PBIcons, GBIconGradient} from '../components/GBIcons';
// import {Guilds, CPlays, CTraits} from '../components/GuildData';
import {useData} from '../components/DataContext';

import reactStringReplace from 'react-string-replace';
import {GBIconFade} from '../components/GBIcons';
import LinearGradient from 'react-native-linear-gradient';

/* just a GBIcon, unless it's a funky crosssfade for Compound and Lucky */
function GuildIcon(props) {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  const guild = Guilds.find((g) => g.name === props.model.guild1);
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
  const guild = Guilds.find((g) => g.name === model.guild1);

  return (
    <View
      style={{
        width: 500,
        height: 700,
        aspectRatio: 5 / 7,
      }}>
      {/* nameplate */}
      <View
        style={{
          position: 'absolute',
          top: 15,
          width: 335,
          height: 76,
          flexDirection: 'row',
          paddingLeft: 20,
        }}>
        {/* double view wrapped for overflow control (mostly for Falconers)  */}
        <View style={{width: 65, alignItems: 'center'}}>
          <View style={{width: 85, alignItems: 'center'}}>
            {/* lets get stupid here with fade icons for lucky and compound */}
            <GuildIcon
              model={model}
              size={65}
              style={{
                paddingTop: 5,
                textShadowColor: guild.shadow ?? 'transparent',
                textShadowOffset: {width: 0, height: 0},
                textShadowRadius: 15,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: 245,
            // borderWidth: StyleSheet.hairlineWidth,
            // borderColor: 'red',
          }}>
          <View
            style={{
              // marginTop: -1,
              height: 53,
              justifyContent: 'center',
              // borderColor: 'blue',
              // borderWidth: StyleSheet.hairlineWidth,
            }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                color: 'black',
                fontFamily: 'IM_FELL_Great_Primer_DC',
                fontSize: 41,
                letterSpacing: -1,
                // This font is all kinds of wacky with the extra spacing ...
                marginTop: -3,
                marginLeft: -6,
              }}>
              {/* this space and the above marginLeft deal with the capital J
               extending too far to the left and getting clipped if it's the
               first letter in the span */}{' '}
              {model.name}
            </Text>
          </View>
          <Text
            style={{
              position: 'absolute',
              bottom: 1,
              left: 0,
              width: 230,
              color: 'black',
              fontFamily: 'CrimsonText-Regular',
              fontSize: 21,
              borderColor: 'black',
              borderTopWidth: 1,
            }}>
            Melee Zone {model.reach ? '2"' : '1"'}
          </Text>
        </View>
      </View>

      {/* stat box */}
      <View
        style={{
          position: 'absolute',
          top: 104,
          paddingLeft: 24,
          width: 317,
          // backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            borderColor: 'black',
            borderBottomWidth: 1,
          }}>
          <Text style={styles.statBox}>MOV</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>TAC</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>KICK</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>DEF</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>ARM</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>INF</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={styles.statBox}>
            {model.jog}"/{model.sprint}"
          </Text>
          <Text style={[styles.statBox, styles.leftDiv]}>{model.tac}</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>
            {model.kickdice}/{model.kickdist}"
          </Text>
          <Text style={[styles.statBox, styles.leftDiv]}>{model.def}+</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>{model.arm}</Text>
          <Text style={[styles.statBox, styles.leftDiv]}>
            {model.inf}/{model.infmax}
          </Text>
        </View>
      </View>

      {/* playbook */}
      <View
        style={{
          position: 'absolute',
          top: 167,
          left: 24,
          // backgroundColor: 'white',
          // masked background for momentus results, so we can do
          // a gradient for lucky/comound?
          // TODO check all the playbooks with this ...
          // opacity: 0.4,
        }}>
        <View style={{flexDirection: 'row'}}>
          {[...Array(7).keys()].map((key) => {
            const pbm = model.playbook[0][key];
            const [pb, mom] = pbm ? pbm.split(';') : [null, null];
            return pb ? (
              <View
                key={key}
                style={[
                  styles.playbookContainer,
                  mom && {
                    borderColor: guild.darkColor ?? 'black',
                    backgroundColor: guild.shadow ?? guild.color,
                  },
                ]}>
                <Text style={[styles.playbookText, mom && {color: 'white'}]}>
                  {PB(pb)}
                </Text>
              </View>
            ) : (
              <View key={key} style={styles.playbookSpacer} />
            );
          })}
        </View>
        <View style={{flexDirection: 'row'}}>
          {[...Array(7).keys()].map((key) => {
            const pbm = model.playbook[1][key];
            const [pb, mom] = pbm ? pbm.split(';') : [null, null];
            return pb ? (
              <View
                key={key + 7}
                style={[
                  styles.playbookContainer,
                  mom && {
                    borderColor: guild.darkColor ?? 'black',
                    backgroundColor: guild.shadow ?? guild.color,
                  },
                ]}>
                <Text style={[styles.playbookText, mom && {color: 'white'}]}>
                  {PB(pb)}
                </Text>
              </View>
            ) : (
              <View key={key + 7} style={styles.playbookSpacer} />
            );
          })}
        </View>
      </View>

      {/* character play box */}
      <View
        style={{
          position: 'absolute',
          top: 270,
          width: 430,
          // width: 425,
          minHeight: 265,
          maxHeight: 325,
          // backgroundColor: 'white',
          paddingLeft: 24,
          paddingRight: 6,
        }}>
        {/* Header Row */}
        <View
          style={{
            marginBottom: 3,
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: 'black',
            alignItems: 'baseline',
            paddingRight: 6,
          }}>
          <Text
            style={{
              width: 232,
              fontFamily: 'IM_FELL_Great_Primer_DC',
              fontSize: 28,
              letterSpacing: -1,
            }}>
            Character Plays
          </Text>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={[styles.statBox, styles.leftDiv]}>CST</Text>
            <Text style={[styles.statBox, styles.leftDiv]}>RNG</Text>
            <Text style={[styles.statBox, styles.leftDiv]}>SUS</Text>
            <Text style={[styles.statBox, styles.leftDiv]}>OPT</Text>
          </View>
        </View>

        {model.character_plays.map((key) => {
          const cp = CPlays.find((cp) => cp.name === key);
          return (
            <View key={key} style={{marginBottom: 0}}>
              {/* Header Row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  paddingRight: 6,
                }}>
                {/* TODO make this use autoHeader? */}
                <Text
                  style={{
                    width: 232,
                    color: 'black',
                    fontSize: 21,
                  }}>
                  <Text style={{fontFamily: 'CrimsonText-BoldItalic'}}>
                    {cp.name.split('[', 1)[0]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'CrimsonText-SemiBold',
                      letterSpacing: -1,
                    }}>
                    {cp.name.replace(/[^[]*(\[.*\])?/, ' $1')}
                  </Text>
                </Text>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={styles.statBox}>
                    {String(cp.CST)
                      .split(',')
                      .map((s, idx) => {
                        return (
                          <React.Fragment key={idx}>
                            {idx > 0 && <Text>{'/'}</Text>}
                            {{
                              CP: <GBIcon name="GB" size={18} />,
                              CP2: <GBIcon name="GBT" size={18} />,
                            }[s] || <Text>{s}</Text>}
                          </React.Fragment>
                        );
                      })}
                  </Text>
                  <Text style={styles.statBox}>
                    {cp.RNG}
                    {typeof cp.RNG === 'number' && '"'}
                  </Text>
                  <Text style={styles.statBox}>
                    <GBIcon size={14} name={cp.SUS ? 'checkmark' : 'ballotX'} />
                  </Text>
                  <Text style={styles.statBox}>
                    <GBIcon size={14} name={cp.OPT ? 'checkmark' : 'ballotX'} />
                  </Text>
                </View>
              </View>

              {/* Detail Text */}
              <Text
                style={{
                  fontFamily: 'CrimsonText-Regular',
                  fontSize: 21,
                  letterSpacing:
                    // I _hate_ this, but Smoke has way too much text
                    // and this is better that adjusting the font size
                    cp.name.split('[', 1)[0] === 'Infuse' ? -1.5 : -1,
                  lineHeight: 22,
                }}>
                {autoStyle(cp.text)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* health boxes */}
      <View
        style={{
          position: 'absolute',
          bottom: 22,
          left: 24,
          width: (25 + 5.5) * 10,
          flexDirection: 'row',
          flexWrap: 'wrap',
          // opacity: 0.4,
        }}>
        <Observer>
          {() => (
            <>
              {[...Array(model.hp).keys()].map((key) => (
                <View
                  key={key}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 25 / 2,
                    marginRight: 5.5,
                    marginTop: 2,
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
                      fontSize: 18,
                      // ugly hack but it fixes text alignment
                      alignSelf: key + 1 === model.hp ? 'flex-end' : 'center',
                    }}>
                    {(key === 0 && <GBIcon name="skull" size={17} />) ||
                      (key + 1 === model.recovery && (
                        <GBIcon name="bandage" size={22} />
                      )) ||
                      (key + 1 === model.hp && key + 1)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </Observer>
      </View>
    </View>
  );
}

const CardBackOverlay = React.memo(_CardBackOverlay);
function _CardBackOverlay(props) {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;
  const CTraits = data['Character Traits'];

  const model = props.model;
  const guild = Guilds.find((g) => g.name === model.guild1);
  const guild2 = model.guild2
    ? Guilds.find((g) => g.name === model.guild2)
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
        {model.character_traits.map((key) => {
          // need to ignore args
          const ct = CTraits.find(
            (ct) => ct.name === key.replace(/ \[.*\]/, ''),
          );
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
      <Text
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
      </Text>
    </View>
  );
}

export {CardFrontOverlay, CardBackOverlay};
