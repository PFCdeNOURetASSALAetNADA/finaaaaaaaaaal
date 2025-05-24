const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

class Utilisateur extends Model {
  /**
   * دالة تحقق الدخول
   * @param {string} email
   * @param {string} mot_de_passe
   * @param {Model} ModelClass - الكلاس الفرعي (Abonne, Administrateur, ...)
   * @returns {object|null} المستخدم إذا كان صحيحًا، أو null إذا كان خاطئًا
   */
  static async authentifier(email, mot_de_passe, ModelClass) {
    // ابحث عن المستخدم حسب الإيميل
    const utilisateur = await ModelClass.findOne({ where: { email } });
    if (!utilisateur) return null;

    // تحقق من كلمة المرور
    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!isMatch) return null;

    // إذا كان كل شيء صحيح، أرجع بيانات المستخدم
    return utilisateur;
  }
}

module.exports = Utilisateur;