import OpenVidu from "openvidu-node-client";

const OV = new OpenVidu(process.env.OPENVIDU_URL, process.env.OPENVIDU_SECRET);

export default OV;