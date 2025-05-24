require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const emailService = require('./services/emailService');

// Connexion à la base de données MySQL via Sequelize
const sequelize = require('./models/index');

const app = express();

// Utilisation des middlewares
// Configuration CORS détaillée للسماح بالطلبات من الواجهة الأمامية على المنفذ 3001 مع بيانات الاعتماد
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3002'], // يمكن تعديل هذا حسب منافذ الواجهة الأمامية لديك
  credentials: true, // مهم جداً للسماح بإرسال الكوكيز والاعتمادات
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // تحديد الطرق المسموح بها
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'] // تحديد الرؤوس المسموح بها
}));

app.use(express.json()); // لتحليل طلبات JSON
app.use(morgan('dev')); // لتسجيل الطلبات في وحدة التحكم

// Routes
const administrateurRoutes = require('./routes/administrateur');
const superviseurRoutes = require('./routes/superviseur');
const operateurRoutes = require('./routes/operateur');
const abonneRoutes = require('./routes/abonne');
const reclamationRoutes = require('./routes/reclamation');

// Use routes
app.use('/api/administrateurs', administrateurRoutes);
app.use('/api/superviseurs', superviseurRoutes);
app.use('/api/operateurs', operateurRoutes);
app.use('/api/abonnes', abonneRoutes);
app.use('/api/reclamations', reclamationRoutes);

// نقطة اختبار للواجهة الأمامية
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue à l\'API de réclamation Sonelgaz' });
});

// نقطة اختبار لإرسال بريد إلكتروني (يمكن الوصول إليها عبر GET /test-email)
app.get('/test-email', async (req, res) => {
  try {
    // استخدم بريد إلكتروني حقيقي للاختبار بدلاً من المتغير البيئي إذا لزم الأمر
    const testEmail = process.env.SMTP_USER; 
    if (!testEmail) {
        return res.status(500).json({ error: 'عنوان البريد الإلكتروني للاختبار غير محدد في .env' });
    }
    const result = await emailService.sendVerificationEmail(
      testEmail, // سيتم إرساله إلى هذا العنوان
      '123456', // رمز تحقق للاختبار
      'Test',
      'User'
    );

    if (result) {
      res.json({ message: 'E-mail de vérification envoyé avec succès. Veuillez vérifier votre boîte de réception.' });
    } else {
      res.status(500).json({ error: 'Échec في إرسال البريد الإلكتروني، تحقق من إعدادات SMTP في .env' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de courriel:', error);
    res.status(500).json({ error: error.message });
  }
});


// Gestion générale للأخطاء (middleware)
app.use((err, req, res, next) => {
  console.error(err.stack); // تسجيل الخطأ الكامل في وحدة التحكم للخادم
  res.status(500).json({
    status: 'error',
    message: err.message || 'Une erreur est survenue sur le serveur' // عرض رسالة خطأ أكثر وضوحاً
  });
});

// الدفء، بدء الاتصال بقاعدة البيانات ثم بدء تشغيل الخادم
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à la base de données MySQL réussie');

    // Sync database tables
    return sequelize.sync({ alter: true }); // alter: true سيعدل الجداول الموجودة لتتوافق مع النماذج دون إسقاطها
  })
  .then(() => {
    console.log('📦 Tables synchronisées !');
    // بدء تشغيل الخادم بعد نجاح الاتصال بقاعدة البيانات والمزامنة
    app.listen(PORT, () => {
      console.log(`🚀 Le serveur fonctionne sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à la base de données أو مزامنة الجداول:', err);
    // يمكن إنهاء العملية هنا إذا فشل الاتصال بقاعدة البيانات
    process.exit(1); 
  });

// يمكن تصدير app إذا كنت تحتاج إلى استخدامه في مكان آخر (اختياري)
// module.exports = app;