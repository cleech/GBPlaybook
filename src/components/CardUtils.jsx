import React from "react";
import reactStringReplace from "react-string-replace";
// import { PBIcon } from "./GBIcon";
import { PB } from "./GBIcon";
export { textIconReplace };

function textIconReplace(text) {
  let replacedtext = reactStringReplace(
    text,
    /\(◉(.*?)\)/g,
    (match, index, offset) => (
      <React.Fragment key={`i-a-${index}`}>
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
    )
  );

  replacedtext = reactStringReplace(
    replacedtext,
    /\(([^◉].*?)\)/g,
    (match, index, offset) => (
      <React.Fragment key={`i-${index}`}>
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
    /([<>TKDGB]+) playbook result/,
    (match, index, offset) => {
      return (
        <React.Fragment key={`pb-${index}`}>
          <span
            style={{
              display: "inline-flex",
              /* this should match the contained icon */
              width: "21px",
              /* this is matched to the x-hight of the text */
              // height: "11px",
              height: "1ex",
              overflow: "visible",
            }}
          >
            <div
              style={{
                display: "flex",
                overflow: "visible",
                width: "21px",
                height: "21px",
                backgroundColor: "white",
                border: "var(--line-width) solid black",
                borderRadius: "21px",
                position: "absolute",
                alignSelf: "center",
                justifySelf: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* {/* <PBIcon */}
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
          {" playbook result"}
        </React.Fragment>
      );
    }
  );

  replacedtext = reactStringReplace(
    replacedtext,
    /\b([A-Z]+)\b/g,
    (match, index, offset) => (
      <span
        key={`tla-${index}`}
        style={{
          letterSpacing: "-1px",
        }}
      >
        {match}
      </span>
    )
  );

  return <>{replacedtext}</>;
}
