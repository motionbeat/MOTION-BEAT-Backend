import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login";
import Room from "./pages/room";
import Main from "./pages/main";
import Mypage from "./pages/mypage";
import Playtype from "./pages/playtype";
import Tutorial from "./pages/tutorial";
import Ranking from "./pages/ranking";
import Setting from "./pages/setting";
import Signup from "./pages/signup";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/main" element={<Main />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/playtype" element={<Playtype />} />
                <Route path="/tutorial" element={<Tutorial />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/room" element={<Room />} />
            </Routes>
    </BrowserRouter>
    );
}

export default App;
