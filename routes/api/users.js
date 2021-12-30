const express = require('express');
const router = express.Router();

const { User } = require("../../model");
const { authenticate } = require("../../middlewares");

router.get("/logout", authenticate, async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).send();
})

router.get("/current", authenticate, async (req, res) => {
    const {email, subscription} = req.user;
    res.json({
        user: {
            email,
            subscription
        }
    })
})

module.exports = router;