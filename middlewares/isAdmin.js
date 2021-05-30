module.exports = (req, res, next) => {
	if (req.body.role === 'admin') {
		next()
	} else {
		return next({
			msg: "Sorry ! You don't Have access !",
			status: 400
		})
	}
}