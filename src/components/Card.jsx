import { useState } from "react";
import { useData } from "./DataContext";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import GBImages from "./GBImages";
import "./Card.css";

function Card({ model }) {
  // const { data, loading } = useData();
  // if (loading) {
  //   return null;
  // }

  // const model = data.Models.find((m) => m.id === name);
  // if (GBImages[`${model.id}_gbcp_front`]) {
  //   model.gbcp = true;
  // }

  return (
    <div
      className="card"
      style={{
        width: "5in",
        height: "3.5in",
        display: "flex",
      }}
    >
      <CardFront
        model={model}
        style={{
          maxWidth: "2.5in",
          borderRadius: 0,
          "--scale": "calc(2.5 * 96 / 500)",
        }}
      />
      <CardBack
        model={model}
        style={{
          maxWidth: "2.5in",
          borderRadius: 0,
          "--scale": "calc(2.5 * 96 / 500)",
        }}
      />
    </div>
  );
}

export function FlipCard({ model, controls }) {
  const [flipped, setFlipped] = useState(false);

  // const { data, loading } = useData();
  // if (loading) {
  //   return null;
  // }

  // const model = data.Models.find((m) => m.id === name);
  // if (GBImages[`${model.id}_gbcp_front`]) {
  //   model.gbcp = true;
  // }

  return (
    <div
      className={`flip-card ${flipped ? "flipped" : null}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">
        <CardFront
          className="flip-card-front"
          model={model}
          controls={controls}
          style={{
            maxWidth: "2.5in",
            "--scale": "calc(2.5 * 96 / 500)",
          }}
        />
        <CardBack
          className="flip-card-back"
          model={model}
          style={{
            maxWidth: "2.5in",
            "--scale": "calc(2.5 * 96 / 500)",
          }}
        />
      </div>
    </div>
  );
}
