//require npm install
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {    
    useUnifiedTopology: true
})