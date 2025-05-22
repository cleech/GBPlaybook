import gbpbLogo from "../assets/gbpb.svg";

export default function LoadingSplash() {
    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img
                src={gbpbLogo}
                alt="GBPlaybook"
                style={{
                    width: "min(50vw, 50vh)",
                    display: "block",
                    filter: "drop-shadow(2vw 2vw 1vw black)",
                    opacity: 0.5,
                }}
            />
        </div>
    );
}
