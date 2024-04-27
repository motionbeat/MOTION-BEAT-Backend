import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [pw, setPw] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_API_URL
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        // if (!email || !pw) {
        //     alert('이메일과 비밀번호를 모두 입력해주세요.');
        //     return;
        // }
        setIsLoading(true);

        const formData = {
            email,
            nickname,
            pw
        };

        try {
            console.log(backendUrl)
            const response = await axios.post(`${backendUrl}/api/users/signup`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.setItem('userToken', response.data.token); // 로그인 성공 시 토큰 저장
            localStorage.setItem('userId', response.data.userId); // 사용자 ID 저장
            alert('로그인에 성공하였습니다.');
        } catch (error) {
            setIsLoading(false);
            if (axios.isAxiosError(error) && error.response) {
                const message = error.response.data?.message || '없는 계정이거나 비밀번호가 틀렸습니다. 다시 시도해주세요.';
                alert(message);
            } else {
                alert('네트워크 오류가 발생했습니다.');
            }
        }
    };

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="이메일" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="닉네임" onChange={(e) => setNickname(e.target.value)} />
                    <input type="password" placeholder="비밀번호" onChange={(e) => setPw(e.target.value)} />
                    <button type="submit">버튼</button>
                </form>
            </div>
        </>
    )
}
export default Login