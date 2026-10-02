const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());

// ربط ملفات الواجهة الأمامية
app.use(express.static(path.join(__dirname)));

// مسار الصفحة الرئيسية لعرض الموقع
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// مسار التحميل عبر Cobalt API
app.post('/api/download', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'الرجاء إدخال رابط صالح' });
        }

        const response = await fetch('https://co.wuk.sh/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                vQuality: 'max',
                filenamePattern: 'classic'
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'فشل الاتصال بخدمة التحميل، حاول مرة أخرى لاحقاً.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
