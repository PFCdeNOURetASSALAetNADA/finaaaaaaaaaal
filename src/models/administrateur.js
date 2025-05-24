const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');

class Administrateur extends Model {}

Administrateur.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mot_de_passe: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'Administrateur',
  tableName: 'administrateurs',
  timestamps: false
});

// دالة للتحقق من بيانات تسجيل الدخول
Administrateur.authentifier = async function(email, mot_de_passe) {
  try {
    const administrateur = await Administrateur.findOne({ where: { email } });

    if (!administrateur) {
      return null; // المستخدم غير موجود
    }

    // التحقق من كلمة المرور (نص عادي)
    const valid = (mot_de_passe === administrateur.mot_de_passe);

    if (!valid) {
      return null; // كلمة المرور غير صحيحة
    }

    return administrateur; // بيانات الاعتماد صحيحة
  } catch (error) {
    console.error('خطأ في دالة authentifier للمسؤول:', error);
    throw error; // إعادة إطلاق الخطأ للسماح للمتحكم بالتعامل معه
  }
};

module.exports = Administrateur;
