import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";

const iceConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
    { urls: "stun:relay.metered.ca:80" },
    {
      urls: "turn:relay.metered.ca:80",
      username: process.env.REACT_APP_METERED_USERNAME,
      credential: process.env.REACT_APP_METERED_PASSWORD,
    },
    {
      urls: "turn:relay.metered.ca:443",
      username: process.env.REACT_APP_METERED_USERNAME,
      credential: process.env.REACT_APP_METERED_PASSWORD,
    },
    {
      urls: "turn:relay.metered.ca:443?transport=tcp",
      username: process.env.REACT_APP_METERED_USERNAME,
      credential: process.env.REACT_APP_METERED_PASSWORD,
    },
  ],
};
interface RTCContextValues {
  pc?: RTCPeerConnection;
  dc?: RTCDataChannel;
  newPc: (config?: RTCConfiguration) => RTCPeerConnection;
  setDc: (channel?: RTCDataChannel) => void;
}

const RTCContext = createContext<RTCContextValues>({
  pc: undefined,
  newPc: (config?: RTCConfiguration) =>
    new RTCPeerConnection(config ?? iceConfig),
  dc: undefined,
  setDc: (channel?: RTCDataChannel) => {},
});

export const RTCProvider = ({ children }: { children: ReactNode }) => {
  const [pc, setPc] = useState<RTCPeerConnection | undefined>(undefined);
  const [dc, setDc] = useState<RTCDataChannel | undefined>(undefined);
  const newPc = useCallback(
    (config?: RTCConfiguration) => {
      const pc = new RTCPeerConnection(config ?? iceConfig);
      setPc(pc);
      return pc;
    },
    [setPc]
  );
  return (
    <RTCContext.Provider value={{ pc, newPc, dc, setDc }}>
      {children}
    </RTCContext.Provider>
  );
};

export const useRTC = () => useContext(RTCContext);