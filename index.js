const Sequelize = require('sequelize'); //sequelize 임포트
const env = process.env.NODE_ENV || 'development';  //없으면 development 값이 디폴트로 넘어감.
const config = require('../config/config')[env];  //json값이 읽어와서 객체를 가져옴.
//config.json의 객체를 임포트
const User = require('./user'); //모델 임포트
const Post = require('./post'); //모델 임포트
const Hashtag = require('./hashtag'); //모델 임포트

const db = {};  //db라는 빈 객체 생성
const sequelize = new Sequelize(  
  config.database, config.username, config.password, config,
);  //sequelize 객체를 생성 //db연결 안됨.

db.sequelize = sequelize; //속성 달아줌.
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize); //init메서드 호출
Post.init(sequelize); 
Hashtag.init(sequelize);

User.associate(db); //db객체 넘겨서 호출 
Post.associate(db);
Hashtag.associate(db);

module.exports = db;  //db객체를 넘겨준다.

// db.sequelize.models.PostHashtag
// db.sequelize.models.Follow 의 형태로 모델 사용 가능하다.
