const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {  //Hashtag 모델을 위한 
  static init(sequelize) {  //테이블 생성을 위해 호출되는 메소드
    return super.init({ //부모클래스에 있는 init호출  //id 필드는 자동으로 프라이머리키로서 생성
      title: {  //해시태그명 
        type: Sequelize.STRING(15), //데이터 타입 15짜리 처리
        allowNull: false, //null처리 할 수 없다.
        unique: true, //
      },
    }, {
      sequelize,   //DB서버와 연결하는 객체
      timestamps: true,  //createdAt, updatedAt컬럼 자동생성
      underscored: false, 
      modelName: 'Hashtag',
      tableName: 'hashtags',
      paranoid: false,  //deletedAt 자동 생성하지 않음.
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {  //다른 모델과의 관계설정
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });  //해시태그는 많은 게시글에 속할 수 있다.
  }
};
