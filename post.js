const Sequelize = require('sequelize'); //시퀄라이즈 임포트 

module.exports = class Post extends Sequelize.Model { //post 모듈을 위한 
  static init(sequelize) {  //테이블 생성을 위해 호출되는 메소드
    return super.init({ //부모클래스에 있는 init호출  //id 필드는 자동으로 프라이머리키로서 생성
      //field설정
      content: {  //내용
        type: Sequelize.STRING(140),  //데이터 타입 140짜리 처리
        allowNull: false, //null처리 할 수 없다.
      },
      img: {  //이미지
        type: Sequelize.STRING(200),  //데이터 타입 200짜리 처리
        allowNull: true,  //null처리 할 수 있다.
      },
    }, {
      sequelize,  //DB서버와 연결하는 객체
      timestamps: true, //createdAt, updatedAt컬럼 자동생성
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,  //deletedAt 자동 생성하지 않음.
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User); //게시글은 사용자에게 속해있다. 1:n
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  }//게시글은 많은 해시태그에 속해 질 수 있다.
};
