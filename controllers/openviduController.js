import OV from "../utils/openvidu.js";

const openviduController = {
    makeSession : async (req, res)=>{
        try {
            // Create a new session in OpenVidu
            const session = await OV.createSession(req.body);

            // Return the session ID to the client
            // res.status(200).json({ sessionId: [session.sessionId] });
            res.status(200).send(session.sessionId);
        } catch (error) {
            console.error("Error creating video session:", error);
            res.status(500).json({ error: "Failed to create video session" });
        }
    },
    sessionToken : async (req, res)=>{
        try{
            const session = OV.activeSessions.find(
                (s) => s.sessionId === req.params.sessionId
            );
            if (!session){
                // res.status(404).json({ message: "Session not found" });
                res.status(404).send();
            } else {
                // const connection = await session.createConnection();
                const connection = await session.createConnection(req.body);
                // res.status(200).json({ ovToken: connection.token });
                res.status(200).send(connection.token);
            }
        } catch(err) {
            res.status(500).json({ error: "Failed to join video session" });
        }
    }
}

export default openviduController;