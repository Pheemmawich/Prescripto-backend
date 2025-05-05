import jwt from 'jsonwebtoken'

// admin authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        
        const {dtoken} = req.headers
        if(!dtoken){
            return res.json({success: false, message: 'Not Authorize Login Again no'})
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)

        console.log('token_decode', token_decode)
        console.log('req.body', req.body)
        console.log('req.user', req.user)
        if(!req.body){
            req.body = {}
        }
        req.body.docId = token_decode.id
        console.log('req.body', req.body)
        next()

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export default authDoctor