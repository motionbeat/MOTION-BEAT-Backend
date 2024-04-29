export default function(io){
    io.on("connection", async(socket)=>{
        console.log("Client is connected", socket.id);
        
        socket.on("login", async (userName, cb)=>{
            console.log("backend", userName);
        })
        
        socket.on("disconnect", ()=>{
            console.log("User is disconnected");
        } )
    });
};
