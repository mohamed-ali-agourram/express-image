const protect = async (req, res, next) => {
    try {
        const user = req.session.user
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
    }
}

module.exports = protect;