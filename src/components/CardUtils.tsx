import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";

import type { Root, Text, Parent, Html, Content } from "mdast";

import { PB } from "./GBIcon";

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

interface GBIconProps {
  icon: string;
}

const customComponents: Components = {
  p: 'span',
  'gb-icon': (props: GBIconProps) => {
    const { icon } = props;
    return <InlinePBIcon icon={icon} />
  }
} as Components;

const iconMap: Record<string, string> = {
  'GB': 'CP',
  'd': 'D',
  'dd': 'DD',
  'p': 'P',
  'pp': 'PP',
  'T': 'T',
  'KD': 'KD',
};

function remarkGBIcons() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (index === undefined || !parent) return;
      const regex = /:([\w]+):/g;
      const newNodes: Content[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: node.value.slice(lastIndex, match.index) } as Text);
        }
        const icon = match[1];
        const resolvedIcon = iconMap[icon] || icon.toUpperCase();
        
        newNodes.push({ 
          type: 'html', 
          value: `<gb-icon icon="${resolvedIcon}"></gb-icon>`
        } as Html);
        lastIndex = regex.lastIndex;
      }

      if (newNodes.length > 0) {
        if (lastIndex < node.value.length) {
          newNodes.push({ type: 'text', value: node.value.slice(lastIndex) } as Text);
        }
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length;
      }
    });
  };
}

export const CardText = (props: { children: string | undefined }) => {
  if (!props.children) return null;

  return (
    <Markdown
      components={customComponents}
      remarkPlugins={[remarkGBIcons]}
      rehypePlugins={[rehypeRaw]}
    >
      {props.children}
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
