import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import session from "express-session"

const app = express()
app.use(express.json())

const PORT = 3000
const SECRET = "yusufbhai"

app.use(session({
    secret: "yusufbhai",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60
     }
}))

const users = []

// ✅ REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password required"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    username,
    password: hashedPassword
  }

  users.push(user)   // ✅ IMPORTANT FIX

  res.json({ message: "User registered" });
});


// ✅ LOGIN
app.post("/login", async(req, res)=>{
    const {username, password} = req.body

    const user = users.find(u => u.username === username)
    if(!user) return res.status(400).json({message: "User not found"})
    
    const isMacth = await bcrypt.compare(password, user.password)
    if(!isMacth) return res.status(400).json({message: "Wrong password"})

    const token = jwt.sign(
        {userId: user.id, username: user.username},
        SECRET,
        {expiresIn: "1h"}
    )

    // ✅ session bhi store kar diya (extra secure layer)
    req.session.user = {
      id: user.id,
      username: user.username
    }

    res.json({
        message:"User login successfully"
    })

    console.log(res.session)
})


// ✅ MIDDLEWARE
const middleware = (req, res, next) =>{
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  }); 
}


// ✅ PROTECTED
app.get("/dashboard", middleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});