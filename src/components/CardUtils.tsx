import { useEffect, useState } from "react";
import Handlebars from "handlebars";
import asyncHelpers from "handlebars-async-helpers-ts";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";

import { getGBDatabase } from "../models/gbdb";
import { PB } from "./GBIcon";

const hb = asyncHelpers(Handlebars);

hb.registerHelper("d", () => new hb.SafeString('<gb-icon icon="D"></gb-icon>'));
hb.registerHelper("dd", () => new hb.SafeString('<gb-icon icon="DD"></gb-icon>'));
hb.registerHelper("p", () => new hb.SafeString('<gb-icon icon="P"></gb-icon>'));
hb.registerHelper("T", () => new hb.SafeString('<gb-icon icon="T"></gb-icon>'));
hb.registerHelper("KD", () => new hb.SafeString('<gb-icon icon="KD"></gb-icon>'));
hb.registerHelper("GB", () => new hb.SafeString('<gb-icon icon="CP"></gb-icon>'));

hb.registerHelper("trait", async (name: string, ...rest: any[]) => {
  const gbdb = await getGBDatabase();
  const trait = await gbdb?.character_traits.findOne(name).exec().then(doc => doc?.toJSON());
  if (!trait) {
    console.error(`can not find trait ${name}`);
    return;
  }
  const qualifier = (rest.length > 1) ? rest[0] : undefined;
  const depth = (rest[rest.length - 1].data.root.depth);
  if (depth === 1) {
    const template = hb.compile(trait?.text);
    const text = await template({ depth: 2 });
    return new hb.SafeString(`(_${trait?.name}${qualifier ? ` [${qualifier}]` : ''}: ${text}_)`);
  } else {
    return new hb.SafeString(`(_${trait?.name}${qualifier ? ` [${qualifier}]` : ''}: ${trait?.text}_)`);
  }
});

hb.registerHelper("play", async (name: string, ...rest: any[]) => {
  const gbdb = await getGBDatabase();
  const play = await gbdb?.character_plays.findOne(name).exec().then(doc => doc?.toJSON());
  if (!play) {
    console.error(`can not find play ${name}`);
    return;
  }
  const qualifier = (rest.length > 1) ? rest[0] : undefined;
  const depth = (rest[rest.length - 1].data.root.depth);
  if (depth === 1) {
    const template = hb.compile(play?.text);
    const text = await template({ depth: 2 });
    return new hb.SafeString(`(_${play?.name}${qualifier ? ` [${qualifier}]` : ''}: ${text}_)`);
  } else {
    return new hb.SafeString(`(_${play?.name}${qualifier ? ` [${qualifier}]` : ''}: ${play?.text}_)`);
  }
});

const InlinePBIcon = (props: { icon: string }) => (
  <span
    style={{
      display: "inline-flex",
      width: "2ch",
      height: "1ex",
      position: "relative",
      overflow: "visible",
    }}
  >
    <div
      style={{
        display: "flex",
        overflow: "visible",
        width: "2ch",
        height: "2ch",
        backgroundColor: "white",
        border: "var(--line-width) solid black",
        borderRadius: "50%",
        position: "absolute",
        alignSelf: "center",
        justifySelf: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PB icon={props.icon} style={{ height: '1.8ex', overflow: 'visible' }} />
    </div>
  </span>
);

const customComponents: Components = {
  p: 'span',
  // @ts-ignore
  'gb-icon': (props: { icon: string }) => {
    const { icon } = props;
    return <InlinePBIcon icon={icon} />
  }
}

export const CardText = (props: { children: string }) => {
  const template = hb.compile(props.children);

  const [text, setText] = useState<string>();
  useEffect(() => {
    const fetchData = async () => {
      const text = await template({ depth: 1 });
      setText(text);
    }
    fetchData();
  }, []);

  return (
    <Markdown
      components={customComponents}
      rehypePlugins={[rehypeRaw]}
    >
      {text}
    </Markdown>
  );
}

export function toClassName(s: string): string {
  return s.split('[', 1)?.[0].replace(/[\W]/g, '');
}

/*
const textIconReplace = (text: string | Array<string>) => {
  let replacedtext = reactStringReplace(text, /\(◉(.*?)\)/g, (match, index) => (
    <React.Fragment key={`i - a - ${index} `}>
      (◉
      <span
        style={{
          fontStyle: "italic",
        }}
      >
        {match}
      </span>
      )
    </React.Fragment>
  ));

  replacedtext = reactStringReplace(
    replacedtext,
    /\(([^◉].*?)\)/g,
    (match, index) => (
      <React.Fragment key={`i - ${index} `}>
        (
        <span
          style={{
            fontStyle: "italic",
          }}
        >
          {match}
        </span>
        )
      </React.Fragment>
    )
  );

  replacedtext = reactStringReplace(
    replacedtext,
    /{([<>TKDGB]+)}/,
    (match, index) => {
      return (
        <React.Fragment key={`pb - ${index} `}>
          <span
            style={{
              display: "inline-flex",
              width: "1em",
              height: "1ex",
              position: "relative",
              overflow: "visible",
            }}
          >
            <div
              style={{
                display: "flex",
                overflow: "visible",
                width: "1em",
                height: "1em",
                backgroundColor: "white",
                border: "var(--line-width) solid black",
                borderRadius: "50%",
                position: "absolute",
                alignSelf: "center",
                justifySelf: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PB
                icon={
                  match
                    // .replace(",", "-")
                    .replace(/GB/g, "CP")
                  // .replace(/</g, "D")
                  // .replace(/>/g, "P")
                }
              // size={21}
              // color="black"
              // removeInlineStyle={true}
              />
            </div>
          </span>
        </React.Fragment>
      );
    }
  );

  replacedtext = reactStringReplace(
    replacedtext,
    /\b([A-Z]+)\b/g,
    (match, index) => (
      <span
        key={`tla - ${index} `}
        style={{
          letterSpacing: "-1px",
        }}
      >
        {match}
      </span>
    )
  );

  return <>{replacedtext}</>;
};
*/
