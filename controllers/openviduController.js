import OV from "../utils/openvidu.js";

const openviduController = {
    makeSession : async (req, res)=>{
        try {
            // Create a new session in OpenVidu
            const session = await OV.createSession();
    
            // Return the session ID to the client
            res.status(200).json({ sessionId: session.getSessionId() });
        } catch (error) {
            console.error("Error creating video session:", error);
            res.status(500).json({ error: "Failed to create video session" });
        }
    }
}

export default openviduController;