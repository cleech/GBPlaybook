import gbpbLogo from "../assets/gbpb.svg";

export default function LoadingSplash() {
    return (
        <div
            style={{
                minHeight: "100vh",
                minWidth: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img
                src={gbpbLogo}
                alt="GBPlaybook"
                style={{
                    width: "180px",
                    height: "180px",
                    display: "block",
                    filter: "drop-shadow(0 0 16px #0008)",
                    opacity: 0.5,
                }}
            />
        </div>
    );
}