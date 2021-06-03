const Sequelize = require('sequelize');
//사용자 정보를 저장하는 모델.

module.exports = class User extends Sequelize.Model { //user 모듈을 위한 
  static init(sequelize) {   //테이블 생성을 위해 호출되는 메소드
    return super.init({ //부모클래스에 있는 init호출  //id 필드는 자동으로 프라이머리키로서 생성
      //field설정
      email: {  //이메일
        type: Sequelize.STRING(40),
        allowNull: true,  //null처리 할 수 있다.
        unique: true, //
      },
      nick: { //닉네임
        type: Sequelize.STRING(15),   //데이터 타입 15짜리 처리
        allowNull: false, //not null
      },
      password: { //비밀번호
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // provider: {  
      //   type: Sequelize.STRING(10),
      //   allowNull: false,
      //   defaultValue: 'local',
      // },
      // snsId: {
      //   type: Sequelize.STRING(30),
      //   allowNull: true,
      // },
    }, {
      sequelize,  //DB서버와 연결하는 객체
      timestamps: true, //createdAt, updatedAt컬럼 자동생성
      underscored: false, //true이면 created_at으로 자동 생성
      modelName: 'User',
      tableName: 'users',
      paranoid: true, //deletedAt 자동 생성
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {  
    // db.User.hasMany(db.Post);  //사용자는 게시글을 다수 가질 수 있다.
    // db.User.belongsToMany(db.User, { //사용자는 여러 사용자에게 팔로잉될 수 있다.
    //   foreignKey: 'followingId', // followingId가 외래키
    //   as: 'Followers', //Followers형태로서 조회
    //   through: 'Follow', //Follow모델이 중간매개 모델
    // });
    // db.User.belongsToMany(db.User, { //사용자는 여러 사용자에게 팔로워로서 역할함
    //   foreignKey: 'followerId',
    //   as: 'Followings',
    //   through: 'Follow',
    // });
  }
};

