class Kakao {
    constructor() {
      this.key = process.env.KAKAO_KEY;
      this.redirectUri = `http://localhost:3000/callback/kakao`;
    }
  
    /**
     * @description 카카오 인가코드를 받기위한 URL 가져오기
     */
    getAuthCodeURL() {
      return `https://kauth.kakao.com/oauth/authorize?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code`;
    }
  }
  
  export const KakaoClient = new Kakao();