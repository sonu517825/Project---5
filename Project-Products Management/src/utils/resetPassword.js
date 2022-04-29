const crypto = require("crypto")


const PasswordToken = async function (req, res, next) {

    const resetToken = await crypto.randomBytes(20).toString("hex");
    const cryptoResetPasswordToken = await crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return { resetToken, cryptoResetPasswordToken, resetPasswordExpire }

}


module.exports.PasswordToken = PasswordToken

