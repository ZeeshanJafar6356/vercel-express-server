const express = require("express");
const app = express();
const cors = require("cors");
require("../db/conn");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("../model/userSchema");
const {
    CLIENT_ID,
    CLIENT_SECRET,
    PORT,
    FRONTEND_URL,
    CALL_BACK_URL,
} = require("../config");

app.use(
    cors({
        credentials: true,
        origin: FRONTEND_URL,
        methods: "GET,POST,PUT,DELETE",
    })
);

app.use(express.json());

// setup session
app.use(
    session({
        secret: "YOUR SECRET KEY",
        resave: false,
        saveUninitialized: true,
    })
);

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: CALL_BACK_URL,
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userdb.findOne({ googleId: profile.id });

                if (!user) {
                    user = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// root url
app.get("/", (req, res) => {
    res.json({
        CLIENT_ID,
        CLIENT_SECRET,
        PORT,
        FRONTEND_URL,
        CALL_BACK_URL,
        MESSAGE: `server start at port no ${PORT}`,
    });
});

// initial google ouath login
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    CALL_BACK_URL,
    passport.authenticate("google", {
        failureRedirect: `${FRONTEND_URL}/login`,
        successRedirect: `${FRONTEND_URL}/dashboard`,
    })
);

app.get("/login/sucess", async (req, res) => {
    if (req.user) {
        res.status(200).json({ message: "user Login", user: req.user });
    } else {
        res.status(400).json({ message: "Not Authorized" });
    }
});

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(FRONTEND_URL);
    });
});

app.listen(PORT, () => {
    console.log(`server start at port no ${PORT}`);
});
