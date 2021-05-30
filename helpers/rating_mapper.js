module.exports = (rating, ratingDetails) => {
	if (ratingDetails.ratingPoint)
		rating.point = ratingDetails.ratingPoint;
	if (ratingDetails.ratingMessage)
		rating.message = ratingDetails.ratingMessage;
	if (ratingDetails.user)
		rating.user = ratingDetails.user;
	return rating;
}