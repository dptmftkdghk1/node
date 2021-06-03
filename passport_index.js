const passport = require('passport');
const local = require('./localStrategy'); //.은 현재 폴더
//로그인 실행의 동작(전략)을 임포트 //전략: 로그인 과정이 어떻게 진행될지 지정.
const User = require('../models/user'); //..:passport의 상위폴더를 임포트

module.exports = () => { //(콜백함수) 콜백함수가 passport를 하겠다.
  passport.serializeUser((user, done) => {  //로그인 시도시 호출, user 매개변수 - 사용자 정보 객체 // req.session에 정보가 저장됨.
    done(null, user.id);  //done => req.session정보를 저장할 때 어떤 정보를 저장할 지 결정 //user객체의 id정보만 req.session에 저장
  });

  passport.deserializeUser((id, done) => {  //로그인 하고 나면 deserializeUser가 계속 호출.
    //매 요청에 대해 호출, passport.session 미들웨어에서 호출
    User.findOne({ where: { id } }) 
      .then(user => done(null, user)) //user정보를 user객체 담아서 보낸다.
      .catch(err => done(err)); 
  });

  local();  //함수
};
