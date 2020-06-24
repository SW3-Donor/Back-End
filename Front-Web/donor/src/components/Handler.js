class Handler {

  // 자동 로그아웃
  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  // 로그아웃
  logoutHandler = () => {
    this.setState({ isAuth: false, token: null, userId: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  // 로그인
  loginHandler = (event, authData) => {
    event.persist();
    this.setState({ authLoading: true });
    fetch("http://172.19.1.65:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({
          isAuth: true,
          token: resData.token,
          authLoading: false,
          userId: resData.userId,
        });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        // 1시간 설정
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch((err) => {
        console.log("실행되냐?", err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  // 회원가입
  signupHandler = (event, authData) => {
    event.persist();
    this.setState({ authLoading: true });
    fetch("http://172.19.1.65:8080/auth/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.email,
        name: authData.name,
        password: authData.password,
        phone: authData.phone,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        this.setState({
          isAuth: false,
          authLoading: false,
          userId: resData.userId,
        });
        // localStorage.setItem("userId", resData.userId);
      })
      .catch((err) => {
        console.log("실행되냐?", err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  // 헌혈증 등록
  bloodHandler = (event, blood) => {
    event.persist();
    this.setState({ authLoading: true });
    fetch("http://172.19.1.65:8080/blood/register", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.state.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: blood.number,
        secondpassword: blood.password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({ isAuth: false, authLoading: false });
      })
      .catch((err) => {
        console.log("실행되냐?", err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  // 2차 비밀번호 생성
  pwHandler = (event, authData) => {
    event.persist();
    this.setState({ authLoading: true });
    fetch("http://172.19.1.65:8080/auth/password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secondpassword: authData.password,
        userId: this.state.userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({ isAuth: false, authLoading: false });
      })
      .catch((err) => {
        console.log("실행되냐?", err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };
}

export default Handler;