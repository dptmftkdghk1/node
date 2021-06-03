const express = require('express'); //express모듈 임포트 
const cookieParser = require('cookie-parser'); //cookie-parser모듈 임포트
const morgan = require('morgan'); //morgan모듈 임포트
const path = require('path'); //path모듈 임포트
const session = require('express-session'); //express-session모듈 임포트
const nunjucks = require('nunjucks'); //nunjucks모듈 임포트
const dotenv = require('dotenv'); //dotenv모듈 임포트
const passport = require('passport'); //passport모듈 임포트


dotenv.config(); //process.env에 .env파일 내용 읽어서 설정 
//dotenv의 패키지 이름이 dot(점) + env
const pageRouter = require('./routes/page'); //pageRouter을 ./routes/page로 요청함.
const authRouter = require('./routes/auth');  //authRouter을 ./routes/auth로 요청함.
const { sequelize } = require('./models');  //비구조화 할당으로 sequelize만 반환.
const passportConfig = require('./passport');  // passport 폴더의 index.js를 임포트

const app = express(); //express모듈을 실행해 qpp변수에 할당. 익스프레스 내부에 http 모듈이 내장되어 있으므로 서버의 역할을 할 수 있음.
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 3001); //app.set -> ('port', 포트)로 서버가 실행될 포트를 설정. 
//process.env객체에 Port속성이 있으면 그 값을 사용,없다면 기본값으로 3001번 포트를 이용.

// * app.set(키,값)을 사용해서 데이터를 저장. 나중에 app.get(키)로 가져올 수 있음.
// * app.get(주소, 라우터)는 주소에 대한 GET 요청이 올 때 어떤 동작을 할 지 적는 부분.
// * req(요청에 관한 정보가 들어 있는 객체), res(응답에 관한 정보가 들어 있는 객체)
app.set('view engine', 'html'); //view engine은 어떠한 종류의 템플릿 엔진을 사용할지 나타냄. //html 사용. //확장자를 html를 사용하겠다는 설정
nunjucks.configure('views', { //configure의 첫번째 인수로 views 폴더의 경로를 넣음. 
 // 두 번째 인수 => 옵션
  express: app, //express속성에 app 객체를 연결
  watch: true,  //watch옵션이 true => HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링.
});
sequelize.sync({ force: false }) //db.sequelize를 불러와서 sync 메서드를 사용해 서버 실행시 MYSQL과 연동.
//force:false 옵션 => true로 설정하면 서버 실행시마다 테이블 재생성.  
  .then(() => { //프로미스로 처리
    console.log('데이터베이스 연결 성공'); //DB연결 성공
  })
  .catch((err) => { //err객체 연결
    console.error(err);
  });

// * app.use(미들웨어): 모든 요청에서 미들웨어 실행
// * app.use('/abc' , 미들웨어): abc로 시작하는 요청에서 미들웨어 실행

app.use(morgan('dev')); //morgan 미들웨어 //인수로 dev사용
//dev 모드 기준: GET /500 7.409 ms - 50은 각각 [http메서드] [주소] [HTTP 상태코드] [응답속도]-[응답 바이트]
//요청과 응답을 한눈에 볼 수 있음.
//morgan 미들웨어 사용법: app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public'))); //static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 함. 기본적으로 제공됨.
// express객체 안에서 꺼내 장착. //app.use('요청 경로', express.static('실제경로'));
//app.use('/' , express.static(path.join(__dirname, 'public'))); 
//--함수의 인수로 정적 파일들을 담겨 있는 폴더를 지정. ex) 현재 public 폴더가 지정되어 있음.
//ex) public/stylesheets/style.css --> http://localhost:3000/stylesheets/style.css로 접근.
//실제 서버의 폴더 경로에는 public이 들어있음, 하지만 요청주소에는 public이 들어 있지 않음.
//==> http://localhost:3000/stylesheets/style.css 요청 실제 파일은 public/stylesheets/style.css 라는 사실

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//body-parser 미들웨어: 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어
//폼 데이터나 AJAX요청의 데이터를 처리 //단, (이미지, 동영상, 파일) 데이터 처리 불가 --> multer모듈
//body-parser 사용법 => 익스프레스 4.16.0버전부터 body-parser 미들웨어의 일부 기능이 내장
//app.use(express.json());
//app.use(express.urlencoded({ extended: false}));
//코드 해석 app.use(express.json()); --> JSON 형식의 데이터 전달 방식
//app.use(express.urlencoded({extended: false})); --> 폼 전송을 URL-encoded방식을 사용.
//{ extended: false} 옵션 ==> false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석, true면 qs 모듈을 사용하여 쿼리스트링 해석.
//*qs 모듈은 내장 모듈X npm패키지(querystring 모듈의 기능을 좀 더 확장한 모듈)

//body-parser은 내부적으로 스트림을 처리해 req.body에 추가.
//ex) JSON 형식{name:'zerocho', book: 'nodejs' }를 본문으로 보낸다면, req.body에 그대로 들어감.
//    URL-encoded 형식으로 name=zerocho&book=node.js를 본문으로 보낸다면, req.body에 { name: 'zerocho' , book: 'nodejs' } 가 들어감.

app.use(cookieParser(process.env.COOKIE_SECRET)); //config가 처리 //req.cookies.name //process.env.COOKIE_SECRET에 cookiesecret값이 할당.
app.use(session({
  resave: false,  //resave요청이 올때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정//필요없으므로 false
  saveUninitialized: false, //세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정 //필요없어서 false
  secret: process.env.COOKIE_SECRET,  //세션 관리 시 클라이언트에 쿠키를 보냄. //세션 쿠키의 기본 이름: connect.sid
  //안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는데 secret의 값이 필요. 
  cookie: {   //쿠키 옵션: 세션 쿠키에 대한 설정
    httpOnly: true, //클라이언트에서 쿠키를 확인하지 못하도록 함.
    secure: false,  //https가 아닌 환경에서도 사용할 수 있게 함.
  },
  name: 'session-cookie',
}));
//세션 관리용 미들웨어 //로그인 등의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 씀.
//사용자별로 req.session 객체 안에 유지
//인수로 세션에 대한 설정을 받음.


app.use(passport.initialize()); //passport는 npm i passport
app.use(passport.session());

app.use('/', pageRouter); //pageRouter를 씀. 주소가 인덱스 "/"일 경우 pageRouter가 처리. //page의 '/'와 get의 '/'이 합쳐져 GET /라우터가 되었음.
app.use('/auth', authRouter); //authRouter를 씀. 주소가 인덱스 "/auth"일 경우 authRouter가 처리. //auth의 '/auth'이 합쳐져 POST /auth 라우터가 됨.

//에러처리 미들웨어
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);  
  error.status = 404;
  next(error);  //next(error)에서 넘겨준 인수가 에러 처리 미들웨어인 err로 연결.
});
//에러 발생시 res.locals.message는 '${req.method} ${req.url} 라우터가 없습니다' 가 된다.

app.use((err, req, res, next) => {  //에러처리 미들웨어인 error라는 템플릿 파일을 렌더링함.
  res.locals.message = err.message; 
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};  //error객체의 스택 트레이스(error.html의 error.stack)
  //error객체의 스택 트레이스(error.html의 error.stack)
  //시스템 환경(process.env.NODE_ENV)이
  //production(배포 환경)이 아닌 경우에만 표시. //배포환경인 경우에 에러메시지만 표시.
  //res.locals.message와 res.locals.error에 넣어준 값을 함께 렌더링.
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => { //http 웹 서버와 동일. 포트를 연결하고 서버를 실행. 포트는 app.get('port')로 가져옴.
  console.log(app.get('port'), '번 포트에서 대기중'); 
});//해당할 포트번호를 뿌리는 것
