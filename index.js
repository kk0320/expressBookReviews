const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// セッション管理の設定
app.use(
    "/customer",
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

// 認証ミドルウェア
app.use("/customer/auth/*", function auth(req, res, next) {
    // セッションからアクセストークンを取得
    if (req.session.authorization) {
        const token = req.session.authorization["accessToken"];
        // トークンを検証
        jwt.verify(token, "fingerprint_customer", (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Unauthorized access" });
            } else {
                req.user = decoded;
                next(); // 次のミドルウェアまたはエンドポイントへ進む
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

// ルートの統合
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// サーバー起動
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
