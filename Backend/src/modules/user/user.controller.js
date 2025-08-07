import { userModel } from "../../../db/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../../utilities/email/sendMail.js";



export const registerUser = async (req, res) => {
try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hashedPassword;

    const newUser = await userModel.insertMany(req.body);
    newUser[0].password = undefined;

    const token = jwt.sign({ email: req.body.email }, "ntiMail");

    await sendMail(req.body.email, token); 

    res.status(201).json({message: "Registered successfully, please confirm your email",user: newUser[0],});
} catch (error) {
    res.status(500).json({ message: "Registration failed", error });
}
};



export const loginUser = async (req, res) => {
const user = await userModel.findOne({ email: req.body.email });

if (!user)
    return res.status(400).json({ message: "Email or password incorrect" });

const match = bcrypt.compareSync(req.body.password, user.password);
if (!match)
    return res.status(400).json({ message: "Email or password incorrect" });

const token = jwt.sign( { _id: user._id, role: user.role }, "NTIG7");

res.status(200).json({message: `Welcome ${user.username}`,token,});
};



export const verifyAccount = async (req, res) => {
jwt.verify(req.params.token, "ntiMail", async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });

    await userModel.findOneAndUpdate({ email: decoded.email },{ isConfirmed: true });

    res.json({ message: "Account confirmed successfully" });
});
};

