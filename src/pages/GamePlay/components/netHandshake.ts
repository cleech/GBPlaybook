
export type HandshakeInitMessage = {
  type: "handshake-begin";
};
export type HandshakeResponseMessage = {
  type: "handshake-response";
  yourId: string;
  code: number;
};
export type HandshakeJoinMessage = {
  type: "handshake-join";
  code: number;
};
export type HandshakeCompleteMessage = {
  type: "handshake-complete";
  yourId: string;
  otherId: string;
};

export type HandshakeMessage = HandshakeInitMessage |
  HandshakeResponseMessage |
  HandshakeJoinMessage |
  HandshakeCompleteMessage;

export interface HandshakeIDs {
  uid: string;
  oid: string;
  gid: string;
}
