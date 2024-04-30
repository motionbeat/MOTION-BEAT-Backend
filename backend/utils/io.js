export default function(io){
    io.on("connection", async(socket)=>{
        console.log("Client is connected", socket.id);
        
        socket.on("login", async (nickname, cb)=>{
            console.log("backend", nickname);
            cb({ok: true});
        })
        
        socket.on("disconnect", ()=>{
            console.log("User is disconnected");
        } )
    });
};

